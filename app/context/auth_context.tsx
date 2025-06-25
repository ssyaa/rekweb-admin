'use client';

import React, {
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react';
import { useRouter } from 'next/navigation';

// Tipe user untuk autentikasi
type User = {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'MAHASISWA';
};

// Tipe AuthContext untuk menyimpan status autentikasi
type AuthContextType = {
    user: User | null;
    loading: boolean;
    error: string;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined); // membuat context kosong

// Provider untuk membungkus aplikasi dan memberikan akses ke context
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        checkAuth(); // cek autentikasi ketika komponen pertama kali muncul
    }, []);

    // Fungsi untuk mengecek apakah user sudah login atau belum
    const checkAuth = async () => {
        setLoading(true); // set loading saat cek autentikasi
        try {
            const res = await fetch('http://localhost:3002/auth/admin', {
                method: 'GET',
                credentials: 'include', // kirim session cookie
            });

            if (!res.ok) throw new Error('Belum login'); // jika gagal, user belum login

            const data = await res.json(); // ambil data user
            setUser(data.user); // simpan user ke state
        } catch (err: any) {
            setUser(null); // jika gagal, kosongkan user
        } finally {
            setLoading(false); // selesai loading
        }
    };

    // Fungsi login untuk user
    const login = async (email: string, password: string) => {
        setLoading(true); // set loading saat login
        setError(''); // reset error
        try {
            const res = await fetch('http://localhost:3002/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // kirim session cookie
                body: JSON.stringify({ email, password }), // kirim data login
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Login gagal'); // cek jika login gagal

            setUser(data.user); // simpan user ke state
            router.push('/dashboard'); // redirect ke dashboard
        } catch (err: any) {
            setError(err.message); // tampilkan error jika login gagal
            throw err; // lempar error ke komponen pemanggil
        } finally {
            setLoading(false); // selesai loading
        }
    };

    // Fungsi logout
    const logout = async () => {
        try {
            const res = await fetch('http://localhost:3002/auth/logout', {
                method: 'POST',
                credentials: 'include', // kirim session cookie
            });

            if (res.ok) {
                setUser(null); // kosongkan user
                router.push('/login'); // redirect ke login
            } else {
                console.error('Logout gagal:', await res.text());
            }
        } catch (err) {
            console.error('Error saat logout:', err); // tangani error saat logout
        }
    };

    return (
        // Berikan context ke seluruh aplikasi
        <AuthContext.Provider
            value={{ user, loading, error, login, logout, checkAuth }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook untuk menggunakan AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider'); // pastikan digunakan di dalam AuthProvider
    }
    return context;
};
