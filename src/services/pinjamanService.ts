import { pinjamanApi } from "../api/pinjamanApi";

export const pinjamanService = {
  // =====================
  // LIST SEMUA PINJAMAN
  // =====================
  async list() {
    const res = await pinjamanApi.getAll();
    return res.data;
  },

  // =====================
  // GET DETAIL PINJAMAN
  // =====================
  async get(id: string) {
    const res = await pinjamanApi.getById(id);
    return res.data;
  },

  // =====================
  // CREATE PINJAMAN
  // =====================
  async create(data: any) {
    const res = await pinjamanApi.create(data);
    return res.data;
  },

  // =====================
  // UPDATE PINJAMAN
  // =====================
  async update(id: string, data: any) {
    const res = await pinjamanApi.update(id, data);
    return res.data;
  },

  // =====================
  // CAIRKAN PINJAMAN
  // =====================
  async cairkan(id: string) {
    const res = await pinjamanApi.cairkan(id);
    return res.data;
  },

  // =====================
  // BAYAR ANGSURAN
  // =====================
  async bayarAngsuran(data: any) {
    const res = await pinjamanApi.bayarAngsuran(data);
    return res.data;
  },

  // =====================
  // SOFT DELETE
  // =====================
  async softDelete(id: string) {
    const res = await pinjamanApi.softDelete(id);
    return res.data;
  },

  // =====================
  // HARD DELETE
  // =====================
  async hardDelete(id: string) {
    const res = await pinjamanApi.hardDelete(id);
    return res.data;
  },

  // =====================
  // RESTORE DARI TRASH
  // =====================
  async restore(id: string) {
    const res = await pinjamanApi.restore(id);
    return res.data;
  },

  // =====================
  // LIST TRASH (SOFT DELETED)
  // =====================
  async trash() {
    const res = await pinjamanApi.trash();
    return res.data;
  },
};
