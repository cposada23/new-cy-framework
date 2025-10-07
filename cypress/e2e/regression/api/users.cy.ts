import { ApiHelper } from '../../../utils/api-helper';

describe('API Tests - Users', () => {
  const baseUrl = 'https://jsonplaceholder.typicode.com';

  it('should get list of users', () => {
    ApiHelper.get(`${baseUrl}/users`).then((response) => {
      // Verify status code
      ApiHelper.verifyStatusCode(response, 200);

      // Verify response is an array
      ApiHelper.verifyBodyIsArray(response);

      // Verify array has 10 users
      ApiHelper.verifyArrayLength(response, 10);

      // Verify response time
      ApiHelper.verifyResponseTime(response, 2000);

      // Verify headers
      ApiHelper.verifyHeader(response, 'content-type', 'application/json');
    });
  });

  it('should get a single user by id', () => {
    const userId = 1;

    ApiHelper.get(`${baseUrl}/users/${userId}`).then((response) => {
      // Verify status code
      ApiHelper.verifyStatusCode(response, 200);

      // Verify user properties
      ApiHelper.verifyBodyProperty(response, 'id');
      ApiHelper.verifyBodyProperty(response, 'name');
      ApiHelper.verifyBodyProperty(response, 'email');
      ApiHelper.verifyBodyProperty(response, 'username');

      // Verify specific values
      ApiHelper.verifyBodyPropertyValue(response, 'id', userId);

      // Log response for debugging
      cy.log('User details:', JSON.stringify(response.body));
    });
  });
});

