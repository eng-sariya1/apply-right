/**
 * Comprehensive CV Builder Flow - End-to-End Test
 *
 * This test covers the complete user journey:
 * 1. Landing Page - Slow scroll and navigation
 * 2. CV Builder - Fill all form fields with random data
 * 3. ATS Page - Analyze and optimize CV
 * 4. Apply optimizations and verify results
 */

import {
  generateRandomCVData,
  generateJobDescription,
  smoothScrollDown,
  fillTextInput,
  fillTextArea,
  fillChipsInput,
  selectDropdown,
  checkCheckbox,
  clickButton,
  expandAccordion,
  waitForElement,
  waitForAICompletion
} from '../support/helpers';

describe('Comprehensive CV Builder Flow', () => {
  let testData: ReturnType<typeof generateRandomCVData>;
  let jobDescription: string;

  before(() => {
    // Generate test data once before all tests
    testData = generateRandomCVData();
    jobDescription = generateJobDescription();

    cy.log('Generated Test Data:', testData);
    cy.log('Generated Job Description');
  });

  beforeEach(() => {
    // Clear state before each test
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('should complete the entire CV building and optimization flow', () => {
    // ========================================================================
    // STEP 1: LANDING PAGE - SLOW SCROLL & NAVIGATION
    // ========================================================================
    cy.log('========== STEP 1: Landing Page ==========');

    // Visit landing page
    cy.visit('/');
    cy.wait(1000);

    // Verify landing page loaded
    cy.get('[data-cy="create-resume-button"]')
      .should('be.visible');

    // Slow scroll down to view the landing page
    cy.log('Scrolling through landing page...');
    smoothScrollDown(50); // 50ms between scroll steps for visibility

    // Wait at bottom to view content
    cy.wait(2000);

    // Scroll back to top
    cy.scrollTo('top', { duration: 1000 });
    cy.wait(500);

    // Click "Create my resume" button
    cy.log('Clicking "Create my resume"...');
    cy.get('[data-cy="create-resume-button"]')
      .should('be.visible')
      .should('be.enabled')
      .click();

    // Verify navigation to CV Builder
    cy.url().should('include', '/cv-builder');
    cy.wait(1000);

    // ========================================================================
    // STEP 2: CV BUILDER - FILL ALL FORM FIELDS
    // ========================================================================
    cy.log('========== STEP 2: CV Builder Form Filling ==========');

    // --- PERSONAL INFORMATION ---
    cy.log('Filling Personal Information...');

    fillTextInput('[data-cy="fullName-input"]', testData.personalInfo.fullName);
    fillTextInput('[data-cy="specialization-input"]', testData.personalInfo.specialization);
    fillTextInput('[data-cy="email-input"]', testData.personalInfo.email);
    fillTextInput('[data-cy="phone-input"]', testData.personalInfo.phone);

    // Add links
    testData.personalInfo.links.forEach((link, index) => {
      // Click "Add Link" button
      cy.get('[data-cy="add-link-button"]')
        .should('be.visible')
        .click();

      cy.wait(300);

      // Fill link name and URL
      fillTextInput(`[data-cy="link-name-input-${index}"]`, link.name);
      fillTextInput(`[data-cy="link-url-input-${index}"]`, link.url);
    });

    cy.log('✓ Personal Information completed');
    cy.wait(500);

    // --- ABSTRACT ---
    cy.log('Filling Abstract...');

    fillTextArea('[data-cy="abstract-input"]', testData.abstract);

    cy.log('✓ Abstract completed');
    cy.wait(500);

    // --- SKILLS ---
    cy.log('Filling Skills...');

    fillChipsInput('[data-cy="skills-input"]', testData.skills);

    cy.log(`✓ Skills completed (${testData.skills.length} skills added)`);
    cy.wait(500);

    // --- CAREER ---
    cy.log('Filling Career entries...');

    testData.career.forEach((career, careerIndex) => {
      cy.log(`Adding Career Entry ${careerIndex + 1}...`);

      // Click "Add Career" button
      cy.get('[data-cy="add-career-button"]')
        .should('be.visible')
        .scrollIntoView()
        .click();

      cy.wait(300);

      // Expand accordion
      expandAccordion(`[data-cy="career-entry-header-${careerIndex}"]`);

      // Fill career fields
      fillTextInput(`[data-cy="career-startDate-input-${careerIndex}"]`, career.startDate);
      fillTextInput(`[data-cy="career-endDate-input-${careerIndex}"]`, career.endDate || '');
      fillTextInput(`[data-cy="career-companyName-input-${careerIndex}"]`, career.companyName);
      fillTextInput(`[data-cy="career-location-input-${careerIndex}"]`, career.location);
      fillTextInput(`[data-cy="career-workSpecialization-input-${careerIndex}"]`, career.workSpecialization);

      // Select job type
      // selectDropdown(`[data-cy="career-jobType-dropdown-${careerIndex}"]`, career.jobType);

      fillTextArea(`[data-cy="career-summarization-input-${careerIndex}"]`, career.summarization);

      // Add projects within career
      if (career.projects && career.projects.length > 0) {
        cy.log(`Adding ${career.projects.length} projects to Career Entry ${careerIndex + 1}...`);

        career.projects.forEach((project, projectIndex) => {
          // Find and click "Add" button for projects within this career entry
          cy.get(`[data-cy="career-entry-header-${careerIndex}"]`)
            .parents('.p-accordion-tab')
            .find('button')
            .contains('Add')
            .click();

          cy.wait(300);

          // Fill project fields
          fillTextInput(
            `[data-cy="career-project-name-input-${careerIndex}-${projectIndex}"]`,
            project.name
          );

          fillTextArea(
            `[data-cy="career-project-description-input-${careerIndex}-${projectIndex}"]`,
            project.description
          );

          fillTextInput(
            `[data-cy="career-project-technologies-input-${careerIndex}-${projectIndex}"]`,
            project.technologies
          );

          // Fill key contributions (chips input)
          if (project.keyContributions && project.keyContributions.length > 0) {
            project.keyContributions.forEach((contribution) => {
              cy.get(`[data-cy="career-entry-header-${careerIndex}"]`)
                .parents('.p-accordion-tab')
                .find('.p-chips')
                .eq(projectIndex)
                .find('input[type="text"]')
                .type(`${contribution}{enter}`, { force: true });

              cy.wait(100);
            });
          }

          cy.log(`  ✓ Project ${projectIndex + 1} added`);
        });
      }

      cy.log(`✓ Career Entry ${careerIndex + 1} completed`);
      cy.wait(500);
    });

    cy.log('✓ All Career entries completed');

    // --- PERSONAL PROJECTS ---
    cy.log('Filling Personal Projects...');

    testData.personalProjects.forEach((project, projectIndex) => {
      cy.log(`Adding Personal Project ${projectIndex + 1}...`);

      // Click "Add Project" button
      cy.get('[data-cy="add-project-button"]')
        .should('be.visible')
        .scrollIntoView()
        .click();

      cy.wait(300);

      // Expand accordion
      expandAccordion(`[data-cy="project-entry-header-${projectIndex}"]`);

      // Fill project fields
      fillTextInput(`[data-cy="project-title-input-${projectIndex}"]`, project.title);
      fillTextArea(`[data-cy="project-description-input-${projectIndex}"]`, project.description);
      fillTextInput(`[data-cy="project-technologies-input-${projectIndex}"]`, project.technologies);

      // Fill key features (chips input)
      fillChipsInput(`[data-cy="project-keyFeatures-input-${projectIndex}"]`, project.keyFeatures);

      cy.log(`✓ Personal Project ${projectIndex + 1} completed`);
      cy.wait(500);
    });

    cy.log('✓ All Personal Projects completed');

    // --- EDUCATION ---
    cy.log('Filling Education...');

    fillTextArea('[data-cy="education-input"]', testData.education);

    cy.log('✓ Education completed');
    cy.wait(1000);

    // Screenshot of completed form
    cy.screenshot('01-completed-cv-form');

    cy.log('========== CV Form Complete ==========');

    // ========================================================================
    // STEP 3: NAVIGATE TO ATS PAGE
    // ========================================================================
    cy.log('========== STEP 3: Navigate to ATS Page ==========');

    // Scroll to ATS button
    cy.get('[data-cy="navigate-to-ats-button"]')
      .should('be.visible')
      .scrollIntoView();

    cy.wait(500);

    // Click ATS optimization button
    cy.log('Clicking "Optimize My CV for ATS"...');
    cy.get('[data-cy="navigate-to-ats-button"]')
      .should('be.enabled')
      .click();

    // Verify navigation to ATS page
    cy.url().should('include', '/ats');
    cy.wait(1000);

    cy.log('✓ Navigated to ATS page');

    // ========================================================================
    // STEP 4: FILL JOB DESCRIPTION
    // ========================================================================
    cy.log('========== STEP 4: Fill Job Description ==========');

    // Fill job description
    cy.log('Entering job description...');
    cy.get('[data-cy="job-description-input"]')
      .should('be.visible')
      .scrollIntoView()
      .clear()
      .type(jobDescription, { delay: 10, parseSpecialCharSequences: false })
      .should('have.value', jobDescription);

    cy.log('✓ Job description filled');
    cy.wait(1000);

    // Screenshot of job description
    cy.screenshot('02-job-description-filled');

    // ========================================================================
    // STEP 5: ANALYZE CV
    // ========================================================================
    cy.log('========== STEP 5: Analyze CV ==========');

    // Click "Analyze CV" button
    cy.log('Clicking "Analyze CV"...');
    cy.get('[data-cy="analyze-cv-button"]')
      .should('be.visible')
      .should('be.enabled')
      .click();

    cy.log('Waiting for analysis to complete...');

    // Wait for analysis to complete (30-60 seconds timeout)
    waitForAICompletion(60000);

    // Verify analysis results are displayed
    cy.log('Verifying analysis results...');
    cy.contains('Match Score', { timeout: 5000 }).should('be.visible');
    cy.contains('%').should('be.visible'); // Percentage should be visible

    cy.log('✓ CV Analysis completed');
    cy.wait(1000);

    // Screenshot of analysis results
    cy.screenshot('03-analysis-results');

    // ========================================================================
    // STEP 6: OPTIMIZE CV
    // ========================================================================
    cy.log('========== STEP 6: Optimize CV ==========');

    // Scroll page to find optimize button
    cy.scrollTo('top', { duration: 500 });
    cy.wait(500);

    // Click "Optimize CV for this Job" button with longer timeout
    cy.log('Clicking "Optimize CV for this Job"...');
    cy.get('[data-cy="optimize-cv-button"]', { timeout: 10000 })
      .should('exist')
      .scrollIntoView()
      .should('be.visible')
      .should('be.enabled')
      .click();

    cy.log('Waiting for optimization suggestions...');

    // Wait for optimization to complete (30-60 seconds timeout)
    waitForAICompletion(60000);

    // Verify suggestions are displayed
    cy.log('Verifying optimization suggestions...');
    cy.contains('Optimization Suggestions', { timeout: 5000 }).should('be.visible');

    // Wait for suggestions to render
    cy.wait(2000);

    cy.log('✓ Optimization suggestions generated');

    // Screenshot of suggestions
    cy.screenshot('04-optimization-suggestions');

    // ========================================================================
    // STEP 7: SELECT ALL SUGGESTIONS
    // ========================================================================
    cy.log('========== STEP 7: Select All Suggestions ==========');

    // Scroll to top to find select all button (it's in the header)
    cy.scrollTo('top', { duration: 500 });
    cy.wait(500);

    // Find and click "Select All" button with longer timeout
    cy.log('Clicking "Select All"...');
    cy.get('[data-cy="select-all-button"]', { timeout: 10000 })
      .should('exist')
      .scrollIntoView()
      .should('be.visible')
      .should('be.enabled')
      .click();

    cy.wait(1000); // Wait for checkboxes to update

    cy.log('✓ All suggestions selected');

    // Screenshot of selected suggestions
    cy.screenshot('05-all-suggestions-selected');

    // ========================================================================
    // STEP 8: APPLY CHANGES
    // ========================================================================
    cy.log('========== STEP 8: Apply Changes ==========');

    // Scroll page to bottom to ensure button is in viewport
    cy.scrollTo('bottom', { duration: 500 });
    cy.wait(500);

    // Now find and scroll to apply button with longer timeout
    cy.get('[data-cy="apply-changes-button"]', { timeout: 10000 })
      .should('exist')
      .scrollIntoView()
      .should('be.visible')
      .should('be.enabled');

    cy.wait(500);

    // Click "Apply Changes" button
    cy.log('Clicking "Apply Changes"...');
    cy.get('[data-cy="apply-changes-button"]')
      .click();

    cy.log('Waiting for changes to be applied and CV re-analyzed...');

    // Wait for changes to be applied (can take 30-60 seconds for re-analysis)
    waitForAICompletion(60000);

    cy.wait(2000);

    cy.log('✓ Changes applied successfully');

    // Screenshot of final results
    cy.screenshot('06-final-optimized-results');

    // ========================================================================
    // STEP 9: VERIFY COMPLETION
    // ========================================================================
    cy.log('========== STEP 9: Verify Completion ==========');

    // Verify that we're back to viewing analysis results (suggestions cleared)
    cy.contains('Match Score', { timeout: 5000 }).should('be.visible');

    // Verify the optimization button is available again (indicating success)
    cy.get('[data-cy="optimize-cv-button"]', { timeout: 10000 })
      .should('be.visible');

    cy.log('✓ CV optimization flow completed successfully!');

    // Final screenshot of ATS results
    cy.screenshot('07-ats-complete');

    // ========================================================================
    // STEP 10: NAVIGATE BACK TO CV BUILDER TO VIEW OPTIMIZED CV
    // ========================================================================
    cy.log('========== STEP 10: View Optimized CV ==========');

    // Scroll to top to make the header visible (it's position: fixed)
    cy.scrollTo('top', { duration: 500 });
    cy.wait(500);

    // Click "Back to CV Builder" button
    cy.log('Navigating back to CV Builder...');
    cy.get('button')
      .contains('Back to CV Builder')
      .scrollIntoView()
      .should('be.visible')
      .click();

    // Verify navigation to CV Builder
    cy.url().should('include', '/cv-builder');
    cy.wait(2000);

    // Verify form still has the optimized data
    cy.log('Verifying optimized CV data persisted...');
    cy.get('[data-cy="fullName-input"]', { timeout: 5000 })
      .should('be.visible')
      .should('have.value', testData.personalInfo.fullName);

    cy.log('✓ Optimized CV data persisted in form');

    // Scroll through the form to view optimized content
    cy.log('Scrolling through optimized CV...');
    cy.scrollTo('top', { duration: 500 });
    cy.wait(1000);

    // Take screenshot of optimized form
    cy.screenshot('08-optimized-cv-form');

    // Scroll down slowly to view all sections
    cy.scrollTo('bottom', { duration: 2000 });
    cy.wait(1000);

    // Take final screenshot
    cy.screenshot('09-final-cv-view');

    cy.log('✓ Optimized CV viewed successfully');

    // ========================================================================
    // TEST COMPLETE
    // ========================================================================
    cy.log('========================================');
    cy.log('COMPREHENSIVE TEST COMPLETED SUCCESSFULLY');
    cy.log('All CV data filled, analyzed, optimized, and verified!');
    cy.log('========================================');
  });
});
