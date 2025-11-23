import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { TenantType } from "@/types/tenant";

type FormState = {
  tenant_name: string;
  tenant_type: TenantType;
  tenant_phone?: string;
  tenant_address?: string;
  booth_num?: string;
  area_sm?: string;
};

export default function Register() {
  const router = useRouter();
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "";

  const [form, setForm] = useState<FormState>({
    tenant_name: "",
    tenant_type: "booth",
    tenant_phone: "",
    tenant_address: "",
    booth_num: "",
    area_sm: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  function validate(): boolean {
    const e: Record<string, string> = {};

    if (!form.tenant_name.trim()) e.tenant_name = "Nama tenant wajib diisi";
    if (!form.tenant_type) e.tenant_type = "Pilih tipe tenant";

    if (form.tenant_type === "booth") {
      if (!form.booth_num?.trim()) e.booth_num = "Booth number wajib diisi";
    }
    if (form.tenant_type === "space_only") {
      if (!form.area_sm?.trim()) e.area_sm = "Area wajib diisi";
      else if (isNaN(Number(form.area_sm)) || Number(form.area_sm) <= 0)
        e.area_sm = "Area harus angka > 0";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload: any = {
        tenant_name: form.tenant_name,
        tenant_type: form.tenant_type,
        tenant_phone: form.tenant_phone || null,
        tenant_address: form.tenant_address || null,
      };
      if (form.tenant_type === "booth") payload.booth_num = form.booth_num;
      if (form.tenant_type === "space_only") payload.area_sm = Number(form.area_sm);

      const res = await fetch(`${apiBase}/api/tenants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await res.text());

      alert("Tenant berhasil disimpan");
      router.push("/");
    } catch (err: any) {
      alert("Gagal menyimpan tenant: " + err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Head>
        <title>Daftar Tenant Baru</title>
      </Head>

      <main className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-slate-900 text-white shadow-xl rounded-xl p-8 space-y-6">
          <div>
            <h1 className="text-3xl font-semibold">Daftar Tenant Baru</h1>
            <p className="text-sm text-gray-400">Isi data tenant sesuai tipe</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nama Tenant */}
            <div>
              <label className="block text-sm font-medium mb-1">Nama Tenant *</label>
              <input
                className={`w-full rounded-md px-3 py-2 bg-slate-800 border ${
                  errors.tenant_name ? "border-red-500" : "border-slate-700"
                }`}
                value={form.tenant_name}
                onChange={(e) => setForm({ ...form, tenant_name: e.target.value })}
              />
              {errors.tenant_name && (
                <p className="text-xs text-red-500 mt-1">{errors.tenant_name}</p>
              )}
            </div>

            {/* Tipe Tenant */}
            <div>
              <label className="block text-sm font-medium mb-1">Tipe Tenant *</label>
              <select
                className="w-full rounded-md px-3 py-2 bg-slate-800 border border-slate-700"
                value={form.tenant_type}
                onChange={(e) =>
                  setForm({ ...form, tenant_type: e.target.value as TenantType })
                }
              >
                <option value="food_truck">Food Truck</option>
                <option value="booth">Booth</option>
                <option value="space_only">Space Only</option>
              </select>
            </div>

            {/* Phone + Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  className="w-full rounded-md px-3 py-2 bg-slate-800 border border-slate-700"
                  value={form.tenant_phone}
                  onChange={(e) => setForm({ ...form, tenant_phone: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <input
                  className="w-full rounded-md px-3 py-2 bg-slate-800 border border-slate-700"
                  value={form.tenant_address}
                  onChange={(e) => setForm({ ...form, tenant_address: e.target.value })}
                />
              </div>
            </div>

            {/* Conditional Booth */}
            {form.tenant_type === "booth" && (
              <div>
                <label className="block text-sm font-medium mb-1">Booth Number *</label>
                <input
                  className={`w-full rounded-md px-3 py-2 bg-slate-800 border ${
                    errors.booth_num ? "border-red-500" : "border-slate-700"
                  }`}
                  value={form.booth_num}
                  onChange={(e) => setForm({ ...form, booth_num: e.target.value })}
                />
                {errors.booth_num && (
                  <p className="text-xs text-red-500 mt-1">{errors.booth_num}</p>
                )}
              </div>
            )}

            {/* Conditional Space Only */}
            {form.tenant_type === "space_only" && (
              <div>
                <label className="block text-sm font-medium mb-1">Area (m²) *</label>
                <input
                  className={`w-full rounded-md px-3 py-2 bg-slate-800 border ${
                    errors.area_sm ? "border-red-500" : "border-slate-700"
                  }`}
                  value={form.area_sm}
                  onChange={(e) => setForm({ ...form, area_sm: e.target.value })}
                />
                {errors.area_sm && (
                  <p className="text-xs text-red-500 mt-1">{errors.area_sm}</p>
                )}
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex justify-between pt-3">
              <Link href="/" className="text-gray-300 hover:text-white text-sm">
                Kembali
              </Link>

              <button
                type="submit"
                disabled={submitting}
                className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md text-white disabled:opacity-60"
              >
                {submitting ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
