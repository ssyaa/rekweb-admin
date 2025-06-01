'use client'

import { useState, useEffect } from 'react';
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import { collection, getDocs, doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebaseConfig';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

interface Pengajuan {
  id: string;
  nama: string;
  nim: string;
  judul_skripsi: string;
  status: string;
  alasan?: string;
  tanggal_sidang?: string;
  waktu_sidang?: string;
  berkas?: string;
}

export default function Manajemen() {
  const [pengajuan, setPengajuan] = useState<Pengajuan[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('semua');
  const [selectedPengajuan, setSelectedPengajuan] = useState<Pengajuan | null>(null);
  const [rejectModal, setRejectModal] = useState<{ visible: boolean; item: Pengajuan | null }>({ visible: false, item: null });
  const [rejectReason, setRejectReason] = useState<string>('');

  // Fetch data from Firestore
  const fetchPengajuan = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'pengajuan_sidang'));
  
      const pengajuanData: Pengajuan[] = await Promise.all(
        querySnapshot.docs.map(async (docSnapshot) => {
          const data = docSnapshot.data();
          let tanggalSidang = '';
          let waktuSidang = '';
  
          // Jika status disetujui, ambil data dari jadwal_sidang menggunakan ID dari pengajuan_sidang
          if (data.status === 'disetujui') {
            const jadwalDoc = await getDocs(collection(db, 'jadwal_sidang'));
            const jadwalData = jadwalDoc.docs
              .find((jadwal) => jadwal.id === docSnapshot.id)?.data();
            if (jadwalData) {
              tanggalSidang = jadwalData.tanggal_sidang || '';
              waktuSidang = jadwalData.waktu_sidang || '';
            }
          }
  
          return {
            id: docSnapshot.id,
            ...data,
            tanggal_sidang: tanggalSidang,
            waktu_sidang: waktuSidang,
          } as Pengajuan;
        })
      );
  
      setPengajuan(pengajuanData);
    } catch (error) {
      console.error('Error fetching documents: ', error);
    }
  };
  
  const handleApprove = async (item: Pengajuan) => {
    try {
      // Menggunakan ID dari pengajuan_sidang untuk dokumen jadwal_sidang
      await setDoc(doc(db, 'jadwal_sidang', item.id), {
        nama: item.nama,
        nim: item.nim,
        judul_skripsi: item.judul_skripsi,
        status: 'disetujui',
        tanggal_sidang: '', // Initialize empty values
        waktu_sidang: '',
        berkas: item.berkas || '',
      });
  
      await updateDoc(doc(db, 'pengajuan_sidang', item.id), { status: 'disetujui' });
  
      // Refresh data
      fetchPengajuan();
    } catch (error) {
      console.error('Error approving document: ', error);
    }
  };
  

  const handleReject = async () => {
    if (rejectReason && rejectModal.item) {
      try {
        await updateDoc(doc(db, 'pengajuan_sidang', rejectModal.item.id), {
          status: 'ditolak',
          alasan: rejectReason,
        });

        // Refresh data
        fetchPengajuan();
        setRejectModal({ visible: false, item: null });
        setRejectReason('');
      } catch (error) {
        console.error('Error rejecting document: ', error);
      }
    }
  };

  useEffect(() => {
    fetchPengajuan();
  }, []);

  const columns: MRT_ColumnDef<Pengajuan>[] = [
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
      accessorKey: 'status',
      header: 'Status',
      Cell: ({ cell }) => {
        const status = cell.getValue<string>();
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor:
                status === 'disetujui'
                  ? 'green'
                  : status === 'ditolak'
                  ? 'red'
                  : 'orange',
              color: 'white',
              borderRadius: '1rem',
              padding: '0.2rem 1rem',
            }}
          >
            {status === 'disetujui' && <CheckCircleIcon />}
            {status === 'ditolak' && <CancelIcon />}
            {status === 'menunggu persetujuan' && <HourglassEmptyIcon />}
            {status}
          </Box>
        );
      },
    },
    {
      id: 'actions',
      header: 'Aksi',
      Cell: ({ row }) => (
        <Box sx={{ display: 'flex', gap: '0.5rem' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setSelectedPengajuan(row.original)}
          >
            Detail
          </Button>
          {row.original.status === 'menunggu persetujuan' && (
            <>
              <Button
                variant="contained"
                color="success"
                onClick={() => handleApprove(row.original)}
              >
                Setujui
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => setRejectModal({ visible: true, item: row.original })}
              >
                Tolak
              </Button>
            </>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Box
      sx={{
        p: 3, // Padding di dalam kotak
        backgroundColor: 'white', // Background putih
        borderRadius: '8px', // Sudut tidak terlalu runcing
        boxShadow: 3, // Menambahkan bayangan untuk memberi efek kedalaman
        marginTop: '15px'
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ color: 'black' }}>
        Manajemen Pengajuan
      </Typography>
      <MaterialReactTable
        columns={columns}
        data={pengajuan.filter((item) =>
          filterStatus === 'semua' ? true : item.status === filterStatus
        )}
      />

      {/* Dialog untuk detail */}
      {selectedPengajuan && (
        <Dialog open={!!selectedPengajuan} onClose={() => setSelectedPengajuan(null)}>
          <DialogTitle>Detail Pengajuan</DialogTitle>
          <DialogContent>
            <Typography>Nama: {selectedPengajuan.nama}</Typography>
            <Typography>NIM: {selectedPengajuan.nim}</Typography>
            <Typography>Judul: {selectedPengajuan.judul_skripsi}</Typography>
            {selectedPengajuan.status === 'disetujui' && (
              <>
                <Typography>Tanggal Sidang: {selectedPengajuan.tanggal_sidang || 'Belum ditentukan'}</Typography>
                <Typography>Waktu Sidang: {selectedPengajuan.waktu_sidang || 'Belum ditentukan'}</Typography>
                {selectedPengajuan.berkas ? (
                  <div className="mt-4">
                    <Typography>Berkas :</Typography>
                    <a
                      href={selectedPengajuan.berkas}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      Unduh Berkas
                    </a>
                  </div>
                ) : (
                  <Typography>Berkas: Tidak ada berkas</Typography>
                )}
              </>
            )}
            {selectedPengajuan.status === 'ditolak' && (
              <Typography>Alasan: {selectedPengajuan.alasan}</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedPengajuan(null)}>Tutup</Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Dialog untuk alasan penolakan */}
      {rejectModal.visible && (
        <Dialog open={rejectModal.visible} onClose={() => setRejectModal({ visible: false, item: null })}>
          <DialogTitle>Alasan Penolakan</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRejectModal({ visible: false, item: null })}>Batal</Button>
            <Button onClick={handleReject} color="error">
              Tolak
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}
