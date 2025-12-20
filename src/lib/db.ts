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
} from 'firebase/firestore';
import type { Bouquet, Flower } from './types';
import { addDocumentNonBlocking } from '@/firebase';

type BouquetData = {
  flower: Flower;
  recipientName?: string;
  message: string;
  deliveryType: 'private' | 'public' | 'timed';
  deliveryDate?: Date;
};

export const addBouquet = async (
  db: Firestore,
  data: BouquetData
) => {
  const bouquetsCollection = collection(db, 'bouquets');

  const bouquetPayload: Omit<Bouquet, 'id' | 'createdAt' | 'deliveryDate'> & { createdAt: any, deliveryDate?: any } = {
    flower: data.flower,
    recipientName: data.recipientName || '',
    message: data.message,
    deliveryType: data.deliveryType,
    createdAt: serverTimestamp(),
  };

  if (data.deliveryType === 'timed' && data.deliveryDate) {
    bouquetPayload.deliveryDate = Timestamp.fromDate(data.deliveryDate);
  }

  // We use addDocumentNonBlocking to avoid awaiting the promise here
  const docRefPromise = addDocumentNonBlocking(bouquetsCollection, bouquetPayload);
  
  const docRef = await docRefPromise;

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
      // Convert Firestore Timestamps to JS Dates
      createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
      deliveryDate: (data.deliveryDate as Timestamp)?.toDate(),
    } as Bouquet;
  } else {
    return null;
  }
};

export const getPublicBouquets = async (
  db: Firestore,
  options?: { count?: number }
): Promise<Bouquet[]> => {
  const bouquetsCollection = collection(db, 'bouquets');
  const q = query(
    bouquetsCollection,
    where('deliveryType', '==', 'public'),
    // orderBy('createdAt', 'desc'), // Temporarily removed to avoid index error
    ...(options?.count ? [limit(options.count)] : [])
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
      deliveryDate: (data.deliveryDate as Timestamp)?.toDate(),
    } as Bouquet;
  }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // Sort on the client as a temporary measure
};
