'use client';

import { useState, useEffect } from 'react';
import { useFirestore } from '@/firebase';
import { getBouquet } from '@/lib/db';
import type { Bouquet } from '@/lib/types';

function useBouquet(id: string | undefined | null) {
  const firestore = useFirestore();
  const [bouquet, setBouquet] = useState<Bouquet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id || !firestore) {
      setLoading(false);
      return;
    }

    const fetchBouquet = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getBouquet(firestore, id);
        setBouquet(data);
      } catch (err: any) {
        console.error("Error fetching bouquet:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBouquet();
  }, [id, firestore]);

  return { data: bouquet, loading, error };
}

export { useBouquet };
