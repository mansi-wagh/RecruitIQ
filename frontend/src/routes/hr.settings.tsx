import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageHeader } from "@/components/portal-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Loader2 } from "lucide-react";
import axios from "axios";

export const Route = createFileRoute("/hr/settings")({
  component: SettingsPage,
});

interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
}

function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const loadProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get<UserProfile>("/auth/me");
      setProfile(res.data);
      setName(res.data.name);
      setEmail(res.data.email);
    } catch (err) {
      console.error("Failed to load settings profile", err);
      toast.error("Failed to load user profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProfile();
  }, []);

  const extractError = (error: unknown, fallback: string): string => {
    if (axios.isAxiosError(error)) {
      const detail = error.response?.data?.detail;
      if (typeof detail === "string") return detail;
      if (Array.isArray(detail)) {
        return detail.map((e: { msg?: string }) => e.msg ?? "").join("; ");
      }
      return error.response?.data?.message ?? fallback;
    }
    return fallback;
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Name and email are required");
      return;
    }

    setSaving(true);
    try {
      const res = await api.put("/auth/me", {
        name: name.trim(),
        email: email.trim(),
      });
      // Save new access token & user profile in localStorage
      localStorage.setItem("access_token", res.data.access_token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setProfile(res.data.user);
      toast.success("Profile updated successfully");
      // Trigger side navigation profile updates
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      toast.error(extractError(err, "Failed to update profile"));
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error("Please enter your current password");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    setSaving(true);
    try {
      const res = await api.put("/auth/me", {
        current_password: currentPassword,
        new_password: newPassword,
      });

      // Update access token
      localStorage.setItem("access_token", res.data.access_token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password changed successfully");
    } catch (err) {
      toast.error(extractError(err, "Failed to change password"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <PageHeader title="Settings" description="Manage your account and profile preferences." />

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
        </TabsList>

        {/* PROFILE TAB */}
        <TabsContent value="profile">
          <form onSubmit={handleUpdateProfile}>
            <SectionCard title="Personal information" description="Update your user details stored in PostgreSQL.">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
                    {profile ? getInitials(profile.name) : "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-semibold">{profile?.name}</div>
                  <div className="text-xs text-muted-foreground capitalize">{profile?.role} account</div>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="fullName">Full name</Label>
                  <Input id="fullName" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="emailAddress">Email address</Label>
                  <Input id="emailAddress" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t border-border/70 pt-4">
                <Button type="button" variant="outline" onClick={() => void loadProfile()}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving changes…" : "Save changes"}
                </Button>
              </div>
            </SectionCard>
          </form>
        </TabsContent>

        {/* SECURITY TAB */}
        <TabsContent value="security">
          <form onSubmit={handleUpdatePassword}>
            <SectionCard title="Password" description="Update your account password. Verification of current password is required.">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="currentPass">Current password</Label>
                  <Input id="currentPass" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
                </div>
                <div />
                <div className="space-y-1.5">
                  <Label htmlFor="newPass">New password</Label>
                  <Input id="newPass" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="confirmPass">Confirm password</Label>
                  <Input id="confirmPass" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t border-border/70 pt-4">
                <Button type="submit" disabled={saving}>
                  {saving ? "Updating password…" : "Update password"}
                </Button>
              </div>
            </SectionCard>
          </form>
        </TabsContent>

        {/* NOTIFICATIONS TAB */}
        <TabsContent value="notifications">
          <SectionCard title="Email notifications" description="Choose what notifications you want to receive.">
            <ToggleRow label="New candidate applied" defaultChecked description="Alert when a new candidate applies." />
            <ToggleRow label="AI recommendation ready" defaultChecked description="Notify when a shortlist is ready." />
            <ToggleRow label="Weekly digest" description="A summary of activity every Monday." />
            <div className="flex justify-end gap-2 border-t border-border/70 pt-4">
              <Button onClick={() => toast.success("Notification preferences updated")}>Save changes</Button>
            </div>
          </SectionCard>
        </TabsContent>

        {/* THEME TAB */}
        <TabsContent value="theme">
          <SectionCard title="Appearance" description="Personalize how RecruitIQ looks.">
            <div className="grid gap-4 sm:max-w-sm">
              <div className="space-y-1.5">
                <Label>Theme</Label>
                <Select defaultValue="light">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-border/70 pt-4">
              <Button onClick={() => toast.success("Theme preference updated")}>Save changes</Button>
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </>
  );
}

function SectionCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <Card className="border-border/60 shadow-[var(--shadow-card)]">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="space-y-6">{children}</CardContent>
    </Card>
  );
}

function ToggleRow({ label, description, defaultChecked }: { label: string; description?: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border/70 p-4">
      <div>
        <div className="text-sm font-medium">{label}</div>
        {description ? <div className="text-xs text-muted-foreground">{description}</div> : null}
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}

function getInitials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "U"
  );
}
