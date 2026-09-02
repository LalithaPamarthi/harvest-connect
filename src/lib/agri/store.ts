import { useSyncExternalStore } from "react";
import { DEMO_ITEMS, HYDERABAD, type Geo } from "./data";
import {
  matchItems,
  planLogistics,
  type ItemMatch,
  type LogisticsPlan,
  type OrderItem,
} from "./matching";

export type TransportStatus =
  | "Pending"
  | "Accepted"
  | "Pickup"
  | "In Transit"
  | "Delivered";

export type Order = {
  id: string;
  buyer: string;
  createdAt: string;
  requiredDate: string;
  destination: Geo;
  items: OrderItem[];
  matches: ItemMatch[];
  logistics: LogisticsPlan | null;
  farmerResponses: Record<string, "pending" | "accepted" | "rejected">;
  transportStatus: TransportStatus;
};

type State = { role: Role | null; orders: Order[] };
export type Role = "farmer" | "buyer" | "transporter";

const KEY = "agri-connect-state-v1";

function buildOrder(
  items: OrderItem[],
  destination: Geo,
  requiredDate: string,
  buyer = "Sri Balaji Wholesale Traders, Hyderabad",
): Order {
  const matches = matchItems(items, destination);
  const logistics = planLogistics(matches, destination);
  const farmerResponses: Record<string, "pending" | "accepted" | "rejected"> = {};
  matches.forEach((m) => m.allocations.forEach((a) => (farmerResponses[a.supplierId] = "pending")));
  return {
    id: `AC-${Math.floor(1000 + Math.random() * 9000)}`,
    buyer,
    createdAt: new Date().toISOString(),
    requiredDate,
    destination,
    items,
    matches,
    logistics,
    farmerResponses,
    transportStatus: "Pending",
  };
}

export function createDemoOrder(): Order {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  return buildOrder(DEMO_ITEMS, HYDERABAD, d.toISOString().slice(0, 10));
}

function initial(): State {
  return { role: null, orders: [createDemoOrder()] };
}

let state: State = initial();
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.add;
  listeners.forEach((l) => l());
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as State;
      if (parsed?.orders?.length) state = parsed;
    }
  } catch {
    /* ignore */
  }
}

function set(next: State) {
  state = next;
  persist();
  emit();
}

function subscribe(cb: () => void) {
  hydrate();
  listeners.add(cb);
  cb();
  return () => listeners.delete(cb);
}

const serverSnapshot: State = initial();

export function useAgri<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(state),
    () => selector(serverSnapshot),
  );
}

export const actions = {
  setRole(role: Role | null) {
    set({ ...state, role });
  },
  createOrder(items: OrderItem[], destination: Geo, requiredDate: string) {
    const order = buildOrder(items, destination, requiredDate);
    set({ ...state, orders: [order, ...state.orders] });
    return order;
  },
  respond(orderId: string, supplierId: string, value: "accepted" | "rejected") {
    set({
      ...state,
      orders: state.orders.map((o) =>
        o.id === orderId
          ? { ...o, farmerResponses: { ...o.farmerResponses, [supplierId]: value } }
          : o,
      ),
    });
  },
  acceptAllFarmers(orderId: string) {
    set({
      ...state,
      orders: state.orders.map((o) =>
        o.id === orderId
          ? {
              ...o,
              farmerResponses: Object.fromEntries(
                Object.keys(o.farmerResponses).map((k) => [k, "accepted" as const]),
              ),
            }
          : o,
      ),
    });
  },
  setTransportStatus(orderId: string, status: TransportStatus) {
    set({
      ...state,
      orders: state.orders.map((o) => (o.id === orderId ? { ...o, transportStatus: status } : o)),
    });
  },
  reset() {
    set(initial());
  },
};

export const NEXT_STATUS: Record<TransportStatus, TransportStatus | null> = {
  Pending: "Accepted",
  Accepted: "Pickup",
  Pickup: "In Transit",
  "In Transit": "Delivered",
  Delivered: null,
};

export function orderTotals(order: Order) {
  const produce = order.matches.reduce((s, m) => s + m.produceCost, 0);
  const logistics = order.logistics?.cost ?? 0;
  const platformFee = Math.round(produce * 0.02);
  return {
    produce,
    logistics,
    platformFee,
    total: produce + logistics + platformFee,
    farmerRealisation: produce,
    savedVsMandi: Math.round(produce * 0.17),
    totalKg: order.matches.reduce((s, m) => s + m.matchedKg, 0),
  };
}
