import { faker } from '@faker-js/faker';

describe('CV Form - Complete Form Submission', () => {
  beforeEach(() => {
    // Clear any stored state and reload the page fresh with cache busting
    cy.clearLocalStorage();
    cy.clearCookies();

    // Use reload to ensure complete page refresh
    cy.visit('/', {
      onBeforeLoad: (win) => {
        // Clear any window state
        win.sessionStorage.clear();
      }
    });

    // Wait for the page to fully load
    cy.get('[data-cy="open-form-button"]').should('be.visible');
  });

  afterEach(() => {
    // Simple cleanup: just close the sidebar if it's open
    // The beforeEach will handle full page reload for clean state
    cy.get('body').then($body => {
      if ($body.find('.cv-form-sidebar:visible').length > 0) {
        cy.log('Cleaning up: Closing sidebar...');

        // Click the X icon button in the sidebar header (PrimeReact default)
        // Or try to find the Close button
        cy.get('.cv-form-sidebar').then($sidebar => {
          // Try the X icon first
          const closeIcon = $sidebar.find('.p-sidebar-close');
          if (closeIcon.length > 0) {
            cy.wrap(closeIcon).click({ force: true });
          } else {
            // Fall back to Close button
            cy.wrap($sidebar).find('button:contains("Close")').click({ force: true });
          }
        });

        // Wait for sidebar close animation
        cy.get('.cv-form-sidebar', { timeout: 3000 }).should('not.be.visible');
        cy.log('Cleanup complete');
      }
    });
  });

  it('should fill out the CV form fields in order through Abstract field', () => {
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
  });

  it('should validate required fields and show error messages', () => {
    // Ensure the page is ready and no sidebar is open
    cy.get('body').then($body => {
      if ($body.find('.cv-form-sidebar').length > 0) {
        cy.get('.cv-form-sidebar').should('not.be.visible');
      }
    });

    // Open the form
    cy.get('[data-cy="open-form-button"]')
      .should('be.visible')
      .click();

    cy.get('.cv-form-sidebar').should('be.visible');

    // The form starts empty, so required fields should show errors when touched
    // Fill and clear to trigger validation
    cy.get('[data-cy="fullName-input"]')
      .should('be.visible')
      .scrollIntoView()
      .focus()
      .type('John Doe')
      .clear()
      .blur();

    // Check if error message appears - it's in a <small> tag with class text-red-500
    // The error appears as a sibling to the input within the .field div
    cy.get('[data-cy="fullName-input"]')
      .parents('.field')
      .find('small.text-red-500')
      .should('be.visible')
      .and('contain.text', 'Full name is required');

    // Test email validation pattern
    cy.get('[data-cy="email-input"]')
      .should('be.visible')
      .scrollIntoView()
      .focus()
      .type('invalid-email')
      .blur();

    // Should show invalid email error
    cy.get('[data-cy="email-input"]')
      .parents('.field')
      .find('small.text-red-500')
      .should('be.visible')
      .and('contain.text', 'Invalid email address');
  });

  it('should handle form reset correctly', () => {
    // Ensure the page is ready and no sidebar is open
    cy.get('body').then($body => {
      if ($body.find('.cv-form-sidebar').length > 0) {
        cy.get('.cv-form-sidebar').should('not.be.visible');
      }
    });

    const testName = faker.person.fullName();
    const testEmail = faker.internet.email();
    const testSkill = 'React';

    // Open the form and fill multiple fields
    cy.get('[data-cy="open-form-button"]')
      .should('be.visible')
      .click();

    cy.get('.cv-form-sidebar').should('be.visible');

    // Fill name
    cy.get('[data-cy="fullName-input"]')
      .should('be.visible')
      .scrollIntoView()
      .clear()
      .type(testName)
      .should('have.value', testName);

    // Fill email
    cy.get('[data-cy="email-input"]')
      .should('be.visible')
      .scrollIntoView()
      .clear()
      .type(testEmail)
      .should('have.value', testEmail);

    // Add a skill
    cy.get('[data-cy="skills-input"]', { timeout: 10000 })
      .should('exist')
      .should('be.visible')
      .scrollIntoView()
      .find('input.p-inputtext')
      .should('be.visible')
      .click()
      .type(`${testSkill}{enter}`);

    // Verify skill was added
    cy.get('[data-cy="skills-input"]')
      .find('.p-chip-text')
      .contains(testSkill)
      .should('be.visible');

    // Scroll to reset button and click it
    cy.contains('button', 'Reset')
      .should('be.visible')
      .scrollIntoView()
      .click();

    // Verify fields are cleared
    // Note: We use a more flexible check since the form auto-saves
    cy.get('[data-cy="fullName-input"]')
      .should('be.visible')
      .scrollIntoView()
      .should('have.value', '');

    cy.get('[data-cy="email-input"]')
      .should('be.visible')
      .scrollIntoView()
      .should('have.value', '');

    // Verify skills are cleared
    cy.get('[data-cy="skills-input"]')
      .find('.p-chip')
      .should('not.exist');
  });
});
