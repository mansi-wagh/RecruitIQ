import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, Briefcase, MapPin, Loader2, Check } from "lucide-react";
import { PageHeader } from "@/components/portal-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import api from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/candidate/jobs")({
  component: JobsPage,
});

interface Job {
  id: number;
  title: string;
  department: string | null;
  location: string | null;
  employment_type: string | null;
  required_skills: string | null;
  experience_required: string | null;
  status: string | null;
}

interface Application {
  id: number;
  job_id: number;
  status: string;
  match_score: number;
}

function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [appliedJobIds, setAppliedJobIds] = useState<Map<number, number>>(new Map()); // Maps job_id -> match_score
  const [q, setQ] = useState("");
  const [employmentType, setEmploymentType] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [jobsRes, appsRes] = await Promise.all([
        api.get<Job[]>("/jobs/"),
        api.get<Application[]>("/applications/"),
      ]);
      // Only display Open jobs to candidates
      const openJobs = jobsRes.data.filter((j) => (j.status || "Open").toLowerCase() === "open");
      setJobs(openJobs);

      const appliedMap = new Map<number, number>();
      appsRes.data.forEach((app) => {
        appliedMap.set(app.job_id, app.match_score);
      });
      setAppliedJobIds(appliedMap);
    } catch (err) {
      console.error("Failed to load jobs data", err);
      toast.error("Failed to load job listings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const handleApply = async (jobId: number) => {
    try {
      await api.post("/applications/", { job_id: jobId });
      toast.success("Application submitted successfully!");
      void loadData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit application.");
    }
  };

  const filteredJobs = jobs.filter((j) => {
    const matchesSearch =
      q === "" ||
      j.title.toLowerCase().includes(q.toLowerCase()) ||
      (j.department || "").toLowerCase().includes(q.toLowerCase());

    const matchesType =
      employmentType === "all" ||
      (j.employment_type || "").toLowerCase() === employmentType.toLowerCase();

    const matchesLoc =
      locationFilter === "all" ||
      (locationFilter === "remote" && (j.location || "").toLowerCase().includes("remote")) ||
      (locationFilter === "onsite" && !(j.location || "").toLowerCase().includes("remote"));

    return matchesSearch && matchesType && matchesLoc;
  });

  return (
    <>
      <PageHeader title="Browse jobs" description="Available opportunities in our platform." />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search roles or departments…" className="h-10 pl-9" />
        </div>
        <Select value={employmentType} onValueChange={setEmploymentType}>
          <SelectTrigger className="h-10 w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="full-time">Full-time</SelectItem>
            <SelectItem value="part-time">Part-time</SelectItem>
            <SelectItem value="contract">Contract</SelectItem>
          </SelectContent>
        </Select>
        <Select value={locationFilter} onValueChange={setLocationFilter}>
          <SelectTrigger className="h-10 w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any location</SelectItem>
            <SelectItem value="remote">Remote</SelectItem>
            <SelectItem value="onsite">On-site</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredJobs.length === 0 ? (
        <Card className="border-border/60 shadow-[var(--shadow-card)]">
          <CardContent className="py-16 text-center text-sm text-muted-foreground">
            No job postings match your search criteria. Check back later!
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredJobs.map((j) => {
            const hasApplied = appliedJobIds.has(j.id);
            const score = appliedJobIds.get(j.id);
            return (
              <Card key={j.id} className="border-border/60 shadow-[var(--shadow-card)] transition hover:border-primary/30">
                <CardContent className="p-5">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
                    <div className="min-w-0">
                      <div className="truncate text-base font-semibold">{j.title}</div>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Briefcase className="h-3 w-3" /> {j.department || "Engineering"}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {j.location || "Remote"}
                        </span>
                        <span>{j.employment_type || "Full-time"}</span>
                      </div>
                    </div>
                    {hasApplied && score !== undefined && score > 0 && (
                      <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                        {score}% match
                      </span>
                    )}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1">
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
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Experience: {j.experience_required || "—"}
                    </span>
                    <div className="flex items-center gap-2">
                      {hasApplied ? (
                        <Button disabled className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-50">
                          <Check className="h-4 w-4 mr-1.5" /> Applied
                        </Button>
                      ) : (
                        <Button size="sm" onClick={() => void handleApply(j.id)}>
                          Apply
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
