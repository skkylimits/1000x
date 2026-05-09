// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: [
		'@nuxt/eslint',
		'@nuxt/image',
		'@nuxt/ui',
		'@nuxt/content',
		'@nuxtjs/i18n',
		'nuxt-og-image',
		'nuxt-llms',
		'@nuxtjs/mcp-toolkit',
	],

	devtools: {
		enabled: true,
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

	i18n: {
		defaultLocale: 'nl',
		locales: [
			{ code: 'nl', language: 'nl-NL', file: 'nl.json', name: 'Nederlands' },
			{ code: 'en', language: 'en-US', file: 'en.json', name: 'English' },
		],
		strategy: 'no_prefix',
		detectBrowserLanguage: false,
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

	eslint: {
		config: {
			standalone: false,
		},
	},

	icon: {
		provider: 'iconify',
	},

	llms: {
		domain: 'https://1000x.local/',
		title: '1000x',
		description: 'Bedrijfsbreed second-brain dat documentatiesite, wiki en interactief leersysteem combineert.',
		full: {
			title: '1000x — Full Documentation',
			description: 'Volledige documentatie voor het 1000x second-brain.',
		},
		sections: [
			{
				title: 'Getting Started',
				contentCollection: 'docs',
				contentFilters: [
					{ field: 'path', operator: 'LIKE', value: '/getting-started%' },
				],
			},
			{
				title: 'Essentials',
				contentCollection: 'docs',
				contentFilters: [
					{ field: 'path', operator: 'LIKE', value: '/essentials%' },
				],
			},
		],
	},

	mcp: {
		name: '1000x',
	},
})
