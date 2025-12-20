
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useFirestore } from '@/firebase';
import { getPublicBouquets } from '@/lib/db';
import type { Bouquet } from '@/lib/types';
import type { DocumentSnapshot } from 'firebase/firestore';

type UseBouquetsOptions = {
  limit?: number;
};

export function usePublicBouquets(options?: UseBouquetsOptions) {
  const firestore = useFirestore();
  const [bouquets, setBouquets] = useState<Bouquet[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastVisible, setLastVisible] = useState<DocumentSnapshot | null>(null);
  const limit = options?.limit || 10;

  const fetchBouquets = useCallback(async (isInitial: boolean) => {
    if (!firestore) {
      if (isInitial) setLoadingInitial(false);
      return;
    }

    if (isInitial) {
      setLoadingInitial(true);
    } else {
      if (loadingMore || !hasMore) return;
      setLoadingMore(true);
    }

    try {
      const { bouquets: newBouquets, lastDoc } = await getPublicBouquets(firestore, {
        count: limit,
        startAfter: isInitial ? null : lastVisible,
      });

      setBouquets(prev => isInitial ? newBouquets : [...prev, ...newBouquets]);
      setLastVisible(lastDoc);
      setHasMore(newBouquets.length === limit);

    } catch (err: any) {
      console.error("Error fetching public bouquets:", err);
      // In a real app, you might want to set an error state here
    } finally {
      if (isInitial) {
        setLoadingInitial(false);
      } else {
        setLoadingMore(false);
      }
    }
  }, [firestore, limit, lastVisible, loadingMore, hasMore]);
  
  useEffect(() => {
    if (firestore) {
      fetchBouquets(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firestore]); // Note: fetchBouquets is not a dependency to avoid re-fetching on every state change it causes.

  const loadMoreBouquets = () => {
    fetchBouquets(false);
  }

  return { bouquets, loadingInitial, loadingMore, hasMore, loadMoreBouquets };
}
