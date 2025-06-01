'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../../../lib/firebaseConfig';

const TambahJadwal = () => {
  const [newJadwal, setNewJadwal] = useState({
    nama: '',
    nim: '',
    judul_skripsi: '',
    tanggal_sidang: '',
    waktu_sidang: '',
    dosen_1: '',
    dosen_2: '',
  });
  const [pengajuan, setPengajuan] = useState<any[]>([]);
  const [dosen, setDosen] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch data pengajuan dan dosen saat halaman diakses
  useState(() => {
    const fetchData = async () => {
      try {
        const pengajuanSnapshot = await getDocs(collection(db, 'pengajuan_sidang'));
        const pengajuanData = pengajuanSnapshot.docs
          .map((doc) => doc.data())
          .filter((item) => item.status === 'disetujui');
        setPengajuan(pengajuanData);

        const dosenSnapshot = await getDocs(collection(db, 'dosen'));
        const dosenData = dosenSnapshot.docs.map((doc) => doc.data().nama);
        setDosen(dosenData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  });

  const handleAdd = async () => {
    try {
        if (
            !newJadwal.nama ||
            !newJadwal.nim ||
            !newJadwal.judul_skripsi ||
            !newJadwal.tanggal_sidang ||
            !newJadwal.waktu_sidang ||
            !newJadwal.dosen_1 ||
            !newJadwal.dosen_2
          ) {
            setError('Semua kolom wajib diisi!');
            return;
          }

        await addDoc(collection(db, 'jadwal_sidang'), newJadwal);
        router.push('/jadwal'); // Redirect ke halaman utama jadwal
        } catch (error) {
          console.error('Error adding new jadwal:', error);
        }
  };

  const handleSelectMahasiswa = (nama: string) => {
    const selected = pengajuan.find((item) => item.nama === nama);
    if (selected) {
      setNewJadwal({
        ...newJadwal,
        nama: selected.nama,
        nim: selected.nim,
        judul_skripsi: selected.judul_skripsi,
      });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Tambah Jadwal Baru</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <div className="mb-4">
        <label className="block font-medium text-gray-800 mb-1">Nama Mahasiswa:</label>
        <select
          className="border border-gray-300 p-2 rounded w-full text-gray-800"
          onChange={(e) => handleSelectMahasiswa(e.target.value)}
          value={newJadwal.nama}
        >
          <option value="">Pilih Mahasiswa</option>
          {pengajuan.map((item) => (
            <option key={item.nim} value={item.nama}>
              {item.nama}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-medium text-gray-800 mb-1">Judul Skripsi:</label>
        <input
          type="text"
          className="border border-gray-300 p-2 rounded w-full text-gray-800"
          value={newJadwal.judul_skripsi}
          disabled
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium text-gray-800 mb-1">Tanggal Sidang:</label>
        <input
          type="date"
          className="border border-gray-300 p-2 rounded w-full text-gray-800"
          value={newJadwal.tanggal_sidang}
          onChange={(e) => setNewJadwal({ ...newJadwal, tanggal_sidang: e.target.value })}
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium text-gray-800 mb-1">Waktu Sidang:</label>
        <input
          type="time"
          className="border border-gray-300 p-2 rounded w-full text-gray-800"
          value={newJadwal.waktu_sidang}
          onChange={(e) => setNewJadwal({ ...newJadwal, waktu_sidang: e.target.value })}
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium text-gray-800 mb-1">Dosen 1:</label>
        <select
          className="border border-gray-300 p-2 rounded w-full text-gray-800"
          value={newJadwal.dosen_1}
          onChange={(e) => setNewJadwal({ ...newJadwal, dosen_1: e.target.value })}
        >
          <option value="">Pilih Dosen</option>
          {dosen.map((nama, index) => (
            <option key={index} value={nama}>
              {nama}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-medium text-gray-800 mb-1">Dosen 2:</label>
        <select
          className="border border-gray-300 p-2 rounded w-full text-gray-800"
          value={newJadwal.dosen_2}
          onChange={(e) => setNewJadwal({ ...newJadwal, dosen_2: e.target.value })}
        >
          <option value="">Pilih Dosen</option>
          {dosen.map((nama, index) => (
            <option key={index} value={nama}>
              {nama}
            </option>
          ))}
        </select>
      </div>
      <button
        className="bg-green-600 text-white px-4 py-2 rounded mr-2"
        onClick={handleAdd}
      >
        Tambah
      </button>
      <button
        className="bg-red-600 text-white px-4 py-2 rounded"
        onClick={() => router.push('/jadwal')}
      >
        Batal
      </button>
    </div>
  );
};

export default TambahJadwal;