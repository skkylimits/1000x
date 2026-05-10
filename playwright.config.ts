import process from 'node:process'
import { defineConfig, devices } from '@playwright/test'

const PORT = Number(process.env.PORT) || 3000

export default defineConfig({
	testDir: './tests/e2e',
	timeout: 30 * 1000,
	use: {
		baseURL: `http://localhost:${PORT}`,
		trace: 'on-first-retry',
	},
	projects: [
		{ name: 'chromium', use: { ...devices['Desktop Chrome'] } },
	],
	webServer: {
		command: 'pnpm dev',
		port: PORT,
		reuseExistingServer: !process.env.CI,
		timeout: 120 * 1000,
	},
})
