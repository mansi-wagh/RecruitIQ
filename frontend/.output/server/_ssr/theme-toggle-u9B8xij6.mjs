import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-PwNqyxv_.mjs";
import { n as useTheme } from "./theme-provider-CaTIQ8r9.mjs";
import { c as Sun, g as Moon } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/theme-toggle-u9B8xij6.js
var import_jsx_runtime = require_jsx_runtime();
function ThemeToggle({ className }) {
	const { theme, toggle } = useTheme();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		variant: "ghost",
		size: "icon",
		onClick: toggle,
		className: `rounded-full ${className ?? ""}`,
		"aria-label": theme === "dark" ? "Switch to light mode" : "Switch to dark mode",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" })]
	});
}
//#endregion
export { ThemeToggle as t };
