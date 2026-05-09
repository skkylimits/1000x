import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export const contentSchema = z.object({
	title: z.string(),
	description: z.string().optional(),
	icon: z.string().optional(),
	links: z.array(z.object({
		label: z.string(),
		icon: z.string(),
		to: z.string(),
		target: z.string().optional(),
	})).optional(),

	scope: z.enum(['self', 'children']).optional(),
	nav: z.array(z.string()).optional(),
	order: z.number().optional(),
	variants: z.array(z.object({
		id: z.string(),
		label: z.string(),
		icon: z.string(),
	})).optional(),
	schemaVersion: z.number().default(1),
})

export default defineContentConfig({
	collections: {
		landing: defineCollection({
			type: 'page',
			source: 'index.md',
		}),
		docs: defineCollection({
			type: 'page',
			source: {
				include: '**',
				exclude: ['index.md'],
			},
			schema: contentSchema,
		}),
	},
})
