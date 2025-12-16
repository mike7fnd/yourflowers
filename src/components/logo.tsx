import { Flower2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        'group flex items-center gap-2 text-foreground transition-colors hover:text-primary',
        className
      )}
    >
      <Flower2 className="h-6 w-6 transition-transform group-hover:rotate-12" />
      <span className="font-headline text-2xl font-normal tracking-tight">
        your<span className="italic">flowers</span>
      </span>
    </Link>
  );
}
