import React from "react";
import { Head, Link } from "@inertiajs/react";

export default function Index() {
  return (
    <>
      <Head title="Produk" />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-3">Daftar Produk</h1>
        <p>Halo Cakrawala! Ini halaman React via Inertia.</p>
        <Link href="/" className="text-blue-600 underline">Kembali</Link>
      </div>
    </>
  );
}