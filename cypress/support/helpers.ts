import { faker } from '@faker-js/faker';

/**
 * Cypress Helper Functions for CV Builder Application
 * Comprehensive utility functions for E2E testing
 */

// ============================================================================
// DATA GENERATION HELPERS
// ============================================================================

/**
 * Generate random comprehensive CV data for form filling
 */
export function generateRandomCVData() {
  const skillsList = [
    'React', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 'Java',
    'Angular', 'Vue.js', 'Next.js', 'Express', 'NestJS', 'Django',
    'PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'AWS', 'Azure', 'GCP',
    'Docker', 'Kubernetes', 'Git', 'CI/CD', 'GraphQL', 'REST API',
    'HTML', 'CSS', 'Tailwind CSS', 'Material-UI', 'Bootstrap',
    'Jest', 'Cypress', 'Testing Library', 'Webpack', 'Vite'
  ];

  const techStacks = [
    'React, TypeScript, Node.js, PostgreSQL',
    'Vue.js, JavaScript, Express, MongoDB',
    'Angular, TypeScript, NestJS, MySQL',
    'Next.js, React, Prisma, PostgreSQL',
    'Python, Django, PostgreSQL, Redis'
  ];

  const jobTitles = [
    'Senior Full Stack Developer',
    'Frontend Engineer',
    'Backend Developer',
    'Software Engineer',
    'Full Stack Developer',
    'DevOps Engineer',
    'Cloud Engineer',
    'Solutions Architect'
  ];

  // Generate 5-7 random skills
  const randomSkills = faker.helpers.arrayElements(skillsList, {min: 5, max: 7});

  return {
    personalInfo: {
      fullName: faker.person.fullName(),
      specialization: faker.helpers.arrayElement(jobTitles),
      email: faker.internet.email().toLowerCase(),
      phone: faker.phone.number('+1 (###) ###-####'),
      links: [
        {
          name: 'LinkedIn',
          url: `https://www.linkedin.com/in/${faker.internet.userName().toLowerCase()}`
        },
        {
          name: 'GitHub',
          url: `https://github.com/${faker.internet.userName().toLowerCase()}`
        }
      ]
    },
    abstract: `${faker.person.jobTitle()} with ${faker.number.int({ min: 3, max: 10 })}+ years of experience in ${faker.helpers.arrayElement(['web development', 'software engineering', 'full-stack development', 'cloud architecture'])}. Proven track record in ${faker.helpers.arrayElement(['building scalable applications', 'leading development teams', 'architecting cloud solutions', 'optimizing system performance'])}. Expertise in ${randomSkills.slice(0, 3).join(', ')} and modern development practices. Passionate about ${faker.helpers.arrayElement(['clean code', 'agile methodologies', 'continuous learning', 'innovation'])} and delivering high-quality solutions.`,
    skills: randomSkills,
    career: [
      {
        startDate: 'Jan 2021',
        endDate: 'Present',
        isPresent: true,
        location: `${faker.location.city()}, ${faker.location.state({ abbreviated: true })}`,
        companyName: faker.company.name(),
        workSpecialization: faker.helpers.arrayElement(jobTitles),
        jobType: 'Full time',
        summarization: `Led development of ${faker.helpers.arrayElement(['enterprise web applications', 'cloud-based solutions', 'microservices architecture', 'customer-facing platforms'])} serving ${faker.number.int({ min: 10, max: 500 })}K+ users. Collaborated with cross-functional teams to ${faker.helpers.arrayElement(['improve system performance', 'implement new features', 'enhance user experience', 'optimize workflows'])}. Mentored junior developers and established ${faker.helpers.arrayElement(['best practices', 'coding standards', 'testing protocols', 'deployment procedures'])}.`,
        projects: [
          {
            name: `${faker.company.buzzNoun()} ${faker.helpers.arrayElement(['Platform', 'System', 'Application', 'Portal'])}`,
            description: `Developed ${faker.helpers.arrayElement(['a comprehensive platform', 'an innovative system', 'a scalable application'])} for ${faker.helpers.arrayElement(['customer management', 'data analytics', 'e-commerce', 'content management'])}`,
            technologies: faker.helpers.arrayElement(techStacks),
            keyContributions: [
              `Implemented ${faker.helpers.arrayElement(['authentication system', 'payment integration', 'real-time notifications', 'search functionality'])}`,
              `Optimized ${faker.helpers.arrayElement(['database queries', 'API endpoints', 'frontend performance', 'caching strategy'])}`
            ]
          },
          {
            name: `${faker.company.buzzAdjective()} ${faker.helpers.arrayElement(['Dashboard', 'API', 'Tool', 'Framework'])}`,
            description: `Built ${faker.helpers.arrayElement(['a modern dashboard', 'a robust API', 'an automation tool'])} to ${faker.helpers.arrayElement(['monitor metrics', 'integrate services', 'streamline workflows'])}`,
            technologies: faker.helpers.arrayElement(techStacks),
            keyContributions: [
              `Designed ${faker.helpers.arrayElement(['RESTful APIs', 'GraphQL schema', 'database architecture', 'microservices'])}`,
              `Reduced ${faker.helpers.arrayElement(['load time', 'API response time', 'deployment time', 'bug count'])} by ${faker.number.int({ min: 30, max: 70 })}%`
            ]
          }
        ]
      },
      // {
      //   startDate: 'Jun 2018',
      //   endDate: 'Dec 2020',
      //   isPresent: false,
      //   location: `${faker.location.city()}, ${faker.location.state({ abbreviated: true })}`,
      //   companyName: faker.company.name(),
      //   workSpecialization: faker.helpers.arrayElement(['Software Developer', 'Full Stack Developer', 'Frontend Developer']),
      //   jobType: 'Full time',
      //   summarization: `Contributed to ${faker.helpers.arrayElement(['multiple client projects', 'product development', 'system modernization'])} using ${faker.helpers.arrayElement(['agile methodologies', 'scrum framework', 'test-driven development'])}. Developed ${faker.helpers.arrayElement(['responsive web applications', 'mobile-first interfaces', 'progressive web apps'])} with focus on ${faker.helpers.arrayElement(['user experience', 'accessibility', 'performance', 'maintainability'])}.`,
      //   projects: [
      //     {
      //       name: `${faker.commerce.productAdjective()} ${faker.helpers.arrayElement(['Web App', 'Mobile App', 'SaaS Platform'])}`,
      //       description: `Created ${faker.helpers.arrayElement(['a feature-rich application', 'an intuitive platform'])} for ${faker.commerce.department().toLowerCase()}`,
      //       technologies: faker.helpers.arrayElement(techStacks),
      //       keyContributions: [
      //         `Integrated ${faker.helpers.arrayElement(['third-party APIs', 'payment gateways', 'analytics tools', 'cloud services'])}`,
      //         `Achieved ${faker.number.int({ min: 95, max: 100 })}% code coverage`
      //       ]
      //     }
      //   ]
      // }
    ],
    personalProjects: [
      {
        title: `${faker.hacker.adjective().charAt(0).toUpperCase() + faker.hacker.adjective().slice(1)} ${faker.company.buzzNoun()}`,
        description: `An open-source ${faker.helpers.arrayElement(['tool', 'library', 'framework', 'application'])} for ${faker.hacker.verb()}ing ${faker.hacker.noun()}s. Built to ${faker.helpers.arrayElement(['simplify development', 'improve productivity', 'enhance collaboration', 'automate workflows'])}. Features ${faker.helpers.arrayElement(['real-time updates', 'responsive design', 'cloud deployment', 'CI/CD pipeline'])}.`,
        technologies: faker.helpers.arrayElement(techStacks),
        keyFeatures: [
          faker.helpers.arrayElement(['Real-time synchronization', 'OAuth authentication', 'RESTful API', 'GraphQL integration']),
          faker.helpers.arrayElement(['Responsive UI', 'Dark mode support', 'Offline functionality', 'Progressive Web App']),
          faker.helpers.arrayElement(['Automated testing', 'CI/CD pipeline', 'Docker deployment', 'Cloud hosting'])
        ]
      },
      // {
      //   title: `${faker.commerce.productAdjective().charAt(0).toUpperCase() + faker.commerce.productAdjective().slice(1)} ${faker.hacker.noun().charAt(0).toUpperCase() + faker.hacker.noun().slice(1)}`,
      //   description: `A ${faker.helpers.arrayElement(['mobile-first', 'AI-powered', 'blockchain-based', 'serverless'])} ${faker.helpers.arrayElement(['platform', 'application', 'service'])} designed to ${faker.helpers.arrayElement(['streamline processes', 'enhance productivity', 'improve user experience'])}. Implements ${faker.helpers.arrayElement(['machine learning', 'data analytics', 'real-time processing', 'microservices architecture'])}.`,
      //   technologies: faker.helpers.arrayElement(techStacks),
      //   keyFeatures: [
      //     faker.helpers.arrayElement(['Machine learning models', 'Data visualization', 'Advanced search', 'Smart recommendations']),
      //     faker.helpers.arrayElement(['Multi-language support', 'Accessibility features', 'Performance optimization', 'Security hardening'])
      //   ]
      // }
    ],
    education: `${faker.helpers.arrayElement(['Bachelor of Science', 'Master of Science', 'Bachelor of Engineering'])} in ${faker.helpers.arrayElement(['Computer Science', 'Software Engineering', 'Information Technology', 'Computer Engineering'])}\n${faker.company.name()} University, ${faker.location.city()}, ${faker.location.state()}\nGraduated: ${faker.date.past({ years: faker.number.int({ min: 2, max: 10 }) }).getFullYear()}\n${faker.helpers.arrayElement(['GPA: 3.8/4.0', 'Dean\'s List', 'Honors Graduate', 'Cum Laude'])}\n\nRelevant Coursework: ${faker.helpers.arrayElements(['Data Structures', 'Algorithms', 'Database Systems', 'Software Engineering', 'Web Development', 'Mobile Development', 'Cloud Computing', 'Machine Learning'], 4).join(', ')}`
  };
}

