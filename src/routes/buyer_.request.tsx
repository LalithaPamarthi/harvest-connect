import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Search, Trash2, Sparkles } from "lucide-react";
import { AppShell } from "@/components/agri/AppShell";
import { CROPS, DEMO_ITEMS, HYDERABAD, type Grade } from "@/lib/agri/data";
import { actions } from "@/lib/agri/store";

export const Route = createFileRoute("/buyer_/request")({
  head: () => ({
    meta: [
      { title: "Multi-Product Purchase Request — Agri Connect" },
      {
        name: "description",
        content:
          "Add multiple vegetables with quantity and grade in a single purchase request and let AI find matching farmers, FPOs and transporters.",
      },
      { property: "og:title", content: "Multi-Product Purchase Request — Agri Connect" },
      {
        property: "og:description",
        content: "One order, many crops — AI matches supply and logistics instantly.",
      },
    ],
  }),
  component: RequestPage,
});

type Row = { crop: string; qty: string; grade: Grade };

const DEFAULT_ROWS: Row[] = DEMO_ITEMS.map((i) => ({
  crop: i.crop,
  qty: String(i.qtyKg),
  grade: i.grade,
}));

function RequestPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Row[]>(DEFAULT_ROWS);
  const [location, setLocation] = useState(HYDERABAD.name);
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().slice(0, 10);
  });

  const update = (i: number, patch: Partial<Row>) =>
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));

  const totalKg = rows.reduce((s, r) => s + (Number(r.qty) || 0), 0);

  const submit = () => {
    const items = rows
      .filter((r) => r.crop && Number(r.qty) > 0)
      .map((r) => ({ crop: r.crop, qtyKg: Number(r.qty), grade: r.grade }));
    if (!items.length) return;
    const order = actions.createOrder(items, { ...HYDERABAD, name: location }, date);
    navigate({ to: "/orders/$orderId", params: { orderId: order.id } });
  };

  return (
    <AppShell
      title="Create Purchase Request"
      subtitle="Add every product you need — AI matches each line to the best farmers and FPOs."
    >
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="card-elevated rounded-xl border border-border bg-card p-5">
          <div className="hidden grid-cols-[2fr_1fr_1fr_auto] gap-3 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:grid">
            <span>Product</span>
            <span>Quantity (kg)</span>
            <span>Grade</span>
            <span />
          </div>
          <div className="space-y-3">
            {rows.map((row, i) => (
              <div key={i} className="grid grid-cols-1 gap-3 sm:grid-cols-[2fr_1fr_1fr_auto]">
                <select
                  value={row.crop}
                  onChange={(e) => update(i, { crop: e.target.value })}
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                  aria-label="Product"
                >
                  {CROPS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min={1}
                  value={row.qty}
                  onChange={(e) => update(i, { qty: e.target.value })}
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                  aria-label="Quantity in kg"
                />
                <select
                  value={row.grade}
                  onChange={(e) => update(i, { grade: e.target.value as Grade })}
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                  aria-label="Grade"
                >
                  {(["A", "B", "C"] as Grade[]).map((g) => (
                    <option key={g} value={g}>
                      Grade {g}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setRows((r) => r.filter((_, idx) => idx !== i))}
                  disabled={rows.length === 1}
                  className="inline-flex h-10 cursor-pointer items-center justify-center rounded-md border border-input px-3 text-muted-foreground transition-colors hover:bg-accent disabled:opacity-40"
                  aria-label="Remove product"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => setRows((r) => [...r, { crop: "Potato", qty: "100", grade: "A" }])}
            className="mt-4 inline-flex h-10 cursor-pointer items-center gap-2 rounded-md border border-dashed border-input px-4 text-sm font-medium transition-colors hover:bg-accent"
          >
            <Plus className="size-4" /> Add another product
          </button>

          <div className="mt-6 grid gap-4 border-t border-border pt-6 sm:grid-cols-2">
            <label className="text-sm">
              <span className="mb-1.5 block font-medium">Delivery location</span>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              />
            </label>
            <label className="text-sm">
              <span className="mb-1.5 block font-medium">Required date</span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              />
            </label>
          </div>

          <button
            onClick={submit}
            className="mt-6 inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            <Search className="size-4" /> Find supply
          </button>
        </div>

        <aside className="card-elevated h-fit rounded-xl border border-border bg-card p-5">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <Sparkles className="size-4 text-primary" /> What AI will do
          </p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>• Match each product line to graded supply</li>
            <li>• Aggregate multiple farmers into one lot</li>
            <li>• Prefer geographically efficient sources</li>
            <li>• Find nearby transporters with enough capacity</li>
            <li>• Combine pickups and optimise the route</li>
          </ul>
          <div className="mt-5 rounded-lg bg-secondary p-4">
            <p className="text-xs text-muted-foreground">Order size</p>
            <p className="text-2xl font-semibold">{totalKg.toLocaleString("en-IN")} kg</p>
            <p className="mt-1 text-xs text-muted-foreground">{rows.length} product lines</p>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
