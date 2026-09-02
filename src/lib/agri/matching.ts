import {
  SUPPLIERS,
  TRANSPORTERS,
  type Geo,
  type Grade,
  type Supplier,
  type Transporter,
} from "./data";

export type OrderItem = { crop: string; qtyKg: number; grade: Grade };

export type Allocation = {
  supplierId: string;
  supplierName: string;
  kind: "Farmer" | "FPO";
  location: Geo;
  qtyKg: number;
  grade: Grade;
  pricePerKg: number;
  distanceKm: number;
  score: number;
};

export type ItemMatch = {
  crop: string;
  requiredKg: number;
  matchedKg: number;
  grade: Grade;
  allocations: Allocation[];
  matchScore: number;
  produceCost: number;
};

export type RouteStop = {
  label: string;
  location: Geo;
  kind: "pickup" | "delivery" | "start";
  loadKg: number;
  legKm: number;
  cumulativeKm: number;
};

export type LogisticsPlan = {
  transporterId: string;
  transporter: Transporter;
  stops: RouteStop[];
  totalDistanceKm: number;
  totalLoadKg: number;
  cost: number;
  etaHours: number;
  utilization: number;
  score: number;
  alternatives: { transporterId: string; score: number; reason: string }[];
};

const GRADE_RANK: Record<Grade, number> = { A: 3, B: 2, C: 1 };

export function distanceKm(a: Geo, b: Geo) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const la1 = (a.lat * Math.PI) / 180;
  const la2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(h)) * 1.25);
}

function candidateScore(
  supplier: Supplier,
  price: number,
  grade: Grade,
  wanted: Grade,
  dist: number,
) {
  const gradeScore = GRADE_RANK[grade] >= GRADE_RANK[wanted] ? 100 : 55;
  const distScore = Math.max(0, 100 - dist * 0.55);
  const priceScore = Math.max(0, 100 - (price - 12) * 1.6);
  const trustScore = supplier.rating * 20;
  return Math.round(
    gradeScore * 0.34 + distScore * 0.26 + priceScore * 0.24 + trustScore * 0.16,
  );
}

export function matchItems(items: OrderItem[], destination: Geo): ItemMatch[] {
  return items.map((item) => {
    const candidates = SUPPLIERS.flatMap((s) =>
      s.listings
        .filter(
          (l) =>
            l.crop.toLowerCase() === item.crop.toLowerCase() &&
            GRADE_RANK[l.grade] >= GRADE_RANK[item.grade],
        )
        .map((l) => {
          const dist = distanceKm(s.location, destination);
          return {
            supplierId: s.id,
            supplierName: s.name,
            kind: s.kind,
            location: s.location,
            available: l.qtyKg,
            grade: l.grade,
            pricePerKg: l.pricePerKg,
            distanceKm: dist,
            score: candidateScore(s, l.pricePerKg, l.grade, item.grade, dist),
          };
        }),
    ).sort((a, b) => b.score - a.score);

    const allocations: Allocation[] = [];
    let remaining = item.qtyKg;
    for (const c of candidates) {
      if (remaining <= 0) break;
      // aggregate: never take more than 60% from one small farmer if others exist
      const cap = allocations.length === 0 && candidates.length > 2
        ? Math.min(c.available, Math.ceil(item.qtyKg * 0.45))
        : c.available;
      const take = Math.min(remaining, cap);
      if (take <= 0) continue;
      allocations.push({
        supplierId: c.supplierId,
        supplierName: c.supplierName,
        kind: c.kind,
        location: c.location,
        qtyKg: take,
        grade: c.grade,
        pricePerKg: c.pricePerKg,
        distanceKm: c.distanceKm,
        score: c.score,
      });
      remaining -= take;
    }

    const matchedKg = allocations.reduce((s, a) => s + a.qtyKg, 0);
    const produceCost = allocations.reduce((s, a) => s + a.qtyKg * a.pricePerKg, 0);
    const avgScore = allocations.length
      ? allocations.reduce((s, a) => s + a.score * a.qtyKg, 0) / matchedKg
      : 0;
    const fillRatio = item.qtyKg ? matchedKg / item.qtyKg : 0;

    return {
      crop: item.crop,
      requiredKg: item.qtyKg,
      matchedKg,
      grade: item.grade,
      allocations,
      matchScore: Math.min(99, Math.round(avgScore * 0.75 + fillRatio * 25)),
      produceCost: Math.round(produceCost),
    };
  });
}

