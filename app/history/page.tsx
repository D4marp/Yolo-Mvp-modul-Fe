"use client";

import { useEffect, useState } from "react";

function getApiUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.hostname}:8000`;
  }
  return "http://localhost:8000";
}

type Item = {
  id: number;
  filename: string;
  object_count: number;
  detections: { label: string; confidence: number }[];
  created_at: string | null;
};

export default function History() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const API = getApiUrl();
    fetch(`${API}/api/history`)
      .then((r) => {
        if (!r.ok) throw new Error("Gagal memuat riwayat");
        return r.json();
      })
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="wrap">
      <h1>Riwayat Deteksi</h1>
      <p className="sub">50 deteksi terakhir dari database.</p>

      {loading && <p>Memuat…</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && items.length === 0 && (
        <p className="sub">Belum ada data. Coba deteksi sebuah gambar dulu.</p>
      )}

      <div className="history">
        {items.map((it) => {
          const labels = Array.from(new Set(it.detections.map((d) => d.label)));
          return (
            <div key={it.id} className="card">
              <div className="card-head">
                <strong>#{it.id}</strong>
                <span className="muted">
                  {it.created_at ? new Date(it.created_at).toLocaleString("id-ID") : "-"}
                </span>
              </div>
              <div className="filename">{it.filename}</div>
              <div className="badges">
                <span className="badge">{it.object_count} objek</span>
                {labels.map((l) => (
                  <span key={l} className="badge ghost">{l}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
