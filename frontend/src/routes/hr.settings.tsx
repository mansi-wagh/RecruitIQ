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

export const Route = createFileRoute("/hr/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <>
      <PageHeader title="Settings" description="Manage your account, company and workspace preferences." />

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <SectionCard title="Personal information" description="Update your profile details.">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">AM</AvatarFallback>
              </Avatar>
              <div>
                <Button size="sm" variant="outline">Upload new photo</Button>
                <p className="mt-1 text-xs text-muted-foreground">JPG or PNG, max 2MB.</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" defaultValue="Alex Morgan" />
              <Field label="Job title" defaultValue="Talent Lead" />
              <Field label="Email" defaultValue="alex@recruitiq.io" type="email" />
              <Field label="Phone" defaultValue="+1 (415) 555 0121" />
            </div>
            <SaveRow />
          </SectionCard>
        </TabsContent>

        <TabsContent value="company">
          <SectionCard title="Company details" description="Manage your organization.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Company name" defaultValue="RecruitIQ Inc." />
              <Field label="Website" defaultValue="https://recruitiq.io" />
              <Field label="Industry" defaultValue="SaaS" />
              <Field label="Company size" defaultValue="51-200" />
            </div>
            <SaveRow />
          </SectionCard>
        </TabsContent>

        <TabsContent value="security">
          <SectionCard title="Password" description="Update your password regularly.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Current password" type="password" />
              <div />
              <Field label="New password" type="password" />
              <Field label="Confirm password" type="password" />
            </div>
            <SaveRow label="Update password" />
          </SectionCard>
          <div className="mt-6">
            <SectionCard title="Two-factor authentication" description="Add an extra layer of security.">
              <ToggleRow label="Enable 2FA" description="Use an authenticator app to sign in." />
            </SectionCard>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <SectionCard title="Email notifications" description="Choose what you want to be notified about.">
            <ToggleRow label="New candidate applied" defaultChecked description="Alert when a new candidate applies." />
            <ToggleRow label="AI recommendation ready" defaultChecked description="Notify when a shortlist is ready." />
            <ToggleRow label="Weekly digest" description="A summary of activity every Monday." />
            <SaveRow />
          </SectionCard>
        </TabsContent>

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
              <div className="space-y-1.5">
                <Label>Accent color</Label>
                <div className="flex gap-2">
                  {["#2563EB", "#0F172A", "#059669", "#D97706"].map((c) => (
                    <button key={c} className="h-8 w-8 rounded-full border-2 border-border/70" style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
            </div>
            <SaveRow />
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

function Field({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input {...props} />
    </div>
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

function SaveRow({ label = "Save changes" }: { label?: string }) {
  return (
    <div className="flex justify-end gap-2 border-t border-border/70 pt-4">
      <Button variant="outline">Cancel</Button>
      <Button onClick={() => toast.success("Saved")}>{label}</Button>
    </div>
  );
}
