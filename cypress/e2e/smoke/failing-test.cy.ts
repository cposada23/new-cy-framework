describe('Failing Smoke Test - Screenshot Demo', () => {
  it('should fail and capture a screenshot', () => {
    cy.visit('https://www.google.com')
    cy.title().should('include', 'Google')
    
    // This assertion will fail to demonstrate screenshot capture
    cy.get('body').should('contain', 'This text does not exist on the page')
  })

  it('should fail with wrong URL to capture screenshot', () => {
    cy.visit('https://example.cypress.io/todo')
    
    // This will fail
    cy.get('.todo-list').should('not.exist')
  })
})

