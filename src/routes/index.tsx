import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Boxes,
  Leaf,
  MapPinned,
  Route as RouteIcon,
  ShoppingCart,
  Sprout,
  Truck,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Agri Connect — AI Farm-to-Market Platform" },
      {
        name: "description",
        content:
          "Agri Connect links farmers and FPOs directly with buyers and nearby transporters, using AI to match multi-product orders, aggregate supply and optimise delivery routes.",
      },
      { property: "og:title", content: "Agri Connect — AI Farm-to-Market Platform" },
      {
        property: "og:description",
        content:
          "Multi-product buyer orders, AI supply matching, multi-farmer aggregation and optimised transport routes.",
      },
    ],
  }),
  component: Landing,
});

const FLOW = [
  { label: "Multi-product buyer order", icon: ShoppingCart },
  { label: "AI supply matching", icon: Sparkles },
  { label: "Multi-farmer aggregation", icon: Boxes },
  { label: "Nearby transporter", icon: Truck },
  { label: "Optimised route", icon: RouteIcon },
  { label: "Delivery tracking", icon: MapPinned },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4 sm:px-6">
          <span className="brand-gradient flex size-9 items-center justify-center rounded-lg text-primary-foreground">
            <Leaf className="size-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight">Agri Connect</span>
          <Link
            to="/login"
            className="ml-auto inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Enter demo
          </Link>
        </div>
      </header>

      <section className="hero-surface border-b border-border">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="size-3.5" /> AI supply & logistics matching
            </span>
            <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Farm to market, without the middlemen.
            </h1>
            <p className="mt-4 max-w-xl text-base text-muted-foreground">
              One buyer order, many crops. Agri Connect matches every requirement to nearby
              farmers and FPOs, aggregates their supply, and books an existing transporter on an
              optimised pickup route.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/buyer/request"
                className="inline-flex h-11 items-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
              >
                Run the demo order <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex h-11 items-center rounded-md border border-input bg-background px-6 text-sm font-medium transition-colors hover:bg-accent"
              >
                Choose a role
              </Link>
            </div>
            <dl className="mt-10 grid grid-cols-3 gap-4 text-center">
              {[
                ["17%", "Higher farmer realisation"],
                ["0", "Trucks owned"],
                ["<60s", "Order to matched supply"],
              ].map(([v, l]) => (
                <div key={l} className="rounded-xl border border-border bg-background p-3">
                  <dt className="text-xl font-semibold text-primary">{v}</dt>
                  <dd className="mt-1 text-xs text-muted-foreground">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="card-elevated rounded-2xl border border-border bg-card p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Core workflow
            </p>
            <ol className="mt-4 space-y-3">
              {FLOW.map((f, i) => (
                <li key={f.label} className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <f.icon className="size-4" />
                  </span>
                  <span className="text-sm font-medium">{f.label}</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-semibold tracking-tight">Built for three sides of the trade</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            {
              icon: Sprout,
              title: "Farmer / FPO",
              body: "List produce, receive AI-matched buyer requests, accept and track earnings.",
              to: "/farmer" as const,
            },
            {
              icon: ShoppingCart,
              title: "Buyer",
              body: "Create one multi-product order and get aggregated supply with landed cost.",
              to: "/buyer" as const,
            },
            {
              icon: Truck,
              title: "Transporter",
              body: "Get nearby multi-pickup trips matched to your vehicle capacity and route.",
              to: "/transporter" as const,
            },
          ].map((c) => (
            <Link
              key={c.title}
              to={c.to}
              className="card-elevated group rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-lift"
            >
              <c.icon className="size-6 text-primary" />
              <h3 className="mt-4 font-semibold">{c.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.body}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Open dashboard <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        Agri Connect does not own trucks — it coordinates existing nearby transporters.
      </footer>
    </div>
  );
}
