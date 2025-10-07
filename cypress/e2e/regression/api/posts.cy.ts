import { ApiHelper } from '../../../utils/api-helper';

describe('API Tests - Posts', () => {
  const baseUrl = 'https://jsonplaceholder.typicode.com';

  it('should create a new post', () => {
    const newPost = {
      title: 'Test Post Title',
      body: 'This is a test post body',
      userId: 1,
    };

    ApiHelper.post(`${baseUrl}/posts`, newPost).then((response) => {
      // Verify status code
      ApiHelper.verifyStatusCode(response, 201);

      // Verify response contains the data we sent
      ApiHelper.verifyBodyProperty(response, 'id');
      ApiHelper.verifyBodyPropertyValue(response, 'title', newPost.title);
      ApiHelper.verifyBodyPropertyValue(response, 'body', newPost.body);
      ApiHelper.verifyBodyPropertyValue(response, 'userId', newPost.userId);

      // Log the created post
      cy.log('Created post:', JSON.stringify(response.body));
    });
  });

  it('should update an existing post', () => {
    const postId = 1;
    const updatedData = {
      id: postId,
      title: 'Updated Post Title',
      body: 'Updated post body',
      userId: 1,
    };

    ApiHelper.put(`${baseUrl}/posts/${postId}`, updatedData).then((response) => {
      // Verify status code
      ApiHelper.verifyStatusCode(response, 200);

      // Verify updated values
      ApiHelper.verifyBodyPropertyValue(response, 'title', updatedData.title);
      ApiHelper.verifyBodyPropertyValue(response, 'body', updatedData.body);

      // Verify response time
      ApiHelper.verifyResponseTime(response, 2000);
    });
  });

  it('should delete a post', () => {
    const postId = 1;

    ApiHelper.delete(`${baseUrl}/posts/${postId}`).then((response) => {
      // Verify status code
      ApiHelper.verifyStatusCode(response, 200);

      cy.log('Post deleted successfully');
    });
  });
});

