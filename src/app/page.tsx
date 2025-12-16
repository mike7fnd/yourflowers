
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Leaf, Loader2 } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePublicBouquets } from '@/hooks/use-bouquets';

export default function Home() {
  const { data: publicBouquets, loading } = usePublicBouquets({ limit: 4 });

  return (
    <div className="flex flex-col">
      <section className="w-full py-20 md:py-32 lg:py-40 bg-card border-b">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-headline tracking-tight text-foreground sm:text-5xl lg:text-7xl">
              A Quiet Place for Connection
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              In a world of noise, send a silent message. yourflowers is a space to share simple, beautiful gestures with the people you care about.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg">
                <Link href="/send">
                  Send a Flower <ArrowRight className="ml-2" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg">
                <Link href="/garden">
                  Browse the Garden <Leaf className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <section className="w-full py-20 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-headline tracking-tight text-foreground sm:text-5xl">
              Recently in the Garden
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Explore the latest flowers shared by our community.
            </p>
          </div>
          {loading ? (
             <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin" />
             </div>
          ) : publicBouquets && publicBouquets.length > 0 ? (
             <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {publicBouquets.map((bouquet) => {
                const placeholder = PlaceHolderImages.find(p => p.id === bouquet.flower.image);
                if (!placeholder) return null;

                return (
                  <Link key={bouquet.id} href={`/flower/${bouquet.id}`} className="group block">
                     <Card className="overflow-hidden transition-all duration-300 ease-in-out hover:-translate-y-1">
                        <CardContent className="p-0">
                            <div className="aspect-square w-full overflow-hidden">
                                <Image
                                    src={placeholder.imageUrl}
                                    alt={placeholder.description}
                                    data-ai-hint={placeholder.imageHint}
                                    width={600}
                                    height={600}
                                    className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>
                              <CardHeader className="text-center">
                                <CardTitle className="font-headline text-lg truncate">{bouquet.flower.name}</CardTitle>
                            </CardHeader>
                            {(bouquet.message || bouquet.recipientName) && (
                                <CardContent className="p-4 border-t h-24">
                                    {bouquet.recipientName && <p className="text-xs text-muted-foreground">For {bouquet.recipientName}</p>}
                                    {bouquet.message && (
                                        <p className="text-sm text-foreground/80 italic mt-1 line-clamp-2">
                                            &ldquo;{bouquet.message}&rdquo;
                                        </p>
                                    )}
                                </CardContent>
                            )}
                        </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">The garden is currently empty.</p>
          )}
        </div>
      </section>
    </div>
  );
}
