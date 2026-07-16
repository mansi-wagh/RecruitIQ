import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, Sparkles, Calendar, ArrowUpRight, Briefcase, MapPin, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/portal-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { KpiCard } from "@/components/kpi-card";
import { StatusBadge } from "@/components/status-badge";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/candidate/dashboard")({
  component: CandidateDashboard,
});

interface StoredUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Application {
  id: number;
  job_id: number;
  job_title: string;
  company: string;
  status: string;
  match_score: number;
  applied_at: string;
}

interface Job {
  id: number;
  title: string;
  department: string | null;
  location: string | null;
  employment_type: string | null;
  required_skills: string | null;
  experience_required: string | null;
}

interface ProfileResponse {
  id: number;
  resumes: { id: number; resume_path: string }[];
  skills?: string[];
  experience?: string;
}

function CandidateDashboard() {
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [hasResume, setHasResume] = useState(false);
  const [resumeScore, setResumeScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (stored) {
      setCurrentUser(JSON.parse(stored));
    }
  }, []);

  const loadDashboardData = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const [appsRes, jobsRes, profileRes] = await Promise.all([
        api.get<Application[]>("/applications/"),
        api.get<Job[]>("/jobs/"),
        api.get<ProfileResponse>(`/candidates/${currentUser.id}`),
      ]);

      setApplications(appsRes.data);
      // Filter out jobs that the candidate already applied to, or just take first 3 open jobs
      const appliedJobIds = new Set(appsRes.data.map((a) => a.job_id));
      const openJobs = jobsRes.data
        .filter((j) => !appliedJobIds.has(j.id))
        .slice(0, 3);
      setRecommendedJobs(openJobs);
      
      const hasRes = profileRes.data.resumes && profileRes.data.resumes.length > 0;
      setHasResume(hasRes);

      if (hasRes) {
        let score = 30; // base score for uploading a resume
        if (profileRes.data.skills && profileRes.data.skills.length > 0) {
          score += Math.min(profileRes.data.skills.length * 5, 35);
        }
        if (profileRes.data.experience && profileRes.data.experience !== "Not provided") {
          score += 35;
        }
        setResumeScore(Math.min(score, 100));
      } else {
        setResumeScore(0);
      }
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      void loadDashboardData();
    }
  }, [currentUser]);

  const handleApply = async (jobId: number) => {
    try {
      await api.post("/applications/", { job_id: jobId });
      toast.success("Applied successfully!");
      void loadDashboardData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to apply. You might have already applied.");
    }
  };

  const interviewsCount = applications.filter(
    (a) => a.status.toLowerCase() === "interview"
  ).length;

  const scores = applications.map((a) => a.match_score).filter((s) => s > 0);
  const resumeScore = hasResume ? (scores.length > 0 ? Math.max(...scores) : 70) : 0;

  return (
    <>
      <Card className="mb-6 overflow-hidden border-border/60 bg-accent text-accent-foreground shadow-[var(--shadow-card)]">
        <CardContent className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-6">
          <div className="min-w-0">
            <div className="text-xs uppercase tracking-wider text-accent-foreground/60">Welcome back</div>
            <h1 className="mt-1 truncate text-2xl font-semibold tracking-tight">
              Hi {currentUser?.name ?? "Candidate"} 👋
            </h1>
            <p className="mt-1 text-sm text-accent-foreground/70">
              {hasResume
                ? `You have ${recommendedJobs.length} new job matches and ${interviewsCount} upcoming interview status updates.`
                : "Please upload your resume to start matching with jobs."}
            </p>
          </div>
          <Button asChild variant="secondary" className="shrink-0 bg-white text-accent hover:bg-white/90">
            <Link to="/candidate/upload">
              {hasResume ? "Update resume" : "Upload resume"}
            </Link>
          </Button>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard label="Resume score" value={hasResume ? String(resumeScore) : "N/A"} delta={hasResume ? "Optimized" : "No resume"} icon={FileText} />
            <KpiCard label="Applications" value={String(applications.length)} delta="Total submissions" icon={Briefcase} />
            <KpiCard label="Job matches" value={String(recommendedJobs.length)} delta="Active open postings" icon={Sparkles} />
            <KpiCard label="Interviews" value={String(interviewsCount)} delta="Status updates" icon={Calendar} />
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-3">
            <Card className="border-border/60 shadow-[var(--shadow-card)] xl:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <div>
                  <CardTitle className="text-base font-semibold">Matching jobs</CardTitle>
                  <p className="text-xs text-muted-foreground">Open roles from PostgreSQL database.</p>
                </div>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/candidate/jobs">
                    See all <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {recommendedJobs.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-6 text-center">
                    No new matching jobs found. Check back later!
                  </p>
                ) : (
                  recommendedJobs.map((j) => (
                    <div key={j.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-lg border border-border/70 p-4 transition hover:border-primary/30 hover:bg-primary/[0.02]">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">{j.title}</div>
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <Briefcase className="h-3 w-3" /> {j.department || "Engineering"}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {j.location || "Remote"}
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {j.required_skills ? (
                            j.required_skills.split(",").map((s) => (
                              <Badge key={s} variant="secondary" className="rounded-full font-normal">
                                {s.trim()}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </div>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-2">
                        <Button size="sm" onClick={() => void handleApply(j.id)}>
                          Apply
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="border-border/60 shadow-[var(--shadow-card)]">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">Resume health</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-baseline gap-2">
                    <div className="text-4xl font-semibold tracking-tight">{resumeScore}</div>
                    <div className="text-sm text-muted-foreground">/ 100</div>
                  </div>
                  <Progress value={resumeScore} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {hasResume
                      ? "Great foundation. Use AI analysis to see missing skills and matches."
                      : "Upload your resume first to evaluate structure and key technical skills."}
                  </p>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link to="/candidate/upload">Manage resume</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-border/60 shadow-[var(--shadow-card)]">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">Hiring policy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="rounded-lg border border-border/70 p-3">
                    <div className="text-sm font-medium">Standard Screening</div>
                    <div className="text-xs text-muted-foreground">Applications undergo automated AI screening and human recruiter review.</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="mt-6 border-border/60 shadow-[var(--shadow-card)]">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Recent applications</CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-border/70">
              {applications.length === 0 ? (
                <p className="text-sm text-muted-foreground py-6 text-center">
                  You haven't applied to any roles yet.
                </p>
              ) : (
                applications.slice(0, 5).map((a) => (
                  <div key={a.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{a.job_title}</div>
                      <div className="text-xs text-muted-foreground">
                        {a.company} · Applied {new Date(a.applied_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="text-xs font-semibold text-muted-foreground">{a.match_score}%</span>
                      <StatusBadge status={a.status as any} />
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </>
      )}
    </>
  );
}
