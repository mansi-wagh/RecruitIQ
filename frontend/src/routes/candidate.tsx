import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppSidebarCandidate } from "@/components/app-sidebar-candidate";
import { PortalShell } from "@/components/portal-shell";
import { useEffect, useState } from "react";

function CandidateLayout() {
  const [name, setName] = useState("Candidate");
  const [initials, setInitials] = useState("C");

  useEffect(() => {
    const stored = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (stored) {
      try {
        const user = JSON.parse(stored);
        if (user.name) {
          setName(user.name);
          const parts = user.name.trim().split(/\s+/).slice(0, 2);
          const init = parts.map((p: string) => p[0]?.toUpperCase()).join("") || "C";
          setInitials(init);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  return (
    <PortalShell
      sidebar={<AppSidebarCandidate />}
      userName={name}
      userInitials={initials}
      userRole="Candidate"
    >
      <Outlet />
    </PortalShell>
  );
}

export const Route = createFileRoute("/candidate")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
      const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
      if (!token || !storedUser) {
        throw redirect({
          to: "/login/candidate",
        });
      }
      try {
        const user = JSON.parse(storedUser);
        if (user.role !== "candidate") {
          throw redirect({
            to: "/login/candidate",
          });
        }
      } catch {
        throw redirect({
          to: "/login/candidate",
        });
      }
    }
  },
  component: CandidateLayout,
});

