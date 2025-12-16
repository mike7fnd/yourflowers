import { Logo } from '@/components/logo';
import { Navigation } from '@/components/navigation';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />
        <Navigation />
      </div>
    </header>
  );
}
