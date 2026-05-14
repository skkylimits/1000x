import { expect, test } from '@playwright/test'

// SPEC §25–26 — The divider under the header runs edge-to-edge (no inset), and the
// active main-menu item's underline LANDS ON that divider (its bottom edge coincides
// with the header's bottom border, not floating above with whitespace).

test.describe('header divider — edge-to-edge', () => {
	test('header bottom border spans the full viewport width at desktop sizes', async ({ page }) => {
		await page.setViewportSize({ width: 1280, height: 800 })
		await page.goto('/')
		const box = await page.locator('header').first().boundingBox()
		expect(box).not.toBeNull()
		expect(Math.round(box!.x)).toBe(0)
		expect(Math.round(box!.x + box!.width)).toBe(1280)
	})

	test('header bottom border still spans the full viewport width at 320px', async ({ page }) => {
		await page.setViewportSize({ width: 320, height: 568 })
		await page.goto('/')
		const box = await page.locator('header').first().boundingBox()
		expect(box).not.toBeNull()
		expect(Math.round(box!.x)).toBe(0)
		expect(Math.round(box!.x + box!.width)).toBe(320)
	})
})

test.describe('header active-state underline — lands on the divider', () => {
	test('the active link carries the .app-header-active marker class', async ({ page }) => {
		await page.goto('/syntax')
		await expect(page.locator('header .app-header-active')).toHaveCount(1)
	})

	test('an inactive trigger does NOT carry .app-header-active', async ({ page }) => {
		await page.goto('/lab')
		const syntaxClass = await page.getByRole('button', { name: 'Syntax' }).getAttribute('class')
		expect(syntaxClass ?? '').not.toContain('app-header-active')
	})

	test('the active link\'s ::after pseudo paints a non-transparent underline', async ({ page }) => {
		await page.goto('/syntax')
		const bg = await page.locator('header .app-header-active').first().evaluate((el) => {
			return window.getComputedStyle(el, '::after').backgroundColor
		})
		// Non-empty, non-transparent. (Nuxt UI bg-primary resolves to an RGB/oklch color.)
		expect(bg).not.toBe('')
		expect(bg).not.toBe('rgba(0, 0, 0, 0)')
		expect(bg).not.toBe('transparent')
	})

	test('the underline\'s bottom edge lands on the header\'s bottom border (at /syntax)', async ({ page }) => {
		await page.goto('/syntax')
		const headerBottom = await page.locator('header').first().evaluate(el => el.getBoundingClientRect().bottom)
		const { afterBottomY } = await page.locator('header .app-header-active').first().evaluate((el) => {
			const linkRect = el.getBoundingClientRect()
			const afterStyle = window.getComputedStyle(el, '::after')
			// CSS `bottom: X` on an absolutely-positioned ::after: the pseudo's bottom edge
			// is X above the parent's bottom. Negative X means BELOW the parent's bottom.
			const cssBottom = Number.parseFloat(afterStyle.bottom) // px (may be negative)
			return { afterBottomY: linkRect.bottom - cssBottom }
		})
		// Allow ±2px tolerance for sub-pixel rounding across font sizes.
		expect(Math.abs(afterBottomY - headerBottom)).toBeLessThanOrEqual(2)
	})

	test('the underline still lands on the divider on a descendant route (/syntax/git)', async ({ page }) => {
		await page.goto('/syntax/git')
		const headerBottom = await page.locator('header').first().evaluate(el => el.getBoundingClientRect().bottom)
		const { afterBottomY } = await page.locator('header .app-header-active').first().evaluate((el) => {
			const linkRect = el.getBoundingClientRect()
			const afterStyle = window.getComputedStyle(el, '::after')
			const cssBottom = Number.parseFloat(afterStyle.bottom)
			return { afterBottomY: linkRect.bottom - cssBottom }
		})
		expect(Math.abs(afterBottomY - headerBottom)).toBeLessThanOrEqual(2)
	})
})
