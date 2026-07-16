import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useRef } from "react";
import { Filter, Loader2, Search, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/portal-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MatchScorePill, StatusBadge } from "@/components/status-badge";
import api from "@/lib/api";

export const Route = createFileRoute("/hr/candidates")({
  component: CandidatesPage,
});

type CandidateStatus = "New" | "Screening" | "Interview" | "Offer" | "Hired" | "Rejected";

interface CandidateApiResponse {
  id: string;
  candidate_id: number;
  name: string;
  email: string;
  role: string;
  status?: string;
  match_score?: number;
  experience?: string;
  applied_at?: string;
  skills?: string[];
}

interface Candidate {
  id: string;
  candidateId: string;
  name: string;
  email: string;
  role: string;
  location: string;
  experience: string;
  matchScore: number;
  status: CandidateStatus;
  avatarInitials: string;
  skills: string[];
  appliedAt: string;
}

const statuses: (CandidateStatus | "All")[] = ["All", "New", "Screening", "Interview", "Offer", "Hired", "Rejected"];

function CandidatesPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("All");
  const [sort, setSort] = useState("match");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportCSV = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const toastId = toast.loading("Importing candidates...");

    try {
      const response = await api.post("/candidates/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(response.data.message || "Import completed successfully", {
        id: toastId,
      });
      void loadCandidates();
    } catch (err: any) {
      console.error("Failed to import CSV", err);
      const errMsg = err.response?.data?.detail || "An error occurred during import";
      toast.error(errMsg, { id: toastId });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const loadCandidates = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get<CandidateApiResponse[]>("/candidates/");
      setCandidates(response.data.map(mapCandidate));
    } catch (err) {
      console.error("Failed to load candidates", err);
      setError("Unable to load candidates. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadCandidates();
  }, []);

  const handleDeleteRow = async (c: Candidate) => {
    setDeletingId(c.id);
    setError(null);

    try {
      const parts = c.id.split("_");
      const appId = parts[1] ? parseInt(parts[1], 10) : 0;

      if (appId > 0) {
        await api.delete(`/applications/${appId}`);
        toast.success("Application withdrawn successfully");
      } else {
        await api.delete(`/candidates/${c.candidateId}`);
        toast.success("Candidate profile deleted successfully");
      }
      await loadCandidates();
    } catch (err) {
      console.error("Failed to delete row", err);
      setError("Unable to delete item. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const list = useMemo(() => {
    let l = candidates.filter(
      (c) =>
        (status === "All" || c.status === status) &&
        (q === "" ||
          c.name.toLowerCase().includes(q.toLowerCase()) ||
          c.email.toLowerCase().includes(q.toLowerCase()) ||
          c.role.toLowerCase().includes(q.toLowerCase())),
    );
    if (sort === "match") l = [...l].sort((a, b) => b.matchScore - a.matchScore);
    if (sort === "name") l = [...l].sort((a, b) => a.name.localeCompare(b.name));
    return l;
  }, [candidates, q, status, sort]);

  return (
    <>
      <PageHeader
        title="Candidates"
        description={`${candidates.length} candidates in your pipeline.`}
        actions={
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept=".csv"
              ref={fileInputRef}
              onChange={handleImportCSV}
              className="hidden"
            />
            <Button size="sm" onClick={() => fileInputRef.current?.click()}>
              Import CSV
            </Button>
          </div>
        }
      />

      <Card className="border-border/60 shadow-[var(--shadow-card)]">
        <CardContent className="p-0">
          <div className="flex flex-wrap items-center gap-3 border-b border-border/70 p-4">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or role..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="h-9 rounded-lg bg-muted/40 pl-9"
              />
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-9 w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="h-9 w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="match">Sort: Match score</SelectItem>
                <SelectItem value="name">Sort: Name</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="h-9">
              <Filter className="mr-1.5 h-3.5 w-3.5" /> Filters
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Candidate</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Match</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-16 text-center text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading candidates...
                    </span>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-16 text-center">
                    <div className="space-y-3">
                      <p className="text-sm text-destructive">{error}</p>
                      <Button variant="outline" size="sm" onClick={() => void loadCandidates()}>
                        Retry
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : list.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-16 text-center text-sm text-muted-foreground">
                    No candidates match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                list.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                            {c.avatarInitials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium">{c.name}</div>
                          <div className="truncate text-xs text-muted-foreground">{c.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{c.role}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{c.experience}</TableCell>
                    <TableCell><MatchScorePill value={c.matchScore} /></TableCell>
                    <TableCell><StatusBadge status={c.status} /></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{c.appliedAt}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button asChild size="sm" variant="ghost">
                          <Link to="/hr/candidates/$id" params={{ id: c.candidateId }}>View</Link>
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          disabled={deletingId === c.id}
                          aria-label={`Delete ${c.name}`}
                          onClick={() => void handleDeleteRow(c)}
                        >
                          {deletingId === c.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between border-t border-border/70 p-4 text-xs text-muted-foreground">
            <div>Showing {isLoading || error ? 0 : list.length} of {candidates.length}</div>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" className="h-8">Previous</Button>
              <Button variant="outline" size="sm" className="h-8">Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function mapCandidate(candidate: CandidateApiResponse): Candidate {
  return {
    id: candidate.id,
    candidateId: String(candidate.candidate_id),
    name: candidate.name,
    email: candidate.email,
    role: candidate.role || "Candidate",
    location: "Not provided",
    experience: candidate.experience || "No Resume",
    matchScore: candidate.match_score ?? 0,
    status: (candidate.status || "New") as CandidateStatus,
    avatarInitials: getInitials(candidate.name),
    skills: candidate.skills || [],
    appliedAt: candidate.applied_at || "Registered",
  };
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
