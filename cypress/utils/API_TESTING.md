# API Testing Guide

This guide explains how to use the API testing utilities in the Cypress framework.

## 📋 Overview

The API testing utilities allow you to:
- Make HTTP requests (GET, POST, PUT, DELETE)
- Validate API responses and status codes
- Test API performance and response times
- Verify headers and response structure
- Integrate API tests with E2E tests

## 🚀 Quick Start

### 1. Import the Helper

```typescript
import { ApiHelper } from '../../utils/api-helper';
```

### 2. Make Your First API Request

```typescript
describe('API Tests', () => {
  it('should get user data', () => {
    ApiHelper.get('https://jsonplaceholder.typicode.com/users/1').then((response) => {
      ApiHelper.verifyStatusCode(response, 200);
      ApiHelper.verifyBodyProperty(response, 'id');
      ApiHelper.verifyBodyProperty(response, 'email');
    });
  });
});
```

## 📚 ApiHelper API Reference

### HTTP Methods

#### `get(url: string, headers?: object): Cypress.Chainable<Response>`

Make a GET request to retrieve data.

**Parameters:**
- `url` - The API endpoint URL
- `headers` - Optional HTTP headers

**Example:**
```typescript
// Basic GET request
ApiHelper.get('https://api.example.com/users/1').then((response) => {
  expect(response.status).to.eq(200);
});

// GET with custom headers
const headers = { 'Authorization': 'Bearer token123' };
ApiHelper.get('https://api.example.com/protected', headers).then((response) => {
  ApiHelper.verifyStatusCode(response, 200);
});
```

#### `post(url: string, body: any, headers?: object): Cypress.Chainable<Response>`

Make a POST request to create new resources.

**Parameters:**
- `url` - The API endpoint URL
- `body` - Request body (will be JSON stringified)
- `headers` - Optional HTTP headers

**Example:**
```typescript
const newUser = {
  name: 'John Doe',
  email: 'john@example.com',
  role: 'user'
};

ApiHelper.post('https://api.example.com/users', newUser).then((response) => {
  ApiHelper.verifyStatusCode(response, 201);
  ApiHelper.verifyBodyProperty(response, 'id');
  ApiHelper.verifyBodyPropertyValue(response, 'name', newUser.name);
});
```

#### `put(url: string, body: any, headers?: object): Cypress.Chainable<Response>`

Make a PUT request to update existing resources.

**Parameters:**
- `url` - The API endpoint URL
- `body` - Request body with updated data
- `headers` - Optional HTTP headers

**Example:**
```typescript
const updatedUser = {
  id: 1,
  name: 'Jane Doe',
  email: 'jane@example.com'
};

ApiHelper.put('https://api.example.com/users/1', updatedUser).then((response) => {
  ApiHelper.verifyStatusCode(response, 200);
  ApiHelper.verifyBodyPropertyValue(response, 'name', 'Jane Doe');
});
```

#### `delete(url: string, headers?: object): Cypress.Chainable<Response>`

Make a DELETE request to remove resources.

**Parameters:**
- `url` - The API endpoint URL
- `headers` - Optional HTTP headers

**Example:**
```typescript
ApiHelper.delete('https://api.example.com/users/1').then((response) => {
  ApiHelper.verifyStatusCode(response, 200);
});

// Verify deletion
ApiHelper.get('https://api.example.com/users/1').then((response) => {
  ApiHelper.verifyStatusCode(response, 404);
});
```

### Verification Methods

#### `verifyStatusCode(response: Response, expectedStatus: number): void`

Verify the HTTP status code.

**Example:**
```typescript
ApiHelper.get('https://api.example.com/users').then((response) => {
  ApiHelper.verifyStatusCode(response, 200); // OK
});

ApiHelper.post('https://api.example.com/users', userData).then((response) => {
  ApiHelper.verifyStatusCode(response, 201); // Created
});

ApiHelper.get('https://api.example.com/not-found').then((response) => {
  ApiHelper.verifyStatusCode(response, 404); // Not Found
});
```

#### `verifyBodyProperty(response: Response, property: string): void`

Verify that a property exists in the response body.

**Example:**
```typescript
ApiHelper.get('https://api.example.com/users/1').then((response) => {
  ApiHelper.verifyBodyProperty(response, 'id');
  ApiHelper.verifyBodyProperty(response, 'name');
  ApiHelper.verifyBodyProperty(response, 'email');
  ApiHelper.verifyBodyProperty(response, 'address');
});
```

#### `verifyBodyPropertyValue(response: Response, property: string, value: any): void`

Verify that a property has a specific value.

