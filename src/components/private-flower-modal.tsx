'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Copy, Send } from 'lucide-react';
import type { Bouquet } from '@/lib/types';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

type PrivateFlowerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  bouquet: Bouquet | null;
  imageUrl?: string;
};

export function PrivateFlowerModal({ isOpen, onClose, bouquet, imageUrl }: PrivateFlowerModalProps) {
    const { toast } = useToast();
    const router = useRouter();

    if (!bouquet) return null;

    const handleCopyLink = () => {
        const privateUrl = `${window.location.origin}/flower/${bouquet.id}`;
        navigator.clipboard.writeText(privateUrl).then(() => {
        toast({
            title: 'Link Copied',
            description: 'You can now share this private flower.',
        });
        });
    };

    const handleSendAnother = () => {
        onClose();
        router.push('/send');
    };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Your Private Flower is Ready</DialogTitle>
          <DialogDescription>
            Share this private link with someone special. Only those with the link can see it.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 flex justify-center">
            {imageUrl && (
                <Image
                    src={imageUrl}
                    alt={bouquet.flower.name}
                    width={200}
                    height={200}
                    className="object-contain drop-shadow-lg"
                    unoptimized
                />
            )}
        </div>
        <DialogFooter className='sm:justify-center gap-2'>
          <Button onClick={handleCopyLink} variant="outline">
            <Copy className="mr-2 h-4 w-4" />
            Copy Link
          </Button>
          <Button onClick={handleSendAnother}>
            <Send className="mr-2 h-4 w-4" />
            Send Another
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
