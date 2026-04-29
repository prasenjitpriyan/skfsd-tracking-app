'use client';

import AnimatedIcon from '@/components/motion/AnimatedIcon';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { useAuth, useIsAdmin } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/runtime-client';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Building2,
  LayoutDashboard,
  LogOut,
  Settings,
  Target,
  Truck,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/offices', label: 'Office Data', icon: Building2 },
  { href: '/delivery', label: 'Delivery Centres', icon: Truck },
  { href: '/targets', label: 'Targets', icon: Target },
  { href: '/admin', label: 'Admin', icon: Settings, adminOnly: true },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const { user, signOut } = useAuth();
  const { isAdmin } = useIsAdmin(user?.id);

  const { scrollY } = useScroll();
  const headerHeight = useTransform(scrollY, [0, 100], [64, 56]);
  const headerShadow = useTransform(
    scrollY,
    [0, 50],
    ['0 1px 2px rgba(0,0,0,0.05)', '0 4px 20px rgba(0,0,0,0.1)']
  );

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();
      return data;
    },
    enabled: !!user?.id,
  });

  const displayName = profile?.full_name || user?.email;

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error('Failed to sign out');
    } else {
      toast.success('Signed out successfully');
      router.push('/auth'); // ✅ Next navigation
    }
  };

  const filteredNavItems = navItems.filter(
    (item) => !item.adminOnly || isAdmin
  );

  return (
    <>
      <motion.header
        className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur-md"
        style={{ height: headerHeight, boxShadow: headerShadow }}>
        <div className="container flex h-full items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-3">
            <motion.img
              src="/favicon.png"
              className="h-10 w-10 rounded-md"
              whileHover={{ rotate: 10, scale: 1.1 }}
            />
            <div>
              <h1 className="text-lg font-bold">SKFSD</h1>
              <p className="text-xs text-muted-foreground">
                Performance Tracker
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-md',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}>
                  <AnimatedIcon icon={Icon} className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {user && (
              <div className="hidden lg:flex items-center gap-2 text-sm">
                <AnimatedIcon icon={User} className="h-4 w-4" />
                {displayName}
              </div>
            )}

            <ThemeToggle />

            <Button onClick={handleSignOut} size="sm">
              <AnimatedIcon icon={LogOut} className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </motion.header>
    </>
  );
}
