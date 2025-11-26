import React, { useRef } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { Upload, Download, DeleteForever } from '@mui/icons-material';

interface PackHeaderProps {
    packName: string;
    author: string;
    onPackNameChange: (name: string) => void;
    onAuthorChange: (author: string) => void;
    onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onDownload: () => void;
    onClear: () => void;
}

const PackHeader: React.FC<PackHeaderProps> = ({
    packName,
    author,
    onPackNameChange,
    onAuthorChange,
    onUpload,
    onDownload,
    onClear,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px 32px',
                background: 'rgba(19, 26, 54, 0.6)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                borderRadius: '16px',
                marginBottom: '24px',
            }}
        >
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flex: 1 }}>
                <Typography variant="h5" className="gradient-text" sx={{ fontWeight: 700 }}>
                    Pack Creator
                </Typography>
                <TextField
                    label="Pack Name"
                    value={packName}
                    onChange={(e) => onPackNameChange(e.target.value)}
                    size="small"
                    sx={{ width: '250px' }}
                />
                <TextField
                    label="Author"
                    value={author}
                    onChange={(e) => onAuthorChange(e.target.value)}
                    size="small"
                    sx={{ width: '200px' }}
                />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
                <input
                    type="file"
                    accept=".json"
                    onChange={onUpload}
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                />
                <Button
                    variant="outlined"
                    startIcon={<Upload />}
                    onClick={() => fileInputRef.current?.click()}
                    size="small"
                >
                    Upload
                </Button>
                <Button
                    variant="outlined"
                    startIcon={<Download />}
                    onClick={onDownload}
                    size="small"
                >
                    Download
                </Button>
                <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteForever />}
                    onClick={onClear}
                    size="small"
                >
                    Clear
                </Button>
            </Box>
        </Box>
    );
};

export default PackHeader;
