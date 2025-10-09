/**
 * Request options interface for API calls
 * @interface RequestOptions
 */
interface RequestOptions {
  /** HTTP method to use for the request */
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  /** URL endpoint for the request */
  url: string;
  /** Request body payload */
  body?: any;
  /** HTTP headers to include in the request */
  headers?: Record<string, string>;
  /** Query string parameters */
  qs?: Record<string, any>;
  /** Whether to fail the test on non-2xx status codes */
  failOnStatusCode?: boolean;
}

/**
 * API Response interface
 * @interface ApiResponse
 */
interface ApiResponse {
  /** HTTP status code */
  status: number;
  /** Response body */
  body: any;
  /** Response headers */
  headers: Record<string, string>;
  /** Request duration in milliseconds */
  duration: number;
}

/**
 * API Helper utility class for making HTTP requests and validating responses
 * Provides methods for common HTTP operations and response validations
 * 
 * @class ApiHelper
 * @example
 * // Making a GET request
 * ApiHelper.get('https://api.example.com/users').then((response) => {
 *   ApiHelper.verifyStatusCode(response, 200);
 * });
 * 
 * @example
 * // Making a POST request
 * const userData = { name: 'John', email: 'john@example.com' };
 * ApiHelper.post('https://api.example.com/users', userData).then((response) => {
 *   ApiHelper.verifyStatusCode(response, 201);
 *   ApiHelper.verifyBodyProperty(response, 'id');
 * });
 */
export class ApiHelper {
  /**
   * Make a GET request to the specified URL
   * 
   * @param {string} url - The URL endpoint to send the GET request to
   * @param {Record<string, string>} [headers] - Optional HTTP headers to include in the request
   * @returns {Cypress.Chainable<Cypress.Response<any>>} Cypress chainable response object
   * 
   * @example
   * ApiHelper.get('https://api.example.com/users/1').then((response) => {
   *   expect(response.status).to.eq(200);
   * });
   * 
   * @example
   * // With custom headers
   * const headers = { 'Authorization': 'Bearer token123' };
   * ApiHelper.get('https://api.example.com/users', headers).then((response) => {
   *   console.log(response.body);
   * });
   */
  static get(url: string, headers?: Record<string, string>): Cypress.Chainable<Cypress.Response<any>> {
    return cy.request({
      method: 'GET',
      url,
      headers: headers || {},
      failOnStatusCode: false,
    });
  }

  /**
   * Make a POST request to the specified URL with a request body
   * 
   * @param {string} url - The URL endpoint to send the POST request to
   * @param {any} body - The request body payload (will be JSON stringified)
   * @param {Record<string, string>} [headers] - Optional HTTP headers to include in the request
   * @returns {Cypress.Chainable<Cypress.Response<any>>} Cypress chainable response object
   * 
   * @example
   * const newUser = { name: 'John Doe', email: 'john@example.com' };
   * ApiHelper.post('https://api.example.com/users', newUser).then((response) => {
   *   expect(response.status).to.eq(201);
   *   expect(response.body).to.have.property('id');
   * });
   * 
   * @example
   * // With custom headers
   * const headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer token' };
   * ApiHelper.post('https://api.example.com/posts', { title: 'My Post' }, headers);
   */
  static post(
    url: string,
    body: any,
    headers?: Record<string, string>
  ): Cypress.Chainable<Cypress.Response<any>> {
    return cy.request({
      method: 'POST',
      url,
      body,
      headers: headers || {},
      failOnStatusCode: false,
    });
  }

  /**
   * Make a PUT request to update a resource at the specified URL
   * 
   * @param {string} url - The URL endpoint to send the PUT request to
   * @param {any} body - The request body payload with updated data
   * @param {Record<string, string>} [headers] - Optional HTTP headers to include in the request
   * @returns {Cypress.Chainable<Cypress.Response<any>>} Cypress chainable response object
   * 
   * @example
   * const updatedUser = { id: 1, name: 'Jane Doe', email: 'jane@example.com' };
   * ApiHelper.put('https://api.example.com/users/1', updatedUser).then((response) => {
   *   expect(response.status).to.eq(200);
   *   expect(response.body.name).to.eq('Jane Doe');
   * });
   */
  static put(
    url: string,
    body: any,
    headers?: Record<string, string>
  ): Cypress.Chainable<Cypress.Response<any>> {
    return cy.request({
      method: 'PUT',
      url,
      body,
      headers: headers || {},
      failOnStatusCode: false,
    });
  }

  /**
   * Make a DELETE request to remove a resource at the specified URL
   * 
   * @param {string} url - The URL endpoint to send the DELETE request to
   * @param {Record<string, string>} [headers] - Optional HTTP headers to include in the request
   * @returns {Cypress.Chainable<Cypress.Response<any>>} Cypress chainable response object
   * 
   * @example
   * ApiHelper.delete('https://api.example.com/users/1').then((response) => {
   *   expect(response.status).to.eq(200);
   * });
   * 
   * @example
   * // With authorization header
   * const headers = { 'Authorization': 'Bearer token123' };
   * ApiHelper.delete('https://api.example.com/posts/1', headers);
   */
  static delete(url: string, headers?: Record<string, string>): Cypress.Chainable<Cypress.Response<any>> {
    return cy.request({
      method: 'DELETE',
      url,
      headers: headers || {},
      failOnStatusCode: false,
    });
  }

