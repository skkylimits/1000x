import { expect, test } from '@playwright/test'

test.describe('prose test page', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/test-prose')
	})

	test('renders the title from frontmatter', async ({ page }) => {
		await expect(page.locator('h1').first()).toHaveText('Prose Test Pagina')
	})

	test('renders H2, H3, H4 headings', async ({ page }) => {
		await expect(page.locator('h2').first()).toBeVisible()
		await expect(page.locator('h3').first()).toBeVisible()
		await expect(page.locator('h4').first()).toBeVisible()
	})

	test('renders an unordered list and an ordered list', async ({ page }) => {
		await expect(page.locator('.prose ul').first()).toBeVisible()
		await expect(page.locator('.prose ol').first()).toBeVisible()
	})

	test('renders a nested list one level deep', async ({ page }) => {
		await expect(page.locator('.prose ul ul, .prose ul ol, .prose ol ul, .prose ol ol').first()).toBeVisible()
	})

	test('renders a blockquote', async ({ page }) => {
		await expect(page.locator('.prose blockquote').first()).toBeVisible()
	})

	test('renders inline code, bold, and italic', async ({ page }) => {
		await expect(page.locator('.prose code').first()).toBeVisible()
		await expect(page.locator('.prose strong').first()).toBeVisible()
		await expect(page.locator('.prose em').first()).toBeVisible()
	})

	test('renders an internal and external link', async ({ page }) => {
		await expect(page.locator('.prose a[href="/"]').first()).toBeVisible()
		await expect(page.locator('.prose a[href^="https://"]').first()).toBeVisible()
	})

	test('renders a horizontal rule', async ({ page }) => {
		await expect(page.locator('.prose hr').first()).toBeVisible()
	})

	test('renders a table with header and rows', async ({ page }) => {
		await expect(page.locator('.prose table thead th').first()).toBeVisible()
		expect(await page.locator('.prose table tbody tr').count()).toBeGreaterThanOrEqual(2)
	})
})
