interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  body?: any;
  headers?: Record<string, string>;
  qs?: Record<string, any>;
  failOnStatusCode?: boolean;
}

interface ApiResponse {
  status: number;
  body: any;
  headers: Record<string, string>;
  duration: number;
}

export class ApiHelper {
  /**
   * Make a GET request
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
   * Make a POST request
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
   * Make a PUT request
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
   * Make a DELETE request
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
   * Verify response status code
   */
  static verifyStatusCode(response: Cypress.Response<any>, expectedStatus: number): void {
    expect(response.status).to.eq(expectedStatus);
  }

  /**
   * Verify response body contains property
   */
  static verifyBodyProperty(response: Cypress.Response<any>, property: string): void {
    expect(response.body).to.have.property(property);
  }

  /**
   * Verify response body property value
   */
  static verifyBodyPropertyValue(
    response: Cypress.Response<any>,
    property: string,
    value: any
  ): void {
    expect(response.body[property]).to.eq(value);
  }

  /**
   * Verify response header
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
   * Verify response time is within limit (in milliseconds)
   */
  static verifyResponseTime(response: Cypress.Response<any>, maxDuration: number): void {
    expect(response.duration).to.be.lessThan(maxDuration);
  }

  /**
   * Verify response body is an array
   */
  static verifyBodyIsArray(response: Cypress.Response<any>): void {
    expect(response.body).to.be.an('array');
  }

  /**
   * Verify array length
   */
  static verifyArrayLength(response: Cypress.Response<any>, expectedLength: number): void {
    expect(response.body).to.have.length(expectedLength);
  }

  /**
   * Log response details for debugging
   */
  static logResponse(response: Cypress.Response<any>): void {
    cy.log('Status:', response.status.toString());
    cy.log('Duration:', `${response.duration}ms`);
    cy.log('Body:', JSON.stringify(response.body));
  }
}

