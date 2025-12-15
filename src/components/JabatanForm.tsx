// src/components/JabatanForm.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api/axios";
import "./Jabatan.css";

export default function JabatanForm() {
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [nama, setNama] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!isEdit) return;
      setLoading(true);
      try {
        const res = await api.get(`/jabatan/${id}`);
        if (!mounted) return;
        const item = res.data?.data ?? res.data;
        setNama(item.nama ?? "");
      } catch (err: any) {
        console.error("Gagal memuat jabatan:", err);
        setError(err?.response?.data?.message || "Gagal memuat data");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [id, isEdit]);

  const validate = () => {
    if (!nama.trim()) return "Nama jabatan wajib diisi";
    if (nama.trim().length < 2) return "Nama terlalu pendek";
    return null;
  };

  const handleSave = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    const v = validate();
    if (v) { setError(v); return; }
    setSaving(true);
    try {
      if (isEdit) {
        await api.patch(`/jabatan/${id}`, { nama });
      } else {
        await api.post("/jabatan", { nama });
      }
      navigate("/jabatan");
    } catch (err: any) {
      console.error("Gagal menyimpan:", err);
      setError(err?.response?.data?.message || "Gagal menyimpan jabatan");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: 16 }}>Memuat...</div>;

  return (
    <div className="jb-root">
      <div className="jb-card" style={{ maxWidth: 680 }}>
        <div className="jb-header" style={{ alignItems: "center" }}>
          <h3>{isEdit ? "Edit Jabatan" : "Tambah Jabatan"}</h3>
          <div>
            <button className="btn" onClick={() => navigate(-1)} style={{ marginRight: 12 }}>Batal</button>
            <button className="btn btn-primary" onClick={() => handleSave()} disabled={saving}>
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </div>

        {error && <div className="jb-error">{error}</div>}

        <form className="jb-form" onSubmit={handleSave}>
          <label>
            <div className="label">Nama Jabatan</div>
            <input className="input" value={nama} onChange={(e) => setNama(e.target.value)} />
          </label>

          <div style={{ marginTop: 12 }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Buat Jabatan"}
            </button>
            <button type="button" className="btn btn-muted" onClick={() => navigate("/jabatan")} style={{ marginLeft: 8 }}>
              Kembali
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
