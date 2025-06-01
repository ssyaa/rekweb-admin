'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

interface SidebarProps {
    handleLogout: () => Promise<void>;
}

export const Sidebar = ({ handleLogout }: SidebarProps) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const pathname = usePathname();

    useEffect(() => {
    const checkToken = () => {
        const token = localStorage.getItem('access_token');
        setIsLoggedIn(!!token);
    };

    checkToken(); // cek saat pertama kali

    // Dengarkan event custom "authChange"
    window.addEventListener('authChange', checkToken);

    return () => {
        window.removeEventListener('authChange', checkToken);
    };
}, []);

    const getActiveClass = (path: string) =>
        pathname === path
            ? 'bg-blue-700 text-white'
            : 'bg-transparent text-[#4b5563]';

    const getIconClass = (path: string) =>
        pathname === path ? 'text-white' : 'text-[#4b5563]';

    return (
        <aside className="w-[100px] h-[550px] bg-white p-4 border border-[#e5e7eb] flex flex-col items-center shadow-lg rounded-xl ml-4 mt-9">
            <nav>
                <ul className="list-none p-0 m-0 w-full space-y-6">
                    <li>
                        <Link href="/dashboard">
                            <div className={`flex flex-col items-center gap-1 p-3 hover:bg-gray-300 rounded-lg transition ${getActiveClass('/dashboard')}`}>
                                <DashboardIcon className={getIconClass('/dashboard')} fontSize="large" />
                                <span className="text-sm">Dashboard</span>
                            </div>
                        </Link>
                    </li>

                    <li>
                        <Link href="/manajemen">
                            <div className={`flex flex-col items-center gap-1 p-3 hover:bg-gray-300 rounded-lg transition ${getActiveClass('/manajemen')}`}>
                                <AssignmentIcon className={getIconClass('/manajemen')} fontSize="large" />
                                <span className="text-sm">Manajemen</span>
                            </div>
                        </Link>
                    </li>

                    <li>
                        <Link href="/jadwal">
                            <div className={`flex flex-col items-center gap-1 p-3 hover:bg-gray-300 rounded-lg transition ${getActiveClass('/jadwal')}`}>
                                <CalendarTodayIcon className={getIconClass('/jadwal')} fontSize="large" />
                                <span className="text-sm">Jadwal</span>
                            </div>
                        </Link>
                    </li>

                    <li>
                        <Link href="/buat-akun-mahasiswa">
                            <div className={`flex flex-col items-center gap-1 p-3 hover:bg-gray-300 rounded-lg transition ${getActiveClass('/buat-akun-mahasiswa')}`}>
                                <PersonAddIcon className={getIconClass('/buat-akun-mahasiswa')} fontSize="large" />
                                <span className="text-sm">Buat Akun</span>
                            </div>
                        </Link>
                    </li>

                    {/* Logout hanya muncul kalau user sudah login */}
                    {isLoggedIn && (
                        <li>
                            <button
                                onClick={handleLogout}
                                className="flex flex-col items-center gap-1 p-3 text-red-600 hover:text-red-800 hover:bg-gray-300 rounded-lg transition w-full"
                            >
                                <ExitToAppIcon fontSize="large" />
                                <span className="text-sm">Logout</span>
                            </button>
                        </li>
                    )}
                </ul>
            </nav>
        </aside>
    );
};
