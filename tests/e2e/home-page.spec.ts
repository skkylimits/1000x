import { expect, test } from '@playwright/test'

test.describe('home page', () => {
	test('renders the title from frontmatter as H1', async ({ page }) => {
		await page.goto('/')
		await expect(page.locator('h1').first()).toHaveText('Welkom bij 1000x')
	})

	test('renders the description as a lede paragraph', async ({ page }) => {
		await page.goto('/')
		await expect(page.getByText('Documentatie- en leersysteem voor het team')).toBeVisible()
	})

	test('does not render a duplicate H1 from the markdown body', async ({ page }) => {
		await page.goto('/')
		expect(await page.locator('h1').count()).toBe(1)
	})

	test('renders body content via ContentRenderer', async ({ page }) => {
		await page.goto('/')
		await expect(page.getByText('werkt de markdown-pipeline')).toBeVisible()
	})
})
