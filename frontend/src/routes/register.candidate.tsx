import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import api from "@/lib/api";
import axios from "axios";
import { toast } from "sonner";
import { GraduationCap, Building2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/register/candidate")({
  component: CandidateRegisterPage,
});

function CandidateRegisterPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!name.trim()) errs.name = "Full name is required";
    if (!email.trim()) errs.email = "Email is required";
    if (!password) errs.password = "Password is required";
    else if (password.length < 6) errs.password = "Password must be at least 6 characters";
    if (password !== confirmPassword) errs.confirmPassword = "Passwords do not match";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      await api.post("/auth/register", {
        name: name.trim(),
        email: email.trim(),
        password,
        role: "candidate",
      });

      toast.success("Account created! Please sign in.");

      navigate({ to: "/login/candidate" });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const detail = error.response?.data?.detail;

        if (Array.isArray(detail)) {
          const fieldErrors: Record<string, string> = {};
          for (const err of detail) {
            const field = err.loc?.[1] ?? "general";
            fieldErrors[field] = err.msg;
          }
          setErrors(fieldErrors);
          toast.error("Please fix the validation errors");
        } else if (typeof detail === "string") {
          toast.error(detail);
        } else {
          toast.error(error.response?.data?.message ?? "Registration failed");
        }
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
          <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Join RecruitIQ to discover roles matched for you.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Jane Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">{errors.confirmPassword}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account…" : "Create account"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login/candidate" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </div>
          <div className="mt-2 text-center text-sm text-muted-foreground">
            Are you hiring?{" "}
            <Link to="/register/hr" className="font-medium text-primary hover:underline">
              HR registration
            </Link>
          </div>
        </div>
      </div>

      {/* Right illustration panel — matches the candidate login page */}
      <div className="relative hidden overflow-hidden bg-accent lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_80%_0%,rgba(37,99,235,0.35),transparent_60%)]" />
        <div className="relative flex h-full items-center justify-center p-12">
          <div className="w-full max-w-md text-accent-foreground">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/20 text-primary">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-medium">Your career starts here</div>
                  <div className="text-xs text-white/60">AI-matched opportunities</div>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                {[
                  { icon: Sparkles, title: "AI resume scoring", desc: "Get instant feedback" },
                  { icon: Building2, title: "Top companies", desc: "Matched to your skills" },
                  { icon: GraduationCap, title: "Track applications", desc: "All in one place" },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3">
                    <Icon className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-sm font-medium">{title}</div>
                      <div className="text-xs text-white/60">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
