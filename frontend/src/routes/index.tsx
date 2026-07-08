import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Users, Briefcase, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import logo from "@/assets/recruitiq-logo.png";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="RecruitIQ" className="h-9 w-auto" />
        </Link>
        <nav className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="ghost" size="sm">
            <Link to="/login/candidate">Candidate</Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/login/hr">
              HR sign in <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-24 pt-16">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            Hire better, faster,
            <br />
            with intelligent screening.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground">
            RecruitIQ combines applicant tracking with AI-driven candidate matching so recruiting teams
            can focus on the people, not the paperwork.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/login/hr">Open HR portal</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/login/candidate">I'm a candidate</Link>
            </Button>
          </div>
        </div>

        <div className="mt-20 grid gap-4 sm:grid-cols-3">
          {[
            { icon: Users, title: "Unified candidate CRM", body: "Every applicant, every touchpoint, one clean pipeline." },
            { icon: Sparkles, title: "AI match scoring", body: "Ranked shortlists in seconds with explainable signals." },
            { icon: ShieldCheck, title: "Enterprise ready", body: "Role-based access, audit trails and SSO for larger teams." },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-xl border border-border/70 bg-card p-5 shadow-[var(--shadow-card)]">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-4 w-4" />
              </div>
              <div className="mt-4 text-sm font-semibold">{title}</div>
              <p className="mt-1 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-border/70 py-6 text-center text-xs text-muted-foreground">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-1.5">
            <Briefcase className="h-3.5 w-3.5" /> © {new Date().getFullYear()} RecruitIQ
          </div>
          <div>All systems operational</div>
        </div>
      </footer>
    </div>
  );
}

