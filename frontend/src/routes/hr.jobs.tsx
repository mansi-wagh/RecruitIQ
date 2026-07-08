import { createFileRoute } from "@tanstack/react-router";
import { Plus, MoreHorizontal, MapPin, Users } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { PageHeader } from "@/components/portal-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useEffect, useState } from "react";

interface Job {
  id: number;
  title: string;
  department: string | null;
  location: string | null;
  employment_type: string | null;
  description: string | null;
  required_skills: string | null;
  experience_required: string | null;
  status: string | null;
  applicants: number;
  created_by: number | null;
}

export const Route = createFileRoute("/hr/jobs")({
  component: JobsPage,
});

/** Extract a user-friendly error message from an Axios error. */
function extractError(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail;
    // FastAPI validation errors come as an array of { loc, msg, type }
    if (Array.isArray(detail)) {
      return detail.map((e: { msg?: string }) => e.msg ?? "").join("; ");
    }
    if (typeof detail === "string") return detail;
    return error.response?.data?.message ?? fallback;
  }
  return fallback;
}

function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editJob, setEditJob] = useState<Job | null>(null);

  /* ───── Load ───── */
  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const response = await api.get<Job[]>("/jobs/");
      setJobs(response.data);
    } catch (error) {
      console.error(error);
      toast.error(extractError(error, "Failed to load jobs"));
    } finally {
      setLoading(false);
    }
  };

  /* ───── Create ───── */
  const create = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    try {
      await api.post("/jobs/", {
        title: String(fd.get("title") ?? ""),
        department: String(fd.get("department") ?? ""),
        location: String(fd.get("location") ?? ""),
        employment_type: "Full-time",
        description: String(fd.get("description") ?? ""),
        required_skills: String(fd.get("skills") ?? ""),
        experience_required: String(fd.get("experience") ?? ""),
      });

      toast.success("Job created successfully");
      setOpenCreate(false);
      loadJobs();
    } catch (error) {
      console.error(error);
      toast.error(extractError(error, "Failed to create job"));
    }
  };

  /* ───── Update ───── */
  const update = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editJob) return;
    const fd = new FormData(e.currentTarget);

    try {
      await api.put(`/jobs/${editJob.id}`, {
        title: String(fd.get("title") ?? ""),
        department: String(fd.get("department") ?? ""),
        location: String(fd.get("location") ?? ""),
        employment_type: String(fd.get("employment_type") ?? "Full-time"),
        description: String(fd.get("description") ?? ""),
        required_skills: String(fd.get("skills") ?? ""),
        experience_required: String(fd.get("experience") ?? ""),
      });

      toast.success("Job updated successfully");
      setEditJob(null);
      loadJobs();
    } catch (error) {
      console.error(error);
      toast.error(extractError(error, "Failed to update job"));
    }
  };

  /* ───── Delete ───── */
  const remove = async (id: number) => {
    try {
      await api.delete(`/jobs/${id}`);
      toast.success("Job deleted successfully");
      setDeleteId(null);
      loadJobs();
    } catch (error) {
      console.error(error);
      toast.error(extractError(error, "Failed to delete job"));
    }
  };

  return (
    <>
      <PageHeader
        title="Jobs"
        description={`${jobs.length} roles in your workspace.`}
        actions={
          <Dialog open={openCreate} onOpenChange={setOpenCreate}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-1.5 h-4 w-4" /> Create job
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create new job</DialogTitle>
                <DialogDescription>
                  Post a new role to your careers page.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={create} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="title">Job title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Senior Backend Engineer"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      name="department"
                      defaultValue="Engineering"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      defaultValue="Remote"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="experience">Experience</Label>
                  <Input
                    id="experience"
                    name="experience"
                    defaultValue="3-5 yrs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="description">Job description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe responsibilities and requirements…"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="skills">
                    Required skills (comma separated)
                  </Label>
                  <Textarea
                    id="skills"
                    name="skills"
                    placeholder="Node.js, PostgreSQL, AWS"
                  />
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpenCreate(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Create job</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <Card className="border-border/60 shadow-[var(--shadow-card)]">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Role</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Skills</TableHead>
                <TableHead>Applicants</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Loading jobs…
                  </TableCell>
                </TableRow>
              )}
              {!loading && jobs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No jobs found. Create your first job posting.
                  </TableCell>
                </TableRow>
              )}
              {jobs.map((j) => (
                <TableRow key={j.id}>
                  <TableCell>
                    <div className="text-sm font-medium">{j.title}</div>
                    <div className="text-xs text-muted-foreground">{j.department || ""}</div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" /> {j.location || "—"}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{j.experience_required || "—"}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {j.required_skills
                        ? j.required_skills.split(",").map((s, i) => (
                            <Badge key={i} variant="secondary">{s.trim()}</Badge>
                          ))
                        : <span className="text-muted-foreground">—</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1 text-sm">
                      <Users className="h-3.5 w-3.5 text-muted-foreground" /> {j.applicants}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={j.status === "Open" ? "default" : "secondary"}>{j.status || "Open"}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => setEditJob(j)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onSelect={() => setDeleteId(j.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ───── Edit dialog ───── */}
      <Dialog open={!!editJob} onOpenChange={(o) => !o && setEditJob(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit job</DialogTitle>
            <DialogDescription>
              Update the details of this job posting.
            </DialogDescription>
          </DialogHeader>
          {editJob && (
            <form onSubmit={update} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="edit-title">Job title</Label>
                <Input
                  id="edit-title"
                  name="title"
                  defaultValue={editJob.title}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-department">Department</Label>
                  <Input
                    id="edit-department"
                    name="department"
                    defaultValue={editJob.department ?? ""}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-location">Location</Label>
                  <Input
                    id="edit-location"
                    name="location"
                    defaultValue={editJob.location ?? ""}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-employment_type">Employment type</Label>
                  <Input
                    id="edit-employment_type"
                    name="employment_type"
                    defaultValue={editJob.employment_type ?? "Full-time"}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-experience">Experience</Label>
                  <Input
                    id="edit-experience"
                    name="experience"
                    defaultValue={editJob.experience_required ?? ""}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-description">Job description</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  defaultValue={editJob.description ?? ""}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-skills">
                  Required skills (comma separated)
                </Label>
                <Textarea
                  id="edit-skills"
                  name="skills"
                  defaultValue={editJob.required_skills ?? ""}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditJob(null)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* ───── Delete confirmation ───── */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this job?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the job posting and cannot be undone. Applicants will still be preserved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId !== null) remove(deleteId);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
