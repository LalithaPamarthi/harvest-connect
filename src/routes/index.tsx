import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Leaf, ShoppingCart, Sprout, Truck, Sparkles } from "lucide-react";

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

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4 sm:px-6">
          <span className="brand-gradient flex size-9 items-center justify-center rounded-lg text-primary-foreground">
            <Leaf className="size-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight">Agri Connect</span>
          <div className="ml-auto flex items-center gap-2">
            <Link
              to="/auth"
              search={{ mode: "login" as const }}
              className="inline-flex h-9 items-center rounded-md border border-input bg-background px-4 text-sm font-medium transition-colors hover:bg-accent"
            >
              Log In
            </Link>
            <Link
              to="/auth"
              search={{ mode: "signup" as const }}
              className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <section className="hero-surface border-b border-border">
        <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="size-3.5" /> AI supply & logistics matching
          </span>
          <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Farm to market, without the middlemen.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground">
            One buyer order, many crops. Agri Connect matches every requirement to nearby farmers
            and FPOs, aggregates their supply, and books an existing transporter on an optimised
            pickup route.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/auth"
              search={{ mode: "signup" as const }}
              className="inline-flex h-11 items-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              Get Started <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/auth"
              search={{ mode: "login" as const }}
              className="inline-flex h-11 items-center rounded-md border border-input bg-background px-6 text-sm font-medium transition-colors hover:bg-accent"
            >
              Log In
            </Link>
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
            },
            {
              icon: ShoppingCart,
              title: "Buyer",
              body: "Create one multi-product order and get aggregated supply with landed cost.",
            },
            {
              icon: Truck,
              title: "Transporter",
              body: "Get nearby multi-pickup trips matched to your vehicle capacity and route.",
            },
          ].map((c) => (
            <div
              key={c.title}
              className="card-elevated rounded-xl border border-border bg-card p-6"
            >
              <c.icon className="size-6 text-primary" />
              <h3 className="mt-4 font-semibold">{c.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        Agri Connect does not own trucks — it coordinates existing nearby transporters.
      </footer>
    </div>
  );
}
