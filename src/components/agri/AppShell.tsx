import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Leaf, LogOut, ShoppingCart, Sprout, Truck } from "lucide-react";
import type { ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DASHBOARD_PATH, ROLE_LABEL, displayName, useProfile } from "@/lib/auth";

const ROLE_NAV = {
  farmer: [{ to: DASHBOARD_PATH.farmer, label: "Farmer / FPO", icon: Sprout }],
  buyer: [
    { to: DASHBOARD_PATH.buyer, label: "Dashboard", icon: ShoppingCart },
    { to: "/buyer/request", label: "New request", icon: Leaf },
  ],
  transporter: [{ to: DASHBOARD_PATH.transporter, label: "Transporter", icon: Truck }],
} as const;

export function AppShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const { data: profile } = useProfile();
  const navigate = useNavigate();
  const router = useRouter();
  const queryClient = useQueryClient();
  const nav = profile ? ROLE_NAV[profile.role] : [];

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    await router.invalidate();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="brand-gradient flex size-8 items-center justify-center rounded-lg text-primary-foreground">
              <Leaf className="size-4" />
            </span>
            Agri Connect
          </Link>
          <nav className="ml-auto flex items-center gap-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeProps={{ className: "bg-accent text-accent-foreground" }}
                className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <n.icon className="size-4" />
                <span className="hidden sm:inline">{n.label}</span>
              </Link>
            ))}
            {profile ? (
              <div className="ml-2 flex items-center gap-2 border-l border-border pl-3">
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-medium leading-tight">{displayName(profile)}</p>
                  <p className="text-xs text-muted-foreground">{ROLE_LABEL[profile.role]}</p>
                </div>
                <button
                  onClick={signOut}
                  aria-label="Sign out"
                  className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <LogOut className="size-4" />
                </button>
              </div>
            ) : null}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
            {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
          </div>
          {actions}
        </div>
        {children}
      </main>
    </div>
  );
}

export function Stat({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="card-elevated rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        {Icon ? <Icon className="size-4 text-primary" /> : null}
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function ScorePill({ score }: { score: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground">
      AI Match {score}%
    </span>
  );
}
