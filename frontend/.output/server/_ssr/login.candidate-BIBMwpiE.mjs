import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as CandidateIllustration, t as AuthLayout } from "./login.hr-DQxavBwi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login.candidate-BIBMwpiE.js
var import_jsx_runtime = require_jsx_runtime();
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthLayout, {
	title: "Welcome to RecruitIQ",
	subtitle: "Sign in to track applications and discover roles matched for you.",
	illustration: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CandidateIllustration, {}),
	redirectTo: "/candidate/dashboard",
	ctaLabel: "Login",
	footerText: "Are you hiring?",
	footerLinkLabel: "HR login",
	footerLinkTo: "/login/hr",
	registerTo: "/register/candidate"
});
//#endregion
export { SplitComponent as component };
