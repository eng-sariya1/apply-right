import { faker } from '@faker-js/faker';

describe('CV Form - Fill Fields Through Abstract', () => {
  beforeEach(() => {
    // Clear any stored state and reload the page fresh
    cy.clearLocalStorage();
    cy.clearCookies();

    cy.visit('/', {
      onBeforeLoad: (win) => {
        win.sessionStorage.clear();
      }
    });

    // Wait for the page to fully load
    cy.get('[data-cy="open-form-button"]').should('be.visible');
  });

  it('should fill out form fields 1-7 in order (Full Name through Abstract)', () => {
    // Ensure the page is ready and no sidebar is open
    cy.get('body').then($body => {
      if ($body.find('.cv-form-sidebar').length > 0) {
        cy.get('.cv-form-sidebar').should('not.be.visible');
      }
    });

    // Generate realistic test data using faker
    const testData = {
      fullName: faker.person.fullName(),
      specialization: faker.person.jobTitle(),
      email: faker.internet.email(),
      phone: faker.phone.number('+1##########'),
      link: {
        name: 'LinkedIn',
        url: `https://linkedin.com/in/${faker.internet.username()}`
      },
      abstract: faker.lorem.paragraph(3)
    };

    // Step 1: Open the CV form sidebar
    cy.get('[data-cy="open-form-button"]')
      .should('be.visible')
      .click();

    // Wait for the sidebar to be fully visible and ready for interaction
    cy.get('.cv-form-sidebar')
      .should('be.visible')
      .and('have.css', 'visibility', 'visible');

    // Step 2: Fill Full Name field
    cy.get('[data-cy="fullName-input"]')
      .should('be.visible')
      .scrollIntoView()
      .clear()
      .type(testData.fullName)
      .should('have.value', testData.fullName);

    // Step 3: Fill Specialization field
    cy.get('[data-cy="specialization-input"]')
      .should('be.visible')
      .scrollIntoView()
      .clear()
      .type(testData.specialization)
      .should('have.value', testData.specialization);

    // Step 4: Fill Email field
    cy.get('[data-cy="email-input"]')
      .should('be.visible')
      .scrollIntoView()
      .clear()
      .type(testData.email)
      .should('have.value', testData.email);

    // Step 5: Fill Phone Number field
    cy.get('[data-cy="phone-input"]')
      .should('be.visible')
      .scrollIntoView()
      .clear()
      .type(testData.phone)
      .should('have.value', testData.phone);

    // Step 6: Add Link (must press "Add" after typing)
    cy.get('[data-cy="add-link-button"]')
      .should('be.visible')
      .scrollIntoView()
      .click();

    // Fill link name
    cy.get('[data-cy="link-name-input-0"]')
      .should('be.visible')
      .scrollIntoView()
      .clear()
      .type(testData.link.name)
      .should('have.value', testData.link.name);

    // Fill link URL
    cy.get('[data-cy="link-url-input-0"]')
      .should('be.visible')
      .scrollIntoView()
      .clear()
      .type(testData.link.url)
      .should('have.value', testData.link.url);

    // Step 7: Fill Abstract field (scroll into view to avoid sticky footer)
    cy.get('[data-cy="abstract-input"]')
      .should('exist')
      .scrollIntoView()
      .should('be.visible')
      .clear()
      .type(testData.abstract)
      .should('have.value', testData.abstract);

    // Verify form is filled successfully through Abstract field
    cy.log('✅ All form fields through Abstract have been filled successfully');

    // Verify the form persists data (form auto-saves via useEffect watch subscription)
    cy.get('[data-cy="fullName-input"]')
      .scrollIntoView()
      .should('have.value', testData.fullName);

    cy.get('[data-cy="specialization-input"]')
      .scrollIntoView()
      .should('have.value', testData.specialization);

    cy.get('[data-cy="email-input"]')
      .scrollIntoView()
      .should('have.value', testData.email);

    cy.get('[data-cy="phone-input"]')
      .scrollIntoView()
      .should('have.value', testData.phone);

    cy.get('[data-cy="link-name-input-0"]')
      .scrollIntoView()
      .should('have.value', testData.link.name);

    cy.get('[data-cy="link-url-input-0"]')
      .scrollIntoView()
      .should('have.value', testData.link.url);

    cy.get('[data-cy="abstract-input"]')
      .scrollIntoView()
      .should('have.value', testData.abstract);

    // Test complete - form successfully filled through Abstract field
    cy.log('✅ Test completed successfully - All fields through Abstract are filled and verified');
  });
});
