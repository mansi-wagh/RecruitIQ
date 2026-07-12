import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Lightbulb,
  Loader2,
  RefreshCw,
  Sparkles,
  Target,
  XCircle,
} from "lucide-react";
import { PageHeader } from "@/components/portal-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";
import api from "@/lib/api";

export const Route = createFileRoute("/hr/ai-analysis")({
  component: AIAnalysisPage,
});

// ── Types ─────────────────────────────────────────────────────────────────────

interface DatasetResume {
  resume_name: string;
  resume_category: string;
}

interface DatasetJob {
  job_id: string;
  title: string;
  company: string;
  location: string;
}

interface Prediction {
  prediction: number;
  match_probability: number;
  recommendation: string;
}

interface AnalysisResult {
  prediction: Prediction;
  features: Record<string, number>;
  matched_skills: string[];
  missing_skills: string[];
  candidate_summary: string;
  skill_gap_analysis: string;
  interview_questions: string;
  resume_suggestions: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

function AIAnalysisPage() {
  // Selectors
  const [resumes, setResumes] = useState<DatasetResume[]>([]);
  const [jobs, setJobs] = useState<DatasetJob[]>([]);
  const [selectedResume, setSelectedResume] = useState<string>("");
  const [selectedJob, setSelectedJob] = useState<string>("");

  // Loading states
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Results
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ── Load resume + job lists for selectors ─────────────────────────────────

  useEffect(() => {
    const fetchOptions = async () => {
      setIsLoadingOptions(true);
      try {
        const [resumeRes, jobRes] = await Promise.all([
          api.get<DatasetResume[]>("/ai/resumes?limit=100"),
          api.get<DatasetJob[]>("/ai/jobs?limit=100"),
        ]);
        setResumes(resumeRes.data);
        setJobs(jobRes.data);

        // Pre-select first items
        if (resumeRes.data.length > 0) setSelectedResume(resumeRes.data[0].resume_name);
        if (jobRes.data.length > 0) setSelectedJob(jobRes.data[0].job_id);
      } catch (err) {
        console.error("Failed to load analysis options", err);
        setError("Unable to load resumes or jobs from the backend.");
      } finally {
        setIsLoadingOptions(false);
      }
    };

    void fetchOptions();
  }, []);

  // ── Run analysis ──────────────────────────────────────────────────────────

  const runAnalysis = async () => {
    if (!selectedResume || !selectedJob) return;

    setIsAnalyzing(true);
    setResult(null);
    setError(null);

    try {
      const response = await api.post<AnalysisResult>(
        `/ai/analyze?resume_name=${encodeURIComponent(selectedResume)}&job_id=${encodeURIComponent(selectedJob)}`,
      );
      setResult(response.data);
    } catch (err: unknown) {
      console.error("Analysis failed", err);
      const detail =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(detail ?? "Analysis failed. The resume or job may not exist in the dataset.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // ── Derived values ─────────────────────────────────────────────────────────

  const matchScore = result
    ? Math.round(result.prediction.match_probability * 100)
    : 0;

  const circumference = 2 * Math.PI * 52;
  const dash = (matchScore / 100) * circumference;

  const featureChart = result
    ? Object.entries(result.features)
        .filter(([, v]) => typeof v === "number")
        .map(([feature, value]) => ({
          feature: feature.replace(/_/g, " "),
          value: Math.round((value as number) * 100) / 100,
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 8)
    : [];

  const selectedJobMeta = jobs.find((j) => j.job_id === selectedJob);
  const selectedResumeMeta = resumes.find((r) => r.resume_name === selectedResume);

  return (
    <>
      <PageHeader
        title="AI analysis"
        description="Deep candidate-job match insights powered by RecruitIQ AI and XGBoost."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {/* Resume selector */}
            <Select
              value={selectedResume}
              onValueChange={setSelectedResume}
              disabled={isLoadingOptions || isAnalyzing}
            >
              <SelectTrigger className="h-9 w-[200px]">
                {isLoadingOptions ? (
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading…
                  </span>
                ) : (
                  <SelectValue placeholder="Select resume" />
                )}
              </SelectTrigger>
              <SelectContent className="max-h-64">
                {resumes.map((r) => (
                  <SelectItem key={r.resume_name} value={r.resume_name}>
                    {r.resume_name}
                    {r.resume_category ? ` · ${r.resume_category}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Job selector */}
            <Select
              value={selectedJob}
              onValueChange={setSelectedJob}
              disabled={isLoadingOptions || isAnalyzing}
            >
              <SelectTrigger className="h-9 w-[200px]">
                {isLoadingOptions ? (
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading…
                  </span>
                ) : (
                  <SelectValue placeholder="Select job" />
                )}
              </SelectTrigger>
              <SelectContent className="max-h-64">
                {jobs.map((j) => (
                  <SelectItem key={j.job_id} value={j.job_id}>
                    {j.title}
                    {j.company && j.company !== "nan" ? ` — ${j.company}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Analyze button */}
            <Button
              size="sm"
              className="h-9"
              disabled={!selectedResume || !selectedJob || isLoadingOptions || isAnalyzing}
              onClick={() => void runAnalysis()}
            >
              {isAnalyzing ? (
                <><Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />Analyzing…</>
              ) : (
                <><Sparkles className="mr-1.5 h-3.5 w-3.5" />Analyze</>
              )}
            </Button>
          </div>
        }
      />

      {/* ── Idle / error state ── */}
      {!result && !isAnalyzing && (
        <Card className="border-border/60 shadow-[var(--shadow-card)]">
          <CardContent className="flex flex-col items-center gap-3 py-20 text-center">
            {error ? (
              <>
                <AlertCircle className="h-8 w-8 text-destructive/60" />
                <p className="text-sm text-destructive">{error}</p>
                <Button variant="outline" size="sm" onClick={() => void runAnalysis()}>
                  <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                  Retry
                </Button>
              </>
            ) : (
              <>
                <Sparkles className="h-8 w-8 text-primary/40" />
                <p className="text-sm text-muted-foreground">
                  Select a resume and job above, then click{" "}
                  <strong className="font-medium">Analyze</strong> to run the AI analysis.
                </p>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Analyzing skeleton ── */}
      {isAnalyzing && (
        <Card className="border-border/60 shadow-[var(--shadow-card)]">
          <CardContent className="flex flex-col items-center gap-3 py-20 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary/60" />
            <p className="text-sm text-muted-foreground">
              Running XGBoost prediction + LLM analysis…
            </p>
          </CardContent>
        </Card>
      )}

      {/* ── Results ── */}
      {result && !isAnalyzing && (
        <div className="grid gap-6 lg:grid-cols-3">

          {/* Selection context */}
          {(selectedResumeMeta || selectedJobMeta) && (
            <Card className="border-border/60 bg-muted/20 shadow-[var(--shadow-card)] lg:col-span-3">
              <CardContent className="flex flex-wrap items-center gap-3 py-3 text-xs text-muted-foreground">
                <span>
                  <strong className="font-medium text-foreground">Resume:</strong>{" "}
                  {selectedResumeMeta?.resume_name}
                  {selectedResumeMeta?.resume_category
                    ? ` (${selectedResumeMeta.resume_category})`
                    : ""}
                </span>
                <span className="opacity-40">·</span>
                <span>
                  <strong className="font-medium text-foreground">Job:</strong>{" "}
                  {selectedJobMeta?.title}
                  {selectedJobMeta?.company && selectedJobMeta.company !== "nan"
                    ? ` @ ${selectedJobMeta.company}`
                    : ""}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto h-6 text-xs"
                  onClick={() => void runAnalysis()}
                >
                  <RefreshCw className="mr-1 h-3 w-3" /> Re-run
                </Button>
              </CardContent>
            </Card>
          )}

          {/* ── Match score ring ── */}
          <Card className="border-border/60 shadow-[var(--shadow-card)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Prediction score</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-3 py-6">
              <div className="relative h-40 w-40">
                <svg className="h-40 w-40 -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60" cy="60" r="52"
                    stroke="currentColor" strokeWidth="10"
                    className="text-muted" fill="none"
                  />
                  <circle
                    cx="60" cy="60" r="52"
                    stroke="currentColor" strokeWidth="10"
                    className={
                      matchScore >= 70 ? "text-emerald-500" :
                      matchScore >= 50 ? "text-amber-500" : "text-rose-500"
                    }
                    strokeLinecap="round" fill="none"
                    strokeDasharray={`${dash} ${circumference}`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-4xl font-semibold tracking-tight">
                    {matchScore}%
                  </div>
                  <div className="text-xs text-muted-foreground">Match</div>
                </div>
              </div>

              <div className="space-y-1 text-center">
                <Badge
                  variant="secondary"
                  className={cn(
                    "rounded-full text-xs",
                    result.prediction.prediction === 1
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-rose-50 text-rose-700",
                  )}
                >
                  {result.prediction.recommendation}
                </Badge>
                <p className="text-xs text-muted-foreground">
                  Raw probability: {(result.prediction.match_probability * 100).toFixed(1)}%
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ── Feature importance chart ── */}
          {featureChart.length > 0 && (
            <Card className="border-border/60 shadow-[var(--shadow-card)] lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Feature scores</CardTitle>
              </CardHeader>
              <CardContent className="h-64 [&>div]:h-full [&>div]:w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={featureChart}
                    layout="vertical"
                    margin={{ left: 20, right: 20 }}
                  >
                    <XAxis type="number" hide domain={[0, 100]} />
                    <YAxis
                      type="category"
                      dataKey="feature"
                      width={150}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    />
                    <Tooltip
                      cursor={{ fill: "var(--muted)" }}
                      contentStyle={{
                        borderRadius: 8,
                        borderColor: "var(--border)",
                        fontSize: 12,
                      }}
                      formatter={(v: number) => [`${v}`, "Score"]}
                    />
                    <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                      {featureChart.map((_, i) => (
                        <Cell key={i} fill="var(--primary)" />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* ── Matched skills ── */}
          <Card className="border-border/60 shadow-[var(--shadow-card)]">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Matched skills
                {result.matched_skills.length > 0 && (
                  <Badge variant="secondary" className="ml-auto rounded-full px-2 py-0 text-xs">
                    {result.matched_skills.length}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result.matched_skills.length === 0 ? (
                <p className="text-sm text-muted-foreground">No matched skills.</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {result.matched_skills.map((s) => (
                    <Badge
                      key={s}
                      variant="secondary"
                      className="rounded-full bg-emerald-50 font-normal text-emerald-700 hover:bg-emerald-50"
                    >
                      {s}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* ── Missing skills ── */}
          <Card className="border-border/60 shadow-[var(--shadow-card)]">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <XCircle className="h-4 w-4 text-rose-500" />
                Missing skills
                {result.missing_skills.length > 0 && (
                  <Badge variant="secondary" className="ml-auto rounded-full px-2 py-0 text-xs">
                    {result.missing_skills.length}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result.missing_skills.length === 0 ? (
                <p className="text-sm text-muted-foreground">No missing skills — full match!</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {result.missing_skills.map((s) => (
                    <Badge
                      key={s}
                      variant="secondary"
                      className="rounded-full bg-rose-50 font-normal text-rose-700 hover:bg-rose-50"
                    >
                      {s}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* ── AI summary ── */}
          <Card className="border-border/60 shadow-[var(--shadow-card)]">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Sparkles className="h-4 w-4 text-primary" />
                AI summary
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-muted-foreground">
              {result.candidate_summary || "No summary generated."}
            </CardContent>
          </Card>

          {/* ── Skill gap analysis ── */}
          <Card className="border-border/60 shadow-[var(--shadow-card)] lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <BookOpen className="h-4 w-4 text-primary" />
                Skill gap analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LLMTextBlock text={result.skill_gap_analysis} />
            </CardContent>
          </Card>

          {/* ── Interview questions ── */}
          <Card className="border-border/60 shadow-[var(--shadow-card)] lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Target className="h-4 w-4 text-primary" />
                Interview questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LLMTextBlock text={result.interview_questions} ordered />
            </CardContent>
          </Card>

          {/* ── Resume suggestions ── */}
          <Card className="border-border/60 shadow-[var(--shadow-card)]">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Lightbulb className="h-4 w-4 text-primary" />
                Resume suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LLMTextBlock text={result.resume_suggestions} bulleted />
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

/**
 * Renders free-form LLM text. Splits on newlines, numbers the lines if
 * `ordered`, bullet-prefixes if `bulleted`, otherwise renders plain paragraphs.
 */
function LLMTextBlock({
  text,
  ordered = false,
  bulleted = false,
}: {
  text: string;
  ordered?: boolean;
  bulleted?: boolean;
}) {
  if (!text) return <p className="text-sm text-muted-foreground">—</p>;

  const lines = text
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (ordered) {
    return (
      <ol className="list-decimal space-y-2 pl-5 text-sm">
        {lines.map((l, i) => (
          <li key={i} className="leading-relaxed">
            {l.replace(/^\d+[\.\)]\s*/, "")}
          </li>
        ))}
      </ol>
    );
  }

  if (bulleted) {
    return (
      <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
        {lines.map((l, i) => (
          <li key={i} className="leading-relaxed">
            {l.replace(/^[-•*]\s*/, "")}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="space-y-2 text-sm text-muted-foreground">
      {lines.map((l, i) => (
        <p key={i} className="leading-relaxed">
          {l}
        </p>
      ))}
    </div>
  );
}

// ── Utility ───────────────────────────────────────────────────────────────────

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
