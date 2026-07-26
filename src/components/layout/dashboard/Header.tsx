'use client';

import { Menu, Bell, ChevronRight, Sparkles } from "lucide-react";
import { useLayoutStore } from "@/store/layoutStore";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import AuthLinks from "../cms/AuthLinks";

export function Header() {
  const { toggleSidebar, isSidebarCollapsed } = useLayoutStore();

  return (
    <header className="fixed top-0 left-0 right-0 flex items-center h-16 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 z-50 transition-colors">
      {/* Sidebar Sync Container */}
      <div className={cn(
        "h-full flex items-center px-6 border-r border-zinc-200 dark:border-zinc-800 transition-all duration-300 ease-in-out shrink-0",
        isSidebarCollapsed ? "w-20 px-4 justify-center" : "w-64"
      )}>
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          {!isSidebarCollapsed && (
            <span className="text-xl font-black text-zinc-900 dark:text-white tracking-tight whitespace-nowrap">Butterscribe</span>
          )}
        </Link>
      </div>

      <div className="flex-1 flex justify-between items-center px-6 h-full">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors cursor-pointer active:opacity-80"
          >
            <Menu className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
          </button>

          <nav className="flex items-center gap-2 text-sm text-zinc-500 font-medium hidden md:flex">
            <span className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors cursor-pointer">Workspace</span>
            <ChevronRight className="w-3 h-3 text-zinc-300 dark:text-zinc-700" />
            <span className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors cursor-pointer">Project</span>
            <ChevronRight className="w-3 h-3 text-zinc-300 dark:text-zinc-700" />
            <span className="text-zinc-900 dark:text-white font-semibold">Dashboard</span>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button className="w-10 h-10 flex items-center justify-center text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors relative">
            <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full border-2 border-white dark:border-zinc-950"></span>
            <Bell className="w-5 h-5" />
          </button>

          <AuthLinks />
        </div>
      </div>
    </header>
  );
}
