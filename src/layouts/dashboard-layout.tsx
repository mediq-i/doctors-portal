import type { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity md:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
        onClick={() => setSidebarOpen(false)}
      />
      {/* Sidebar */}
      <div
        className={`
          fixed z-50 inset-y-0 left-0 w-64 bg-white border-r transition-transform
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:static md:translate-x-0 md:w-64
        `}
      >
        <Sidebar onNavigate={() => setSidebarOpen(false)} />
      </div>
      {/* Main content */}
      <main className="flex-1 overflow-auto p-4 md:p-6">
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <span className="ml-2 font-bold text-lg">Dashboard</span>
        </div>
        {children}
      </main>
    </div>
  );
}
