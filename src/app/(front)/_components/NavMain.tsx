"use client";

import {
  ArrowUpDownIcon,
  ChartPieIcon,
  HomeIcon,
  PiggyBankIcon,
  ReceiptTextIcon,
} from "lucide-react";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/presentation/components/ui/sidebar";
import { cn } from "@/utils/lib/shadcnUtils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navMain = [
  {
    title: "Overview",
    url: "/overview",
    icon: HomeIcon,
    isActive: true,
  },
  {
    title: "Transactions",
    url: "/transactions",
    icon: ArrowUpDownIcon,
  },
  {
    title: "Budget",
    url: "/budget",
    icon: ChartPieIcon,
  },
  {
    title: "Pots",
    url: "/pots",
    icon: PiggyBankIcon,
  },
  {
    title: "Recurring Bills",
    url: "/recurring-bills",
    icon: ReceiptTextIcon,
  },
];

export function NavMain() {
  const pathname = usePathname();
  return (
    <SidebarGroup>
      <SidebarMenu>
        {navMain.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              tooltip={item.title}
              className={cn(pathname.startsWith(item.url) && "bg-secondary")}
              asChild
            >
              <Link href={item.url}>
                <item.icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
