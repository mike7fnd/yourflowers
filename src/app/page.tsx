
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { usePublicBouquets } from '@/hooks/use-bouquets';
import { ClientOnly } from '@/components/client-only';

export default function Home() {
  const { data: publicBouquets, loading } = usePublicBouquets({ limit: 3 });

  return (
    <div className="flex flex-col">
      <section className="w-full py-20 md:py-32 lg:py-40 bg-card border-b">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl font-headline tracking-tight text-foreground sm:text-6xl lg:text-8xl">
              your<span className="italic text-primary">flowers</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              In a world of noise, send a silent message. yourflowers is a space to share simple, beautiful gestures with the people you care about.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6">
              <Button asChild size="lg" className="w-full sm:w-auto px-4 sm:px-8">
                <Link href="/send">
                  Send a Flower
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto shadow-md">
                <Link href="/garden">
                  Browse the Garden
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
             <div className="max-w-4xl mx-auto space-y-12">
              {publicBouquets.map((bouquet) => {
                if (!bouquet.flower) return null; // Defensive check
                const placeholder = PlaceHolderImages.find(p => p.id === bouquet.flower.image);
                if (!placeholder) return null;

                return (
                  <Link key={bouquet.id} href={`/flower/${bouquet.id}`} className="block group">
                      <Card className="border shadow-sm grid grid-cols-5 items-center p-4 sm:p-6 gap-0 relative transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 h-full">
                          <div className="col-span-2 -ml-8 -my-8 sm:-ml-12 sm:-my-12">
                              <Image
                                  src={placeholder.imageUrl}
                                  alt={placeholder.description}
                                  data-ai-hint={placeholder.imageHint}
                                  width={400}
                                  height={400}
                                  className="h-full w-full object-contain drop-shadow-md group-hover:brightness-110 transition-all duration-300"
                                  unoptimized={true}
                              />
                          </div>
                          <div className="col-span-3 flex flex-col justify-center">
                              {bouquet.recipientName && <p className="text-sm text-muted-foreground">For {bouquet.recipientName}</p>}
                              {bouquet.message ? (
                                  <blockquote className="text-lg text-foreground/90 italic mt-2 border-l-4 pl-4 line-clamp-3">
                                      {bouquet.message}
                                  </blockquote>
                              ) : (
                                  <p className="text-muted-foreground italic mt-2">A quiet offering, no words needed.</p>
                              )}
                              
                              <p className="text-xs text-muted-foreground mt-4">
                                  <ClientOnly>
                                      {new Date(bouquet.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                  </ClientOnly>
                              </p>
                          </div>
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
