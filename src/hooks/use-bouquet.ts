'use client';

import { useState, useEffect } from 'react';
import type { Bouquet } from '@/lib/types';
import { findBouquet } from '@/lib/db';

export function useBouquet(id: string | undefined) {
  const [bouquet, setBouquet] = useState<Bouquet | null | undefined>(undefined);

  useEffect(() => {
    setBouquet(undefined); // Loading state
    if (id) {
        const foundBouquet = findBouquet(id);
        setBouquet(foundBouquet);
    } else {
        setBouquet(null); // Not found
    }
  }, [id]);

  // Simulate async loading to match Firebase hook behavior
  useEffect(() => {
      const timer = setTimeout(() => {
          if (bouquet === undefined) {
              setBouquet(id ? findBouquet(id) : null);
          }
      }, 50); // small delay
      return () => clearTimeout(timer);
  }, [id, bouquet]);


  return { data: bouquet, loading: bouquet === undefined, error: null };
}
