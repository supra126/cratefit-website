'use client';

import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/lib/docs';

interface SidebarProps {
  navigation: NavItem[];
}

export function Sidebar({ navigation }: SidebarProps) {
  const pathname = usePathname();

  return (
    <nav className="space-y-6">
      {navigation.map((section) => (
        <div key={section.href}>
          <Link
            href={section.href}
            className={cn(
              'block text-sm font-semibold',
              pathname === section.href
                ? 'text-primary'
                : 'text-foreground hover:text-primary'
            )}
          >
            {section.title}
          </Link>
          {section.items && section.items.length > 0 && (
            <ul className="mt-2 space-y-1 border-l pl-4">
              {section.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'block py-1 text-sm transition-colors',
                      pathname === item.href
                        ? 'font-medium text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </nav>
  );
}
