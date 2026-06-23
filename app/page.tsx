"use client";

import { useState } from "react";

function getApiUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.hostname}:8000`;
  }
  return "http://localhost:8000";
}

type Det = { label: string; confidence: number; bbox: number[] };

export default function Home() {
  const [preview, setPreview] = useState("");
  const [dims, setDims] = useState({ w: 1, h: 1 });
  const [dets, setDets] = useState<Det[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setDets([]);
    setError("");
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const API = getApiUrl();
      const res = await fetch(`${API}/api/detect`, { method: "POST", body: fd });
      if (!res.ok) throw new Error("Gagal mendeteksi gambar");
      const data = await res.json();
      setDims({ w: data.width, h: data.height });
      setDets(data.detections || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="wrap">
      <h1>🎯 YOLO Detector</h1>
      <p className="sub">Upload gambar, model mendeteksi objek secara otomatis.</p>

      <label className="upload">
        <input type="file" accept="image/*" onChange={onFile} hidden />
        {loading ? "Mendeteksi…" : "📷 Pilih Gambar"}
      </label>

      {error && <p className="error">{error}</p>}

      {preview && (
        <div className="stage">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="preview" />
          {dets.map((d, i) => {
            const [x1, y1, x2, y2] = d.bbox;
            return (
              <div
                key={i}
                className="box"
                style={{
                  left: `${(x1 / dims.w) * 100}%`,
                  top: `${(y1 / dims.h) * 100}%`,
                  width: `${((x2 - x1) / dims.w) * 100}%`,
                  height: `${((y2 - y1) / dims.h) * 100}%`,
                }}
              >
                <span>{d.label} {(d.confidence * 100).toFixed(0)}%</span>
              </div>
            );
          })}
        </div>
      )}

      {dets.length > 0 && (
        <div className="result">
          <h3>Ditemukan {dets.length} objek</h3>
          <ul>
            {dets.map((d, i) => (
              <li key={i}>
                <span>{d.label}</span>
                <span>{(d.confidence * 100).toFixed(1)}%</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
