'use client';

import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export type SupabaseCredentials = { email: string; password: string };

type UseSupabaseAuthResult = {
  session: Session | null;
  isLoading: boolean;
  authError: string | null;
  signIn: (credentials: SupabaseCredentials) => Promise<Session | null>;
  signOut: () => Promise<void>;
};

export function useSupabaseAuth(): UseSupabaseAuthResult {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadSession() {
      setIsLoading(true);
      const { data, error } = await supabase.auth.getSession();
      if (!isMounted) {
        return;
      }
      setSession(data.session ?? null);
      setAuthError(error?.message ?? null);
      setIsLoading(false);
    }

    loadSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (isMounted) {
        setSession(newSession);
      }
    });

    return () => {
      isMounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async ({ email, password }: SupabaseCredentials) => {
    setAuthError(null);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthError(error.message);
      throw new Error(error.message);
    }
    setSession(data.session ?? null);
    setIsLoading(false);
    return data.session ?? null;
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
    setSession(null);
    setAuthError(null);
  }, []);

  return { session, isLoading, authError, signIn, signOut };
}
