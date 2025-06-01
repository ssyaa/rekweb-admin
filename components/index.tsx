'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, TextField, Button, Box, Typography, Alert, CircularProgress } from '@mui/material';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:3001/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login gagal');
            }

            const token = data.access_token;
            localStorage.setItem('token', token);

            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="xs" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            <Box sx={{ width: '100%', padding: 3, borderRadius: 2, boxShadow: 3, backgroundColor: 'white' }}>
                <Typography variant="h4" textAlign="center" color='primary' gutterBottom sx={{ fontFamily: 'Arial', fontWeight: 'bold' }}>
                    Login
                </Typography>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
