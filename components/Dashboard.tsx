'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import {
    Assignment as AssignmentIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    HourglassEmpty as HourglassEmptyIcon,
    Event as EventIcon,
} from '@mui/icons-material';

import { useAuth } from '../app/context/auth_context';

const Dashboard = () => {
    // State untuk loading dan statistik
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total_submission: 0,
        submission_accepted: 0,
        submission_rejected: 0,
        submission_waiting: 0,
        total_schedule: 0,
    });

    const router = useRouter();
    const { user } = useAuth(); // Ambil data user dari context

    // Ambil data statistik dari backend
    const fetchStats = async () => {
        try {
            const res = await fetch('http://localhost:3002/submission/statistik', {
                credentials: 'include', // kirim cookie auth
            });
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Gagal mengambil data: ${res.status} ${res.statusText} - ${errorText}`);
            }
            const data = await res.json();
            setStats(data);
        } catch (error) {
            console.error('Gagal mengambil data dari server:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    // Jika belum login
    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-lg font-semibold">Anda belum login.</p>
            </div>
        );
    }

    // ⛔️ Validasi role: hanya ADMIN yang boleh akses dashboard ini
    if (user.role !== 'ADMIN') {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-lg font-semibold text-red-600">
                    Akses ditolak. Halaman ini hanya untuk Admin.
                </p>
            </div>
        );
    }

    // Tampilkan loading saat data belum siap
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-lg font-semibold">Loading...</p>
            </div>
        );
    }

    return (
        <div className="">
            <div className="mt-4 p-6 bg-white rounded-xl shadow-lg max-w-[1350px] mx-auto">
                <main className="flex-1">
                    <h1 className="text-2xl font-bold mb-4 text-black">
                        Halo Admin
                    </h1>

                    {/* Statistik card */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <StatCard
                            icon={<AssignmentIcon className="text-blue-600 mr-4" fontSize="large" />}
                            title="Total Pengajuan Sidang"
                            value={stats.total_submission}
                            bgColor="bg-blue-100"
                            textColor="text-blue-600"
                        />
                        <StatCard
                            icon={<CheckCircleIcon className="text-green-600 mr-4" fontSize="large" />}
                            title="Pengajuan Disetujui"
                            value={stats.submission_accepted}
                            bgColor="bg-green-100"
                            textColor="text-green-600"
                        />
                        <StatCard
                            icon={<CancelIcon className="text-red-600 mr-4" fontSize="large" />}
                            title="Pengajuan Ditolak"
                            value={stats.submission_rejected}
                            bgColor="bg-red-100"
                            textColor="text-red-600"
                        />
                        <StatCard
                            icon={<HourglassEmptyIcon className="text-yellow-600 mr-4" fontSize="large" />}
                            title="Pengajuan Menunggu"
                            value={stats.submission_waiting}
                            bgColor="bg-yellow-100"
                            textColor="text-yellow-600"
                        />
                        <StatCard
                            icon={<EventIcon className="text-purple-600 mr-4" fontSize="large" />}
                            title="Total Jadwal Sidang"
                            value={stats.total_schedule}
                            bgColor="bg-purple-100"
                            textColor="text-purple-600"
                        />
                    </div>

                    {/* Tombol navigasi */}
                    <div className="mt-6 flex space-x-4">
                        <button
                            onClick={() => router.push('/manajemen')}
                            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center hover:bg-blue-600"
                        >
                            <AssignmentIcon className="mr-2" /> Lihat Detail Pengajuan
                        </button>
                        <button
                            onClick={() => router.push('/jadwal/tambah')}
                            className="bg-green-500 text-white px-4 py-2 rounded flex items-center hover:bg-green-600"
                        >
                            <EventIcon className="mr-2" /> Tambah Jadwal Sidang
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
};

// Komponen kartu statistik
const StatCard = ({ icon, title, value, bgColor, textColor }: any) => (
    <div className={`${bgColor} p-4 rounded-lg shadow flex items-center`}>
        {icon}
        <div>
            <h3 className={`text-lg font-bold ${textColor}`}>{title}</h3>
            <p className={`text-xl ${textColor}`}>{value}</p>
        </div>
    </div>
);

export default Dashboard;