**Example:**
```typescript
ApiHelper.get('https://api.example.com/users/1').then((response) => {
  ApiHelper.verifyBodyPropertyValue(response, 'id', 1);
  ApiHelper.verifyBodyPropertyValue(response, 'name', 'John Doe');
  ApiHelper.verifyBodyPropertyValue(response, 'active', true);
});
```

#### `verifyHeader(response: Response, headerName: string, expectedValue?: string): void`

Verify response headers.

**Example:**
```typescript
ApiHelper.get('https://api.example.com/users').then((response) => {
  // Check if header exists
  ApiHelper.verifyHeader(response, 'content-type');
  
  // Check header value contains substring
  ApiHelper.verifyHeader(response, 'content-type', 'application/json');
  ApiHelper.verifyHeader(response, 'cache-control', 'no-cache');
});
```

#### `verifyResponseTime(response: Response, maxDuration: number): void`

Verify that the response time is within acceptable limits (performance testing).

**Example:**
```typescript
ApiHelper.get('https://api.example.com/users').then((response) => {
  // Response should be faster than 2 seconds
  ApiHelper.verifyResponseTime(response, 2000);
});

ApiHelper.get('https://api.example.com/search?q=test').then((response) => {
  // Search should be fast (under 500ms)
  ApiHelper.verifyResponseTime(response, 500);
});
```

#### `verifyBodyIsArray(response: Response): void`

Verify that the response body is an array.

**Example:**
```typescript
ApiHelper.get('https://api.example.com/users').then((response) => {
  ApiHelper.verifyBodyIsArray(response);
});
```

#### `verifyArrayLength(response: Response, expectedLength: number): void`

Verify the length of an array response.

**Example:**
```typescript
ApiHelper.get('https://api.example.com/users?limit=10').then((response) => {
  ApiHelper.verifyArrayLength(response, 10);
});
```

#### `logResponse(response: Response): void`

Log response details for debugging.

**Example:**
```typescript
ApiHelper.get('https://api.example.com/users/1').then((response) => {
  ApiHelper.logResponse(response);
  // Logs: Status: 200, Duration: 150ms, Body: {...}
});
```

## 💡 Common Use Cases

### 1. Basic CRUD Operations

