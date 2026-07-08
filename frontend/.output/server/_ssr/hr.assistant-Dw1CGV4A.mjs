import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as cn, t as Button } from "./button-PwNqyxv_.mjs";
import { B as Bot, T as FileText, f as Send, l as Sparkles, r as User } from "../_libs/lucide-react.mjs";
import { a as PageHeader } from "./portal-shell-Bqe4KT1I.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-Befnk9fX.mjs";
import { t as Textarea } from "./textarea-DjqHhWkA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hr.assistant-Dw1CGV4A.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var suggestions = [
	"What is the interview policy?",
	"What technologies are required for backend roles?",
	"Explain probation policy.",
	"Is Docker mandatory?"
];
function AssistantPage() {
	const [messages, setMessages] = (0, import_react.useState)([{
		id: "m1",
		role: "assistant",
		text: "Hi Alex 👋 I'm your RecruitIQ assistant. Ask about hiring policies, role requirements, or candidate insights."
	}]);
	const [input, setInput] = (0, import_react.useState)("");
	const [typing, setTyping] = (0, import_react.useState)(false);
	const scrollRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		scrollRef.current?.scrollTo({
			top: scrollRef.current.scrollHeight,
			behavior: "smooth"
		});
	}, [messages, typing]);
	const send = (text) => {
		if (!text.trim()) return;
		const user = {
			id: crypto.randomUUID(),
			role: "user",
			text
		};
		setMessages((m) => [...m, user]);
		setInput("");
		setTyping(true);
		setTimeout(() => {
			setMessages((m) => [...m, {
				id: crypto.randomUUID(),
				role: "assistant",
				text: "Based on your company handbook, technical roles follow a 4-stage interview: recruiter screen, technical, system design and hiring manager. Docker and cloud (AWS or GCP) proficiency is recommended for backend positions."
			}]);
			setTyping(false);
		}, 900);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "HR Assistant",
		description: "Ask questions about policies, roles, or hiring workflows."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 lg:grid-cols-[1fr_320px]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "flex h-[calc(100vh-14rem)] flex-col border-border/60 shadow-[var(--shadow-card)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				ref: scrollRef,
				className: "flex-1 space-y-6 overflow-y-auto p-6",
				children: [messages.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cn("flex gap-3", m.role === "user" && "flex-row-reverse"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("grid h-8 w-8 shrink-0 place-items-center rounded-full", m.role === "user" ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"),
						children: m.role === "user" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "h-4 w-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed", m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"),
						children: m.text
					})]
				}, m.id)), typing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "h-4 w-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1 rounded-2xl bg-muted px-4 py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dot, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dot, { delay: "150ms" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dot, { delay: "300ms" })
						]
					})]
				}) : null]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t border-border/70 p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-3 flex flex-wrap gap-2",
					children: suggestions.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => send(s),
						className: "rounded-full border border-border/70 bg-background px-3 py-1 text-xs text-muted-foreground transition hover:border-primary/40 hover:bg-primary/5 hover:text-foreground",
						children: s
					}, s))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: (e) => {
						e.preventDefault();
						send(input);
					},
					className: "flex items-end gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: input,
						onChange: (e) => setInput(e.target.value),
						onKeyDown: (e) => {
							if (e.key === "Enter" && !e.shiftKey) {
								e.preventDefault();
								send(input);
							}
						},
						placeholder: "Ask about hiring, policies, or a candidate…",
						className: "min-h-[44px] resize-none rounded-xl",
						rows: 1
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						size: "icon",
						className: "h-11 w-11 shrink-0 rounded-xl",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" })
					})]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-border/60 shadow-[var(--shadow-card)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "pb-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "flex items-center gap-2 text-sm font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-primary" }), " Prompt suggestions"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "space-y-2",
					children: suggestions.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => send(s),
						className: "w-full rounded-lg border border-border/70 p-3 text-left text-sm transition hover:border-primary/40 hover:bg-primary/5",
						children: s
					}, s))
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-border/60 shadow-[var(--shadow-card)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "pb-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "flex items-center gap-2 text-sm font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 text-primary" }), " Sources"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "space-y-2 text-sm",
					children: [
						"Employee handbook v3.2",
						"Interview policy — 2025",
						"Backend role profile"
					].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border/70 p-2.5 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium",
							children: s
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-muted-foreground",
							children: "Cited in last response"
						})]
					}, s))
				})]
			})]
		})]
	})] });
}
function Dot({ delay = "0ms" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground/60",
		style: { animationDelay: delay }
	});
}
//#endregion
export { AssistantPage as component };
