import { useEffect, useState } from "react";
import type { CreateKategoriJangkaWaktuDto } from "../types/JangkaWaktu";

interface Props {
  initialValue?: CreateKategoriJangkaWaktuDto;
  onSubmit: (data: CreateKategoriJangkaWaktuDto) => void;
  onCancel: () => void;
}

export default function KategoriJangkaWaktuForm({
  initialValue,
  onSubmit,
  onCancel,
}: Props) {
  const [nama, setNama] = useState("");

  useEffect(() => {
    if (initialValue) {
      setNama(initialValue.nama);
    }
  }, [initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ nama });
  };

  return (
    <div className="form-wrapper">
        <form onSubmit={handleSubmit}>
            <div className="form-group">
            <label>Nama</label>
            <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                required
            />
            </div>

            <div className="action-buttons mt-2">
            <button className="btn btn-primary" type="submit">Simpan</button>
            <button className="btn btn-secondary" type="button" onClick={onCancel}>
                Batal
            </button>
            </div>
        </form>
    </div>
  );
}
