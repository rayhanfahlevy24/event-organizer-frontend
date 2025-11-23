import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import TenantCard from "@/components/TenantCard";
import { Tenant } from "@/types/tenant";

export default function Home() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "";

  async function fetchTenants() {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/tenants`);
      if (!res.ok) throw new Error("Failed");
      const data: Tenant[] = await res.json();
      setTenants(data);
    } catch (e) {
      console.error(e);
      setTenants([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTenants();
  }, []);

  const filtered = tenants.filter(t => {
    const qq = q.trim().toLowerCase();
    if (!qq) return true;
    return [
      t.tenant_name,
      t.tenant_type,
      t.booth_num ?? "",
      t.tenant_phone ?? "",
      t.tenant_address ?? "",
    ].join(" ").toLowerCase().includes(qq);
  });

  return (
    <>
      <Head><title>Daftar Tenants</title></Head>
      <main className="min-h-screen bg-black px-4 sm:px-8 py-10">
        <div className="max-w-5xl mx-auto">
          <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Daftar Tenants</h1>
              <p className="text-sm text-slate-500">Kelola pendaftaran tenant untuk event</p>
            </div>

            <div className="flex gap-3 items-center">
              <input
                className="text-gray-500 px-3 py-2 rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Cari nama, tipe, booth, phone, address..."
                value={q}
                onChange={(e)=>setQ(e.target.value)}
              />
              <Link href="/register" className="inline-block">
                <button className="bg-accent text-white px-4 py-2 rounded-md hover:bg-indigo-600">Daftar Tenant</button>
              </Link>
            </div>
          </header>

          <section className="space-y-4">
            {loading ? (
              <div className="text-center py-12 text-slate-500">Memuat tenants...</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                Tidak ada tenant. <br/>
                <Link href="/register" className="text-indigo-600 underline">Tambah tenant sekarang</Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {filtered.map(t => <TenantCard key={t.id} t={t} />)}
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
