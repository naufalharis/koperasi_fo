// src/components/AnggotaEdit.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api/axios";
import "./RegisterPage.css"; // reuse styles for form

interface Jabatan { id: string; nama: string; }

interface AnggotaPayload {
    id: string;
    nama: string;
    email: string;
    alamat?: string | null;
    no_hp?: string | null;
    id_jabatan?: string | null;
}

export default function AnggotaEdit() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [globalError, setGlobalError] = useState<string | null>(null);

    const [nama, setNama] = useState("");
    const [email, setEmail] = useState("");
    const [alamat, setAlamat] = useState("");
    const [noHp, setNoHp] = useState("");
    const [jabatanId, setJabatanId] = useState<string | undefined>(undefined);

    const [jabatanList, setJabatanList] = useState<Jabatan[]>([]);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        let mounted = true;
        async function load() {
            setLoading(true);
            try {
                // fetch anggota detail
                const res = await api.get<AnggotaPayload>(`/auth/anggota/${id}`);
                if (!mounted) return;
                const data = res.data;
                setNama(data.nama ?? "");
                setEmail(data.email ?? "");
                setAlamat(data.alamat ?? "");
                setNoHp(data.no_hp ?? (data as any).noHp ?? "");
                setJabatanId(data.id_jabatan ?? undefined);
            } catch (err: any) {
                console.error("Error loading anggota:", err);
                setGlobalError(err?.response?.data?.message || "Gagal memuat data anggota");
            } finally {
                if (mounted) setLoading(false);
            }
        }

        // fetch jabatan concurrently
        async function loadJabatan() {
            try {
                const res = await api.get<Jabatan[]>("/jabatan");
                if (!mounted) return;
                setJabatanList(res.data);
            } catch (err) {
                console.error("Gagal fetch jabatan:", err);
            }
        }

        load();
        loadJabatan();

        return () => { mounted = false; };
    }, [id]);

    const validate = () => {
        const e: Record<string, string> = {};
        if (!nama.trim()) e.nama = "Nama wajib diisi";
        if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) e.email = "Email tidak valid";
        if (noHp && !/^\+?\d{6,15}$/.test(noHp)) e.noHp = "Format no. HP tidak valid (contoh: +6281234567890)";
        return e;
    };

    const handleSave = async (ev?: React.FormEvent) => {
        ev?.preventDefault();
        setGlobalError(null);
        const e = validate();
        setFieldErrors(e);
        if (Object.keys(e).length) return;

        setSaving(true);
        try {
            // build payload: map to backend field names
            const payload: any = {
                nama,
                email,
                alamat: alamat || null,
                no_hp: noHp || null,
                id_jabatan: jabatanId || null,
            };

            await api.put(`/auth/anggota/${id}`, payload);

            // sukses -> kembali ke daftar dengan notifikasi (boleh pakai toast)
            navigate("/anggota");
        } catch (err: any) {
            console.error("Save error:", err);
            const msg = err?.response?.data?.message || err?.message || "Gagal menyimpan perubahan";
            // jika backend return validation object, map ke fieldErrors
            if (typeof err?.response?.data?.message === "object") {
                const srv = err.response.data.message;
                const newErrs: Record<string, string> = {};
                for (const k in srv) {
                    // map server keys to our fields if necessary
                    if (k === "no_hp") newErrs.noHp = srv[k];
                    else newErrs[k] = srv[k];
                }
                setFieldErrors(newErrs);
            } else {
                setGlobalError(msg);
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div style={{ padding: 20 }}>Memuat data...</div>;

    return (
        <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <h2>Edit Anggota</h2>
                <div>
                    <div style={{ display: "flex", gap: 12 }}>
                        <button
                            type="button"
                            className="btn btn-muted"
                            onClick={() => navigate(-1)}
                        >
                            Batal
                        </button>

                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => handleSave()}
                            disabled={saving}
                        >
                            {saving ? "Menyimpan..." : "Simpan"}
                        </button>
                    </div>

                </div>
            </div>

            {globalError && <div style={{ background: "#fff1f2", color: "#9f1239", padding: 10, borderRadius: 8, marginBottom: 12 }}>{globalError}</div>}

            <form onSubmit={handleSave} className="rp-form">
                <div className="rp-grid" style={{ marginBottom: 12 }}>
                    <div className="rp-field">
                        <label>Nama</label>
                        <input className="input" value={nama} onChange={(e) => setNama(e.target.value)} />
                        {fieldErrors.nama && <div className="rp-field-error">{fieldErrors.nama}</div>}
                    </div>

                    <div className="rp-field">
                        <label>Email</label>
                        <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
                        {fieldErrors.email && <div className="rp-field-error">{fieldErrors.email}</div>}
                    </div>

                    <div className="rp-field">
                        <label>No. HP</label>
                        <input className="input" value={noHp} onChange={(e) => setNoHp(e.target.value)} />
                        {fieldErrors.noHp && <div className="rp-field-error">{fieldErrors.noHp}</div>}
                    </div>

                    <div className="rp-field rp-full">
                        <label>Alamat</label>
                        <input className="input" value={alamat} onChange={(e) => setAlamat(e.target.value)} />
                    </div>

                    <div className="rp-field">
                        <label>Jabatan</label>
                        <select className="input" value={jabatanId} onChange={(e) => setJabatanId(e.target.value)}>
                            <option value="">-- Pilih jabatan --</option>
                            {jabatanList.map(j => <option key={j.id} value={j.id}>{j.nama}</option>)}
                        </select>
                    </div>
                </div>
            </form>
        </div>
    );
}
