import axios from "axios";
import type {
  KategoriJangkaWaktu,
  CreateKategoriJangkaWaktuDto,
  UpdateKategoriJangkaWaktuDto,
} from "../types/JangkaWaktu";

const api = axios.create({
  baseURL: "http://localhost:3000", // ganti sesuai backend kamu
});

export const kategoriJangkaWaktuApi = {
  getAll: async (): Promise<KategoriJangkaWaktu[]> => {
    const res = await api.get("/kategori-jangka-waktu");
    return res.data;
  },

  getById: async (id: string): Promise<KategoriJangkaWaktu> => {
    const res = await api.get(`/kategori-jangka-waktu/${id}`);
    return res.data;
  },

  create: async (data: CreateKategoriJangkaWaktuDto) => {
    const res = await api.post("/kategori-jangka-waktu", data);
    return res.data;
  },

  update: async (id: string, data: UpdateKategoriJangkaWaktuDto) => {
    const res = await api.patch(`/kategori-jangka-waktu/${id}`, data);
    return res.data;
  },

  softDelete: async (id: string) => {
    const res = await api.patch(`/kategori-jangka-waktu/${id}/soft`);
    return res.data;
  },

  hardDelete: async (id: string) => {
    const res = await api.delete(`/kategori-jangka-waktu/${id}/hard`);
    return res.data;
  },
};
