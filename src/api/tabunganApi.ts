import { api } from "./axios";

export interface CreateTabunganDto {
  id_anggota: string;
  id_kategori_simpanan: string;
  tanggal: string;
  jumlah: number;
  note?: string;
}

export interface UpdateTabunganDto {
  id_anggota?: string;
  id_kategori_simpanan?: string;
  tanggal?: string;
  jumlah?: number;
  note?: string;
}

export const tabunganApi = {
  getAll: () => api.get("/tabungan"),
  getById: (id: string) => api.get(`/tabungan/${id}`),
  create: (data: CreateTabunganDto) => api.post("/tabungan", data),
  update: (id: string, data: UpdateTabunganDto) =>
    api.patch(`/tabungan/${id}`, data),
  delete: (id: string) => api.delete(`/tabungan/${id}`),
};
