import React, { useEffect, useState } from "react";
import type { Simpanan } from "../services/simpananService";
import { simpananService } from "../services/simpananService";

interface Props {
  onSuccess: () => void;
  editing: Simpanan | null;
  setEditing: (v: Simpanan | null) => void;
}

export default function SimpananForm({ onSuccess, editing, setEditing }: Props) {
  const [nama, setNama] = useState("");

  useEffect(() => {
    if (editing) {
      setNama(editing.nama);
    } else {
      setNama("");
    }
  }, [editing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await simpananService.update(editing.id, { nama });
        setEditing(null);
      } else {
        await simpananService.create({ nama });
      }
      setNama("");
      onSuccess();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nama Kategori"
        value={nama}
        onChange={(e) => setNama(e.target.value)}
        required
      />
      <button type="submit">{editing ? "Update" : "Create"}</button>
      {editing && (
        <button type="button" onClick={() => setEditing(null)}>
          Cancel
        </button>
      )}
    </form>
  );
}
