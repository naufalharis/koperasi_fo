import { api } from "./axios";

export interface CreatePinjamanDto {
  id_anggota: string;
  id_jangka_waktu: string;
  jumlah: number;
  tanggal: string; // from input date
  tanggal_jatuh_tempo: string; // from input date
  status?: "LUNAS" | "BELUM_LUNAS";
}

export interface BayarAngsuranDto {
  id_angsuran: string;
  jumlah_pembayaran: number;
  tanggal_pembayaran: string; // from input date
}

// helper untuk convert tanggal ke ISO
const toISO = (value: string) =>
  value ? new Date(value).toISOString() : null;

export const pinjamanApi = {
  getAll: () => api.get("/pinjaman"),

  getById: (id: string) => api.get(`/pinjaman/${id}`),

  // ✅ Auto convert tanggal → ISO sebelum dikirim
  create: (data: CreatePinjamanDto) =>
    api.post("/pinjaman", {
      ...data,
      tanggal: toISO(data.tanggal),
      tanggal_jatuh_tempo: toISO(data.tanggal_jatuh_tempo),
    }),

  cairkan: (id: string) => api.post(`/pinjaman/${id}/cair`),

  // ✅ Juga convert tanggal pembayaran → ISO
  bayarAngsuran: (data: BayarAngsuranDto) =>
    api.post(`/pinjaman/angsuran/bayar`, {
      ...data,
      tanggal_pembayaran: toISO(data.tanggal_pembayaran),
    }),
};
