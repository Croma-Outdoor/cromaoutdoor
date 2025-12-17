"use client";

import { useState, useEffect, useCallback } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

type Credentials = { email: string; password: string };

type AuthState = {
  session: Session | null;
  isLoading: boolean;
  authError: string | null;
  signIn: (credentials: Credentials) => Promise<void>;
  signOut: () => Promise<void>;
};

export function useSupabaseAuth(): AuthState {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!mounted) return;
        if (error) {
          setAuthError(error.message);
        }
        setSession(data.session ?? null);
        setIsLoading(false);
      })
      .catch((err) => {
        if (!mounted) return;
        setAuthError(err instanceof Error ? err.message : "Erro ao carregar sessão");
        setIsLoading(false);
      });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async ({ email, password }: Credentials) => {
    setAuthError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthError(error.message);
      throw new Error(error.message);
    }
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setAuthError(error.message);
      throw new Error(error.message);
    }
  }, []);

  return { session, isLoading, authError, signIn, signOut };
}
