import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/portal-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";
import { applications } from "@/lib/mock-data";

export const Route = createFileRoute("/candidate/applications")({
  component: ApplicationsPage,
});

function ApplicationsPage() {
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
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.jobTitle}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{a.company}</TableCell>
                  <TableCell className="text-sm">{a.matchScore}%</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{a.appliedAt}</TableCell>
                  <TableCell><StatusBadge status={a.status} /></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
