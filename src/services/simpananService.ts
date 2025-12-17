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
}

export const simpananService = {
  getAll: async (): Promise<Simpanan[]> => {
    const res = await api.get("/kategori-simpanan");
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

  softDelete: async (id: string, deleted_by: string): Promise<Simpanan> => {
    const res = await api.delete(`/kategori-simpanan/${id}`, { data: { deleted_by } });
    return res.data;
  },

  forceDelete: async (id: string): Promise<Simpanan> => {
    const res = await api.delete(`/kategori-simpanan/force/${id}`);
    return res.data;
  },
};
