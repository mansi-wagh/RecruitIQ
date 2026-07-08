import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppSidebarCandidate } from "@/components/app-sidebar-candidate";
import { PortalShell } from "@/components/portal-shell";

export const Route = createFileRoute("/candidate")({
  component: () => (
    <PortalShell
      sidebar={<AppSidebarCandidate />}
      userName="Jordan Lee"
      userInitials="JL"
      userRole="Candidate"
    >
      <Outlet />
    </PortalShell>
  ),
});
