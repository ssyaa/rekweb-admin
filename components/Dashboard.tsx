'use client';

import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { 
    Assignment as AssignmentIcon, 
    CheckCircle as CheckCircleIcon, 
    Cancel as CancelIcon, 
    HourglassEmpty as HourglassEmptyIcon, 
    Event as EventIcon 
} from '@mui/icons-material';

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('');
    const [totalPengajuan, setTotalPengajuan] = useState(0);
    const [pengajuanDisetujui, setPengajuanDisetujui] = useState(0);
    const [pengajuanDitolak, setPengajuanDitolak] = useState(0);
    const [pengajuanMenunggu, setPengajuanMenunggu] = useState(0);
    const [totalJadwal, setTotalJadwal] = useState(0);

    const router = useRouter();

    useEffect(() => {

        const fetchStats = async () => {
            try {
                const pengajuanSnapshot = await getDocs(collection(db, 'pengajuan_sidang'));
                const jadwalSnapshot = await getDocs(collection(db, 'jadwal_sidang'));

                let disetujui = 0;
                let ditolak = 0;
                let menunggu = 0;

                pengajuanSnapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data.status === 'disetujui') disetujui++;
                    else if (data.status === 'ditolak') ditolak++;
                    else if (data.status === 'menunggu persetujuan') menunggu++;
                });

                setTotalPengajuan(pengajuanSnapshot.size);
                setPengajuanDisetujui(disetujui);
                setPengajuanDitolak(ditolak);
                setPengajuanMenunggu(menunggu);
                setTotalJadwal(jadwalSnapshot.size);
            } catch (error) {
                console.error('Gagal mengambil data Firestore:', error);
            }
        };

        const init = async () => {
            await fetchStats();
            setLoading(false);
        };

        init();
    }, [router]);

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
                        Halo admin
                    </h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="bg-blue-100 p-4 rounded-lg shadow flex items-center">
                            <AssignmentIcon className="text-blue-600 mr-4" fontSize="large" />
                            <div>
                                <h3 className="text-lg font-bold text-blue-600">Total Pengajuan Sidang</h3>
                                <p className="text-xl text-blue-600">{totalPengajuan}</p>
                            </div>
                        </div>
                        <div className="bg-green-100 p-4 rounded-lg shadow flex items-center">
                            <CheckCircleIcon className="text-green-600 mr-4" fontSize="large" />
                            <div>
                                <h3 className="text-lg font-bold text-green-600">Pengajuan Disetujui</h3>
                                <p className="text-xl text-green-600">{pengajuanDisetujui}</p>
                            </div>
                        </div>
                        <div className="bg-red-100 p-4 rounded-lg shadow flex items-center">
                            <CancelIcon className="text-red-600 mr-4" fontSize="large" />
                            <div>
                                <h3 className="text-lg font-bold text-red-600">Pengajuan Ditolak</h3>
                                <p className="text-xl text-red-600">{pengajuanDitolak}</p>
                            </div>
                        </div>
                        <div className="bg-yellow-100 p-4 rounded-lg shadow flex items-center">
                            <HourglassEmptyIcon className="text-yellow-600 mr-4" fontSize="large" />
                            <div>
                                <h3 className="text-lg font-bold text-yellow-600">Pengajuan Menunggu</h3>
                                <p className="text-xl text-yellow-600">{pengajuanMenunggu}</p>
                            </div>
                        </div>
                        <div className="bg-purple-100 p-4 rounded-lg shadow flex items-center">
                            <EventIcon className="text-purple-600 mr-4" fontSize="large" />
                            <div>
                                <h3 className="text-lg font-bold text-purple-600">Total Jadwal Sidang</h3>
                                <p className="text-xl text-purple-600">{totalJadwal}</p>
                            </div>
                        </div>
                    </div>
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

export default Dashboard;
