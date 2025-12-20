'use client';

import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';
import { Copy, CornerUpLeft } from 'lucide-react';
import type { Bouquet } from '@/lib/types';
import { Separator } from './ui/separator';

export function FlowerViewActions({ bouquet }: { bouquet: Bouquet }) {
  const { toast } = useToast();

  const handleCopyLink = () => {
    // We remove the ?from=create param before copying
    const url = new URL(window.location.href);
    url.searchParams.delete('from');
    navigator.clipboard.writeText(url.toString()).then(() => {
      toast({
        title: 'Link Copied',
        description: 'You can now share this flower with someone.',
      });
    });
  };

  return (
    <div className="mt-8 flex flex-col items-center gap-4">
        {bouquet.deliveryType === 'private' && (
            <Button onClick={handleCopyLink} variant="outline" size="lg">
                <Copy className="mr-2 h-4 w-4" />
                Copy Private Link
            </Button>
        )}
        <Separator className="w-24 my-2" />
        <div className="flex gap-4">
            <Button asChild variant="ghost">
                <Link href="/send">
                    <CornerUpLeft className="mr-2 h-4 w-4" />
                    Send a Flower
                </Link>
            </Button>
        </div>
        <Button variant="link" size="sm" className="text-muted-foreground hover:text-destructive">
            Report
        </Button>
    </div>
  );
}
