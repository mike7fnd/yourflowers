export type Flower = {
  id: string;
  name: string;
  slug: string;
  meaning: string;
  image: string; // id from placeholder-images.json
};

export type Bouquet = {
  id: string;
  flower: Flower;
  recipientName?: string;
  message?: string;
  deliveryType: 'private' | 'public' | 'timed';
  deliveryDate?: Date;
  createdAt: Date;
};
