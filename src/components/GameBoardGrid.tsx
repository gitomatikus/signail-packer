import React, { useState } from 'react';
import { Box, Typography, IconButton, TextField } from '@mui/material';
import { ChevronLeft, ChevronRight, Edit as EditIcon } from '@mui/icons-material';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { Round } from '../types/pack';
import ThemeRow from './ThemeRow';
import AddButton from './AddButton';

interface GameBoardGridProps {
    currentRound: Round;
    roundIndex: number;
    totalRounds: number;
    onPreviousRound: () => void;
    onNextRound: () => void;
    onRoundNameChange: (name: string) => void;
    onThemeNameChange: (themeIndex: number, name: string) => void;
    onQuestionClick: (themeIndex: number, questionIndex: number) => void;
    onAddQuestion: (themeIndex: number) => void;
    onDeleteTheme: (themeIndex: number) => void;
    onAddTheme: () => void;
    onDragEnd: (event: DragEndEvent) => void;
}

const GameBoardGrid: React.FC<GameBoardGridProps> = ({
    currentRound,
    roundIndex,
    totalRounds,
    onPreviousRound,
    onNextRound,
    onRoundNameChange,
    onThemeNameChange,
    onQuestionClick,
    onAddQuestion,
    onDeleteTheme,
    onAddTheme,
    onDragEnd,
}) => {
    const [isEditingName, setIsEditingName] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    return (
        <Box>
            {/* Round Navigation */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 4,
                    marginBottom: '32px',
                    padding: '20px',
                    background: 'rgba(19, 26, 54, 0.4)',
                    borderRadius: '16px',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                }}
            >
                <IconButton
                    onClick={onPreviousRound}
                    disabled={roundIndex === 0}
                    sx={{
                        color: '#8b5cf6',
                        '&:disabled': {
                            color: 'rgba(139, 92, 246, 0.3)',
                        },
                    }}
                >
                    <ChevronLeft fontSize="large" />
                </IconButton>

                {isEditingName ? (
                    <TextField
                        value={currentRound.name}
                        onChange={(e) => onRoundNameChange(e.target.value)}
                        onBlur={() => setIsEditingName(false)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                setIsEditingName(false);
                            }
                        }}
                        autoFocus
                        variant="standard"
                        inputProps={{
                            style: {
                                textAlign: 'center',
                                fontSize: '2.125rem',
                                fontWeight: 700,
                                background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 50%, #ec4899 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                width: '300px',
                            },
                        }}
                        sx={{
                            minWidth: '300px',
                            '& .MuiInput-underline:before': { borderBottomColor: 'rgba(139, 92, 246, 0.5)' },
                            '& .MuiInput-underline:after': { borderBottomColor: '#d946ef' },
                        }}
                    />
                ) : (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            cursor: 'pointer',
                            '&:hover .edit-icon': {
                                opacity: 1,
                            },
                        }}
                        onClick={() => setIsEditingName(true)}
                    >
                        <Typography
                            variant="h4"
                            sx={{
                                minWidth: '200px',
                                textAlign: 'center',
                                fontWeight: 700,
                                background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 50%, #ec4899 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                transition: 'transform 0.2s',
                            }}
                        >
                            {currentRound.name}
                        </Typography>
                        <IconButton
                            className="edit-icon"
                            size="small"
                            sx={{
                                opacity: 0.5,
                                transition: 'opacity 0.2s',
                                color: '#d946ef',
                            }}
                        >
                            <EditIcon />
                        </IconButton>
                    </Box>
                )}

                <IconButton
                    onClick={onNextRound}
                    sx={{
                        color: '#8b5cf6',
                    }}
                >
                    <ChevronRight fontSize="large" />
                </IconButton>
            </Box>

            {/* Themes Grid */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={onDragEnd}
            >
                <Box
                    sx={{
                        background: 'rgba(19, 26, 54, 0.3)',
                        borderRadius: '16px',
                        padding: '24px',
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                    }}
                >
                    {currentRound.themes.length === 0 ? (
                        <Box
                            sx={{
                                textAlign: 'center',
                                padding: '60px',
                                color: '#a8b2d1',
                            }}
                        >
                            <Typography variant="h6" sx={{ marginBottom: 2 }}>
                                No themes yet
                            </Typography>
                            <Typography variant="body2" sx={{ marginBottom: 3 }}>
                                Click the + button below to create your first theme
                            </Typography>
                        </Box>
                    ) : (
                        currentRound.themes.map((theme, themeIndex) => (
                            <ThemeRow
                                key={themeIndex}
                                theme={theme}
                                themeIndex={themeIndex}
                                onThemeNameChange={(name) => onThemeNameChange(themeIndex, name)}
                                onQuestionClick={(questionIndex) => onQuestionClick(themeIndex, questionIndex)}
                                onAddQuestion={() => onAddQuestion(themeIndex)}
                                onDeleteTheme={() => onDeleteTheme(themeIndex)}
                            />
                        ))
                    )}

                    {/* Add Theme Button */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            marginTop: '24px',
                            paddingLeft: '16px',
                        }}
                    >
                        <AddButton onClick={onAddTheme} size="large" label="Add Theme" />
                    </Box>
                </Box>
            </DndContext>
        </Box>
    );
};

export default GameBoardGrid;
