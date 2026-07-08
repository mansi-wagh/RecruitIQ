import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import api from "@/lib/api";
import axios from "axios";
import { toast } from "sonner";
import { Users, Sparkles, ShieldCheck, GraduationCap, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/login/hr")({
  component: () => (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your RecruitIQ HR workspace."
      illustration={<HRIllustration />}
      redirectTo="/hr/dashboard"
      loginAs="hr"
      ctaLabel="Sign in"
      footerText="Not a recruiter?"
      footerLinkLabel="Candidate login"
      footerLinkTo="/login/candidate"
    />
  ),
});

export function AuthLayout({
  title,
  subtitle,
  illustration,
  redirectTo,
  loginAs,
  ctaLabel,
  footerText,
  footerLinkLabel,
  footerLinkTo,
  registerTo = "/register/hr",
}: {
  title: string;
  subtitle: string;
  illustration: ReactNode;
  redirectTo: string;
  loginAs: "hr" | "candidate";
  ctaLabel: string;
  footerText: string;
  footerLinkLabel: string;
  footerLinkTo: string;
  registerTo?: string;
}) {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      // Login
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const token = response.data.access_token;

      if (!token) {
        toast.error("No token received from server");
        return;
      }

      // Store JWT
      localStorage.setItem("access_token", token);

      // Fetch current user
      let user;
      try {
        const userResponse = await api.get("/auth/me");
        user = userResponse.data;
      } catch {
        localStorage.removeItem("access_token");
        toast.error("Login succeeded but failed to load user profile");
        return;
      }

      if (loginAs === "hr" && user.role === "candidate") {
        toast.error("This account is a candidate account.");
        localStorage.removeItem("access_token");
        return;
      }

      if (loginAs === "candidate" && user.role !== "candidate") {
        toast.error("This account is not a candidate account.");
        localStorage.removeItem("access_token");
        return;
      }

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      toast.success("Login successful");

      navigate({
        to: redirectTo,
      });

    } catch (error) {
      if (axios.isAxiosError(error)) {
        const detail = error.response?.data?.detail;
        toast.error(
          typeof detail === "string"
            ? detail
            : error.response?.data?.message ?? "Login failed"
        );
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-2">
      <div className="flex min-h-screen items-center justify-center px-6 py-12 lg:min-h-0">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-10 flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-sm font-bold">R</span>
            </div>
            <span className="text-base font-semibold tracking-tight">RecruitIQ</span>
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Work email</Label>
              <Input id="email" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button type="button" className="text-xs font-medium text-primary hover:underline">
                  Forgot password?
                </button>
              </div>
              <Input id="password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Checkbox defaultChecked /> Remember me for 30 days
            </label>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in…" : ctaLabel}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {footerText}{" "}
            <Link to={footerLinkTo} className="font-medium text-primary hover:underline">
              {footerLinkLabel}
            </Link>
          </div>
          <div className="mt-2 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to={registerTo} className="font-medium text-primary hover:underline">
              Create account
            </Link>
          </div>
        </div>
      </div>

      <div className="relative hidden overflow-hidden bg-accent lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_80%_0%,rgba(37,99,235,0.35),transparent_60%)]" />
        <div className="relative flex h-full items-center justify-center p-12">{illustration}</div>
      </div>
    </div>
  );
}

function HRIllustration() {
  return (
    <div className="w-full max-w-md text-accent-foreground">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <div className="flex items-center gap-2 text-xs text-white/60">
          <div className="h-2 w-2 rounded-full bg-white/30" />
          <div className="h-2 w-2 rounded-full bg-white/30" />
          <div className="h-2 w-2 rounded-full bg-white/30" />
          <div className="ml-auto">recruitiq.io/hr</div>
        </div>
        <div className="mt-5 text-lg font-semibold">Today's shortlist</div>
        <div className="mt-4 space-y-3">
          {[
            { name: "Aarav Sharma", role: "Sr. Backend", score: 94 },
            { name: "Priya Nair", role: "Data Scientist", score: 91 },
            { name: "Sofia Martinez", role: "Product Designer", score: 88 },
          ].map((c) => (
            <div key={c.name} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3">
              <div>
                <div className="text-sm font-medium">{c.name}</div>
                <div className="text-xs text-white/60">{c.role}</div>
              </div>
              <div className="rounded-full bg-primary/20 px-2 py-0.5 text-xs font-semibold text-primary">
                {c.score}% match
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-3">
        {[
          { icon: Users, label: "1,284 candidates" },
          { icon: Sparkles, label: "AI screening" },
          { icon: ShieldCheck, label: "SOC 2 ready" },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white/80">
            <Icon className="mb-2 h-4 w-4 text-primary" />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

export function CandidateIllustration() {
  return (
    <div className="w-full max-w-md text-accent-foreground">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/20 text-primary">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-medium">Your resume score</div>
            <div className="text-xs text-white/60">Updated 2 minutes ago</div>
          </div>
          <div className="ml-auto text-2xl font-semibold">86</div>
        </div>
        <div className="mt-5 space-y-3">
          {[
            { title: "Senior Product Designer", company: "Linear", match: 91 },
            { title: "Frontend Engineer", company: "Stripe", match: 84 },
            { title: "Design Systems Lead", company: "Notion", match: 96 },
          ].map((j) => (
            <div key={j.title} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3">
              <div className="grid h-8 w-8 place-items-center rounded-md bg-white/10">
                <Building2 className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{j.title}</div>
                <div className="text-xs text-white/60">{j.company}</div>
              </div>
              <div className="rounded-full bg-primary/20 px-2 py-0.5 text-xs font-semibold text-primary">
                {j.match}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
