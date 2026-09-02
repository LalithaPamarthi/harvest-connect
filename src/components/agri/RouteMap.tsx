import type { LogisticsPlan } from "@/lib/agri/matching";

export function RouteMap({ plan, activeIndex }: { plan: LogisticsPlan; activeIndex?: number }) {
  const pts = plan.stops.map((s) => s.location);
  const lats = pts.map((p) => p.lat);
  const lngs = pts.map((p) => p.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const pad = 60;
  const W = 720;
  const H = 420;
  const x = (lng: number) =>
    pad + ((lng - minLng) / Math.max(0.0001, maxLng - minLng)) * (W - pad * 2);
  const y = (lat: number) =>
    H - pad - ((lat - minLat) / Math.max(0.0001, maxLat - minLat)) * (H - pad * 2);

  const path = plan.stops.map((s) => `${x(s.location.lng)},${y(s.location.lat)}`).join(" ");

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Optimized route map">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0V40" fill="none" stroke="var(--color-border)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width={W} height={H} fill="var(--color-surface)" />
        <rect width={W} height={H} fill="url(#grid)" />
        <polyline
          points={path}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="3"
          strokeDasharray="10 8"
          strokeLinejoin="round"
        />
        {plan.stops.map((s, i) => {
          const cx = x(s.location.lng);
          const cy = y(s.location.lat);
          const isActive = activeIndex === i;
          const fill =
            s.kind === "start"
              ? "var(--color-warning)"
              : s.kind === "delivery"
                ? "var(--color-info)"
                : "var(--color-primary)";
          return (
            <g key={`${s.label}-${i}`}>
              {isActive ? <circle cx={cx} cy={cy} r={18} fill={fill} opacity="0.2" /> : null}
              <circle cx={cx} cy={cy} r={11} fill={fill} />
              <text
                x={cx}
                y={cy + 4}
                textAnchor="middle"
                fontSize="11"
                fontWeight="700"
                fill="white"
              >
                {s.kind === "start" ? "T" : s.kind === "delivery" ? "B" : i}
              </text>
              <text
                x={cx}
                y={cy - 18}
                textAnchor="middle"
                fontSize="11"
                fill="var(--color-foreground)"
              >
                {s.location.name.split(",")[0]}
              </text>
              <text
                x={cx}
                y={cy + 26}
                textAnchor="middle"
                fontSize="10"
                fill="var(--color-muted-foreground)"
              >
                {s.kind === "start" ? "Transporter" : s.kind === "delivery" ? "Buyer" : `${s.legKm} km`}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="flex flex-wrap items-center gap-4 border-t border-border px-4 py-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-warning" /> Transporter start
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-primary" /> Pickup point
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-info" /> Buyer destination
        </span>
        <span className="ml-auto font-medium text-foreground">
          {plan.totalDistanceKm} km · ETA {plan.etaHours} h
        </span>
      </div>
    </div>
  );
}
