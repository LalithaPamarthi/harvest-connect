import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Leaf, ShoppingCart, Sprout, Truck } from "lucide-react";
import { actions } from "@/lib/agri/store";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Choose your role — Agri Connect" },
      {
        name: "description",
        content:
          "Enter the Agri Connect demo as a farmer/FPO, wholesale buyer or transporter and follow the full order journey.",
      },
      { property: "og:title", content: "Choose your role — Agri Connect" },
      {
        property: "og:description",
        content: "Farmer/FPO, buyer or transporter — pick a role to explore the demo.",
      },
    ],
  }),
  component: LoginPage,
});

const ROLES = [
  {
    role: "farmer" as const,
    to: "/farmer" as const,
    icon: Sprout,
    title: "Farmer / FPO",
    body: "List produce, respond to AI-matched buyer requests, track earnings.",
    demo: "Ramesh Yadav · Shamirpet",
  },
  {
    role: "buyer" as const,
    to: "/buyer" as const,
    icon: ShoppingCart,
    title: "Buyer",
    body: "Create multi-product purchase requests and track landed cost.",
    demo: "Sri Balaji Wholesale Traders · Hyderabad",
  },
  {
    role: "transporter" as const,
    to: "/transporter" as const,
    icon: Truck,
    title: "Transporter",
    body: "Accept nearby multi-pickup trips and update delivery status.",
    demo: "Ravi Kumar · TS 09 UB 4412",
  },
];

function LoginPage() {
  const navigate = useNavigate();
  return (
    <div className="hero-surface flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2 font-semibold">
          <span className="brand-gradient flex size-9 items-center justify-center rounded-lg text-primary-foreground">
            <Leaf className="size-5" />
          </span>
          Agri Connect
        </Link>
        <h1 className="text-center text-3xl font-semibold tracking-tight">Continue as</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Demo accounts are pre-loaded with realistic Telangana supply data.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {ROLES.map((r) => (
            <button
              key={r.role}
              onClick={() => {
                actions.setRole(r.role);
                navigate({ to: r.to });
              }}
              className="card-elevated cursor-pointer rounded-xl border border-border bg-card p-6 text-left transition-shadow hover:shadow-lift"
            >
              <r.icon className="size-6 text-primary" />
              <h2 className="mt-4 font-semibold">{r.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{r.body}</p>
              <p className="mt-4 text-xs font-medium text-primary">{r.demo}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
