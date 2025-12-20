
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { flowers } from '@/lib/flowers';
import FlowerCard from '@/components/flower-card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import type { Flower } from '@/lib/types';

export default function SendPage() {
  const [filteredFlowers, setFilteredFlowers] = useState<Flower[]>(flowers);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    if (term.trim() === '') {
      setFilteredFlowers(flowers);
      return;
    }

    const lowercasedTerm = term.toLowerCase();
    const filtered = flowers.filter(
      (flower) =>
        flower.name.toLowerCase().includes(lowercasedTerm) ||
        flower.meaning.toLowerCase().includes(lowercasedTerm)
    );
    setFilteredFlowers(filtered);
  };

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-headline tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Send a Flower
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Select a flower that speaks to you and start composing a message
        </p>
      </div>
      
      <div className="sticky top-[65px] z-10 py-4 mb-8">
          <div className="max-w-md md:max-w-lg mx-auto">
              <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                      type="search"
                      placeholder="Search by flower or meaning..."
                      className="w-full pl-10"
                      value={searchTerm}
                      onChange={handleSearch}
                  />
              </div>
          </div>
      </div>

      {filteredFlowers.length === 0 ? (
        <div className="text-center text-muted-foreground py-16">
            <p>No flowers match your search for "{searchTerm}".</p>
            <p>Try searching for something else.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {filteredFlowers.map((flower) => (
            <Link key={flower.id} href={`/create/${flower.slug}`} className="group block">
                <FlowerCard flower={flower} />
            </Link>
            ))}
        </div>
      )}
    </div>
  );
}
