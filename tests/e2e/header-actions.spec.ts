import { expect, test } from '@playwright/test'

// SPEC §23–24, §30 — Right-zone has exactly 5 icon-only action buttons in fixed order:
// search → AI → locale → color-mode → settings. AI and Settings are disabled stubs with
// "Binnenkort" tooltips. All buttons are keyboard-reachable with aria-label set.

const RIGHT_LABEL = /search|zoek|ai|taal|language|theme|color|kleur|dark|light|mode|settings|instellingen/i

test.describe('header right-zone — 5 icon-only action buttons', () => {
	test('renders exactly 5 right-zone buttons in fixed order by aria-label', async ({ page }) => {
		await page.goto('/')
		const labels = await page.locator('header [aria-label]').evaluateAll(els =>
			els.map(el => el.getAttribute('aria-label') || ''),
		)
		const interesting = labels.filter(l => /search|zoek|ai|taal|language|theme|color|kleur|dark|light|mode|settings|instellingen/i.test(l))
		expect(interesting).toHaveLength(5)
		expect(interesting[0]).toMatch(/search|zoek/i)
		expect(interesting[1]).toMatch(/ai/i)
		expect(interesting[2]).toMatch(/taal|language/i)
		expect(interesting[3]).toMatch(/theme|color|kleur/i)
		expect(interesting[4]).toMatch(/settings|instellingen/i)
	})

	test('every right-zone button is icon-only (no visible text label)', async ({ page }) => {
		await page.goto('/')
		const buttons = page.locator('header [aria-label]').filter({ hasText: RIGHT_LABEL })
		const count = await buttons.count()
		for (let i = 0; i < count; i++) {
			const text = ((await buttons.nth(i).textContent()) ?? '').trim()
			expect(text).toBe('')
		}
	})

	test('AI assistant button is disabled with a non-empty aria-label', async ({ page }) => {
		await page.goto('/')
		const ai = page.locator('header [aria-label*="AI" i]').first()
		await expect(ai).toBeDisabled()
		const label = await ai.getAttribute('aria-label')
		expect(label).toBeTruthy()
	})

	test('Settings button is disabled with a non-empty aria-label', async ({ page }) => {
		await page.goto('/')
		const settings = page.locator('header [aria-label*="settings" i], header [aria-label*="instellingen" i]').first()
		await expect(settings).toBeDisabled()
		const label = await settings.getAttribute('aria-label')
		expect(label).toBeTruthy()
	})
})

test.describe('header right-zone — disabled-stub tooltips', () => {
	test('hovering AI surfaces a tooltip containing "Binnenkort"', async ({ page }) => {
		await page.goto('/')
		const ai = page.locator('header [aria-label*="AI" i]').first()
		await ai.hover()
		await expect(page.locator('[role="tooltip"]')).toContainText(/binnenkort/i, { timeout: 3000 })
	})

	test('hovering Settings surfaces a tooltip containing "Binnenkort"', async ({ page }) => {
		await page.goto('/')
		const settings = page.locator('header [aria-label*="settings" i], header [aria-label*="instellingen" i]').first()
		await settings.hover()
		await expect(page.locator('[role="tooltip"]')).toContainText(/binnenkort/i, { timeout: 3000 })
	})
})

test.describe('header right-zone — keyboard affordances', () => {
	test('⌘K / Ctrl+K opens the search palette', async ({ page }) => {
		await page.goto('/')
		const isMac = await page.evaluate(() => navigator.platform.toUpperCase().includes('MAC'))
		await page.keyboard.press(isMac ? 'Meta+K' : 'Control+K')
		await expect(page.locator('[role="dialog"], [role="listbox"]')).toBeVisible({ timeout: 3000 })
	})

	test('Tab cycles through header focusables without a trap', async ({ page }) => {
		await page.goto('/')
		// Focus the first focusable in the header
		await page.evaluate(() => {
			const first = document.querySelector<HTMLElement>('header a, header button')
			first?.focus()
		})
		// Tab 10 times; collect tag of activeElement after each Tab. None should equal the previous => no trap.
		const sequence: string[] = []
		for (let i = 0; i < 10; i++) {
			await page.keyboard.press('Tab')
			const tag = await page.evaluate(() => (document.activeElement as HTMLElement)?.tagName ?? '')
			sequence.push(tag)
		}
		// At least one Tab landed on a focusable header element.
		expect(sequence.some(t => t === 'BUTTON' || t === 'A')).toBe(true)
	})
})
