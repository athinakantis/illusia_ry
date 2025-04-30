import { Box, Container, Typography, TextField, IconButton } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import IllusiaLogo from '../assets/logo-no-bg.png'; // You'll need to create this component for the logo

const Footer = () => {
    const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Handle newsletter subscription logic here
    };

    return (
        <Box
            component="footer"
            sx={{
                bgcolor: 'primary.main',
                color: 'white',
                py: 8,
                mt: 'auto', // Pushes footer to bottom if content is short
            }}
        >
            <Container maxWidth="lg">
                {/* Logo */}
                {/* <Typography
                    variant="h1"
                    sx={{
                        textAlign: 'center',
                        color: 'white',
                        fontSize: '2rem',
                        mb: 4,
                        mt: 2
                    }}
                >
                    ILLUSIA
                </Typography> */}
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <img
                        src={IllusiaLogo}
                        alt="Illusia Logo"
                        style={{ width: '200px', height: '200px' }}
                    />
                </Box>

                {/* Newsletter Section */}
                <Box
                    sx={{
                        maxWidth: 600,
                        mx: 'auto',
                        textAlign: 'center',
                        mb: 6
                    }}
                >
                    <Typography
                        variant="h2"
                        sx={{
                            fontSize: '1.5rem',
                            mt: 4,
                            mb: 3,
                            fontWeight: 400,
                            color: '#FFF'
                        }}
                    >
                        Subscribe to our newsletter to stay up-to-date with additions to our catalog and price discounts.
                    </Typography>

                    <Box
                        component="form"
                        onSubmit={handleSubscribe}
                        sx={{
                            display: 'flex',
                            gap: 1,
                            maxWidth: 440,
                            mx: 'auto',
                            bgcolor: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '24px',
                            p: 0.5,
                        }}
                    >
                        <TextField
                            placeholder="person@email.com"
                            variant="standard"
                            sx={{
                                flex: 1,
                                '& .MuiInput-root': {
                                    color: 'white',
                                    px: 2,
                                    '&:before, &:after': { display: 'none' },
                                },
                                '& .MuiInput-input::placeholder': {
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    opacity: 1,
                                },
                            }}
                        />
                        <IconButton
                            type="submit"
                            sx={{
                                bgcolor: 'primary.dark',
                                color: 'white',
                                '&:hover': {
                                    bgcolor: 'primary.dark',
                                    opacity: 0.9,
                                },
                            }}
                        >
                            <ArrowForwardIcon />
                        </IconButton>
                    </Box>
                </Box>

                {/* Logo and Copyright */}
                <Box sx={{ textAlign: 'center' }}>
                    {/* <IllusiaLogo sx={{ width: 48, height: 48, mb: 2 }} /> */}
                    <Typography
                        variant="body2"
                        sx={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '0.875rem'
                        }}
                    >
                        Copyright © 2025 Illusia ry
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;