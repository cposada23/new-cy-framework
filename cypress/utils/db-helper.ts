/**
 * Database Helper utility for SQL Server testing
 * Provides methods to interact with SQL Server databases during Cypress tests
 * 
 * @class DbHelper
 * @example
 * // Query the database
 * DbHelper.query('SELECT * FROM Users WHERE id = 1').then((result) => {
 *   expect(result.data).to.have.length(1);
 *   expect(result.data[0].email).to.eq('user@example.com');
 * });
 */

/**
 * Database configuration interface
 * @interface DbConfig
 */
export interface DbConfig {
  /** SQL Server hostname or IP address */
  server: string;
  /** Database name */
  database: string;
  /** Database user */
  user: string;
  /** Database password */
  password: string;
  /** Connection port (default: 1433) */
  port?: number;
  /** Additional options */
  options?: {
    encrypt?: boolean;
    trustServerCertificate?: boolean;
  };
}

/**
 * Database query result interface
 * @interface DbResult
 */
export interface DbResult {
  /** Whether the query was successful */
  success: boolean;
  /** Query result data (array of rows) */
  data?: any[];
  /** Number of rows affected */
  rowsAffected?: number[];
  /** Error message if query failed */
  error?: string;
}

export class DbHelper {
  private static config: DbConfig;

  /**
   * Set the database configuration
   * Call this once in your test file or in a before() hook
   * 
   * @param {DbConfig} config - Database configuration object
   * @returns {void}
   * 
   * @example
   * DbHelper.setConfig({
   *   server: 'localhost',
   *   database: 'TestDB',
   *   user: 'sa',
   *   password: 'YourPassword123',
   *   port: 1433,
   *   options: {
   *     encrypt: false,
   *     trustServerCertificate: true
   *   }
   * });
   */
  static setConfig(config: DbConfig): void {
    this.config = config;
  }

  /**
   * Get the current database configuration
   * 
   * @returns {DbConfig} Current database configuration
   * @throws {Error} If configuration has not been set
   */
  private static getConfig(): DbConfig {
    if (!this.config) {
      throw new Error('Database configuration not set. Call DbHelper.setConfig() first.');
    }
    return this.config;
  }

  /**
   * Execute a SQL query against the database
   * 
   * @param {string} query - SQL query to execute
   * @param {DbConfig} [customConfig] - Optional custom database configuration (overrides default)
   * @returns {Cypress.Chainable<DbResult>} Cypress chainable with query results
   * 
   * @example
   * // SELECT query
   * DbHelper.query('SELECT * FROM Users WHERE active = 1').then((result) => {
   *   expect(result.success).to.be.true;
   *   expect(result.data).to.be.an('array');
   *   expect(result.data.length).to.be.greaterThan(0);
   * });
   * 
   * @example
   * // INSERT query
   * DbHelper.query("INSERT INTO Users (name, email) VALUES ('John', 'john@test.com')").then((result) => {
   *   expect(result.success).to.be.true;
   *   expect(result.rowsAffected[0]).to.eq(1);
   * });
   */
  static query(query: string, customConfig?: DbConfig): Cypress.Chainable<DbResult> {
    const config = customConfig || this.getConfig();
    return cy.task('dbQuery', { query, config }) as Cypress.Chainable<DbResult>;
  }

  /**
   * Execute a stored procedure
   * 
   * @param {string} procedureName - Name of the stored procedure to execute
   * @param {Record<string, any>} [parameters] - Input parameters for the stored procedure
   * @param {DbConfig} [customConfig] - Optional custom database configuration
   * @returns {Cypress.Chainable<DbResult>} Cypress chainable with stored procedure results
   * 
   * @example
   * DbHelper.executeStoredProcedure('GetUserById', { userId: 1 }).then((result) => {
   *   expect(result.success).to.be.true;
   *   expect(result.data[0].id).to.eq(1);
   * });
   */
  static executeStoredProcedure(
    procedureName: string,
    parameters?: Record<string, any>,
    customConfig?: DbConfig
  ): Cypress.Chainable<DbResult> {
    const config = customConfig || this.getConfig();
    return cy.task('dbStoredProcedure', {
      procedureName,
      parameters,
      config,
    }) as Cypress.Chainable<DbResult>;
  }

