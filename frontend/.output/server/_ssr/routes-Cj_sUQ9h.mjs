import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-PwNqyxv_.mjs";
import { W as ArrowRight, l as Sparkles, n as Users, u as ShieldCheck, z as Briefcase } from "../_libs/lucide-react.mjs";
import { t as ThemeToggle } from "./theme-toggle-u9B8xij6.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as recruitiq_logo_default } from "./recruitiq-logo-B-NZ3_b2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Cj_sUQ9h.js
var import_jsx_runtime = require_jsx_runtime();
function Landing() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mx-auto flex max-w-6xl items-center justify-between px-6 py-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "flex items-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: recruitiq_logo_default,
						alt: "RecruitIQ",
						className: "h-9 w-auto"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "ghost",
							size: "sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/login/candidate",
								children: "Candidate"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/login/hr",
								children: ["HR sign in ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-1 h-3.5 w-3.5" })]
							})
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-6xl px-6 pb-24 pt-16",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-3xl text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl",
							children: [
								"Hire better, faster,",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								"with intelligent screening."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mx-auto mt-5 max-w-xl text-base text-muted-foreground",
							children: "RecruitIQ combines applicant tracking with AI-driven candidate matching so recruiting teams can focus on the people, not the paperwork."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex flex-wrap items-center justify-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "lg",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/login/hr",
									children: "Open HR portal"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "lg",
								variant: "outline",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/login/candidate",
									children: "I'm a candidate"
								})
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-20 grid gap-4 sm:grid-cols-3",
					children: [
						{
							icon: Users,
							title: "Unified candidate CRM",
							body: "Every applicant, every touchpoint, one clean pipeline."
						},
						{
							icon: Sparkles,
							title: "AI match scoring",
							body: "Ranked shortlists in seconds with explainable signals."
						},
						{
							icon: ShieldCheck,
							title: "Enterprise ready",
							body: "Role-based access, audit trails and SSO for larger teams."
						}
					].map(({ icon: Icon, title, body }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border/70 bg-card p-5 shadow-[var(--shadow-card)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 text-sm font-semibold",
								children: title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: body
							})
						]
					}, title))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "border-t border-border/70 py-6 text-center text-xs text-muted-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl items-center justify-between px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "h-3.5 w-3.5" }),
							" © ",
							(/* @__PURE__ */ new Date()).getFullYear(),
							" RecruitIQ"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "All systems operational" })]
				})
			})
		]
	});
}
//#endregion
export { Landing as component };
