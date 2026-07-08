import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, Sparkles, Calendar, ArrowUpRight, Briefcase, MapPin } from "lucide-react";
import { PageHeader } from "@/components/portal-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { KpiCard } from "@/components/kpi-card";
import { applications } from "@/lib/mock-data";
import { StatusBadge } from "@/components/status-badge";

export const Route = createFileRoute("/candidate/dashboard")({
  component: CandidateDashboard,
});

const jobs = [
  { title: "Senior Product Designer", company: "Linear", location: "Remote", match: 91, skills: ["Figma", "Design systems"] },
  { title: "Frontend Engineer", company: "Stripe", location: "Dublin", match: 84, skills: ["React", "TypeScript"] },
  { title: "Design Systems Lead", company: "Notion", location: "San Francisco", match: 96, skills: ["Figma", "Tokens"] },
];

function CandidateDashboard() {
  return (
    <>
      <Card className="mb-6 overflow-hidden border-border/60 bg-accent text-accent-foreground shadow-[var(--shadow-card)]">
        <CardContent className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-6">
          <div className="min-w-0">
            <div className="text-xs uppercase tracking-wider text-accent-foreground/60">Welcome back</div>
            <h1 className="mt-1 truncate text-2xl font-semibold tracking-tight">Hi Jordan 👋</h1>
            <p className="mt-1 text-sm text-accent-foreground/70">
              You have 3 new job matches and 1 upcoming interview this week.
            </p>
          </div>
          <Button asChild variant="secondary" className="shrink-0 bg-white text-accent hover:bg-white/90">
            <Link to="/candidate/upload">Update resume</Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Resume score" value="86" delta="+4 this week" icon={FileText} />
        <KpiCard label="Applications" value="12" delta="4 in review" icon={Briefcase} />
        <KpiCard label="Recommended jobs" value="24" delta="8 new" icon={Sparkles} />
        <KpiCard label="Interviews" value="3" delta="1 upcoming" icon={Calendar} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Card className="border-border/60 shadow-[var(--shadow-card)] xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <div>
              <CardTitle className="text-base font-semibold">Recommended jobs</CardTitle>
              <p className="text-xs text-muted-foreground">Personalized by RecruitIQ AI.</p>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to="/candidate/jobs">
                See all <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {jobs.map((j) => (
              <div key={j.title} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-lg border border-border/70 p-4 transition hover:border-primary/30 hover:bg-primary/[0.02]">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{j.title}</div>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Briefcase className="h-3 w-3" /> {j.company}</span>
                    <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {j.location}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {j.skills.map((s) => (
                      <Badge key={s} variant="secondary" className="rounded-full font-normal">{s}</Badge>
                    ))}
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">{j.match}% match</span>
                  <Button size="sm">Apply</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border/60 shadow-[var(--shadow-card)]">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Resume health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-baseline gap-2">
                <div className="text-4xl font-semibold tracking-tight">86</div>
                <div className="text-sm text-muted-foreground">/ 100</div>
              </div>
              <Progress value={86} className="h-2" />
              <p className="text-xs text-muted-foreground">Great foundation. Add measurable outcomes to strengthen it further.</p>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link to="/candidate/upload">View suggestions</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-[var(--shadow-card)]">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Upcoming interview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg border border-border/70 p-3">
                <div className="text-sm font-medium">Product Design Interview</div>
                <div className="text-xs text-muted-foreground">Linear · Wed, Jan 15 · 10:00 AM</div>
              </div>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link to="/candidate/interview-prep">Prepare now</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-6 border-border/60 shadow-[var(--shadow-card)]">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Applications</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border/70">
          {applications.map((a) => (
            <div key={a.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{a.jobTitle}</div>
                <div className="text-xs text-muted-foreground">{a.company} · Applied {a.appliedAt}</div>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="text-xs font-semibold text-muted-foreground">{a.matchScore}%</span>
                <StatusBadge status={a.status} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
}
