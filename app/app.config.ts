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
		maxMenuItems: 6,
		links: [] as Array<{ 'icon': string, 'to': string, 'target'?: string, 'aria-label'?: string }>,
	},
	footer: {
		credits: `1000x • © ${new Date().getFullYear()}`,
		colorMode: false,
		links: [] as Array<{ 'icon': string, 'to': string, 'target'?: string, 'aria-label'?: string }>,
	},
	toc: {
		bottom: {
			title: '',
			edit: '',
			links: [],
		},
	},
})
