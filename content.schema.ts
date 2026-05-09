import { z } from '@nuxt/content'

export const contentSchema = z.object({
	title: z.string(),
	description: z.string().optional(),
	icon: z.string().optional(),
	// Sidebar scope: feature 19
	scope: z.enum(['self', 'children']).optional(),
	// Didactische volgorde voor hoofdstukken: feature 19
	nav: z.array(z.string()).optional(),
	order: z.number().optional(),
	// Variant-tabs: feature 8
	variants: z.array(z.object({
		id: z.string(),
		label: z.string(),
		icon: z.string(),
	})).optional(),
	// Forward compat: feature 1
	schemaVersion: z.number().default(1),
})
