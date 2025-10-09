# Database Testing Guide

This guide explains how to use the database testing utilities in the Cypress framework.

## 📋 Overview

The database testing utilities allow you to:
- Connect to SQL Server databases from your Cypress tests
- Execute SQL queries and stored procedures
- Validate that frontend data matches database records
- Verify data integrity after user actions

## 🔧 Setup

### 1. Install Dependencies

The `mssql` package is already installed. If you need to reinstall:

```bash
npm install --save-dev mssql
```

### 2. Configure Database Connection

1. Copy the example configuration file:
```bash
cp cypress/config/database.config.example.ts cypress/config/database.config.ts
```

2. Update `cypress/config/database.config.ts` with your actual database credentials:

```typescript
export const devDbConfig: DbConfig = {
  server: 'your-server.database.windows.net', // Your SQL Server
  database: 'YourDatabase',
  user: 'your-username',
  password: 'your-password',
  port: 1433,
  options: {
    encrypt: true, // Required for Azure SQL
    trustServerCertificate: false, // Set to true for local dev
  },
};
```

**⚠️ IMPORTANT:** Never commit `database.config.ts` to version control! It's already in `.gitignore`.

### 3. Initialize in Your Tests

```typescript
import { DbHelper } from '../../utils/db-helper';
import { getDbConfig } from '../../config/database.config';

describe('My Database Tests', () => {
  before(() => {
    // Set database configuration
    DbHelper.setConfig(getDbConfig(Cypress.env('environment')));
  });

  // Your tests here...
});
```

## 📚 DbHelper API Reference

### Configuration

#### `setConfig(config: DbConfig): void`

Set the database configuration for all subsequent queries.

```typescript
DbHelper.setConfig({
  server: 'localhost',
  database: 'TestDB',
  user: 'sa',
  password: 'password',
  port: 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
});
```

### Query Methods

#### `query(sqlQuery: string): Cypress.Chainable<DbResult>`

Execute a SQL query and return results.

```typescript
DbHelper.query('SELECT * FROM Users WHERE id = 1').then((result) => {
  expect(result.success).to.be.true;
  expect(result.data).to.have.length(1);
  cy.log(result.data[0].name);
});
```

#### `executeStoredProcedure(name: string, params?: object): Cypress.Chainable<DbResult>`

Execute a stored procedure with parameters.

```typescript
DbHelper.executeStoredProcedure('GetUserById', { userId: 1 }).then((result) => {
  expect(result.success).to.be.true;
  expect(result.data[0].id).to.eq(1);
});
```

### Verification Methods

#### `verifyRecordExists(table: string, whereClause: string): Cypress.Chainable<void>`

Verify that a record exists in the database.

```typescript
DbHelper.verifyRecordExists('Users', "email = 'john@example.com'");
```

#### `verifyRecordNotExists(table: string, whereClause: string): Cypress.Chainable<void>`

Verify that a record does NOT exist in the database.

```typescript
DbHelper.verifyRecordNotExists('Users', "email = 'deleted@example.com'");
```

#### `verifyFieldValue(table: string, field: string, expectedValue: any, whereClause: string): Cypress.Chainable<void>`

Verify a specific field value.

```typescript
DbHelper.verifyFieldValue('Users', 'name', 'John Doe', "id = 1");
```

### Utility Methods

#### `getRecordCount(table: string, whereClause?: string): Cypress.Chainable<number>`

Get the count of records in a table.

```typescript
DbHelper.getRecordCount('Users').then((count) => {
  expect(count).to.be.greaterThan(0);
});

DbHelper.getRecordCount('Users', 'active = 1').then((count) => {
  cy.log(`Active users: ${count}`);
});
```

#### `deleteRecords(table: string, whereClause: string): Cypress.Chainable<DbResult>`

Delete records from the database (use with caution!).

```typescript
// Clean up test data
DbHelper.deleteRecords('Users', "email LIKE '%@test.com'");
```

## 💡 Common Use Cases

### 1. Verify Frontend Data Against Database

```typescript
it('should display correct user data from database', () => {
  // Get data from database
  DbHelper.query("SELECT * FROM Users WHERE id = 1").then((result) => {
    const user = result.data[0];

    // Navigate to frontend
    cy.visit('/users/1');

    // Verify frontend matches database
    cy.get('[data-test="user-name"]').should('contain', user.name);
    cy.get('[data-test="user-email"]').should('contain', user.email);
  });
});
```

### 2. Verify Data After User Action

