import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Briefcase, MapPin, Bookmark } from "lucide-react";
import { PageHeader } from "@/components/portal-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/candidate/jobs")({
  component: JobsPage,
});

const recommended = [
  { id: "r1", title: "Senior Product Designer", company: "Linear", location: "Remote", type: "Full-time", match: 96, salary: "$140k – $180k", skills: ["Figma", "Design systems", "Prototyping"] },
  { id: "r2", title: "Frontend Engineer", company: "Stripe", location: "Dublin", type: "Full-time", match: 89, salary: "$130k – $170k", skills: ["React", "TypeScript", "GraphQL"] },
  { id: "r3", title: "Design Systems Lead", company: "Notion", location: "San Francisco", type: "Full-time", match: 92, salary: "$180k – $220k", skills: ["Figma", "Tokens", "Leadership"] },
  { id: "r4", title: "UX Researcher", company: "Vercel", location: "Remote", type: "Contract", match: 76, salary: "$110k – $140k", skills: ["Research", "Interviews"] },
  { id: "r5", title: "Product Manager, Growth", company: "Ashby", location: "New York", type: "Full-time", match: 71, salary: "$150k – $190k", skills: ["Growth", "Analytics"] },
];

function JobsPage() {
  const [q, setQ] = useState("");
  const list = recommended.filter(
    (j) => q === "" || j.title.toLowerCase().includes(q.toLowerCase()) || j.company.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <>
      <PageHeader title="Recommended jobs" description="Curated by AI based on your resume and preferences." />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search roles or companies…" className="h-10 pl-9" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="h-10 w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="full">Full-time</SelectItem>
            <SelectItem value="contract">Contract</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="h-10 w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any location</SelectItem>
            <SelectItem value="remote">Remote</SelectItem>
            <SelectItem value="onsite">On-site</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {list.length === 0 ? (
        <Card className="border-border/60 shadow-[var(--shadow-card)]">
          <CardContent className="py-16 text-center text-sm text-muted-foreground">
            No jobs match your search yet. Try a different keyword.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {list.map((j) => (
            <Card key={j.id} className="border-border/60 shadow-[var(--shadow-card)] transition hover:border-primary/30">
              <CardContent className="p-5">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
                  <div className="min-w-0">
                    <div className="truncate text-base font-semibold">{j.title}</div>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><Briefcase className="h-3 w-3" /> {j.company}</span>
                      <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {j.location}</span>
                      <span>{j.type}</span>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                    {j.match}% match
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {j.skills.map((s) => (
                    <Badge key={s} variant="secondary" className="rounded-full font-normal">{s}</Badge>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-medium">{j.salary}</span>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Bookmark className="h-4 w-4" /></Button>
                    <Button size="sm">Apply</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
