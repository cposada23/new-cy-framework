describe('Google Smoke Test', () => {
  it('should load Google homepage', () => {
    cy.visit('https://www.google.com')
    cy.title().should('include', 'Google')
  })
})

