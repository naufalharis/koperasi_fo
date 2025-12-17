import React from "react";
import "./AngsuranTable.css";

interface Props {
  data: any[];
  onEdit: (item: any) => void;
  onDelete: (id: string) => void;
}

const AngsuranTable: React.FC<Props> = ({ data, onEdit, onDelete }) => {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (data.length === 0) {
    return (
      <div className="at-empty">
        Tidak ada data angsuran
      </div>
    );
  }

  return (
    <div className="at-container">
      <div className="at-table">
        {/* TABLE HEADER */}
        <div className="at-header">
          <div className="at-col">ID</div>
          <div className="at-col">ID Pinjaman</div>
          <div className="at-col">Tanggal Bayar</div>
          <div className="at-col">Jumlah Bayar</div>
          <div className="at-col">Sisa Pinjaman</div>
          <div className="at-col">Aksi</div>
        </div>

        {/* TABLE BODY */}
        <div className="at-body">
          {data.map((a) => (
            <div key={a.id} className="at-row">
              <div className="at-col">
                <span className="at-id">{a.id}</span>
              </div>
              <div className="at-col">
                <span className="at-pinjaman-id">{a.pinjaman_id}</span>
              </div>
              <div className="at-col">
                <span className="at-tanggal">
                  {formatDate(a.tanggal_pembayaran)}
                </span>
              </div>
              <div className="at-col">
                <span className="at-jumlah at-currency">
                  {formatCurrency(a.jumlah_pembayaran || 0)}
                </span>
              </div>
              <div className="at-col">
                <span className={`at-sisa at-currency ${(a.sisa_pinjaman || 0) > 0 ? 'at-sisa-remaining' : 'at-sisa-lunas'}`}>
                  {formatCurrency(a.sisa_pinjaman || 0)}
                </span>
              </div>
              <div className="at-col">
                <div className="at-actions">
                  <button 
                    className="btn btn-small btn-secondary"
                    onClick={() => onEdit(a)}
                    title="Edit angsuran"
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-small btn-danger"
                    onClick={() => onDelete(a.id)}
                    title="Hapus angsuran"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AngsuranTable;