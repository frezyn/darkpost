'use client';

import { usePathname } from 'next/navigation'; // Next.js
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar"
import { Check } from 'lucide-react'; // ícone de check (ou use outro)
import { cn } from '@workspace/ui/lib/utils';
import Link from 'next/link';


export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: React.ComponentType<{ className?: string }>
  }[]
}) {
  const pathname = usePathname();
  // const { pathname } = useLocation(); // React Router

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            const isActive = pathname === item.url;

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className={cn(
                    "justify-start",
                    isActive && "bg-accent text-accent-foreground"
                  )}
                >
                  <Link prefetch href={item.url} className="flex items-center gap-2 w-full">
                    {item.icon && <item.icon className="h-4 w-4" />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
