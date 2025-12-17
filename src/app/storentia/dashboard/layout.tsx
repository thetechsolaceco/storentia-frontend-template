"use client";

import { AdminSidebar } from "@/components/admin/sidebar";
import { TopNav } from "@/components/admin/top-nav";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        {/* Sidebar Container */}
        <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

        {/* Content Container */}
        <div
          className={cn(
            "flex-1 transition-all duration-300 relative",
            collapsed ? "ml-[68px]" : "ml-[232px]"
          )}
        >
          <div className="bg-muted/40 min-h-screen relative shadow-sm">
            <div className="flex justify-end pt-6 px-8 z-50">
              <TopNav />
            </div>
            <main className="px-8 pb-8 pt-4 flex-1">
              <div>{children}</div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
