import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppSidebarHR } from "@/components/app-sidebar-hr";
import { PortalShell } from "@/components/portal-shell";

export const Route = createFileRoute("/hr")({
  component: () => (
    <PortalShell
      sidebar={<AppSidebarHR />}
      userName="Alex Morgan"
      userInitials="AM"
      userRole="Talent Lead"
    >
      <Outlet />
    </PortalShell>
  ),
});
