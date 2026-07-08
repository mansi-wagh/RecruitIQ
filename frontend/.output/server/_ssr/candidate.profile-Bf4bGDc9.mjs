import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-PwNqyxv_.mjs";
import { t as Input } from "./input-uzm9g8Y7.mjs";
import { n as AvatarFallback, t as Avatar } from "./avatar-2TjXad6f.mjs";
import { T as FileText, y as LoaderCircle } from "../_libs/lucide-react.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as PageHeader } from "./portal-shell-Bqe4KT1I.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-Befnk9fX.mjs";
import { t as Badge } from "./badge-B3f60TId.mjs";
import { t as api } from "./api-BmP1cRwt.mjs";
import { t as Label } from "./label-BeT0bXvu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/candidate.profile-Bf4bGDc9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProfilePage() {
	const [candidate, setCandidate] = (0, import_react.useState)(null);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const currentUser = getStoredUser();
	const loadProfile = async () => {
		if (!currentUser?.id) {
			setCandidate(null);
			setError("Sign in as a candidate to view your profile.");
			setIsLoading(false);
			return;
		}
		setIsLoading(true);
		setError(null);
		try {
			const response = await api.get(`/candidates/${currentUser.id}`);
			setCandidate(response.data);
		} catch (err) {
			console.error("Failed to load candidate profile", err);
			setCandidate(null);
			setError("Unable to load your candidate profile.");
		} finally {
			setIsLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		loadProfile();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Profile",
		description: "Your candidate profile from PostgreSQL."
	}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "border-border/60 shadow-[var(--shadow-card)]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), "Loading profile..."]
		})
	}) : error || !candidate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "border-border/60 shadow-[var(--shadow-card)]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "space-y-3 py-16 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-destructive",
				children: error ?? "Candidate profile not found."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				size: "sm",
				onClick: () => void loadProfile(),
				children: "Retry"
			})]
		})
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 lg:grid-cols-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "border-border/60 shadow-[var(--shadow-card)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "flex flex-col items-center py-8 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
							className: "h-20 w-20",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
								className: "bg-primary/10 text-xl font-semibold text-primary",
								children: getInitials(candidate.name)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 text-lg font-semibold",
							children: candidate.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm text-muted-foreground",
							children: candidate.email
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-wrap justify-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "secondary",
								className: "rounded-full font-normal",
								children: candidate.role
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "outline",
								className: "rounded-full font-normal",
								children: ["ID ", candidate.id]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							className: "mt-6 w-full",
							variant: "outline",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/candidate/upload",
								children: "Upload resume"
							})
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-border/60 shadow-[var(--shadow-card)] lg:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "pb-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-base font-semibold",
						children: "Basic information"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "space-y-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Candidate ID",
								value: String(candidate.id)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Full name",
								value: candidate.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Email",
								type: "email",
								value: candidate.email
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Role",
								value: candidate.role
							})
						]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-border/60 shadow-[var(--shadow-card)] lg:col-span-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "pb-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "flex items-center gap-2 text-sm font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 text-primary" }), "Resume"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: candidate.resumes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "No resume has been uploaded yet."
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
function Field({ label, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			...props,
			readOnly: true
		})]
	});
}
function getStoredUser() {
	if (typeof window === "undefined") return null;
	const value = localStorage.getItem("user");
	if (!value) return null;
	try {
		return JSON.parse(value);
	} catch {
		return null;
	}
}
function getInitials(name) {
	return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "C";
}
function fileNameFromPath(path) {
	return path.split(/[\\/]/).pop() || path;
}
//#endregion
export { ProfilePage as component };
