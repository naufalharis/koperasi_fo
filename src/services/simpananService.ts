// src/services/simpananService.ts
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export interface Simpanan {
  id: string;
  nama: string;
  deleted_at?: string | null;
  // tambahkan field lain jika perlu
}

export const simpananService = {
  // support includeDeleted flag -> akan meneruskan ?includeDeleted=true ke backend
  getAll: async (includeDeleted = false): Promise<Simpanan[]> => {
    const res = await api.get("/kategori-simpanan", { params: { includeDeleted } });
    return res.data;
  },

  getOne: async (id: string): Promise<Simpanan> => {
    const res = await api.get(`/kategori-simpanan/${id}`);
    return res.data;
  },

  create: async (payload: { nama: string }): Promise<Simpanan> => {
    const res = await api.post("/kategori-simpanan", payload);
    return res.data;
  },

  update: async (id: string, payload: { nama: string }): Promise<Simpanan> => {
    const res = await api.patch(`/kategori-simpanan/${id}`, payload);
    return res.data;
  },

  // soft-delete via PATCH (recommended)
  softDelete: async (id: string, deleted_by?: string): Promise<Simpanan> => {
    const res = await api.patch(`/kategori-simpanan/${id}/soft-delete`, { deleted_by });
    return res.data;
  },

  // restore (undo soft-delete)
  restore: async (id: string): Promise<Simpanan> => {
    const res = await api.patch(`/kategori-simpanan/${id}/restore`);
    return res.data;
  },

  // hard delete — gunakan route backend-mu; /kategori-simpanan/:id is typical
  forceDelete: async (id: string): Promise<any> => {
    const res = await api.delete(`/kategori-simpanan/${id}`);
    return res.data;
  },
};
