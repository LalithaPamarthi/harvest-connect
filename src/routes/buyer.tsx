import { createFileRoute, Link } from "@tanstack/react-router";
import { Boxes, IndianRupee, PackageCheck, Plus, Truck } from "lucide-react";
import { AppShell, ScorePill, Stat } from "@/components/agri/AppShell";
import { inr } from "@/lib/agri/matching";
import { orderTotals, useAgri } from "@/lib/agri/store";

export const Route = createFileRoute("/buyer")({
  head: () => ({
    meta: [
      { title: "Buyer Dashboard — Agri Connect" },
      {
        name: "description",
        content:
          "Track multi-product purchase requests, AI-matched supply, landed cost and transportation status in one buyer dashboard.",
      },
      { property: "og:title", content: "Buyer Dashboard — Agri Connect" },
      {
        property: "og:description",
        content: "Multi-product orders, matched supply and live transport status for wholesale buyers.",
      },
    ],
  }),
  component: BuyerDashboard,
});

function BuyerDashboard() {
  const orders = useAgri((s) => s.orders);
  const totals = orders.map(orderTotals);
  const totalKg = totals.reduce((s, t) => s + t.totalKg, 0);
  const spend = totals.reduce((s, t) => s + t.total, 0);
  const logistics = totals.reduce((s, t) => s + t.logistics, 0);

  return (
    <AppShell
      title="Buyer Dashboard"
      subtitle="Sri Balaji Wholesale Traders · Bowenpally, Hyderabad"
      actions={
        <Link
          to="/buyer/request"
          className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
        >
          <Plus className="size-4" /> Create purchase request
        </Link>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Active orders" value={String(orders.length)} icon={PackageCheck} />
        <Stat label="Total quantity" value={`${totalKg.toLocaleString("en-IN")} kg`} icon={Boxes} />
        <Stat label="Estimated cost" value={inr(spend)} icon={IndianRupee} hint="Produce + logistics + fee" />
        <Stat label="Logistics cost" value={inr(logistics)} icon={Truck} />
      </div>

      <h2 className="mt-10 text-lg font-semibold">Orders</h2>
      <div className="mt-4 space-y-4">
        {orders.map((o) => {
          const t = orderTotals(o);
          const avg = Math.round(
            o.matches.reduce((s, m) => s + m.matchScore, 0) / Math.max(1, o.matches.length),
          );
          return (
            <Link
              key={o.id}
              to="/orders/$orderId"
              params={{ orderId: o.id }}
              className="card-elevated block rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-lift"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-semibold">Order {o.id}</span>
                <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                  {o.transportStatus}
                </span>
                <ScorePill score={avg} />
                <span className="ml-auto text-sm text-muted-foreground">
                  Deliver by {o.requiredDate}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {o.matches.map((m) => (
                  <span
                    key={m.crop}
                    className="rounded-md border border-border px-2.5 py-1 text-xs"
                  >
                    {m.crop} · {m.matchedKg.toLocaleString("en-IN")}/{m.requiredKg.toLocaleString("en-IN")} kg · Grade {m.grade}
                  </span>
                ))}
              </div>
              <div className="mt-4 grid gap-3 text-sm sm:grid-cols-4">
                <Info label="Sources" value={`${new Set(o.matches.flatMap((m) => m.allocations.map((a) => a.supplierId))).size} farmers/FPOs`} />
                <Info label="Produce cost" value={inr(t.produce)} />
                <Info label="Logistics" value={inr(t.logistics)} />
                <Info label="Landed total" value={inr(t.total)} />
              </div>
            </Link>
          );
        })}
      </div>
    </AppShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
