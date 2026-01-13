"use client";

import { useState, useEffect } from "react";

export function useServerTime(isEnabled: boolean, refreshInterval = 60000) {
  const [serverTime, setServerTime] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEnabled) {
      setServerTime(null);
      setError(null);
      return undefined;
    }

    let cancelled = false;
    let timer: ReturnType<typeof setInterval> | undefined;

    async function fetchTime() {
      try {
        const response = await fetch("/api/server-time");
        if (!response.ok) {
          throw new Error("Falha ao consultar hora do servidor.");
        }
        const payload = (await response.json()) as { serverTime: string };
        if (!cancelled) {
          setServerTime(payload.serverTime);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Erro ao consultar hora do servidor.");
        }
      }
    }

    fetchTime();
    if (refreshInterval > 0) {
      timer = setInterval(fetchTime, refreshInterval);
    }

    return () => {
      cancelled = true;
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isEnabled, refreshInterval]);

  return { serverTime, error };
}

export function formatServerTimestamp(value: string, locale = "pt-BR") {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  const formatter = new Intl.DateTimeFormat(locale, {
    dateStyle: "short",
    timeStyle: "medium",
    timeZone: "America/Sao_Paulo",
  });

  return formatter.format(parsed);
}
