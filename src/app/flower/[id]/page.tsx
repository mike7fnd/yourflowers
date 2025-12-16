'use client';

import { useEffect } from 'react';
import { notFound, useParams, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, Loader2 } from 'lucide-react';
import { FlowerViewActions } from '@/components/flower-view-actions';
import { ClientOnly } from '@/components/client-only';
import { useBouquet } from '@/hooks/use-bouquet';

export default function FlowerPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  
  const { data: bouquet, loading, error } = useBouquet(id);

  const fromCreate = searchParams.get('from') === 'create';
  
  // Need to use an effect to trigger notFound for static generation compatibility
  useEffect(() => {
    if (!loading && !bouquet) {
      notFound();
    }
  }, [loading, bouquet]);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  if (error || !bouquet) {
    // This will be caught by the useEffect to trigger notFound
    return null;
  }

  const placeholder = PlaceHolderImages.find((p) => p.id === bouquet.flower.image);
  if (!placeholder) {
      // This is an inconsistent data state, should not happen with proper validation
      notFound();
  }

  const isFuture = bouquet.deliveryType === 'timed' && bouquet.deliveryDate && bouquet.deliveryDate > new Date();
  
  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {bouquet.recipientName && (
            <div className="text-center mb-8">
                <h1 className="text-3xl font-headline tracking-tight text-foreground sm:text-4xl">
                    A flower for you, {bouquet.recipientName}
                </h1>
            </div>
        )}
        <div className="max-w-2xl mx-auto">
            {fromCreate && (
                <Alert className="mb-8 bg-primary/10 border-primary/20">
                    <Info className="h-4 w-4 !text-primary" />
                    <AlertTitle className="text-primary">Your Flower is Ready</AlertTitle>
                    <AlertDescription>
                        Your private flower has been created. Share the link below with someone special.
                    </AlertDescription>
                </Alert>
            )}

            <Card className="overflow-hidden animate-in fade-in-50 duration-500">
                <CardContent className="p-0">
                    <div className="aspect-[3/2] w-full overflow-hidden">
                        <Image
                            src={placeholder.imageUrl}
                            alt={placeholder.description}
                            data-ai-hint={placeholder.imageHint}
                            width={600}
                            height={400}
                            className="h-full w-full object-contain"
                            priority
                        />
                    </div>
                </CardContent>
                <CardContent className='border-t'>
                    {isFuture ? (
                        <div className="text-center p-8">
                            <p className="text-muted-foreground">This flower is timed to arrive on</p>
                            <p className="text-2xl font-headline mt-2">
                                <ClientOnly>
                                    {bouquet.deliveryDate?.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                </ClientOnly>
                            </p>
                        </div>
                    ) : (
                        <div className="text-left p-6 sm:p-8 space-y-4">
                            <blockquote className="text-xl italic text-foreground/80 leading-relaxed">
                                &ldquo;{bouquet.message}&rdquo;
                            </blockquote>
                        </div>
                    )}
                </CardContent>
            </Card>

            <FlowerViewActions bouquet={bouquet} />
        </div>
    </div>
  );
}
