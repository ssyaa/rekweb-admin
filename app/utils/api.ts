export interface Submission {
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

// Fungsi untuk fetch semua Submission
export const fetch_submission = async (): Promise<Submission[]> => {
  const res = await fetch('http://localhost:3002/submission', {
    credentials: 'include', // untuk roles
  });
  if (!res.ok) {
    throw new Error('Gagal mengambil data Submission');
  }
  const data = await res.json();
  return data as Submission[];
};

// Fungsi untuk menyetujui Submission
export async function submission_approve(id: string, file_url?: string) {
  return await fetch(`http://localhost:3002/submission/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // // untuk roles
    body: JSON.stringify({ status: 'DISETUJUI', file_url }),
  });
}

// Fungsi untuk menolak Submission
export async function submission_rejected(id: string, reason: string) {
  return await fetch(`http://localhost:3002/submission/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // untuk roles
    body: JSON.stringify({ status: 'DITOLAK', reason_rejected: reason }),
  });
}


