import React from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
} from '@mui/material';
import { Pack } from '../types/pack';

interface ReviewFormProps {
  packData: Pack;
  onDownload: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ packData, onDownload }) => {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Review Pack
      </Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Basic Information
        </Typography>
        <Typography>Name: {packData.name}</Typography>
        <Typography>Author: {packData.author}</Typography>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Rounds and Themes
        </Typography>
        <List>
          {packData.rounds.map((round, roundIndex) => (
            <React.Fragment key={roundIndex}>
              <ListItem>
                <ListItemText
                  primary={round.name}
                  secondary={
                    <Box>
                      {round.themes.map((theme, themeIndex) => (
                        <Box key={themeIndex} sx={{ mt: 1 }}>
                          <Typography variant="body2">
                            Theme: {theme.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Description: {theme.description}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  }
                />
              </ListItem>
              {roundIndex < packData.rounds.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button variant="contained" onClick={onDownload}>
          Download JSON
        </Button>
      </Box>
    </Box>
  );
};

export default ReviewForm; 