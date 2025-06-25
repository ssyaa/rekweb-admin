'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const TambahJadwal = () => {
  const router = useRouter();

  // State untuk menyimpan data form jadwal sidang
  const [form, setForm] = useState({
    id: '', // ID submission
    name: '', // Nama mahasiswa
    nim: '',  // NIM mahasiswa
    thesis_title: '', // Judul skripsi
    date: '', // Tanggal sidang
    time: '', // Jam sidang
    examiner_1_id: '', // Penguji 1
    examiner_2_id: '', // Penguji 2
  });

  // State untuk menampung data submission dan dosen penguji
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [examiners, setExaminers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch data saat pertama kali halaman dibuka
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Cek autentikasi pengguna
        const res = await fetch('http://localhost:3002/auth/me', {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Not authenticated');

        // Ambil data submission yang disetujui dan daftar dosen penguji
        const [res1, res2] = await Promise.all([
          fetch('http://localhost:3002/submission', { credentials: 'include' }),
          fetch('http://localhost:3002/examiner', { credentials: 'include' }),
        ]);

        const [data1, data2] = await Promise.all([res1.json(), res2.json()]);

        // Filter hanya submission yang statusnya DISETUJUI
        const approved = data1.filter((item: any) => item.status === 'DISETUJUI');
        setSubmissions(approved);
        setExaminers(data2);
      } catch (err) {
        console.error('Failed to load:', err);
        router.push('/login'); // Jika tidak login, redirect
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // Menyimpan jadwal sidang ke database
  const handleAdd = async () => {
    if (!form.id || !form.date || !form.time || !form.examiner_1_id || !form.examiner_2_id) {
      setError('All fields are required!');
      return;
    }

    try {
      const res = await fetch(`http://localhost:3002/submission/${form.id}/schedule`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          date: form.date,
          time: form.time,
          examiner_1_id: form.examiner_1_id,
          examiner_2_id: form.examiner_2_id,
        }),
      });

      if (!res.ok) throw new Error('Failed to update schedule');

      router.push('/jadwal'); //  Kembali ke halaman jadwal
    } catch (err) {
      console.error(err);
      setError('Failed to save schedule');
    }
  };

  // Saat user memilih mahasiswa, data lain seperti judul dan NIM langsung terisi
  const handleSelectSubmission = (id: string) => {
    const selected = submissions.find((item) => item.id === id);
    if (selected) {
      setForm({
        ...form,
        id: selected.id,
        name: selected.student.name,
        nim: selected.student.nim,
        thesis_title: selected.thesis_title,
      });
    }
  };

  // Loading state
  if (loading) return <p className="p-6 text-gray-700">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Add Thesis Schedule</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* PILIH MAHASISWA */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Student Name:</label>
        <select
          className="w-full border border-gray-300 rounded p-2"
          onChange={(e) => handleSelectSubmission(e.target.value)}
          value={form.id}
        >
          <option value="">Select Student</option>
          {submissions.map((item) => (
            <option key={item.id} value={item.id}>
              {item.student.name}
            </option>
          ))}
        </select>
      </div>

      {/* JUDUL SKRIPSI */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Thesis Title:</label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded p-2"
          value={form.thesis_title}
          disabled
        />
      </div>

      {/* TANGGAL & JAM SIDANG */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Date:</label>
        <input
          type="date"
          className="w-full border border-gray-300 rounded p-2"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Time:</label>
        <input
          type="time"
          className="w-full border border-gray-300 rounded p-2"
          value={form.time}
          onChange={(e) => setForm({ ...form, time: e.target.value })}
        />
      </div>

      {/* DOSEN PENGUJI */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Examiner 1:</label>
        <select
          className="w-full border border-gray-300 rounded p-2"
          value={form.examiner_1_id}
          onChange={(e) => setForm({ ...form, examiner_1_id: e.target.value })}
        >
          <option value="">Select Examiner</option>
          {examiners.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Examiner 2:</label>
        <select
          className="w-full border border-gray-300 rounded p-2"
          value={form.examiner_2_id}
          onChange={(e) => setForm({ ...form, examiner_2_id: e.target.value })}
        >
          <option value="">Select Examiner</option>
          {examiners.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      {/* TOMBOL */}
      <button
        className="bg-green-600 text-white px-4 py-2 rounded mr-2"
        onClick={handleAdd}
      >
        Add Schedule
      </button>
      <button
        className="bg-red-600 text-white px-4 py-2 rounded"
        onClick={() => router.push('/jadwal')}
      >
        Cancel
      </button>
    </div>
  );
};

export default TambahJadwal;
