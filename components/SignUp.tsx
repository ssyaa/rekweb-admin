'use client';

import { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebaseConfig';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  User,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
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
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // State untuk loading
  const [dialogOpen, setDialogOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isLoadingAuth, setIsLoadingAuth] = useState(true); // State untuk autentikasi
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push('/'); // Redirect ke halaman login jika tidak ada user
      } else {
        setIsLoadingAuth(false); // Sesi admin valid
      }
    });

    return () => unsubscribe(); // Bersihkan listener saat komponen dilepas
  }, [router]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!name || !email || !password || !confirmPassword) {
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
      setError('Password harus memiliki minimal 6 karakter.');
      setLoading(false);
      return;
    }

    try {
      const adminUser = auth.currentUser;
      if (!adminUser) {
        setError('Anda tidak login sebagai admin. Silakan login kembali.');
        setLoading(false);
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: name,
        email: email,
      });

      await auth.updateCurrentUser(adminUser);

      console.log('Berhasil login kembali sebagai admin.');

      setUserInfo({ name, email, password });
      setDialogOpen(true);
    } catch (err: any) {
      console.error('Error during sign up:', err);
      setError('Gagal membuat akun. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (isLoadingAuth) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: '#f5f5f5'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{bgcolor: '#f5f5f5', justifyContent: 'center', alignItems: 'center', pt: 2}}>
      <Box sx={{ bgcolor: 'white', p: 4, borderRadius: 2, boxShadow: 3, width: '100%' }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            color: 'black',
            fontWeight: 'bold',
            textAlign: 'left',
            paddingTop: '10px'
          }}
        >
          Daftar Akun Mahasiswa
        </Typography>
        <Box sx={{ borderRadius: 2, mb: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <form onSubmit={handleSignUp}>
            <Box sx={{ mb: 2 }}>
            <Typography sx={{ color: 'black' }}>Nama:</Typography>
              <TextField
                fullWidth
                label="Masukkan Nama"
                value={name}
                onChange={(e) => setName(e.target.value)}
                margin="normal"
                required
              />
              </Box>
              <Box sx={{ mb: 2 }}>
              <Typography sx={{ color: 'black' }}>Email:</Typography>
              <TextField
                fullWidth
                label="Masukkan Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
              />
              </Box>
              <Box sx={{ mb: 2 }}>
              <Typography sx={{ color: 'black' }}>Password:</Typography>
              <TextField
                fullWidth
                label="Masukkan Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
              />
              </Box>
              <Typography sx={{ color: 'black' }}>Konfirmasi Password:</Typography>
              <TextField
                fullWidth
                label="Konfirmasi ulang Password"
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
                {loading ? 'Loading...' : 'Daftar'}
              </Button>
            </form>
          </Box>

          <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
            <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>
              Akun Mahasiswa Berhasil Dibuat
            </DialogTitle>
            <DialogContent>
              <Typography>Nama: {userInfo.name}</Typography>
              <Typography>Email: {userInfo.email}</Typography>
              <Typography>Password: {userInfo.password}</Typography>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setDialogOpen(false); 
                  router.push('/dashboard');
                }}
                variant="outlined"
                color="primary"
              >
                Kembali ke Dashboard
              </Button>
              <Button
                onClick={() => {
                  setDialogOpen(false); 
                  setName(''); 
                  setEmail('');
                  setPassword('');
                  setConfirmPassword('');
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