  /**
   * Verify that a record exists in the database
   * 
   * @param {string} tableName - Name of the table to query
   * @param {string} whereClause - WHERE clause for the query (without 'WHERE' keyword)
   * @returns {Cypress.Chainable<void>} Cypress chainable
   * 
   * @example
   * DbHelper.verifyRecordExists('Users', "email = 'john@test.com'");
   */
  static verifyRecordExists(tableName: string, whereClause: string): Cypress.Chainable<void> {
    const query = `SELECT COUNT(*) as count FROM ${tableName} WHERE ${whereClause}`;
    return this.query(query).then((result: DbResult) => {
      expect(result.success, 'Database query should succeed').to.be.true;
      expect(result.data![0].count, `Record should exist in ${tableName}`).to.be.greaterThan(0);
    }) as unknown as Cypress.Chainable<void>;
  }

  /**
   * Verify that a record does not exist in the database
   * 
   * @param {string} tableName - Name of the table to query
   * @param {string} whereClause - WHERE clause for the query (without 'WHERE' keyword)
   * @returns {Cypress.Chainable<void>} Cypress chainable
   * 
   * @example
   * DbHelper.verifyRecordNotExists('Users', "email = 'deleted@test.com'");
   */
  static verifyRecordNotExists(tableName: string, whereClause: string): Cypress.Chainable<void> {
    const query = `SELECT COUNT(*) as count FROM ${tableName} WHERE ${whereClause}`;
    return this.query(query).then((result: DbResult) => {
      expect(result.success, 'Database query should succeed').to.be.true;
      expect(result.data![0].count, `Record should not exist in ${tableName}`).to.eq(0);
    }) as unknown as Cypress.Chainable<void>;
  }

  /**
   * Get the count of records in a table
   * 
   * @param {string} tableName - Name of the table
   * @param {string} [whereClause] - Optional WHERE clause (without 'WHERE' keyword)
   * @returns {Cypress.Chainable<number>} Cypress chainable with the count
   * 
   * @example
   * DbHelper.getRecordCount('Users').then((count) => {
   *   expect(count).to.be.greaterThan(0);
   * });
   * 
   * @example
   * DbHelper.getRecordCount('Users', "active = 1").then((count) => {
   *   cy.log(`Active users: ${count}`);
   * });
   */
  static getRecordCount(tableName: string, whereClause?: string): Cypress.Chainable<number> {
    const query = whereClause
      ? `SELECT COUNT(*) as count FROM ${tableName} WHERE ${whereClause}`
      : `SELECT COUNT(*) as count FROM ${tableName}`;

    return this.query(query).then((result: DbResult) => {
      expect(result.success, 'Database query should succeed').to.be.true;
      return result.data![0].count;
    });
  }

  /**
   * Verify a field value in the database
   * 
   * @param {string} tableName - Name of the table
   * @param {string} fieldName - Name of the field to verify
   * @param {any} expectedValue - Expected value of the field
   * @param {string} whereClause - WHERE clause to identify the record
   * @returns {Cypress.Chainable<void>} Cypress chainable
   * 
   * @example
   * DbHelper.verifyFieldValue('Users', 'email', 'john@test.com', "id = 1");
   */
  static verifyFieldValue(
    tableName: string,
    fieldName: string,
    expectedValue: any,
    whereClause: string
  ): Cypress.Chainable<void> {
    const query = `SELECT ${fieldName} FROM ${tableName} WHERE ${whereClause}`;
    return this.query(query).then((result: DbResult) => {
      expect(result.success, 'Database query should succeed').to.be.true;
      expect(result.data, 'Record should exist').to.have.length.greaterThan(0);
      expect(result.data![0][fieldName], `Field ${fieldName} should match expected value`).to.eq(
        expectedValue
      );
    }) as unknown as Cypress.Chainable<void>;
  }

  /**
   * Clean up test data from the database
   * Use with caution - this deletes records!
   * 
   * @param {string} tableName - Name of the table
   * @param {string} whereClause - WHERE clause to identify records to delete
   * @returns {Cypress.Chainable<DbResult>} Cypress chainable with deletion results
   * 
   * @example
   * // Clean up test data after tests
   * DbHelper.deleteRecords('Users', "email LIKE '%@test.com'");
   */
  static deleteRecords(tableName: string, whereClause: string): Cypress.Chainable<DbResult> {
    const query = `DELETE FROM ${tableName} WHERE ${whereClause}`;
    return this.query(query);
  }
}

