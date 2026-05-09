export default defineAppConfig({
	ui: {
		colors: {
			primary: 'red',
			neutral: 'mist',
		},
		footer: {
			slots: {
				root: 'border-t border-default',
				left: 'text-sm text-muted',
			},
		},
	},
	seo: {
		siteName: '1000x',
	},
	header: {
		title: '',
		to: '/',
		logo: {
			alt: '',
			light: '',
			dark: '',
		},
		search: true,
		colorMode: true,
		links: [] as Array<{ 'icon': string, 'to': string, 'target'?: string, 'aria-label'?: string }>,
	},
	footer: {
		credits: `© ${new Date().getFullYear()} 1000x`,
		colorMode: false,
		links: [] as Array<{ 'icon': string, 'to': string, 'target'?: string, 'aria-label'?: string }>,
	},
	toc: {
		title: 'Table of Contents',
		bottom: {
			title: 'Community',
			edit: '',
			links: [],
		},
	},
})
