'use client';

import { 
  LayoutDashboard, 
  Sparkles, 
  FileText, 
  ShieldCheck, 
  Calendar,
  LogOut
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useLayoutStore } from "@/store/layoutStore";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Sparkles, label: "Create Content", href: "/create-content" },
  { icon: Calendar, label: "Content Calendar", href: "/content-calendar" },
  { icon: FileText, label: "Content Library", href: "/content-library" },
  { icon: ShieldCheck, label: "Approvals", href: "/approvals" },
];

export function Sidebar() {
  const { isSidebarCollapsed } = useLayoutStore();
  const pathname = usePathname();

  return (
    <aside className={cn(
      "fixed left-0 top-16 h-[calc(100vh-64px)] flex flex-col z-40 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 transition-all duration-300 ease-in-out font-sans",
      isSidebarCollapsed ? "w-20" : "w-64"
    )}>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center transition-all duration-200 ease-in-out font-medium rounded-lg",
                isSidebarCollapsed ? "justify-center p-3" : "gap-3 px-3 py-2",
                isActive 
                  ? "bg-zinc-100 dark:bg-zinc-900 text-primary" 
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900"
              )}
              title={isSidebarCollapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!isSidebarCollapsed && <span className="text-sm tracking-wide truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <Button
        variant="link"
        className="w-full justify-start px-4 rounded-none py-6 cursor-pointer border-t flex h-auto border-zinc-100 bg-zinc-50 hover:bg-primary hover:text-white"
        onClick={() => signOut()}
      >
        <LogOut className="w-5 h-5 shrink-0" />
        <span className="text-sm tracking-wide truncate">Sign Out</span>
      </Button>
    </aside>
  );
}
