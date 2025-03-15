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

const navMain = [
  {
    title: "Overview",
    url: "#",
    icon: HomeIcon,
    isActive: true,
  },
  {
    title: "Transactions",
    url: "#",
    icon: ArrowUpDownIcon,
  },
  {
    title: "Budget",
    url: "#",
    icon: ChartPieIcon,
  },
  {
    title: "Pots",
    url: "#",
    icon: PiggyBankIcon,
  },
  {
    title: "Recurring Bills",
    url: "#",
    icon: ReceiptTextIcon,
  },
];

export function NavMain() {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {navMain.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton tooltip={item.title}>
              {item.icon && <item.icon />}
              <span>{item.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
