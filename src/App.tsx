import React, { useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import PackForm from './components/PackForm';
import './App.css';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App: React.FC = () => {
  useEffect(() => {
    // Stop all media elements when the page loads
    const stopAllMedia = () => {
      const mediaElements = document.querySelectorAll('video, audio');
      mediaElements.forEach((media) => {
        if (media instanceof HTMLMediaElement) {
          media.pause();
          media.currentTime = 0;
        }
      });
    };

    // Stop media on initial load
    stopAllMedia();

    // Also stop media when the page becomes visible again
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        stopAllMedia();
      }
    });

    return () => {
      document.removeEventListener('visibilitychange', stopAllMedia);
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <PackForm />
      </div>
    </ThemeProvider>
  );
};

export default App; 