/**
 * Generate a realistic job description
 */
export function generateJobDescription() {
  const role = faker.helpers.arrayElement([
    'Senior Full Stack Developer',
    'Frontend Engineer',
    'Backend Developer',
    'Software Engineer',
    'DevOps Engineer'
  ]);

  const company = faker.company.name();
  const location = `${faker.location.city()}, ${faker.location.state()}`;

  const requiredSkills = faker.helpers.arrayElements([
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java',
    'Angular', 'Vue.js', 'Express', 'Django', 'PostgreSQL', 'MongoDB',
    'AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Git'
  ], { min: 5, max: 8 });

  const niceToHave = faker.helpers.arrayElements([
    'GraphQL', 'Redis', 'Microservices', 'TDD', 'Agile', 'Scrum',
    'REST API', 'Testing Library', 'Jest', 'Webpack', 'Azure', 'GCP'
  ], { min: 3, max: 5 });

  return `${role}

${company} - ${location}

About Us:
${company} is a ${faker.helpers.arrayElement(['fast-growing', 'leading', 'innovative', 'dynamic'])} ${faker.helpers.arrayElement(['tech startup', 'software company', 'technology firm'])} ${faker.helpers.arrayElement(['transforming', 'revolutionizing', 'disrupting'])} the ${faker.commerce.department().toLowerCase()} industry. We're building ${faker.helpers.arrayElement(['cutting-edge', 'innovative', 'next-generation'])} solutions that ${faker.helpers.arrayElement(['empower', 'enable', 'help'])} businesses to ${faker.company.catchPhrase().toLowerCase()}.

Role Overview:
We're seeking a talented ${role} to join our ${faker.helpers.arrayElement(['engineering', 'development', 'product'])} team. You'll be responsible for ${faker.helpers.arrayElement(['developing', 'building', 'designing'])} ${faker.helpers.arrayElement(['scalable web applications', 'cloud-based solutions', 'enterprise software', 'user-facing features'])} and ${faker.helpers.arrayElement(['collaborating with cross-functional teams', 'working closely with product managers', 'mentoring junior developers'])}.

Key Responsibilities:
• Design, develop, and maintain ${faker.helpers.arrayElement(['web applications', 'microservices', 'APIs', 'cloud infrastructure'])}
• ${faker.helpers.arrayElement(['Collaborate with', 'Work alongside', 'Partner with'])} ${faker.helpers.arrayElement(['product managers', 'designers', 'stakeholders'])} to define and implement new features
• Write clean, maintainable, and well-documented code
• Participate in code reviews and contribute to team knowledge sharing
• ${faker.helpers.arrayElement(['Optimize application performance', 'Improve system scalability', 'Enhance user experience'])}
• Troubleshoot and debug production issues
• Contribute to architectural decisions and technical strategy

Required Skills:
${requiredSkills.map(skill => `• ${skill}`).join('\n')}
• ${faker.number.int({ min: 3, max: 8 })}+ years of professional software development experience
• Strong understanding of ${faker.helpers.arrayElement(['software design patterns', 'data structures and algorithms', 'web technologies'])}
• Experience with ${faker.helpers.arrayElement(['RESTful APIs', 'GraphQL', 'microservices architecture'])}
• Familiarity with ${faker.helpers.arrayElement(['Agile methodologies', 'CI/CD pipelines', 'version control systems'])}

Nice to Have:
${niceToHave.map(skill => `• ${skill}`).join('\n')}
• ${faker.helpers.arrayElement(['Bachelor\'s degree in Computer Science or related field', 'Experience with cloud platforms', 'Open source contributions'])}
• ${faker.helpers.arrayElement(['Experience with testing frameworks', 'Knowledge of DevOps practices', 'Strong problem-solving skills'])}

What We Offer:
• Competitive salary and equity package
• ${faker.helpers.arrayElement(['Flexible remote work', 'Hybrid work environment', 'Work from anywhere'])}
• Health, dental, and vision insurance
• ${faker.number.int({ min: 15, max: 30 })} days PTO
• Professional development opportunities
• ${faker.helpers.arrayElement(['Modern tech stack', 'Cutting-edge tools', 'Latest technologies'])}
• ${faker.helpers.arrayElement(['Collaborative team culture', 'Inclusive work environment', 'Growth opportunities'])}

Join us in ${faker.helpers.arrayElement(['building the future', 'making an impact', 'transforming the industry'])}!`;
}

