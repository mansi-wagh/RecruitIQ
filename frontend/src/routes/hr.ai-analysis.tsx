import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, Target, Lightbulb, GraduationCap, CheckCircle2, XCircle } from "lucide-react";
import { PageHeader } from "@/components/portal-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { featureImportance, candidates } from "@/lib/mock-data";

export const Route = createFileRoute("/hr/ai-analysis")({
  component: AIAnalysisPage,
});

function AIAnalysisPage() {
  const score = 87;
  const circumference = 2 * Math.PI * 52;
  const dash = (score / 100) * circumference;

  return (
    <>
      <PageHeader
        title="AI analysis"
        description="Deep candidate insights powered by RecruitIQ AI."
        actions={
          <Select defaultValue={candidates[0].id}>
            <SelectTrigger className="h-9 w-[220px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {candidates.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name} — {c.role}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Circular score */}
        <Card className="border-border/60 shadow-[var(--shadow-card)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Prediction score</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center gap-3 py-6">
            <div className="relative h-40 w-40">
              <svg className="h-40 w-40 -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" stroke="currentColor" strokeWidth="10" className="text-muted" fill="none" />
                <circle
                  cx="60" cy="60" r="52" stroke="currentColor" strokeWidth="10"
                  className="text-primary" strokeLinecap="round" fill="none"
                  strokeDasharray={`${dash} ${circumference}`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-4xl font-semibold tracking-tight">{score}%</div>
                <div className="text-xs text-muted-foreground">Match</div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">Confidence: High · 94th percentile</div>
          </CardContent>
        </Card>

        {/* Feature importance chart */}
        <Card className="border-border/60 shadow-[var(--shadow-card)] lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Feature importance</CardTitle>
          </CardHeader>
          <CardContent className="h-64 [&>div]:h-full [&>div]:w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={featureImportance} layout="vertical" margin={{ left: 20, right: 20 }}>
                <XAxis type="number" hide domain={[0, 40]} />
                <YAxis type="category" dataKey="feature" width={130} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                <Tooltip cursor={{ fill: "var(--muted)" }} contentStyle={{ borderRadius: 8, borderColor: "var(--border)", fontSize: 12 }} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {featureImportance.map((_, i) => (
                    <Cell key={i} fill="var(--primary)" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Matched/missing */}
        <Card className="border-border/60 shadow-[var(--shadow-card)]">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <CheckCircle2 className="h-4 w-4 text-success" /> Matched skills
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-1.5">
            {["Node.js", "PostgreSQL", "AWS", "Docker", "TypeScript"].map((s) => (
              <Badge key={s} className="rounded-full bg-emerald-50 font-normal text-emerald-700 hover:bg-emerald-50" variant="secondary">
                {s}
              </Badge>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-[var(--shadow-card)]">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <XCircle className="h-4 w-4 text-destructive" /> Missing skills
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-1.5">
            {["Kafka", "Kubernetes", "Go"].map((s) => (
              <Badge key={s} className="rounded-full bg-rose-50 font-normal text-rose-700 hover:bg-rose-50" variant="secondary">
                {s}
              </Badge>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-[var(--shadow-card)]">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="h-4 w-4 text-primary" /> AI summary
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Excellent overlap on core backend stack. Recommend a technical deep-dive on distributed systems and a quick
            culture-add screen with the hiring manager.
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-[var(--shadow-card)] lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Target className="h-4 w-4 text-primary" /> Interview questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal space-y-2 pl-5 text-sm">
              <li>Design a high-throughput event pipeline. Walk us through your choice of broker and partitioning.</li>
              <li>Describe a time you diagnosed a production incident. What signals did you rely on?</li>
              <li>How would you migrate a monolith to microservices without a rewrite?</li>
              <li>Explain optimistic vs pessimistic locking with a real-world example.</li>
            </ol>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-[var(--shadow-card)]">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Lightbulb className="h-4 w-4 text-primary" /> Resume suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
              <li>Add metrics to impact statements.</li>
              <li>Consolidate technologies section — group by category.</li>
              <li>Move education below experience.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-[var(--shadow-card)] lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <GraduationCap className="h-4 w-4 text-primary" /> Learning roadmap
            </CardTitle>
            <Button variant="ghost" size="sm">Export</Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { title: "Master Kafka fundamentals", weeks: "2 weeks", link: "confluent.io" },
              { title: "Kubernetes for backend engineers", weeks: "3 weeks", link: "kubernetes.io" },
              { title: "Go crash course", weeks: "4 weeks", link: "gophercises.com" },
            ].map((s) => (
              <div key={s.title} className="flex items-center justify-between rounded-lg border border-border/70 p-3">
                <div>
                  <div className="text-sm font-medium">{s.title}</div>
                  <div className="text-xs text-muted-foreground">{s.weeks} · {s.link}</div>
                </div>
                <Button variant="outline" size="sm">Add</Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
