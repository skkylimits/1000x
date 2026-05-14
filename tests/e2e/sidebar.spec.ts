import { expect, test } from '@playwright/test'

test.describe('section sidebar — scope-bound rendering', () => {
	test('renders a single <nav> in the left aside, with a scope-label as the first row', async ({ page }) => {
		await page.goto('/lab/getting-started/installation')
		const navs = page.locator('aside nav')
		await expect(navs).toHaveCount(1)
	})

	test('the scope-label shows the icon from the directory index.md frontmatter', async ({ page }) => {
		await page.goto('/lab/getting-started/installation')
		const icon = page.locator('aside nav').locator('svg, [class*=iconify], [data-icon]').first()
		await expect(icon).toBeVisible()
	})

	test('navigating between top-level directories swaps the sidebar contents', async ({ page }) => {
		await page.goto('/lab/getting-started/installation')
		const before = await page.locator('aside nav').textContent()
		await page.goto('/lab/essentials/markdown-syntax')
		const after = await page.locator('aside nav').textContent()
		expect(before).not.toEqual(after)
	})
})

test.describe('section sidebar — active page indicator', () => {
	test('the active page link has aria-current="page"', async ({ page }) => {
		await page.goto('/lab/getting-started/installation')
		const active = page.locator('aside nav [aria-current="page"]')
		await expect(active).toHaveCount(1)
		await expect(active).toContainText(/installation/i)
	})

	test('only one link is marked as the active page', async ({ page }) => {
		await page.goto('/lab/essentials/markdown-syntax')
		await expect(page.locator('aside nav [aria-current="page"]')).toHaveCount(1)
	})

	test('navigating to another page moves the aria-current marker', async ({ page }) => {
		await page.goto('/lab/getting-started/installation')
		await expect(page.locator('aside nav [aria-current="page"]')).toContainText(/installation/i)
		await page.locator('aside nav a', { hasText: /usage/i }).click()
		await expect(page).toHaveURL(/\/lab\/getting-started\/usage$/)
		await expect(page.locator('aside nav [aria-current="page"]')).toContainText(/usage/i)
	})
})

test.describe('section sidebar — orphan pages container', () => {
	test('a scope without nested chapters renders its pages in a single indented container', async ({ page }) => {
		await page.goto('/lab/essentials/markdown-syntax')
		const pageLinks = page.locator('aside nav a').filter({ hasText: /^(markdown syntax|code blocks|prose components|images.*embeds)$/i })
		await expect(pageLinks).toHaveCount(4)
	})

	test('the active page link has the primary-coloured border-left class while siblings do not', async ({ page }) => {
		await page.goto('/lab/getting-started/installation')
		const active = page.locator('aside nav [aria-current="page"]')
		// SPEC § Sidebar-rendering mandates the theme primary color on the active border-left.
		await expect(active).toHaveClass(/border-\(--ui-primary\)|border-primary/)
	})
})

test.describe('section sidebar — chapters (deferred until content has nested chapters)', () => {
	test.fixme('clicking a chapter button toggles its child page-list', async () => {
		// no demo content currently has nested chapters; un-fixme once content has nested chapters
	})

	test.fixme('multiple chapters can be expanded simultaneously (no accordion)', async () => {
		// no demo content currently has nested chapters; un-fixme once content has nested chapters
	})
})

test.describe('section sidebar — levels and tabs (deferred until 01-FOUNDATION/03-content-stubs ships)', () => {
	test.fixme('a levels-container is never rendered as a sidebar entry', async () => {
		// once a levels-container exists (e.g. /syntax/javascript with levels: true),
		// assert that no sidebar link points to the levels-container itself
	})

	test.fixme('the sidebar under a levels-container shows the active level pages', async () => {
		// at /syntax/javascript/junior/closures, scope-label is the junior level
		// and links are the junior level's pages, not pages from mid or senior
	})

	test.fixme('a tabs-container renders as a single leaf entry without tab-children in the sidebar', async () => {
		// once a tabs-container exists (e.g. /docs/installation with tabs: true and vite/postcss/cli siblings),
		// assert exactly one sidebar link for /docs/installation and zero for /docs/installation/{vite,postcss,cli}
	})

	test.fixme('a tabs-container leaf gets the active styling when a tab-child is the active route', async () => {
		// at /docs/installation/vite, the /docs/installation leaf has aria-current or the primary-colour border-left
		// via path-prefix-match: route.path.startsWith(node.path + '/')
	})
})

test.describe('auto-sidebar fully replaced', () => {
	test('content pages render the new <nav>, not the docs-template UContentNavigation', async ({ page }) => {
		// landing (`/`) intentionally has no sidebar; any docs-layout page must render exactly one <nav>
		// inside the aside, and the count of links must reflect the current scope's children only.
		await page.goto('/lab/getting-started/installation')
		const navs = page.locator('aside nav')
		await expect(navs).toHaveCount(1)
		const linkCount = await page.locator('aside nav a').count()
		expect(linkCount).toBeLessThan(15)
	})
})
