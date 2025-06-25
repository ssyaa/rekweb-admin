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

  const isLoginPage = pathname === '/';
  const isDashboardPage = pathname === '/dashboard';
  const isManagementPage = pathname === '/manajemen';
  const isJadwalPage = pathname === '/jadwal';
  const isSignUpPage = pathname === '/buat-akun-mahasiswa';
  const isExaminerForm = pathname === '/examiner'

  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
      router.push('/');
    }
  }, [user, loading, isLoginPage]);

  if (loading && !user && !isLoginPage) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className={isLoginPage ? 'bg-white' : 'bg-gray-100 min-h-screen'}>
      {isLoginPage ? (
        <main className="min-h-screen flex items-center justify-center p-6">
          {children}
        </main>
      ) : (
        <>
          <Header />
          <div className="flex min-h-screen">
            {(isDashboardPage || isManagementPage || isJadwalPage || isSignUpPage || isExaminerForm) && (
              <Sidebar />
            )}
            <main className="flex-1 p-6">{children}</main>
          </div>
        </>
      )}
    </div>
  );
}
