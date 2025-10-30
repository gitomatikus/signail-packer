import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Container,
  Paper,
} from '@mui/material';
import { Pack } from '../types/pack';
import BasicInfoForm from './BasicInfoForm';
import RoundsForm from './RoundsForm';
import ReviewForm from './ReviewForm';
import { savePack, loadPack, initDB, clearStorage } from '../services/storage';

const steps = ['Basic Information', 'Rounds', 'Review'];

const PackForm: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [packData, setPackData] = useState<Pack>({
    author: '',
    name: '',
    rounds: [],
  });
  const [dbReady, setDbReady] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const saveTimeoutRef = useRef<number | null>(null);
  const latestPackRef = useRef(packData);

  // Initialize database
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        await initDB();
        setDbReady(true);
      } catch (error) {
        console.error('Error initializing database:', error);
        // Handle error appropriately, maybe show an error message to the user
      }
    };
    initializeDatabase();
  }, []); // Empty dependency array means this effect runs once on mount

  // Load saved pack data on component mount after DB is ready
  useEffect(() => {
    if (dbReady) {
      const loadSavedPack = async () => {
        try {
          const savedPack = await loadPack();
          if (savedPack) {
            setPackData(savedPack);
          }
        } catch (error) {
          console.error('Error loading saved pack:', error);
        }
      };
      loadSavedPack();
    }
  }, [dbReady]); // Depends on dbReady

  // Save pack data whenever it changes and DB is ready in a throttled manner
  useEffect(() => {
    if (!dbReady) {
      return;
    }

    if (!packData.name && !packData.author && packData.rounds.length === 0) {
      return;
    }

    if (saveTimeoutRef.current !== null) {
      window.clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = window.setTimeout(() => {
      savePack(packData).catch((error) => {
        console.error('Error saving pack:', error);
      });
      saveTimeoutRef.current = null;
    }, 500);

    return () => {
      if (saveTimeoutRef.current !== null) {
        window.clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [packData, dbReady]);

  useEffect(() => {
    latestPackRef.current = packData;
  }, [packData]);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current !== null) {
        window.clearTimeout(saveTimeoutRef.current);
        if (dbReady && (latestPackRef.current.name || latestPackRef.current.author || latestPackRef.current.rounds.length > 0)) {
          savePack(latestPackRef.current).catch((error) => {
            console.error('Error saving pack on unmount:', error);
          });
        }
        saveTimeoutRef.current = null;
      }
    };
  }, [dbReady]);

  const handleNext = () => {
    setActiveStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleBasicInfoSubmit = (data: { author: string; name: string }) => {
    setPackData((prev) => ({ ...prev, ...data }));
    handleNext();
  };

  const handleRoundsSubmit = (rounds: Pack['rounds']) => {
    setPackData((prev) => ({ ...prev, rounds }));
    handleNext();
  };

  const handleRoundsChange = useCallback((rounds: Pack['rounds']) => {
    setPackData((prev) => ({ ...prev, rounds }));
  }, []);

  const handleDownload = () => {
    const jsonString = JSON.stringify(packData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${packData.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleClearStorage = async () => {
    try {
      await clearStorage();
      window.location.reload();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const jsonData = JSON.parse(text);
      
      // Validate the JSON structure
      if (!jsonData.author || !jsonData.name || !Array.isArray(jsonData.rounds)) {
        throw new Error('Invalid pack JSON structure');
      }

      // Clear existing data and save new data
      await clearStorage();
      await savePack(jsonData);
      setPackData(jsonData);
      setActiveStep(0); // Reset to first step
    } catch (error) {
      console.error('Error loading JSON file:', error);
      alert('Error loading JSON file. Please make sure it\'s a valid pack JSON file.');
    }
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <BasicInfoForm onSubmit={handleBasicInfoSubmit} initialData={packData} />;
      case 1:
        return (
          <RoundsForm
            onSubmit={handleRoundsSubmit}
            initialData={packData.rounds}
            onRoundsChange={handleRoundsChange}
          />
        );
      case 2:
        return <ReviewForm packData={packData} onDownload={handleDownload} />;
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Create New Pack
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              ref={fileInputRef}
            />
            <Button
              variant="contained"
              onClick={() => fileInputRef.current?.click()}
            >
              Upload Pack
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleClearStorage}
            >
              Clear All Data
            </Button>
          </Box>
        </Box>
        <Typography variant="h4" gutterBottom>
          Create Pack
        </Typography>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {getStepContent(activeStep)}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            Back
          </Button>
          {activeStep === steps.length - 1 && (
            <Button
              variant="contained"
              onClick={handleDownload}
            >
              Download Pack
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default PackForm; 