```typescript
describe('User API - CRUD Operations', () => {
  let userId: number;

  it('should create a new user', () => {
    const newUser = {
      name: 'Test User',
      email: 'test@example.com',
      role: 'admin'
    };

    ApiHelper.post('https://api.example.com/users', newUser).then((response) => {
      ApiHelper.verifyStatusCode(response, 201);
      ApiHelper.verifyBodyProperty(response, 'id');
      ApiHelper.verifyBodyPropertyValue(response, 'name', newUser.name);
      
      // Store ID for later tests
      userId = response.body.id;
    });
  });

  it('should read the created user', () => {
    ApiHelper.get(`https://api.example.com/users/${userId}`).then((response) => {
      ApiHelper.verifyStatusCode(response, 200);
      ApiHelper.verifyBodyPropertyValue(response, 'id', userId);
    });
  });

  it('should update the user', () => {
    const updatedData = {
      name: 'Updated User',
      email: 'updated@example.com'
    };

    ApiHelper.put(`https://api.example.com/users/${userId}`, updatedData).then((response) => {
      ApiHelper.verifyStatusCode(response, 200);
      ApiHelper.verifyBodyPropertyValue(response, 'name', 'Updated User');
    });
  });

  it('should delete the user', () => {
    ApiHelper.delete(`https://api.example.com/users/${userId}`).then((response) => {
      ApiHelper.verifyStatusCode(response, 200);
    });

    // Verify deletion
    ApiHelper.get(`https://api.example.com/users/${userId}`).then((response) => {
      ApiHelper.verifyStatusCode(response, 404);
    });
  });
});
```

### 2. Testing Authentication

```typescript
describe('Authentication API', () => {
  let authToken: string;

  it('should login successfully', () => {
    const credentials = {
      email: 'user@example.com',
      password: 'password123'
    };

    ApiHelper.post('https://api.example.com/auth/login', credentials).then((response) => {
      ApiHelper.verifyStatusCode(response, 200);
      ApiHelper.verifyBodyProperty(response, 'token');
      
      authToken = response.body.token;
      expect(authToken).to.be.a('string');
    });
  });

  it('should access protected route with token', () => {
    const headers = {
      'Authorization': `Bearer ${authToken}`
    };

    ApiHelper.get('https://api.example.com/profile', headers).then((response) => {
      ApiHelper.verifyStatusCode(response, 200);
      ApiHelper.verifyBodyProperty(response, 'user');
    });
  });

  it('should fail without token', () => {
    ApiHelper.get('https://api.example.com/profile').then((response) => {
      ApiHelper.verifyStatusCode(response, 401);
    });
  });
});
```

### 3. Testing Pagination

```typescript
describe('Pagination API', () => {
  it('should return paginated results', () => {
    ApiHelper.get('https://api.example.com/users?page=1&limit=10').then((response) => {
      ApiHelper.verifyStatusCode(response, 200);
      ApiHelper.verifyBodyIsArray(response);
      ApiHelper.verifyArrayLength(response, 10);
    });
  });

  it('should return correct page', () => {
    ApiHelper.get('https://api.example.com/users?page=2&limit=5').then((response) => {
      ApiHelper.verifyStatusCode(response, 200);
      expect(response.body.length).to.be.lessThan(6);
    });
  });
});
```

### 4. Error Handling

```typescript
describe('Error Handling', () => {
  it('should return 400 for invalid data', () => {
    const invalidUser = {
      name: '', // Empty name
      email: 'not-an-email' // Invalid email
    };

    ApiHelper.post('https://api.example.com/users', invalidUser).then((response) => {
      ApiHelper.verifyStatusCode(response, 400);
      ApiHelper.verifyBodyProperty(response, 'errors');
    });
  });

  it('should return 404 for non-existent resource', () => {
    ApiHelper.get('https://api.example.com/users/99999').then((response) => {
      ApiHelper.verifyStatusCode(response, 404);
    });
  });

  it('should return 409 for duplicate resource', () => {
    const userData = {
      email: 'existing@example.com'
    };

    // Create first user
    ApiHelper.post('https://api.example.com/users', userData).then(() => {
      // Try to create duplicate
      ApiHelper.post('https://api.example.com/users', userData).then((response) => {
        ApiHelper.verifyStatusCode(response, 409);
      });
    });
  });
});
```

### 5. Integration with E2E Tests

```typescript
describe('E2E with API Setup', () => {
  let testUser: any;

  // Use API to create test data
  before(() => {
    const userData = {
      name: 'E2E Test User',
      email: 'e2e@test.com',
      password: 'password123'
    };

    ApiHelper.post('https://api.example.com/users', userData).then((response) => {
      testUser = response.body;
    });
  });

  it('should login via UI with API-created user', () => {
    cy.visit('/login');
    cy.get('[data-test="email"]').type(testUser.email);
    cy.get('[data-test="password"]').type('password123');
    cy.get('[data-test="submit"]').click();
    
    cy.url().should('include', '/dashboard');
  });

  // Clean up test data via API
  after(() => {
    ApiHelper.delete(`https://api.example.com/users/${testUser.id}`);
  });
});
```

### 6. Testing Complex Workflows

```typescript
describe('Order Workflow', () => {
  let orderId: number;

  it('should create an order', () => {
    const order = {
      customerId: 1,
      items: [
        { productId: 101, quantity: 2 },
        { productId: 102, quantity: 1 }
      ]
    };

    ApiHelper.post('https://api.example.com/orders', order).then((response) => {
      ApiHelper.verifyStatusCode(response, 201);
      ApiHelper.verifyBodyProperty(response, 'id');
      ApiHelper.verifyBodyPropertyValue(response, 'status', 'pending');
      
      orderId = response.body.id;
    });
  });

  it('should update order status', () => {
    ApiHelper.put(`https://api.example.com/orders/${orderId}/status`, {
      status: 'processing'
    }).then((response) => {
      ApiHelper.verifyStatusCode(response, 200);
      ApiHelper.verifyBodyPropertyValue(response, 'status', 'processing');
    });
  });

  it('should get order details', () => {
    ApiHelper.get(`https://api.example.com/orders/${orderId}`).then((response) => {
      ApiHelper.verifyStatusCode(response, 200);
      ApiHelper.verifyBodyProperty(response, 'items');
      expect(response.body.items).to.have.length(2);
    });
  });
});
```

### 7. Performance Testing

```typescript
describe('API Performance', () => {
  it('should respond quickly to list requests', () => {
    ApiHelper.get('https://api.example.com/products').then((response) => {
      ApiHelper.verifyStatusCode(response, 200);
      ApiHelper.verifyResponseTime(response, 1000); // Under 1 second
    });
  });

  it('should handle search efficiently', () => {
    ApiHelper.get('https://api.example.com/search?q=test').then((response) => {
      ApiHelper.verifyStatusCode(response, 200);
      ApiHelper.verifyResponseTime(response, 500); // Under 500ms
    });
  });

  it('should cache responses', () => {
    let firstDuration: number;

    // First request
    ApiHelper.get('https://api.example.com/users/1').then((response) => {
      firstDuration = response.duration;
    });

    // Second request (should be faster if cached)
    ApiHelper.get('https://api.example.com/users/1').then((response) => {
      expect(response.duration).to.be.lessThan(firstDuration);
      ApiHelper.verifyHeader(response, 'cache-control');
    });
  });
});
```

## 🎯 Best Practices

### 1. **Use Environment Variables for URLs**

```typescript
const baseUrl = Cypress.config('baseUrl') || 'https://api.example.com';

