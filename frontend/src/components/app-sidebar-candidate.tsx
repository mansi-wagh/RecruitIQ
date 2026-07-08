import { Link, useRouterState } from "@tanstack/react-router";
import logo from "@/assets/recruitiq-logo.png";
import {
  LayoutDashboard,
  Upload,
  Sparkles,
  FileText,
  GraduationCap,
  User,
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
  { title: "Dashboard", url: "/candidate/dashboard", icon: LayoutDashboard },
  { title: "Upload Resume", url: "/candidate/upload", icon: Upload },
  { title: "Recommended Jobs", url: "/candidate/jobs", icon: Sparkles },
  { title: "Applications", url: "/candidate/applications", icon: FileText },
  { title: "Interview Prep", url: "/candidate/interview-prep", icon: GraduationCap },
  { title: "Profile", url: "/candidate/profile", icon: User },
];

export function AppSidebarCandidate() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <Sidebar collapsible="icon" className="border-r border-border/70">
      <SidebarHeader className="border-b border-border/70">
        <Link to="/candidate/dashboard" className="flex items-center gap-2 px-2 py-2">
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
          <SidebarGroupLabel>Your career</SidebarGroupLabel>
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
