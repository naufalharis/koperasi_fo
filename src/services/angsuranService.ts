import { angsuranApi } from "../api/angsuranApi";
import type { CreateAngsuranDto, UpdateAngsuranDto } from "../api/angsuranApi";

export const angsuranService = {
  getAll: async () => {
    const res = await angsuranApi.getAll();
    return res.data;
  },

  create: async (data: CreateAngsuranDto) => {
    const res = await angsuranApi.create(data);
    return res.data;
  },

  update: async (id: string, data: UpdateAngsuranDto) => {
    const res = await angsuranApi.update(id, data);
    return res.data;
  },

  delete: async (id: string) => {
    const res = await angsuranApi.delete(id);
    return res.data;
  },
};
