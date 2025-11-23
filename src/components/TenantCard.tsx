import React from "react";
import { Tenant } from "@/types/tenant";

export default function TenantCard({ t }: { t: Tenant }) {
  return (
    <article className="bg-white/90 dark:bg-slate-900 shadow-sm rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
      <div className="sm:col-span-2">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{t.tenant_name}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          <span className="inline-block mr-2 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs">{t.tenant_type.replace("_"," ")}</span>
          {t.tenant_phone ? <span className="ml-2 text-sm">📞 {t.tenant_phone}</span> : null}
        </p>
        {t.tenant_address ? <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">📍 {t.tenant_address}</p> : null}
      </div>

      <div className="text-sm text-slate-700 dark:text-slate-300 flex flex-col gap-1 items-start sm:items-end">
        {t.booth_num ? (
          <div className="text-sm">
            <span className="text-xs text-slate-500 dark:text-slate-400">Booth</span>
            <div className="font-medium">{t.booth_num}</div>
          </div>
        ) : null}
        {t.area_sm ? (
          <div className="text-sm">
            <span className="text-xs text-slate-500 dark:text-slate-400">Area</span>
            <div className="font-medium">{t.area_sm} m²</div>
          </div>
        ) : null}
      </div>
    </article>
  );
}
