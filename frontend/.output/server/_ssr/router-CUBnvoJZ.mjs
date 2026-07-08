import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as ThemeProvider } from "./theme-provider-CaTIQ8r9.mjs";
import { _ as Link, c as HeadContent, f as createRouter, g as createRootRouteWithContext, h as createFileRoute, j as redirect, l as useLocation, m as lazyRouteComponent, p as Outlet, s as Scripts, v as useNavigate, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as Route$22 } from "./hr.candidates._id-CQPAwMM7.mjs";
import { r as Route$23 } from "./login.hr-DQxavBwi.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-CUBnvoJZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-DBelQkBY.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong. You can try again or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$21 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "RecruitIQ — AI-powered recruitment platform" },
			{
				name: "description",
				content: "RecruitIQ is an AI-powered applicant tracking system for modern hiring teams. Screen candidates, manage jobs, and hire faster."
			},
			{
				property: "og:title",
				content: "RecruitIQ — AI-powered recruitment platform"
			},
			{
				property: "og:description",
				content: "AI screening, candidate matching, and hiring workflows for modern teams."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: ""
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$21.useRouteContext();
	const location = useLocation();
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		const token = localStorage.getItem("access_token");
		const isPublic = [
			"/",
			"/login/hr",
			"/login/candidate",
			"/register/hr",
			"/register/candidate"
		].includes(location.pathname);
		if (!token && !isPublic) navigate({ to: "/login/hr" });
	}, [location.pathname, navigate]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ThemeProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, { position: "top-right" })] })
	});
}
var $$splitComponentImporter$18 = () => import("./hr-qoZCgxbX.mjs");
var Route$20 = createFileRoute("/hr")({ component: lazyRouteComponent($$splitComponentImporter$18, "component") });
var $$splitComponentImporter$17 = () => import("./candidate-W0kGSZnY.mjs");
var Route$19 = createFileRoute("/candidate")({ component: lazyRouteComponent($$splitComponentImporter$17, "component") });
var $$splitComponentImporter$16 = () => import("./routes-Cj_sUQ9h.mjs");
var Route$18 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$16, "component") });
var Route$17 = createFileRoute("/hr/")({ beforeLoad: () => {
	throw redirect({ to: "/hr/dashboard" });
} });
var Route$16 = createFileRoute("/candidate/")({ beforeLoad: () => {
	throw redirect({ to: "/candidate/dashboard" });
} });
var $$splitComponentImporter$15 = () => import("./register.hr-Bad6w3eI.mjs");
var Route$15 = createFileRoute("/register/hr")({ component: lazyRouteComponent($$splitComponentImporter$15, "component") });
var $$splitComponentImporter$14 = () => import("./register.candidate-Dl--yMmp.mjs");
var Route$14 = createFileRoute("/register/candidate")({ component: lazyRouteComponent($$splitComponentImporter$14, "component") });
var $$splitComponentImporter$13 = () => import("./login.candidate-BIBMwpiE.mjs");
var Route$13 = createFileRoute("/login/candidate")({ component: lazyRouteComponent($$splitComponentImporter$13, "component") });
var $$splitComponentImporter$12 = () => import("./hr.settings-DHStTrhL.mjs");
var Route$12 = createFileRoute("/hr/settings")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
var $$splitComponentImporter$11 = () => import("./hr.reports-ga0q-JIV.mjs");
var Route$11 = createFileRoute("/hr/reports")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("./hr.jobs-CspMc0s7.mjs");
var Route$10 = createFileRoute("/hr/jobs")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
/** Extract a user-friendly error message from an Axios error. */
var $$splitComponentImporter$9 = () => import("./hr.dashboard-BWCOvy74.mjs");
var Route$9 = createFileRoute("/hr/dashboard")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./hr.candidates-CloJjBfE.mjs");
var Route$8 = createFileRoute("/hr/candidates")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./hr.assistant-Dw1CGV4A.mjs");
var Route$7 = createFileRoute("/hr/assistant")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./hr.ai-analysis-ouHr0Swy.mjs");
var Route$6 = createFileRoute("/hr/ai-analysis")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./candidate.upload-BZ3MfFE4.mjs");
var Route$5 = createFileRoute("/candidate/upload")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./candidate.profile-Bf4bGDc9.mjs");
var Route$4 = createFileRoute("/candidate/profile")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./candidate.jobs-BLBK9t3g.mjs");
var Route$3 = createFileRoute("/candidate/jobs")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./candidate.interview-prep-C7sBRN5D.mjs");
var Route$2 = createFileRoute("/candidate/interview-prep")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./candidate.dashboard-Bo-AI4X0.mjs");
var Route$1 = createFileRoute("/candidate/dashboard")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./candidate.applications-DtXIaUnD.mjs");
var Route = createFileRoute("/candidate/applications")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var HrRoute = Route$20.update({
	id: "/hr",
	path: "/hr",
	getParentRoute: () => Route$21
});
var CandidateRoute = Route$19.update({
	id: "/candidate",
	path: "/candidate",
	getParentRoute: () => Route$21
});
var IndexRoute = Route$18.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$21
});
var HrIndexRoute = Route$17.update({
	id: "/",
	path: "/",
	getParentRoute: () => HrRoute
});
var CandidateIndexRoute = Route$16.update({
	id: "/",
	path: "/",
	getParentRoute: () => CandidateRoute
});
var RegisterHrRoute = Route$15.update({
	id: "/register/hr",
	path: "/register/hr",
	getParentRoute: () => Route$21
});
var RegisterCandidateRoute = Route$14.update({
	id: "/register/candidate",
	path: "/register/candidate",
	getParentRoute: () => Route$21
});
var LoginHrRoute = Route$23.update({
	id: "/login/hr",
	path: "/login/hr",
	getParentRoute: () => Route$21
});
var LoginCandidateRoute = Route$13.update({
	id: "/login/candidate",
	path: "/login/candidate",
	getParentRoute: () => Route$21
});
var HrSettingsRoute = Route$12.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => HrRoute
});
var HrReportsRoute = Route$11.update({
	id: "/reports",
	path: "/reports",
	getParentRoute: () => HrRoute
});
var HrJobsRoute = Route$10.update({
	id: "/jobs",
	path: "/jobs",
	getParentRoute: () => HrRoute
});
var HrDashboardRoute = Route$9.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => HrRoute
});
var HrCandidatesRoute = Route$8.update({
	id: "/candidates",
	path: "/candidates",
	getParentRoute: () => HrRoute
});
var HrAssistantRoute = Route$7.update({
	id: "/assistant",
	path: "/assistant",
	getParentRoute: () => HrRoute
});
var HrAiAnalysisRoute = Route$6.update({
	id: "/ai-analysis",
	path: "/ai-analysis",
	getParentRoute: () => HrRoute
});
var CandidateUploadRoute = Route$5.update({
	id: "/upload",
	path: "/upload",
	getParentRoute: () => CandidateRoute
});
var CandidateProfileRoute = Route$4.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => CandidateRoute
});
var CandidateJobsRoute = Route$3.update({
	id: "/jobs",
	path: "/jobs",
	getParentRoute: () => CandidateRoute
});
var CandidateInterviewPrepRoute = Route$2.update({
	id: "/interview-prep",
	path: "/interview-prep",
	getParentRoute: () => CandidateRoute
});
var CandidateDashboardRoute = Route$1.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => CandidateRoute
});
var CandidateApplicationsRoute = Route.update({
	id: "/applications",
	path: "/applications",
	getParentRoute: () => CandidateRoute
});
var HrCandidatesIdRoute = Route$22.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => HrCandidatesRoute
});
var CandidateRouteChildren = {
	CandidateApplicationsRoute,
	CandidateDashboardRoute,
	CandidateInterviewPrepRoute,
	CandidateJobsRoute,
	CandidateProfileRoute,
	CandidateUploadRoute,
	CandidateIndexRoute
};
var CandidateRouteWithChildren = CandidateRoute._addFileChildren(CandidateRouteChildren);
var HrCandidatesRouteChildren = { HrCandidatesIdRoute };
var HrRouteChildren = {
	HrAiAnalysisRoute,
	HrAssistantRoute,
	HrCandidatesRoute: HrCandidatesRoute._addFileChildren(HrCandidatesRouteChildren),
	HrDashboardRoute,
	HrJobsRoute,
	HrReportsRoute,
	HrSettingsRoute,
	HrIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	CandidateRoute: CandidateRouteWithChildren,
	HrRoute: HrRoute._addFileChildren(HrRouteChildren),
	LoginCandidateRoute,
	LoginHrRoute,
	RegisterCandidateRoute,
	RegisterHrRoute
};
var routeTree = Route$21._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
