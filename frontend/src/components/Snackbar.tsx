import { Alert, Snackbar as MUISnackbar } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { hideNotification, selectNotification } from '../slices/notificationSlice';

export const Snackbar = () => {
    const dispatch = useAppDispatch();
    const { message, severity, open } = useAppSelector(selectNotification);

    const handleClose = () => {
        dispatch(hideNotification());
    };

    return (
        <MUISnackbar
            open={open}
            autoHideDuration={4000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            <Alert
                onClose={handleClose}
                severity={severity}
                variant="filled"
                sx={{
                    width: '100%',
                    '& .MuiAlert-message': {
                        fontSize: '0.95rem',
                    },
                }}
            >
                {message}
            </Alert>
        </MUISnackbar>
    );
};