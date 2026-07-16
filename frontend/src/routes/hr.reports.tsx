import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/portal-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { useEffect, useState } from "react";
import { Loader2, AlertCircle, FileBarChart2 } from "lucide-react";
import api from "@/lib/api";

export const Route = createFileRoute("/hr/reports")({
  component: ReportsPage,
});

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

interface SkillCount {
  skill: string;
  value: number;
}

interface StatusCount {
  name: string;
  value: number;
}

interface DepartmentCount {
  department: string;
  value: number;
}

interface ApplicantsPerJob {
  title: string;
  applicants: number;
}

interface ChartsData {
  skill_distribution: SkillCount[];
  job_status_distribution: StatusCount[];
  jobs_by_department: DepartmentCount[];
  applicants_per_job: ApplicantsPerJob[];
}

function ReportsPage() {
  const [data, setData] = useState<ChartsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChartsData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<ChartsData>("/reports/charts");
      setData(res.data);
    } catch (err) {
      console.error("Failed to load charts data", err);
      setError("Unable to load reports. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchChartsData();
  }, []);

  return (
    <>
      <PageHeader title="Reports" description="Hiring analytics across your workspace." />

      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Chart 1: Applicants per Job */}
        <ChartCard
          title="Applicants per job"
          subtitle="Top roles by candidate applicant counts"
          loading={loading}
          isEmpty={!data || data.applicants_per_job.length === 0}
        >
          {data && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.applicants_per_job} margin={{ top: 10, right: 10, left: 0, bottom: 30 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="title"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fill: "var(--muted-foreground)" }}
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                  height={50}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                <Tooltip contentStyle={{ borderRadius: 8, borderColor: "var(--border)", fontSize: 12 }} />
                <Area type="monotone" dataKey="applicants" stroke="var(--primary)" strokeWidth={2} fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* Chart 2: Jobs by Department */}
        <ChartCard
          title="Jobs by department"
          subtitle="Total postings grouped by department"
          loading={loading}
          isEmpty={!data || data.jobs_by_department.length === 0}
        >
          {data && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.jobs_by_department} margin={{ top: 10, right: 10, left: 0, bottom: 35 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="department"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                  height={40}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                <Tooltip contentStyle={{ borderRadius: 8, borderColor: "var(--border)", fontSize: 12 }} />
                <Bar dataKey="value" name="Jobs count" radius={[6, 6, 0, 0]}>
                  {data.jobs_by_department.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* Chart 3: Skill Distribution */}
        <ChartCard
          title="Skill distribution"
          subtitle="Top skills across required job qualifications"
          loading={loading}
          isEmpty={!data || data.skill_distribution.length === 0}
        >
          {data && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.skill_distribution} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                <YAxis type="category" dataKey="skill" width={80} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                <Tooltip contentStyle={{ borderRadius: 8, borderColor: "var(--border)", fontSize: 12 }} />
                <Bar dataKey="value" name="Skill frequency" radius={[0, 6, 6, 0]}>
                  {data.skill_distribution.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* Chart 4: Job Status Distribution */}
        <ChartCard
          title="Job status distribution"
          subtitle="Active status breakdown of job postings"
          loading={loading}
          isEmpty={!data || data.job_status_distribution.length === 0}
        >
          {data && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.job_status_distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {data.job_status_distribution.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, borderColor: "var(--border)", fontSize: 12 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>
    </>
  );
}

interface ChartCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  loading: boolean;
  isEmpty: boolean;
}

function ChartCard({ title, subtitle, children, loading, isEmpty }: ChartCardProps) {
  return (
    <Card className="border-border/60 shadow-[var(--shadow-card)]">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </CardHeader>
      <CardContent className="relative h-72 flex items-center justify-center [&>div]:h-full [&>div]:w-full">
        {loading ? (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-xs">Loading chart data...</span>
          </div>
        ) : isEmpty ? (
          <div className="flex flex-col items-center gap-2 text-muted-foreground text-center">
            <FileBarChart2 className="h-8 w-8 opacity-40" />
            <span className="text-xs">No job data available in PostgreSQL.</span>
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}
