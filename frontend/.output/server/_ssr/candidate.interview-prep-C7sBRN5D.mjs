import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-PwNqyxv_.mjs";
import { A as CirclePlay, S as GraduationCap, b as Lightbulb, s as Target } from "../_libs/lucide-react.mjs";
import { a as PageHeader } from "./portal-shell-Bqe4KT1I.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-Befnk9fX.mjs";
import { t as Badge } from "./badge-B3f60TId.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/candidate.interview-prep-C7sBRN5D.js
var import_jsx_runtime = require_jsx_runtime();
function InterviewPrep() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Interview preparation",
		description: "Practice with AI-generated questions and structured roadmaps."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 lg:grid-cols-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "border-border/60 shadow-[var(--shadow-card)] lg:col-span-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
				className: "pb-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
					className: "flex items-center gap-2 text-sm font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "h-4 w-4 text-primary" }), " Practice questions"]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "divide-y divide-border/70",
				children: [
					{
						q: "Walk me through your design process for a data-heavy dashboard.",
						topic: "Product design"
					},
					{
						q: "How do you balance velocity with code quality in a small team?",
						topic: "Engineering"
					},
					{
						q: "Describe a project where you had to influence without authority.",
						topic: "Leadership"
					},
					{
						q: "What's your approach to receiving critical feedback?",
						topic: "Behavioral"
					}
				].map((row, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-medium",
							children: row.q
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "secondary",
							className: "mt-1.5 rounded-full font-normal",
							children: row.topic
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "outline",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlay, { className: "mr-1.5 h-3.5 w-3.5" }), " Practice"]
					})]
				}, i))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-border/60 shadow-[var(--shadow-card)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "pb-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "flex items-center gap-2 text-sm font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightbulb, { className: "h-4 w-4 text-primary" }), " Tips for your next round"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "list-disc space-y-1.5 pl-5 text-sm text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Structure answers with the STAR framework." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Prepare 2 questions for the interviewer." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Speak to measurable outcomes." })
					]
				}) })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-border/60 shadow-[var(--shadow-card)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "pb-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "flex items-center gap-2 text-sm font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "h-4 w-4 text-primary" }), " Recommended courses"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "space-y-3",
					children: [{
						t: "Product interviews masterclass",
						d: "6 modules · 3h"
					}, {
						t: "System design bootcamp",
						d: "12 modules · 8h"
					}].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border/70 p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-medium",
							children: c.t
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: c.d
						})]
					}, c.t))
				})]
			})]
		})]
	})] });
}
//#endregion
export { InterviewPrep as component };
