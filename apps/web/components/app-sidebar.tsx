"use client"

import * as React from "react"
import {
  IconChartBar,
  IconDashboard,
  IconFolder,
  IconHelp,
  IconListDetails,
  IconSearch,
  IconSettings,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@workspace/ui/components/sidebar"
import Image from "next/image"
import Logo from "../public/images/logo.png"
import { Icon } from "lucide-react"


const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Contas",
      url: "/dashboard/accounts",
      icon: IconListDetails,
    },
    {
      title: "Analytics",
      url: "#",
      icon: IconChartBar,
    },
    {
      title: "API",
      url: "#",
      icon: IconFolder,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
}


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" variant="sidebar"{...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton

              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >

              <img
                src={Logo.src}
                alt="Dark Post"
                width={80}
                height={80}
                className="h-10 w-10 object-contain transition-all group-data-[state=collapsed]:absolute group-data-[state=collapsed]:left-[1px] group-data-[state=collapsed]:scale-150 group-data-[state=collapsed]:!w-15 group-data-[state=collapsed]:!h-15"

              />
              <span className="text-base font-semibold group-data-[state=collapsed]:hidden">Dark Post</span>

            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar >
  )
}