```typescript
it('should save new user to database', () => {
  const newUser = { name: 'Jane Doe', email: 'jane@test.com' };

  // Create user via UI
  cy.visit('/users/new');
  cy.get('[data-test="name"]').type(newUser.name);
  cy.get('[data-test="email"]').type(newUser.email);
  cy.get('[data-test="submit"]').click();

  // Verify in database
  DbHelper.verifyRecordExists('Users', `email = '${newUser.email}'`);
  
  // Verify all fields
  DbHelper.query(`SELECT * FROM Users WHERE email = '${newUser.email}'`).then((result) => {
    expect(result.data[0].name).to.eq(newUser.name);
  });
});
```

### 3. Verify Data Updates

```typescript
it('should update user in database', () => {
  const updatedName = 'John Smith Updated';

  // Update via UI
  cy.visit('/users/1/edit');
  cy.get('[data-test="name"]').clear().type(updatedName);
  cy.get('[data-test="submit"]').click();

  // Verify in database
  DbHelper.verifyFieldValue('Users', 'name', updatedName, 'id = 1');
});
```

### 4. Verify Data Deletion

```typescript
it('should delete user from database', () => {
  const userId = 999;

  // Delete via UI
  cy.visit(`/users/${userId}`);
  cy.get('[data-test="delete-button"]').click();
  cy.get('[data-test="confirm"]').click();

  // Verify deleted in database
  DbHelper.verifyRecordNotExists('Users', `id = ${userId}`);
});
```

### 5. Complex Queries with Joins

```typescript
it('should verify user with orders', () => {
  const query = `
    SELECT u.name, COUNT(o.id) as order_count
    FROM Users u
    LEFT JOIN Orders o ON u.id = o.user_id
    WHERE u.id = 1
    GROUP BY u.name
  `;

  DbHelper.query(query).then((result) => {
    expect(result.success).to.be.true;
    expect(result.data[0].order_count).to.be.greaterThan(0);
  });
});
```

### 6. Test Data Setup

```typescript
describe('Order Tests', () => {
  let testUserId: number;

  before(() => {
    // Create test data
    const query = `
      INSERT INTO Users (name, email, active)
      OUTPUT INSERTED.id
      VALUES ('Test User', 'test@example.com', 1)
    `;

    DbHelper.query(query).then((result) => {
      testUserId = result.data[0].id;
    });
  });

  it('should create order for test user', () => {
    // Test using testUserId
  });

  after(() => {
    // Clean up test data
    DbHelper.deleteRecords('Users', `id = ${testUserId}`);
  });
});
```

## 🔒 Security Best Practices

1. **Never commit credentials** - Use environment-specific config files
2. **Use read-only accounts** for test queries when possible
3. **Limit database access** - Only allow connections from test environments
4. **Use parameterized queries** to prevent SQL injection
5. **Clean up test data** - Always delete test records after tests

## 🐛 Troubleshooting

### Connection Errors

If you get connection errors:

1. **Check server accessibility:**
   ```bash
   ping your-server.database.windows.net
   ```

2. **Verify credentials** in `database.config.ts`

3. **Check firewall rules** - Ensure your IP is whitelisted

4. **For Azure SQL:**
   ```typescript
   options: {
     encrypt: true,
     trustServerCertificate: false,
   }
   ```

5. **For local SQL Server:**
   ```typescript
   options: {
     encrypt: false,
     trustServerCertificate: true,
   }
   ```

### Query Errors

If queries fail:

1. **Check table/column names** - They're case-sensitive in some configurations
2. **Verify user permissions** - Ensure the database user has SELECT/INSERT/UPDATE/DELETE rights
3. **Use `cy.log()`** to debug query results
4. **Check SQL syntax** - Test queries in SQL Server Management Studio first

### Task Not Found Error

If you see "task 'dbQuery' not found":

1. Verify `registerDatabaseTasks(on)` is called in `cypress.config.ts`
2. Restart Cypress after configuration changes

## 📊 Performance Tips

1. **Limit result sets** - Use `TOP` or `LIMIT` in queries
2. **Create indexes** on frequently queried columns
3. **Use stored procedures** for complex operations
4. **Close connections** - The framework handles this automatically
5. **Avoid database queries in loops** - Batch operations when possible

## 🔗 Additional Resources

- [mssql npm package](https://www.npmjs.com/package/mssql)
- [SQL Server Documentation](https://docs.microsoft.com/en-us/sql/)
- [Cypress Tasks Documentation](https://docs.cypress.io/api/commands/task)

