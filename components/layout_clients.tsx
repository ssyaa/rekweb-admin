'use client';

import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/auth_context';
import { useEffect } from 'react';
import { CircularProgress } from '@mui/material';

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  // Cek apakah sedang di halaman tertentu
  const isLoginPage = pathname === '/';
  const isDashboardPage = pathname === '/dashboard';
  const isManagementPage = pathname === '/manajemen';
  const isJadwalPage = pathname === '/jadwal';
  const isSignUpPage = pathname === '/buat-akun-mahasiswa';
  const isExaminerForm = pathname === '/examiner';

  useEffect(() => {
    // Jika belum login dan buka halaman selain login, arahkan ke /
    if (!loading && !user && !isLoginPage) {
      router.push('/');
    }
  }, [user, loading, isLoginPage]);

  if (loading && !user && !isLoginPage) {
    // Loading spinner saat cek autentikasi
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className={isLoginPage ? 'bg-white' : 'bg-gray-100 min-h-screen'}>
      {isLoginPage ? (
        // Layout khusus untuk halaman login
        <main className="min-h-screen flex items-center justify-center p-6">
          {children}
        </main>
      ) : (
        <>
          <Header /> {/* Header global */}
          <div className="flex min-h-screen">
            {(isDashboardPage || isManagementPage || isJadwalPage || isSignUpPage || isExaminerForm) && (
              <Sidebar /> // Sidebar hanya muncul di halaman tertentu
            )}
            <main className="flex-1 p-6">{children}</main> {/* Konten utama */}
          </div>
        </>
      )}
    </div>
  );
}
