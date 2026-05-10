// @ts-check
import antfu from '@antfu/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
	antfu({
		type: 'app',
		vue: true,
		typescript: true,
		stylistic: {
			indent: 'tab',
			quotes: 'single',
			semi: false,
		},
		ignores: [
			'.nuxt',
			'.output',
			'.data',
			'dist',
			'node_modules',
			'public',
			'**/*.md',
		],
		formatters: {
			css: true,
			html: true,
		},
		rules: {
			'node/prefer-global/process': 'off',
			'no-restricted-globals': 'off',
		},
	}),
)
