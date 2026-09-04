import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Leaf, Loader2, ShoppingCart, Sprout, Truck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DASHBOARD_PATH, type Role } from "@/lib/auth";

type Mode = "login" | "signup";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): { mode: Mode } => ({
    mode: search['mode'] === "signup" ? "signup" : "login",
  }),
  head: () => ({
    meta: [
      { title: "Log in or sign up — Agri Connect" },
      {
        name: "description",
        content:
          "Create an Agri Connect account as a farmer/FPO, wholesale buyer or transporter, or log in to your role dashboard.",
      },
      { property: "og:title", content: "Log in or sign up — Agri Connect" },
      {
        property: "og:description",
        content: "Role-based access for farmers, FPOs, buyers and transporters.",
      },
    ],
  }),
  component: AuthPage,
});

const ROLES: { role: Role; title: string; icon: typeof Sprout }[] = [
  { role: "farmer", title: "Farmer / FPO", icon: Sprout },
  { role: "buyer", title: "Buyer", icon: ShoppingCart },
  { role: "transporter", title: "Transporter", icon: Truck },
];

const input =
  "h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring";

function AuthPage() {
  const { mode } = Route.useSearch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [role, setRole] = useState<Role>("buyer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fields, setFields] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const set = (k: string, v: string) => setFields((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    let active = true;
    void (async () => {
      const { data } = await supabase.auth.getUser();
      if (!active || !data.user) return;
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .maybeSingle();
      if (profile) navigate({ to: DASHBOARD_PATH[profile.role], replace: true });
    })();
    return () => {
      active = false;
    };
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              role,
              full_name: fields['full_name'] ?? fields['fleet_owner'] ?? "",
              phone: fields['phone'] ?? "",
              village: fields['village'] ?? "",
              company_name: fields['company_name'] ?? "",
              business_email: fields['business_email'] ?? email,
              gst_id: fields['gst_id'] ?? "",
              billing_address: fields['billing_address'] ?? "",
              vehicle_type: fields['vehicle_type'] ?? "",
              capacity_tons: fields['capacity_tons'] ?? "",
            },
          },
        });
        if (signUpError) throw signUpError;
        if (!data.session) {
          setError("Account created. Check your email to confirm, then log in.");
          setBusy(false);
          return;
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
      }

      await queryClient.invalidateQueries();
      const { data: auth } = await supabase.auth.getUser();
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", auth.user!.id)
        .maybeSingle();
      navigate({ to: DASHBOARD_PATH[profile?.role ?? role], replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setBusy(false);
    }
  }

  return (
    <div className="hero-surface flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2 font-semibold">
          <span className="brand-gradient flex size-9 items-center justify-center rounded-lg text-primary-foreground">
            <Leaf className="size-5" />
          </span>
          Agri Connect
        </Link>

        <div className="card-elevated rounded-2xl border border-border bg-card p-6">
          <div className="grid grid-cols-2 gap-1 rounded-lg bg-secondary p-1">
            {(["login", "signup"] as const).map((m) => (
              <Link
                key={m}
                to="/auth"
                search={{ mode: m }}
                replace
                className={`rounded-md py-2 text-center text-sm font-medium transition-colors ${
                  mode === m
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {m === "login" ? "Log In" : "Sign Up"}
              </Link>
            ))}
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            {mode === "signup" ? (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  I am a
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {ROLES.map((r) => (
                    <button
                      key={r.role}
                      type="button"
                      onClick={() => setRole(r.role)}
                      className={`rounded-lg border p-3 text-center text-xs font-medium transition-colors ${
                        role === r.role
                          ? "border-primary bg-accent text-accent-foreground"
                          : "border-border hover:bg-accent"
                      }`}
                    >
                      <r.icon className="mx-auto mb-1.5 size-5 text-primary" />
                      {r.title}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <Field label="Email">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={input}
                autoComplete="email"
              />
            </Field>
            <Field label="Password">
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={input}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
              />
            </Field>

            {mode === "signup" && role === "farmer" ? (
              <>
                <Field label="Full name">
                  <input required className={input} onChange={(e) => set("full_name", e.target.value)} />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Phone">
                    <input required className={input} onChange={(e) => set("phone", e.target.value)} />
                  </Field>
                  <Field label="Village / location">
                    <input required className={input} onChange={(e) => set("village", e.target.value)} />
                  </Field>
                </div>
              </>
            ) : null}

            {mode === "signup" && role === "buyer" ? (
              <>
                <Field label="Company name">
                  <input
                    required
                    className={input}
                    onChange={(e) => set("company_name", e.target.value)}
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Business email">
                    <input
                      type="email"
                      className={input}
                      onChange={(e) => set("business_email", e.target.value)}
                    />
                  </Field>
                  <Field label="GST / Tax ID">
                    <input required className={input} onChange={(e) => set("gst_id", e.target.value)} />
                  </Field>
                </div>
                <Field label="Billing address">
                  <input
                    required
                    className={input}
                    onChange={(e) => set("billing_address", e.target.value)}
                  />
                </Field>
              </>
            ) : null}

            {mode === "signup" && role === "transporter" ? (
              <>
                <Field label="Fleet owner name">
                  <input
                    required
                    className={input}
                    onChange={(e) => set("fleet_owner", e.target.value)}
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Vehicle type">
                    <select
                      className={input}
                      defaultValue="Truck · 6 Tyre"
                      onChange={(e) => set("vehicle_type", e.target.value)}
                    >
                      {["Truck · 6 Tyre", "Mini Truck", "Refrigerated Truck", "Pickup Van"].map(
                        (v) => (
                          <option key={v}>{v}</option>
                        ),
                      )}
                    </select>
                  </Field>
                  <Field label="Load capacity (tons)">
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      required
                      className={input}
                      onChange={(e) => set("capacity_tons", e.target.value)}
                    />
                  </Field>
                </div>
              </>
            ) : null}

            {error ? (
              <p className="rounded-md bg-secondary px-3 py-2 text-sm text-foreground">{error}</p>
            ) : null}

            <button
              type="submit"
              disabled={busy}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
            >
              {busy ? <Loader2 className="size-4 animate-spin" /> : null}
              {mode === "signup" ? "Create account" : "Log in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
