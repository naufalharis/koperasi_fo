import React, { useEffect, useState } from "react";
import type { Simpanan } from "../services/simpananService";
import { simpananService } from "../services/simpananService";
import "./Simpanan.css";

interface Props {
  onSuccess: () => void;
  editing: Simpanan | null;
  setEditing: (v: Simpanan | null) => void;
}

export default function SimpananForm({ onSuccess, editing, setEditing }: Props) {
  const [nama, setNama] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editing && editing.id) setNama(editing.nama);
    else setNama("");
  }, [editing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!nama.trim()) {
      setError("Nama wajib diisi");
      return;
    }
    setSaving(true);
    try {
      if (editing && editing.id) {
        await simpananService.update(editing.id, { nama: nama.trim() });
      } else {
        await simpananService.create({ nama: nama.trim() });
      }
      setNama("");
      onSuccess();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="sm-form-card">
      <form onSubmit={handleSubmit}>
        <div className="sm-form-row">
          <div style={{ flex: 1 }}>
            <label className="sm-label">Nama Kategori</label>
            <input className="sm-input" value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Contoh: Simpanan Wajib" />
            {error && <div className="sm-error" style={{ marginTop: 8 }}>{error}</div>}
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "end" }}>
            <button type="button" className="btn btn-ghost" onClick={() => { setEditing(null); setNama(""); }} disabled={saving}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Menyimpan..." : editing ? "Simpan" : "Buat"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
