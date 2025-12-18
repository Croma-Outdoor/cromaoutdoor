"use client";

import { useEffect, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

const TABLE_NAME = process.env.NEXT_PUBLIC_SUPABASE_OUTDOORS_TABLE ?? "outdoors";

export type BillboardPoint = {
  id: string;
  title: string;
  address: string;
  status: string;
  latitude: number;
  longitude: number;
  code: string;
  type: string | null;
  neighborhood: string | null;
  city: string | null;
  availableUntil: string | null;
  imageUrl: string | null;
};

type BillboardRow = {
  id: string | number;
  codigo?: string | null;
  tipo?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  endereco?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  ocupato_ate?: string | null;
  imagem_url?: string | null;
};

export function useBillboards() {
  const [billboards, setBillboards] = useState<BillboardPoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let channel: RealtimeChannel | null = null;

    async function fetchBillboards() {
      setIsLoading(true);
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select("id,codigo,tipo,bairro,cidade,endereco,latitude,longitude,ocupato_ate,imagem_url")
        .order("created_at", { ascending: true });

      if (!isMounted) return;

      if (error) {
        setError(error.message);
        setBillboards([]);
      } else {
        const normalized = (data ?? [])
          .map((row) => row as BillboardRow)
          .filter((row) => typeof row.latitude === "number" && typeof row.longitude === "number")
          .map((row) => ({
            id: String(row.id),
            title: row.codigo ?? row.tipo ?? "Outdoor sem código",
            address: row.endereco ?? row.bairro ?? "Endereço não informado",
            status: formatStatus(row.ocupato_ate),
            latitude: row.latitude as number,
            longitude: row.longitude as number,
            code: row.codigo ?? "--",
            type: row.tipo ?? null,
            neighborhood: row.bairro ?? null,
            city: row.cidade ?? null,
            availableUntil: normalizeOccupancyDate(row.ocupato_ate),
            imageUrl: row.imagem_url ?? null,
          }));
        setBillboards(normalized);
        setError(null);
      }

      setIsLoading(false);
    }

    fetchBillboards();

    channel = supabase
      .channel(`public:${TABLE_NAME}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: TABLE_NAME },
        () => {
          fetchBillboards();
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  return { billboards, isLoading, error };
}

function formatStatus(value: string | null | undefined) {
  const normalized = normalizeOccupancyDate(value);
  if (!normalized) return "Disponível";
  const date = new Date(normalized);
  return `Ocupado até ${date.toLocaleDateString("pt-BR")}`;
}

function normalizeOccupancyDate(value: string | null | undefined) {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (parsed <= today) {
    return null;
  }
  return parsed.toISOString();
}
