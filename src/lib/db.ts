'use client';
import type { Bouquet, Flower } from './types';

const BOUQUETS_KEY = 'bouquets';

type CreateBouquetData = {
  flower: Flower;
  recipientName?: string;
  message: string;
  deliveryType: 'private' | 'public' | 'timed';
  deliveryDate?: Date;
};

// Helper to get all bouquets from local storage
const getBouquets = (): Bouquet[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const bouquetsJson = localStorage.getItem(BOUQUETS_KEY);
    if (!bouquetsJson) return [];
    // Parse dates correctly
    return JSON.parse(bouquetsJson, (key, value) => {
      if (key === 'createdAt' || key === 'deliveryDate') {
        return new Date(value);
      }
      return value;
    });
  } catch (error) {
    console.error('Failed to parse bouquets from localStorage:', error);
    return [];
  }
};

// Helper to save all bouquets to local storage
const saveBouquets = (bouquets: Bouquet[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(BOUQUETS_KEY, JSON.stringify(bouquets));
};

/**
 * Adds a new bouquet to local storage.
 */
export const addBouquet = (data: CreateBouquetData): Bouquet => {
  const allBouquets = getBouquets();
  const newBouquet: Bouquet = {
    id: crypto.randomUUID(),
    createdAt: new Date(),
    ...data,
  };

  const updatedBouquets = [...allBouquets, newBouquet];
  saveBouquets(updatedBouquets);
  
  return newBouquet;
};

/**
 * Finds a single bouquet by its ID from local storage.
 */
export const findBouquet = (id: string): Bouquet | null => {
  const allBouquets = getBouquets();
  return allBouquets.find((b) => b.id === id) || null;
};

/**
 * Finds all public bouquets from local storage, sorted by creation date.
 */
export const findPublicBouquets = (): Bouquet[] => {
  const allBouquets = getBouquets();
  return allBouquets
    .filter((b) => b.deliveryType === 'public')
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};
