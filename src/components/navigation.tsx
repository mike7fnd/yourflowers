'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { GalleryHorizontal, Info, Send } from 'lucide-react';

const links = [
  { href: '/send', label: 'Send Flower', icon: Send },
  { href: '/garden', label: 'Browse', icon: GalleryHorizontal },
  { href: '/about', label: 'About', icon: Info },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-2 sm:gap-4">
      {links.map((link) => {
        const isActive = pathname.startsWith(link.href);
        // Special case for home page to avoid matching all routes
        if (link.href === '/' && pathname !== '/') {
            return (
                 <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                    'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                    )}
                >
                    <link.icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{link.label}</span>
                </Link>
            )
        }
        
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-secondary text-foreground'
                : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
            )}
          >
            <link.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
