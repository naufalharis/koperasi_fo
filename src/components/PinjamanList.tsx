import { useEffect, useState } from "react";
import { pinjamanService } from "../services/pinjamanService";
import PinjamanForm from "./PinjamanForm";
import PinjamanAngsuranForm from "./PinjamanAngsuranForm";
import "./PinjamanList.css";

export default function PinjamanList() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [showTrash, setShowTrash] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = showTrash
        ? await pinjamanService.trash()
        : await pinjamanService.list();
      setData(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [showTrash]);

  return (
    <div className="pl-root">
      <div className="pl-card">

        {/* HEADER */}
        <div className="pl-header">
          <h3>{showTrash ? "Data Terhapus (Trash)" : "Daftar Pinjaman"}</h3>

          <div className="pl-controls">
            {!showTrash && (
              <button className="pl-add-btn" onClick={() => setOpenForm(true)}>
                + Tambah
              </button>
            )}

            {/* TOMBOL TRASH */}
            <button
              className={showTrash ? "pl-edit-btn" : "pl-soft-delete-btn"}
              onClick={() => setShowTrash(!showTrash)}
            >
              {showTrash ? "Kembali" : "Sampah"}
            </button>
          </div>
        </div>

        {/* TABEL HEADER */}
        <div className="pl-table">
          <div className="pl-table-head">
            <div>Anggota</div>
            <div>Jumlah</div>
            <div>Tanggal</div>
            <div>Jatuh Tempo</div>
            <div>Status</div>
            <div>Aksi</div>
          </div>

          {/* LIST DATA */}
          <div className="pl-table-body">
            {loading ? (
              <div className="pl-loading">
                <div className="pl-row-skel">
                  <div className="skel skel-1" />
                  <div className="skel skel-2" />
                  <div className="skel skel-3" />
                  <div className="skel skel-4" />
                </div>
              </div>
            ) : data.length === 0 ? (
              <div className="pl-empty">Tidak ada data</div>
            ) : (
              data.map((item) => (
                <div key={item.id} className="pl-row">
                  <div className="col">{item.anggota?.nama}</div>
                  <div className="col">{item.jumlah}</div>
                  <div className="col">{item.tanggal?.slice(0, 10)}</div>
                  <div className="col">{item.tanggal_jatuh_tempo?.slice(0, 10)}</div>

                  <div className="col">
                    {!item.deleted_at ? (
                      item.status === "LUNAS" ? (
                        <span className="badge badge-lunas">Lunas</span>
                      ) : (
                        <span className="badge badge-belum">Belum</span>
                      )
                    ) : (
                      <span className="badge badge-soft-delete">Terhapus</span>
                    )}
                  </div>

                  <div className="pl-row-actions">
                    {!showTrash ? (
                      <>
                        <button className="pl-edit-btn">Edit</button>
                        <button
                          className="pl-soft-delete-btn"
                          onClick={async () => {
                            await pinjamanService.softDelete(item.id);
                            loadData();
                          }}
                        >
                          Hapus
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="pl-edit-btn"
                          onClick={async () => {
                            await pinjamanService.restore(item.id);
                            loadData();
                          }}
                        >
                          Restore
                        </button>

                        <button
                          className="pl-delete-btn"
                          onClick={async () => {
                            await pinjamanService.hardDelete(item.id);
                            loadData();
                          }}
                        >
                          Delete Permanen
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {openForm && <PinjamanForm onClose={() => setOpenForm(false)} />}
    </div>
  );
}
