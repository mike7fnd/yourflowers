import { use } from 'react';
import { notFound } from 'next/navigation';
import { flowers } from '@/lib/flowers';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import CreateBouquetForm from '@/components/create-bouquet-form';
import { Card, CardContent } from '@/components/ui/card';

export default function CreatePage({ params }: { params: { slug: string } }) {
  const { slug } = use(Promise.resolve(params));
  const flower = flowers.find((f) => f.slug === slug);

  if (!flower) {
    notFound();
  }

  const placeholder = PlaceHolderImages.find((p) => p.id === flower.image);
  if (!placeholder) notFound();

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-headline tracking-tight text-foreground sm:text-5xl">
            Compose Your Message
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            With the {flower.name} as your anchor, write a few words or let us suggest a sentiment.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
          <div className="space-y-4 md:sticky md:top-24">
             <Card className="overflow-hidden">
                <CardContent className="p-0">
                    <Image
                        src={placeholder.imageUrl}
                        alt={placeholder.description}
                        data-ai-hint={placeholder.imageHint}
                        width={600}
                        height={400}
                        className="h-full w-full object-contain"
                        unoptimized
                    />
                </CardContent>
             </Card>
             <div className="text-center">
                <h2 className="text-2xl font-headline">{flower.name}</h2>
                <p className="text-muted-foreground">{flower.meaning}</p>
             </div>
          </div>
          <div className="p-4 sm:p-6 md:p-8 rounded-lg bg-card">
            <CreateBouquetForm flower={flower} />
          </div>
        </div>
      </div>
    </div>
  );
}
