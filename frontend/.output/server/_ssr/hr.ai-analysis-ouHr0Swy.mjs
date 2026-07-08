import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-PwNqyxv_.mjs";
import { S as GraduationCap, b as Lightbulb, j as CircleCheck, k as CircleX, l as Sparkles, s as Target } from "../_libs/lucide-react.mjs";
import { a as PageHeader } from "./portal-shell-Bqe4KT1I.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-Befnk9fX.mjs";
import { t as Badge } from "./badge-B3f60TId.mjs";
import { n as candidates, r as featureImportance } from "./mock-data-WtXK140Y.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DamjaduW.mjs";
import { a as XAxis, c as Bar, d as ResponsiveContainer, f as Tooltip, i as YAxis, r as BarChart, u as Cell } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hr.ai-analysis-ouHr0Swy.js
var import_jsx_runtime = require_jsx_runtime();
function AIAnalysisPage() {
	const score = 87;
	const circumference = 2 * Math.PI * 52;
	const dash = score / 100 * circumference;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "AI analysis",
		description: "Deep candidate insights powered by RecruitIQ AI.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
			defaultValue: candidates[0].id,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
				className: "h-9 w-[220px]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: candidates.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
				value: c.id,
				children: [
					c.name,
					" — ",
					c.role
				]
			}, c.id)) })]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 lg:grid-cols-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-border/60 shadow-[var(--shadow-card)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "pb-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-sm font-semibold",
						children: "Prediction score"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "flex flex-col items-center justify-center gap-3 py-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative h-40 w-40",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
							className: "h-40 w-40 -rotate-90",
							viewBox: "0 0 120 120",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: "60",
								cy: "60",
								r: "52",
								stroke: "currentColor",
								strokeWidth: "10",
								className: "text-muted",
								fill: "none"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: "60",
								cy: "60",
								r: "52",
								stroke: "currentColor",
								strokeWidth: "10",
								className: "text-primary",
								strokeLinecap: "round",
								fill: "none",
								strokeDasharray: `${dash} ${circumference}`
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute inset-0 flex flex-col items-center justify-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-4xl font-semibold tracking-tight",
								children: [score, "%"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: "Match"
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: "Confidence: High · 94th percentile"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-border/60 shadow-[var(--shadow-card)] lg:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "pb-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-sm font-semibold",
						children: "Feature importance"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "h-64 [&>div]:h-full [&>div]:w-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: featureImportance,
							layout: "vertical",
							margin: {
								left: 20,
								right: 20
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									type: "number",
									hide: true,
									domain: [0, 40]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									type: "category",
									dataKey: "feature",
									width: 130,
									tickLine: false,
									axisLine: false,
									tick: {
										fontSize: 12,
										fill: "var(--muted-foreground)"
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									cursor: { fill: "var(--muted)" },
									contentStyle: {
										borderRadius: 8,
										borderColor: "var(--border)",
										fontSize: 12
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "value",
									radius: [
										0,
										6,
										6,
										0
									],
									children: featureImportance.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: "var(--primary)" }, i))
								})
							]
						})
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-border/60 shadow-[var(--shadow-card)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "pb-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "flex items-center gap-2 text-sm font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-success" }), " Matched skills"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "flex flex-wrap gap-1.5",
					children: [
						"Node.js",
						"PostgreSQL",
						"AWS",
						"Docker",
						"TypeScript"
					].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						className: "rounded-full bg-emerald-50 font-normal text-emerald-700 hover:bg-emerald-50",
						variant: "secondary",
						children: s
					}, s))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-border/60 shadow-[var(--shadow-card)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "pb-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "flex items-center gap-2 text-sm font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-4 w-4 text-destructive" }), " Missing skills"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "flex flex-wrap gap-1.5",
					children: [
						"Kafka",
						"Kubernetes",
						"Go"
					].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						className: "rounded-full bg-rose-50 font-normal text-rose-700 hover:bg-rose-50",
						variant: "secondary",
						children: s
					}, s))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-border/60 shadow-[var(--shadow-card)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "pb-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "flex items-center gap-2 text-sm font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-primary" }), " AI summary"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "text-sm text-muted-foreground",
					children: "Excellent overlap on core backend stack. Recommend a technical deep-dive on distributed systems and a quick culture-add screen with the hiring manager."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-border/60 shadow-[var(--shadow-card)] lg:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "pb-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "flex items-center gap-2 text-sm font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "h-4 w-4 text-primary" }), " Interview questions"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
					className: "list-decimal space-y-2 pl-5 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Design a high-throughput event pipeline. Walk us through your choice of broker and partitioning." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Describe a time you diagnosed a production incident. What signals did you rely on?" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "How would you migrate a monolith to microservices without a rewrite?" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Explain optimistic vs pessimistic locking with a real-world example." })
					]
				}) })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-border/60 shadow-[var(--shadow-card)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "pb-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "flex items-center gap-2 text-sm font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightbulb, { className: "h-4 w-4 text-primary" }), " Resume suggestions"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "list-disc space-y-1.5 pl-5 text-sm text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Add metrics to impact statements." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Consolidate technologies section — group by category." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Move education below experience." })
					]
				}) })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-border/60 shadow-[var(--shadow-card)] lg:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
					className: "flex flex-row items-center justify-between space-y-0 pb-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "flex items-center gap-2 text-sm font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "h-4 w-4 text-primary" }), " Learning roadmap"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						children: "Export"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "space-y-3",
					children: [
						{
							title: "Master Kafka fundamentals",
							weeks: "2 weeks",
							link: "confluent.io"
						},
						{
							title: "Kubernetes for backend engineers",
							weeks: "3 weeks",
							link: "kubernetes.io"
						},
						{
							title: "Go crash course",
							weeks: "4 weeks",
							link: "gophercises.com"
						}
					].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between rounded-lg border border-border/70 p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-medium",
							children: s.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground",
							children: [
								s.weeks,
								" · ",
								s.link
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							children: "Add"
						})]
					}, s.title))
				})]
			})
		]
	})] });
}
//#endregion
export { AIAnalysisPage as component };
