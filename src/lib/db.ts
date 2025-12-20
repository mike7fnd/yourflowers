'use client';

import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  Timestamp,
  Firestore,
  startAfter as firestoreStartAfter,
  DocumentSnapshot,
} from 'firebase/firestore';
import type { Bouquet, Flower } from './types';

type BouquetData = {
  flower: Flower;
  recipientName?: string;
  message: string;
  deliveryType: 'public' | 'private';
};

export const addBouquet = async (
  db: Firestore,
  data: BouquetData
): Promise<string> => {
  const bouquetsCollection = collection(db, 'bouquets');

  const bouquetPayload: Omit<Bouquet, 'id' | 'createdAt'> & { createdAt: any } = {
    flower: data.flower,
    recipientName: data.recipientName || '',
    message: data.message,
    deliveryType: data.deliveryType,
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(bouquetsCollection, bouquetPayload);

  if (!docRef) {
      throw new Error("Could not create bouquet.");
  }

  return docRef.id;
};

export const getBouquet = async (
  db: Firestore,
  id: string
): Promise<Bouquet | null> => {
  const docRef = doc(db, 'bouquets', id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
    } as Bouquet;
  } else {
    return null;
  }
};

type PaginatedBouquetsResult = {
  bouquets: Bouquet[];
  lastDoc: DocumentSnapshot | null;
};

export const getPublicBouquets = async (
  db: Firestore,
  options?: { count?: number; startAfter?: DocumentSnapshot | null }
): Promise<PaginatedBouquetsResult> => {
  const bouquetsCollection = collection(db, 'bouquets');
  const q = query(
    bouquetsCollection,
    where('deliveryType', '==', 'public'),
    // The query requires an index. You can create it here: https://console.firebase.google.com/v1/r/project/studio-3926687012-97350/firestore/indexes?create_composite=Clhwcm9qZWN0cy9zdHVkaW8tMzkyNjY4NzAxMi05NzM1MC9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvYm91cXVldHMvaW5kZXhlcy9fEAEaEAoMZGVsaXZlcnlUeXBlEAEaDQoJY3JlYXRlZEF0EAIaDAoIX19uYW1lX18QAg
    // orderBy('createdAt', 'desc'),
    ...(options?.startAfter ? [firestoreStartAfter(options.startAfter)] : []),
    ...(options?.count ? [limit(options.count)] : [])
  );

  const querySnapshot = await getDocs(q);
  const bouquets = querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
    } as Bouquet;
  });

  const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1] || null;

  // Sort on the client as a temporary fix for the missing index
  bouquets.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return { bouquets, lastDoc };
};
