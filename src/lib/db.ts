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
    // orderBy('createdAt', 'desc'), // This line is causing the index error
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

  return { bouquets, lastDoc };
};
