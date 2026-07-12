import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  FileText,
  Hash,
  Loader2,
  Mail,
  Paperclip,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";

export const Route = createFileRoute("/hr/candidates/$id")({
  component: CandidateDetail,
});

// ── Types matching the PostgreSQL schema ─────────────────────────────────────
// users table:  id | name | email | password_hash | role
// resumes table: id | user_id | resume_path

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

// ── Component ────────────────────────────────────────────────────────────────

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
      setError("Unable to load candidate details. The candidate may not exist.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadCandidate();
  }, [id]);

  return (
    <>
      {/* ── Back navigation ── */}
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link to="/hr/candidates">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to candidates
          </Link>
        </Button>
      </div>

      {/* ── Loading state ── */}
      {isLoading ? (
        <Card className="border-border/60 shadow-[var(--shadow-card)]">
          <CardContent className="flex items-center justify-center gap-2 py-20 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading candidate details…
          </CardContent>
        </Card>
      ) : error || !candidate ? (
        /* ── Error state ── */
        <Card className="border-border/60 shadow-[var(--shadow-card)]">
          <CardContent className="space-y-4 py-20 text-center">
            <p className="text-sm text-destructive">{error ?? "Candidate not found."}</p>
            <Button variant="outline" size="sm" onClick={() => void loadCandidate()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* ── Data ── */
        <div className="grid gap-6 lg:grid-cols-3">

          {/* ── Hero card ── */}
          <Card className="border-border/60 shadow-[var(--shadow-card)] lg:col-span-2">
            <CardContent className="p-6">
              <div className="flex min-w-0 flex-wrap items-start gap-4">
                <Avatar className="h-16 w-16 shrink-0">
                  <AvatarFallback className="bg-primary/10 text-xl font-semibold text-primary">
                    {getInitials(candidate.name)}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <h1 className="truncate text-2xl font-semibold tracking-tight">
                    {candidate.name}
                  </h1>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5" />
                      {candidate.email}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      {candidate.role}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Paperclip className="h-3.5 w-3.5" />
                      {candidate.resumes.length}{" "}
                      {candidate.resumes.length === 1 ? "resume" : "resumes"}
                    </span>
                  </div>
                </div>

                <Badge variant="secondary" className="rounded-full font-mono text-xs">
                  ID #{candidate.id}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* ── Account details card (all users columns) ── */}
          <Card className="border-border/60 shadow-[var(--shadow-card)]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <UserRound className="h-4 w-4 text-primary" />
                Account details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-0 text-sm">
              <InfoRow
                icon={<Hash className="h-3.5 w-3.5" />}
                label="User ID"
                value={String(candidate.id)}
              />
              <InfoRow
                icon={<UserRound className="h-3.5 w-3.5" />}
                label="Full name"
                value={candidate.name}
              />
              <InfoRow
                icon={<Mail className="h-3.5 w-3.5" />}
                label="Email"
                value={candidate.email}
              />
              <InfoRow
                icon={<ShieldCheck className="h-3.5 w-3.5" />}
                label="Role"
                value={candidate.role}
              />
              <InfoRow
                icon={<Paperclip className="h-3.5 w-3.5" />}
                label="Resumes uploaded"
                value={String(candidate.resumes.length)}
              />
            </CardContent>
          </Card>

          {/* ── Resumes card (all resumes columns) ── */}
          <Card className="border-border/60 shadow-[var(--shadow-card)] lg:col-span-3">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <FileText className="h-4 w-4 text-primary" />
                Uploaded resumes
                {candidate.resumes.length > 0 && (
                  <Badge variant="secondary" className="ml-1 rounded-full px-2 py-0 text-xs">
                    {candidate.resumes.length}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {candidate.resumes.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-10 text-center text-sm text-muted-foreground">
                  <FileText className="h-8 w-8 opacity-30" />
                  <p>No resume has been uploaded for this candidate.</p>
                </div>
              ) : (
                <div className="divide-y divide-border/70 rounded-lg border border-border/70">
                  {candidate.resumes.map((resume, index) => (
                    <div
                      key={resume.id}
                      className="flex flex-wrap items-center justify-between gap-3 p-3 transition-colors hover:bg-muted/30"
                    >
                      {/* Icon + file details */}
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium">
                            {fileNameFromPath(resume.resume_path)}
                          </div>
                          <div className="truncate text-xs text-muted-foreground">
                            {resume.resume_path}
                          </div>
                        </div>
                      </div>

                      {/* Right-side metadata */}
                      <div className="flex shrink-0 items-center gap-2">
                        <Badge variant="outline" className="rounded-full font-mono text-xs">
                          #{resume.id}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Resume {index + 1} of {candidate.resumes.length}
                        </span>
                      </div>
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

// ── Helpers ──────────────────────────────────────────────────────────────────

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border/70 py-2.5 last:border-0">
      <span className="inline-flex items-center gap-1.5 text-muted-foreground">
        {icon}
        {label}
      </span>
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
  return path.split(/[/\\]/).pop() || path;
}
