# Contributing to Cypress E2E Testing Framework

Thank you for your interest in contributing to this project! This document provides guidelines and best practices for contributing.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Writing Tests](#writing-tests)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)

## 🤝 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

## 🚀 Getting Started

1. **Fork the repository**
   ```bash
   git clone <your-fork-url>
   cd newcypress
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make your changes**

5. **Run tests to ensure everything works**
   ```bash
   npm run test:smoke
   npm run test:regression
   npm run test:api
   ```

## 🔄 Development Workflow

### Branch Naming Convention

Use descriptive branch names:
- `feature/add-new-test` - For new features or tests
- `bugfix/fix-failing-test` - For bug fixes
- `refactor/improve-api-helper` - For code refactoring
- `docs/update-readme` - For documentation updates

### Commit Messages

Write clear and descriptive commit messages:

```
<type>: <short description>

<optional detailed description>

Examples:
- feat: add login page object
- fix: resolve screenshot capture issue
- refactor: improve API helper error handling
- docs: update README with new examples
- test: add regression tests for checkout flow
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `docs`: Documentation changes
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

## 📝 Coding Standards

### TypeScript Guidelines

1. **Use TypeScript for all test files**
   ```typescript
   // Good ✅
   describe('My Test Suite', () => {
     it('should do something', () => {
       // test code
     })
   })
   ```

2. **Type your variables and functions**
   ```typescript
   // Good ✅
   const userId: number = 1;
   const userName: string = 'John Doe';

   function getUserById(id: number): void {
     // function code
   }
   ```

3. **Use interfaces for complex objects**
   ```typescript
   interface User {
     id: number;
     name: string;
     email: string;
   }

   const user: User = {
     id: 1,
     name: 'John Doe',
     email: 'john@example.com'
   };
   ```

### File Naming Conventions

- Test files: `*.cy.ts`
- Helper files: `kebab-case.ts` (e.g., `api-helper.ts`)
- Config files: `environment.config.ts` (e.g., `qa.config.ts`)

### Code Organization

1. **Group related tests together**
   ```typescript
   describe('User Management', () => {
     describe('User Creation', () => {
       it('should create a new user', () => {})
       it('should validate required fields', () => {})
     })

     describe('User Deletion', () => {
       it('should delete an existing user', () => {})
     })
   })
   ```

2. **Use `beforeEach` and `afterEach` for setup/cleanup**
   ```typescript
   describe('My Tests', () => {
     beforeEach(() => {
       cy.visit('/page')
     })

     afterEach(() => {
       // cleanup if needed
     })

     it('test 1', () => {})
     it('test 2', () => {})
   })
   ```

3. **Keep tests focused and independent**
   - Each test should test one thing
   - Tests should not depend on other tests
   - Tests should be able to run in any order

## ✍️ Writing Tests

### Test Structure

Follow the **Arrange-Act-Assert** pattern:

```typescript
it('should successfully login with valid credentials', () => {
  // Arrange - Setup test data
  const email = 'test@example.com'
  const password = 'password123'

  // Act - Perform actions
  cy.visit('/login')
  cy.get('[data-test="email"]').type(email)
  cy.get('[data-test="password"]').type(password)
  cy.get('[data-test="submit"]').click()

  // Assert - Verify results
  cy.url().should('include', '/dashboard')
  cy.get('[data-test="welcome"]').should('contain', 'Welcome')
})
```

### Best Practices

1. **Use meaningful test descriptions**
   ```typescript
   // Good ✅
   it('should display error message when email is invalid', () => {})

   // Bad ❌
   it('test 1', () => {})
   ```

2. **Use data-test attributes for selectors**
   ```typescript
   // Good ✅
   cy.get('[data-test="submit-button"]').click()

   // Avoid ⚠️
   cy.get('.btn-primary').click()
   ```

3. **Use the ApiHelper for API tests**
   ```typescript
   import { ApiHelper } from '../../utils/api-helper';

   it('should get user data', () => {
     ApiHelper.get('/users/1').then((response) => {
       ApiHelper.verifyStatusCode(response, 200)
       ApiHelper.verifyBodyProperty(response, 'id')
     })
   })
   ```

4. **Add descriptive comments for complex logic**
   ```typescript
   // Wait for API response before checking UI update
   cy.intercept('POST', '/api/users').as('createUser')
   cy.get('[data-test="submit"]').click()
   cy.wait('@createUser')
   ```

5. **Use environment-agnostic URLs**
   ```typescript
   // Good ✅
   cy.visit('/dashboard')

   // Bad ❌
   cy.visit('https://dev.example.com/dashboard')
   ```

### Test Organization

Place tests in appropriate folders:

- **Smoke tests** → `cypress/e2e/smoke/`
  - Quick tests that verify basic functionality
  - Should run fast (< 5 minutes)

- **Regression tests** → `cypress/e2e/regression/`
  - Comprehensive test coverage
  - Can take longer to run

- **API tests** → `cypress/e2e/regression/api/`
  - Backend/API validation
  - No UI interaction

### Adding Utilities

When adding helper functions:

1. Create or update files in `cypress/utils/`
2. Use TypeScript with proper typing
3. Export functions/classes for reusability
4. Add JSDoc comments for documentation
5. Add examples in the README

```typescript
/**
 * Verify response status code
 * @param response - Cypress response object
 * @param expectedStatus - Expected HTTP status code
 */
static verifyStatusCode(response: Cypress.Response<any>, expectedStatus: number): void {
  expect(response.status).to.eq(expectedStatus);
}
```

## 🔍 Pull Request Process

1. **Update your branch with latest main**
   ```bash
   git checkout main
   git pull origin main
   git checkout your-branch
   git merge main
   ```

2. **Run all tests**
   ```bash
   npm run test:smoke
   npm run test:regression
   npm run test:api
   ```

3. **Ensure no linting errors**
   ```bash
   npm run lint  # if available
   ```

4. **Create Pull Request**
   - Provide a clear title and description
   - Reference any related issues
   - Add screenshots/recordings if applicable
   - Ensure all CI checks pass

5. **PR Description Template**
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] New feature
   - [ ] Bug fix
   - [ ] Refactoring
   - [ ] Documentation update

   ## Testing
   - [ ] All existing tests pass
   - [ ] New tests added (if applicable)
   - [ ] Manual testing completed

   ## Screenshots (if applicable)
   Add screenshots or recordings

   ## Additional Notes
   Any additional information
   ```

6. **Address Review Comments**
   - Respond to all comments
   - Make requested changes
   - Re-request review after updates

## 🐛 Reporting Bugs

### Before Reporting

1. Check if the bug has already been reported
2. Verify it's reproducible
3. Test on different environments if possible

### Bug Report Template

```markdown
## Bug Description
Clear and concise description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., macOS, Windows]
- Browser: [e.g., Chrome 120]
- Node version: [e.g., v18.0.0]
- Cypress version: [e.g., 15.3.0]

## Screenshots/Videos
If applicable

## Additional Context
Any other relevant information
```

## 💡 Feature Requests

We welcome feature requests! Please provide:

1. **Clear description** of the feature
2. **Use case** - Why is it needed?
3. **Proposed solution** - How should it work?
4. **Alternatives considered** - Other approaches you've thought of

## 📚 Additional Resources

- [Cypress Documentation](https://docs.cypress.io/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)

## ❓ Questions?

If you have questions, feel free to:
- Open an issue with the `question` label
- Reach out to the maintainers
- Check existing documentation

Thank you for contributing! 🎉

