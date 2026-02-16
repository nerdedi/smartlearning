describe('SmartLearning (E2E)', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('loads the app and performs the main action', () => {
    cy.get('h1').contains('SmartLearning');
    cy.get('#actionBtn').should('be.visible').click();
    cy.get('#result').should('have.text', '2 + 3 = 5');
  });

  it('serves the manifest and icons', () => {
    cy.request('/manifest.webmanifest').its('status').should('eq', 200);
    cy.request('/icons/icon-192.png').its('status').should('eq', 200);
  });
});
