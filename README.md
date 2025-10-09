# Cypress E2E Testing Framework

## 🚀 Features

- ✅ **TypeScript Support** - Full type safety and IntelliSense
- 🌍 **Multi-Environment Configuration** - Dev, QA, Staging, and Production
- 📊 **Mochawesome Reporting** - Beautiful HTML reports with embedded screenshots
- 🔧 **API Testing Utilities** - Reusable helper functions for API testing
- 📸 **Screenshot on Failure** - Automatic screenshot capture when tests fail
- 🎯 **Organized Test Structure** - Smoke, Regression, and API test suites
- 🛠️ **NPM Scripts** - Easy-to-use commands for different test types and environments

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## 🔧 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd newcypress
```

2. Install dependencies:
```bash
npm install
```

## 📁 Project Structure

```
cypress/
├── config/                      # Environment-specific configurations
│   ├── dev.config.ts
│   ├── qa.config.ts
│   ├── staging.config.ts
│   └── prod.config.ts
├── e2e/                         # Test files
│   ├── smoke/                   # Smoke tests
│   │   ├── google.cy.ts
│   │   └── failing-test.cy.ts
│   └── regression/              # Regression tests
│       ├── example.cy.ts
│       └── api/                 # API tests
│           ├── users.cy.ts
│           └── posts.cy.ts
├── fixtures/                    # Test data
│   └── example.json
├── support/                     # Support files
│   ├── commands.ts              # Custom commands
│   └── e2e.ts                   # Global configuration
└── utils/                       # Utility functions
    └── api-helper.ts            # API testing helpers
```

## 🎯 Running Tests

### Smoke Tests

Run smoke tests to verify basic functionality:

```bash
# Run in DEV environment (default)
npm run test:smoke

# Run in specific environments
npm run test:smoke:dev
npm run test:smoke:qa
npm run test:smoke:staging
npm run test:smoke:prod
```

### Regression Tests

Run comprehensive regression test suite:

```bash
# Run in DEV environment (default)
npm run test:regression

# Run in specific environments
npm run test:regression:dev
npm run test:regression:qa
npm run test:regression:staging
npm run test:regression:prod
```

### API Tests

Run API tests:

```bash
# Run in DEV environment (default)
npm run test:api

# Run in specific environments
npm run test:api:dev
npm run test:api:qa
npm run test:api:staging
npm run test:api:prod
```

### Run All Tests

```bash
# Run all tests in DEV environment
npm run test:regression
```

## 🌍 Environment Configuration

Environment configurations are stored in `cypress/config/` directory. Each environment has its own configuration file:

### Update Environment URLs

Edit the corresponding config file to change the base URL:

```typescript
// cypress/config/qa.config.ts
export default {
  baseUrl: 'https://qa.yourapp.com',
  env: {
    environment: 'qa'
  }
}
```

### Using Environment Variables

You can also set the environment using the `ENV` variable:

```bash
ENV=qa cypress run --spec 'cypress/e2e/smoke/**/*.cy.ts'
```

## 📊 Test Reports

After running tests, Mochawesome generates an HTML report at:
```
cypress/reports/html/index.html
```

The report includes:
- ✅ Test results (pass/fail)
- 📊 Charts and statistics
- 📸 Embedded screenshots (on failure)
- ⏱️ Execution time
- 📝 Detailed test information

Simply open the HTML file in your browser to view the report.

## 📸 Screenshots

Screenshots are automatically captured when tests fail and embedded in the HTML report. No additional configuration needed!

## 🔧 API Testing

The framework includes a powerful `ApiHelper` utility class for API testing.

### Example Usage

```typescript
import { ApiHelper } from '../../utils/api-helper';

describe('API Tests', () => {
  it('should get user data', () => {
    ApiHelper.get('https://api.example.com/users/1').then((response) => {
      ApiHelper.verifyStatusCode(response, 200);
      ApiHelper.verifyBodyProperty(response, 'id');
      ApiHelper.verifyResponseTime(response, 2000);
    });
  });

  it('should create a new user', () => {
    const userData = { name: 'John Doe', email: 'john@example.com' };
    
    ApiHelper.post('https://api.example.com/users', userData).then((response) => {
      ApiHelper.verifyStatusCode(response, 201);
      ApiHelper.verifyBodyPropertyValue(response, 'name', userData.name);
    });
  });
});
```

### Available API Helper Methods

**HTTP Methods:**
- `ApiHelper.get(url, headers?)`
- `ApiHelper.post(url, body, headers?)`
- `ApiHelper.put(url, body, headers?)`
- `ApiHelper.delete(url, headers?)`

**Verification Methods:**
- `verifyStatusCode(response, expectedStatus)`
- `verifyBodyProperty(response, property)`
- `verifyBodyPropertyValue(response, property, value)`
- `verifyHeader(response, headerName, expectedValue?)`
- `verifyResponseTime(response, maxDuration)`
- `verifyBodyIsArray(response)`
- `verifyArrayLength(response, expectedLength)`
- `logResponse(response)`

## 🎨 Writing Tests

### Basic Test Example

```typescript
describe('My Test Suite', () => {
  it('should perform a test', () => {
    cy.visit('/page')
    cy.get('.element').should('be.visible')
    cy.get('button').click()
  })
})
```

### Using Base URL

Tests automatically use the configured `baseUrl` from environment configs:

```typescript
// Instead of full URL
cy.visit('https://example.com/todo')

// Use relative path
cy.visit('/todo')
```

## 🛠️ Custom Commands

Add custom commands in `cypress/support/commands.ts`:

```typescript
// Example custom command
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login')
  cy.get('[data-test="email"]').type(email)
  cy.get('[data-test="password"]').type(password)
  cy.get('[data-test="submit"]').click()
})

export {};
```

## 🤝 Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📝 Best Practices

1. **Use TypeScript** - Leverage type safety for better code quality
2. **Organize Tests** - Keep tests organized by type (smoke, regression, api)
3. **Use Page Objects** - For complex applications, consider using Page Object pattern
4. **Use Custom Commands** - Create reusable commands for common actions
5. **Keep Tests Independent** - Each test should be able to run independently
6. **Use Data-Test Attributes** - Prefer `[data-test="..."]` selectors over classes/IDs
7. **Clean Up** - Reset state after tests when necessary
8. **API Testing** - Use the ApiHelper utility for consistent API testing

## 🐛 Troubleshooting

### Tests not finding baseUrl
- Ensure the `ENV` variable is set correctly
- Check that the environment config file exists in `cypress/config/`

### TypeScript errors
- Run `npm install` to ensure all dependencies are installed
- Check `tsconfig.json` configuration

### Reports not generating
- Ensure Mochawesome reporter is installed: `npm install --save-dev cypress-mochawesome-reporter`
- Check that the reporter is configured in `cypress.config.ts`


