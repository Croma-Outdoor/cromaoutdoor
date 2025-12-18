"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const TABLE_NAME = process.env.NEXT_PUBLIC_SUPABASE_OUTDOORS_TABLE ?? "outdoors";
const LATITUDE_RANGE = { min: -90, max: 90 } as const;
const LONGITUDE_RANGE = { min: -180, max: 180 } as const;
const HTML_TAG_REGEX = /<[^>]*>/g;
const CONTROL_CHAR_REGEX = /[\u0000-\u001F\u007F]/g;

export type OutdoorRecord = {
  id: number;
  codigo: string;
  tipo: string;
  bairro: string;
  cidade: string;
  endereco: string;
  latitude: number;
  longitude: number;
  ocupato_ate: string | null;
  imagem_url: string | null;
  created_at: string | null;
};

export type OutdoorPayload = {
  codigo: string;
  tipo?: string;
  bairro?: string;
  cidade?: string;
  endereco?: string;
  latitude: number;
  longitude: number;
  ocupato_ate?: string | null;
  imagem_url?: string | null;
};

const defaultRecord: OutdoorRecord = {
  id: 0,
  codigo: "",
  tipo: "",
  bairro: "",
  cidade: "",
  endereco: "",
  latitude: 0,
  longitude: 0,
  ocupato_ate: null,
  imagem_url: null,
  created_at: null,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function sanitizeOptionalText(value?: string | null) {
  if (value == null) return null;
  const cleaned = value
    .replace(HTML_TAG_REGEX, "")
    .replace(CONTROL_CHAR_REGEX, " ")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned || null;
}

function sanitizeRequiredText(value: string) {
  const sanitized = sanitizeOptionalText(value);
  if (!sanitized) {
    throw new Error("O campo código não pode ficar em branco.");
  }
  return sanitized;
}

function sanitizeCoordinate(value: number | string, range: { min: number; max: number }, fieldLabel: string) {
  const numeric = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numeric)) {
    throw new Error(`${fieldLabel} inválida.`);
  }
  return Number(clamp(numeric, range.min, range.max).toFixed(6));
}

function coerceCoordinate(value: number | string | null | undefined, range: { min: number; max: number }) {
  const numeric = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numeric)) {
    return 0;
  }
  return Number(clamp(numeric, range.min, range.max).toFixed(6));
}

function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function sanitizeOccupancyInput(value?: string | null) {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error("Data 'Ocupado até' inválida.");
  }

  const today = startOfToday();
  if (parsed < today) {
    throw new Error("A data 'Ocupado até' não pode ser anterior à data de hoje.");
  }

  if (parsed.getTime() === today.getTime()) {
    return null;
  }

  return parsed.toISOString();
}

function normalizeStoredOccupancy(value?: string | null) {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  if (parsed <= startOfToday()) {
    return null;
  }

  return parsed.toISOString();
}

function mapRow(row: Partial<OutdoorRecord> & { id: number }) {
  return {
    ...defaultRecord,
    ...row,
    id: Number(row.id),
    codigo: sanitizeOptionalText(row.codigo) ?? "",
    tipo: sanitizeOptionalText(row.tipo) ?? "",
    bairro: sanitizeOptionalText(row.bairro) ?? "",
    cidade: sanitizeOptionalText(row.cidade) ?? "",
    endereco: sanitizeOptionalText(row.endereco) ?? "",
    latitude: coerceCoordinate(row.latitude, LATITUDE_RANGE),
    longitude: coerceCoordinate(row.longitude, LONGITUDE_RANGE),
    ocupato_ate: normalizeStoredOccupancy(row.ocupato_ate),
    imagem_url: row.imagem_url ?? null,
    created_at: row.created_at ?? null,
  } satisfies OutdoorRecord;
}

function normalizePayload(payload: OutdoorPayload) {
  return {
    codigo: sanitizeRequiredText(payload.codigo),
    tipo: sanitizeOptionalText(payload.tipo) ?? null,
    bairro: sanitizeOptionalText(payload.bairro) ?? null,
    cidade: sanitizeOptionalText(payload.cidade) ?? null,
    endereco: sanitizeOptionalText(payload.endereco) ?? null,
    latitude: sanitizeCoordinate(payload.latitude, LATITUDE_RANGE, "Latitude"),
    longitude: sanitizeCoordinate(payload.longitude, LONGITUDE_RANGE, "Longitude"),
    ocupato_ate: sanitizeOccupancyInput(payload.ocupato_ate),
    imagem_url: sanitizeOptionalText(payload.imagem_url) ?? null,
  };
}

export function useOutdoorsCrud() {
  const [records, setRecords] = useState<OutdoorRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);

  const fetchRecords = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("id,codigo,tipo,bairro,cidade,endereco,latitude,longitude,ocupato_ate,imagem_url,created_at")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
      setRecords([]);
    } else {
      setError(null);
      setRecords((data ?? []).map(mapRow));
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Required to carregar dados iniciais do Supabase
    fetchRecords();
  }, [fetchRecords]);

  const createOutdoor = useCallback(
    async (payload: OutdoorPayload) => {
      setIsSaving(true);
      const normalized = normalizePayload(payload);
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .insert(normalized)
        .select("id,codigo,tipo,bairro,cidade,endereco,latitude,longitude,ocupato_ate,imagem_url,created_at")
        .single();

      setIsSaving(false);

      if (error) {
        setMutationError(error.message);
        throw new Error(error.message);
      }

      setMutationError(null);
      if (data) {
        setRecords((current) => [mapRow(data), ...current]);
      }
    },
    []
  );

  const updateOutdoor = useCallback(
    async (id: number, payload: OutdoorPayload) => {
      setIsSaving(true);
      const normalized = normalizePayload(payload);
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .update(normalized)
        .eq("id", id)
        .select("id,codigo,tipo,bairro,cidade,endereco,latitude,longitude,ocupato_ate,imagem_url,created_at")
        .single();

      setIsSaving(false);

      if (error) {
        setMutationError(error.message);
        throw new Error(error.message);
      }

      setMutationError(null);
      if (data) {
        setRecords((current) => current.map((item) => (item.id === id ? mapRow(data) : item)));
      }
    },
    []
  );

  const deleteOutdoor = useCallback(async (id: number) => {
    let snapshot: OutdoorRecord[] = [];
    setRecords((current) => {
      snapshot = current;
      return current.filter((item) => item.id !== id);
    });
    const { error } = await supabase.from(TABLE_NAME).delete().eq("id", id);
    if (error) {
      setRecords(snapshot);
      setMutationError(error.message);
      throw new Error(error.message);
    }
    setMutationError(null);
  }, []);

  return {
    records,
    isLoading,
    isSaving,
    error,
    mutationError,
    createOutdoor,
    updateOutdoor,
    deleteOutdoor,
    refetch: fetchRecords,
  };
}
