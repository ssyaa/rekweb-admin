'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography,
    Alert,
    CircularProgress,
} from '@mui/material';
import { useAuth } from '../app/context/auth_context';

const ExaminerForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const router = useRouter();

    const { user, loading: authLoading, checkAuth } = useAuth();

    useEffect(() => {
        checkAuth();
    }, []);

    // Proteksi halaman untuk selain ADMIN
    useEffect(() => {
        if (!authLoading && user && user.role !== 'ADMIN') {
            router.replace('/unauthorized'); // arahkan ke halaman unauthorized
        }
    }, [authLoading, user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!name || !email) {
            setError('Nama dan email harus diisi.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:3002/examiner', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ name, email }),
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || 'Gagal menambahkan examiner');
            }

            setDialogOpen(true);
        } catch (err: any) {
            console.error('Gagal tambah:', err);
            setError(err.message || 'Terjadi kesalahan saat menambahkan.');
        } finally {
            setLoading(false);
        }
    };

    // Tampilkan loading global jika auth masih loading
    if (authLoading) {
        return (
            <Box sx={{ p: 4 }}>
                <Typography>Memeriksa sesi login...</Typography>
            </Box>
        );
    }

    // Tambahan fallback untuk user yang belum login (misalnya nge-bypass langsung URL)
    if (!user) {
        return (
            <Box sx={{ p: 4 }}>
                <Alert severity="error">Kamu belum login.</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ bgcolor: '#f5f5f5', justifyContent: 'center', alignItems: 'center', pt: 2 }}>
            <Box sx={{ bgcolor: 'white', p: 4, borderRadius: 2, boxShadow: 3, width: '100%' }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'left', color: 'black' }}>
                    Tambah Dosen Penguji
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Nama Dosen"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        margin="normal"
                        required
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        startIcon={loading && <CircularProgress size={20} />}
                        sx={{ mt: 2 }}
                    >
                        {loading ? 'Menyimpan...' : 'Simpan'}
                    </Button>
                </form>

                <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                    <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                        Dosen Penguji Berhasil Ditambahkan
                    </DialogTitle>
                    <DialogContent>
                        <Typography>Nama: {name}</Typography>
                        <Typography>Email: {email}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => {
                                setDialogOpen(false);
                                router.push('/jadwal');
                            }}
                            variant="outlined"
                            color="primary"
                        >
                            Kembali ke Jadwal
                        </Button>
                        <Button
                            onClick={() => {
                                setDialogOpen(false);
                                setName('');
                                setEmail('');
                                setError('');
                            }}
                            variant="contained"
                            color="primary"
                        >
                            Tambah Lagi
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
};

export default ExaminerForm;
