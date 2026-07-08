import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, FileText, Loader2, Mail, UserRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";

export const Route = createFileRoute("/hr/candidates/$id")({
  component: CandidateDetail,
});

interface CandidateResume {
  id: number;
  resume_path: string;
}

interface CandidateDetailResponse {
  id: number;
  name: string;
  email: string;
  role: string;
  resumes: CandidateResume[];
}

function CandidateDetail() {
  const { id } = Route.useParams();
  const [candidate, setCandidate] = useState<CandidateDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCandidate = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get<CandidateDetailResponse>(`/candidates/${id}`);
      setCandidate(response.data);
    } catch (err) {
      console.error("Failed to load candidate", err);
      setCandidate(null);
      setError("Unable to load candidate details.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadCandidate();
  }, [id]);

  return (
    <>
      <div className="mb-4">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link to="/hr/candidates"><ArrowLeft className="mr-1 h-4 w-4" /> Back to candidates</Link>
        </Button>
      </div>

      {isLoading ? (
        <Card className="border-border/60 shadow-[var(--shadow-card)]">
          <CardContent className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading candidate details...
          </CardContent>
        </Card>
      ) : error || !candidate ? (
        <Card className="border-border/60 shadow-[var(--shadow-card)]">
          <CardContent className="space-y-3 py-16 text-center">
            <p className="text-sm text-destructive">{error ?? "Candidate not found."}</p>
            <Button variant="outline" size="sm" onClick={() => void loadCandidate()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="border-border/60 shadow-[var(--shadow-card)] lg:col-span-2">
            <CardContent className="p-6">
              <div className="flex min-w-0 flex-wrap items-start gap-4">
                <Avatar className="h-14 w-14 shrink-0">
                  <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
                    {getInitials(candidate.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-xl font-semibold tracking-tight">{candidate.name}</h2>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" /> {candidate.email}</span>
                    <span className="inline-flex items-center gap-1"><UserRound className="h-3 w-3" /> {candidate.role}</span>
                  </div>
                </div>
                <Badge variant="secondary" className="rounded-full">Candidate ID {candidate.id}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-[var(--shadow-card)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">PostgreSQL fields</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <InfoRow label="ID" value={String(candidate.id)} />
              <InfoRow label="Name" value={candidate.name} />
              <InfoRow label="Email" value={candidate.email} />
              <InfoRow label="Role" value={candidate.role} />
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-[var(--shadow-card)] lg:col-span-3">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <FileText className="h-4 w-4 text-primary" />
                Resume files
              </CardTitle>
            </CardHeader>
            <CardContent>
              {candidate.resumes.length === 0 ? (
                <p className="text-sm text-muted-foreground">No resume has been uploaded for this candidate.</p>
              ) : (
                <div className="divide-y divide-border/70 rounded-lg border border-border/70">
                  {candidate.resumes.map((resume) => (
                    <div key={resume.id} className="flex flex-wrap items-center justify-between gap-3 p-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">{fileNameFromPath(resume.resume_path)}</div>
                        <div className="truncate text-xs text-muted-foreground">{resume.resume_path}</div>
                      </div>
                      <Badge variant="outline" className="rounded-full">Resume ID {resume.id}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border/70 pb-2 last:border-0 last:pb-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="min-w-0 truncate font-medium">{value}</span>
    </div>
  );
}

function getInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return initials || "C";
}

function fileNameFromPath(path: string) {
  return path.split(/[\\/]/).pop() || path;
}
