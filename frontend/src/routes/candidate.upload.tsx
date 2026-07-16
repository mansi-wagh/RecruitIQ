import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Award,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Code2,
  FileText,
  Loader2,
  Paperclip,
  Sparkles,
  UploadCloud,
  X,
  Zap,
} from "lucide-react";
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

// ── Types ────────────────────────────────────────────────────────────────────

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

interface UploadResponse {
  message: string;
  file_name: string;
  resume_path: string;
}

interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
}

interface ParsedResume {
  personal_info: PersonalInfo;
  skills: string[];
  education: string[];
  experience: string[];
  projects: string[];
  certifications: string[];
}

// ── Component ────────────────────────────────────────────────────────────────

function UploadPage() {
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [candidate, setCandidate] = useState<CandidateProfile | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [parsed, setParsed] = useState<ParsedResume | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentUser = getStoredUser();

  // ── Load candidate profile + resumes from PostgreSQL ─────────────────────

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

  // ── Parse a stored resume via the backend extractor ───────────────────────

  const parseResume = async (storedFilename: string) => {
    setIsParsing(true);
    setParseError(null);
    setParsed(null);

    try {
      // Backend expects just the filename; it prepends uploads/resumes/ internally
      const response = await api.post<ParsedResume>(
        `/resume/extract?filename=${encodeURIComponent(storedFilename)}`,
      );
      setParsed(response.data);
      toast.success("Resume parsed successfully");
    } catch (err) {
      console.error("Failed to parse resume", err);
      setParseError("Unable to parse the resume. The file may be unreadable.");
      toast.error("Resume parsing failed");
    } finally {
      setIsParsing(false);
    }
  };

  // ── File validation ───────────────────────────────────────────────────────

  const validateAndStage = (files: FileList | null) => {
    if (!files || !files[0]) return;

    const file = files[0];
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";

    if (!["pdf", "docx"].includes(ext)) {
      toast.error("Only PDF and DOCX files are supported");
      return;
    }

    setPendingFile(file);
    // Clear old parse results when a new file is staged
    setParsed(null);
    setParseError(null);
  };

  // ── Upload → auto-parse flow ──────────────────────────────────────────────

  const handleUpload = async () => {
    if (!pendingFile) return;

    if (!currentUser?.id) {
      toast.error("Sign in as a candidate to upload a resume");
      return;
    }

    const formData = new FormData();
    formData.append("resume", pendingFile);
    formData.append("candidate_id", String(currentUser.id));

    setIsUploading(true);
    setParsed(null);
    setParseError(null);

    try {
      const uploadRes = await api.post<UploadResponse>("/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Resume uploaded and saved to PostgreSQL");
      setPendingFile(null);
      if (inputRef.current) inputRef.current.value = "";

      // Refresh profile resumes list
      await loadProfile();

      // Auto-parse using the stored filename returned by the upload endpoint
      const storedFilename = fileNameFromPath(uploadRes.data.resume_path);
      await parseResume(storedFilename);
    } catch (err) {
      console.error("Failed to upload resume", err);
      toast.error("Upload failed — please try again");
    } finally {
      setIsUploading(false);
    }
  };

  // ── Drag & drop ───────────────────────────────────────────────────────────

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    validateAndStage(e.dataTransfer.files);
  };

  const isBusy = isUploading || isParsing;

  return (
    <>
      <PageHeader
        title="Upload resume"
        description="Upload a PDF or DOCX resume. It is stored in PostgreSQL and automatically parsed to extract skills, education, experience, projects, and certifications."
      />

      <div className="grid gap-6 lg:grid-cols-3">

        {/* ── Drop zone ── */}
        <Card className="border-border/60 shadow-[var(--shadow-card)] lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <UploadCloud className="h-4 w-4 text-primary" />
              Select file
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">

            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => !isBusy && inputRef.current?.click()}
              className={cn(
                "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border/60 px-8 py-14 text-center transition-colors select-none",
                dragging && "border-primary/50 bg-primary/5",
                isBusy && "pointer-events-none opacity-60",
                !isBusy && "hover:border-primary/40 hover:bg-muted/30",
              )}
            >
              <div className="grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
                {isBusy
                  ? <Loader2 className="h-6 w-6 animate-spin" />
                  : <UploadCloud className="h-6 w-6" />
                }
              </div>

              <div>
                <div className="text-base font-semibold">
                  {isUploading
                    ? "Uploading…"
                    : isParsing
                    ? "Parsing resume…"
                    : "Drag & drop your resume here"}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {isUploading
                    ? `Saving ${pendingFile?.name ?? "file"} to PostgreSQL…`
                    : isParsing
                    ? "Extracting skills, education, experience…"
                    : "PDF or DOCX · Click to browse"}
                </p>
              </div>
            </div>

            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.docx"
              className="hidden"
              disabled={isBusy}
              onChange={(e) => validateAndStage(e.target.files)}
            />

            {/* Staged file preview */}
            {pendingFile && !isBusy && (
              <div className="flex items-center justify-between gap-3 rounded-lg border border-border/70 bg-muted/40 p-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{pendingFile.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {(pendingFile.size / 1024).toFixed(0)} KB · ready to upload
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => {
                    setPendingFile(null);
                    if (inputRef.current) inputRef.current.value = "";
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            <Button
              className="w-full"
              disabled={!pendingFile || isBusy}
              onClick={() => void handleUpload()}
            >
              {isUploading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Uploading…</>
              ) : isParsing ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Parsing resume…</>
              ) : (
                <><UploadCloud className="mr-2 h-4 w-4" />Upload &amp; parse resume</>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* ── Candidate profile sidebar ── */}
        <Card className="border-border/60 shadow-[var(--shadow-card)]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Candidate profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoadingProfile ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading profile…
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
                <InfoRow label="Candidate ID" value={`#${candidate.id}`} />
                <InfoRow
                  label="Resumes"
                  value={
                    candidate.resumes.length === 0
                      ? "None uploaded"
                      : `${candidate.resumes.length} file${candidate.resumes.length > 1 ? "s" : ""}`
                  }
                />
                <Button asChild variant="outline" size="sm" className="mt-2 w-full">
                  <Link to="/candidate/profile">View full profile</Link>
                </Button>
              </>
            ) : null}
          </CardContent>
        </Card>

        {/* ── Stored resumes from PostgreSQL ── */}
        <Card className="border-border/60 shadow-[var(--shadow-card)] lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <FileText className="h-4 w-4 text-primary" />
              Stored resumes
              {(candidate?.resumes.length ?? 0) > 0 && (
                <Badge variant="secondary" className="ml-1 rounded-full px-2 py-0 text-xs">
                  {candidate!.resumes.length}
                </Badge>
              )}
            </CardTitle>
            {(candidate?.resumes.length ?? 0) > 0 && (
              <Badge variant="outline" className="rounded-full text-xs">
                Saved in PostgreSQL
              </Badge>
            )}
          </CardHeader>
          <CardContent>
            {isLoadingProfile ? (
              <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading resumes…
              </div>
            ) : profileError || !candidate ? (
              <p className="py-4 text-sm text-muted-foreground">
                Unable to load resumes. {profileError}
              </p>
            ) : candidate.resumes.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-10 text-center text-sm text-muted-foreground">
                <Paperclip className="h-7 w-7 opacity-30" />
                <p>No resume uploaded yet. Use the form above to add one.</p>
              </div>
            ) : (
              <div className="divide-y divide-border/70 rounded-lg border border-border/70">
                {candidate.resumes.map((resume, index) => {
                  const filename = fileNameFromPath(resume.resume_path);
                  return (
                    <div
                      key={resume.id}
                      className="flex flex-wrap items-center justify-between gap-3 p-3 transition-colors hover:bg-muted/30"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="truncate text-sm font-medium">{filename}</span>
                            {index === 0 && (
                              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                            )}
                          </div>
                          <div className="truncate text-xs text-muted-foreground">
                            {resume.resume_path}
                          </div>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <Badge variant="outline" className="rounded-full font-mono text-xs">
                          #{resume.id}
                        </Badge>
                        {index === 0 && (
                          <Badge
                            variant="secondary"
                            className="rounded-full bg-emerald-50 text-xs text-emerald-700"
                          >
                            Latest
                          </Badge>
                        )}
                        {/* Parse button for any stored resume */}
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 gap-1.5 rounded-full text-xs"
                          disabled={isParsing || isUploading}
                          onClick={() => void parseResume(filename)}
                        >
                          {isParsing ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Zap className="h-3 w-3" />
                          )}
                          Parse
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── Parsed resume data ── */}
        {(isParsing || parsed || parseError) && (
          <div className="lg:col-span-3">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold tracking-tight">Parsed resume data</h2>
              {isParsing && (
                <Badge variant="secondary" className="rounded-full text-xs">
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  Extracting…
                </Badge>
              )}
            </div>

            {parseError ? (
              <Card className="border-destructive/30 bg-destructive/5">
                <CardContent className="py-6 text-center text-sm text-destructive">
                  {parseError}
                </CardContent>
              </Card>
            ) : isParsing ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(5)].map((_, i) => (
                  <Card key={i} className="border-border/60 shadow-[var(--shadow-card)]">
                    <CardContent className="flex items-center gap-2 py-10 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" /> Extracting…
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : parsed ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                {/* Skills */}
                <ParseSection
                  icon={<Code2 className="h-4 w-4" />}
                  title="Skills"
                  count={parsed.skills.length}
                  empty="No skills detected"
                >
                  {parsed.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {parsed.skills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="rounded-full text-xs font-normal"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}
                </ParseSection>

                {/* Education */}
                <ParseSection
                  icon={<BookOpen className="h-4 w-4" />}
                  title="Education"
                  count={parsed.education.length}
                  empty="No education entries detected"
                >
                  <LineList items={parsed.education} />
                </ParseSection>

                {/* Experience */}
                <ParseSection
                  icon={<Briefcase className="h-4 w-4" />}
                  title="Experience"
                  count={parsed.experience.length}
                  empty="No experience entries detected"
                >
                  <LineList items={parsed.experience} />
                </ParseSection>

                {/* Projects */}
                <ParseSection
                  icon={<FileText className="h-4 w-4" />}
                  title="Projects"
                  count={parsed.projects.length}
                  empty="No projects detected"
                >
                  <LineList items={parsed.projects} />
                </ParseSection>

                {/* Certifications */}
                <ParseSection
                  icon={<Award className="h-4 w-4" />}
                  title="Certifications"
                  count={parsed.certifications.length}
                  empty="No certifications detected"
                >
                  <LineList items={parsed.certifications} />
                </ParseSection>

                {/* Personal info (from parse) */}
                {(parsed.personal_info.name || parsed.personal_info.email || parsed.personal_info.phone) && (
                  <ParseSection
                    icon={<Sparkles className="h-4 w-4" />}
                    title="Detected info"
                    empty=""
                  >
                    <div className="space-y-1.5 pt-1 text-sm">
                      {parsed.personal_info.name && (
                        <InfoRow label="Name" value={parsed.personal_info.name} />
                      )}
                      {parsed.personal_info.email && (
                        <InfoRow label="Email" value={parsed.personal_info.email} />
                      )}
                      {parsed.personal_info.phone && (
                        <InfoRow label="Phone" value={parsed.personal_info.phone} />
                      )}
                    </div>
                  </ParseSection>
                )}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ParseSection({
  icon,
  title,
  count,
  empty,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  count?: number;
  empty: string;
  children?: React.ReactNode;
}) {
  const hasItems = count === undefined || count > 0;

  return (
    <Card className="border-border/60 shadow-[var(--shadow-card)]">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-primary">
          {icon}
          {title}
          {count !== undefined && count > 0 && (
            <Badge variant="secondary" className="ml-auto rounded-full px-2 py-0 text-xs">
              {count}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasItems && children ? (
          children
        ) : (
          <p className="text-sm text-muted-foreground">{empty}</p>
        )}
      </CardContent>
    </Card>
  );
}

function LineList({ items }: { items: string[] }) {
  if (items.length === 0) return null;

  return (
    <ul className="space-y-1.5 pt-1">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-sm">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/50" />
          <span className="leading-snug">{item}</span>
        </li>
      ))}
    </ul>
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

// ── Helpers ───────────────────────────────────────────────────────────────────

function getStoredUser(): StoredUser | null {
  if (typeof window === "undefined") return null;

  const value = localStorage.getItem("user") || sessionStorage.getItem("user");
  if (!value) return null;

  try {
    return JSON.parse(value) as StoredUser;
  } catch {
    return null;
  }
}

function fileNameFromPath(path: string) {
  return path.split(/[/\\]/).pop() || path;
}
