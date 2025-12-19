export interface KategoriJangkaWaktu {
  id: string;
  nama: string;
  created_at: string;
  deleted_at?: string | null;
}

export interface CreateKategoriJangkaWaktuDto {
  nama: string;
}

export interface UpdateKategoriJangkaWaktuDto {
  nama?: string;
}
