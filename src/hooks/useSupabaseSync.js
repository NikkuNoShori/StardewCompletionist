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
      const { data, error } = await supabase
        .from('recipe_progress')
        .select('checked')
        .eq('user_id', user.id)
        .single();

      if (data && !error) {
        loadFromSupabase(data.checked);
      } else if (error?.code === 'PGRST116') {
        // No row yet — insert current state
        await supabase.from('recipe_progress').insert({
          user_id: user.id,
          checked: checked,
        });
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
      await supabase
        .from('recipe_progress')
        .upsert({
          user_id: user.id,
          checked: checked,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });
    }, 1000);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [checked, user]);
}
