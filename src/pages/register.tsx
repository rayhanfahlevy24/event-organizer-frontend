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

    // Nama tenant wajib
    if (!form.tenant_name?.trim()) e.tenant_name = "Nama tenant wajib diisi";

    // Tipe wajib
    if (!form.tenant_type) e.tenant_type = "Pilih tipe tenant";

    // Phone Number wajib dan harus angka
    const phone = (form.tenant_phone ?? "").trim();
    if (!phone) {
      e.tenant_phone = "Nomor handphone wajib diisi";
    } else if (!/^\d+$/.test(phone)) {
      e.tenant_phone = "Nomor handphone hanya boleh berisi angka";
    }

    // Address wajib
    if (!form.tenant_address?.trim()) e.tenant_address = "Alamat wajib diisi";

    // Jika tipe booth, booth_num wajib
    if (form.tenant_type === "booth") {
      if (!form.booth_num?.trim()) e.booth_num = "Booth number wajib diisi";
    }

    // Jika space_only, area wajib dan numeric > 0
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

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Server error");
      }

      alert("Tenant berhasil disimpan");
      router.push("/");
    } catch (err: any) {
      console.error(err);
      alert("Gagal menyimpan tenant: " + (err?.message ?? "unknown"));
    } finally {
      setSubmitting(false);
    }
  }

  const inputBase = "w-full rounded-md px-3 py-2 bg-slate-800 ";
  const errorClass = "border-red-500";
  const normalClass = "border-slate-700";

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

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Nama Tenant */}
            <div>
              <label className="block text-sm font-medium mb-1">Nama Tenant *</label>
              <input
                className={`${inputBase} border ${errors.tenant_name ? errorClass : normalClass}`}
                value={form.tenant_name}
                onChange={(e) => setForm({ ...form, tenant_name: e.target.value })}
                aria-invalid={!!errors.tenant_name}
              />
              {errors.tenant_name && <p className="text-xs text-red-500 mt-1">{errors.tenant_name}</p>}
            </div>

            {/* Tipe Tenant */}
            <div>
              <label className="block text-sm font-medium mb-1">Tipe Tenant *</label>
              <select
                className="w-full rounded-md px-3 py-2 bg-slate-800 border border-slate-700"
                value={form.tenant_type}
                onChange={(e) => setForm({ ...form, tenant_type: e.target.value as TenantType })}
              >
                <option value="food_truck">Food Truck</option>
                <option value="booth">Booth</option>
                <option value="space_only">Space Only</option>
              </select>
            </div>

            {/* Phone + Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Phone *</label>
                <input
                  className={`${inputBase} border ${errors.tenant_phone ? errorClass : normalClass}`}
                  value={form.tenant_phone}
                  onChange={(e) => setForm({ ...form, tenant_phone: e.target.value })}
                  aria-invalid={!!errors.tenant_phone}
                />
                {errors.tenant_phone && <p className="text-xs text-red-500 mt-1">{errors.tenant_phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Address *</label>
                <input
                  className={`${inputBase} border ${errors.tenant_address ? errorClass : normalClass}`}
                  value={form.tenant_address}
                  onChange={(e) => setForm({ ...form, tenant_address: e.target.value })}
                  aria-invalid={!!errors.tenant_address}
                />
                {errors.tenant_address && <p className="text-xs text-red-500 mt-1">{errors.tenant_address}</p>}
              </div>
            </div>

            {/* Conditional Booth */}
            {form.tenant_type === "booth" && (
              <div>
                <label className="block text-sm font-medium mb-1">Booth Number *</label>
                <input
                  className={`${inputBase} border ${errors.booth_num ? errorClass : normalClass}`}
                  value={form.booth_num}
                  onChange={(e) => setForm({ ...form, booth_num: e.target.value })}
                  aria-invalid={!!errors.booth_num}
                />
                {errors.booth_num && <p className="text-xs text-red-500 mt-1">{errors.booth_num}</p>}
              </div>
            )}

            {/* Conditional Space Only */}
            {form.tenant_type === "space_only" && (
              <div>
                <label className="block text-sm font-medium mb-1">Area (m²) *</label>
                <input
                  className={`${inputBase} border ${errors.area_sm ? errorClass : normalClass}`}
                  value={form.area_sm}
                  onChange={(e) => setForm({ ...form, area_sm: e.target.value })}
                  aria-invalid={!!errors.area_sm}
                />
                {errors.area_sm && <p className="text-xs text-red-500 mt-1">{errors.area_sm}</p>}
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
