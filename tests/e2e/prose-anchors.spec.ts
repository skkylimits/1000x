import { expect, test } from '@playwright/test'

test.describe('heading anchors', () => {
	test('H2 has an id attribute (slug-style)', async ({ page }) => {
		await page.goto('/test-prose')
		const id = await page.locator('.prose h2').first().getAttribute('id')
		expect(id).toBeTruthy()
		expect(id).toMatch(/^[a-z0-9-]+$/)
	})

	test('H3 and H4 also have id attributes', async ({ page }) => {
		await page.goto('/test-prose')
		expect(await page.locator('.prose h3').first().getAttribute('id')).toBeTruthy()
		expect(await page.locator('.prose h4').first().getAttribute('id')).toBeTruthy()
	})

	test('clicking the heading anchor sets the URL fragment', async ({ page }) => {
		await page.goto('/test-prose')
		const id = await page.locator('.prose h2').first().getAttribute('id')
		await page.locator(`.prose a[href="#${id}"]`).first().click()
		await expect(page).toHaveURL(new RegExp(`#${id}$`))
	})

	test('navigating directly to a fragment scrolls the heading into view', async ({ page }) => {
		await page.goto('/test-prose')
		const h2 = page.locator('.prose h2').first()
		const id = await h2.getAttribute('id')
		await page.goto(`/test-prose#${id}`)
		await expect(h2).toBeInViewport()
	})
})
