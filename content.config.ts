import { defineCollection, defineContentConfig } from '@nuxt/content'
import { contentSchema } from './content.schema'

export default defineContentConfig({
	collections: {
		content: defineCollection({
			type: 'page',
			source: '**/*.md',
			schema: contentSchema,
		}),
	},
})
