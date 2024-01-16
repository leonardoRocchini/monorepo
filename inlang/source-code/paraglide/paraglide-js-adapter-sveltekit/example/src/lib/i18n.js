import { createI18n } from "@inlang/paraglide-js-adapter-sveltekit"
import * as runtime from "$paraglide/runtime.js"

export const i18n = createI18n(runtime, {
	exclude: (url) => url.pathname.startsWith("/base/not-translated"),
	pathnames: {
		"/about": {
			en: "/about",
			de: "/ueber-uns",
			fr: "/a-propos",
		},
		"/users": {
			en: "/users",
			de: "/benutzer",
			fr: "/utilisateurs",
		},
		"/users/[id]": {
			en: "/users/[id]",
			de: "/benutzer/[id]",
			fr: "/utilisateurs/[id]",
		},
		"/users/[id]/edit": {
			en: "/users/[id]/edit",
			de: "/benutzer/[id]/bearbeiten",
			fr: "/utilisateurs/[id]/modifier",
		},
		"/some-subpage": {
			en: "/some-subpage",
			de: "/irgendeine-unterseite",
			fr: "/quelque-sous-page",
		},
	},
})