export function planLogistics(
  matches: ItemMatch[],
  destination: Geo,
): LogisticsPlan | null {
  const pickupMap = new Map<string, { location: Geo; loadKg: number; items: string[] }>();
  for (const m of matches) {
    for (const a of m.allocations) {
      const cur = pickupMap.get(a.supplierId) ?? {
        location: a.location,
        loadKg: 0,
        items: [],
      };
      cur.loadKg += a.qtyKg;
      cur.items.push(`${a.qtyKg} kg ${m.crop}`);
      pickupMap.set(a.supplierId, cur);
    }
  }
  const pickups = [...pickupMap.entries()].map(([id, v]) => ({ id, ...v }));
  if (!pickups.length) return null;
  const totalLoadKg = pickups.reduce((s, p) => s + p.loadKg, 0);

  const scored = TRANSPORTERS.filter((t) => t.available).map((t) => {
    const capacityOk = t.capacityKg >= totalLoadKg;
    const nearestPickup = Math.min(...pickups.map((p) => distanceKm(t.location, p.location)));
    const util = Math.min(1, totalLoadKg / t.capacityKg);
    const score = Math.round(
      (capacityOk ? 100 : 25) * 0.45 +
        Math.max(0, 100 - nearestPickup * 0.9) * 0.25 +
        util * 100 * 0.15 +
        t.rating * 20 * 0.15,
    );
    return { t, score, capacityOk, nearestPickup, util };
  });
  scored.sort((a, b) => b.score - a.score);
  const best = scored[0];
  if (!best) return null;

  // Nearest-neighbour route optimisation from transporter → pickups → destination
  const remaining = [...pickups];
  let current: Geo = best.t.location;
  let cumulative = 0;
  let load = 0;
  const stops: RouteStop[] = [
    {
      label: `${best.t.driver} · ${best.t.vehicleType}`,
      location: best.t.location,
      kind: "start",
      loadKg: 0,
      legKm: 0,
      cumulativeKm: 0,
    },
  ];
  while (remaining.length) {
    remaining.sort(
      (a, b) =>
        distanceKm(current, a.location) +
        distanceKm(a.location, destination) * 0.35 -
        (distanceKm(current, b.location) + distanceKm(b.location, destination) * 0.35),
    );
    const next = remaining.shift()!;
    const leg = distanceKm(current, next.location);
    cumulative += leg;
    load += next.loadKg;
    stops.push({
      label: `${next.items.join(" + ")}`,
      location: next.location,
      kind: "pickup",
      loadKg: load,
      legKm: leg,
      cumulativeKm: cumulative,
    });
    current = next.location;
  }
  const finalLeg = distanceKm(current, destination);
  cumulative += finalLeg;
  stops.push({
    label: "Delivery",
    location: destination,
    kind: "delivery",
    loadKg: load,
    legKm: finalLeg,
    cumulativeKm: cumulative,
  });

  return {
    transporterId: best.t.id,
    transporter: best.t,
    stops,
    totalDistanceKm: cumulative,
    totalLoadKg,
    cost: Math.round(cumulative * best.t.ratePerKm + pickups.length * 250),
    etaHours: Math.round((cumulative / 38 + pickups.length * 0.4) * 10) / 10,
    utilization: Math.round(best.util * 100),
    score: best.score,
    alternatives: scored.slice(1, 4).map((s) => ({
      transporterId: s.t.id,
      score: s.score,
      reason: s.capacityOk
        ? `${s.nearestPickup} km from first pickup`
        : `Capacity ${s.t.capacityKg} kg < load`,
    })),
  };
}

export function inr(n: number) {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}
