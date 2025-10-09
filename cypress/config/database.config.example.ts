/**
 * Database configuration example
 * Copy this file to database.config.ts and update with your actual database credentials
 * 
 * IMPORTANT: Never commit database.config.ts to version control!
 * Add it to .gitignore to keep credentials secure.
 */

import { DbConfig } from '../utils/db-helper';

/**
 * Development database configuration
 */
export const devDbConfig: DbConfig = {
  server: 'localhost',
  database: 'TestDB',
  user: 'sa',
  password: 'YourPassword123',
  port: 1433,
  options: {
    encrypt: false, // Set to true if using Azure SQL
    trustServerCertificate: true, // Set to false in production
  },
};

/**
 * QA database configuration
 */
export const qaDbConfig: DbConfig = {
  server: 'qa-server.example.com',
  database: 'TestDB_QA',
  user: 'qa_user',
  password: 'QAPassword123',
  port: 1433,
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
};

/**
 * Staging database configuration
 */
export const stagingDbConfig: DbConfig = {
  server: 'staging-server.example.com',
  database: 'TestDB_Staging',
  user: 'staging_user',
  password: 'StagingPassword123',
  port: 1433,
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
};

/**
 * Get database config based on environment
 * 
 * @param {string} environment - Environment name (dev, qa, staging)
 * @returns {DbConfig} Database configuration for the specified environment
 */
export function getDbConfig(environment: string = 'dev'): DbConfig {
  switch (environment.toLowerCase()) {
    case 'qa':
      return qaDbConfig;
    case 'staging':
      return stagingDbConfig;
    case 'dev':
    default:
      return devDbConfig;
  }
}

