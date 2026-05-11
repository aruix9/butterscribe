'use client';

import { 
  LayoutDashboard, 
  Sparkles, 
  FileText, 
  ShieldCheck, 
  Calendar
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useLayoutStore } from "@/store/layoutStore";

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

      <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 mt-auto">
        <div className={cn(
          "flex items-center gap-3 p-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-lg cursor-pointer transition-colors",
          isSidebarCollapsed && "justify-center px-0"
        )}>
          <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden shrink-0 relative border border-zinc-100 dark:border-zinc-800">
             <Image 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuChdDyNlsTwijRrQBsRUTqaIRov7JarEE2u3XXqCVr7v12wNeZEIO3iv8KwBU6I41J-Y14eYg6sEeHcCGA8cisoXslBwO7onmT3jcm93olS2GD9qZJCGOoVkOtPDdOdT9X5fJKXPrwqDuBn4LVzM7nl8NmVGZ0QJUQOERmgcOc5dxXOsMLspBuR9-xt3onsAX1mkX2iwmgqlH7vZx0MoP0wwq6kJgcoOJ1FHN7_ZNvpJXFJiy2yDPMiKNa0EoORRdARVxbsogtQ1g"
              alt="User profile"
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          {!isSidebarCollapsed && (
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-bold text-zinc-900 dark:text-white truncate">Intelligence Engine</span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 truncate">Pro Plan</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
