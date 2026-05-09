import { expect, test } from '@playwright/test'

// Component contract under test — see TDD/template/02-sidebar-replacement/SPEC.md § Step 2
// and TDD/template/02-sidebar-replacement/steps/02-sidebar-ui/prompt.md.
//
// Until Step 1 + Step 2 implementations and the demo-content frontmatter prep all land,
// every active test in this file is expected to fail (red). That is intentional.

test.describe('section sidebar — scope-bound rendering', () => {
	test('renders a single <nav> inside the left aside', async ({ page }) => {
		await page.goto('/getting-started/installation')
		const navs = page.locator('aside nav')
		await expect(navs).toHaveCount(1)
	})

	test('the first row inside <nav> is the scope-label (non-button, with icon + title)', async ({ page }) => {
		await page.goto('/getting-started/installation')
		const nav = page.locator('aside nav')

		// the scope-label is the first direct row and is NOT a <button>
		const firstRow = nav.locator('> *').first()
		await expect(firstRow).not.toHaveAttribute('type', 'button')
		await expect(firstRow.locator('button')).toHaveCount(0)

		// it contains both an icon (Iconify renders <span class="iconify...">, an <svg>,
		// or an element with data-icon) and visible text — the scope title.
		const icon = firstRow.locator('svg, [class*=iconify], [data-icon]').first()
		await expect(icon).toBeVisible()
		await expect(firstRow).toContainText(/\S+/)
	})

	test('the scope-label icon comes from the directory index.md frontmatter', async ({ page }) => {
		await page.goto('/getting-started/installation')
		const icon = page.locator('aside nav').locator('svg, [class*=iconify], [data-icon]').first()
		await expect(icon).toBeVisible()
	})

	test('navigating between top-level directories swaps the sidebar contents', async ({ page }) => {
		await page.goto('/getting-started/installation')
		const before = await page.locator('aside nav').textContent()
		await page.goto('/essentials/markdown-syntax')
		const after = await page.locator('aside nav').textContent()
		expect(before).not.toEqual(after)
	})

	test('navigating to a third top-level directory swaps the sidebar contents again', async ({ page }) => {
		await page.goto('/essentials/markdown-syntax')
		const before = await page.locator('aside nav').textContent()
		await page.goto('/ai/llms')
		const after = await page.locator('aside nav').textContent()
		expect(before).not.toEqual(after)
	})
})

test.describe('section sidebar — active page indicator', () => {
	test('the active page link has aria-current="page"', async ({ page }) => {
		await page.goto('/getting-started/installation')
		const active = page.locator('aside nav [aria-current="page"]')
		await expect(active).toHaveCount(1)
		await expect(active).toContainText(/installation/i)
	})

	test('only one link is marked as the active page', async ({ page }) => {
		await page.goto('/essentials/markdown-syntax')
		await expect(page.locator('aside nav [aria-current="page"]')).toHaveCount(1)
	})

	test('navigating to another page in the same scope moves the aria-current marker', async ({ page }) => {
		await page.goto('/getting-started/installation')
		await expect(page.locator('aside nav [aria-current="page"]')).toContainText(/installation/i)

		await page.locator('aside nav a', { hasText: /usage/i }).click()
		await expect(page).toHaveURL(/\/getting-started\/usage$/)
		await expect(page.locator('aside nav [aria-current="page"]')).toContainText(/usage/i)
	})

	test('the active page link has the info-coloured border-left class while siblings do not', async ({ page }) => {
		await page.goto('/getting-started/installation')

		// Contract: active link border swaps to --ui-primary; inactive borders stay muted.
		const active = page.locator('aside nav [aria-current="page"]')
		await expect(active).toHaveClass(/border-\(--ui-primary\)|border-primary/)

		// At least one inactive sibling page-link must NOT carry the primary border class.
		const inactiveSiblings = page.locator('aside nav a').filter({ hasNot: page.locator('[aria-current="page"]') })
		const inactiveCount = await inactiveSiblings.count()
		expect(inactiveCount).toBeGreaterThan(0)
		const firstInactiveClass = await inactiveSiblings.first().getAttribute('class')
		expect(firstInactiveClass ?? '').not.toMatch(/border-\(--ui-primary\)|border-primary/)
	})
})

test.describe('section sidebar — page leaves are NuxtLink anchors with border-l', () => {
	test('every page in the current scope renders as an <a> with a border-l class', async ({ page }) => {
		await page.goto('/essentials/markdown-syntax')
		const pageLinks = page.locator('aside nav a')
		const count = await pageLinks.count()
		expect(count).toBeGreaterThan(0)

		for (let i = 0; i < count; i++) {
			const cls = await pageLinks.nth(i).getAttribute('class')
			expect(cls ?? '').toMatch(/(^|\s)border-l(\s|$)/)
		}
	})
})

