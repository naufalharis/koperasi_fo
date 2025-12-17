// src/components/AnggotaEdit.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api/axios";
import "./AnggotaEdit.css";

interface Jabatan { 
  id: string; 
  nama: string; 
}

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
  const [jabatanId, setJabatanId] = useState<string>("");

  const [jabatanList, setJabatanList] = useState<Jabatan[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    let mounted = true;
    
    async function loadData() {
      setLoading(true);
      setGlobalError(null);
      
      try {
        // Fetch anggota detail dan jabatan secara parallel
        const [anggotaRes, jabatanRes] = await Promise.all([
          api.get<AnggotaPayload>(`/auth/anggota/${id}`),
          api.get<Jabatan[]>("/jabatan").catch(() => ({ data: [] })) // Fail gracefully
        ]);

        if (!mounted) return;

        const anggotaData = anggotaRes.data;
        setNama(anggotaData.nama ?? "");
        setEmail(anggotaData.email ?? "");
        setAlamat(anggotaData.alamat ?? "");
        setNoHp(anggotaData.no_hp ?? "");
        setJabatanId(anggotaData.id_jabatan ?? "");
        setJabatanList(jabatanRes.data);
      } catch (err: any) {
        console.error("Error loading data:", err);
        setGlobalError(err?.response?.data?.message || "Gagal memuat data anggota");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadData();

    return () => { mounted = false; };
  }, [id]);

  const validate = () => {
    const errors: Record<string, string> = {};
    
    if (!nama.trim()) errors.nama = "Nama wajib diisi";
    if (!email.trim()) errors.email = "Email wajib diisi";
    else if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = "Email tidak valid";
    
    if (noHp && !/^\+?\d{6,15}$/.test(noHp)) {
      errors.noHp = "Format no. HP tidak valid (contoh: +6281234567890)";
    }
    
    return errors;
  };

  const handleSave = async (ev?: React.FormEvent) => {
    ev?.preventDefault();
    setGlobalError(null);
    
    const errors = validate();
    setFieldErrors(errors);
    
    if (Object.keys(errors).length > 0) return;

    setSaving(true);
    
    try {
      const payload = {
        nama: nama.trim(),
        email: email.trim(),
        alamat: alamat.trim() || null,
        no_hp: noHp.trim() || null,
        id_jabatan: jabatanId || null,
      };

      await api.put(`/auth/anggota/${id}`, payload);
      
      // Navigasi ke halaman daftar anggota
      navigate("/anggota");
      
    } catch (err: any) {
      console.error("Save error:", err);
      
      // Handle validation errors from server
      if (err?.response?.data?.errors) {
        const serverErrors = err.response.data.errors;
        const newErrors: Record<string, string> = {};
        
        Object.keys(serverErrors).forEach(key => {
          if (key === 'no_hp') newErrors.noHp = serverErrors[key];
          else if (key === 'id_jabatan') newErrors.jabatanId = serverErrors[key];
          else newErrors[key] = serverErrors[key];
        });
        
        setFieldErrors(newErrors);
      } else {
        setGlobalError(
          err?.response?.data?.message || 
          err?.message || 
          "Gagal menyimpan perubahan"
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm("Batalkan perubahan? Data yang belum disimpan akan hilang.")) {
      navigate(-1);
    }
  };

  if (loading) {
    return (
      <div className="ae-loading">
        <div className="ae-loading-spinner"></div>
        <p>Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="ae-container">
      <div className="ae-header">
        <h2>Edit Anggota</h2>
        
        <div className="ae-actions">
          <button
            type="button"
            className="ae-btn ae-btn-secondary"
            onClick={handleCancel}
            disabled={saving}
          >
            Batal
          </button>
          
          <button
            type="button"
            className="ae-btn ae-btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <>
                <span className="ae-spinner"></span>
                Menyimpan...
              </>
            ) : "Simpan"}
          </button>
        </div>
      </div>

      {globalError && (
        <div className="ae-error">
          <strong>Error:</strong> {globalError}
        </div>
      )}

      <form onSubmit={handleSave} className="ae-form">
        <div className="ae-form-grid">
          <div className="ae-form-group">
            <label htmlFor="nama" className="ae-label">
              Nama <span className="ae-required">*</span>
            </label>
            <input
              id="nama"
              type="text"
              className={`ae-input ${fieldErrors.nama ? 'ae-input-error' : ''}`}
              value={nama}
              onChange={(e) => {
                setNama(e.target.value);
                if (fieldErrors.nama) setFieldErrors(prev => ({ ...prev, nama: '' }));
              }}
              disabled={saving}
            />
            {fieldErrors.nama && (
              <div className="ae-error-message">{fieldErrors.nama}</div>
            )}
          </div>

          <div className="ae-form-group">
            <label htmlFor="email" className="ae-label">
              Email <span className="ae-required">*</span>
            </label>
            <input
              id="email"
              type="email"
              className={`ae-input ${fieldErrors.email ? 'ae-input-error' : ''}`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: '' }));
              }}
              disabled={saving}
            />
            {fieldErrors.email && (
              <div className="ae-error-message">{fieldErrors.email}</div>
            )}
          </div>

          <div className="ae-form-group">
            <label htmlFor="noHp" className="ae-label">
              No. HP
            </label>
            <input
              id="noHp"
              type="tel"
              className={`ae-input ${fieldErrors.noHp ? 'ae-input-error' : ''}`}
              value={noHp}
              onChange={(e) => {
                setNoHp(e.target.value);
                if (fieldErrors.noHp) setFieldErrors(prev => ({ ...prev, noHp: '' }));
              }}
              disabled={saving}
              placeholder="+6281234567890"
            />
            {fieldErrors.noHp && (
              <div className="ae-error-message">{fieldErrors.noHp}</div>
            )}
          </div>

          <div className="ae-form-group">
            <label htmlFor="jabatan" className="ae-label">
              Jabatan
            </label>
            <select
              id="jabatan"
              className={`ae-input ${fieldErrors.jabatanId ? 'ae-input-error' : ''}`}
              value={jabatanId}
              onChange={(e) => setJabatanId(e.target.value)}
              disabled={saving || jabatanList.length === 0}
            >
              <option value="">-- Pilih jabatan --</option>
              {jabatanList.map(j => (
                <option key={j.id} value={j.id}>
                  {j.nama}
                </option>
              ))}
            </select>
            {fieldErrors.jabatanId && (
              <div className="ae-error-message">{fieldErrors.jabatanId}</div>
            )}
          </div>

          <div className="ae-form-group ae-full-width">
            <label htmlFor="alamat" className="ae-label">
              Alamat
            </label>
            <textarea
              id="alamat"
              className="ae-textarea"
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              disabled={saving}
              rows={3}
            />
          </div>
        </div>
      </form>
    </div>
  );
}