// ============================================================================
// UI INTERACTION HELPERS
// ============================================================================

/**
 * Smooth scroll to bottom of page with delays
 * @param speed - Speed of scrolling (ms between scroll steps)
 */
export function smoothScrollDown(speed: number = 50) {
  cy.window().then((win) => {
    const scrollHeight = win.document.body.scrollHeight;
    const viewportHeight = win.innerHeight;
    const scrollStep = 100; // Pixels per step
    let currentScroll = 0;

    const scroll = () => {
      if (currentScroll >= scrollHeight - viewportHeight) {
        return;
      }
      cy.scrollTo(0, currentScroll, { duration: 0 });
      cy.wait(speed);
      currentScroll += scrollStep;
      scroll();
    };

    scroll();
  });
}

/**
 * Fill text input with typing delay
 */
export function fillTextInput(selector: string, value: string, options = { delay: 50 }) {
  cy.get(selector)
    .should('be.visible')
    .should('be.enabled')
    .scrollIntoView()
    .clear()
    .type(value, { delay: options.delay })
    .should('have.value', value);
}

/**
 * Fill textarea with typing delay
 */
export function fillTextArea(selector: string, value: string, options = { delay: 30 }) {
  cy.get(selector)
    .should('be.visible')
    .should('be.enabled')
    .scrollIntoView()
    .clear()
    .type(value, { delay: options.delay, parseSpecialCharSequences: false })
    .should('have.value', value);
}

