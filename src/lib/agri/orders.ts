import { supabase } from "@/integrations/supabase/client";
import type { Geo } from "./data";
import {
  matchItems,
  planLogistics,
  type ItemMatch,
  type LogisticsPlan,
  type OrderItem,
} from "./matching";

export type TransportStatus = "Pending" | "Accepted" | "Pickup" | "In Transit" | "Delivered";

export type FarmerResponse = "pending" | "accepted" | "rejected";

export type Order = {
  id: string;
  code: string;
  buyerId: string;
  buyerName: string;
  createdAt: string;
  requiredDate: string;
  destination: Geo;
  items: OrderItem[];
  matches: ItemMatch[];
  logistics: LogisticsPlan | null;
  farmerResponses: Record<string, FarmerResponse>;
  transportStatus: TransportStatus;
};

export const NEXT_STATUS: Record<TransportStatus, TransportStatus | null> = {
  Pending: "Accepted",
  Accepted: "Pickup",
  Pickup: "In Transit",
  "In Transit": "Delivered",
  Delivered: null,
};

type Row = {
  id: string;
  code: string;
  buyer_id: string;
  buyer_name: string;
  created_at: string;
  required_date: string;
  destination: unknown;
  items: unknown;
  matches: unknown;
  logistics: unknown;
  farmer_responses: unknown;
  transport_status: string;
};

function toOrder(row: Row): Order {
  return {
    id: row.id,
    code: row.code,
    buyerId: row.buyer_id,
    buyerName: row.buyer_name,
    createdAt: row.created_at,
    requiredDate: row.required_date,
    destination: row.destination as Geo,
    items: row.items as OrderItem[],
    matches: row.matches as ItemMatch[],
    logistics: (row.logistics ?? null) as LogisticsPlan | null,
    farmerResponses: (row.farmer_responses ?? {}) as Record<string, FarmerResponse>,
    transportStatus: row.transport_status as TransportStatus,
  };
}

export function ordersQueryOptions() {
  return {
    queryKey: ["orders"] as const,
    queryFn: async (): Promise<Order[]> => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((r) => toOrder(r as Row));
    },
  };
}

export function orderQueryOptions(orderId: string) {
  return {
    queryKey: ["orders", orderId] as const,
    queryFn: async (): Promise<Order | null> => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .maybeSingle();
      if (error) throw error;
      return data ? toOrder(data as Row) : null;
    },
  };
}

export async function createOrder(input: {
  buyerId: string;
  buyerName: string;
  items: OrderItem[];
  destination: Geo;
  requiredDate: string;
}): Promise<Order> {
  const matches = matchItems(input.items, input.destination);
  const logistics = planLogistics(matches, input.destination);
  const farmerResponses: Record<string, FarmerResponse> = {};
  matches.forEach((m) => m.allocations.forEach((a) => (farmerResponses[a.supplierId] = "pending")));

  const { data, error } = await supabase
    .from("orders")
    .insert({
      code: `AC-${Math.floor(1000 + Math.random() * 9000)}`,
      buyer_id: input.buyerId,
      buyer_name: input.buyerName,
      required_date: input.requiredDate,
      destination: input.destination as never,
      items: input.items as never,
      matches: matches as never,
      logistics: (logistics ?? null) as never,
      farmer_responses: farmerResponses as never,
      transport_status: "Pending",
    })
    .select("*")
    .single();
  if (error) throw error;
  return toOrder(data as Row);
}

export async function respondAsFarmer(
  order: Order,
  supplierId: string,
  value: Exclude<FarmerResponse, "pending">,
) {
  const next = { ...order.farmerResponses, [supplierId]: value };
  const { error } = await supabase
    .from("orders")
    .update({ farmer_responses: next as never })
    .eq("id", order.id);
  if (error) throw error;
}

export async function acceptAllFarmers(order: Order) {
  const next = Object.fromEntries(
    Object.keys(order.farmerResponses).map((k) => [k, "accepted" as const]),
  );
  const { error } = await supabase
    .from("orders")
    .update({ farmer_responses: next as never })
    .eq("id", order.id);
  if (error) throw error;
}

export async function setTransportStatus(orderId: string, status: TransportStatus) {
  const { error } = await supabase
    .from("orders")
    .update({ transport_status: status })
    .eq("id", orderId);
  if (error) throw error;
}

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
