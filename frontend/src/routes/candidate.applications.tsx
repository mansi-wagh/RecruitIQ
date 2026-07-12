import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/portal-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/candidate/applications")({
  component: ApplicationsPage,
});

interface Application {
  id: number;
  job_id: number;
  job_title: string;
  company: string;
  status: string;
  match_score: number;
  applied_at: string;
}

function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      setLoading(true);
      try {
        const res = await api.get<Application[]>("/applications/");
        setApplications(res.data);
      } catch (err) {
        console.error("Failed to fetch candidate applications", err);
      } finally {
        setLoading(false);
      }
    };
    void fetchApps();
  }, []);

  return (
    <>
      <PageHeader title="Applications" description="Track the status of every role you've applied to." />

      <Card className="border-border/60 shadow-[var(--shadow-card)]">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Role</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Match</TableHead>
                <TableHead>Applied</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      Loading applications...
                    </span>
                  </TableCell>
                </TableRow>
              ) : applications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center text-sm text-muted-foreground">
                    You haven't submitted any job applications yet.
                  </TableCell>
                </TableRow>
              ) : (
                applications.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">{a.job_title}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{a.company}</TableCell>
                    <TableCell className="text-sm font-mono">{a.match_score}%</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(a.applied_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={a.status as any} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
