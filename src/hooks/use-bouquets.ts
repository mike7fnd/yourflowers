'use client';

import { useState, useEffect } from 'react';
import type { Bouquet } from '@/lib/types';
import { findPublicBouquets } from '@/lib/db';

type UseBouquetsOptions = {
    limit?: number;
};

export function usePublicBouquets(options?: UseBouquetsOptions) {
  const [bouquets, setBouquets] = useState<Bouquet[] | null>(null);

  useEffect(() => {
    // Set to loading state initially
    setBouquets(null); 

    // Simulate async fetch
    const timer = setTimeout(() => {
      let data = findPublicBouquets();
      if (options?.limit) {
        data = data.slice(0, options.limit);
      }
      setBouquets(data);
    }, 50); // 50ms delay to simulate network

    return () => clearTimeout(timer);
  }, [options?.limit]);


  return { data: bouquets, loading: bouquets === null, error: null };
}
