import React from 'react';
import { Box } from '@mui/material';
import { Question } from '../types/pack';

interface QuestionButtonProps {
    question?: Question;
    price: number;
    onClick: () => void;
    hasContent: boolean;
}

const QuestionButton: React.FC<QuestionButtonProps> = ({ question, price, onClick, hasContent }) => {
    return (
        <Box
            onClick={onClick}
            sx={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 50%, #ec4899 100%)',
                borderRadius: '12px',
                padding: '24px 32px',
                minWidth: '120px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: hasContent ? '2px solid rgba(255, 255, 255, 0.3)' : '2px solid transparent',
                opacity: hasContent ? 1 : 0.6,
                '&:hover': {
                    transform: 'translateY(-4px) scale(1.05)',
                    boxShadow: '0 8px 30px rgba(139, 92, 246, 0.6)',
                    border: '2px solid rgba(255, 255, 255, 0.5)',
                },
                '&:active': {
                    transform: 'translateY(-2px) scale(1.02)',
                },
            }}
        >
            <Box
                sx={{
                    fontSize: '32px',
                    fontWeight: 700,
                    color: '#ffffff',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                }}
            >
                {price}
            </Box>
        </Box>
    );
};

export default QuestionButton;
