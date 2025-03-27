"use client";

import type React from "react";
// import Link from "next/link"
// import { usePathname } from "next/navigation"
import { Link, useMatches } from "@tanstack/react-router";
import { Calendar, Home, LogOut, Settings } from "lucide-react";
import { LogoBlue } from "@/components/icons";

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
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  //   const pathname = usePathname()
  const matches = useMatches();
  const currentPath = matches[matches.length - 1].pathname;

  return (
    <div className="flex h-screen w-16 flex-col justify-between border-r bg-white py-6 md:w-64">
      <div>
        <div className="flex justify-center md:justify-start md:px-6">
          <Link to="/dashboard" className="flex items-center gap-2">
            <LogoBlue />
          </Link>
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
                        "flex h-10 items-center justify-center rounded-md md:justify-start md:px-4",
                        isActivePath
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="hidden md:ml-2 md:inline-block">
                        {item.title}
                      </span>
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
                className="h-10 w-full justify-center md:justify-start md:px-4"
              >
                <LogOut className="h-5 w-5 text-muted-foreground" />
                <span className="hidden md:ml-2 md:inline-block">Logout</span>
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
