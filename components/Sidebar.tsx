'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SchoolIcon from '@mui/icons-material/School'; // 🎓 Ikon untuk menu Examiner
import { useAuth } from '../app/context/auth_context';
import { useState } from 'react';

export const Sidebar = () => {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // ⬅️ Fungsi untuk memberi gaya aktif pada menu yang sedang dibuka
    const getActiveClass = (path: string) =>
        pathname === path
        ? 'bg-blue-700 text-white'
        : 'bg-transparent text-[#4b5563]';

    const getIconClass = (path: string) =>
        pathname === path ? 'text-white' : 'text-[#4b5563]';

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await logout(); // ⬅️ Logout dilakukan melalui context
        } catch (err) {
            console.error('Logout gagal:', err);
        } finally {
            setIsLoggingOut(false);
        }
    };

    if (!user) return null; // ⬅️ Sidebar hanya ditampilkan jika user sudah login

    return (
        <aside className="w-[100px] h-[650px] bg-white p-4 border border-[#e5e7eb] flex flex-col items-center shadow-lg rounded-xl ml-4 mt-9">
            <nav>
                <ul className="list-none p-0 m-0 w-full space-y-6">
                    {/* Menu Dashboard */}
                    <li>
                        <Link href="/dashboard">
                            <div className={`flex flex-col items-center gap-1 p-3 hover:bg-gray-300 rounded-lg transition ${getActiveClass('/dashboard')}`}>
                                <DashboardIcon className={getIconClass('/dashboard')} fontSize="large" />
                                <span className="text-sm">Dashboard</span>
                            </div>
                        </Link>
                    </li>

                    {/* Menu Manajemen Pengajuan */}
                    <li>
                        <Link href="/manajemen">
                            <div className={`flex flex-col items-center gap-1 p-3 hover:bg-gray-300 rounded-lg transition ${getActiveClass('/manajemen')}`}>
                                <AssignmentIcon className={getIconClass('/manajemen')} fontSize="large" />
                                <span className="text-sm">Manajemen</span>
                            </div>
                        </Link>
                    </li>

                    {/* Menu Buat Akun Mahasiswa */}
                    <li>
                        <Link href="/buat-akun-mahasiswa">
                            <div className={`flex flex-col items-center gap-1 p-3 hover:bg-gray-300 rounded-lg transition ${getActiveClass('/buat-akun-mahasiswa')}`}>
                                <PersonAddIcon className={getIconClass('/buat-akun-mahasiswa')} fontSize="large" />
                                <span className="text-sm">Buat Akun</span>
                            </div>
                        </Link>
                    </li>

                    {/* Menu Tambah Examiner */}
                    <li>
                        <Link href="/examiner">
                            <div className={`flex flex-col items-center gap-1 p-3 hover:bg-gray-300 rounded-lg transition ${getActiveClass('/examiner')}`}>
                                <SchoolIcon className={getIconClass('/examiner')} fontSize="large" />
                                <span className="text-sm">Examiner</span>
                            </div>
                        </Link>
                    </li>

                    {/* Menu Jadwal Sidang */}
                    <li>
                        <Link href="/jadwal">
                            <div className={`flex flex-col items-center gap-1 p-3 hover:bg-gray-300 rounded-lg transition ${getActiveClass('/jadwal')}`}>
                                <CalendarTodayIcon className={getIconClass('/jadwal')} fontSize="large" />
                                <span className="text-sm">Jadwal</span>
                            </div>
                        </Link>
                    </li>

                    {/* Tombol Logout */}
                    <li>
                        <button
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className={`flex flex-col items-center gap-1 p-3 rounded-lg transition w-full
                                ${isLoggingOut ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:text-red-800 hover:bg-gray-300'}`}
                        >
                            <ExitToAppIcon fontSize="large" />
                            <span className="text-sm">{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
                        </button>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};
