import { createFileRoute } from "@tanstack/react-router";
import { GraduationCap, Target, Lightbulb, PlayCircle } from "lucide-react";
import { PageHeader } from "@/components/portal-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/candidate/interview-prep")({
  component: InterviewPrep,
});

function InterviewPrep() {
  return (
    <>
      <PageHeader title="Interview preparation" description="Practice with AI-generated questions and structured roadmaps." />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border/60 shadow-[var(--shadow-card)] lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Target className="h-4 w-4 text-primary" /> Practice questions
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border/70">
            {[
              { q: "Walk me through your design process for a data-heavy dashboard.", topic: "Product design" },
              { q: "How do you balance velocity with code quality in a small team?", topic: "Engineering" },
              { q: "Describe a project where you had to influence without authority.", topic: "Leadership" },
              { q: "What's your approach to receiving critical feedback?", topic: "Behavioral" },
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-4">
                <div className="min-w-0">
                  <div className="text-sm font-medium">{row.q}</div>
                  <Badge variant="secondary" className="mt-1.5 rounded-full font-normal">{row.topic}</Badge>
                </div>
                <Button size="sm" variant="outline"><PlayCircle className="mr-1.5 h-3.5 w-3.5" /> Practice</Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border/60 shadow-[var(--shadow-card)]">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Lightbulb className="h-4 w-4 text-primary" /> Tips for your next round
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
                <li>Structure answers with the STAR framework.</li>
                <li>Prepare 2 questions for the interviewer.</li>
                <li>Speak to measurable outcomes.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-[var(--shadow-card)]">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <GraduationCap className="h-4 w-4 text-primary" /> Recommended courses
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { t: "Product interviews masterclass", d: "6 modules · 3h" },
                { t: "System design bootcamp", d: "12 modules · 8h" },
              ].map((c) => (
                <div key={c.t} className="rounded-lg border border-border/70 p-3">
                  <div className="text-sm font-medium">{c.t}</div>
                  <div className="text-xs text-muted-foreground">{c.d}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
