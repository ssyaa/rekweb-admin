'use client'

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../../lib/firebaseConfig';

interface Params {
  id: string; // Tipe untuk ID
}

interface EditJadwalProps {
  params: Promise<Params>; // Tipe untuk props
}

const EditJadwal = ({ params }: EditJadwalProps) => {
    const [jadwal, setJadwal] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [dosen, setDosen] = useState<string[]>([]);
    const router = useRouter(); // Inisialisasi router
  
    // Unwrap params
    const { id } = use(params); // Mengambil ID dari params
  
    useEffect(() => {
      const fetchJadwal = async () => {
        if (id) {
          const docRef = doc(db, 'jadwal_sidang', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setJadwal(docSnap.data());
          } else {
            console.log('No such document!');
          }
          setLoading(false);
        }
      };
  
      const fetchDosen = async () => {
        const dosenSnapshot = await getDocs(collection(db, 'dosen'));
        const dosenData = dosenSnapshot.docs.map((doc) => doc.data().nama);
        setDosen(dosenData);
      };
  
      fetchJadwal();
      fetchDosen();
    }, [id]);
  
    const handleUpdate = async () => {
      if (jadwal) {
        const docRef = doc(db, 'jadwal_sidang', id);
        await updateDoc(docRef, jadwal);
        router.push('/jadwal');  // Kembali ke halaman jadwal setelah update
      }
    };
  
    const handleCancel = () => {
      router.push('/jadwal'); // Kembali ke halaman jadwal
    };
  
    if (loading) return <div>Loading...</div>;
  
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Edit Jadwal Sidang</h1>
        <div className="mb-4">
          <label className="block font-medium text-gray-800 mb-1">Nama Mahasiswa:</label>
          <input
            type="text"
            className="border border-gray-300 p-2 rounded w-full text-gray-800"
            value={jadwal?.nama || ''}
            disabled
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium text-gray-800 mb-1">Judul Skripsi:</label>
          <input
            type="text"
            className="border border-gray-300 p-2 rounded w-full text-gray-800"
            value={jadwal?.judul_skripsi || ''}
            disabled
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium text-gray-800 mb-1">Tanggal Sidang:</label>
          <input
            type="date"
            className="border border-gray-300 p-2 rounded w-full text-gray-800"
            value={jadwal?.tanggal_sidang || ''}
            onChange={(e) => setJadwal({ ...jadwal, tanggal_sidang: e.target.value })}
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium text-gray-800 mb-1">Waktu Sidang:</label>
          <input
            type="time"
            className="border border-gray-300 p-2 rounded w-full text-gray-800"
            value={jadwal?.waktu_sidang || ''}
            onChange={(e) => setJadwal({ ...jadwal, waktu_sidang: e.target.value })}
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium text-gray-800 mb-1">Dosen 1:</label>
          <select
            className="border border-gray-300 p-2 rounded w-full text-gray-800"
            value={jadwal?.dosen_1 || ''}
            onChange={(e) => setJadwal({ ...jadwal, dosen_1: e.target.value })}
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
            value={jadwal?.dosen_2 || ''}
            onChange={(e) => setJadwal({ ...jadwal, dosen_2: e.target.value })}
          >
            <option value="">Pilih Dosen</option>
            {dosen.map((nama, index) => (
              <option key={index} value={nama}>
                {nama}
              </option>
            ))}
          </select>
        </div>
        <div className="flex space-x-4">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={handleUpdate}
          >
            Simpan Perubahan
          </button>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded"
            onClick={handleCancel}
          >
            Batal
          </button>
        </div>
      </div>
    );
  };
  
  export default EditJadwal;