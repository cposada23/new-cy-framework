import { defineConfig } from "cypress";

// Get environment from ENV variable, default to 'dev'
const environment = process.env.ENV || 'dev';

// Load environment-specific configuration
let envConfig;
try {
  envConfig = require(`./cypress/config/${environment}.config.ts`).default;
} catch (error) {
  console.warn(`Could not load config for environment: ${environment}, using default config`);
  envConfig = { baseUrl: 'https://example.cypress.io' };
}

export default defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true,
    reportPageTitle: 'Cypress Test Report',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
  },
  screenshotOnRunFailure: true,
  video: false,
  e2e: {
    ...envConfig,
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
      return config;
    },
  },
});

