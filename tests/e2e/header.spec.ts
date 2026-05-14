import fs from 'node:fs/promises'
import path from 'node:path'
import { expect, test } from '@playwright/test'

// SPEC §10, §29, §30 — Consolidated header suite:
//   1. Data-driven main menu (fixture file dropped into content/ appears in dropdown).
//   2. Direct-link vs dropdown rule per child count.
//   3. Keyboard nav (Tab / Enter / Arrows / Escape).
//   4. Axe-core accessibility scan on the header region (zero critical violations).
//
// Tests written from TDD/02-TEMPLATE/03-header/steps/05-e2e-suite/test-prompt.md.

test.describe('header — top-level presence', () => {
	test('renders logo, ≥1 nav trigger, and exactly 5 right-zone buttons at /', async ({ page }) => {
		await page.goto('/')
		const header = page.locator('header').first()
		await expect(header).toBeVisible()
		// Logo: any link to "/" inside the header
		await expect(header.locator('a[href="/"]').first()).toBeVisible()
		// Nav triggers: any element with role=menuitem or aria-haspopup
		const triggerCount = await header.locator('[data-navigation-menu-trigger], [role="menuitem"], a[href^="/lab"], a[href^="/syntax"], a[href^="/kb"]').count()
		expect(triggerCount).toBeGreaterThanOrEqual(1)
		// Right-zone: 5 buttons by aria-label patterns
		const labels = await header.locator('[aria-label]').evaluateAll(els =>
			els.map(el => el.getAttribute('aria-label') || '')
				.filter(l => /search|zoek|ai|taal|language|theme|color|kleur|dark|light|mode|settings|instellingen/i.test(l)),
		)
		expect(labels).toHaveLength(5)
	})
})

test.describe('header — multi-child root rule', () => {
	test('multi-child root (Syntax) renders chevron, opens dropdown with ≥2 children, click navigates', async ({ page }) => {
		await page.goto('/')
		const syntax = page.getByRole('button', { name: 'Syntax' })
		await expect(syntax).toBeVisible()
		// Chevron is rendered as a trailing icon inside the trigger
		await expect(syntax.locator('[data-slot="linkTrailingIcon"]')).toBeVisible()
		await syntax.click()
		const panel = page.locator('[data-slot="content"][data-state="open"]').first()
		await expect(panel).toBeVisible({ timeout: 2000 })
		const childLinks = panel.locator('a')
		const childCount = await childLinks.count()
		expect(childCount).toBeGreaterThanOrEqual(2)
		const firstChild = childLinks.first()
		const href = await firstChild.getAttribute('href')
		expect(href).toMatch(/^\/syntax\//)
		await firstChild.click()
		await expect(page).toHaveURL(new RegExp(href!.replace(/\//g, '\\/')))
	})
})

test.describe.skip('header — data-driven smoke (skipped: HMR-based fixture writes crash Nuxt Content SQLite)', () => {
	const fixturePath = path.resolve('content/2.syntax/_test-smoke.md')
	const fixtureContent = `---
title: Test Smoke
icon: i-lucide-flask-conical
description: Fixture file for header smoke test — proves the data-driven menu picks up new content without code edits.
---

# Test Smoke

Fixture body.
`

	test.beforeAll(async () => {
		await fs.writeFile(fixturePath, fixtureContent, 'utf8')
	})

	test.afterAll(async () => {
		await fs.rm(fixturePath, { force: true })
	})

	test('a new .md file in content/2.syntax/ appears in the Syntax dropdown without code edits', async ({ page }) => {
		await page.goto('/')
		const syntax = page.locator('header').locator('text=/^Syntax$/i').first()
		await syntax.click()
		const panel = page.locator('[data-slot="content"][data-state="open"]').first()
		await expect(panel).toBeVisible({ timeout: 3000 })
		await expect(panel.locator('text=/Test Smoke/i')).toBeVisible({ timeout: 3000 })
	})
})

test.describe('header — keyboard navigation (WCAG 2.1 AA)', () => {
	test('Tab → Enter opens a dropdown trigger', async ({ page }) => {
		await page.goto('/')
		// Focus the first multi-child trigger
		await page.evaluate(() => {
			const trigger = Array.from(document.querySelectorAll<HTMLElement>('header [data-navigation-menu-trigger]'))[0]
			trigger?.focus()
		})
		await page.keyboard.press('Enter')
		await expect(page.locator('[data-slot="content"][data-state="open"]').first()).toBeVisible({ timeout: 2000 })
	})

	test('ArrowDown / ArrowUp cycle focus inside an open dropdown', async ({ page }) => {
		await page.goto('/')
		await page.evaluate(() => {
			const trigger = Array.from(document.querySelectorAll<HTMLElement>('header [data-navigation-menu-trigger]'))[0]
			trigger?.focus()
		})
		await page.keyboard.press('Enter')
		await page.keyboard.press('ArrowDown')
		const first = await page.evaluate(() => (document.activeElement as HTMLElement)?.textContent?.trim() ?? '')
		await page.keyboard.press('ArrowDown')
		const second = await page.evaluate(() => (document.activeElement as HTMLElement)?.textContent?.trim() ?? '')
		expect(second).not.toBe(first)
		await page.keyboard.press('ArrowUp')
		const back = await page.evaluate(() => (document.activeElement as HTMLElement)?.textContent?.trim() ?? '')
		expect(back).toBe(first)
	})

	test('Escape closes an open dropdown and returns focus to the trigger', async ({ page }) => {
		await page.goto('/')
		await page.evaluate(() => {
			const trigger = Array.from(document.querySelectorAll<HTMLElement>('header [data-navigation-menu-trigger]'))[0]
			trigger?.focus()
		})
		await page.keyboard.press('Enter')
		const panel = page.locator('[data-slot="content"][data-state="open"]').first()
		await expect(panel).toBeVisible()
		await page.keyboard.press('Escape')
		await expect(panel).toBeHidden({ timeout: 1000 })
		const tag = await page.evaluate(() => (document.activeElement as HTMLElement)?.getAttribute('aria-haspopup'))
		expect(tag).toBe('menu')
	})
})

test.describe('header — accessibility (axe-core)', () => {
	// Requires @axe-core/playwright. Step 5 build session installs the dep:
	//   pnpm add -D @axe-core/playwright
	// Un-fixme once the dep is installed.
	test.fixme('header region has zero critical axe-core violations', async ({ page }) => {
		await page.goto('/')
		// @ts-expect-error — dep installed by Step 5 build session
		const { default: AxeBuilder } = await import('@axe-core/playwright')
		const results = await new AxeBuilder({ page }).include('header').analyze()
		const critical = results.violations.filter((v: { impact: string | null }) => v.impact === 'critical')
		expect(critical).toEqual([])
	})
})
