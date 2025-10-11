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
    // Ensure the page is ready and no sidebar is open


    // Generate realistic test data using faker
    const testData = {
      skills: [
        faker.helpers.arrayElement(['React', 'Vue', 'Angular', 'Svelte']),
        faker.helpers.arrayElement(['TypeScript', 'JavaScript', 'Python', 'Java']),
        faker.helpers.arrayElement(['Node.js', 'Express', 'NestJS', 'FastAPI']),
        faker.helpers.arrayElement(['MongoDB', 'PostgreSQL', 'MySQL', 'Redis'])
      ],
      career: {
        startDate: faker.date.past({ years: 5 }).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
        endDate: faker.date.recent({ days: 30 }).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
        location: `${faker.location.city()}, ${faker.location.country()}`,
        companyName: faker.company.name(),
        workSpecialization: faker.person.jobTitle(),
        jobType: faker.helpers.arrayElement(['Full time', 'Part time', 'Contract', 'Freelance']),
        summarization: faker.lorem.paragraph(2)
      }
    };

    // Step 2: Fill Skills field
    // First scroll to make the element visible within the fixed sidebar
    cy.get('[data-cy="skills-input"]')
        .scrollIntoView()
        .should('be.visible');

    // Add each skill by typing and pressing Enter
    testData.skills.forEach((skill) => {
      cy.get('[data-cy="skills-input"]')
          .scrollIntoView()
          .find('input[type="text"]')
          .should('be.visible')
          .type(`${skill}{enter}`, { force: true })
          .wait(100); // Small wait to ensure skill is added
    });

    // Verify skills were added by checking for skill chips
    testData.skills.forEach((skill) => {
      cy.get('[data-cy="skills-input"]')
          .scrollIntoView()
          .should('contain', skill);
    });

    // Step 3: Click "Add Career" button
    cy.get('[data-cy="add-career-button"]')
        .should('be.visible')
        .scrollIntoView()
        .click();

    // Wait for the career entry to be added
    cy.wait(200);

    // Step 4: Click on "Career Entry 1" header to expand the accordion
    cy.get('[data-cy="career-entry-header-0"]')
        .should('be.visible')
        .scrollIntoView()
        .click();

    // Wait for accordion to expand
    cy.wait(300);

    // Step 5: Fill all career fields with faker data

    // Fill Start Date
    cy.get('[data-cy="career-startDate-input-0"]')
        .should('be.visible')
        .scrollIntoView()
        .clear()
        .type(testData.career.startDate)
        .should('have.value', testData.career.startDate);

    // Fill End Date
    cy.get('[data-cy="career-endDate-input-0"]')
        .should('be.visible')
        .scrollIntoView()
        .clear()
        .type(testData.career.endDate)
        .should('have.value', testData.career.endDate);

    // Fill Location
    cy.get('[data-cy="career-location-input-0"]')
        .should('be.visible')
        .scrollIntoView()
        .clear()
        .type(testData.career.location)
        .should('have.value', testData.career.location);

    // Fill Company Name
    cy.get('[data-cy="career-companyName-input-0"]')
        .should('be.visible')
        .scrollIntoView()
        .clear()
        .type(testData.career.companyName)
        .should('have.value', testData.career.companyName);

    // Fill Work Specialization
    cy.get('[data-cy="career-workSpecialization-input-0"]')
        .should('be.visible')
        .scrollIntoView()
        .clear()
        .type(testData.career.workSpecialization)
        .should('have.value', testData.career.workSpecialization);

    // Select Job Type from dropdown
    cy.get('[data-cy="career-jobType-dropdown-0"]')
        .should('be.visible')
        .scrollIntoView()
        .click();

    // Wait for dropdown to open
    cy.wait(200);

    // Select the job type from the dropdown menu
    cy.get('.p-dropdown-panel')
        .should('be.visible')
        .contains(testData.career.jobType)
        .click();

    // Fill Work Summary
    cy.get('[data-cy="career-summarization-input-0"]')
        .should('be.visible')
        .scrollIntoView()
        .clear()
        .type(testData.career.summarization)
        .should('have.value', testData.career.summarization);

    // Verify all career fields are filled
    cy.log('✅ Skills field filled successfully');
    cy.log('✅ Career entry created and all fields filled successfully');

    // Verify the form persists data
    cy.get('[data-cy="career-startDate-input-0"]')
        .scrollIntoView()
        .should('have.value', testData.career.startDate);

    cy.get('[data-cy="career-endDate-input-0"]')
        .scrollIntoView()
        .should('have.value', testData.career.endDate);

    cy.get('[data-cy="career-location-input-0"]')
        .scrollIntoView()
        .should('have.value', testData.career.location);

    cy.get('[data-cy="career-companyName-input-0"]')
        .scrollIntoView()
        .should('have.value', testData.career.companyName);

    cy.get('[data-cy="career-workSpecialization-input-0"]')
        .scrollIntoView()
        .should('have.value', testData.career.workSpecialization);

    cy.get('[data-cy="career-summarization-input-0"]')
        .scrollIntoView()
        .should('have.value', testData.career.summarization);

    // Test complete
    cy.log('✅ Test completed successfully - Skills and Career fields are filled and verified');

    // Generate realistic test data using faker
    const testData = {
      project: {
        title: faker.commerce.productName(),
        description: faker.lorem.paragraph(3),
        technologies: [
          faker.helpers.arrayElement(['React', 'Vue', 'Angular']),
          faker.helpers.arrayElement(['TypeScript', 'JavaScript']),
          faker.helpers.arrayElement(['Node.js', 'Python', 'Go'])
        ].join(', '),
        keyFeatures: [
          faker.hacker.phrase(),
          faker.hacker.phrase(),
          faker.hacker.phrase()
        ]
      },
      education: `${faker.helpers.arrayElement(['Bachelor of Science', 'Master of Science', 'PhD'])} in ${faker.helpers.arrayElement(['Computer Science', 'Software Engineering', 'Information Technology'])}\n${faker.company.name()} University\n${faker.date.past({ years: 10 }).getFullYear()} - ${faker.date.past({ years: 5 }).getFullYear()}\n\n${faker.lorem.paragraph(2)}`
    };

    // Step 2: Scroll to and click "Add Project" button
    cy.get('[data-cy="add-project-button"]')
        .scrollIntoView()
        .should('be.visible')
        .click({ force: true });

    // Wait for the project entry to be added
    cy.wait(200);

    // Step 3: Click on "Project 1" header to expand the accordion
    cy.get('[data-cy="project-entry-header-0"]')
        .should('be.visible')
        .scrollIntoView()
        .click();

    // Wait for accordion to expand
    cy.wait(300);

    // Step 4: Fill all project fields with faker data

    // Fill Project Title
    cy.get('[data-cy="project-title-input-0"]')
        .should('be.visible')
        .scrollIntoView()
        .clear()
        .type(testData.project.title)
        .should('have.value', testData.project.title);

    // Fill Project Description
    cy.get('[data-cy="project-description-input-0"]')
        .should('be.visible')
        .scrollIntoView()
        .clear()
        .type(testData.project.description)
        .should('have.value', testData.project.description);

    // Fill Project Technologies
    cy.get('[data-cy="project-technologies-input-0"]')
        .should('be.visible')
        .scrollIntoView()
        .clear()
        .type(testData.project.technologies)
        .should('have.value', testData.project.technologies);

    // Fill Key Features (Chips component)
    cy.get('[data-cy="project-keyFeatures-input-0"]')
        .should('be.visible')
        .scrollIntoView();

    // Add each key feature by typing and pressing Enter
    testData.project.keyFeatures.forEach((feature) => {
      cy.get('[data-cy="project-keyFeatures-input-0"]')
          .scrollIntoView()
          .find('input[type="text"]')
          .should('be.visible')
          .type(`${feature}{enter}`, { force: true })
          .wait(100); // Small wait to ensure feature is added
    });

    // Verify key features were added
    testData.project.keyFeatures.forEach((feature) => {
      cy.get('[data-cy="project-keyFeatures-input-0"]')
          .scrollIntoView()
          .should('contain', feature);
    });

    cy.log('✅ Personal Project fields filled successfully');

    // Step 5: Fill Education field
    cy.get('[data-cy="education-input"]')
        .should('be.visible')
        .scrollIntoView()
        .clear()
        .type(testData.education)
        .should('have.value', testData.education);

    cy.log('✅ Education field filled successfully');

    // Verify all fields persist data
    cy.get('[data-cy="project-title-input-0"]')
        .scrollIntoView()
        .should('have.value', testData.project.title);

    cy.get('[data-cy="project-description-input-0"]')
        .scrollIntoView()
        .should('have.value', testData.project.description);

    cy.get('[data-cy="project-technologies-input-0"]')
        .scrollIntoView()
        .should('have.value', testData.project.technologies);

    testData.project.keyFeatures.forEach((feature) => {
      cy.get('[data-cy="project-keyFeatures-input-0"]')
          .scrollIntoView()
          .should('contain', feature);
    });

    cy.get('[data-cy="education-input"]')
        .scrollIntoView()
        .should('have.value', testData.education);

    // Test complete
    cy.log('✅ Test completed successfully - Personal Project and Education fields are filled and verified');
  });

});
