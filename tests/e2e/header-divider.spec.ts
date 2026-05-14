import { expect, test } from '@playwright/test'

// SPEC §25–26 — The divider under the header runs edge-to-edge (no inset), and the
// active main-menu item's underline LANDS ON that divider (bottom edges coincide,
// not floating above).

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
	test('at /syntax, the Syntax trigger\'s active indicator bottom Y matches the header bottom Y', async ({ page }) => {
		await page.goto('/syntax')
		const headerBox = await page.locator('header').first().boundingBox()
		const activeTrigger = page.locator('header .app-header-active').first()
		await expect(activeTrigger).toBeVisible()
		const triggerBox = await activeTrigger.boundingBox()
		expect(headerBox).not.toBeNull()
		expect(triggerBox).not.toBeNull()
		const headerBottom = headerBox!.y + headerBox!.height
		const indicatorBottom = triggerBox!.y + triggerBox!.height
		expect(Math.abs(headerBottom - indicatorBottom)).toBeLessThanOrEqual(1)
	})

	test('at /syntax/git, the Syntax trigger still highlights and lands on the divider', async ({ page }) => {
		await page.goto('/syntax/git')
		const headerBox = await page.locator('header').first().boundingBox()
		const activeTrigger = page.locator('header .app-header-active').first()
		await expect(activeTrigger).toBeVisible()
		const triggerBox = await activeTrigger.boundingBox()
		expect(headerBox).not.toBeNull()
		expect(triggerBox).not.toBeNull()
		const headerBottom = headerBox!.y + headerBox!.height
		const indicatorBottom = triggerBox!.y + triggerBox!.height
		expect(Math.abs(headerBottom - indicatorBottom)).toBeLessThanOrEqual(1)
	})

	test('the active-indicator pseudo on .app-header-active sits at bottom: -1px', async ({ page }) => {
		await page.goto('/syntax')
		// The active link has class .app-header-active; its ::after pseudo provides the underline at bottom: -1px.
		const afterBottom = await page.locator('header .app-header-active').first().evaluate((el) => {
			return window.getComputedStyle(el, '::after').bottom
		})
		expect(afterBottom).toBe('-1px')
	})

	test('an inactive trigger has no .app-header-active class', async ({ page }) => {
		await page.goto('/lab')
		// On /lab, only the Lab trigger should be active. Syntax and KB are not.
		const syntaxClass = await page.getByRole('button', { name: 'Syntax' }).getAttribute('class')
		expect(syntaxClass ?? '').not.toContain('app-header-active')
	})
})
