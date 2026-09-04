import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Profile = Tables<"profiles">;
export type Role = Profile["role"];

export const DASHBOARD_PATH = {
  farmer: "/farmer/dashboard",
  buyer: "/buyer/dashboard",
  transporter: "/transporter/dashboard",
} as const;

export const ROLE_LABEL: Record<Role, string> = {
  farmer: "Farmer / FPO",
  buyer: "Buyer",
  transporter: "Transporter",
};

export function profileQueryOptions() {
  return {
    queryKey: ["profile"] as const,
    queryFn: async (): Promise<Profile | null> => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", auth.user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    staleTime: 30_000,
  };
}

export function useProfile() {
  return useQuery(profileQueryOptions());
}

export function displayName(p: Profile | null | undefined) {
  if (!p) return "";
  return p.company_name || p.full_name || "Account";
}
