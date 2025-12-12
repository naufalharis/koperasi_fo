import { tabunganApi } from "../api/tabunganApi";
import type {
  CreateTabunganDto,
  UpdateTabunganDto,
} from "../api/tabunganApi";

export const tabunganService = {
  getAll: async () => {
    const res = await tabunganApi.getAll();
    return res.data;
  },

  create: async (data: CreateTabunganDto) => {
    const res = await tabunganApi.create(data);
    return res.data;
  },

  update: async (id: string, data: UpdateTabunganDto) => {
    const res = await tabunganApi.update(id, data);
    return res.data;
  },

  delete: async (id: string) => {
    const res = await tabunganApi.delete(id);
    return res.data;
  },
};
