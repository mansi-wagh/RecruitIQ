import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-PwNqyxv_.mjs";
import { t as Input } from "./input-uzm9g8Y7.mjs";
import { V as Bookmark, _ as MapPin, p as Search, z as Briefcase } from "../_libs/lucide-react.mjs";
import { a as PageHeader } from "./portal-shell-Bqe4KT1I.mjs";
import { n as CardContent, t as Card } from "./card-Befnk9fX.mjs";
import { t as Badge } from "./badge-B3f60TId.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DamjaduW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/candidate.jobs-BLBK9t3g.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var recommended = [
	{
		id: "r1",
		title: "Senior Product Designer",
		company: "Linear",
		location: "Remote",
		type: "Full-time",
		match: 96,
		salary: "$140k – $180k",
		skills: [
			"Figma",
			"Design systems",
			"Prototyping"
		]
	},
	{
		id: "r2",
		title: "Frontend Engineer",
		company: "Stripe",
		location: "Dublin",
		type: "Full-time",
		match: 89,
		salary: "$130k – $170k",
		skills: [
			"React",
			"TypeScript",
			"GraphQL"
		]
	},
	{
		id: "r3",
		title: "Design Systems Lead",
		company: "Notion",
		location: "San Francisco",
		type: "Full-time",
		match: 92,
		salary: "$180k – $220k",
		skills: [
			"Figma",
			"Tokens",
			"Leadership"
		]
	},
	{
		id: "r4",
		title: "UX Researcher",
		company: "Vercel",
		location: "Remote",
		type: "Contract",
		match: 76,
		salary: "$110k – $140k",
		skills: ["Research", "Interviews"]
	},
	{
		id: "r5",
		title: "Product Manager, Growth",
		company: "Ashby",
		location: "New York",
		type: "Full-time",
		match: 71,
		salary: "$150k – $190k",
		skills: ["Growth", "Analytics"]
	}
];
function JobsPage() {
	const [q, setQ] = (0, import_react.useState)("");
	const list = recommended.filter((j) => q === "" || j.title.toLowerCase().includes(q.toLowerCase()) || j.company.toLowerCase().includes(q.toLowerCase()));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Recommended jobs",
			description: "Curated by AI based on your resume and preferences."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex flex-wrap items-center gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Search roles or companies…",
						className: "h-10 pl-9"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					defaultValue: "all",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
						className: "h-10 w-[140px]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "All types"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "full",
							children: "Full-time"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "contract",
							children: "Contract"
						})
					] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					defaultValue: "all",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
						className: "h-10 w-[140px]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "Any location"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "remote",
							children: "Remote"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "onsite",
							children: "On-site"
						})
					] })]
				})
			]
		}),
		list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "border-border/60 shadow-[var(--shadow-card)]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "py-16 text-center text-sm text-muted-foreground",
				children: "No jobs match your search yet. Try a different keyword."
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 md:grid-cols-2",
			children: list.map((j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "border-border/60 shadow-[var(--shadow-card)] transition hover:border-primary/30",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate text-base font-semibold",
									children: j.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "h-3 w-3" }),
												" ",
												j.company
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3 w-3" }),
												" ",
												j.location
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: j.type })
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700",
								children: [j.match, "% match"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 flex flex-wrap gap-1",
							children: j.skills.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "secondary",
								className: "rounded-full font-normal",
								children: s
							}, s))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-medium",
								children: j.salary
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									className: "h-8 w-8",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									children: "Apply"
								})]
							})]
						})
					]
				})
			}, j.id))
		})
	] });
}
//#endregion
export { JobsPage as component };
