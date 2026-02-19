/* eslint-env mocha */
/* global cy, describe, it, beforeEach */
import 'cypress-axe'

describe('SmartLearning (E2E)', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('loads the app and performs the main action', () => {
    cy.get('h1').contains('SmartLearning')
    cy.get('#actionBtn').should('be.visible').click()
    cy.get('#result').should('have.text', '2 + 3 = 5')
  })

  it('serves the manifest and icons', () => {
    cy.request('/manifest.webmanifest').its('status').should('eq', 200)
    cy.request('/icons/icon-192.png').its('status').should('eq', 200)
  })

  it('opens the Adventure game page', () => {
    cy.get('#nav-game').should('have.attr', 'href', 'game/index.html')
    cy.visit('/game/index.html')
    cy.get('#start-adventure').should('be.visible')
  })

  it('accessibility: settings toggles apply visual modes', () => {
    cy.visit('/game/index.html')
    cy.get('#open-settings').should('be.visible').click()
    cy.get('#setting-contrast').check().should('be.checked')
    cy.get('body').should('have.class', 'high-contrast')
    cy.get('#setting-large-text').check().should('be.checked')
    cy.get('body').should('have.class', 'large-text')
    cy.get('#setting-dyslexic').check().should('be.checked')
    cy.get('body').should('have.class', 'dyslexic-font')
  })

  it('a11y: main & game pages should have no critical violations', () => {
    cy.visit('/')
    cy.injectAxe()
    cy.checkA11y(null, { includedImpacts: ['critical'] })

    cy.visit('/game/index.html')
    cy.injectAxe()
    cy.checkA11y()
  })

  it('game UI: start level and pause/resume', () => {
    cy.visit('/game/index.html')
    cy.get('#start-adventure').click()
    cy.get('#hub-screen button[data-world]').first().click()
    cy.get('#level-grid button[data-level]').first().click()

    cy.get('#game-hud').should('be.visible')
    cy.get('#pause-btn').should('be.visible').click()
    cy.get('#pause-modal').should('be.visible')
    cy.get('#resume-btn').click()
    cy.get('#pause-modal').should('not.be.visible')
  })
})
