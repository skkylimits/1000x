// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: [
		'@nuxt/eslint',
		'@nuxt/image',
		'@nuxt/ui',
		'@nuxt/content',
		'nuxt-og-image',
		'nuxt-llms',
		'@nuxtjs/mcp-toolkit',
		'@nuxtjs/i18n',
	],

	devtools: {
		enabled: true,
	},

	app: {
		head: {
			meta: [
				{ name: 'robots', content: 'noindex, nofollow' },
			],
		},
	},

	css: ['~/assets/css/main.css'],

	content: {
		build: {
			markdown: {
				toc: {
					searchDepth: 1,
				},
			},
		},
	},

	routeRules: {
		'/**': {
			headers: { 'X-Robots-Tag': 'noindex, nofollow' },
		},
	},

	experimental: {
		asyncContext: true,
	},

	compatibilityDate: '2024-07-11',

	nitro: {
		prerender: {
			routes: [
				'/',
			],
			crawlLinks: true,
			autoSubfolderIndex: false,
		},
	},

	eslint: {
		config: {
			// antfu owns plugin registration; Nuxt's auto-config defers
			standalone: false,
		},
	},

	i18n: {
		defaultLocale: 'nl',
		locales: [
			{ code: 'nl', language: 'nl-NL', file: 'nl.json', name: 'Nederlands', flag: 'circle-flags:nl' },
			{ code: 'en', language: 'en-US', file: 'en.json', name: 'English', flag: 'circle-flags:gb' },
		],
		strategy: 'no_prefix',
		detectBrowserLanguage: false,
	},

	icon: {
		provider: 'iconify',
	},

	llms: {
		domain: 'https://1000x.example.com/',
		title: '1000x',
		description: 'Bedrijfsbreed second-brain — documentatiesite, wiki en interactief leersysteem.',
		full: {
			title: '1000x — Full Documentation',
			description: 'Volledige documentatie voor het 1000x second-brain platform.',
		},
		sections: [],
	},

	mcp: {
		name: '1000x',
	},
})
