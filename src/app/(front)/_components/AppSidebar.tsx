import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/presentation/components/ui/sidebar";
import {
  ServerCompWithAuthProps,
  serverCompWithAuth,
} from "@/utils/serverCompWithAuth";
import { NavMain } from "./NavMain";
import { NavUser } from "./NavUser";

type AppSidebarProps = React.ComponentProps<typeof Sidebar> &
  ServerCompWithAuthProps;

function AppSidebar({ user, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>{/* <TeamSwitcher teams={data.teams} /> */}</SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export default serverCompWithAuth(AppSidebar);