ApiHelper.get(`${baseUrl}/users/1`);
```

### 2. **Store Common Headers**

```typescript
const authHeaders = {
  'Authorization': `Bearer ${Cypress.env('API_TOKEN')}`,
  'Content-Type': 'application/json'
};

ApiHelper.get('https://api.example.com/profile', authHeaders);
```

### 3. **Create Helper Functions for Common Operations**

```typescript
// Create a custom helper
function createUser(userData: any) {
  return ApiHelper.post('https://api.example.com/users', userData)
    .then((response) => {
      ApiHelper.verifyStatusCode(response, 201);
      return response.body;
    });
}

// Use it in tests
it('should create user easily', () => {
  createUser({ name: 'Test', email: 'test@test.com' }).then((user) => {
    expect(user.id).to.exist;
  });
});
```

### 4. **Chain API Calls**

```typescript
it('should chain multiple API calls', () => {
  ApiHelper.post('https://api.example.com/users', userData)
    .then((createResponse) => {
      const userId = createResponse.body.id;
      
      return ApiHelper.get(`https://api.example.com/users/${userId}`);
    })
    .then((getResponse) => {
      ApiHelper.verifyStatusCode(getResponse, 200);
      ApiHelper.verifyBodyProperty(getResponse, 'name');
    });
});
```

### 5. **Use Fixtures for Test Data**

```typescript
it('should use fixture data', () => {
  cy.fixture('user.json').then((userData) => {
    ApiHelper.post('https://api.example.com/users', userData).then((response) => {
      ApiHelper.verifyStatusCode(response, 201);
    });
  });
});
```

### 6. **Clean Up Test Data**

```typescript
describe('User Tests', () => {
  const createdUsers: number[] = [];

  afterEach(() => {
    // Clean up all created users
    createdUsers.forEach((userId) => {
      ApiHelper.delete(`https://api.example.com/users/${userId}`);
    });
  });

  it('should create user', () => {
    ApiHelper.post('https://api.example.com/users', userData).then((response) => {
      createdUsers.push(response.body.id);
    });
  });
});
```

## 🐛 Troubleshooting

### CORS Errors

If you encounter CORS errors:

```typescript
// Add to cypress.config.ts
e2e: {
  chromeWebSecurity: false
}
```

### SSL Certificate Errors

For self-signed certificates:

```typescript
// Set environment variable
Cypress.env('NODE_TLS_REJECT_UNAUTHORIZED', '0');
```

### Request Timeouts

Increase timeout for slow APIs:

```typescript
ApiHelper.get('https://slow-api.example.com/data', {}).then(
  { timeout: 30000 } // 30 seconds
);
```

### Debugging Responses

Use the log helper to debug:

```typescript
ApiHelper.get('https://api.example.com/users/1').then((response) => {
  ApiHelper.logResponse(response);
  console.log('Full response:', response);
});
```

## 📊 Response Structure

The Cypress response object contains:

```typescript
{
  status: 200,              // HTTP status code
  statusText: 'OK',         // Status message
  body: {...},              // Response body (parsed JSON)
  headers: {...},           // Response headers
  duration: 150,            // Request duration in ms
  requestHeaders: {...},    // Request headers sent
  requestBody: {...}        // Request body sent
}
```

## 🔗 Additional Resources

- [Cypress Network Requests](https://docs.cypress.io/api/commands/request)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [REST API Best Practices](https://restfulapi.net/)
- [API Testing Guide](https://www.cypress.io/blog/2021/11/12/api-testing-with-cypress/)

## 📝 Example Test Suite Structure

```
cypress/e2e/regression/api/
├── auth/
│   ├── login.cy.ts
│   └── logout.cy.ts
├── users/
│   ├── create.cy.ts
│   ├── read.cy.ts
│   ├── update.cy.ts
│   └── delete.cy.ts
├── products/
│   └── products.cy.ts
└── orders/
    └── orders.cy.ts
```

Happy API Testing! 🚀

