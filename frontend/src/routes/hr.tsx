import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppSidebarHR } from "@/components/app-sidebar-hr";
import { PortalShell } from "@/components/portal-shell";
import { useEffect, useState } from "react";

function HRLayout() {
  const [name, setName] = useState("HR Recruiter");
  const [initials, setInitials] = useState("HR");

  useEffect(() => {
    const stored = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (stored) {
      try {
        const user = JSON.parse(stored);
        if (user.name) {
          setName(user.name);
          const parts = user.name.trim().split(/\s+/).slice(0, 2);
          const init = parts.map((p: string) => p[0]?.toUpperCase()).join("") || "HR";
          setInitials(init);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  return (
    <PortalShell
      sidebar={<AppSidebarHR />}
      userName={name}
      userInitials={initials}
      userRole="Talent Lead"
    >
      <Outlet />
    </PortalShell>
  );
}

export const Route = createFileRoute("/hr")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
      const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
      if (!token || !storedUser) {
        throw redirect({
          to: "/login/hr",
        });
      }
      try {
        const user = JSON.parse(storedUser);
        if (user.role.toLowerCase() !== "hr") {
          throw redirect({
            to: "/login/hr",
          });
        }
      } catch {
        throw redirect({
          to: "/login/hr",
        });
      }
    }
  },
  component: HRLayout,
});

