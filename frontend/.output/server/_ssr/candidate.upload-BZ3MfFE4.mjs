import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as cn, t as Button } from "./button-PwNqyxv_.mjs";
import { D as CloudUpload, T as FileText, j as CircleCheck, y as LoaderCircle } from "../_libs/lucide-react.mjs";
import { a as PageHeader } from "./portal-shell-Bqe4KT1I.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-Befnk9fX.mjs";
import { t as Badge } from "./badge-B3f60TId.mjs";
import { t as api } from "./api-BmP1cRwt.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/candidate.upload-BZ3MfFE4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function UploadPage() {
	const [file, setFile] = (0, import_react.useState)(null);
	const [dragging, setDragging] = (0, import_react.useState)(false);
	const [candidate, setCandidate] = (0, import_react.useState)(null);
	const [profileError, setProfileError] = (0, import_react.useState)(null);
	const [isLoadingProfile, setIsLoadingProfile] = (0, import_react.useState)(true);
	const [isUploading, setIsUploading] = (0, import_react.useState)(false);
	const currentUser = getStoredUser();
	const loadProfile = async () => {
		if (!currentUser?.id) {
			setCandidate(null);
			setProfileError("Sign in as a candidate to upload a resume.");
			setIsLoadingProfile(false);
			return;
		}
		setIsLoadingProfile(true);
		setProfileError(null);
		try {
			const response = await api.get(`/candidates/${currentUser.id}`);
			setCandidate(response.data);
		} catch (err) {
			console.error("Failed to load candidate profile", err);
			setCandidate(null);
			setProfileError("Unable to load your candidate profile.");
		} finally {
			setIsLoadingProfile(false);
		}
	};
	(0, import_react.useEffect)(() => {
		loadProfile();
	}, []);
	const onFiles = async (files) => {
		if (!files || !files[0]) return;
		const selectedFile = files[0];
		const extension = selectedFile.name.split(".").pop()?.toLowerCase();
		if (!["pdf", "docx"].includes(extension ?? "")) {
			toast.error("Only PDF and DOCX resumes are allowed");
			return;
		}
		if (!currentUser?.id) {
			toast.error("Sign in as a candidate to upload a resume");
			return;
		}
		const formData = new FormData();
		formData.append("resume", selectedFile);
		formData.append("candidate_id", String(currentUser.id));
		setFile(selectedFile);
		setIsUploading(true);
		try {
			await api.post("/resume/upload", formData, { headers: { "Content-Type": "multipart/form-data" } });
			toast.success("Resume uploaded successfully");
			await loadProfile();
		} catch (err) {
			console.error("Failed to upload resume", err);
			toast.error("Resume upload failed");
		} finally {
			setIsUploading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Upload resume",
		description: "Upload your latest PDF or DOCX resume."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 lg:grid-cols-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "border-dashed border-border/70 shadow-[var(--shadow-card)] lg:col-span-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "p-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						onDragOver: (e) => {
							e.preventDefault();
							setDragging(true);
						},
						onDragLeave: () => setDragging(false),
						onDrop: (e) => {
							e.preventDefault();
							setDragging(false);
							onFiles(e.dataTransfer.files);
						},
						className: cn("flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl px-8 py-20 text-center transition", dragging && "bg-primary/5", isUploading && "pointer-events-none opacity-70"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary",
								children: isUploading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudUpload, { className: "h-6 w-6" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-base font-semibold",
								children: isUploading ? "Uploading resume..." : "Drag & drop your resume"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: "PDF or DOCX"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "sm",
								disabled: isUploading,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Browse files" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "file",
								accept: ".pdf,.docx",
								className: "hidden",
								disabled: isUploading,
								onChange: (e) => void onFiles(e.target.files)
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
						children: "Candidate profile"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "space-y-3",
					children: isLoadingProfile ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-sm text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), "Loading profile..."]
					}) : profileError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-destructive",
							children: profileError
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => void loadProfile(),
							children: "Retry"
						})]
					}) : candidate ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
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
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
							label: "Candidate ID",
							value: String(candidate.id)
						})
					] }) : null
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-border/60 shadow-[var(--shadow-card)] lg:col-span-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
					className: "flex flex-row items-center justify-between space-y-0 pb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "flex items-center gap-2 text-sm font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 text-primary" }), " Saved resume"]
					}), candidate?.resumes.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "secondary",
						className: "rounded-full",
						children: "Stored in PostgreSQL"
					}) : null]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: candidate?.resumes.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border border-border/70 bg-muted/40 p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 flex min-w-0 items-center gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 shrink-0 text-success" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate font-medium",
							children: fileNameFromPath(candidate.resumes[0].resume_path)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "truncate text-xs text-muted-foreground",
						children: candidate.resumes[0].resume_path
					})]
				}) : file ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-lg border border-border/70 bg-muted/40 p-4 text-sm text-muted-foreground",
					children: isUploading ? `Uploading ${file.name}...` : "Upload finished, refreshing profile..."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "No resume has been uploaded yet."
				}) })]
			})
		]
	})] });
}
function InfoRow({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between gap-4 border-b border-border/70 pb-2 text-sm last:border-0 last:pb-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "min-w-0 truncate font-medium",
			children: value
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
function fileNameFromPath(path) {
	return path.split(/[\\/]/).pop() || path;
}
//#endregion
export { UploadPage as component };
