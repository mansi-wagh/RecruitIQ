import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FileText, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/portal-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";

export const Route = createFileRoute("/candidate/profile")({
  component: ProfilePage,
});

interface StoredUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface CandidateResume {
  id: number;
  resume_path: string;
}

interface CandidateProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  resumes: CandidateResume[];
}

function ProfilePage() {
  const [candidate, setCandidate] = useState<CandidateProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentUser = getStoredUser();

  const loadProfile = async () => {
    if (!currentUser?.id) {
      setCandidate(null);
      setError("Sign in as a candidate to view your profile.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get<CandidateProfile>(`/candidates/${currentUser.id}`);
      setCandidate(response.data);
    } catch (err) {
      console.error("Failed to load candidate profile", err);
      setCandidate(null);
      setError("Unable to load your candidate profile.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadProfile();
  }, []);

  return (
    <>
      <PageHeader title="Profile" description="Your candidate profile from PostgreSQL." />

      {isLoading ? (
        <Card className="border-border/60 shadow-[var(--shadow-card)]">
          <CardContent className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading profile...
          </CardContent>
        </Card>
      ) : error || !candidate ? (
        <Card className="border-border/60 shadow-[var(--shadow-card)]">
          <CardContent className="space-y-3 py-16 text-center">
            <p className="text-sm text-destructive">{error ?? "Candidate profile not found."}</p>
            <Button variant="outline" size="sm" onClick={() => void loadProfile()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="border-border/60 shadow-[var(--shadow-card)]">
            <CardContent className="flex flex-col items-center py-8 text-center">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-primary/10 text-xl font-semibold text-primary">
                  {getInitials(candidate.name)}
                </AvatarFallback>
              </Avatar>
              <div className="mt-4 text-lg font-semibold">{candidate.name}</div>
              <div className="text-sm text-muted-foreground">{candidate.email}</div>
              <div className="mt-3 flex flex-wrap justify-center gap-1">
                <Badge variant="secondary" className="rounded-full font-normal">{candidate.role}</Badge>
                <Badge variant="outline" className="rounded-full font-normal">ID {candidate.id}</Badge>
              </div>
              <Button asChild className="mt-6 w-full" variant="outline">
                <Link to="/candidate/upload">Upload resume</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-[var(--shadow-card)] lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Basic information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Candidate ID" value={String(candidate.id)} />
                <Field label="Full name" value={candidate.name} />
                <Field label="Email" type="email" value={candidate.email} />
                <Field label="Role" value={candidate.role} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-[var(--shadow-card)] lg:col-span-3">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <FileText className="h-4 w-4 text-primary" />
                Resume
              </CardTitle>
            </CardHeader>
            <CardContent>
              {candidate.resumes.length === 0 ? (
                <p className="text-sm text-muted-foreground">No resume has been uploaded yet.</p>
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

function Field({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input {...props} readOnly />
    </div>
  );
}

function getStoredUser() {
  if (typeof window === "undefined") return null;

  const value = localStorage.getItem("user") || sessionStorage.getItem("user");
  if (!value) return null;

  try {
    return JSON.parse(value) as StoredUser;
  } catch {
    return null;
  }
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
