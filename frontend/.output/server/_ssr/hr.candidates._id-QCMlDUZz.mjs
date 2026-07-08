import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-PwNqyxv_.mjs";
import { n as AvatarFallback, t as Avatar } from "./avatar-2TjXad6f.mjs";
import { G as ArrowLeft, T as FileText, i as UserRound, v as Mail, y as LoaderCircle } from "../_libs/lucide-react.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-Befnk9fX.mjs";
import { t as Badge } from "./badge-B3f60TId.mjs";
import { t as api } from "./api-BmP1cRwt.mjs";
import { t as Route } from "./hr.candidates._id-CQPAwMM7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hr.candidates._id-QCMlDUZz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CandidateDetail() {
	const { id } = Route.useParams();
	const [candidate, setCandidate] = (0, import_react.useState)(null);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const loadCandidate = async () => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await api.get(`/candidates/${id}`);
			setCandidate(response.data);
		} catch (err) {
			console.error("Failed to load candidate", err);
			setCandidate(null);
			setError("Unable to load candidate details.");
		} finally {
			setIsLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		loadCandidate();
	}, [id]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mb-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			variant: "ghost",
			size: "sm",
			className: "-ml-2",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/hr/candidates",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "mr-1 h-4 w-4" }), " Back to candidates"]
			})
		})
	}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "border-border/60 shadow-[var(--shadow-card)]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), "Loading candidate details..."]
		})
	}) : error || !candidate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "border-border/60 shadow-[var(--shadow-card)]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "space-y-3 py-16 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-destructive",
				children: error ?? "Candidate not found."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				size: "sm",
				onClick: () => void loadCandidate(),
				children: "Retry"
			})]
		})
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 lg:grid-cols-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "border-border/60 shadow-[var(--shadow-card)] lg:col-span-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "p-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex min-w-0 flex-wrap items-start gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
								className: "h-14 w-14 shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
									className: "bg-primary/10 text-lg font-semibold text-primary",
									children: getInitials(candidate.name)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "truncate text-xl font-semibold tracking-tight",
									children: candidate.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3 w-3" }),
											" ",
											candidate.email
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, { className: "h-3 w-3" }),
											" ",
											candidate.role
										]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "secondary",
								className: "rounded-full",
								children: ["Candidate ID ", candidate.id]
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-border/60 shadow-[var(--shadow-card)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "pb-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-sm font-semibold",
						children: "PostgreSQL fields"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
							label: "ID",
							value: String(candidate.id)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
							label: "Name",
							value: candidate.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
							label: "Email",
							value: candidate.email
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
							label: "Role",
							value: candidate.role
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-border/60 shadow-[var(--shadow-card)] lg:col-span-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "pb-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "flex items-center gap-2 text-sm font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 text-primary" }), "Resume files"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: candidate.resumes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "No resume has been uploaded for this candidate."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "divide-y divide-border/70 rounded-lg border border-border/70",
					children: candidate.resumes.map((resume) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-3 p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate text-sm font-medium",
								children: fileNameFromPath(resume.resume_path)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate text-xs text-muted-foreground",
								children: resume.resume_path
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "outline",
							className: "rounded-full",
							children: ["Resume ID ", resume.id]
						})]
					}, resume.id))
				}) })]
			})
		]
	})] });
}
function InfoRow({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between gap-4 border-b border-border/70 pb-2 last:border-0 last:pb-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "min-w-0 truncate font-medium",
			children: value
		})]
	});
}
function getInitials(name) {
	return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "C";
}
function fileNameFromPath(path) {
	return path.split(/[\\/]/).pop() || path;
}
//#endregion
export { CandidateDetail as component };
