import { useState } from 'react';
import {
    Container,
    Box,
    Typography,
    Button,
    Paper,
    ThemeProvider,
    createTheme,
    CssBaseline
} from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import tokens from './tokens';
import './App.css';

// Create a custom theme that uses our design tokens
const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: tokens['ds-color-components-button-primary'] || '#1976d2',
        },
    },
    typography: {
        fontFamily: 'Inter, Roboto, -apple-system, BlinkMacSystemFont, sans-serif',
    },
});

function App() {
    const [clicked, setClicked] = useState(false);

    const handleClick = () => {
        setClicked(true);
        setTimeout(() => setClicked(false), 2000);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="md">
                <Box
                    sx={{
                        minHeight: '100vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        py: 4,
                    }}
                >
                    <Paper
                        elevation={24}
                        sx={{
                            p: 6,
                            borderRadius: '12px',
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)',
                            textAlign: 'center',
                            maxWidth: 600,
                            width: '100%',
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                            },
                        }}
                    >
                        <Box
                            sx={{
                                mb: 4,
                                animation: 'float 3s ease-in-out infinite',
                                '@keyframes float': {
                                    '0%, 100%': { transform: 'translateY(0px)' },
                                    '50%': { transform: 'translateY(-10px)' },
                                },
                            }}
                        >
                            <RocketLaunchIcon
                                sx={{
                                    fontSize: 80,
                                    color: tokens['ds-color-components-button-primary'],
                                    filter: 'drop-shadow(0 4px 8px rgba(25, 118, 210, 0.3))',
                                }}
                            />
                        </Box>

                        <Typography
                            variant="h2"
                            component="h1"
                            gutterBottom
                            sx={{
                                fontWeight: 700,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                mb: 2,
                            }}
                        >
                            Welcome to MUI
                        </Typography>

                        <Typography
                            variant="h6"
                            color="text.secondary"
                            sx={{
                                mb: 4,
                                lineHeight: 1.6,
                                fontWeight: 400,
                            }}
                        >
                            A beautiful Material-UI application powered by design tokens from GitHub
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={handleClick}
                                startIcon={<RocketLaunchIcon />}
                                sx={{
                                    px: 4,
                                    py: 1.5,
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    borderRadius: tokens['components-button-primary-radius'] || '8px',
                                    textTransform: 'none',
                                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                                    background: clicked
                                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                        : tokens['ds-color-components-button-primary'],
                                    color: tokens['ds-color-button-text'] || '#ffffff',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    },
                                    '&:active': {
                                        transform: 'translateY(0px)',
                                    },
                                }}
                            >
                                {clicked ? '🎉 Launched!' : 'Get Started'}
                            </Button>

                            <Button
                                variant="outlined"
                                size="large"
                                sx={{
                                    px: 4,
                                    py: 1.5,
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    borderRadius: 'var(--ds-border-radius-md, 8px)',
                                    textTransform: 'none',
                                    borderWidth: 2,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        borderWidth: 2,
                                        transform: 'translateY(-2px)',
                                        backgroundColor: 'rgba(25, 118, 210, 0.04)',
                                    },
                                }}
                            >
                                Learn More
                            </Button>
                        </Box>

                        <Box
                            sx={{
                                mt: 6,
                                pt: 4,
                                borderTop: '1px solid rgba(0, 0, 0, 0.08)',
                            }}
                        >
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    fontStyle: 'italic',
                                    opacity: 0.7,
                                }}
                            >
                                Design tokens automatically synced from{' '}
                                <a
                                    href="https://github.com/jamesyoung-tech/tokens-test"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        color: tokens['ds-color-components-button-primary'],
                                        textDecoration: 'none',
                                        fontWeight: 500,
                                    }}
                                >
                                    tokens-test repository
                                </a>
                            </Typography>
                        </Box>
                    </Paper>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default App;
