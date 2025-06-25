'use client';

import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Box, Typography, Alert, CircularProgress } from '@mui/material';
import { useAuth } from '../app/context/auth_context';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, error, loading } = useAuth();
    const [localError, setLocalError] = useState('');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null; // ⛔️ Jangan render sebelum client siap

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError('');

        if (!email || !password) {
            setLocalError('Email dan password tidak boleh kosong');
            return;
        }

        try {
            await login(email, password);
        } catch (err: any) {
            setLocalError(err.message || 'Login gagal');
        }
    };

    return (
        <Container
            maxWidth="xs"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    padding: 3,
                    borderRadius: 2,
                    boxShadow: 3,
                    backgroundColor: 'white',
                }}
            >
                <Typography
                    variant="h4"
                    textAlign="center"
                    color="primary"
                    gutterBottom
                    sx={{ fontFamily: 'Arial', fontWeight: 'bold' }}
                >
                    Login
                </Typography>

                {(error || localError) && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error || localError}
                    </Alert>
                )}

                <form
                    onSubmit={handleLogin}
                    style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                >
                    <TextField
                        label="Email"
                        variant="outlined"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        required
                    />
                    <TextField
                        label="Password"
                        variant="outlined"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        required
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={loading}
                        startIcon={loading && <CircularProgress size={20} />}
                        sx={{ fontWeight: 'bold' }}
                    >
                        {loading ? 'Loading...' : 'Login'}
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default Login;
