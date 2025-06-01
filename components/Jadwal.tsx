'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth } from 'firebase/auth';
import { db } from '../lib/firebaseConfig';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const JadwalSidang = () => {
  const [jadwal, setJadwal] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pdfData, setPdfData] = useState<string | null>(null);

  const router = useRouter();

  // Fetch data from Firebase
  useEffect(() => {
    const fetchData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        try {
          const jadwalSnapshot = await getDocs(collection(db, 'jadwal_sidang'));
          const jadwalData = jadwalSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setJadwal(jadwalData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };

    fetchData();
  }, []);

  const handleAdd = async () => {
    router.push(`/jadwal/tambah`);
  };

  const handleEdit = (id: string) => {
    router.push(`/jadwal/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'jadwal_sidang', id));
      setJadwal((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error deleting jadwal:', error);
    }
  };

  const columns: MRT_ColumnDef<any>[] = [
    {
      accessorKey: 'nama',
      header: 'Nama',
    },
    {
      accessorKey: 'nim',
      header: 'NIM',
    },
    {
      accessorKey: 'judul_skripsi',
      header: 'Judul Skripsi',
    },
    {
      accessorKey: 'tanggal_sidang',
      header: 'Tanggal Sidang',
    },
    {
      accessorKey: 'waktu_sidang',
      header: 'Waktu Sidang',
    },
    {
      accessorKey: 'dosen_1',
      header: 'Dosen 1',
    },
    {
      accessorKey: 'dosen_2',
      header: 'Dosen 2',
    },
    {
      id: 'actions',
      header: 'Aksi',
      Cell: ({ row }) => (
        <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center', }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleEdit(row.original.id)}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDelete(row.original.id)}
          >
            Hapus
          </Button>
        </Box>
      ),
    },
  ];

  const downloadCSV = () => {
    const csvRows = [];
    const headers = ['Nama', 'NIM', 'Judul Skripsi', 'Tanggal Sidang', 'Waktu Sidang', 'Dosen 1', 'Dosen 2'];
    csvRows.push(headers.join(','));

    jadwal.forEach(item => {
      const row = [
        item.nama,
        item.nim,
        item.judul_skripsi,
        item.tanggal_sidang,
        item.waktu_sidang,
        item.dosen_1,
        item.dosen_2
      ];
      csvRows.push(row.join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'jadwal_sidang.csv');
    a.click();
  };

  const downloadPDF = () => {
    const doc = new jsPDF('landscape');

    doc.setFontSize(18);
    doc.text('Jadwal Sidang', 14, 20);
    doc.setFontSize(12);
    doc.text(`Tanggal: ${new Date().toLocaleDateString()}`, 14, 30);

    const header = [['Nama', 'NIM', 'Judul Skripsi', 'Tanggal Sidang', 'Waktu Sidang', 'Dosen 1', 'Dosen 2']];
    const data = jadwal.map(item => [
      item.nama,
      item.nim,
      item.judul_skripsi,
      item.tanggal_sidang,
      item.waktu_sidang,
      item.dosen_1,
      item.dosen_2
    ]);

    const columnStyles = {
      0: { cellWidth: 30 },
      1: { cellWidth: 30 },
      2: { cellWidth: 50 },
      3: { cellWidth: 30 },
      4: { cellWidth: 30 },
      5: { cellWidth: 50 },
      6: { cellWidth: 50 },
    };

    const totalWidth = Object.values(columnStyles).reduce((acc, style) => acc + style.cellWidth, 0);
    const pageWidth = doc.internal.pageSize.getWidth();
    const marginLeft = (pageWidth - totalWidth) / 2;

    autoTable(doc, {
      head: header,
      body: data,
      theme: 'grid',
      headStyles: {
        fillColor: [22, 160, 133],
        textColor: [255, 255, 255],
        fontSize: 12,
        halign: 'center',
      },
      styles: {
        cellPadding: 5,
        fontSize: 10,
        halign: 'left',
        valign: 'middle',
        overflow: 'linebreak',
      },
      columnStyles: columnStyles,
      margin: { top: 40, left: marginLeft },
    });

    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    setPdfData(pdfUrl);
    setIsModalOpen(true);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfData || '';
    link.download = 'jadwal_sidang.pdf';
    link.click();
    setIsModalOpen(false); 
  };

  return (
    <Box sx={{
      mt: 2,
      p: 3, 
      marginX: 'auto', 
      flexWrap: 'wrap',
      backgroundColor: 'white', 
      borderRadius: '8px', // Membuat sudut lebih lembut
      boxShadow: 3, // Memberikan bayangan ringan pada kotak
      maxWidth: '1350px',  // Maksimal lebar kotak agar tidak melebihi 1200px
      width: '100%',       // Lebar 100% agar responsif
    }}>
      <Typography variant="h4" className="text-black">Data Jadwal Sidang</Typography>
      <Box sx={{ marginTop: '1rem', marginBottom: '2rem', display: 'flex' }}>
        <Button variant="contained" color="primary" onClick={handleAdd} sx={{ mr: 6 }}>
          Tambah Jadwal
        </Button>
        <Button variant="contained" color="warning" onClick={downloadCSV} sx={{ mr: 2 }}>
          Unduh CSV
        </Button>
        <Button variant="contained" color="success" onClick={downloadPDF}>
          Unduh PDF
        </Button>
      </Box>

      <MaterialReactTable
        columns={columns}
        data={jadwal}
        enableColumnFilters
        enablePagination
        enableSorting
      />

      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogTitle>Unduh PDF Jadwal Sidang</DialogTitle>
        <DialogContent>
          <Typography>Apakah Anda ingin mengunduh PDF?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)} color="primary">Batal</Button>
          <Button onClick={handleDownload} color="primary">Unduh</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default JadwalSidang;
