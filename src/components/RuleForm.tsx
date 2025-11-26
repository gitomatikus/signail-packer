import React, { useState, Component, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Rule, RuleType } from '../types/pack';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../quill-theme.css';

const Video = Quill.import('formats/video');
const Link = Quill.import('formats/link');

class CoustomVideo extends Video {


  static blotName = 'video';
  static className = 'ql-video';
  static tagName = 'DIV';

  create(value: string) {
    const node = super.create(value);

    const video = document.createElement('video')
    // video.setAttribute('controls', true);
    video.setAttribute('type', "video/mp4");
    video.setAttribute('style', "height: 200px; width: 100%");
    video.setAttribute('src', Link.sanitize(value));
    node.appendChild(video);

    return node;
  }

}



Quill.register('formats/video', CoustomVideo);

interface RuleFormProps {
  rules: Rule[];
  onRulesChange: (rules: Rule[]) => void;
  title: string;
  draftRule: Partial<Rule>;
  onDraftRuleChange: (rule: Partial<Rule>) => void;
}

const RuleForm: React.FC<RuleFormProps> = ({
  rules,
  onRulesChange,
  title,
  draftRule,
  onDraftRuleChange
}) => {

  function convertMediaTags(htmlString: string): string {
    const checkLength = Math.min(200, htmlString.length);
    const prefix = htmlString.substring(0, checkLength);

    if (prefix.includes('<img src="data:video')) {
      return htmlString.replace('<img', '<video controls autoplay');
    } else if (prefix.includes('<img src="data:audio')) {
      return htmlString.replace('<img', '<audio controls autoplay');
    } else {
      return htmlString;
    }
  }

  const handleAddRule = () => {
    if (draftRule.type && draftRule.content) {
      const ruleToAdd = {
        ...draftRule,
        content: convertMediaTags(draftRule.content),
      } as Rule;
      onRulesChange([...rules, ruleToAdd]);
      console.log('Rule added:', ruleToAdd);
      onDraftRuleChange({
        type: RuleType.Embedded,
        content: '',
        duration: 15,
      });
    }
  };

  const handleDeleteRule = (index: number) => {
    const updatedRules = rules.filter((_, i) => i !== index);
    onRulesChange(updatedRules);
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image', 'video'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
  ];

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        {title}
      </Typography>

      {/* Add Rule Form */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="body2" gutterBottom>
            Content
          </Typography>
          <Box sx={{
            maxHeight: '100px',
            width: '100%',
            overflow: 'auto',
            '& .ql-container': {
              maxHeight: '100px',
              width: '100%',
            },
            '& .ql-editor': {
              maxHeight: '100px',
              width: '100%',
            }
          }}>
            <ReactQuill
              theme="snow"
              value={draftRule.content || ''}
              onChange={(html) => onDraftRuleChange({ ...draftRule, content: html })}
              modules={modules}
              formats={formats}
            />
          </Box>

          <TextField
            fullWidth
            type="number"
            label="Duration (seconds)"
            value={draftRule.duration || 15}
            onChange={(e) => onDraftRuleChange({ ...draftRule, duration: parseInt(e.target.value) })}
          />

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddRule}
          >
            Add Rule
          </Button>
        </Box>
      </Paper>

      {/* Rules List */}
      <List>
        {rules.map((rule, index) => (
          <React.Fragment key={index}>
            <ListItem>
              <ListItemText
                primary={`${rule.type} Rule`}
                secondary={
                  <Box sx={{
                    maxHeight: '400px',
                    width: '100%',
                    overflow: 'auto',
                    '& img, & video': {
                      maxWidth: '100%',
                      height: 'auto'
                    }
                  }}>
                    Content: <div dangerouslySetInnerHTML={{ __html: rule.content || '' }} /><br />
                    Duration: {rule.duration}s
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  onClick={() => handleDeleteRule(index)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            {index < rules.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default RuleForm; 