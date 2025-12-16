import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Flower } from '@/lib/types';
import { Button } from './ui/button';

type FlowerCardProps = {
  flower: Flower;
};

export default function FlowerCard({ flower }: FlowerCardProps) {
  const placeholder = PlaceHolderImages.find((p) => p.id === flower.image);
  if (!placeholder) return null;

  return (
    <div className="flex flex-col items-center text-center gap-4">
        <div className="aspect-[1/1] sm:aspect-[3/2] w-full rounded-lg">
          <Image
            src={placeholder.imageUrl}
            alt={placeholder.description}
            data-ai-hint={placeholder.imageHint}
            width={800}
            height={600}
            className="h-full w-full object-contain transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:-rotate-2 group-hover:[filter:drop-shadow(0_0_15px_hsl(var(--primary)/0.6))]"
          />
        </div>
        <div className="space-y-2 flex flex-col items-center">
            <h3 className="font-headline text-2xl">{flower.name}</h3>
            <p className="text-base text-muted-foreground italic">{flower.meaning}</p>
        </div>
    </div>
  );
}
