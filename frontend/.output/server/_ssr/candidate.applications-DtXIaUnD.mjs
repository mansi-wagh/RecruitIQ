import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-PwNqyxv_.mjs";
import { a as PageHeader } from "./portal-shell-Bqe4KT1I.mjs";
import { n as CardContent, t as Card } from "./card-Befnk9fX.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-BcaWptOW.mjs";
import { n as StatusBadge } from "./status-badge-Bx4ODNfC.mjs";
import { t as applications } from "./mock-data-WtXK140Y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/candidate.applications-DtXIaUnD.js
var import_jsx_runtime = require_jsx_runtime();
function ApplicationsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Applications",
		description: "Track the status of every role you've applied to."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "border-border/60 shadow-[var(--shadow-card)]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
			className: "p-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
				className: "hover:bg-transparent",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Role" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Company" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Match" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Applied" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Action"
					})
				]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: applications.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "font-medium",
					children: a.jobTitle
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "text-sm text-muted-foreground",
					children: a.company
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
					className: "text-sm",
					children: [a.matchScore, "%"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "text-sm text-muted-foreground",
					children: a.appliedAt
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: a.status }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "text-right",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						children: "View"
					})
				})
			] }, a.id)) })] })
		})
	})] });
}
//#endregion
export { ApplicationsPage as component };
