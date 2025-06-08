import type React from "react";
// import Link from "next/link"
// import { usePathname } from "next/navigation"
import { Link, useMatches } from "@tanstack/react-router";
import { Calendar, Home, LogOut, Settings, X, Users } from "lucide-react";
import { LogoBlue } from "@/components/icons";
import { useRouter } from "@tanstack/react-router";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type NavItem = {
  title: string;
  href: string;
  icon: React.ElementType;
};

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Appointments",
    href: "/appointments",
    icon: Calendar,
  },
  {
    title: "Patients",
    href: "/patients",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  //   const pathname = usePathname()
  const router = useRouter();
  const matches = useMatches();
  const currentPath = matches[matches.length - 1].pathname;

  return (
    <div className="flex h-full flex-col justify-between border-r bg-white py-6 w-64">
      <div>
        {/* Mobile close button */}
        <div className="flex items-center justify-between md:justify-start md:px-6 px-4">
          <Link
            to="/dashboard"
            className="flex items-center gap-2"
            onClick={onNavigate}
          >
            <LogoBlue />
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onNavigate}
            aria-label="Close sidebar"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        <div className="mt-10 space-y-1 px-2">
          <TooltipProvider delayDuration={0}>
            {navItems.map((item) => {
              const isActivePath = currentPath === item.href;

              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Link
                      to={item.href}
                      className={cn(
                        "flex h-10 items-center gap-2 justify-start rounded-md px-4",
                        isActivePath
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                      onClick={onNavigate}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="ml-2">{item.title}</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="md:hidden">
                    {item.title}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </TooltipProvider>
        </div>
      </div>
      <div className="px-2">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-full justify-start px-4"
                onClick={() => {
                  localStorage.removeItem("user_id");
                  localStorage.removeItem("access_token");
                  router.navigate({ to: "/" });
                }}
              >
                <LogOut className="h-5 w-5 text-muted-foreground" />
                <span className="ml-2">Logout</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="md:hidden">
              Logout
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
