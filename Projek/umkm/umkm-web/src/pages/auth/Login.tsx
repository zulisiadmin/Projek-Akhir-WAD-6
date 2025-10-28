import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../services/api";

// Optional: tipe user sederhana
type UserMe = {
  id: number;
  name: string;
  email: string;
  role?: string | null;     // 'vendor' | 'admin' | 'user' | dll
  vendor_id?: number | null;
};

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
      // 1) Ambil cookie CSRF (Sanctum)
      await authApi.get("/sanctum/csrf-cookie");

      // 2) Ambil token XSRF dari cookie browser
      const token = decodeURIComponent(
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("XSRF-TOKEN="))
          ?.split("=")[1] || ""
      );

      // 3) Login (pakai header X-XSRF-TOKEN)
      await authApi.post(
        "/login",
        { email, password },
        { headers: { "X-XSRF-TOKEN": token } }
      );

      // 4) Ambil profil user untuk tahu 'role'
      //    - Mayoritas proyek Sanctum expose endpoint ini di /api/user
      //    - Kalau berbeda, ganti ke endpoint profil yang kamu punya (mis. /api/me)
      let me: UserMe | null = null;

      try {
        const res = await authApi.get<UserMe>("/api/user");
        me = res.data;
      } catch {
        // fallback lain yang kadang dipakai
        const res2 = await authApi.get<UserMe>("/user");
        me = res2.data;
      }

      // 5) Simpan info ringan (opsional)
      if (me) {
        localStorage.setItem("user:role", me.role ?? "");
        if (me.vendor_id != null) {
          localStorage.setItem("user:vendor_id", String(me.vendor_id));
        }
      }

      // 6) Routing berdasarkan role
      const role = (me?.role || "").toLowerCase();

      if (role === "vendor") {
        nav("/sellerdashboard");              // atau '/sellerdashboard/orders'
      } else if (role === "admin") {
        nav("/admin");                        // jika ada halaman admin
      } else {
        nav("/");                              // user biasa kembali ke home
      }
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
    <form onSubmit={onSubmit} className="space-y-3">
      <div>
        <label className="block text-sm mb-1">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded border px-3 py-2"
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded bg-blue-600 py-2 text-white disabled:opacity-50"
      >
        {loading ? "Memproses..." : "Masuk"}
      </button>
    </form>
  );
}
