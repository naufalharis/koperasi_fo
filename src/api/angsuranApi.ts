import { api } from "./axios";

export interface CreateAngsuranDto {
  pinjaman_id: string;
  tanggal_pembayaran: string;
  jumlah_pembayaran: number;
}

export interface UpdateAngsuranDto {
  tanggal_pembayaran?: string;
  jumlah_pembayaran?: number;
}

export const angsuranApi = {
  getAll: () => api.get("/angsuran"),
  getById: (id: string) => api.get(`/angsuran/${id}`),
  create: (data: CreateAngsuranDto) => api.post("/angsuran", data),
  update: (id: string, data: UpdateAngsuranDto) =>
    api.patch(`/angsuran/${id}`, data),
  delete: (id: string) => api.delete(`/angsuran/${id}`),
};
