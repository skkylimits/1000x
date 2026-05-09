import { describe, expect, it } from 'vitest'
import { contentSchema } from '../../content.schema'

describe('content schema', () => {
	it('accepts a minimal valid frontmatter object', () => {
		const result = contentSchema.safeParse({
			title: 'Welkom bij 1000x',
			description: 'Documentatie- en leersysteem',
			schemaVersion: 1,
		})
		expect(result.success).toBe(true)
	})

	it('makes description optional', () => {
		const result = contentSchema.safeParse({ title: 'Een pagina', schemaVersion: 1 })
		expect(result.success).toBe(true)
	})

	it('defaults schemaVersion to 1 when missing', () => {
		const result = contentSchema.safeParse({ title: 'Een pagina' })
		expect(result.success).toBe(true)
		if (result.success)
			expect(result.data.schemaVersion).toBe(1)
	})

	it('rejects when title is missing', () => {
		const result = contentSchema.safeParse({ description: 'Geen titel' })
		expect(result.success).toBe(false)
	})

	it('rejects when title is not a string', () => {
		const result = contentSchema.safeParse({ title: 42 })
		expect(result.success).toBe(false)
	})

	it('silently strips unknown fields (zod default behavior)', () => {
		const result = contentSchema.safeParse({
			title: 'Een pagina',
			experimental: true,
		})
		expect(result.success).toBe(true)
		if (result.success)
			expect((result.data as Record<string, unknown>).experimental).toBeUndefined()
	})

	it('accepts the optional schema fields used by features 2 / 8 / 19', () => {
		const result = contentSchema.safeParse({
			title: 'Een hoofdstuk',
			icon: 'lucide:book-open',
			scope: 'children',
			nav: ['intro', 'basis', 'gevorderd'],
			order: 3,
			variants: [{ id: 'nl', label: 'Nederlands', icon: 'lucide:flag' }],
		})
		expect(result.success).toBe(true)
	})

	it('rejects scope values that are not in the enum', () => {
		const result = contentSchema.safeParse({ title: 'X', scope: 'invalid' })
		expect(result.success).toBe(false)
	})
})
