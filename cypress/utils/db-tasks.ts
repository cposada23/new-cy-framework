/**
 * Database tasks for Cypress
 * These tasks run in Node.js context and can connect to databases
 * 
 * @module db-tasks
 */

import sql from 'mssql';

/**
 * Database configuration interface
 * @interface DbConfig
 */
interface DbConfig {
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
 * Execute a SQL query against the database
 * 
 * @param {Object} params - Query parameters
 * @param {string} params.query - SQL query to execute
 * @param {DbConfig} params.config - Database configuration
 * @returns {Promise<any>} Query results
 * 
 * @example
 * const result = await executeQuery({
 *   query: 'SELECT * FROM Users WHERE id = 1',
 *   config: dbConfig
 * });
 */
async function executeQuery({ query, config }: { query: string; config: DbConfig }) {
  let pool;
  try {
    // Create connection pool
    pool = await sql.connect(config);
    
    // Execute query
    const result = await pool.request().query(query);
    
    return {
      success: true,
      data: result.recordset,
      rowsAffected: result.rowsAffected,
    };
  } catch (error: any) {
    console.error('Database query error:', error);
    return {
      success: false,
      error: error.message,
    };
  } finally {
    // Close connection
    if (pool) {
      await pool.close();
    }
  }
}

/**
 * Execute a stored procedure
 * 
 * @param {Object} params - Stored procedure parameters
 * @param {string} params.procedureName - Name of the stored procedure
 * @param {Object} params.parameters - Input parameters for the stored procedure
 * @param {DbConfig} params.config - Database configuration
 * @returns {Promise<any>} Stored procedure results
 * 
 * @example
 * const result = await executeStoredProcedure({
 *   procedureName: 'GetUserById',
 *   parameters: { userId: 1 },
 *   config: dbConfig
 * });
 */
async function executeStoredProcedure({
  procedureName,
  parameters = {},
  config,
}: {
  procedureName: string;
  parameters?: Record<string, any>;
  config: DbConfig;
}) {
  let pool;
  try {
    pool = await sql.connect(config);
    const request = pool.request();
    
    // Add parameters
    Object.keys(parameters).forEach((key) => {
      request.input(key, parameters[key]);
    });
    
    // Execute stored procedure
    const result = await request.execute(procedureName);
    
    return {
      success: true,
      data: result.recordset,
      rowsAffected: result.rowsAffected,
    };
  } catch (error: any) {
    console.error('Stored procedure error:', error);
    return {
      success: false,
      error: error.message,
    };
  } finally {
    if (pool) {
      await pool.close();
    }
  }
}

/**
 * Register database tasks with Cypress
 * Call this in cypress.config.ts setupNodeEvents
 * 
 * @param {any} on - Cypress 'on' event registration function
 * @returns {void}
 */
export function registerDatabaseTasks(on: any): void {
  on('task', {
    /**
     * Execute a SQL query
     */
    dbQuery: executeQuery,
    
    /**
     * Execute a stored procedure
     */
    dbStoredProcedure: executeStoredProcedure,
  });
}

