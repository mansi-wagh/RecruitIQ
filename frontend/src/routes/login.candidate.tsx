import { createFileRoute } from "@tanstack/react-router";
import { AuthLayout, CandidateIllustration } from "./login.hr";

export const Route = createFileRoute("/login/candidate")({
  component: () => (
    <AuthLayout
      title="Welcome to RecruitIQ"
      subtitle="Sign in to track applications and discover roles matched for you."
      illustration={<CandidateIllustration />}
      redirectTo="/candidate/dashboard"
      loginAs="candidate"
      ctaLabel="Login"
      footerText="Are you hiring?"
      footerLinkLabel="HR login"
      footerLinkTo="/login/hr"
      registerTo="/register/candidate"
    />
  ),
});