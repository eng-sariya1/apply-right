import { faker } from '@faker-js/faker';

describe('CV Form - Fill Fields Through Abstract', () => {
  beforeEach(() => {
    // Clear any stored state and reload the page fresh
    cy.clearLocalStorage();
    cy.clearCookies();

    cy.visit('/cv-builder', {
      onBeforeLoad: (win) => {
        win.sessionStorage.clear();
      }
    });

    // Wait for the page to fully load - CVFormInline is directly visible (no sidebar)
    cy.wait(1000);
  });

  it('should fill out form fields 1-7 in order (Full Name through Abstract)', () => {
    // Generate realistic professional CV test data using faker
    const testData = {
      // Personal Information
      fullName: faker.person.fullName(),
      specialization: faker.helpers.arrayElement([
        'Senior Full Stack Developer',
        'Frontend Engineer',
        'Backend Developer',
        'DevOps Engineer',
        'Software Architect',
        'UI/UX Developer'
      ]),
      email: faker.internet.email().toLowerCase(),
      phone: faker.phone.number('+1 (###) ###-####'),
      link: {
        name: 'LinkedIn',
        url: `https://linkedin.com/in/${faker.internet.username().toLowerCase()}`
      },
      abstract: `${faker.person.jobTitle()} with ${faker.number.int({ min: 3, max: 10 })}+ years of experience in building scalable web applications. Proven track record in leading development teams, implementing best practices, and delivering high-quality software solutions. Passionate about modern technologies and continuous learning.`,

      // Skills
      skills: [
        'React',
        'TypeScript',
        'Node.js',
        'PostgreSQL',
        'AWS',
        'Docker',
        'CI/CD',
        'REST APIs'
      ],

      // Career Experience
      career: {
        startDate: 'Jan 2020',
        endDate: 'Present',
        location: `${faker.location.city()}, ${faker.location.state({ abbreviated: true })}`,
        companyName: faker.company.name(),
        workSpecialization: faker.helpers.arrayElement([
          'Senior Software Engineer',
          'Full Stack Developer',
          'Lead Developer',
          'Technical Lead'
        ]),
        jobType: 'Full time',
        summarization: `Led development of multiple high-impact features that improved user engagement by ${faker.number.int({ min: 20, max: 60 })}%. Collaborated with cross-functional teams to design and implement scalable solutions. Mentored junior developers and established coding standards and best practices across the team.`
      },

      // Personal Project
      project: {
        title: faker.helpers.arrayElement([
          'E-Commerce Platform',
          'Task Management System',
          'Real-Time Chat Application',
          'Analytics Dashboard',
          'Portfolio Website Builder'
        ]),
        description: `A full-stack web application built with modern technologies. Features include user authentication, real-time updates, responsive design, and comprehensive testing. Designed with scalability and performance in mind.`,
        technologies: 'React, TypeScript, Node.js, Express, MongoDB, Socket.io',
        keyFeatures: [
          'User authentication and authorization',
          'Real-time data synchronization',
          'Responsive mobile-first design',
          'RESTful API architecture'
        ]
      },

      // Education
      education: `Bachelor of Science in Computer Science\n${faker.company.name()} University\n2016 - 2020\n\nRelevant coursework: Data Structures, Algorithms, Web Development, Database Systems, Software Engineering. Graduated with honors. Active member of the Computer Science Club and participated in multiple hackathons.`
    };

    // NOTE: /cv-builder uses CVFormInline (NO SIDEBAR) - form fields are directly visible
    // Wait for page to load and form to be visible
    cy.wait(1000);

    // Step 1: Fill Full Name field
    cy.get('[data-cy="fullName-input"]', { timeout: 10000 })
      .should('be.visible')
      .should('be.enabled')
      .scrollIntoView()
      .clear()
      .type(testData.fullName, { delay: 50 })
      .should('have.value', testData.fullName);

    // Step 4: Fill Specialization field
    cy.get('[data-cy="specialization-input"]')
      .should('be.visible')
      .should('be.enabled')
      .scrollIntoView()
      .clear()
      .type(testData.specialization, { delay: 50 })
      .should('have.value', testData.specialization);

    // Step 5: Fill Email field
    cy.get('[data-cy="email-input"]')
      .should('be.visible')
      .should('be.enabled')
      .scrollIntoView()
      .clear()
      .type(testData.email, { delay: 50 })
      .should('have.value', testData.email);

    // Step 6: Fill Phone Number field
    cy.get('[data-cy="phone-input"]')
      .should('be.visible')
      .should('be.enabled')
      .scrollIntoView()
      .clear()
      .type(testData.phone, { delay: 50 })
      .should('have.value', testData.phone);

    // Step 7: Add Link (must press "Add" after typing)
    cy.get('[data-cy="add-link-button"]')
      .should('be.visible')
      .should('be.enabled')
      .scrollIntoView()
      .click();

    // Wait for link fields to appear
    cy.wait(200);

    // Fill link name
    cy.get('[data-cy="link-name-input-0"]')
      .should('be.visible')
      .should('be.enabled')
      .scrollIntoView()
      .clear()
      .type(testData.link.name, { delay: 50 })
      .should('have.value', testData.link.name);

    // Fill link URL
    cy.get('[data-cy="link-url-input-0"]')
      .should('be.visible')
      .should('be.enabled')
      .scrollIntoView()
      .clear()
      .type(testData.link.url, { delay: 50 })
      .should('have.value', testData.link.url);

    // Step 8: Fill Abstract field (scroll into view to avoid sticky footer)
    cy.get('[data-cy="abstract-input"]')
      .should('be.visible')
      .should('be.enabled')
      .scrollIntoView()
      .clear()
      .type(testData.abstract, { delay: 30 })
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

    // Step 9: Fill Skills field
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

    // Step 10: Click "Add Career" button
    cy.get('[data-cy="add-career-button"]')
        .should('be.visible')
        .scrollIntoView()
        .click();

    // Wait for the career entry to be added
    cy.wait(200);

    // Step 11: Click on "Career Entry 1" header to expand the accordion
    cy.get('[data-cy="career-entry-header-0"]')
        .should('be.visible')
        .scrollIntoView()
        .click();

    // Wait for accordion to expand
    cy.wait(300);

    // Step 12: Fill all career fields with faker data

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

    // Step 13: Scroll to and click "Add Project" button
    cy.get('[data-cy="add-project-button"]')
        .scrollIntoView()
        .should('be.visible')
        .click({ force: true });

    // Wait for the project entry to be added
    cy.wait(200);

    // Step 14: Click on "Project 1" header to expand the accordion
    cy.get('[data-cy="project-entry-header-0"]')
        .should('be.visible')
        .scrollIntoView()
        .click();

    // Wait for accordion to expand
    cy.wait(300);

    // Step 15: Fill all project fields with faker data

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

    // Step 16: Fill Education field
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
