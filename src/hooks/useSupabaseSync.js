import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRecipeStore } from './useRecipeStore';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export function useSupabaseSync() {
  const { user } = useAuth();
  const checked = useRecipeStore((s) => s.checked);
  const loadFromSupabase = useRecipeStore((s) => s.loadFromSupabase);
  const debounceRef = useRef(null);
  const initialLoadDone = useRef(false);

  // Load from Supabase on login
  useEffect(() => {
    if (!user || !isSupabaseConfigured()) {
      initialLoadDone.current = false;
      return;
    }

    const loadProgress = async () => {
      const { data, error } = await supabase.rpc('get_progress');

      if (!error && data && Object.keys(data).length > 0) {
        loadFromSupabase(data);
      } else if (!error) {
        // No existing row — seed with current local state
        await supabase.rpc('save_progress', { p_checked: checked });
      }
      initialLoadDone.current = true;
    };

    loadProgress();
  }, [user]);

  // Debounced save to Supabase on changes
  useEffect(() => {
    if (!user || !isSupabaseConfigured() || !initialLoadDone.current) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      await supabase.rpc('save_progress', { p_checked: checked });
    }, 1000);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [checked, user]);
}
