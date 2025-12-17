import React, { useState, useEffect } from "react";
import { angsuranService } from "../services/angsuranService";
import { api } from "../api/axios";
import "./AngsuranForm.css";

interface Props {
  editing?: any;
  onSuccess: () => void;
  onCancel?: () => void;
}

const AngsuranForm: React.FC<Props> = ({ editing, onSuccess, onCancel }) => {
  const [pinjamanList, setPinjamanList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);

  // STRING (UUID), jangan diubah ke number
  const [pinjaman_id, setPinjamanId] = useState<string>(
    editing?.pinjaman_id ? String(editing.pinjaman_id) : ""
  );

  const [tanggal_pembayaran, setTanggal] = useState<string>(
    editing?.tanggal_pembayaran?.substring(0, 10) || ""
  );

  const [jumlah_pembayaran, setJumlah] = useState<number>(
    editing?.jumlah_pembayaran || 0
  );

  useEffect(() => {
    const fetchPinjaman = async () => {
      try {
        const res = await api.get("/pinjaman");
        setPinjamanList(res.data || []);
      } catch (err) {
        console.error("Error fetching pinjaman:", err);
        setGlobalError("Gagal memuat data pinjaman");
      }
    };
    fetchPinjaman();
  }, []);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Validasi form
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!pinjaman_id.trim()) {
      errors.pinjaman_id = "Pilih pinjaman";
    }

    if (!tanggal_pembayaran) {
      errors.tanggal_pembayaran = "Tanggal pembayaran harus diisi";
    } else {
      const selectedDate = new Date(tanggal_pembayaran);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate > today) {
        errors.tanggal_pembayaran = "Tanggal tidak boleh lebih dari hari ini";
      }
    }

    if (!jumlah_pembayaran || jumlah_pembayaran <= 0) {
      errors.jumlah_pembayaran = "Jumlah pembayaran harus lebih dari 0";
    } else if (jumlah_pembayaran > 1000000000) { // 1 Miliar
      errors.jumlah_pembayaran = "Jumlah terlalu besar";
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError(null);
    
    const errors = validateForm();
    setFormErrors(errors);
    
    if (Object.keys(errors).length > 0) return;

    setLoading(true);

    try {
      // FIX: Jangan ubah UUID ke Number → biarkan string
      const payload = {
        pinjaman_id: pinjaman_id,
        tanggal_pembayaran: new Date(tanggal_pembayaran).toISOString(),
        jumlah_pembayaran: Number(jumlah_pembayaran),
      };

      console.log("PAYLOAD DIKIRIM:", payload);

      if (editing) {
        await angsuranService.update(editing.id, payload);
      } else {
        await angsuranService.create(payload);
      }

      onSuccess();
    } catch (err: any) {
      console.error("Gagal submit:", err);
      const errorMessage = err?.response?.data?.message || err?.message || "Gagal menyimpan data angsuran";
      
      // Coba parse error dari backend
      if (err?.response?.data?.errors) {
        setFormErrors(err.response.data.errors);
      } else {
        setGlobalError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="af-container">
      <div className="af-card">
        <div className="af-header">
          <h3 className="af-title">
            {editing ? "Edit Angsuran" : "Tambah Angsuran Baru"}
          </h3>
          {onCancel && (
            <button 
              className="af-close-btn" 
              onClick={onCancel}
              type="button"
              disabled={loading}
            >
              ×
            </button>
          )}
        </div>

        {globalError && (
          <div className="af-error-global">
            <strong>Error:</strong> {globalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="af-form">
          <div className="af-form-grid">
            {/* Pinjaman */}
            <div className="af-form-group">
              <label className="af-label" htmlFor="pinjaman_id">
                Pinjaman <span className="af-required">*</span>
              </label>
              <select
                id="pinjaman_id"
                className={`af-input ${formErrors.pinjaman_id ? 'af-input-error' : ''}`}
                value={pinjaman_id}
                onChange={(e) => {
                  setPinjamanId(e.target.value);
                  if (formErrors.pinjaman_id) setFormErrors(prev => ({ ...prev, pinjaman_id: '' }));
                }}
                disabled={loading || pinjamanList.length === 0}
              >
                <option value="">-- Pilih Pinjaman --</option>
                {pinjamanList.map((p) => (
                  <option key={p.id} value={String(p.id)}>
                    ID: {p.id} - {p.anggota?.nama || 'Tidak diketahui'} - {formatCurrency(p.jumlah || 0)}
                  </option>
                ))}
              </select>
              {formErrors.pinjaman_id && (
                <div className="af-error-message">{formErrors.pinjaman_id}</div>
              )}
              {pinjamanList.length === 0 && !loading && (
                <div className="af-info-message">Tidak ada data pinjaman tersedia</div>
              )}
            </div>

            {/* Tanggal Pembayaran */}
            <div className="af-form-group">
              <label className="af-label" htmlFor="tanggal_pembayaran">
                Tanggal Pembayaran <span className="af-required">*</span>
              </label>
              <input
                id="tanggal_pembayaran"
                type="date"
                className={`af-input ${formErrors.tanggal_pembayaran ? 'af-input-error' : ''}`}
                value={tanggal_pembayaran}
                onChange={(e) => {
                  setTanggal(e.target.value);
                  if (formErrors.tanggal_pembayaran) setFormErrors(prev => ({ ...prev, tanggal_pembayaran: '' }));
                }}
                max={new Date().toISOString().split('T')[0]}
                disabled={loading}
              />
              {formErrors.tanggal_pembayaran && (
                <div className="af-error-message">{formErrors.tanggal_pembayaran}</div>
              )}
            </div>

            {/* Jumlah Pembayaran */}
            <div className="af-form-group">
              <label className="af-label" htmlFor="jumlah_pembayaran">
                Jumlah Pembayaran <span className="af-required">*</span>
              </label>
              <div className="af-amount-input">
                <span className="af-currency-prefix">Rp</span>
                <input
                  id="jumlah_pembayaran"
                  type="number"
                  className={`af-input ${formErrors.jumlah_pembayaran ? 'af-input-error' : ''}`}
                  value={jumlah_pembayaran || ''}
                  onChange={(e) => {
                    const value = e.target.value === '' ? 0 : Number(e.target.value);
                    setJumlah(value);
                    if (formErrors.jumlah_pembayaran) setFormErrors(prev => ({ ...prev, jumlah_pembayaran: '' }));
                  }}
                  disabled={loading}
                  min="1"
                  step="1000"
                />
              </div>
              {jumlah_pembayaran > 0 && (
                <div className="af-amount-preview">
                  {formatCurrency(jumlah_pembayaran)}
                </div>
              )}
              {formErrors.jumlah_pembayaran && (
                <div className="af-error-message">{formErrors.jumlah_pembayaran}</div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="af-actions">
            {onCancel && (
              <button
                type="button"
                className="af-btn af-btn-secondary"
                onClick={onCancel}
                disabled={loading}
              >
                Batal
              </button>
            )}
            <button
              type="submit"
              className="af-btn af-btn-primary"
              disabled={loading || pinjamanList.length === 0}
            >
              {loading ? (
                <>
                  <span className="af-spinner"></span>
                  {editing ? 'Mengupdate...' : 'Menyimpan...'}
                </>
              ) : editing ? 'Update Angsuran' : 'Tambah Angsuran'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AngsuranForm;