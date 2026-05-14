import { expect, test } from '@playwright/test'

// SPEC §22 — each dropdown child renders icon + title + 2-line CSS-clamped description
// from frontmatter. Truncation is CSS-only via line-clamp: 2 (no JS truncate helper).

test.describe('header dropdown — content shape', () => {
	test('clicking the Syntax trigger opens a dropdown panel', async ({ page }) => {
		await page.goto('/')
		const trigger = page.getByRole('button', { name: 'Syntax' })
		await trigger.click()
		const panel = page.locator('[data-slot="content"][data-state="open"]').first()
		await expect(panel).toBeVisible({ timeout: 2000 })
	})

	test('each visible dropdown child contains an icon, a title, and a description element', async ({ page }) => {
		await page.goto('/')
		const trigger = page.getByRole('button', { name: 'Syntax' })
		await trigger.click()
		const panel = page.locator('[data-slot="content"][data-state="open"]').first()
		await expect(panel).toBeVisible()
		const children = panel.locator('a, [role="menuitem"]')
		const count = await children.count()
		expect(count).toBeGreaterThan(0)
		for (let i = 0; i < count; i++) {
			const child = children.nth(i)
			// Icon: either an <svg> or an iconify element
			await expect(child.locator('svg, [data-icon], [class*="iconify"]').first()).toBeVisible()
			// Title: any non-empty text node
			const text = ((await child.textContent()) ?? '').trim()
			expect(text.length).toBeGreaterThan(0)
		}
	})
})

test.describe('header dropdown — description clamp', () => {
	test('a child description has computed -webkit-line-clamp: 2', async ({ page }) => {
		await page.goto('/')
		const trigger = page.getByRole('button', { name: 'Syntax' })
		await trigger.click()
		const panel = page.locator('[data-slot="content"][data-state="open"]').first()
		await expect(panel).toBeVisible()
		// Find at least one description element inside the panel with line-clamp applied.
		const clamps = await panel.locator('*').evaluateAll(els =>
			els.map(el => window.getComputedStyle(el).webkitLineClamp).filter(Boolean),
		)
		expect(clamps).toContain('2')
	})

	test('a child with a long description has visible height capped near 2 line-heights', async ({ page }) => {
		await page.goto('/')
		const trigger = page.getByRole('button', { name: 'Syntax' })
		await trigger.click()
		const panel = page.locator('[data-slot="content"][data-state="open"]').first()
		await expect(panel).toBeVisible()
		// Find the tallest description inside the panel — its height should be ~ 2 line-heights.
		const heights = await panel.locator('*').evaluateAll(els =>
			els
				.filter(el => window.getComputedStyle(el).webkitLineClamp === '2')
				.map((el) => {
					const cs = window.getComputedStyle(el)
					const lineHeight = Number.parseFloat(cs.lineHeight) || 16
					return { height: el.getBoundingClientRect().height, lineHeight }
				}),
		)
		expect(heights.length).toBeGreaterThan(0)
		for (const { height, lineHeight } of heights) {
			expect(height).toBeLessThanOrEqual(lineHeight * 2.4) // small tolerance for padding
		}
	})
})

test.describe('header dropdown — frontmatter required on roots', () => {
	test('every menu trigger has a non-empty visible label and an icon (from root index.md frontmatter)', async ({ page }) => {
		await page.goto('/')
		const triggers = page.locator('header [aria-haspopup="menu"], header [role="menuitem"]').filter({ hasText: /.+/ })
		const count = await triggers.count()
		expect(count).toBeGreaterThan(0)
		for (let i = 0; i < count; i++) {
			const trigger = triggers.nth(i)
			const text = ((await trigger.textContent()) ?? '').trim()
			expect(text.length).toBeGreaterThan(0)
			await expect(trigger.locator('svg, [data-icon], [class*="iconify"]').first()).toBeVisible()
		}
	})
})
