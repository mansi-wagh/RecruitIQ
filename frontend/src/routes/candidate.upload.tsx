import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, FileText, Loader2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/portal-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

export const Route = createFileRoute("/candidate/upload")({
  component: UploadPage,
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

function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [candidate, setCandidate] = useState<CandidateProfile | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const currentUser = getStoredUser();

  const loadProfile = async () => {
    if (!currentUser?.id) {
      setCandidate(null);
      setProfileError("Sign in as a candidate to upload a resume.");
      setIsLoadingProfile(false);
      return;
    }

    setIsLoadingProfile(true);
    setProfileError(null);

    try {
      const response = await api.get<CandidateProfile>(`/candidates/${currentUser.id}`);
      setCandidate(response.data);
    } catch (err) {
      console.error("Failed to load candidate profile", err);
      setCandidate(null);
      setProfileError("Unable to load your candidate profile.");
    } finally {
      setIsLoadingProfile(false);
    }
  };

  useEffect(() => {
    void loadProfile();
  }, []);

  const onFiles = async (files: FileList | null) => {
    if (!files || !files[0]) return;

    const selectedFile = files[0];
    const extension = selectedFile.name.split(".").pop()?.toLowerCase();

    if (!["pdf", "docx"].includes(extension ?? "")) {
      toast.error("Only PDF and DOCX resumes are allowed");
      return;
    }

    if (!currentUser?.id) {
      toast.error("Sign in as a candidate to upload a resume");
      return;
    }

    const formData = new FormData();
    formData.append("resume", selectedFile);
    formData.append("candidate_id", String(currentUser.id));

    setFile(selectedFile);
    setIsUploading(true);

    try {
      await api.post("/resume/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Resume uploaded successfully");
      await loadProfile();
    } catch (err) {
      console.error("Failed to upload resume", err);
      toast.error("Resume upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <PageHeader title="Upload resume" description="Upload your latest PDF or DOCX resume." />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-dashed border-border/70 shadow-[var(--shadow-card)] lg:col-span-2">
          <CardContent className="p-0">
            <label
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); void onFiles(e.dataTransfer.files); }}
              className={cn(
                "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl px-8 py-20 text-center transition",
                dragging && "bg-primary/5",
                isUploading && "pointer-events-none opacity-70",
              )}
            >
              <div className="grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
                {isUploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <UploadCloud className="h-6 w-6" />}
              </div>
              <div>
                <div className="text-base font-semibold">
                  {isUploading ? "Uploading resume..." : "Drag & drop your resume"}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">PDF or DOCX</p>
              </div>
              <Button asChild size="sm" disabled={isUploading}>
                <span>Browse files</span>
              </Button>
              <input
                type="file"
                accept=".pdf,.docx"
                className="hidden"
                disabled={isUploading}
                onChange={(e) => void onFiles(e.target.files)}
              />
            </label>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-[var(--shadow-card)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Candidate profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoadingProfile ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading profile...
              </div>
            ) : profileError ? (
              <div className="space-y-3">
                <p className="text-sm text-destructive">{profileError}</p>
                <Button variant="outline" size="sm" onClick={() => void loadProfile()}>
                  Retry
                </Button>
              </div>
            ) : candidate ? (
              <>
                <InfoRow label="Name" value={candidate.name} />
                <InfoRow label="Email" value={candidate.email} />
                <InfoRow label="Role" value={candidate.role} />
                <InfoRow label="Candidate ID" value={String(candidate.id)} />
              </>
            ) : null}
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-[var(--shadow-card)] lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <FileText className="h-4 w-4 text-primary" /> Saved resume
            </CardTitle>
            {candidate?.resumes.length ? (
              <Badge variant="secondary" className="rounded-full">Stored in PostgreSQL</Badge>
            ) : null}
          </CardHeader>
          <CardContent>
            {candidate?.resumes.length ? (
              <div className="rounded-lg border border-border/70 bg-muted/40 p-4">
                <div className="mb-2 flex min-w-0 items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                  <span className="truncate font-medium">{fileNameFromPath(candidate.resumes[0].resume_path)}</span>
                </div>
                <div className="truncate text-xs text-muted-foreground">{candidate.resumes[0].resume_path}</div>
              </div>
            ) : file ? (
              <div className="rounded-lg border border-border/70 bg-muted/40 p-4 text-sm text-muted-foreground">
                {isUploading ? `Uploading ${file.name}...` : "Upload finished, refreshing profile..."}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No resume has been uploaded yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border/70 pb-2 text-sm last:border-0 last:pb-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="min-w-0 truncate font-medium">{value}</span>
    </div>
  );
}

function getStoredUser() {
  if (typeof window === "undefined") return null;

  const value = localStorage.getItem("user");
  if (!value) return null;

  try {
    return JSON.parse(value) as StoredUser;
  } catch {
    return null;
  }
}

function fileNameFromPath(path: string) {
  return path.split(/[\\/]/).pop() || path;
}
