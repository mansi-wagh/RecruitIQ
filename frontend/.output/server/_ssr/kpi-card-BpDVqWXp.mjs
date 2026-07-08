import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as cn } from "./button-PwNqyxv_.mjs";
import { n as CardContent, t as Card } from "./card-Befnk9fX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/kpi-card-BpDVqWXp.js
var import_jsx_runtime = require_jsx_runtime();
function KpiCard({ label, value, delta, trend = "up", icon: Icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "border-border/60 shadow-[var(--shadow-card)]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs font-medium uppercase tracking-wider text-muted-foreground",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 text-3xl font-semibold tracking-tight",
					children: value
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
				})]
			}), delta ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("mt-3 text-xs font-medium", trend === "up" && "text-success", trend === "down" && "text-destructive", trend === "flat" && "text-muted-foreground"),
				children: delta
			}) : null]
		})
	});
}
//#endregion
export { KpiCard as t };
