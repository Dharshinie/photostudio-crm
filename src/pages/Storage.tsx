import { HardDrive, Plus, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const STORAGE_KEY = "studio-admin-storage-limit-gb";
const DEFAULT_LIMIT_GB = 100;
const USED_STORAGE_GB = 68;

export default function Storage() {
  const [storageLimitGb, setStorageLimitGb] = useState<number>(DEFAULT_LIMIT_GB);

  useEffect(() => {
    const savedLimit = window.localStorage.getItem(STORAGE_KEY);
    if (!savedLimit) {
      return;
    }

    const parsed = Number(savedLimit);
    if (!Number.isNaN(parsed) && parsed >= USED_STORAGE_GB) {
      setStorageLimitGb(parsed);
    }
  }, []);

  const freeStorageGb = Math.max(storageLimitGb - USED_STORAGE_GB, 0);
  const usagePercent = useMemo(() => Math.min((USED_STORAGE_GB / storageLimitGb) * 100, 100), [storageLimitGb]);

  const updateStorageLimit = (nextLimit: number) => {
    const safeLimit = Math.max(nextLimit, USED_STORAGE_GB);
    setStorageLimitGb(safeLimit);
    window.localStorage.setItem(STORAGE_KEY, String(safeLimit));
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <section className="glass overflow-hidden rounded-[2rem] border border-white/70 px-6 py-7 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-1 text-sm font-semibold text-sky-700">
              <ShieldCheck className="h-4 w-4" />
              Admin Storage Control
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">Storage Limit</h1>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
                Monitor available free storage and increase the storage limit for your admin workspace.
              </p>
            </div>
          </div>

          <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-slate-900 text-white shadow-lg shadow-slate-300/50">
            <HardDrive className="h-7 w-7" />
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <StorageStat label="Total Limit" value={`${storageLimitGb} GB`} helper="Current maximum storage capacity" tone="bg-slate-900 text-white" />
        <StorageStat label="Used Storage" value={`${USED_STORAGE_GB} GB`} helper="Storage already occupied" tone="bg-amber-500 text-white" />
        <StorageStat label="Free Storage" value={`${freeStorageGb} GB`} helper="Available storage remaining" tone="bg-emerald-600 text-white" />
      </section>

      <section className="card-soft rounded-[1.75rem] p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Usage Overview</h2>
            <p className="mt-1 text-sm text-slate-500">Free storage available is calculated from total limit minus used storage.</p>
          </div>
          <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
            {usagePercent.toFixed(0)}% used
          </div>
        </div>

        <div className="mt-5 rounded-[1.4rem] bg-slate-50 p-5">
          <div className="mb-3 flex items-center justify-between text-sm font-medium text-slate-600">
            <span>{USED_STORAGE_GB} GB used</span>
            <span>{freeStorageGb} GB free</span>
          </div>
          <Progress value={usagePercent} className="h-3 bg-slate-200" />
        </div>
      </section>

      <section className="card-soft rounded-[1.75rem] p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Increase Storage Limit</h2>
            <p className="mt-1 text-sm text-slate-500">Choose a quick increase amount or set a custom storage limit below.</p>
          </div>
          <div className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
            Admin can increase the limit anytime
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {[25, 50, 100].map((increment) => (
            <Button
              key={increment}
              variant="outline"
              onClick={() => updateStorageLimit(storageLimitGb + increment)}
              className="rounded-full border-slate-200 bg-white px-5 text-slate-700 hover:bg-slate-50"
            >
              <Plus className="mr-2 h-4 w-4 text-emerald-600" />
              Add {increment} GB
            </Button>
          ))}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto]">
          <div className="rounded-[1.4rem] border border-slate-200 bg-white p-4">
            <label htmlFor="storageLimit" className="text-sm font-semibold text-slate-700">
              Custom storage limit in GB
            </label>
            <input
              id="storageLimit"
              type="number"
              min={USED_STORAGE_GB}
              step={10}
              value={storageLimitGb}
              onChange={(event) => updateStorageLimit(Number(event.target.value) || USED_STORAGE_GB)}
              className="mt-3 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-800 outline-none transition focus:border-sky-400"
            />
          </div>

          <div className="flex items-end">
            <Button
              onClick={() => updateStorageLimit(storageLimitGb)}
              className="h-11 rounded-full bg-slate-900 px-6 text-white hover:bg-slate-800"
            >
              Save Limit
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function StorageStat({
  label,
  value,
  helper,
  tone,
}: {
  label: string;
  value: string;
  helper: string;
  tone: string;
}) {
  return (
    <div className="rounded-[1.6rem] border border-white/70 bg-white/85 p-5 shadow-lg shadow-slate-200/40">
      <div className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${tone}`}>
        {label}
      </div>
      <p className="mt-4 text-3xl font-bold tracking-tight text-slate-800">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-500">{helper}</p>
    </div>
  );
}