/**
 * Fill chips input (for skills, key features, etc.)
 */
export function fillChipsInput(selector: string, values: string[]) {
  values.forEach((value, index) => {
    cy.get(selector)
      .should('be.visible')
      .find('input[type="text"]')
      .type(`${value}{enter}`, { force: true });

    if (index < values.length - 1) {
      cy.wait(100);
    }
  });
}

/**
 * Select dropdown option
 */
export function selectDropdown(selector: string, optionText: string) {
  cy.get(selector)
    .should('be.visible')
    .should('be.enabled')
    .scrollIntoView()
    .click();

  cy.wait(200);

  cy.get('.p-dropdown-panel')
    .should('be.visible')
    .contains(optionText)
    .click();

  cy.wait(200);
}

/**
 * Check checkbox
 */
export function checkCheckbox(selector: string) {
  cy.get(selector)
    .should('be.visible')
    .should('be.enabled')
    .scrollIntoView()
    .check({ force: true });

  cy.wait(100);
}

/**
 * Click button with validation
 */
export function clickButton(selector: string) {
  cy.get(selector)
    .should('be.visible')
    .should('be.enabled')
    .scrollIntoView()
    .click();

  cy.wait(300);
}

/**
 * Expand accordion tab
 */
export function expandAccordion(headerSelector: string) {
  cy.get(headerSelector)
    .should('be.visible')
    .scrollIntoView()
    .click();

  cy.wait(300);
}

/**
 * Wait for element to be visible with timeout
 */
export function waitForElement(selector: string, timeout: number = 30000) {
  cy.get(selector, { timeout })
    .should('be.visible');
}

/**
 * Wait for AI operation to complete
 * Looks for loading state to disappear
 */
export function waitForAICompletion(timeout: number = 60000) {
  // Wait for loading spinner to disappear
  cy.get('.p-button-loading', { timeout }).should('not.exist');
  cy.wait(1000); // Additional buffer
}
