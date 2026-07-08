import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-PwNqyxv_.mjs";
import { t as Input } from "./input-uzm9g8Y7.mjs";
import { l as Sparkles, n as Users, u as ShieldCheck } from "../_libs/lucide-react.mjs";
import { _ as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as axios } from "../_libs/axios+[...].mjs";
import { t as api } from "./api-BmP1cRwt.mjs";
import { t as Label } from "./label-BeT0bXvu.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/register.hr-Bad6w3eI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function HRRegisterPage() {
	const navigate = useNavigate();
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [confirmPassword, setConfirmPassword] = (0, import_react.useState)("");
	const [errors, setErrors] = (0, import_react.useState)({});
	const validate = () => {
		const errs = {};
		if (!name.trim()) errs.name = "Full name is required";
		if (!email.trim()) errs.email = "Email is required";
		if (!password) errs.password = "Password is required";
		else if (password.length < 6) errs.password = "Password must be at least 6 characters";
		if (password !== confirmPassword) errs.confirmPassword = "Passwords do not match";
		setErrors(errs);
		return Object.keys(errs).length === 0;
	};
	const onSubmit = async (e) => {
		e.preventDefault();
		if (!validate()) return;
		setLoading(true);
		try {
			await api.post("/auth/register", {
				name: name.trim(),
				email: email.trim(),
				password,
				role: "hr"
			});
			toast.success("Account created! Please sign in.");
			navigate({ to: "/login/hr" });
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const detail = error.response?.data?.detail;
				if (Array.isArray(detail)) {
					const fieldErrors = {};
					for (const err of detail) {
						const field = err.loc?.[1] ?? "general";
						fieldErrors[field] = err.msg;
					}
					setErrors(fieldErrors);
					toast.error("Please fix the validation errors");
				} else if (typeof detail === "string") toast.error(detail);
				else toast.error(error.response?.data?.message ?? "Registration failed");
			} else toast.error("Something went wrong");
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background lg:grid lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex min-h-screen items-center justify-center px-6 py-12 lg:min-h-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "mb-10 flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-bold",
								children: "R"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-base font-semibold tracking-tight",
							children: "RecruitIQ"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-semibold tracking-tight",
						children: "Create your account"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1.5 text-sm text-muted-foreground",
						children: "Set up your RecruitIQ HR workspace in seconds."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit,
						className: "mt-8 space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "name",
										children: "Full name"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "name",
										type: "text",
										placeholder: "Jane Smith",
										value: name,
										onChange: (e) => setName(e.target.value),
										required: true
									}),
									errors.name && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-destructive",
										children: errors.name
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "email",
										children: "Work email"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "email",
										type: "email",
										placeholder: "you@company.com",
										value: email,
										onChange: (e) => setEmail(e.target.value),
										required: true
									}),
									errors.email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-destructive",
										children: errors.email
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "password",
										children: "Password"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "password",
										type: "password",
										placeholder: "Create a password",
										value: password,
										onChange: (e) => setPassword(e.target.value),
										required: true
									}),
									errors.password && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-destructive",
										children: errors.password
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "confirmPassword",
										children: "Confirm password"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "confirmPassword",
										type: "password",
										placeholder: "Confirm your password",
										value: confirmPassword,
										onChange: (e) => setConfirmPassword(e.target.value),
										required: true
									}),
									errors.confirmPassword && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-destructive",
										children: errors.confirmPassword
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								className: "w-full",
								disabled: loading,
								children: loading ? "Creating account…" : "Create account"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 text-center text-sm text-muted-foreground",
						children: [
							"Already have an account?",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/login/hr",
								className: "font-medium text-primary hover:underline",
								children: "Sign in"
							})
						]
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative hidden overflow-hidden bg-accent lg:block",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[radial-gradient(60%_50%_at_80%_0%,rgba(37,99,235,0.35),transparent_60%)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative flex h-full items-center justify-center p-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-full max-w-md text-accent-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-lg font-semibold",
								children: "Why RecruitIQ?"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-white/60",
								children: "AI-powered hiring for modern teams. Screen faster, hire smarter."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-5 space-y-3",
								children: [
									{
										icon: Users,
										label: "Manage 1,000+ candidates effortlessly"
									},
									{
										icon: Sparkles,
										label: "AI-powered resume screening"
									},
									{
										icon: ShieldCheck,
										label: "Enterprise-grade security"
									}
								].map(({ icon: Icon, label }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm text-white/80",
										children: label
									})]
								}, label))
							})
						]
					})
				})
			})]
		})]
	});
}
//#endregion
export { HRRegisterPage as component };
