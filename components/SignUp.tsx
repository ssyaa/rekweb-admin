'use client';

import { useState } from 'react';
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

export const SignUpMahasiswa = () => {
  // State untuk menyimpan data form
  const [name, setName] = useState('');
  const [nim, setNim] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [studyProgram, setStudyProgram] = useState('');

  // State untuk validasi dan feedback pengguna
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validasi dasar
    if (!name || !nim || !email || !password || !confirmPassword) {
      setError('Semua field harus diisi.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Password tidak cocok.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password harus minimal 6 karakter.');
      setLoading(false);
      return;
    }

    // Proses pengiriman ke server
    try {
      const response = await fetch('http://localhost:3002/users/register', {
        credentials: 'include', // penting untuk membawa cookie jika diperlukan
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          nim,
          email,
          password,
          study_program: studyProgram,
          role: 'MAHASISWA', // role ditentukan langsung
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Gagal mendaftarkan user');
      }

      setDialogOpen(true); // tampilkan modal sukses
    } catch (err: any) {
      console.error('Gagal daftar:', err);
      setError(err.message || 'Terjadi kesalahan saat mendaftar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: '#f5f5f5', justifyContent: 'center', alignItems: 'center', pt: 2 }}>
      <Box sx={{ bgcolor: 'white', p: 4, borderRadius: 2, boxShadow: 3, width: '100%' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'left', color: 'black' }}>
          Daftar Akun Mahasiswa
        </Typography>

        {/* Tampilkan error jika ada */}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {/* Form pendaftaran */}
        <form onSubmit={handleSignUp}>
          <TextField
            fullWidth
            label="Nama"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="NIM"
            value={nim}
            onChange={(e) => setNim(e.target.value)}
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
          <TextField
            fullWidth
            label="Program Studi"
            value={studyProgram}
            onChange={(e) => setStudyProgram(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Konfirmasi Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? 'Mendaftarkan...' : 'Daftar'}
          </Button>
        </form>

        {/* Dialog konfirmasi pendaftaran sukses */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>
            Akun Mahasiswa Berhasil Dibuat
          </DialogTitle>
          <DialogContent>
            <Typography>Nama: {name}</Typography>
            <Typography>Email: {email}</Typography>
            <Typography>Password: {password}</Typography> {/*Tidak menampilkan password di produksi */}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setDialogOpen(false);
                router.push('/dashboard'); // navigasi ke dashboard
              }}
              variant="outlined"
              color="primary"
            >
              Kembali ke Dashboard
            </Button>
            <Button
              onClick={() => {
                setDialogOpen(false);
                // Reset form
                setName('');
                setNim('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setStudyProgram('');
                setError('');
              }}
              variant="contained"
              color="primary"
            >
              Buat Akun Lagi
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};
