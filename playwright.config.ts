import { defineConfig, devices } from "@playwright/test";
import { testEnv } from "./utils/env.utils";

export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 60_000,
  expect: {
    timeout: 30_000,
  },
  reporter: [["html", { open: "never" }], ["list"]],
  use: {
    baseURL: testEnv.BASE_URL,
    actionTimeout: 30_000,
    navigationTimeout: 60_000,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
  metadata: {
    apiBaseURL: testEnv.API_BASE_URL,
  },
});
