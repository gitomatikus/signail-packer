import React, { useState } from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { Theme } from '../types/pack';
import QuestionButton from './QuestionButton';
import AddButton from './AddButton';

interface ThemeRowProps {
    theme: Theme;
    onThemeNameChange: (name: string) => void;
    onQuestionClick: (questionIndex: number) => void;
    onAddQuestion: () => void;
    onDeleteTheme: () => void;
}

const ThemeRow: React.FC<ThemeRowProps> = ({
    theme,
    onThemeNameChange,
    onQuestionClick,
    onAddQuestion,
    onDeleteTheme,
}) => {
    const [isEditingName, setIsEditingName] = useState(false);

    // Standard prices for questions
    const standardPrices = [100, 200, 300, 400, 500];

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                padding: '16px',
                background: 'rgba(19, 26, 54, 0.4)',
                borderRadius: '12px',
                marginBottom: '12px',
                border: '1px solid rgba(139, 92, 246, 0.15)',
                '&:hover': {
                    background: 'rgba(19, 26, 54, 0.6)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                },
            }}
        >
            {/* Theme Name */}
            <Box
                sx={{
                    minWidth: '200px',
                    maxWidth: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                }}
            >
                {isEditingName ? (
                    <TextField
                        value={theme.name}
                        onChange={(e) => onThemeNameChange(e.target.value)}
                        onBlur={() => setIsEditingName(false)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                setIsEditingName(false);
                            }
                        }}
                        autoFocus
                        size="small"
                        fullWidth
                        sx={{
                            '& .MuiInputBase-input': {
                                color: '#ffffff',
                                fontWeight: 500,
                            },
                        }}
                    />
                ) : (
                    <Box
                        onClick={() => setIsEditingName(true)}
                        sx={{
                            cursor: 'pointer',
                            color: '#ffffff',
                            fontWeight: 500,
                            fontSize: '16px',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            flex: 1,
                            '&:hover': {
                                background: 'rgba(139, 92, 246, 0.2)',
                            },
                        }}
                    >
                        {theme.name || 'Unnamed Theme'}
                    </Box>
                )}
                <IconButton
                    onClick={onDeleteTheme}
                    size="small"
                    sx={{
                        color: '#ef4444',
                        '&:hover': {
                            background: 'rgba(239, 68, 68, 0.2)',
                        },
                    }}
                >
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </Box>

            {/* Questions Grid */}
            <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                    flex: 1,
                    flexWrap: 'wrap',
                }}
            >
                {standardPrices.map((price, index) => {
                    const question = theme.questions[index];
                    const hasContent = !!(question && ((question.rules && question.rules.length > 0) || (question.after_round && question.after_round.length > 0)));

                    return (
                        <QuestionButton
                            key={index}
                            question={question}
                            price={price}
                            onClick={() => onQuestionClick(index)}
                            hasContent={hasContent}
                        />
                    );
                })}

                {/* Add Question Button */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AddButton onClick={onAddQuestion} size="medium" label="Add Question" />
                </Box>
            </Box>
        </Box>
    );
};

export default ThemeRow;