test.describe('section sidebar — orphan pages container', () => {
	test('a scope without nested chapters renders its pages in a single indented container', async ({ page }) => {
		await page.goto('/essentials/markdown-syntax')

		const pageLinks = page.locator('aside nav a').filter({
			hasText: /^(markdown syntax|code blocks|prose components|images.*embeds)$/i,
		})
		await expect(pageLinks).toHaveCount(4)

		// All page-links must share the same direct parent — i.e. the single indented container
		// (orphan pages live "as if there is an invisible default chapter").
		const handles = await pageLinks.elementHandles()
		const parentIds = await Promise.all(
			handles.map(h => h.evaluate(el => (el.parentElement as HTMLElement | null)?.outerHTML.slice(0, 80) ?? '')),
		)
		const uniqueParents = new Set(parentIds)
		expect(uniqueParents.size).toBe(1)
	})
})

test.describe('section sidebar — chapters (deferred until demo content has nested chapters)', () => {
	// The current demo content under content/{1.getting-started, 2.essentials, 3.ai} has no
	// nested chapter directories — every top-level scope contains only leaf pages. The chapter
	// contract (button[type=button] + aria-expanded + chevron rotation + multi-expand) cannot be
	// exercised against this content. Un-fixme these once content with nested chapters lands.

	test.fixme('chapters render as <button type="button"> with aria-expanded', async ({ page }) => {
		await page.goto('/')
		const chapterButtons = page.locator('aside nav button[type="button"][aria-expanded]')
		const count = await chapterButtons.count()
		expect(count).toBeGreaterThan(0)
	})

	test.fixme('chapters default to expanded (aria-expanded="true") on first render', async ({ page }) => {
		await page.goto('/')
		const firstChapter = page.locator('aside nav button[type="button"][aria-expanded]').first()
		await expect(firstChapter).toHaveAttribute('aria-expanded', 'true')
	})

	test.fixme('chapter row contains an icon, a title, and a lucide:chevron-right that rotates on expand', async ({ page }) => {
		await page.goto('/')
		const firstChapter = page.locator('aside nav button[type="button"][aria-expanded]').first()
		const chevron = firstChapter.locator('[class*=chevron-right], [data-icon*=chevron-right]').first()
		await expect(chevron).toBeVisible()
		// rotate-90 class is applied on the chevron when expanded (default state)
		await expect(chevron).toHaveClass(/rotate-90/)
	})

	test.fixme('clicking a chapter button toggles aria-expanded and child page visibility', async ({ page }) => {
		await page.goto('/')
		const chapter = page.locator('aside nav button[type="button"][aria-expanded]').first()
		await chapter.click()
		await expect(chapter).toHaveAttribute('aria-expanded', 'false')
		await chapter.click()
		await expect(chapter).toHaveAttribute('aria-expanded', 'true')
	})

	test.fixme('multiple chapters can be expanded simultaneously (no accordion-mode)', async ({ page }) => {
		await page.goto('/')
		const chapters = page.locator('aside nav button[type="button"][aria-expanded]')
		const count = await chapters.count()
		expect(count).toBeGreaterThanOrEqual(2)

		for (let i = 0; i < count; i++)
			await expect(chapters.nth(i)).toHaveAttribute('aria-expanded', 'true')

		// Click a second chapter — the first must stay expanded.
		await chapters.nth(1).click()
		await expect(chapters.nth(0)).toHaveAttribute('aria-expanded', 'true')
	})

	test.fixme('orphan pages and chapter children share the same indented container styling', async ({ page }) => {
		// Content with both orphan pages AND chapters under one scope is required to test this.
		await page.goto('/')
	})
})

test.describe('auto-sidebar fully replaced', () => {
	test('the page renders only our scope-bound <nav> inside <aside>, not the docs-template auto-sidebar', async ({ page }) => {
		await page.goto('/')
		const navs = page.locator('aside nav')
		await expect(navs).toHaveCount(1)

		// Heuristic: the scope-bound sidebar shows only the current scope's children, a small
		// finite count. The docs-template's UContentNavigation lists every route in the site,
		// which would blow well past this bound for the demo content.
		const linkCount = await page.locator('aside nav a').count()
		expect(linkCount).toBeLessThan(15)
	})
})
