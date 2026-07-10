import { defineConfig, devices } from '@playwright/test';
import { loadDotenv, resolveE2eBaseUrl, resolveE2ePort } from './scripts/load-dotenv';

loadDotenv();

const e2ePort = resolveE2ePort();
const baseURL = resolveE2eBaseUrl();

process.env.PLAYWRIGHT_BASE_URL = baseURL;
process.env.E2E_PORT = e2ePort;

export default defineConfig({
  testDir: 'tests/e2e',
  testMatch: '**/*.spec.ts',
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  outputDir: 'test-results',
  reporter: [['html', { open: 'never', outputFolder: 'playwright-report' }], ['list']],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: process.env.PLAYWRIGHT_SKIP_WEBSERVER
    ? undefined
    : {
        command: 'pnpm dev:test',
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
        env: {
          ...process.env,
          E2E_PORT: e2ePort,
          PORT: e2ePort,
        },
      },
});
