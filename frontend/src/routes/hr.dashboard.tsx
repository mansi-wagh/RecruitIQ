import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Users,
  Briefcase,
  Sparkles,
  Gauge,
  Plus,
  Upload,
  Bot,
  ArrowUpRight,
  FileText,
} from "lucide-react";
import { KpiCard } from "@/components/kpi-card";
import { PageHeader } from "@/components/portal-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MatchScorePill, StatusBadge } from "@/components/status-badge";
import { candidates } from "@/lib/mock-data";

export const Route = createFileRoute("/hr/dashboard")({
  component: Dashboard,
});

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

function Dashboard() {
  const recent = candidates.slice(0, 5);

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");

    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  return (
    <>
      <PageHeader
          title={`Welcome, ${user?.name ?? "Recruiter"}`}
          description={`Logged in as ${user?.email ?? ""}`}
          actions={
            <Button size="sm">
              <Plus className="mr-1.5 h-4 w-4" /> Create job
            </Button>
          }
        />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total candidates" value="1,284" delta="+12.4% vs last month" icon={Users} />
        <KpiCard label="Open jobs" value="24" delta="3 new this week" icon={Briefcase} />
        <KpiCard label="Recommended" value="86" delta="+8 today" icon={Sparkles} />
        <KpiCard label="Avg. match score" value="82%" delta="+2.1% this week" icon={Gauge} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Card className="border-border/60 shadow-[var(--shadow-card)] xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <div>
              <CardTitle className="text-base font-semibold">Recent candidates</CardTitle>
              <p className="text-xs text-muted-foreground">Latest applicants across your open roles.</p>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to="/hr/candidates">
                View all <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Match</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                            {c.avatarInitials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium">{c.name}</div>
                          <div className="truncate text-xs text-muted-foreground">{c.location}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{c.role}</TableCell>
                    <TableCell><MatchScorePill value={c.matchScore} /></TableCell>
                    <TableCell><StatusBadge status={c.status} /></TableCell>
                    <TableCell className="text-right">
                      <Button asChild size="sm" variant="ghost">
                        <Link to="/hr/candidates/$id" params={{ id: c.id }}>View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border/60 shadow-[var(--shadow-card)]">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Quick actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              <QuickAction icon={Upload} label="Upload job" />
              <QuickAction icon={Plus} label="Create job" />
              <QuickAction icon={Sparkles} label="Analyze candidate" />
              <QuickAction icon={Bot} label="Open assistant" />
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-[var(--shadow-card)]">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Recent AI activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ActivityRow
                icon={Sparkles}
                title="3 new recommendations"
                subtitle="For Senior Backend Engineer"
                time="12m"
              />
              <ActivityRow
                icon={FileText}
                title="Resume uploaded"
                subtitle="Zara Ahmed · Backend"
                time="1h"
              />
              <ActivityRow
                icon={Briefcase}
                title="Job posted"
                subtitle="Product Designer · Berlin"
                time="4h"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

function QuickAction({ icon: Icon, label }: { icon: typeof Users; label: string }) {
  return (
    <button className="group flex flex-col items-start gap-2 rounded-lg border border-border/70 p-3 text-left transition hover:border-primary/30 hover:bg-primary/5">
      <div className="grid h-8 w-8 place-items-center rounded-md bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="h-4 w-4" />
      </div>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

function ActivityRow({
  icon: Icon,
  title,
  subtitle,
  time,
}: {
  icon: typeof Users;
  title: string;
  subtitle: string;
  time: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{title}</div>
        <div className="truncate text-xs text-muted-foreground">{subtitle}</div>
      </div>
      <span className="text-xs text-muted-foreground">{time}</span>
    </div>
  );
}
