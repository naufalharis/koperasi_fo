// src/services/penarikanService.ts
import { api } from "../api/axios";

export interface Penarikan {
  id: string;
  id_anggota: string;
  id_tabungan: string;
  tanggal: string;
  jumlah: number;
  anggota?: { id: string; nama?: string };
  tabungan?: { id: string };
}

export const penarikanService = {
  create: async (payload: any) => {
    const res = await api.post("/penarikan", payload);
    return res.data;
  },

  getAll: async (): Promise<Penarikan[]> => {
    const res = await api.get("/penarikan");
    return res.data;
  },

  getOne: async (id: string): Promise<Penarikan> => {
    const res = await api.get(`/penarikan/${id}`);
    return res.data;
  },

  // new: try server-side filter, fallback to client-side filter
  getByAnggota: async (anggotaId: string): Promise<Penarikan[]> => {
    try {
      // try to ask server to filter if it supports query param
      const res = await api.get("/penarikan", { params: { anggotaId } });
      // server may return array or { data: [...] }
      return Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
    } catch (err) {
      // fallback: fetch all and filter on client
      const all = await penarikanService.getAll();
      return all.filter((p) => p.id_anggota === anggotaId);
    }
  },

  update: async (id: string, payload: any) => {
    const res = await api.patch(`/penarikan/${id}`, payload);
    return res.data;
  },

  remove: async (id: string) => {
    const res = await api.delete(`/penarikan/${id}`);
    return res.data;
  },
};
