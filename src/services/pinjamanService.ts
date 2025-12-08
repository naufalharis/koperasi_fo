import { pinjamanApi } from "../api/pinjamanApi";

export const pinjamanService = {
  async list() {
    const res = await pinjamanApi.getAll();
    return res.data;
  },

  async get(id: string) {
    const res = await pinjamanApi.getById(id);
    return res.data;
  },

  async create(data: any) {
    const res = await pinjamanApi.create(data);
    return res.data;
  },

  async cairkan(id: string) {
    const res = await pinjamanApi.cairkan(id);
    return res.data;
  },

  async bayarAngsuran(data: any) {
    const res = await pinjamanApi.bayarAngsuran(data);
    return res.data;
  },
};
