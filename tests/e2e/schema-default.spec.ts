import { expect, test } from '@playwright/test'

test.describe('schemaVersion default', () => {
	test('page without schemaVersion still renders (zod default kicks in)', async ({ page }) => {
		await page.goto('/test-no-schema-version')
		await expect(page.locator('h1').first()).toHaveText('Test Zonder Schema Versie')
		await expect(page.getByText('werkt de zod-default')).toBeVisible()
	})
})