  /**
   * Verify that the response status code matches the expected value
   * 
   * @param {Cypress.Response<any>} response - The Cypress response object to verify
   * @param {number} expectedStatus - The expected HTTP status code (e.g., 200, 201, 404)
   * @returns {void}
   * 
   * @example
   * ApiHelper.get('https://api.example.com/users/1').then((response) => {
   *   ApiHelper.verifyStatusCode(response, 200);
   * });
   */
  static verifyStatusCode(response: Cypress.Response<any>, expectedStatus: number): void {
    expect(response.status).to.eq(expectedStatus);
  }

  /**
   * Verify that the response body contains a specific property
   * 
   * @param {Cypress.Response<any>} response - The Cypress response object to verify
   * @param {string} property - The property name to check for in the response body
   * @returns {void}
   * 
   * @example
   * ApiHelper.get('https://api.example.com/users/1').then((response) => {
   *   ApiHelper.verifyBodyProperty(response, 'id');
   *   ApiHelper.verifyBodyProperty(response, 'email');
   * });
   */
  static verifyBodyProperty(response: Cypress.Response<any>, property: string): void {
    expect(response.body).to.have.property(property);
  }

  /**
   * Verify that a specific property in the response body has the expected value
   * 
   * @param {Cypress.Response<any>} response - The Cypress response object to verify
   * @param {string} property - The property name to check
   * @param {any} value - The expected value of the property
   * @returns {void}
   * 
   * @example
   * ApiHelper.get('https://api.example.com/users/1').then((response) => {
   *   ApiHelper.verifyBodyPropertyValue(response, 'id', 1);
   *   ApiHelper.verifyBodyPropertyValue(response, 'name', 'John Doe');
   * });
   */
  static verifyBodyPropertyValue(
    response: Cypress.Response<any>,
    property: string,
    value: any
  ): void {
    expect(response.body[property]).to.eq(value);
  }

  /**
   * Verify that the response contains a specific header, optionally with an expected value
   * 
   * @param {Cypress.Response<any>} response - The Cypress response object to verify
   * @param {string} headerName - The name of the header to check (case-insensitive)
   * @param {string} [expectedValue] - Optional expected value or substring that should be in the header
   * @returns {void}
   * 
   * @example
   * ApiHelper.get('https://api.example.com/users').then((response) => {
   *   // Check if header exists
   *   ApiHelper.verifyHeader(response, 'content-type');
   *   
   *   // Check header value contains substring
   *   ApiHelper.verifyHeader(response, 'content-type', 'application/json');
   * });
   */
  static verifyHeader(
    response: Cypress.Response<any>,
    headerName: string,
    expectedValue?: string
  ): void {
    expect(response.headers).to.have.property(headerName.toLowerCase());
    if (expectedValue) {
      expect(response.headers[headerName.toLowerCase()]).to.include(expectedValue);
    }
  }

  /**
   * Verify that the response time is within the specified maximum duration
   * Useful for performance testing to ensure API responses are fast enough
   * 
   * @param {Cypress.Response<any>} response - The Cypress response object to verify
   * @param {number} maxDuration - Maximum allowed duration in milliseconds
   * @returns {void}
   * 
   * @example
   * ApiHelper.get('https://api.example.com/users').then((response) => {
   *   // Verify response time is less than 2 seconds
   *   ApiHelper.verifyResponseTime(response, 2000);
   * });
   */
  static verifyResponseTime(response: Cypress.Response<any>, maxDuration: number): void {
    expect(response.duration).to.be.lessThan(maxDuration);
  }

  /**
   * Verify that the response body is an array
   * 
   * @param {Cypress.Response<any>} response - The Cypress response object to verify
   * @returns {void}
   * 
   * @example
   * ApiHelper.get('https://api.example.com/users').then((response) => {
   *   ApiHelper.verifyBodyIsArray(response);
   * });
   */
  static verifyBodyIsArray(response: Cypress.Response<any>): void {
    expect(response.body).to.be.an('array');
  }

  /**
   * Verify that the response body array has the expected length
   * 
   * @param {Cypress.Response<any>} response - The Cypress response object to verify
   * @param {number} expectedLength - The expected number of items in the array
   * @returns {void}
   * 
   * @example
   * ApiHelper.get('https://api.example.com/users').then((response) => {
   *   ApiHelper.verifyArrayLength(response, 10);
   * });
   */
  static verifyArrayLength(response: Cypress.Response<any>, expectedLength: number): void {
    expect(response.body).to.have.length(expectedLength);
  }

  /**
   * Log response details to the Cypress command log for debugging purposes
   * Logs status code, duration, and response body
   * 
   * @param {Cypress.Response<any>} response - The Cypress response object to log
   * @returns {void}
   * 
   * @example
   * ApiHelper.get('https://api.example.com/users/1').then((response) => {
   *   ApiHelper.logResponse(response);
   * });
   */
  static logResponse(response: Cypress.Response<any>): void {
    cy.log('Status:', response.status.toString());
    cy.log('Duration:', `${response.duration}ms`);
    cy.log('Body:', JSON.stringify(response.body));
  }
}

