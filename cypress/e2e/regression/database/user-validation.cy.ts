import { DbHelper } from '../../../utils/db-helper';

/**
 * Database Testing Example
 * 
 * This test demonstrates how to validate data displayed in the frontend
 * against the database to ensure data integrity.
 * 
 * Prerequisites:
 * 1. Copy cypress/config/database.config.example.ts to database.config.ts
 * 2. Update database.config.ts with your actual database credentials
 * 3. Ensure your database is accessible from the test environment
 */

describe('Database Validation Tests - User Data', () => {
  /**
   * Setup database configuration before tests
   * 
   * NOTE: In a real scenario, you would import your database config:
   * import { getDbConfig } from '../../../config/database.config';
   * DbHelper.setConfig(getDbConfig(Cypress.env('environment')));
   */
  before(() => {
    // Example configuration - replace with your actual database details
    DbHelper.setConfig({
      server: 'localhost',
      database: 'TestDB',
      user: 'sa',
      password: 'YourPassword123',
      port: 1433,
      options: {
        encrypt: false,
        trustServerCertificate: true,
      },
    });
  });

  /**
   * Example 1: Basic database query
   * Verify that data exists in the database
   */
  it('should query users from the database', () => {
    const query = 'SELECT TOP 5 * FROM Users';

    DbHelper.query(query).then((result) => {
      // Verify query was successful
      expect(result.success).to.be.true;

      // Verify we got results
      expect(result.data).to.be.an('array');
      
      // Log results for debugging
      cy.log(`Found ${result.data?.length} users`);
      
      if (result.data && result.data.length > 0) {
        cy.log('First user:', JSON.stringify(result.data[0]));
      }
    });
  });

  /**
   * Example 2: Verify a specific record exists
   * Check if a user with a specific email exists in the database
   */
  it('should verify user exists in database', () => {
    const testEmail = 'john.doe@example.com';

    DbHelper.verifyRecordExists('Users', `email = '${testEmail}'`);
  });

  /**
   * Example 3: Verify record count
   * Get the count of active users
   */
  it('should get count of active users', () => {
    DbHelper.getRecordCount('Users', 'active = 1').then((count) => {
      expect(count).to.be.greaterThan(0);
      cy.log(`Active users count: ${count}`);
    });
  });

  /**
   * Example 4: Verify field value
   * Check that a specific user has the expected email
   */
  it('should verify user email in database', () => {
    DbHelper.verifyFieldValue('Users', 'email', 'john.doe@example.com', 'id = 1');
  });

  /**
   * Example 5: Frontend to Database validation
   * Verify that data displayed on the frontend matches the database
   */
  it('should validate frontend user data against database', () => {
    // Step 1: Get user data from the database
    const query = "SELECT id, name, email FROM Users WHERE email = 'john.doe@example.com'";

    DbHelper.query(query).then((result) => {
      expect(result.success).to.be.true;
      expect(result.data).to.have.length(1);

      const dbUser = result.data![0];

      // Step 2: Navigate to the frontend and get user data
      // (This is just an example - replace with your actual application)
      cy.visit(`/users/${dbUser.id}`);

      // Step 3: Verify frontend data matches database data
      cy.get('[data-test="user-name"]').should('contain', dbUser.name);
      cy.get('[data-test="user-email"]').should('contain', dbUser.email);
    });
  });

  /**
   * Example 6: Verify data after user action
   * Check that creating a user in the UI updates the database
   */
  it('should verify new user is saved in database after creation', () => {
    const newUser = {
      name: 'Jane Smith',
      email: 'jane.smith@test.com',
    };

    // Step 1: Create user through UI
    cy.visit('/users/new');
    cy.get('[data-test="name-input"]').type(newUser.name);
    cy.get('[data-test="email-input"]').type(newUser.email);
    cy.get('[data-test="submit-button"]').click();

    // Step 2: Verify success message
    cy.get('[data-test="success-message"]').should('be.visible');

    // Step 3: Verify user exists in database
    DbHelper.verifyRecordExists('Users', `email = '${newUser.email}'`);

    // Step 4: Verify all fields are correct in database
    DbHelper.query(`SELECT * FROM Users WHERE email = '${newUser.email}'`).then((result) => {
      expect(result.success).to.be.true;
      expect(result.data).to.have.length(1);
      expect(result.data![0].name).to.eq(newUser.name);
      expect(result.data![0].email).to.eq(newUser.email);
    });
  });

  /**
   * Example 7: Execute stored procedure
   * Call a stored procedure to get user statistics
   */
  it('should execute stored procedure to get user stats', () => {
    DbHelper.executeStoredProcedure('GetUserStatistics', { userId: 1 }).then((result) => {
      expect(result.success).to.be.true;
      expect(result.data).to.be.an('array');

      if (result.data && result.data.length > 0) {
        cy.log('User Statistics:', JSON.stringify(result.data[0]));
      }
    });
  });

  /**
   * Cleanup: Delete test data after tests
   * Use with caution!
   */
  after(() => {
    // Clean up any test data created during tests
    DbHelper.deleteRecords('Users', "email LIKE '%@test.com'").then((result) => {
      cy.log(`Deleted ${result.rowsAffected} test records`);
    });
  });
});

