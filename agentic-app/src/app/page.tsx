"use client";

import {
  AlarmClock,
  Edit3,
  Loader2,
  MoonStar,
  PlusCircle,
  Printer,
  RefreshCcw,
  Search,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";

type WeighEntry = {
  id: string;
  plateNumber: string;
  yukBilan: number;
  yuksiz: number;
  sofVazin: number;
  date: string;
  price: number;
  checkNumber: string;
};

type FormState = {
  plateNumber: string;
  yukBilan: string;
  yuksiz: string;
  date: string;
  price: string;
  checkNumber: string;
};

const baseFormDefaults: Omit<FormState, "date"> = {
  plateNumber: "",
  yukBilan: "",
  yuksiz: "",
  price: "30000",
  checkNumber: "",
};

const buildDefaultForm = (): FormState => ({
  ...baseFormDefaults,
  date: new Date().toISOString().slice(0, 10),
});

const randomId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

function AlarmBadge() {
  return (
    <div className="flex items-center gap-2 rounded-full bg-red-600/90 px-4 py-1 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-red-900/40">
      <span className="relative flex size-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-200 opacity-75" />
        <span className="relative inline-flex size-2 rounded-full bg-white" />
      </span>
      <AlarmClock className="size-4 animate-pulse" />
      Alarm Active
    </div>
  );
}

function camelLogo() {
  return (
    <div className="flex items-center gap-3 text-white">
      <span className="text-3xl leading-none">🐫🐫</span>
      <div>
        <p className="text-xs uppercase tracking-[0.4em] opacity-80">
          Caravan Weighing
        </p>
        <p className="text-xl font-semibold leading-tight">Desert Balance</p>
      </div>
    </div>
  );
}

function calculateSofVazin(yukBilan: string, yuksiz: string) {
  const loaded = Number.parseFloat(yukBilan) || 0;
  const empty = Number.parseFloat(yuksiz) || 0;
  const result = loaded - empty;
  return Number.isFinite(result) ? Number(result.toFixed(2)) : 0;
}

export default function Home() {
  const [entries, setEntries] = useState<WeighEntry[]>(() => [
    {
      id: randomId(),
      plateNumber: "UZX 001",
      yukBilan: 52000,
      yuksiz: 21000,
      sofVazin: 31000,
      date: new Date().toISOString().slice(0, 10),
      price: 40000,
      checkNumber: "CHK-5521",
    },
    {
      id: randomId(),
      plateNumber: "UZX 245",
      yukBilan: 47850,
      yuksiz: 19850,
      sofVazin: 28000,
      date: new Date().toISOString().slice(0, 10),
      price: 30000,
      checkNumber: "CHK-4450",
    },
  ]);
  const [form, setForm] = useState<FormState>(buildDefaultForm());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEntries = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      return entries;
    }
    return entries.filter((entry) =>
      Object.values(entry).some((value) =>
        String(value).toLowerCase().includes(term),
      ),
    );
  }, [entries, searchTerm]);

  const sofVazin = calculateSofVazin(form.yukBilan, form.yuksiz);

  const handleChange = (field: keyof FormState) => (event: {
    target: { value: string };
  }) => {
    setForm((previous) => ({ ...previous, [field]: event.target.value }));
  };

  const resetForm = () => {
    setForm(buildDefaultForm());
    setEditingId(null);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.plateNumber.trim()) return;
    const payload: WeighEntry = {
      id: editingId ?? randomId(),
      plateNumber: form.plateNumber.trim(),
      yukBilan: Number.parseFloat(form.yukBilan) || 0,
      yuksiz: Number.parseFloat(form.yuksiz) || 0,
      sofVazin,
      date: form.date || new Date().toISOString().slice(0, 10),
      price: Number.parseFloat(form.price) || 0,
      checkNumber: form.checkNumber.trim() || "N/A",
    };

    setEntries((previous) => {
      if (editingId) {
        return previous.map((entry) =>
          entry.id === editingId ? payload : entry,
        );
      }
      return [payload, ...previous];
    });
    resetForm();
  };

  const handleEdit = (entry: WeighEntry) => {
    setEditingId(entry.id);
    setForm({
      plateNumber: entry.plateNumber,
      yukBilan: entry.yukBilan.toString(),
      yuksiz: entry.yuksiz.toString(),
      date: entry.date,
      price: entry.price.toString(),
      checkNumber: entry.checkNumber,
    });
  };

  const handleDelete = (id: string) => {
    setEntries((previous) => previous.filter((entry) => entry.id !== id));
    if (editingId === id) {
      resetForm();
    }
  };

  const handleRelay = () => {
    setEntries((previous) =>
      previous.map((entry) => ({
        ...entry,
        sofVazin: Number((entry.yukBilan - entry.yuksiz).toFixed(2)),
      })),
    );
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleReload = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1548777123-8d084a5ad6b9?auto=format&fit=crop&w=1920&q=80')",
      }}
    >
      <div className="min-h-screen bg-gradient-to-br from-black/70 via-black/55 to-black/80 p-6 text-white sm:p-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
          <header className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
              {camelLogo()}
              <AlarmBadge />
            </div>
            <div className="flex w-full max-w-md items-center gap-3 rounded-full border border-white/20 bg-black/30 px-4 py-2 backdrop-blur">
              <MoonStar className="size-5 text-yellow-300" />
              <Search className="size-5 text-white/60" />
              <input
                className="h-9 flex-1 bg-transparent text-sm text-white placeholder-white/50 outline-none"
                placeholder="Search caravan records..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
          </header>

          <section className="grid gap-6 lg:grid-cols-[360px_1fr]">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-md"
            >
              <h2 className="text-lg font-semibold uppercase tracking-wide text-white/80">
                Data Entry Fields
              </h2>
              <div className="grid gap-3">
                <label className="text-xs font-semibold uppercase tracking-widest text-white/60">
                  Plate Number
                  <input
                    className="mt-1 w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-yellow-300"
                    value={form.plateNumber}
                    onChange={handleChange("plateNumber")}
                    placeholder="e.g. UZX 123"
                    required
                  />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="text-xs font-semibold uppercase tracking-widest text-white/60">
                    Yuk bilan (Kg)
                    <input
                      type="number"
                      min="0"
                      className="mt-1 w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-yellow-300"
                      value={form.yukBilan}
                      onChange={handleChange("yukBilan")}
                      placeholder="Loaded weight"
                      required
                    />
                  </label>
                  <label className="text-xs font-semibold uppercase tracking-widest text-white/60">
                    Yuksiz (Kg)
                    <input
                      type="number"
                      min="0"
                      className="mt-1 w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-yellow-300"
                      value={form.yuksiz}
                      onChange={handleChange("yuksiz")}
                      placeholder="Empty weight"
                      required
                    />
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-xs font-semibold uppercase tracking-widest text-white/60">
                    Sof Vazin (Kg)
                    <div className="mt-1 flex h-10 items-center rounded-lg border border-yellow-300/60 bg-black/40 px-3 text-sm font-semibold text-yellow-200">
                      {Number.isFinite(sofVazin) ? sofVazin.toLocaleString() : 0}
                    </div>
                  </div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-white/60">
                    Date
                    <input
                      type="date"
                      className="mt-1 w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-yellow-300"
                      value={form.date}
                      onChange={handleChange("date")}
                      required
                    />
                  </label>
                </div>
                <label className="text-xs font-semibold uppercase tracking-widest text-white/60">
                  Summa (Price)
                  <input
                    type="number"
                    min="0"
                    className="mt-1 w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-yellow-300"
                    value={form.price}
                    onChange={handleChange("price")}
                    placeholder="30,000"
                  />
                </label>
                <label className="text-xs font-semibold uppercase tracking-widest text-white/60">
                  Check Number (Add-on)
                  <input
                    className="mt-1 w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-yellow-300"
                    value={form.checkNumber}
                    onChange={handleChange("checkNumber")}
                    placeholder="e.g. CHK-4450"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-lg bg-yellow-400/90 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-black transition hover:bg-yellow-300"
                >
                  <PlusCircle className="size-4" />
                  {editingId ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex items-center justify-center gap-2 rounded-lg border border-white/30 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white/80 transition hover:bg-white/10"
                >
                  <Loader2 className="size-4 animate-spin" />
                  Clear
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleRelay}
                  className="flex items-center justify-center gap-2 rounded-lg border border-yellow-300/60 bg-yellow-400/20 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-yellow-200 transition hover:bg-yellow-400/30"
                >
                  Relay
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex items-center justify-center gap-2 rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-white/20"
                >
                  <Printer className="size-4" />
                  Print
                </button>
              </div>
              <button
                type="button"
                onClick={handleReload}
                className="flex items-center justify-center gap-2 rounded-lg border border-white/30 bg-black/40 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-black/60"
              >
                <RefreshCcw className="size-4" />
                Reload
              </button>
            </form>

            <section className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/50 p-6 backdrop-blur-md">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-semibold uppercase tracking-wide text-white/80">
                  Caravan Ledger
                </h2>
                <p className="text-xs uppercase tracking-widest text-yellow-300/90">
                  Add · Delete · Edit · Relay
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/10 text-left text-sm">
                  <thead>
                    <tr className="text-xs uppercase tracking-widest text-white/60">
                      <th className="px-4 py-3">Plate_Number</th>
                      <th className="px-4 py-3">Yuk_bilan</th>
                      <th className="px-4 py-3">Sana (Date)</th>
                      <th className="px-4 py-3">Yuksiz</th>
                      <th className="px-4 py-3">Sof_Vazin</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3">Check No.</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredEntries.map((entry) => {
                      const entryMatchesSearch =
                        searchTerm.trim().length > 0 &&
                        Object.values(entry).some((value) =>
                          String(value)
                            .toLowerCase()
                            .includes(searchTerm.trim().toLowerCase()),
                        );
                      return (
                        <tr
                          key={entry.id}
                          className={`transition ${
                            entryMatchesSearch ? "text-red-400" : "text-white/80"
                          }`}
                        >
                          <td className="px-4 py-3 font-semibold">
                            {entry.plateNumber}
                          </td>
                          <td className="px-4 py-3">
                            {entry.yukBilan.toLocaleString()} kg
                          </td>
                          <td className="px-4 py-3">{entry.date}</td>
                          <td className="px-4 py-3">
                            {entry.yuksiz.toLocaleString()} kg
                          </td>
                          <td className="px-4 py-3">
                            {entry.sofVazin.toLocaleString()} kg
                          </td>
                          <td className="px-4 py-3">
                            {entry.price.toLocaleString()} uzs
                          </td>
                          <td className="px-4 py-3">{entry.checkNumber}</td>
                          <td className="px-4 py-3">
                            <div className="flex justify-end gap-2 text-xs uppercase tracking-wide">
                              <button
                                type="button"
                                onClick={() => handleEdit(entry)}
                                className="flex items-center gap-1 rounded-full border border-white/30 px-3 py-1 text-white/80 transition hover:bg-white/10"
                              >
                                <Edit3 className="size-3.5" />
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(entry.id)}
                                className="flex items-center gap-1 rounded-full border border-red-400/50 px-3 py-1 text-red-300 transition hover:bg-red-500/20"
                              >
                                <Trash2 className="size-3.5" />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredEntries.length === 0 && (
                      <tr>
                        <td
                          colSpan={8}
                          className="px-4 py-10 text-center text-sm uppercase tracking-widest text-white/50"
                        >
                          No records yet. Add a caravan entry to get started.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </section>
        </div>
      </div>
    </div>
  );
}
