import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Tabs,
    Tab,
    TextField,
    Typography,
} from '@mui/material';
import { Question, QuestionType, Rule, RuleType } from '../types/pack';
import { isContentEmpty } from '../utils/contentUtils';
import RuleForm from './RuleForm';


interface QuestionModalProps {
    open: boolean;
    question: Question | null;
    questionIndex: number;
    onSave: (question: Question) => void;
    onClose: () => void;
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
    return (
        <div role="tabpanel" hidden={value !== index}>
            {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
        </div>
    );
};

const QuestionModal: React.FC<QuestionModalProps> = ({
    open,
    question,
    questionIndex,
    onSave,
    onClose,
}) => {
    const [tabValue, setTabValue] = useState(0);
    const [formData, setFormData] = useState<Partial<Question>>({
        id: 0,
        type: QuestionType.Normal,
        price: {
            text: '100',
            correct: 100,
            incorrect: -100,
            random_range: 'null',
        },
        rules: [],
        after_round: [],
    });

    const [draftRule, setDraftRule] = useState<Partial<Rule>>({
        type: RuleType.Embedded,
        content: '',
        duration: 15,
    });
    const [draftAfterRound, setDraftAfterRound] = useState<Partial<Rule>>({
        type: RuleType.Embedded,
        content: '',
        duration: 15,
    });
    const [incorrectInputValue, setIncorrectInputValue] = useState<string>('-100');
    const [correctInputValue, setCorrectInputValue] = useState<string>('100');

    useEffect(() => {
        if (question) {
            setFormData(question);
            setIncorrectInputValue(question.price?.incorrect?.toString() || '0');
            setCorrectInputValue(question.price?.correct?.toString() || '0');
        } else {
            // New question - set default price based on index
            const defaultPrice = (questionIndex + 1) * 100;
            setFormData({
                id: Date.now(),
                type: QuestionType.Normal,
                price: {
                    text: defaultPrice.toString(),
                    correct: defaultPrice,
                    incorrect: -defaultPrice,
                    random_range: 'null',
                },
                rules: [],
                after_round: [],
            });
            setIncorrectInputValue((-defaultPrice).toString());
            setCorrectInputValue(defaultPrice.toString());
        }
        setTabValue(0);

        // Reset drafts
        setDraftRule({
            type: RuleType.Embedded,
            content: '',
            duration: 15,
        });
        setDraftAfterRound({
            type: RuleType.Embedded,
            content: '',
            duration: 15,
        });
    }, [question, questionIndex, open]);

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

    const handleSave = () => {
        // Auto-save drafts if they have content
        let currentRules = [...(formData.rules || [])];
        if (!isContentEmpty(draftRule.content)) {
            const ruleToAdd = {
                ...draftRule,
                content: convertMediaTags(draftRule.content!),
            } as Rule;
            currentRules.push(ruleToAdd);
        }

        let currentAfterRound = [...(formData.after_round || [])];
        if (!isContentEmpty(draftAfterRound.content)) {
            const ruleToAdd = {
                ...draftAfterRound,
                content: convertMediaTags(draftAfterRound.content!),
            } as Rule;
            currentAfterRound.push(ruleToAdd);
        }

        const updatedQuestion: Question = {
            ...formData,
            id: formData.id || Date.now(),
            type: formData.type || QuestionType.Normal,
            price: formData.price || {
                text: '100',
                correct: 100,
                incorrect: -100,
                random_range: 'null',
            },
            rules: currentRules,
            after_round: currentAfterRound,
        } as Question;

        onSave(updatedQuestion);
        onClose();
    };

    const handleRulesChange = (rules: Rule[]) => {
        setFormData({ ...formData, rules });
    };

    const handleAfterRoundChange = (rules: Rule[]) => {
        setFormData({ ...formData, after_round: rules });
    };



    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            PaperProps={{
                sx: {
                    background: 'rgba(19, 26, 54, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                },
            }}
        >
            <DialogTitle>
                <Typography variant="h6" className="gradient-text">
                    {question ? 'Edit Question' : 'New Question'} - {formData.price?.text || '100'} Points
                </Typography>
            </DialogTitle>

            <DialogContent>
                <Tabs
                    value={tabValue}
                    onChange={(e, newValue) => setTabValue(newValue)}
                    sx={{
                        borderBottom: 1,
                        borderColor: 'rgba(139, 92, 246, 0.3)',
                        marginBottom: 2,
                    }}
                >
                    <Tab label="Question" />
                    <Tab label="Answer" />
                    <Tab label="Price" />
                </Tabs>

                <TabPanel value={tabValue} index={0}>
                    <RuleForm
                        rules={formData.rules || []}
                        onRulesChange={handleRulesChange}
                        title="Question"
                        draftRule={draftRule}
                        onDraftRuleChange={setDraftRule}
                        buttonLabel="Add Question"
                    />
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                    <RuleForm
                        rules={formData.after_round || []}
                        onRulesChange={handleAfterRoundChange}
                        title="Answer"
                        draftRule={draftAfterRound}
                        onDraftRuleChange={setDraftAfterRound}
                        buttonLabel="Add Answer"
                    />
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Correct Points"
                            type="number"
                            value={correctInputValue}
                            onChange={(e) => {
                                const val = e.target.value;
                                setCorrectInputValue(val);
                                const parsed = parseInt(val);
                                if (!isNaN(parsed)) {
                                    setFormData({
                                        ...formData,
                                        price: {
                                            ...formData.price!,
                                            correct: parsed,
                                            text: val,
                                            incorrect: -parsed
                                        },
                                    });
                                    setIncorrectInputValue((-parsed).toString());
                                }
                            }}
                            onWheel={(e) => (e.target as HTMLInputElement).blur()}
                            fullWidth
                        />
                        <TextField
                            label="Price Text"
                            value={formData.price?.text || ''}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    price: { ...formData.price!, text: e.target.value },
                                })
                            }
                            fullWidth
                        />
                        <TextField
                            label="Incorrect Points"
                            type="number"
                            value={incorrectInputValue}
                            onChange={(e) => {
                                const val = e.target.value;
                                setIncorrectInputValue(val);
                                const parsed = parseInt(val);
                                if (!isNaN(parsed)) {
                                    setFormData({
                                        ...formData,
                                        price: { ...formData.price!, incorrect: parsed },
                                    });
                                }
                            }}
                            onWheel={(e) => (e.target as HTMLInputElement).blur()}
                            fullWidth
                        />
                    </Box>
                </TabPanel>
            </DialogContent>

            <DialogActions sx={{ padding: '16px 24px' }}>
                <Button onClick={onClose} variant="outlined">
                    Cancel
                </Button>
                <Button onClick={handleSave} variant="contained">
                    Save Question
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default QuestionModal;
