globalThis.__nitro_main__ = import.meta.url;
import { a as FastResponse, n as HTTPError, r as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { t as HookableCore } from "./_libs/hookable.mjs";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/assets/avatar-PgBCsZ8n.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"aca-7T3dmUf7aGgPRydeJxTgiFnKOBg\"",
		"mtime": "2026-07-07T13:00:32.772Z",
		"size": 2762,
		"path": "../public/assets/avatar-PgBCsZ8n.js"
	},
	"/assets/badge-7T0Zd-Me.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2de-qLZ6mDaPy2jsAIxkglSh5eZFJSc\"",
		"mtime": "2026-07-07T13:00:32.780Z",
		"size": 734,
		"path": "../public/assets/badge-7T0Zd-Me.js"
	},
	"/assets/bot-4wRKl_G4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13e-BqN7F33M4rGTKbU/cx2cJHiLTOQ\"",
		"mtime": "2026-07-07T13:00:32.787Z",
		"size": 318,
		"path": "../public/assets/bot-4wRKl_G4.js"
	},
	"/assets/briefcase-Dh6QTgsm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d2-0Cy3LFB3R1Y/fKxP6HrgOl4nj8M\"",
		"mtime": "2026-07-07T13:00:32.796Z",
		"size": 210,
		"path": "../public/assets/briefcase-Dh6QTgsm.js"
	},
	"/assets/candidate.applications-DM--B2qX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"59f-soHWcfZ74Jq1HCMnzki7IoPkjw4\"",
		"mtime": "2026-07-07T13:00:32.843Z",
		"size": 1439,
		"path": "../public/assets/candidate.applications-DM--B2qX.js"
	},
	"/assets/button-fk5JW_W0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b0f2-T1z1CEASlaqS/O/Ub0TYc54WB1g\"",
		"mtime": "2026-07-07T13:00:32.803Z",
		"size": 45298,
		"path": "../public/assets/button-fk5JW_W0.js"
	},
	"/assets/BarChart-DzoWDc8p.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"58d45-kCQM41mRjp64DucC6C0dpm1iPxU\"",
		"mtime": "2026-07-07T13:00:32.745Z",
		"size": 363845,
		"path": "../public/assets/BarChart-DzoWDc8p.js"
	},
	"/assets/candidate.interview-prep-eBwYmUOd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ca2-atqPyAgiOMCnFwwp5spZ/DZNz+g\"",
		"mtime": "2026-07-07T13:00:32.859Z",
		"size": 3234,
		"path": "../public/assets/candidate.interview-prep-eBwYmUOd.js"
	},
	"/assets/candidate.jobs-Dhor7uI5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"118c-NMZTojzezYPfUr25sw558O8q/E0\"",
		"mtime": "2026-07-07T13:00:32.869Z",
		"size": 4492,
		"path": "../public/assets/candidate.jobs-Dhor7uI5.js"
	},
	"/assets/candidate.dashboard-FPM-Hmlj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"20fb-cCKHpQBlB+OL3DAUJumFLzL0fnQ\"",
		"mtime": "2026-07-07T13:00:32.851Z",
		"size": 8443,
		"path": "../public/assets/candidate.dashboard-FPM-Hmlj.js"
	},
	"/assets/candidate-kP4JDTmm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8b4-JLlWNwlT8Ow/d9MZaJYyBnDkr1k\"",
		"mtime": "2026-07-07T13:00:32.833Z",
		"size": 2228,
		"path": "../public/assets/candidate-kP4JDTmm.js"
	},
	"/assets/candidate.profile-C5s3lyB1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"118a-p/8/BuXbFt7hHo5R0NhUJK2scKo\"",
		"mtime": "2026-07-07T13:00:32.876Z",
		"size": 4490,
		"path": "../public/assets/candidate.profile-C5s3lyB1.js"
	},
	"/assets/candidate.upload-CDjFKcSL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"15f3-Zj+aiQkfJJaxNa7ZsLhnK6IDbGw\"",
		"mtime": "2026-07-07T13:00:32.884Z",
		"size": 5619,
		"path": "../public/assets/candidate.upload-CDjFKcSL.js"
	},
	"/assets/card-_JuA7Lzv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3f1-nwwFaIlmTO4Ty915t0djlkKwXRU\"",
		"mtime": "2026-07-07T13:00:32.893Z",
		"size": 1009,
		"path": "../public/assets/card-_JuA7Lzv.js"
	},
	"/assets/circle-check-Cz6uQc3B.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a8-kWeDY2rkE49ELznGGmeXe3VNPg4\"",
		"mtime": "2026-07-07T13:00:32.902Z",
		"size": 168,
		"path": "../public/assets/circle-check-Cz6uQc3B.js"
	},
	"/assets/dist-BkGzowyq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"415-8RLFWedm2gLfEyIjd2rwScs/77g\"",
		"mtime": "2026-07-07T13:00:32.918Z",
		"size": 1045,
		"path": "../public/assets/dist-BkGzowyq.js"
	},
	"/assets/dist-CxLZmvtd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"20f-Qe9CMSe/JVPx0T5yFKue/+eDcnM\"",
		"mtime": "2026-07-07T13:00:32.949Z",
		"size": 527,
		"path": "../public/assets/dist-CxLZmvtd.js"
	},
	"/assets/dist-Cy-S2WJ8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fc-VHOVqe5kmrbJOCyA1j2/uieUpj8\"",
		"mtime": "2026-07-07T13:00:32.955Z",
		"size": 252,
		"path": "../public/assets/dist-Cy-S2WJ8.js"
	},
	"/assets/dist-CYfZNI6E.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7e-hj0UqcWq/JYo/nsMfshu7tslr+w\"",
		"mtime": "2026-07-07T13:00:32.938Z",
		"size": 126,
		"path": "../public/assets/dist-CYfZNI6E.js"
	},
	"/assets/dist-xd7tPDVo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10a6-QKWxvuaPFIPifSZIQwq1Mpeobww\"",
		"mtime": "2026-07-07T13:00:32.961Z",
		"size": 4262,
		"path": "../public/assets/dist-xd7tPDVo.js"
	},
	"/assets/file-text-D79biC-Z.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"177-HZUpSjCABJ+62uZPjW4Ug2MEI6Q\"",
		"mtime": "2026-07-07T13:00:32.984Z",
		"size": 375,
		"path": "../public/assets/file-text-D79biC-Z.js"
	},
	"/assets/hr-BPgged20.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b05-nXES5PqaPlB+snb/bMf8OI0GqzA\"",
		"mtime": "2026-07-07T13:00:32.993Z",
		"size": 2821,
		"path": "../public/assets/hr-BPgged20.js"
	},
	"/assets/hr.assistant-DrY2Z60T.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"143b-xg4TyL7pgkjWcGtjagIyMy3wChg\"",
		"mtime": "2026-07-07T13:00:33.014Z",
		"size": 5179,
		"path": "../public/assets/hr.assistant-DrY2Z60T.js"
	},
	"/assets/hr.candidates-DWtYEsVn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"19e4-iz8qDrpGVj8huC3wG1iENBDr8ao\"",
		"mtime": "2026-07-07T13:00:33.021Z",
		"size": 6628,
		"path": "../public/assets/hr.candidates-DWtYEsVn.js"
	},
	"/assets/hr.ai-analysis-DTGXyNyx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c14-pPT72+pwQLT/fqFpQaFg8yI5v7E\"",
		"mtime": "2026-07-07T13:00:33.002Z",
		"size": 7188,
		"path": "../public/assets/hr.ai-analysis-DTGXyNyx.js"
	},
	"/assets/hr.candidates._id-QebWdb02.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"133f-l2Nbyf8K4CU9BcxMPU1/Eel493E\"",
		"mtime": "2026-07-07T13:00:33.035Z",
		"size": 4927,
		"path": "../public/assets/hr.candidates._id-QebWdb02.js"
	},
	"/assets/hr.jobs-nuHDbH3_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"38b5-YdJ/18uTqCNLW5O4hcjRjt5BB2k\"",
		"mtime": "2026-07-07T13:00:33.052Z",
		"size": 14517,
		"path": "../public/assets/hr.jobs-nuHDbH3_.js"
	},
	"/assets/hr.dashboard-CQDaz3-O.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1614-Xy9ShbtBRNI44GztmtXZDW5WAl4\"",
		"mtime": "2026-07-07T13:00:33.044Z",
		"size": 5652,
		"path": "../public/assets/hr.dashboard-CQDaz3-O.js"
	},
	"/assets/hr.reports-Dc1dB41w.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b6b5-Ltzv9TZWkIm6DnFjPnpczP5sm7Y\"",
		"mtime": "2026-07-07T13:00:33.062Z",
		"size": 46773,
		"path": "../public/assets/hr.reports-Dc1dB41w.js"
	},
	"/assets/hr.settings-FkJGySz9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2f22-FpVarzB25mFoSMrh+k6Y1Tn+ICs\"",
		"mtime": "2026-07-07T13:00:33.092Z",
		"size": 12066,
		"path": "../public/assets/hr.settings-FkJGySz9.js"
	},
	"/assets/layout-dashboard-D1F3DQzG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"217-GqyASyDYnYoCTxqZoW2pxZyA1fE\"",
		"mtime": "2026-07-07T13:00:33.106Z",
		"size": 535,
		"path": "../public/assets/layout-dashboard-D1F3DQzG.js"
	},
	"/assets/kpi-card-CAmirLjQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"40e-iOme6d238eceYp0AHQdvAS/uCYE\"",
		"mtime": "2026-07-07T13:00:33.099Z",
		"size": 1038,
		"path": "../public/assets/kpi-card-CAmirLjQ.js"
	},
	"/assets/link-YWy9dBSo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"58d9-OhT4xeOkoLXcMDjDuKJLrLcgpvY\"",
		"mtime": "2026-07-07T13:00:33.112Z",
		"size": 22745,
		"path": "../public/assets/link-YWy9dBSo.js"
	},
	"/assets/index-fJ9SrOru.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"63291-fGKkgsFfGUQsa39km+i9/bZXop0\"",
		"mtime": "2026-07-07T13:00:32.635Z",
		"size": 406161,
		"path": "../public/assets/index-fJ9SrOru.js"
	},
	"/assets/loader-circle-C6BcXyMc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"86-QtQ2HmbT/wQEcXXRHi8Yl4H7QQ4\"",
		"mtime": "2026-07-07T13:00:33.142Z",
		"size": 134,
		"path": "../public/assets/loader-circle-C6BcXyMc.js"
	},
	"/assets/login.candidate-CJa656BA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ba-TRR07qTZe88NjRp1/U96VdssqcI\"",
		"mtime": "2026-07-07T13:00:33.149Z",
		"size": 442,
		"path": "../public/assets/login.candidate-CJa656BA.js"
	},
	"/assets/login.hr-mkeqidCQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c91-KRDADOn6nIppOW+IrPMVOePmVEk\"",
		"mtime": "2026-07-07T13:00:33.155Z",
		"size": 7313,
		"path": "../public/assets/login.hr-mkeqidCQ.js"
	},
	"/assets/mock-data-CREDSfoa.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b9a-KIkL1vH/OpJdErs47jb2vBFrQk4\"",
		"mtime": "2026-07-07T13:00:33.169Z",
		"size": 2970,
		"path": "../public/assets/mock-data-CREDSfoa.js"
	},
	"/assets/map-pin-BMXks-Te.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f9-JhBrfhnhTQoc/SVDnQ6HVDedjdo\"",
		"mtime": "2026-07-07T13:00:33.163Z",
		"size": 249,
		"path": "../public/assets/map-pin-BMXks-Te.js"
	},
	"/assets/plus-CdQN9e0m.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8f-158J8iHDCdUJywEsiTL54HFaDQs\"",
		"mtime": "2026-07-07T13:00:33.177Z",
		"size": 143,
		"path": "../public/assets/plus-CdQN9e0m.js"
	},
	"/assets/portal-shell-B8dfcx-Q.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"19dad-LX8qJTJtaJdFMsb64fIF+gxx9w8\"",
		"mtime": "2026-07-07T13:00:33.182Z",
		"size": 105901,
		"path": "../public/assets/portal-shell-B8dfcx-Q.js"
	},
	"/assets/recruitiq-logo-DMwNSf54.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3b-y4Y/kThifRdi3fmjV3mOg1uLAd4\"",
		"mtime": "2026-07-07T13:00:33.193Z",
		"size": 59,
		"path": "../public/assets/recruitiq-logo-DMwNSf54.js"
	},
	"/assets/register.candidate-Cr3_a6vj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"15b8-cC5RRye7B9hkU+e+qCHzLs89JR4\"",
		"mtime": "2026-07-07T13:00:33.199Z",
		"size": 5560,
		"path": "../public/assets/register.candidate-Cr3_a6vj.js"
	},
	"/assets/register.hr-fHZ7yWT7.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13b2-6Ny/IdvtHdvU/2zm1erakmjbwv4\"",
		"mtime": "2026-07-07T13:00:33.205Z",
		"size": 5042,
		"path": "../public/assets/register.hr-fHZ7yWT7.js"
	},
	"/assets/routes-Cc3JOM5b.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"cd1-fkC4iO7kljpTvjU49Q56EsucDLE\"",
		"mtime": "2026-07-07T13:00:33.213Z",
		"size": 3281,
		"path": "../public/assets/routes-Cc3JOM5b.js"
	},
	"/assets/shield-check-CurZ0rFW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"136-Nw7K9ZduG82omQFojRwIM5HHzio\"",
		"mtime": "2026-07-07T13:00:33.231Z",
		"size": 310,
		"path": "../public/assets/shield-check-CurZ0rFW.js"
	},
	"/assets/select-BuP2Bpk1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5503-jr8GFOhHa2grSX7xRB44wGZzk7g\"",
		"mtime": "2026-07-07T13:00:33.222Z",
		"size": 21763,
		"path": "../public/assets/select-BuP2Bpk1.js"
	},
	"/assets/recruitiq-logo-KB31DFOG.png": {
		"type": "image/png",
		"etag": "\"2a0d8-UZletfaXC7+rv41cRiJB/OzjI2Y\"",
		"mtime": "2026-07-07T13:00:33.303Z",
		"size": 172248,
		"path": "../public/assets/recruitiq-logo-KB31DFOG.png"
	},
	"/assets/sparkles-F9TyA93d.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e4-l+69O6KzxaRTAubUajDrEPIiwCQ\"",
		"mtime": "2026-07-07T13:00:33.237Z",
		"size": 484,
		"path": "../public/assets/sparkles-F9TyA93d.js"
	},
	"/assets/status-badge-BKt_VdxS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"492-9u4xckYI/ZmRnr2RmHF1BD7G6z4\"",
		"mtime": "2026-07-07T13:00:33.244Z",
		"size": 1170,
		"path": "../public/assets/status-badge-BKt_VdxS.js"
	},
	"/assets/styles-DBelQkBY.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"150bc-3VWMu6uqbB24oogmlX1qtn4RgF4\"",
		"mtime": "2026-07-07T13:00:33.305Z",
		"size": 86204,
		"path": "../public/assets/styles-DBelQkBY.css"
	},
	"/assets/table-C5hoB7_e.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"641-9I1QOjVgqiD5r7DEoXJx/ujyRE4\"",
		"mtime": "2026-07-07T13:00:33.251Z",
		"size": 1601,
		"path": "../public/assets/table-C5hoB7_e.js"
	},
	"/assets/theme-toggle-BduZ94qE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"450-0flYCZGH9Zse/Wkmv5ZTtFoS3Bg\"",
		"mtime": "2026-07-07T13:00:33.270Z",
		"size": 1104,
		"path": "../public/assets/theme-toggle-BduZ94qE.js"
	},
	"/assets/target-B3AS3pi4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c1-/q1fOdStnoc2/kwm8zdUNKbyYYA\"",
		"mtime": "2026-07-07T13:00:33.257Z",
		"size": 449,
		"path": "../public/assets/target-B3AS3pi4.js"
	},
	"/assets/textarea-Do2n9w19.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1dc-04/rZd3CFVi3GNnkHl5ErdSlliQ\"",
		"mtime": "2026-07-07T13:00:33.264Z",
		"size": 476,
		"path": "../public/assets/textarea-Do2n9w19.js"
	},
	"/assets/useMatch-DJDFL0de.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4a1-DBCd0oLDTi1VwygmhIXnuKC8CnQ\"",
		"mtime": "2026-07-07T13:00:33.283Z",
		"size": 1185,
		"path": "../public/assets/useMatch-DJDFL0de.js"
	},
	"/assets/upload-DC5W7HoF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dc-XNDH1zNf6H1k2B5BOhdJ6nX2/6Y\"",
		"mtime": "2026-07-07T13:00:33.277Z",
		"size": 220,
		"path": "../public/assets/upload-DC5W7HoF.js"
	},
	"/assets/user-DseVD-4X.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ba-NPB1yUxX+sOcwPr4JrmwicOrOos\"",
		"mtime": "2026-07-07T13:00:33.290Z",
		"size": 186,
		"path": "../public/assets/user-DseVD-4X.js"
	},
	"/assets/users-DH1TNQKL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"128-k4mGGFgEAzZIHsTvmQnZB6WEt6M\"",
		"mtime": "2026-07-07T13:00:33.297Z",
		"size": 296,
		"path": "../public/assets/users-DH1TNQKL.js"
	}
};
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_vPFGh6 = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_vPFGh6
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
[].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs
function createHandler(hooks) {
	const nitroApp = useNitroApp();
	const nitroHooks = useNitroHooks();
	return {
		async fetch(request, env, context) {
			globalThis.__env__ = env;
			augmentReq(request, {
				env,
				context
			});
			const ctxExt = {};
			const url = new URL(request.url);
			if (hooks.fetch) {
				const res = await hooks.fetch(request, env, context, url, ctxExt);
				if (res) return res;
			}
			return await nitroApp.fetch(request);
		},
		scheduled(controller, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
				controller,
				env,
				context
			}) || Promise.resolve());
		},
		email(message, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:email", {
				message,
				event: message,
				env,
				context
			}) || Promise.resolve());
		},
		queue(batch, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
				batch,
				event: batch,
				env,
				context
			}) || Promise.resolve());
		},
		tail(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
				traces,
				env,
				context
			}) || Promise.resolve());
		},
		trace(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
				traces,
				env,
				context
			}) || Promise.resolve());
		}
	};
}
function augmentReq(cfReq, ctx) {
	const req = cfReq;
	req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
	req.runtime ??= { name: "cloudflare" };
	req.runtime.cloudflare = {
		...req.runtime.cloudflare,
		...ctx
	};
	req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/cloudflare-module.mjs
var cloudflare_module_default = createHandler({ fetch(cfRequest, env, context, url) {
	if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfRequest);
} });
//#endregion
export { cloudflare_module_default as default };
