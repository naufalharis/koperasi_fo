import { api } from "./axios";

export interface CreatePinjamanDto {
  id_anggota: string;
  id_jangka_waktu: string;
  jumlah: number;
  tanggal: string;
  tanggal_jatuh_tempo: string;
  status?: "LUNAS" | "BELUM_LUNAS";
}

export interface BayarAngsuranDto {
  id_angsuran: string;
  jumlah_pembayaran: number;
  tanggal_pembayaran: string;
}

// convert date → ISO
const toISO = (value: string) => value ? new Date(value).toISOString() : null;

export const pinjamanApi = {
  getAll: () => api.get("/pinjaman"),
  getById: (id: string) => api.get(`/pinjaman/${id}`),

  create: (data: CreatePinjamanDto) =>
    api.post("/pinjaman", {
      ...data,
      tanggal: toISO(data.tanggal),
      tanggal_jatuh_tempo: toISO(data.tanggal_jatuh_tempo),
    }),

  update: (id: string, data: any) =>
    api.put(`/pinjaman/${id}`, {
      ...data,
      tanggal: toISO(data.tanggal),
      tanggal_jatuh_tempo: toISO(data.tanggal_jatuh_tempo),
    }),

  cairkan: (id: string) => api.post(`/pinjaman/${id}/cair`),

  bayarAngsuran: (data: BayarAngsuranDto) =>
    api.post(`/pinjaman/angsuran/bayar`, {
      ...data,
      tanggal_pembayaran: toISO(data.tanggal_pembayaran),
    }),

  softDelete: (id: string) => api.delete(`/pinjaman/${id}`),
  hardDelete: (id: string) => api.delete(`/pinjaman/${id}/hard`),
  restore: (id: string) => api.post(`/pinjaman/${id}/restore`),
  trash: () => api.get("/pinjaman/trash/bin"),
};
