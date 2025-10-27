import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../services/api";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

const onSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setLoading(true);

  try {
    // 1️⃣ Ambil cookie CSRF
    await authApi.get("/sanctum/csrf-cookie");

    // 2️⃣ Ambil token dari cookie
    const token = decodeURIComponent(
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("XSRF-TOKEN="))
        ?.split("=")[1] || ""
    );

    // 3️⃣ Kirim login dengan header X-XSRF-TOKEN
    await authApi.post(
      "/login",
      { email, password },
      { headers: { "X-XSRF-TOKEN": token } }
    );

    nav("/sellerDashboard");
  } catch (e: any) {
    const msg =
      e?.response?.data?.message ||
      `Login gagal (${e?.response?.status || "Network"})`;
    setError(msg);
  } finally {
    setLoading(false);
  }
};

  

  return (
    <div style={styles.wrap}>
      <style>{css}</style>
      <div style={styles.card}>
        <h1 style={styles.title}>Masuk</h1>
        <p style={styles.sub}>Gunakan email dan kata sandi akun Anda</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={onSubmit} style={styles.form as React.CSSProperties}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            style={styles.input}
            autoComplete="email"
          />

          <label style={{ ...styles.label, marginTop: 10 }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            style={styles.input}
            autoComplete="current-password"
          />

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Masuk…" : "Masuk"}
          </button>
        </form>

        <small style={styles.hint}>Tip: Pastikan backend berjalan di 127.0.0.1:8000 dan cookie diizinkan.</small>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: 20,
    background: "#0b1221",
  },
  card: {
    width: "100%",
    maxWidth: 420,
    background: "#111a33",
    border: "1px solid rgba(255,255,255,.12)",
    borderRadius: 14,
    padding: 20,
    color: "#e8eef9",
  },
  title: { margin: 0, fontSize: 22, fontWeight: 800 },
  sub: { margin: "6px 0 16px", color: "#9bb0d1" },
  error: {
    background: "rgba(255,90,90,.08)",
    border: "1px solid rgba(255,90,90,.35)",
    padding: "10px 12px",
    borderRadius: 10,
    color: "#ffd2d2",
    fontSize: 13,
    marginBottom: 10,
  },
  form: { display: "grid", gap: 10 },
  label: { fontSize: 12, color: "#9bb0d1" },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,.15)",
    background: "#0e1730",
    color: "#e8eef9",
    outline: "none",
  },
  button: {
    marginTop: 14,
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid rgba(108,162,255,.35)",
    background: "rgba(108,162,255,.15)",
    color: "#e8eef9",
    fontWeight: 700,
    cursor: "pointer",
  },
  hint: { display: "block", marginTop: 12, color: "#9bb0d1" },
};

const css = `
  *{box-sizing:border-box} input:focus{box-shadow:0 0 0 3px rgba(108,162,255,.25)}
`;
