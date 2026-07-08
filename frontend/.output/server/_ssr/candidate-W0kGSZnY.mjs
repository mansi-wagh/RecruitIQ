import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { S as GraduationCap, T as FileText, a as Upload, l as Sparkles, r as User, x as LayoutDashboard } from "../_libs/lucide-react.mjs";
import { _ as Link, p as Outlet, u as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as SidebarContent, d as SidebarGroupContent, f as SidebarGroupLabel, g as SidebarMenuItem, h as SidebarMenuButton, l as SidebarFooter, m as SidebarMenu, o as PortalShell, p as SidebarHeader, s as Sidebar, u as SidebarGroup } from "./portal-shell-Bqe4KT1I.mjs";
import { t as recruitiq_logo_default } from "./recruitiq-logo-B-NZ3_b2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/candidate-W0kGSZnY.js
var import_jsx_runtime = require_jsx_runtime();
var items = [
	{
		title: "Dashboard",
		url: "/candidate/dashboard",
		icon: LayoutDashboard
	},
	{
		title: "Upload Resume",
		url: "/candidate/upload",
		icon: Upload
	},
	{
		title: "Recommended Jobs",
		url: "/candidate/jobs",
		icon: Sparkles
	},
	{
		title: "Applications",
		url: "/candidate/applications",
		icon: FileText
	},
	{
		title: "Interview Prep",
		url: "/candidate/interview-prep",
		icon: GraduationCap
	},
	{
		title: "Profile",
		url: "/candidate/profile",
		icon: User
	}
];
function AppSidebarCandidate() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sidebar, {
		collapsible: "icon",
		className: "border-r border-border/70",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarHeader, {
				className: "border-b border-border/70",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/candidate/dashboard",
					className: "flex items-center gap-2 px-2 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm group-data-[collapsible=icon]:grid hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-bold",
							children: "R"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: recruitiq_logo_default,
						alt: "RecruitIQ",
						className: "h-7 w-auto group-data-[collapsible=icon]:hidden"
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SidebarGroup, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarGroupLabel, { children: "Your career" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarGroupContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarMenu, { children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarMenuItem, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarMenuButton, {
				asChild: true,
				isActive: pathname === item.url,
				tooltip: item.title,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: item.url,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.title })]
				})
			}) }, item.url)) }) })] }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarFooter, {
				className: "border-t border-border/70",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-2 py-2 text-[11px] text-muted-foreground group-data-[collapsible=icon]:hidden",
					children: "v1.0 · © RecruitIQ"
				})
			})
		]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalShell, {
	sidebar: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppSidebarCandidate, {}),
	userName: "Jordan Lee",
	userInitials: "JL",
	userRole: "Candidate",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
});
//#endregion
export { SplitComponent as component };
