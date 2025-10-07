describe('Regression Test - Example', () => {
  beforeEach(() => {
    cy.visit('https://example.cypress.io/todo')
  })

  it('should display the todo app correctly', () => {
    cy.get('.header h1').should('be.visible').and('contain', 'todos')
    cy.get('.new-todo').should('be.visible')
    cy.get('.todo-list').should('exist')
  })

  it('should add a new todo item', () => {
    const todoText = 'Write regression tests'
    
    cy.get('[data-test="new-todo"]').type(`${todoText}{enter}`)
    cy.get('.todo-list li').last().should('contain', todoText)
  })

  it('should mark todo as completed', () => {
    cy.get('.todo-list li').first().find('.toggle').check()
    cy.get('.todo-list li').first().should('have.class', 'completed')
  })

  it('should filter active todos', () => {
    cy.get('.todo-list li').first().find('.toggle').check()
    cy.contains('Active').click()
    cy.get('.todo-list li').should('have.length', 1)
    cy.get('.todo-list li').should('not.have.class', 'completed')
  })

  it('should delete a todo item', () => {
    cy.get('.todo-list li').first().trigger('mouseover').find('.destroy').click({ force: true })
    cy.get('.todo-list li').should('have.length', 1)
  })
})

