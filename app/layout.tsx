'use client'

import './globals.css';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation'; // Import usePathname
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebaseConfig';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function Layout({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const pathname = usePathname(); // Gunakan usePathname untuk mendapatkan path saat ini
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user); // Update state user jika login status berubah
        });
        return () => unsubscribe();
    }, []);

    const isLoginPage = pathname === '/'; // Cek apakah path adalah halaman login
    const isDashboardPage = pathname === '/dashboard'; // Cek apakah path adalah halaman dashboard
    const isManagementPage = pathname === '/manajemen'; // Cek apakah path adalah halaman manajemen
    const isJadwalPage = pathname === '/jadwal';
    const isSignUpPage = pathname === '/buat-akun-mahasiswa';

    const handleLogout = async () => {
        const confirmed = window.confirm("Apakah Anda yakin ingin logout?");
        if (confirmed) {
            await signOut(auth);
            router.push('/'); // Redirect ke halaman login setelah logout
        }
    };

    return (
        <html lang="en">
            <body className={isLoginPage ? 'bg-white' : 'bg-gray-100'}>
                {isLoginPage ? (
                    <main className="min-h-screen flex items-center justify-center p-6">
                        {children}
                    </main>
                ) : (
                    // Tampilkan sidebar hanya di halaman dashboard dan selain login
                    <>
                        <Header />
                        <div className="flex min-h-screen">
                            {(isDashboardPage || isManagementPage || isJadwalPage || isSignUpPage) && (
                                <Sidebar handleLogout={handleLogout} />
                            )}
                            <main className="flex-1 p-6">{children}</main>
                        </div>
                    </>
                )}
            </body>
        </html>
    );
}
