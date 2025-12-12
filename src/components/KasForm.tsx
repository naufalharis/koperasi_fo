// src/components/KasForm.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api/axios";
import "./Kas.css";

interface KasPayload {
  nominal: number;
  tanggal: string;
  note?: string | null;
}

export default function KasForm() {
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [nominal, setNominal] = useState<number | "">("");
  const [tanggal, setTanggal] = useState<string>(""); // yyyy-mm-dd
  const [note, setNote] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    // helper: today in yyyy-mm-dd
    const todayYMD = () => {
      const d = new Date();
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    };

    async function load() {
      if (!isEdit) {
        // create: set tanggal to today and disable editing
        setTanggal(todayYMD());
        return;
      }

      setLoading(true);
      try {
        const res = await api.get(`/kas/${id}`);
        if (!mounted) return;
        const d = res.data;
        const item = d?.data ?? d;
        setNominal(item.nominal ?? "");
        // convert to yyyy-mm-dd for input[type=date]
        setTanggal(item.tanggal ? new Date(item.tanggal).toISOString().slice(0, 10) : todayYMD());
        setNote(item.note ?? "");
      } catch (err: any) {
        console.error("Error loading kas:", err);
        setError(err?.response?.data?.message || "Gagal memuat data kas");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [id, isEdit]);

  const validate = (): string | null => {
    if (!nominal || Number(nominal) <= 0) return "Nominal harus lebih besar dari 0";
    if (!tanggal) return "Tanggal wajib diisi";
    return null;
  };

  const handleSave = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setSaving(true);
    try {
      const payload: KasPayload = {
        nominal: Number(nominal),
        // keep tanggal as yyyy-mm-dd but send as ISO timestamp to backend
        tanggal: new Date(tanggal).toISOString(),
        note: note || null,
      };
      if (isEdit) {
        await api.patch(`/kas/${id}`, payload);
      } else {
        await api.post("/kas", payload);
      }
      navigate("/kas");
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: 16 }}>Memuat...</div>;

  // helper to format yyyy-mm-dd -> dd/mm/yyyy for display
  const fmtDisplay = (ymd?: string) => {
    if (!ymd) return "-";
    try {
      const d = new Date(ymd);
      const dd = String(d.getDate()).padStart(2, "0");
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const yyyy = d.getFullYear();
      return `${dd}/${mm}/${yyyy}`;
    } catch {
      return ymd;
    }
  };

  return (
    <div className="kas-root">
      <div className="kas-card" style={{ maxWidth: 720 }}>
        <div className="kas-header" style={{ alignItems: "center" }}>
          <h3>{isEdit ? "Edit Kas" : "Tambah Kas"}</h3>
          <div>
            <button className="btn" onClick={() => navigate(-1)} style={{ marginRight: 12 }}>Batal</button>
            <button className="btn btn-primary" onClick={() => handleSave()} disabled={saving}>
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </div>

        {error && <div className="kas-error">{error}</div>}

        <form className="kas-form" onSubmit={handleSave}>
          <label>
            <div className="label">Nominal</div>
            <input
              type="number"
              value={nominal}
              onChange={(e) => setNominal(e.target.value === "" ? "" : Number(e.target.value))}
              className="input"
              min={0}
            />
          </label>

          {/* tanggal tidak bisa diubah oleh user — tetap tampil sebagai disabled */}
          <label>
            <div className="label">Tanggal (otomatis — tidak dapat diubah)</div>
            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)} // kept for completeness but input is disabled
              className="input"
              disabled
            />
            <div style={{ marginTop: 6, fontSize: 13, color: "#6b7280" }}>
              Tanggal: <strong>{fmtDisplay(tanggal)}</strong>
            </div>
          </label>

          <label>
            <div className="label">Keterangan (note)</div>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} className="input" rows={4} />
          </label>

          <div style={{ marginTop: 12 }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Buat Kas"}
            </button>
            <button type="button" className="btn btn-muted" onClick={() => navigate("/kas")} style={{ marginLeft: 12 }}>
              Kembali
            </button>
          </div> 
        </form>
      </div>
    </div>
  )
}
