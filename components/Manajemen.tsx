'use client';

import { useState, useEffect } from 'react';
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

import { fetch_submission, submission_approve, submission_rejected } from '../app/utils/api';

interface Pengajuan {
  id: string;
  thesis_title: string;
  status: 'MENUNGGU' | 'DISETUJUI' | 'DITOLAK';
  reason_rejected?: string;
  file_url: string;
  student: {
    name: string;
    nim: string;
  };
  thesis_schedule?: {
    date: string;
    time: string;
  };
}

export default function Manajemen() {
  const [pengajuan, setSubmission] = useState<Pengajuan[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('semua');
  const [selectedSubmission, setSelectedSubmission] = useState<Pengajuan | null>(null);
  const [rejectModal, setRejectModal] = useState<{ visible: boolean; item: Pengajuan | null }>({ visible: false, item: null });
  const [rejectReason, setRejectReason] = useState<string>('');

  const loadPengajuan = async () => {
    try {
      const data = await fetch_submission();
      setSubmission(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleApprove = async (item: Pengajuan) => {
    try {
      await submission_approve(item.id, item.file_url);
      loadPengajuan();
    } catch (error) {
      console.error(error);
    }
  };

  const handleReject = async () => {
    if (rejectReason && rejectModal.item) {
      try {
        await submission_rejected(rejectModal.item.id, rejectReason);
        loadPengajuan();
        setRejectModal({ visible: false, item: null });
        setRejectReason('');
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    loadPengajuan();
  }, []);

  const columns: MRT_ColumnDef<Pengajuan>[] = [
    {
      accessorFn: (row) => row.student.name,
      header: 'name',
    },
    {
      accessorFn: (row) => row.student.nim,
      header: 'NIM',
    },
    {
      accessorKey: 'thesis_title',
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
                status === 'DISETUJUI'
                  ? 'green'
                  : status === 'DITOLAK'
                  ? 'red'
                  : 'orange',
              color: 'white',
              borderRadius: '1rem',
              padding: '0.2rem 1rem',
            }}
          >
            {status === 'DISETUJUI' && <CheckCircleIcon />}
            {status === 'DITOLAK' && <CancelIcon />}
            {status === 'MENUNGGU' && <HourglassEmptyIcon />}
            {status === 'MENUNGGU'
              ? 'Menunggu Persetujuan'
              : status === 'DISETUJUI'
              ? 'Disetujui'
              : 'Ditolak'}
          </Box>
        );
      }
    },
    {
      id: 'actions',
      header: 'Aksi',
      Cell: ({ row }) => (
        <Box sx={{ display: 'flex', gap: '0.5rem' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setSelectedSubmission(row.original)}
          >
            Detail
          </Button>
          {row.original.status === 'MENUNGGU' && (
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
        p: 3,
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: 3,
        marginTop: '15px',
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
      {selectedSubmission && (
        <Dialog open={!!selectedSubmission} onClose={() => setSelectedSubmission(null)}>
          <DialogTitle>Detail Pengajuan</DialogTitle>
          <DialogContent>
            <Typography>name: {selectedSubmission.student?.name}</Typography>
            <Typography>NIM: {selectedSubmission.student?.nim}</Typography>
            <Typography>Judul: {selectedSubmission.thesis_title}</Typography>
            {selectedSubmission.status === 'DISETUJUI' && (
              <>
                <Typography>date Sidang: {selectedSubmission.thesis_schedule?.date || 'Belum ditentukan'}</Typography>
                <Typography>time Sidang: {selectedSubmission.thesis_schedule?.time || 'Belum ditentukan'}</Typography>
                {selectedSubmission.file_url ? (
                  <div className="mt-4">
                    <Typography>Berkas :</Typography>
                    <a
                      href={selectedSubmission.file_url}
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
            {selectedSubmission.status === 'DITOLAK' && (
              <Typography>Alasan: {selectedSubmission.reason_rejected}</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedSubmission(null)}>Tutup</Button>
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
