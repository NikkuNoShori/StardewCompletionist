import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const VOTES_KEY = 'sdv-spawn-votes';

// Votes are stored as { [item_id]: 1 | -1 }.
//  1  = thumbs up (code is correct)
// -1  = thumbs down (code gives the wrong item)
//
// Logged out: votes live in localStorage only.
// On login: any local votes are pushed up, then the server copy
// (merged) becomes the source of truth and future votes sync live.

function readLocal() {
  try {
    const raw = localStorage.getItem(VOTES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeLocal(votes) {
  try {
    localStorage.setItem(VOTES_KEY, JSON.stringify(votes));
  } catch {
    /* ignore quota / private-mode errors */
  }
}

export function useSpawnVotes() {
  const { user } = useAuth();
  const [votes, setVotes] = useState(readLocal);
  const syncedOnce = useRef(false);

  // On login: push local votes to the server, then load the merged set.
  useEffect(() => {
    if (!user || !isSupabaseConfigured()) {
      syncedOnce.current = false;
      return;
    }

    let cancelled = false;
    const sync = async () => {
      const local = readLocal();

      // Push any locally-cast votes up first so nothing is lost.
      const entries = Object.entries(local);
      if (entries.length > 0) {
        await Promise.all(
          entries.map(([itemId, vote]) =>
            supabase.rpc('vote_spawn_code', {
              p_item_id: String(itemId),
              p_item_name: '', // name backfilled on next explicit vote; id is what matters
              p_vote: vote,
            })
          )
        );
      }

      const { data, error } = await supabase.rpc('get_my_spawn_votes');
      if (cancelled) return;
      if (!error && data) {
        // Normalize values to numbers and merge over local.
        const merged = { ...local };
        for (const [itemId, vote] of Object.entries(data)) {
          merged[itemId] = Number(vote);
        }
        setVotes(merged);
        writeLocal(merged);
      }
      syncedOnce.current = true;
    };

    sync();
    return () => {
      cancelled = true;
    };
  }, [user]);

  // Cast or toggle a vote. Clicking the same direction again clears it.
  const castVote = useCallback(
    (itemId, itemName, direction) => {
      const id = String(itemId);
      setVotes((prev) => {
        const current = prev[id];
        const next = { ...prev };
        const clearing = current === direction;

        if (clearing) {
          delete next[id];
        } else {
          next[id] = direction;
        }
        writeLocal(next);

        // Sync to Supabase when signed in.
        if (user && isSupabaseConfigured()) {
          if (clearing) {
            supabase.rpc('clear_spawn_vote', { p_item_id: id });
          } else {
            supabase.rpc('vote_spawn_code', {
              p_item_id: id,
              p_item_name: itemName ?? '',
              p_vote: direction,
            });
          }
        }
        return next;
      });
    },
    [user]
  );

  return { votes, castVote };
}
