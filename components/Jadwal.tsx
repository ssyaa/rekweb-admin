'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Jadwal {
  id: string;
  student: {
    name: string;
    nim: string;
  };
  thesis_title: string;
  date: string;
  time: string;
  examiner_1: {
    name: string;
  };
  examiner_2: {
    name: string;
  };
  status: 'DISETUJUI' | 'DITOLAK' | 'MENUNGGU';
}

const JadwalSidang = () => {
  const [jadwal, setJadwal] = useState<Jadwal[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pdfData, setPdfData] = useState<string | null>(null);
  const router = useRouter();

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3002/submission', {
        credentials: 'include', // ⬅️ agar token JWT dari cookie dikirim
      });
      if (!response.ok) throw new Error('Gagal mengambil data');
      const data: Jadwal[] = await response.json();

      const filteredData = data.filter((item) => item.status === 'DISETUJUI');
      setJadwal(filteredData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    router.push('/jadwal/tambah'); // ⬅️ perbaikan path
  };

  const handleEdit = (id: string) => {
    router.push(`/jadwal/${id}`); // ⬅️ perbaikan path
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3002/submission/${id}`, {
        method: 'DELETE',
        credentials: 'include', // penting untuk guard backend
      });
      if (!response.ok) throw new Error('Gagal menghapus');
      setJadwal((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const columns: MRT_ColumnDef<Jadwal>[] = [
    {
      accessorFn: (row) => row.student.name,
      id: 'name',
      header: 'Nama',
    },
    {
      accessorFn: (row) => row.student.nim,
      id: 'nim',
      header: 'NIM',
    },
    { accessorKey: 'thesis_title', header: 'Judul Skripsi' },
    { accessorKey: 'date', header: 'Tanggal Sidang' },
    { accessorKey: 'time', header: 'Waktu Sidang' },
    {
      accessorFn: (row) => row.examiner_1?.name || '-',
      id: 'examiner_1',
      header: 'Dosen 1',
    },
    {
      accessorFn: (row) => row.examiner_2?.name || '-',
      id: 'examiner_2',
      header: 'Dosen 2',
    },
    {
      id: 'actions',
      header: 'Aksi',
      Cell: ({ row }) => (
        <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
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
    const headers = [
      'Nama',
      'NIM',
      'Judul Skripsi',
      'Tanggal Sidang',
      'Waktu Sidang',
      'Dosen 1',
      'Dosen 2',
    ];
    csvRows.push(headers.join(','));

    jadwal.forEach((item) => {
      const row = [
        item.student.name,
        item.student.nim,
        item.thesis_title,
        item.date,
        item.time,
        item.examiner_1?.name || '-',
        item.examiner_2?.name || '-',
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
    doc.text(`Tanggal: ${new Date().toLocaleDateString()}`, 14, 30); // ⬅️ perbaikan template string

    const header = [
      [
        'Nama',
        'NIM',
        'Judul Skripsi',
        'Tanggal Sidang',
        'Waktu Sidang',
        'Dosen 1',
        'Dosen 2',
      ],
    ];
    const data = jadwal.map((item) => [
      item.student.name,
      item.student.nim,
      item.thesis_title,
      item.date,
      item.time,
      item.examiner_1?.name || '-',
      item.examiner_2?.name || '-',
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

    const totalWidth = Object.values(columnStyles).reduce(
      (acc, style) => acc + style.cellWidth,
      0,
    );
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
      columnStyles,
      margin: { top: 40, left: marginLeft },
    });

    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    setPdfData(pdfUrl);
    setIsModalOpen(true);
  };

  const handleDownload = () => {
    if (pdfData) {
      const link = document.createElement('a');
      link.href = pdfData;
      link.download = 'jadwal_sidang.pdf';
      link.click();
      setIsModalOpen(false);
    }
  };

  return (
    <Box
      sx={{
        mt: 2,
        p: 3,
        marginX: 'auto',
        flexWrap: 'wrap',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: 3,
        maxWidth: '1350px',
        width: '100%',
      }}
    >
      <Typography variant="h4" className="text-black">
        Data Jadwal Sidang
      </Typography>
      <Box
        sx={{
          marginTop: '1rem',
          marginBottom: '2rem',
          display: 'flex',
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleAdd}
          sx={{ mr: 6 }}
        >
          Tambah Jadwal
        </Button>
        <Button
          variant="contained"
          color="warning"
          onClick={downloadCSV}
          sx={{ mr: 2 }}
        >
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
          <Button onClick={() => setIsModalOpen(false)} color="primary">
            Batal
          </Button>
          <Button onClick={handleDownload} color="primary">
            Unduh
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default JadwalSidang;
