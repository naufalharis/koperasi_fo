import { useEffect, useState } from "react";
import { tabunganService } from "../services/tabunganService";
import TabunganForm from "./TabunganForm";
import TabunganTable from "./TabunganTable";

const TabunganList = () => {
  const [data, setData] = useState([]);
  const [editing, setEditing] = useState<any | false>(false);

  const load = async () => {
    const res = await tabunganService.getAll();
    setData(res);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Yakin hapus?")) {
      await tabunganService.delete(id);
      load();
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Data Tabungan</h2>

      <button onClick={() => setEditing({})}>
        Tambah Tabungan
      </button>

      {/* FORM MUNCUL JIKA editing !== false */}
      {editing !== false && (
        <TabunganForm
          editing={editing}
          onSuccess={() => {
            setEditing(false);
            load();
          }}
          onCancel={() => setEditing(false)}
        />
      )}

      <TabunganTable
        data={data}
        onEdit={(item) => setEditing(item)}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default TabunganList;
