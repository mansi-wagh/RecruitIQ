import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Users,
  Briefcase,
  Gauge,
  Plus,
  Upload,
  Bot,
  ArrowUpRight,
  FileText,
  Loader2,
  Sparkles,
} from "lucide-react";
import { KpiCard } from "@/components/kpi-card";
import { PageHeader } from "@/components/portal-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import api from "@/lib/api";

export const Route = createFileRoute("/hr/dashboard")({
  component: Dashboard,
});

// ─── Types ───────────────────────────────────────────────────────────────────

interface StoredUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface DashboardStats {
  total_candidates: number;
  total_jobs: number;
  open_jobs: number;
  avg_match_score: number | null;
}

interface CandidateRow {
  id: number;
  name: string;
  email: string;
  role: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

function Dashboard() {
  const [loggedInUser, setLoggedInUser] = useState<StoredUser | null>(null);

  // KPI state
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  // Recent candidates state
  const [recent, setRecent] = useState<CandidateRow[]>([]);
  const [candidatesLoading, setCandidatesLoading] = useState(true);
  const [candidatesError, setCandidatesError] = useState<string | null>(null);

  // ── Restore logged-in user from localStorage ───────────────────────────────
  useEffect(() => {
    const stored = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (stored) {
      setLoggedInUser(JSON.parse(stored));
    }
  }, []);

  // ── Fetch dashboard data from PostgreSQL ───────────────────────────────────
  useEffect(() => {
    const fetchStats = async () => {
      setStatsLoading(true);
      setStatsError(null);
      try {
        const res = await api.get<DashboardStats>("/candidates/stats");
        setStats(res.data);
      } catch {
        setStatsError("Failed to load KPIs");
      } finally {
        setStatsLoading(false);
      }
    };

    const fetchCandidates = async () => {
      setCandidatesLoading(true);
      setCandidatesError(null);
      try {
        const res = await api.get<CandidateRow[]>("/candidates/");
        // Most-recently-registered first (backend already sorts DESC by id)
        setRecent(res.data.slice(0, 5));
      } catch {
        setCandidatesError("Failed to load recent candidates");
      } finally {
        setCandidatesLoading(false);
      }
    };

    // Fire both requests in parallel
    void Promise.all([fetchStats(), fetchCandidates()]);
  }, []);

  // ── KPI helpers ───────────────────────────────────────────────────────────
  const fmtStat = (n: number | null | undefined, fallback = "—") =>
    n != null ? n.toLocaleString() : fallback;

  const avgMatchLabel = stats?.avg_match_score != null
    ? `${stats.avg_match_score.toFixed(1)}%`
    : "N/A";

  return (
    <>
      <PageHeader
        title={`Welcome, ${loggedInUser?.name ?? "Recruiter"}`}
        description={`Logged in as ${loggedInUser?.email ?? ""}`}
        actions={
          <Button asChild size="sm">
            <Link to="/hr/jobs">
              <Plus className="mr-1.5 h-4 w-4" /> Create job
            </Link>
          </Button>
        }
      />

      {/* ── KPI cards ── */}
      {statsError ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {statsError}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            label="Total candidates"
            value={statsLoading ? "…" : fmtStat(stats?.total_candidates)}
            delta="From PostgreSQL"
            icon={Users}
          />
          <KpiCard
            label="Total jobs"
            value={statsLoading ? "…" : fmtStat(stats?.total_jobs)}
            delta="All job postings"
            icon={Briefcase}
          />
          <KpiCard
            label="Open jobs"
            value={statsLoading ? "…" : fmtStat(stats?.open_jobs)}
            delta="Currently active"
            icon={Sparkles}
          />
          <KpiCard
            label="Avg. match score"
            value={statsLoading ? "…" : avgMatchLabel}
            delta={stats?.avg_match_score == null ? "Requires AI analysis" : "Across all candidates"}
            icon={Gauge}
          />
        </div>
      )}

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        {/* ── Recent candidates table ── */}
        <Card className="border-border/60 shadow-[var(--shadow-card)] xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <div>
              <CardTitle className="text-base font-semibold">Recent candidates</CardTitle>
              <p className="text-xs text-muted-foreground">
                Latest registrations from PostgreSQL.
              </p>
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
                  <TableHead>Candidate</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidatesLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading candidates…
                      </span>
                    </TableCell>
                  </TableRow>
                ) : candidatesError ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-sm text-destructive">
                      {candidatesError}
                    </TableCell>
                  </TableRow>
                ) : recent.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                      No candidates registered yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  recent.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                              {getInitials(c.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="truncate text-sm font-medium">{c.name}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{c.email}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="rounded-full font-normal capitalize">
                          {c.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-xs text-muted-foreground">#{c.id}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild size="sm" variant="ghost">
                          <Link to="/hr/candidates/$id" params={{ id: String(c.id) }}>
                            View
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* ── Right column ── */}
        <div className="space-y-6">
          {/* Quick actions */}
          <Card className="border-border/60 shadow-[var(--shadow-card)]">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Quick actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              <QuickAction icon={Upload} label="Upload job" to="/hr/jobs" />
              <QuickAction icon={Plus} label="Create job" to="/hr/jobs" />
              <QuickAction icon={Sparkles} label="Analyze candidate" to="/hr/ai-analysis" />
              <QuickAction icon={Bot} label="Open assistant" to="/hr/assistant" />
            </CardContent>
          </Card>

          {/* DB summary card */}
          <Card className="border-border/60 shadow-[var(--shadow-card)]">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Database summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {statsLoading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading…
                </div>
              ) : (
                <>
                  <SummaryRow
                    icon={Users}
                    label="Candidates in DB"
                    value={fmtStat(stats?.total_candidates)}
                  />
                  <SummaryRow
                    icon={Briefcase}
                    label="Job postings"
                    value={fmtStat(stats?.total_jobs)}
                  />
                  <SummaryRow
                    icon={Sparkles}
                    label="Open roles"
                    value={fmtStat(stats?.open_jobs)}
                  />
                  <SummaryRow
                    icon={FileText}
                    label="Recent candidates shown"
                    value={String(recent.length)}
                  />
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function QuickAction({
  icon: Icon,
  label,
  to,
}: {
  icon: typeof Users;
  label: string;
  to: string;
}) {
  return (
    <Link
      to={to}
      className="group flex flex-col items-start gap-2 rounded-lg border border-border/70 p-3 text-left transition hover:border-primary/30 hover:bg-primary/5"
    >
      <div className="grid h-8 w-8 place-items-center rounded-md bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="h-4 w-4" />
      </div>
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}

function SummaryRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border/70 px-3 py-2 text-sm">
      <span className="inline-flex items-center gap-2 text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </span>
      <span className="font-semibold tabular-nums">{value}</span>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "C"
  );
}
