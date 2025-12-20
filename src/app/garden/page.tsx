
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';
import type { Bouquet } from '@/lib/types';
import { ClientOnly } from '@/components/client-only';
import { Skeleton } from '@/components/ui/skeleton';
import { usePublicBouquets } from '@/hooks/use-bouquets';

function BouquetSkeleton() {
    return (
        <Skeleton className="h-[200px] w-full" />
    );
}

export default function GardenPage() {
    const { 
        bouquets: allBouquets, 
        loadingInitial, 
        loadingMore, 
        hasMore, 
        loadMoreBouquets 
    } = usePublicBouquets({ limit: 4 });
    
    const [filteredBouquets, setFilteredBouquets] = useState<Bouquet[] | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    const observer = useRef<IntersectionObserver>();
    const lastBouquetElementRef = useCallback((node: HTMLAnchorElement | null) => {
        if (loadingMore) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && !searchTerm) {
                loadMoreBouquets();
            }
        });
        if (node) observer.current.observe(node);
    }, [loadingMore, hasMore, loadMoreBouquets, searchTerm]);


    useEffect(() => {
        if (allBouquets) {
            if (searchTerm.trim() === '') {
                setFilteredBouquets(allBouquets);
                return;
            }

            const lowercasedTerm = searchTerm.toLowerCase();
            const filtered = allBouquets.filter(bouquet => 
                (bouquet.message && bouquet.message.toLowerCase().includes(lowercasedTerm)) ||
                (bouquet.recipientName && bouquet.recipientName.toLowerCase().includes(lowercasedTerm))
            );
            setFilteredBouquets(filtered);
        } else {
            setFilteredBouquets(null);
        }
    }, [searchTerm, allBouquets]);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-headline tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                    Browse the Garden
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                    A shared space for contemplation. Walk through a collection of feelings, quietly offered.
                </p>
            </div>

            <div className="sticky top-0 sm:top-[65px] z-10 py-4 mb-8">
                <div className="max-w-md mx-auto">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search by message or name..."
                            className="w-full pl-10 shadow-lg"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                </div>
            </div>

            {loadingInitial ? (
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    <BouquetSkeleton />
                    <BouquetSkeleton />
                    <BouquetSkeleton />
                    <BouquetSkeleton />
                </div>
            ) : allBouquets && allBouquets.length === 0 ? (
                <div className="text-center text-muted-foreground py-16">
                    <p>The garden is quiet right now.</p>
                    <p>Be the first to <Link href="/send" className="text-primary underline hover:no-underline">plant a public flower</Link>.</p>
                </div>
            ) : filteredBouquets && filteredBouquets.length === 0 && searchTerm ? (
                <div className="text-center text-muted-foreground py-16">
                    <p>No flowers match your search for "{searchTerm}".</p>
                    <p>Try searching for something else.</p>
                </div>
            ) : (
                <>
                    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                        {filteredBouquets && filteredBouquets.map((bouquet, index) => {
                            if (!bouquet.flower) return null; // Defensive check
                            const placeholder = PlaceHolderImages.find(p => p.id === bouquet.flower.image);
                            if (!placeholder) return null;
                            
                            const isLastElement = filteredBouquets.length === index + 1;
                            
                            return (
                                <Link 
                                    ref={isLastElement ? lastBouquetElementRef : null}
                                    key={bouquet.id} 
                                    href={`/flower/${bouquet.id}`} 
                                    className="block group"
                                >
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
                            );
                        })}
                    </div>
                    {loadingMore && (
                        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mt-8">
                           <BouquetSkeleton />
                           <BouquetSkeleton />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
