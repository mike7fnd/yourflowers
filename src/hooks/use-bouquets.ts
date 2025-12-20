'use client';

import { useState, useEffect } from 'react';
import { useFirestore } from '@/firebase';
import { getPublicBouquets } from '@/lib/db';
import type { Bouquet } from '@/lib/types';

type UseBouquetsOptions = {
  limit?: number;
};

export function usePublicBouquets(options?: UseBouquetsOptions) {
  const firestore = useFirestore();
  const [bouquets, setBouquets] = useState<Bouquet[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!firestore) return;

    const fetchBouquets = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getPublicBouquets(firestore, { count: options?.limit });
        setBouquets(data);
      } catch (err: any) {
        console.error("Error fetching public bouquets:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBouquets();
  }, [firestore, options?.limit]);

  return { data: bouquets, loading, error };
}
