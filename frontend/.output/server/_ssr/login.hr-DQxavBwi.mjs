import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-PwNqyxv_.mjs";
import { t as Input } from "./input-uzm9g8Y7.mjs";
import { R as Building2, S as GraduationCap } from "../_libs/lucide-react.mjs";
import { _ as Link, h as createFileRoute, m as lazyRouteComponent, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as axios } from "../_libs/axios+[...].mjs";
import { t as api } from "./api-BmP1cRwt.mjs";
import { t as Label } from "./label-BeT0bXvu.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Checkbox } from "./checkbox-Th7i6qaL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login.hr-DQxavBwi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var $$splitComponentImporter = () => import("./login.hr-jO2EsnpU.mjs");
var Route = createFileRoute("/login/hr")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
function AuthLayout({ title, subtitle, illustration, redirectTo, ctaLabel, footerText, footerLinkLabel, footerLinkTo, registerTo = "/register/hr" }) {
	const navigate = useNavigate();
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const onSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const token = (await api.post("/auth/login", {
				email,
				password
			})).data.access_token;
			if (!token) {
				toast.error("No token received from server");
				return;
			}
			localStorage.setItem("access_token", token);
			let user;
			try {
				user = (await api.get("/auth/me")).data;
			} catch {
				localStorage.removeItem("access_token");
				toast.error("Login succeeded but failed to load user profile");
				return;
			}
			if (user.role === "candidate") {
				toast.error("This account is a candidate account.");
				localStorage.removeItem("access_token");
				return;
			}
			localStorage.setItem("user", JSON.stringify(user));
			toast.success("Login successful");
			navigate({ to: redirectTo });
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const detail = error.response?.data?.detail;
				toast.error(typeof detail === "string" ? detail : error.response?.data?.message ?? "Login failed");
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
						children: title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1.5 text-sm text-muted-foreground",
						children: subtitle
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit,
						className: "mt-8 space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "email",
									children: "Work email"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "email",
									type: "email",
									placeholder: "Enter your email",
									value: email,
									onChange: (e) => setEmail(e.target.value),
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "password",
										children: "Password"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "text-xs font-medium text-primary hover:underline",
										children: "Forgot password?"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "password",
									type: "password",
									placeholder: "Enter your password",
									value: password,
									onChange: (e) => setPassword(e.target.value),
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2 text-sm text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, { defaultChecked: true }), " Remember me for 30 days"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								className: "w-full",
								disabled: loading,
								children: loading ? "Signing in…" : ctaLabel
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 text-center text-sm text-muted-foreground",
						children: [
							footerText,
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: footerLinkTo,
								className: "font-medium text-primary hover:underline",
								children: footerLinkLabel
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 text-center text-sm text-muted-foreground",
						children: [
							"Don't have an account?",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: registerTo,
								className: "font-medium text-primary hover:underline",
								children: "Create account"
							})
						]
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative hidden overflow-hidden bg-accent lg:block",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[radial-gradient(60%_50%_at_80%_0%,rgba(37,99,235,0.35),transparent_60%)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative flex h-full items-center justify-center p-12",
				children: illustration
			})]
		})]
	});
}
function CandidateIllustration() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "w-full max-w-md text-accent-foreground",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-10 w-10 place-items-center rounded-full bg-primary/20 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-medium",
						children: "Your resume score"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-white/60",
						children: "Updated 2 minutes ago"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "ml-auto text-2xl font-semibold",
						children: "86"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 space-y-3",
				children: [
					{
						title: "Senior Product Designer",
						company: "Linear",
						match: 91
					},
					{
						title: "Frontend Engineer",
						company: "Stripe",
						match: 84
					},
					{
						title: "Design Systems Lead",
						company: "Notion",
						match: 96
					}
				].map((j) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-8 w-8 place-items-center rounded-md bg-white/10",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate text-sm font-medium",
								children: j.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-white/60",
								children: j.company
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-full bg-primary/20 px-2 py-0.5 text-xs font-semibold text-primary",
							children: [j.match, "%"]
						})
					]
				}, j.title))
			})]
		})
	});
}
//#endregion
export { CandidateIllustration as n, Route as r, AuthLayout as t };
