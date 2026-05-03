// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2026-05-03',
	devtools: { enabled: true },

	modules: [
		'@nuxt/eslint',
		'@nuxt/content',
		'@nuxt/ui',
		'@nuxt/icon',
		'@nuxtjs/i18n',
		'@vite-pwa/nuxt',
	],

	css: ['~/assets/css/main.css'],

	// Auto-import components without folder-prefix so <AppHeader />, <PageActionBar />
	// resolve regardless of whether they live in app/components/layout/ or /page/.
	components: [
		{ path: '~/components', pathPrefix: false },
	],

	// i18n — NL default, EN secundair
	i18n: {
		defaultLocale: 'nl',
		locales: [
			{ code: 'nl', language: 'nl-NL', file: 'nl.json', name: 'Nederlands' },
			{ code: 'en', language: 'en-US', file: 'en.json', name: 'English' },
		],
		strategy: 'no_prefix',
		detectBrowserLanguage: false,
	},

	// Iconen lokaal gebundeld; nooit runtime-call naar Iconify CDN
	icon: {
		serverBundle: 'local',
		customCollections: [
			{ prefix: 'kh', dir: './app/components/icons' },
		],
	},

	// Nuxt Content — collection-config zit in content.config.ts
	content: {
		build: {
			markdown: {
				toc: { depth: 3, searchDepth: 3 },
				highlight: {
					theme: { default: 'github-light', dark: 'github-dark' },
				},
			},
		},
	},

	// PWA — registreer alvast, configuratie verfijnen we in Phase 5
	pwa: {
		registerType: 'autoUpdate',
		manifest: {
			name: '1000x',
			short_name: '1000x',
			lang: 'nl',
			theme_color: '#0a0a0a',
		},
		workbox: {
			globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2}'],
		},
	},

	// ESLint module — laat antfu de stylistische source-of-truth zijn
	eslint: {
		config: {
			standalone: false,
			stylistic: false,
		},
	},

	// Niet voor publiek of zoekmachines — zie spec feature 18
	routeRules: {
		'/**': { headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
	},

	app: {
		head: {
			meta: [
				{ name: 'robots', content: 'noindex, nofollow' },
			],
		},
	},
})
