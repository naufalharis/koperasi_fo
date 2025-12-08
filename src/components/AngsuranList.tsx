import { useEffect, useState } from "react";
import { angsuranService } from "../services/angsuranService";
import AngsuranTable from "./AngsuranTable";
import { useNavigate } from "react-router-dom";

export default function AngsuranList() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const loadData = async () => {
    const res = await angsuranService.getAll();
    setData(res);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus angsuran ini?")) return;
    await angsuranService.delete(id);
    loadData();
  };

  return (
    <div>
      <h2>Data Angsuran</h2>
      <button onClick={() => navigate("/angsuran/tambah")}>
        Tambah Angsuran
      </button>

      <AngsuranTable
        data={data}
        onEdit={(item) => navigate(`/angsuran/edit/${item.id}`)}
        onDelete={handleDelete}
      />
    </div>
  );
}
