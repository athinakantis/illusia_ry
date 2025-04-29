import React, { useEffect, useState } from 'react';
import { Alert, LinearProgress, Box } from '@mui/material';
import { forwardRef } from 'react';

interface CustomSnackbarProps {
    message: string;
    variant: 'success' | 'error' | 'info' | 'warning';
    onClose: () => void; // Callback for when snackbar closes
}

export const CustomSnackbar = forwardRef<HTMLDivElement, CustomSnackbarProps>(
    ({ message, variant, onClose }, ref) => {
        const [progress, setProgress] = useState(0); // To track the progress of LinearProgress

        useEffect(() => {
            const timer = setInterval(() => {
                setProgress((prevProgress) => {
                    if (prevProgress === 100) {
                        clearInterval(timer); // Stop the progress once it reaches 100%
                        onClose(); // Call the onClose when the snackbar disappears
                        return 100; // Keep it at 100%
                    }
                    return Math.min(prevProgress + 1, 100); // Increment the progress
                });
            }, 20); // Update every 20ms (for smooth progress)

            return () => {
                clearInterval(timer); // Clean up interval if component is unmounted
            };
        }, [onClose]);

        return (
            <Alert
                ref={ref}
                severity={variant}
                variant="filled"
                sx={{
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    '& .MuiAlert-message': {
                        fontSize: '0.95rem',
                        width: '100%',
                    },

                }}
            >
                {message}
                <Box sx={{ width: '100%', mt: 1 }}>
                    <LinearProgress variant="determinate" value={progress} color="inherit" sx={{
                        width: '100%', // Make LinearProgress span the full width
                        height: 4, // Adjust the height of the progress bar
                    }} />
                </Box>
            </Alert>
        );
    }
);

CustomSnackbar.displayName = 'CustomSnackbar';
