import { Link, useRouterState } from "@tanstack/react-router";
import logo from "@/assets/recruitiq-logo.png";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Sparkles,
  Bot,
  BarChart3,
  Settings,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/hr/dashboard", icon: LayoutDashboard },
  { title: "Candidates", url: "/hr/candidates", icon: Users },
  { title: "Jobs", url: "/hr/jobs", icon: Briefcase },
  { title: "AI Analysis", url: "/hr/ai-analysis", icon: Sparkles },
  { title: "HR Assistant", url: "/hr/assistant", icon: Bot },
  { title: "Reports", url: "/hr/reports", icon: BarChart3 },
  { title: "Settings", url: "/hr/settings", icon: Settings },
];

export function AppSidebarHR() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <Sidebar collapsible="icon" className="border-r border-border/70">
      <SidebarHeader className="border-b border-border/70">
        <Link to="/hr/dashboard" className="flex items-center gap-2 px-2 py-2">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm group-data-[collapsible=icon]:grid hidden">
            <span className="text-sm font-bold">R</span>
          </div>
          <img
            src={logo}
            alt="RecruitIQ"
            className="h-7 w-auto group-data-[collapsible=icon]:hidden"
          />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-border/70">
        <div className="px-2 py-2 text-[11px] text-muted-foreground group-data-[collapsible=icon]:hidden">
          v1.0 · © RecruitIQ
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
