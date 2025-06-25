'use client';

import React, {
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react';
import { useRouter } from 'next/navigation';

type User = {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'MAHASISWA';
};

type AuthContextType = {
    user: User | null;
    loading: boolean;
    error: string;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:3002/auth/admin', {
                method: 'GET',
                credentials: 'include',
            });

            if (!res.ok) throw new Error('Belum login');

            const data = await res.json();
            setUser(data.user);
        } catch (err: any) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('http://localhost:3002/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Login gagal');

            setUser(data.user);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            const res = await fetch('http://localhost:3002/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });

            if (res.ok) {
                setUser(null); // kosongkan user
                router.push('/login'); // redirect ke login
            } else {
                console.error('Logout gagal:', await res.text());
            }
        } catch (err) {
            console.error('Error saat logout:', err);
        }
    };

    return (
        <AuthContext.Provider
            value={{ user, loading, error, login, logout, checkAuth }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
