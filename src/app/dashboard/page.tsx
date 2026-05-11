'use client';

import { Sidebar } from "@/components/layout/dashboard/Sidebar";
import { Header } from "@/components/layout/dashboard/Header";
import { Footer } from "@/components/layout/dashboard/Footer";
import { HeroPrompt } from "@/modules/dashboard/components/HeroPrompt";
import { StatsGrid } from "@/modules/dashboard/components/StatsGrid";
import { ContentTable } from "@/modules/dashboard/components/ContentTable";
import { useLayoutStore } from "@/store/layoutStore";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const { isSidebarCollapsed } = useLayoutStore();

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <Header />
      <Sidebar />
      <main className={cn(
        "flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out pt-16",
        isSidebarCollapsed ? "ml-20" : "ml-64"
      )}>
        <div className="p-8 space-y-8 max-w-[1440px] mx-auto w-full flex-1">
          <HeroPrompt />
          <StatsGrid />
          <ContentTable />
        </div>
        
        <Footer />
      </main>
    </div>
  );
}
