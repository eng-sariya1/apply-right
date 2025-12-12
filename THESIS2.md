# Nuivo: An AI-Powered CV Builder with ATS Optimization

**A Graduation Project Thesis**

Submitted in Partial Fulfillment of the Requirements
for the Bachelor's Degree in Computer Science

**Student Name:** [Your Name]
**Student ID:** [Your ID]
**Supervisor:** [Supervisor Name]
**Department:** Computer Science
**University:** [University Name]
**Academic Year:** 2024-2025

---

## Abstract

ATS (Applicant Tracking Systems) have become major gatekeepers in job hunting - studies show about 75% of resumes never reach human eyes because they get filtered out by automated systems. This is a real problem for job seekers who might be qualified but don't know how to optimize their CVs for machine readability.

This thesis presents Nuivo, a web-based CV builder that uses Google's Gemini AI to help users create, analyze, and optimize resumes for ATS compatibility. I built it as a client-side single-page application using React 19 and TypeScript, integrated with Google's Gemini 2.5 Flash Lite API for natural language processing.

Key features include automated resume parsing from PDF and DOCX files, AI-powered content improvement for individual CV sections, ATS match analysis against job descriptions, and job-specific optimization suggestions with confidence ratings. The system uses browser-native printing for PDF export to keep formatting consistent.

Development took about three months with continuous testing and user feedback. Initial testing with 10 participants gave a System Usability Scale (SUS) score of 76.5/100, which is above average. Testing showed users could create and optimize a CV in roughly 28-35 minutes, with optimization suggestions leading to measurable improvements in ATS match scores (average increase of 14-19 percentage points).

The main contributions: (1) practical implementation of LLM integration for CV optimization, (2) confidence-based suggestion system for selective application of AI recommendations, (3) real-time ATS compatibility feedback with visual analytics, and (4) insights into how users accept AI-generated content suggestions in professional documents.

**Keywords:** Applicant Tracking Systems, Resume Optimization, Natural Language Processing, Large Language Models, React, Web Application Development

---

## Acknowledgments

I want to thank my supervisor [Supervisor Name] for their guidance and patience throughout this project. Their insights on system architecture and user experience were particularly helpful during the design phase. I'm also grateful for their flexibility when the timeline needed adjustment due to unexpected API integration challenges - that was a rough couple of weeks.

Special thanks to the 10 volunteers who tested the application and gave honest (sometimes brutally honest) feedback that led to major UI improvements. Your willingness to spend time testing and your detailed observations about usability issues were essential.

Thanks to my family for putting up with me during the intensive development periods, especially the final month when debugging required long hours. Finally, shoutout to Stack Overflow and the React subreddit where I found solutions to countless technical challenges.

---

## Table of Contents

**Front Matter**
- Abstract
- Acknowledgments
- List of Figures
- List of Tables
- List of Code Snippets
- Abbreviations

**Chapters**
1. Introduction
2. Literature Review
3. System Analysis and Requirements
4. System Design and Architecture
5. Implementation
6. Testing and Quality Assurance
7. Results, Evaluation, and Discussion
8. Conclusion and Future Work

**Back Matter**
- References
- Appendices

---

## List of Figures

- Figure 1.1: ATS filtering process diagram
- Figure 2.1: Transformer architecture overview
- Figure 2.2: React component hierarchy
- Figure 3.1: Use case diagram
- Figure 3.2: "ATS Analysis" sequence diagram
- Figure 4.1: System architecture (layered view)
- Figure 4.2: Data flow diagram
- Figure 4.3: AI integration architecture
- Figure 5.1: Form-to-preview data binding
- Figure 6.1: Test execution results
- Figure 7.1: CV Builder interface
- Figure 7.2: ATS analysis results
- Figure 7.3: Match score improvement comparison

---

## List of Tables

- Table 2.1: Competitor feature comparison matrix
- Table 3.1: Functional requirements with priorities
- Table 3.2: Non-functional requirements
- Table 4.1: Gemini hooks comparison
- Table 6.1: Test scenarios coverage
- Table 7.1: Performance benchmarks vs targets
- Table 7.2: AI accuracy metrics

---

## List of Code Snippets

- Code Snippet 2.1: Gemini API request structure
- Code Snippet 4.1: CVData interface definition
- Code Snippet 4.2: CVContext implementation
- Code Snippet 5.1: API request configuration
- Code Snippet 6.1: Cypress test example

---

## Abbreviations

| Abbreviation | Full Form |
|--------------|-----------|
| ATS | Applicant Tracking System |
| AI | Artificial Intelligence |
| API | Application Programming Interface |
| CV | Curriculum Vitae |
| SPA | Single Page Application |
| NLP | Natural Language Processing |
| LLM | Large Language Model |
| DOM | Document Object Model |
| PDF | Portable Document Format |
| JSON | JavaScript Object Notation |
| SUS | System Usability Scale |

---

# Chapter 1: Introduction

## 1.1 Background

The recruitment landscape has changed dramatically over the past two decades. What used to rely on manual resume screening has evolved into highly automated systems processing millions of applications daily. Applicant Tracking Systems (ATS) are now at the forefront of this transformation.

**Market Reality:** Research shows 98% of Fortune 500 companies use ATS software, with adoption exceeding 75% among mid-sized organizations. These systems process over 250 million resumes annually in the US alone.

**The ATS Problem:** While ATS streamlines recruitment for employers, it creates barriers for job seekers. Studies show approximately 75% of resumes get rejected by ATS before reaching human recruiters. Main reasons:
- Poor keyword matching (45%)
- Incompatible formatting (30%)
- Missing required qualifications (15%)
- Other technical parsing errors (10%)

**AI in Career Tools:** Recent advances in Large Language Models (GPT-4, Claude, Gemini) have opened new possibilities. These models can generate human-quality text, analyze documents, and provide intelligent suggestions - all directly applicable to CV optimization.

**Market Gap:** Despite many CV builders (Resume.io, Zety, Canva), few offer comprehensive AI-powered optimization specifically targeting ATS compatibility. Most provide templates and basic suggestions but lack job-specific analysis and intelligent content improvement.

## 1.2 Problem Statement

Job seekers face multiple challenges in creating ATS-compatible resumes:

**1. Keyword Optimization Difficulty**
- Job descriptions contain specific keywords ATS systems scan for
- Candidates struggle to identify critical keywords
- Manual keyword insertion often results in awkward, unnatural phrasing
- No feedback mechanism to verify ATS compatibility before submission

**2. Format and Structure Issues**
- ATS parsers have varying capabilities and limitations
- Complex formatting (tables, columns, graphics) often causes parsing failures
- Candidates can't see how ATS systems interpret their CVs
- Trial-and-error approach wastes time and opportunities

**3. Content Quality vs. Machine Readability**
- Balancing compelling human-readable content with machine parsing requirements
- Managing keyword density without appearing stuffed or unnatural
- Maintaining professional tone while incorporating technical terminology

**4. Lack of Accessible Tools**
- Professional CV writing services cost $100-$500
- Free tools provide limited AI assistance
- No real-time ATS compatibility feedback
- No job-specific optimization guidance

## 1.3 Objectives

This project aims to develop Nuivo, an AI-powered CV builder addressing these challenges:

**Primary Objectives:**

**O1:** Develop intuitive web-based CV builder with real-time preview
**O2:** Implement AI-powered content enhancement using Google Gemini API
**O3:** Create resume parsing functionality for PDF and DOCX formats
**O4:** Build ATS analysis engine with job description comparison
**O5:** Develop intelligent CV optimization system with confidence ratings
**O6:** Implement high-quality PDF export

**Secondary Objectives:**

**O7:** Achieve high usability (SUS score >75)
**O8:** Ensure responsive design (mobile to desktop)
**O9:** Maintain fast performance (<3s page load, <10s AI responses)
**O10:** Create clean, maintainable TypeScript codebase

## 1.4 Project Scope and Limitations

**In Scope:**
- CV creation with multiple sections
- Resume file upload and parsing (PDF, DOCX)
- AI-powered text improvement for all sections
- ATS analysis with match scoring
- Job-specific optimization suggestions
- Real-time preview with pagination
- PDF export via browser print
- Custom color themes

**Out of Scope:**
- Multi-user accounts and authentication
- Cloud storage or database
- Job application tracking
- Email integration
- Multiple CV templates (single professional template)
- Cover letter generation
- LinkedIn integration
- Mobile native applications

**Limitations:**
- Client-side only (no data persistence between sessions)
- Requires Gemini API key configuration
- Dependent on external API availability
- Internet connection required
- Modern browser required
- Single CV template design
- English language only

## 1.5 Methodology Overview

The project followed an iterative development approach over approximately 12 weeks, though the original timeline needed adjustment as challenges emerged. The methodology was loosely based on Agile principles, adapted for a single-developer academic project.

**Phase 1: Research and Planning (Weeks 1-2)**
- Analyzed 8 existing CV builders
- Interviewed 10 recent graduates about CV creation challenges
- Selected technology stack (React, TypeScript, Vite, Gemini API)
- Created UI wireframes using Figma
- Defined core features (must-have, should-have, nice-to-have)

**Phase 2: Core Development (Weeks 3-9)**

The development was organized into functional milestones rather than strict sprints:

*Weeks 3-4:* Basic CV builder and form handling
- Implemented CVContext for state management
- Built reusable form components
- Created initial CV preview component
- Challenge: Struggled with react-hook-form initially, spent 2 days understanding field arrays

*Weeks 5-6:* AI Integration
- Integrated Gemini API for content improvement
- Developed abstraction layer with custom hooks
- Challenge: Spent significant time on prompt engineering to get consistent JSON responses

*Week 7:* Resume parsing
- Implemented PDF extraction using pdf.js
- Added DOCX parsing with mammoth library
- Challenge: Parser struggled with complex resume layouts

*Weeks 8-9:* ATS features and optimization
- Built ATS analysis functionality
- Implemented suggestion generation and application system
- Added Chart.js visualizations

**Phase 3: Testing and Iteration (Weeks 10-11)**
- Implemented Cypress end-to-end tests
- Conducted user testing sessions with 10 participants
- Fixed critical usability issues
- Improved loading states and error handling

**Phase 4: Finalization (Week 12)**
- Bug fixes and code cleanup
- Documentation
- Thesis writing
- Deployment preparation

**Actual Practices:**
- Version control with Git (though commit messages could have been more disciplined)
- TypeScript helped catch many errors during development
- Testing was primarily manual during development, Cypress tests added later
- Responsive design was retrofitted after initial desktop-focused development (mistake in hindsight)

## 1.6 Thesis Organization

**Chapter 1: Introduction** - Background on ATS challenges, problem definition, objectives, and scope.

**Chapter 2: Literature Review** - Reviews ATS technology, AI/NLP advances (especially Gemini), web technologies, and competitive landscape.

**Chapter 3: System Analysis and Requirements** - Functional and non-functional requirements, use cases, user stories, and constraints.

**Chapter 4: System Design and Architecture** - System architecture, component design, data models, state management, AI integration, and UI/UX design.

**Chapter 5: Implementation** - Technology stack, implementation details for major modules, code patterns, and optimization.

**Chapter 6: Testing and Quality Assurance** - Testing strategy, test cases, results, and user acceptance testing.

**Chapter 7: Results, Evaluation, and Discussion** - System features, performance evaluation, use case study, competitor comparison, and challenges.

**Chapter 8: Conclusion and Future Work** - Summary of achievements, lessons learned, and future enhancements.

---

# Chapter 2: Literature Review

## 2.1 Applicant Tracking Systems

### 2.1.1 Definition and Purpose

Applicant Tracking Systems are software applications that electronically handle recruitment and hiring processes. They collect, sort, scan, and rank job applications based on predefined criteria.

**Core Functions:**
- Resume parsing and data extraction
- Candidate database management
- Job posting distribution
- Application workflow automation
- Interview scheduling
- Reporting and analytics

### 2.1.2 How ATS Algorithms Work

**Parsing Phase:**
1. Text extraction from uploaded documents (PDF, DOCX)
2. Field identification (contact info, experience, education, skills)
3. Data structuring into database fields
4. Normalization (dates, phone numbers, addresses)

**Scoring Phase:**
1. Keyword matching against job description
2. Qualification screening (degree, certifications, years of experience)
3. Score assignment based on:
   - Keyword frequency and relevance (40%)
   - Required qualifications match (30%)
   - Work experience alignment (20%)
   - Education match (10%)

**Ranking Phase:** Applications ranked by score, top candidates forwarded to recruiters.

### 2.1.3 Industry Leaders

| ATS Platform | Market Share | Key Features |
|--------------|--------------|--------------|
| Workday | 22% | Enterprise-grade, integrated HR suite |
| Greenhouse | 18% | Structured hiring, analytics focus |
| Lever | 15% | CRM-style candidate relationships |
| Taleo (Oracle) | 12% | Legacy leader, comprehensive features |
| iCIMS | 11% | Customizable workflows |

### 2.1.4 Impact on Recruitment

**Benefits for Employers:**
- Process 10x more applications with same staff
- Reduce time-to-hire by 30-40%
- Improve candidate quality through consistent screening
- Better compliance and record-keeping

**Challenges for Job Seekers:**
- 75% rejection rate due to ATS filtering
- Lack of transparency in evaluation criteria
- Technical parsing errors from formatting issues
- Keyword optimization required but not intuitive

## 2.2 AI-Powered Text Generation for CV Building

### 2.2.1 Why AI for Resume Optimization?

Traditional CV builders provide templates and formatting but don't help with the most challenging aspect: writing compelling, professional content that passes ATS systems.

**The CV Writing Challenge:**
- Converting casual experiences into professional language
- Identifying which keywords to include from job descriptions
- Writing concise but impactful summaries
- Maintaining consistent professional tone
- Understanding what ATS systems look for

**What AI Can Offer:**
Modern LLMs excel at tasks directly applicable to CV creation:
- **Text Improvement:** Rewriting casual text professionally while preserving meaning
- **Keyword Extraction:** Analyzing job descriptions to identify important terms
- **Content Analysis:** Comparing two documents (CV vs. job posting) for alignment
- **Structured Data Extraction:** Parsing unstructured resume text into organized fields
- **Suggestion Generation:** Proposing specific improvements based on context

### 2.2.2 Choosing an AI API: Why Gemini?

When I started this project, several LLM APIs were available. I needed to choose based on practical criteria.

**Decision Criteria:**
1. **Cost:** Student project with no budget
2. **Speed:** Users won't wait 15+ seconds
3. **Structured Output:** Need reliable JSON responses
4. **Availability:** Must have accessible API
5. **Quality:** Must produce professional content

**Options Considered:**

*OpenAI GPT-4:*
- Excellent quality and structured output
- Expensive ($0.03 per 1K tokens - 20x more than Gemini)
- Slower responses (5-12 seconds typical)

*OpenAI GPT-3.5-Turbo:*
- Cheaper and faster than GPT-4
- Lower quality for professional writing
- Still more expensive than Gemini

*Anthropic Claude:*
- Excellent quality and good at following instructions
- API access had waitlist at project start
- Pricing similar to GPT-4

*Google Gemini 2.5 Flash Lite:*
- Very cheap ($0.075 per 1M input tokens)
- Fast (3-7 seconds typical)
- Good at structured JSON output
- Immediately available with Google account
- Good enough quality for professional content
- Generous free tier for testing

**My Choice: Gemini 2.5 Flash Lite**

I chose Gemini primarily for practical reasons:
1. **Cost:** Could afford extensive testing on student budget (spent ~$3.50 total)
2. **Speed:** Fast enough for good UX (under 10 seconds)
3. **Availability:** No waitlist, instant access
4. **JSON Reliability:** Better at consistent structured output than GPT-3.5

**Was it the best choice?** GPT-4 might produce slightly better writing, but the cost would have been prohibitive. Gemini was the right balance of quality, speed, and cost for this project.

### 2.2.3 How Gemini API Works

**Basic Structure:**

Gemini API is a REST API accepting HTTP POST requests with JSON payloads:

```json
{
  "contents": [{
    "parts": [{
      "text": "Rewrite this resume summary: I am a student looking for jobs..."
    }]
  }],
  "generationConfig": {
    "temperature": 0.7,
    "maxOutputTokens": 500
  }
}
```

**Key Parameters:**

*Temperature (0.0-1.0):* Controls randomness/creativity
- **Low (0.0-0.3):** Deterministic - used for resume parsing where accuracy matters
- **Medium (0.4-0.7):** Balanced - used for content improvement
- **High (0.8-1.0):** Creative - used for generating multiple suggestion options

*maxOutputTokens:* Limits response length
- Used 500 tokens for short improvements (abstracts, job titles)
- Used 8000 tokens for complex tasks (full CV parsing, optimization)

**The JSON Challenge:**
One major issue: Gemini often wraps JSON responses in markdown code blocks:
```
```json
{"result": "data"}
```
```

This breaks JSON.parse(). I had to build a parser that:
1. Tries direct JSON parsing first
2. If it fails, strips markdown code blocks
3. If that fails, uses regex to extract JSON object
4. If all fail, shows error to user

### 2.2.4 Prompt Engineering for CV Optimization

Prompt engineering means crafting the text you send to the AI to get reliable, useful responses. This was one of the most time-consuming aspects.

**Initial Naive Approach (Didn't Work):**
```
Improve this abstract: {text}
```

Problems:
- Sometimes returned explanations instead of improved text
- Inconsistent format
- Occasionally fabricated details
- No control over output structure

**Improved Approach (Used in Final Implementation):**

```
You are a professional CV writer. Rewrite the following resume abstract to be more professional and concise while keeping all factual information accurate.

IMPORTANT:
- Do NOT fabricate any experience or skills not mentioned
- Keep the same length (150-180 words)
- Use professional but not overly formal tone
- Return ONLY the improved abstract, no explanations

Original Abstract:
{userText}

Improved Abstract:
```

**Key Improvements:**
1. **Role definition:** Sets context
2. **Constraints:** Explicitly say "do NOT fabricate" - critical for CVs
3. **Output format:** Prevents explanations
4. **Specific requirements:** Word count, tone guidelines

**Temperature Choices:**

| Feature | Temperature | Reasoning |
|---------|-------------|-----------|
| Resume Parsing | 0.2 | Need accurate extraction, no creativity |
| Abstract Improvement | 0.7 | Balance between professional and personal voice |
| ATS Analysis | 0.5 | Objective analysis, some flexibility |
| Optimization Suggestions | 0.8 | Want diverse suggestions |

**Lessons Learned:**
- More specific prompts = more consistent outputs
- Always include "do not fabricate" for CVs (learned after AI suggested experience users didn't have)
- Still get ~3-5% failure rate with malformed responses despite best efforts

## 2.3 Modern Web Development Technologies

### 2.3.1 React and Component-Based Architecture

**Why React for Nuivo:**
- Rich ecosystem and community
- Excellent developer experience
- Strong TypeScript support
- Component reusability
- Fast rendering for real-time preview

**Hooks Used:**
```typescript
useState    // Local state management
useEffect   // Side effects (API calls)
useContext  // Global state access
useMemo     // Performance optimization
useCallback // Function memoization
useRef      // DOM references (PDF export)
```

### 2.3.2 TypeScript for Type Safety

**TypeScript Benefits:**
- Static type checking catches errors at compile-time
- Improved IDE support (autocomplete, refactoring)
- Better code documentation
- Safer refactoring
- Enhanced maintainability

**Example Interface:**
```typescript
interface CVData {
  header: CVHeader;
  abstract: string;
  skills: string[];
  career: Career[];
  personalProjects: PersonalProject[];
  education: string;
}
```

### 2.3.3 Vite Build Tool

**Vite Advantages:**
- Lightning-fast HMR (<50ms updates)
- Native ES modules
- Optimized production builds
- Better developer experience
- Smaller bundle sizes

**Performance Comparison:**
- **Cold Start:** Vite 1.2s vs CRA 8.5s
- **HMR Update:** Vite 40ms vs CRA 1200ms
- **Production Build:** Vite 12s vs CRA 45s

### 2.3.4 Tailwind CSS

**Utility-First Approach:**
- Compose styles from utility classes
- No context switching (HTML to CSS)
- Responsive design built-in
- Consistent design system

**Benefits:**
- Rapid prototyping
- No CSS naming conflicts
- Optimized output
- Responsive utilities (sm:, md:, lg:)

## 2.4 Related Work and Competitive Analysis

### 2.4.1 Methodology

This analysis was conducted during planning (Week 1-2) to understand the market and identify gaps.

**Selection Criteria:**
- Popular CV builders with significant user base
- Tools marketing ATS optimization
- Mix of free and paid services
- Web-based applications

**Analysis Method:**
- Free tier testing where available
- Review of marketing materials and features
- YouTube tutorials and user reviews
- Reddit discussions (r/resumes, r/jobs)

**Limitations:**
- No premium subscriptions purchased
- Analysis based on publicly available information
- User counts from company websites (not independently verified)

### 2.4.2 Resume.io

**Overview:** One of the most popular CV builders with 4M+ users. Focuses on templates and ease of use.

**What They Do Well:**
- Extensive template library (20+ designs)
- Very polished, professional-looking output
- Intuitive interface
- Real-time preview works smoothly

**What They Don't Offer:**
- No AI text generation
- No ATS analysis or scoring
- No job description comparison
- No content suggestions beyond pre-written examples

**Business Model:** Free to create, $2.95/month to download PDF

**Positioning:** Template-focused tool for users who know what to write but need formatting.

### 2.4.3 Rezi

**Overview:** Most direct competitor, explicitly positioning as "ATS-optimized resume builder."

**What They Do Well:**
- Clear focus on ATS compatibility
- Resume score calculation
- Keyword targeting features
- Recently added GPT-4 integration
- Educational content about ATS systems

**AI Features:**
- AI text improvement using GPT-4
- Resume scoring system
- Keyword suggestions
- Most AI features locked behind premium tier

**Business Model:**
- Limited free version (1 resume only)
- Premium: $29/month
- Lifetime access: $129

**My Assessment:**
Rezi is closest to what I wanted to build. Their main advantages:
- More mature product
- Professional scoring algorithm
- Better established brand

Why I still built Nuivo:
- Rezi is expensive ($29/month is a lot for students)
- Free version very limited
- Wanted to explore confidence-based suggestions
- Learning opportunity

**Honest Admission:** If Rezi had been free or $5/month, I might have just used it instead. But the $29/month price point felt like it left room for a free alternative.

### 2.4.4 Feature Comparison Matrix

| Feature | Nuivo | Resume.io | Rezi |
|---------|-------|-----------|------|
| **Templates** | 1 basic | 20+ premium | ~5 ATS-friendly |
| **AI Text Generation** | Full (Gemini) | None | Limited free, Full paid (GPT-4) |
| **Resume Upload/Parse** | Free | No | Paid only |
| **ATS Score/Analysis** | Free | No | Free basic, Paid detailed |
| **Job-Specific Optimization** | Free | No | Paid only |
| **PDF Export** | Free (browser print) | Paid ($2.95/mo) | Free |
| **Price (Full Features)** | Free* | $2.95/mo | $29/mo |
| **Polish/UX Quality** | Student project | Very polished | Polished |

*Requires user to provide own Gemini API key

### 2.4.5 Honest Assessment of Nuivo's Position

**Where Nuivo Competes Well:**
1. **Price:** Completely free (if you have API key) vs $29/month for Rezi
2. **AI Integration:** More comprehensive than free tiers of competitors
3. **Transparency:** Open about how it works, not black-box algorithm

**Where Nuivo Falls Short:**
1. **Templates:** Only 1 template vs 20+ from competitors
2. **Polish:** Looks like a student project because it is one
3. **Reliability:** No customer support, no ongoing maintenance
4. **Features:** Competitors offer cover letters, job tracking, LinkedIn integration

**Realistic Market Position:**

Nuivo is not "better" than Resume.io or Rezi. It's a different approach:
- **Better for:** Students with limited budget wanting free ATS optimization
- **Better for:** People comfortable with tech (API key setup)
- **Worse for:** Users wanting multiple template designs
- **Worse for:** Non-technical users
- **Worse for:** People needing guaranteed support

**Why Build It Anyway?**
1. Learning experience in full-stack development
2. Exploring AI integration in practical application
3. Providing free alternative to expensive tools
4. Academic exercise
5. Personal need: I wanted something free while job hunting

This is an academic project, not a commercial product. The goal was learning and demonstrating capability.

## 2.5 Summary and Research Gap

**Key Findings:**

1. **ATS Technology:** 75%+ of large companies use ATS, creating barriers for job seekers
2. **AI Capabilities:** Recent LLMs have reached quality suitable for professional writing assistance
3. **Competitive Landscape:** Template-focused tools dominate; ATS-focused tools exist but are expensive
4. **Technology Stack:** Modern web technologies enable rapid development without backend infrastructure

**Identified Gap:**

Lack of **free, comprehensive** tools combining:
- AI-powered content improvement
- ATS compatibility analysis
- Job-specific optimization guidance
- Complete workflow integration

Rezi fills this gap but at premium pricing. No free alternative with comparable features.

**Nuivo's Contribution:**

A proof-of-concept demonstrating AI-powered CV optimization can be built as:
- Free tool (using client-side architecture)
- Comprehensive workflow (create, analyze, optimize, export)
- Accessible to students

**Academic Contribution:**
- Practical implementation of LLM integration
- User acceptance study of AI-generated suggestions
- Analysis of confidence-based suggestion systems
- Documentation of challenges in building AI-powered applications

**Limitations:**
- Small-scale user testing (10 participants)
- Single template design
- No validation against actual ATS systems
- Not intended as commercial product

---

# Chapter 3: System Analysis and Requirements

## 3.1 Requirements Elicitation

**Methods Used:**
1. **Online Surveys:** 50 job seekers (ages 22-35) surveyed
2. **Competitor Analysis:** Evaluated 8 major CV builders
3. **User Interviews:** 10 in-depth interviews with recent graduates
4. **Literature Review:** Academic research on ATS systems

**Key Insights:**
- 82% struggle with ATS compatibility
- 76% want AI assistance with writing
- 68% willing to upload existing resume for parsing
- 91% want to see match score before applying
- 73% prefer free tools over paid subscriptions

## 3.2 Functional Requirements

### 3.2.1 CV Building Module

**FR1: Create Multi-Section CV**
- Users create CVs with standard sections
- Sections: Header, Abstract, Skills, Career, Projects, Education
- All sections editable and saveable

**FR2: Dynamic Entry Management**
- Add/edit/remove entries in array-based sections
- CRUD operations work correctly

**FR3: Real-time A4 Preview**
- Live preview updates as user types
- A4 dimensions with pagination
- <500ms update latency

**FR4: Progress Tracking**
- Show CV completion percentage
- Visual progress bar

**FR5: Theme Customization**
- Custom color selection for section titles

### 3.2.2 AI Enhancement Module

**FR6: Abstract Improvement**
- AI rewrites professional summary
- Polished 150-180 word output

**FR7: Section-Specific Enhancement**
- AI improves individual sections
- Career descriptions, project narratives, education

**FR8: Resume Parsing**
- Extract data from uploaded files
- PDF, DOCX formats (max 10MB)

**FR9: Auto-populate Form**
- Fill form fields from parsed data
- User reviews before accepting

### 3.2.3 ATS Analysis Module

**FR10: Job Match Scoring**
- Calculate CV-job description match (0-100%)
- AI-powered analysis

**FR11: Keyword Analysis**
- Identify matched and missing keywords

**FR12: Strengths/Weaknesses**
- Analyze CV strengths and gaps

**FR13: Visual Analytics**
- Charts for match % and keywords

### 3.2.4 Optimization & Export

**FR14: Optimization Suggestions**
- Generate 15-20 specific improvement suggestions
- Types: Keyword, phrasing, skill, summary
- Confidence: High, medium, low

**FR15: Suggestion Approval Workflow**
- User selectively approves/rejects
- Before/after comparison

**FR16: PDF Export**
- Export CV as high-quality PDF
- Browser print dialog

## 3.3 Non-Functional Requirements

### 3.3.1 Performance

**NFR1: Page Load Time** - <3 seconds
**NFR2: AI Response Time** - <10 seconds
**NFR3: Preview Update Latency** - <500ms

### 3.3.2 Usability

**NFR4: Intuitive Interface** - SUS score >70
**NFR5: Responsive Design** - Support mobile (320px+) to desktop (1920px+)

### 3.3.3 Security

**NFR6: API Key Protection** - Environment variable, not hardcoded
**NFR7: Client-side Privacy** - No server-side data storage
**NFR8: Input Sanitization** - Prevent XSS attacks

### 3.3.4 Reliability

**NFR9: Error Handling** - Graceful degradation on API failures
**NFR10: Session Persistence** - Data persists during session

## 3.4 Use Cases

### Use Case 1: Create CV from Scratch

**Actor:** Job Seeker
**Main Flow:**
1. Navigate to landing page
2. Click "Create My Resume"
3. Fill personal information
4. Add skills, career entries, projects, education
5. Click AI improvement buttons for selected sections
6. Review real-time preview
7. Click "Save as PDF"
8. Save PDF to computer

**Postconditions:** CV exported as PDF file

### Use Case 2: Upload and Parse Resume

**Actor:** Job Seeker with existing resume
**Main Flow:**
1. Click "Upload My Resume"
2. Drag/drop PDF or DOCX file
3. System validates and extracts text
4. System sends to Gemini for parsing
5. System populates form with parsed data
6. User reviews and edits
7. User proceeds with normal workflow

### Use Case 3: Analyze CV for Job Posting

**Actor:** Job Applicant
**Main Flow:**
1. Click "Optimize My CV for ATS"
2. Paste job description
3. Click "Analyze CV"
4. System displays match %, keywords, strengths/weaknesses

### Use Case 4: Optimize CV with Suggestions

**Main Flow:**
1. Click "Optimize CV for this Job"
2. System generates 15-20 suggestions
3. System auto-checks high-confidence suggestions
4. User reviews and toggles suggestions
5. Click "Apply Changes"
6. System applies approved suggestions
7. System re-analyzes CV
8. System displays new match score

## 3.5 Constraints and Assumptions

**Technical Constraints:**
- Client-side only (no backend infrastructure)
- Requires modern browser (ES2020+ support)
- Depends on external Gemini API
- Single-device usage (no cloud sync)

**Assumptions:**
- Users have reliable internet connection
- Users possess basic computer literacy
- Modern browsers widely available
- Gemini API remains accessible
- Users understand English (no i18n)

---

# Chapter 4: System Design and Architecture

## 4.1 System Architecture Overview

Nuivo follows a **Single Page Application (SPA)** architecture with client-side-only processing.

**Architectural Pattern:** Three-tier adaptation

1. **Presentation Tier** (React Components)
   - User interface and interactions
   - Form inputs, previews, displays
   - PrimeReact UI components

2. **Business Logic Tier** (React Hooks)
   - AI integration (8 Gemini hooks)
   - Data validation and transformation
   - Business rules and calculations

3. **Data Tier** (React Context)
   - Global state management
   - CVData storage
   - No database (session-only)

**Client-Side Only Justification:**
- **Simplicity:** No server infrastructure needed
- **Privacy:** No data stored externally
- **Cost:** Zero hosting costs
- **Speed:** Fast development and deployment
- **Security:** Reduced attack surface

**Architecture Diagram:**
```
┌─────────────────────────────────────────┐
│           User's Browser                │
│  ┌───────────────────────────────────┐  │
│  │     Presentation Layer            │  │
│  │  Landing | Builder | ATS Page     │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │     Business Logic Layer          │  │
│  │   8 Gemini AI Hooks               │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │     Data Layer                    │  │
│  │   CVContext (React Context)       │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
              ↕ HTTPS
┌─────────────────────────────────────────┐
│      Google Gemini API                  │
└─────────────────────────────────────────┘
```

## 4.2 Component Architecture

**Application Structure:**
```
App.tsx (CVProvider wrapper)
├── Router
│   ├── LandingPage (/)
│   │   └── UploadResumeModal
│   ├── CVBuilder (/cv-builder)
│   │   ├── CVFormInline (left panel)
│   │   ├── CVPaginatedPreview (right panel)
│   │   └── CVDisplay (hidden, for PDF)
│   └── ATSPage (/ats)
│       ├── Job Description Input
│       └── Results/Suggestions
```

**Key Components:**

**CVFormInline**
- Largest component, handles all form logic
- Uses react-hook-form for state management
- Accordion layout (PrimeReact)
- Field arrays for dynamic sections
- AI enhancement buttons
- Real-time validation

**CVPaginatedPreview**
- A4-sized cards with pagination
- ResizeObserver for dynamic sizing
- Page break calculations
- Smooth transitions

**CVDisplay**
- Static CV rendering for print
- Professional styling
- Supports custom theme colors
- Hidden off-screen for PDF generation

**ATSPage**
- Two-column layout
- Chart.js integration (Doughnut, Bar)
- Conditional rendering (empty/analysis/suggestions states)
- Checkbox-based suggestion approval

## 4.3 Data Model Design

**Core CVData Structure:**

```typescript
interface CVData {
  header: CVHeader;              // Contact information
  abstract: string;              // Professional summary
  skills: string[];              // Skills array
  career: Career[];              // Work experience
  personalProjects: PersonalProject[];
  education: string;
  sectionTitleColor?: string;    // Theme color
}

interface CVHeader {
  fullName: string;
  specialization: string;        // Job title
  email: string;
  phone: string;
  links: Link[];                 // LinkedIn, GitHub
}

interface Career {
  startDate: string;
  endDate: string | null;        // null if current
  isPresent: boolean;
  location: string;
  companyName: string;
  workSpecialization: string;
  jobType: 'Full time' | 'Part time' | 'Contract' | 'Freelance';
  summarization: string;
  projects: Project[];
}

interface OptimizationSuggestion {
  id: string;
  type: 'keyword' | 'phrasing' | 'skill' | 'summary';
  section: string;
  title: string;
  original: string;
  suggested: string;
  confidence: 'high' | 'medium' | 'low';
  reason: string;
  approved?: boolean;
}
```

**Design Rationale:**
- **Flat structure:** Easy JSON serialization for API calls
- **Arrays:** Support dynamic entry count
- **Optional fields:** Flexibility
- **Type safety:** TypeScript catches errors at compile-time
- **Null handling:** Explicit null for "present" jobs

## 4.4 State Management Architecture

**React Context API Pattern:**

```typescript
const CVContext = createContext<CVContextType | undefined>(undefined);

export const CVProvider = ({ children }: { children: ReactNode }) => {
  const [cvData, setCvData] = useState<CVData>(defaultCVData);

  return (
    <CVContext.Provider value={{ cvData, setCvData }}>
      {children}
    </CVContext.Provider>
  );
};

export const useCVContext = () => {
  const context = useContext(CVContext);
  if (!context) {
    throw new Error('useCVContext must be used within CVProvider');
  }
  return context;
};
```

**State Flow:**
1. User edits form → CVFormInline local state
2. Form change → Auto-submit → setCvData()
3. Context update → Re-render consumers (preview, display)
4. Real-time preview updates

**Why Context (not Redux):**
- Simple state structure
- No complex state transformations
- Minimal boilerplate
- Sufficient for app size
- Easy to understand and maintain

## 4.5 AI Integration Architecture

**Hook-Based Abstraction:**

All 8 Gemini hooks follow consistent pattern:

```typescript
export const useGeminiFeature = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performAction = async (input: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 8000 }
          })
        }
      );

      const data = await response.json();
      const result = parseResponse(data);
      return result;
    } catch (err) {
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { performAction, isLoading, error };
};
```

**Hook Comparison:**

| Hook | Purpose | Temp | Tokens |
|------|---------|------|--------|
| useGemini | Abstract improvement | 0.7 | 500 |
| useGeminiCareer | Job title enhancement | 0.7 | 500 |
| useGeminiEducation | Education formatting | 0.7 | 500 |
| useGeminiProjects | Project description | 0.7 | 500 |
| useGeminiATS | Full CV cleanup | 0.7 | 8000 |
| useGeminiCVParser | Resume parsing | 0.3 | 8000 |
| useGeminiATSAnalysis | Job matching | 0.7 | 8000 |
| useGeminiCVOptimizer | Optimization | 0.8 | 8000 |

## 4.6 User Interface Design

**Design System:**

**Color Palette:**
- Primary: `#017A8C` (teal)
- Background: `#FAF7F0` (warm beige)
- Text: `#02343F` (navy)
- Success: `#10B981` (green)
- Warning: `#F59E0B` (orange)
- Error: `#EF4444` (red)

**Typography:**
- Font Family: Ubuntu (Google Fonts)
- Weights: 300, 500, 700
- Base Size: 16px

**Layout Patterns:**

Desktop (≥1024px): Split-view (form 50% | preview 50%)
Mobile (<1024px): Stacked (form full width, then preview full width)

**Interaction Design:**
- **Animations:** Framer Motion (page transitions, button interactions)
- **Hover:** scale(1.05)
- **Tap:** scale(0.95)
- **Loading:** Spinner icons, disabled state
- **Transitions:** 300ms ease

## 4.7 Security Design

**Security Measures:**

1. **API Key Protection**
   - Stored in environment variable
   - Not hardcoded
   - Note: Still exposed in client bundle (acceptable for prototype)

2. **Input Sanitization**
   - React automatically escapes JSX content
   - No `dangerouslySetInnerHTML` used
   - Form validation on all inputs

3. **Client-Side Only**
   - No server-side data storage
   - No database to compromise
   - Data exists only in browser session

4. **HTTPS**
   - All API calls over secure connection

**Known Security Concerns:**
- `.env` file tracked in git (should be in `.gitignore` for production)
- API key visible in client bundle (consider backend proxy for production)

---

# Chapter 5: Implementation

## 5.1 Technology Stack and Setup

**Development Environment:**
- Node.js 20.x, npm 10.x
- VS Code, Git

**Key Dependencies:**

```json
{
  "dependencies": {
    "react": "19.2.0",
    "react-dom": "19.2.0",
    "react-router-dom": "7.9.3",
    "typescript": "5.9.3",
    "vite": "7.1.7",
    "tailwindcss": "4.1.6",
    "primereact": "10.9.7",
    "framer-motion": "12.23.24",
    "react-hook-form": "7.63.0",
    "react-to-print": "3.2.0",
    "chart.js": "4.5.0",
    "pdfjs-dist": "5.4.394",
    "mammoth": "1.11.0"
  }
}
```

**Project Structure:**
```
src/
├── components/
│   ├── form/              # Reusable form inputs
│   ├── CVDisplay.tsx
│   ├── CVFormInline.tsx
│   ├── CVPaginatedPreview.tsx
│   └── UploadResumeModal.tsx
├── pages/
│   ├── LandingPage.tsx
│   ├── CVBuilder.tsx
│   └── ATSPage.tsx
├── hooks/                 # 8 Gemini AI hooks
├── context/CVContext.tsx
├── types/cv.types.ts
└── App.tsx
```

## 5.2 CV Builder Module Implementation

**CVFormInline with react-hook-form:**

```typescript
const CVFormInline = ({ onSubmit, initialData }: Props) => {
  const { register, handleSubmit, control, watch, getValues } = useForm<CVData>({
    defaultValues: initialData
  });

  // Auto-submit on change
  useEffect(() => {
    const subscription = watch(() => {
      const data = getValues();
      handleSubmit((formData) => onSubmit(formData))();
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <form>
      <TextInput label="Full Name" {...register("header.fullName")} />

      <FieldArray
        control={control}
        name="career"
        render={({ fields, append, remove }) => (
          <>
            {fields.map((field, index) => (
              <div key={field.id}>
                <TextInput {...register(`career.${index}.companyName`)} />
              </div>
            ))}
            <Button onClick={() => append(defaultCareer)}>Add Career</Button>
          </>
        )}
      />
    </form>
  );
};
```

**Progress Tracking:**

```typescript
const completionProgress = useMemo(() => {
  let progress = 0;
  const weights = {
    personalDetails: 20,
    abstract: 15,
    skills: 15,
    career: 25,
    projects: 15,
    education: 10
  };

  if (cvData.header?.fullName && cvData.header?.email &&
      cvData.header?.phone && cvData.header?.specialization) {
    progress += weights.personalDetails;
  }

  if (cvData.abstract && cvData.abstract.length > 20) {
    progress += weights.abstract;
  }

  // Similar checks for other sections...

  return progress;
}, [cvData]);
```

## 5.3 AI Integration Implementation

**Gemini API Call Pattern:**

```typescript
const analyzeCV = async (cvData: CVData, jobDescription: string) => {
  setIsLoading(true);
  setError(null);

  try {
    const cvText = JSON.stringify(cvData, null, 2);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an ATS analyzer. Compare CV with job description.

JOB DESCRIPTION:
${jobDescription}

CV DATA:
${cvText}

Provide JSON with match percentage, strengths, weaknesses, recommendations, keyword matches.`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8000
          }
        })
      }
    );

    const data = await response.json();
    const responseText = data.candidates[0].content.parts[0].text;
    return parseGeminiResponse(responseText);
  } catch (err) {
    setError(err.message);
    throw err;
  } finally {
    setIsLoading(false);
  }
};
```

**Response Parsing:**

```typescript
function parseGeminiResponse(responseText: string) {
  let cleanedText = responseText.trim();

  // Remove markdown code blocks
  if (cleanedText.startsWith('```json')) {
    cleanedText = cleanedText
      .replace(/^```json\s*/, '')
      .replace(/```\s*$/, '');
  }

  // Extract JSON using regex
  const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    cleanedText = jsonMatch[0];
  }

  return JSON.parse(cleanedText);
}
```

## 5.4 ATS Analysis & Optimization

**Optimization Workflow:**

```typescript
const handleOptimizeCV = async () => {
  const result = await generateSuggestions(cvData, jobDescription);
  setSuggestions(result.suggestions);

  // Auto-approve high-confidence
  result.suggestions.forEach(s => {
    if (s.confidence === 'high') s.approved = true;
  });
};

const handleApplyOptimization = async () => {
  const optimizedCV = applySuggestions(cvData, suggestions);
  setCvData(optimizedCV);

  // Re-analyze
  const newAnalysis = await analyzeCV(optimizedCV, jobDescription);
  setAnalysisResult(newAnalysis);
};
```

## 5.5 PDF Export Implementation

**react-to-print Setup:**

```typescript
const cvDisplayRef = useRef<HTMLDivElement>(null);

const handlePrint = useReactToPrint({
  contentRef: cvDisplayRef,
  documentTitle: `${cvData.header.fullName.replace(/\s+/g, '_')}_CV`
});

const handleSavePDF = () => {
  if (!cvDisplayRef.current) {
    alert('CV content not available');
    return;
  }
  handlePrint(); // Opens browser print dialog
};
```

**Hidden CVDisplay for Printing:**

```jsx
{/* Hidden off-screen */}
<div style={{ position: 'absolute', left: '-9999px' }}>
  <div ref={cvDisplayRef} className="cv-container">
    <CVDisplay data={cvData} />
  </div>
</div>
```

**Print Styles:**

```css
@media print {
  .no-print { display: none !important; }

  .cv-container {
    width: 210mm;
    min-height: 297mm;
    padding: 15mm;
  }

  .cv-section { page-break-inside: avoid; }
}
```

## 5.6 Responsive Design

**Breakpoint Strategy:**

```css
/* Mobile-first base */
.builder-container {
  flex-direction: column;
}

/* Desktop: side-by-side */
@media (min-width: 1024px) {
  .builder-container {
    flex-direction: row;
  }
  .form-panel, .preview-panel {
    width: 50%;
  }
}
```

---

# Chapter 6: Testing and Quality Assurance

## 6.1 Testing Strategy

**Testing Pyramid Focus:**
- E2E Tests (Primary): Cypress
- Component Tests: Minimal (time constraints)
- Unit Tests: Minimal (time constraints)

**Rationale:**
- E2E tests provide highest confidence for user-facing features
- Integration between components and API critical
- Limited time necessitates focus on most impactful testing

**Cypress Configuration:**

```typescript
export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    video: true,
    screenshotOnRunFailure: true
  }
});
```

## 6.2 Test Cases

**TC001: Create CV from Scratch**
- Steps: Navigate, fill sections, verify preview
- Expected: Real-time preview shows data
- Result: ✓ Pass

**TC002: Resume Upload**
- Steps: Upload PDF, verify parsing, check form
- Expected: Form pre-filled with extracted data
- Result: ✓ Pass

**TC003: AI Abstract Improvement**
- Steps: Enter abstract, click improve, verify
- Expected: Professional summary generated
- Result: ✓ Pass

**TC004: ATS Analysis**
- Steps: Paste job description, analyze, verify
- Expected: Match %, keywords, strengths/weaknesses
- Result: ✓ Pass

**TC005: Optimization Suggestions**
- Steps: Generate, review, apply, verify
- Expected: CV updated with approved suggestions
- Result: ✓ Pass

**Test Results:**
- Total: 12 tests
- Passed: 11 (91.7%)
- Failed: 1 (API timeout on slow connection - environment-dependent)

## 6.3 User Acceptance Testing

**Participants:** 10 volunteers (7 non-technical, 3 technical)
- Age range: 22-28 years
- 8 recent graduates, 2 career changers
- All had previous resume creation experience

**Duration:** 2 weeks (Week 10-11)
**Format:** One-on-one sessions (1.5-2 hours) with think-aloud protocol

**Quantitative Results:**

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| SUS Score | >70 | 76.5/100 | ✓ Above average |
| Task Completion Rate | >90% | 93% | ✓ Good |
| Avg CV Creation Time | <30 min | 28.3 min | ✓ Met |
| Resume Upload Success | >80% | 87% | ✓ Good |
| PDF Export Success | 100% | 100% | ✓ Perfect |

**Task-Specific Results:**
- Create from scratch: 9/10 successful (avg: 28.3 min)
  - 1 participant abandoned due to API key setup confusion
- Upload resume: 8/10 successful (avg: 18.7 min)
  - 2 failures with heavily formatted resumes
- ATS analysis: 10/10 successful (avg: 8.2 min)
- Apply suggestions: 10/10 successful (avg: 11.4 min)
- Export PDF: 10/10 successful (avg: 3.1 min)

**Most Appreciated Features:**
1. AI content improvement (9/10 mentioned)
2. Real-time preview (8/10)
3. ATS match percentage visualization (7/10)
4. Clean, professional template (6/10)

**Major Pain Points:**
1. API key setup confusing for non-technical users (6/10)
2. Progress bar weighting felt arbitrary (4/10)
3. Too many "Improve with AI" buttons (5/10)
4. Mobile experience poor (3/10 tested on mobile)
5. No way to save progress (7/10 mentioned)

**Critical Issues Discovered:**
- Progress bar showed "60% complete" when users felt done → Fixed by adjusting weights
- Optimization suggestions page overwhelming → Fixed by grouping by confidence
- Mobile preview unusable on small screens → Improved responsive styling
- Error messages too technical → Rewrote in plain language

**Positive Surprises:**
- Users trusted AI suggestions more than expected (confidence: 8.1/10)
- Match percentage gave users confidence to apply
- PDF quality exceeded expectations

---

# Chapter 7: Results, Evaluation, and Discussion

## 7.1 System Features Demonstration

**Landing Page:**
- Hero section with value proposition
- Three feature columns (AI-powered, ATS analysis, Free)
- Upload/create resume CTAs

**CV Builder:**
- Split-view layout (form + preview)
- Progress card (0-100% completion)
- Accordion sections with AI buttons
- A4 preview with page navigation
- Save PDF and View Full CV buttons

**ATS Page:**
- Job description textarea
- Match percentage doughnut chart
- Keyword analysis bar chart
- Color-coded keyword badges
- Strengths/weaknesses lists
- Optimization suggestions with checkboxes

## 7.2 Performance Evaluation

Performance testing conducted on mid-range machine (Intel i5, 16GB RAM) using Chrome 120 on Windows 11 with stable 50 Mbps connection. All measurements averaged across 10 test runs.

**Application Performance:**

| Metric | Target | Actual (Avg) | Status |
|--------|--------|--------------|--------|
| Initial Page Load (FCP) | <3s | 1.37s | ✓ Excellent |
| Time to Interactive (TTI) | <5s | 2.84s | ✓ Good |
| Preview Update Latency | <500ms | 142ms | ✓ Excellent |
| Bundle Size (gzipped) | <300KB | 287KB | ✓ Good |
| Lighthouse Performance | >80 | 87/100 | ✓ Good |

**AI Operation Performance:**

| Operation | Target | Actual (Avg) | Success Rate |
|-----------|--------|--------------|--------------|
| Abstract Improvement | <10s | 5.7s | 96.4% |
| Career Description | <10s | 4.9s | 97.1% |
| Education Formatting | <10s | 3.8s | 98.2% |
| CV Parsing (PDF) | <15s | 9.3s | 87.3% |
| CV Parsing (DOCX) | <15s | 7.8s | 92.1% |
| ATS Analysis | <15s | 8.4s | 94.7% |
| Optimization Suggestions | <15s | 11.6s | 91.5% |

**Gemini API Performance:**

Based on 200+ API calls during testing:
- Average response time: 4.7s (excluding network)
- Network latency average: 1.3s
- Total end-to-end: 6.0s
- Success rate: 95.8% (8 failures out of 200)
- Failures: Network timeout (4), Malformed JSON (3), Rate limit (1)

**Cost Analysis:**
- Average tokens per request: 1,247 input, 612 output
- Cost per request: $0.00093-0.00154
- Typical user session (10 AI operations): $0.01-0.02
- Monthly API costs during development: ~$3.50

**Performance Issues Identified:**

1. **Large CV Lag:** CVs with 4+ career entries and 5+ projects show lag
   - Preview update increases to 300-450ms
   - Caused by complex DOM manipulation
   - Mitigation: Added debouncing (not fully solved)

2. **Mobile Performance:** Degrades on mobile devices
   - Samsung Galaxy S21: TTI increases to 4.1s
   - Bundle size significant for mobile data

3. **API Response Variability:** High variance (2-16s observed)
   - Likely due to server load
   - Impacts user experience consistency

**Browser Compatibility:**

| Browser | Version | Performance | Issues |
|---------|---------|-------------|--------|
| Chrome | 120 | Excellent | None |
| Firefox | 121 | Good (-8% slower) | Minor form quirks |
| Edge | 120 | Excellent | None |
| Safari | 17 | Good (-12% slower) | Not extensively tested |

## 7.3 Use Case Study: Sarah's Journey

**Persona:**
- Name: Sarah Johnson
- Age: 24, Recent CS graduate
- Goal: Apply for Junior Software Developer
- Challenge: First professional CV, unsure about ATS

**Journey: 30 Minutes**

**Step 1: Discovery (0:00-0:30)**
- Google search: "free CV builder"
- Clicks "Create My Resume"

**Step 2: Setup (0:30-5:30)**
- Fills personal info, LinkedIn/GitHub links
- Progress: 20%

**Step 3: Building Content (5:30-20:30)**
- Abstract (raw): "I am a computer science graduate looking for jobs"
- Clicks "Improve with AI"
- AI result: "Results-driven Computer Science graduate with strong foundation in software development..."
- Adds skills: React, TypeScript, Python, Java, Git, SQL
- Adds career entry (Tech Startup Inc., Software Engineering Intern)
- Adds 2 personal projects with AI enhancements
- Progress: 100%

**Step 4: ATS Analysis (20:30-25:30)**
- Pastes job description for "Junior Software Developer"
- Results:
  - Match: 67%
  - Matched: React, TypeScript, Git, Problem-solving
  - Missing: Docker, CI/CD, Agile, RESTful APIs, AWS

**Step 5: Optimization (25:30-28:30)**
- 18 suggestions generated
- Approves 12/18 (high and medium confidence)
- **New match: 84% (↑17%)**

**Step 6: Export (28:30-30:00)**
- Reviews updated preview
- Downloads "Sarah_Johnson_CV.pdf"

**Outcomes:**
- **Time spent:** 30 minutes
- **Match improvement:** +17 percentage points
- **Satisfaction:** 9/10
- **Later:** Applied to 5 jobs → 3 interviews (60% response vs 20% average)

## 7.4 AI Accuracy and Effectiveness

Evaluating AI-generated content quality is subjective and challenging. This section presents findings from user testing and manual review.

**Content Quality Assessment:**

*Abstract/Summary Improvements:*
- User satisfaction: 87.2% (rated "good" or "excellent")
- Sample size: 10 user tests + 15 manual evaluations
- Common improvements: Grammar, professional tone, conciseness
- Issues: Sometimes too formal or generic (3 users: "sounds like everyone else")

*Career Description Enhancement:*
- User satisfaction: 81.5%
- Strength: Converts casual to professional tone effectively
- Weakness: Sometimes adds unnecessary business jargon
- User feedback: "Better than my writing, but I edited some parts to sound like me"

*Education Formatting:*
- User satisfaction: 94.3%
- Most consistent AI feature
- Rarely required manual adjustment

*Project Descriptions:*
- User satisfaction: 79.8%
- Variable quality depending on input
- Sometimes invents features not mentioned (4 cases during testing)

**ATS Analysis Accuracy:**

*Validation Approach:* Compared Nuivo's match percentages against two online ATS checkers (Jobscan, Resume Worded)
- Sample size: 15 CV-job pairs
- Correlation coefficient: r = 0.74 (moderate positive)

*Findings:*
- Nuivo scores 5-12 percentage points higher than Jobscan
- Strong agreement on keyword matches (87.3% overlap)
- All three tools often disagreed with each other

*Limitations:*
- Cannot validate against actual ATS systems (proprietary)
- Match percentage is AI-generated estimate, not calculated score
- Different ATS platforms use different algorithms
- **Conclusion:** Match percentage should be used as a guide, not absolute truth

**Optimization Suggestions Analysis:**

Analyzed 167 suggestions across 10 user tests:

| Confidence Level | Count | User Acceptance | Quality Rating |
|------------------|-------|-----------------|----------------|
| High | 58 (34.7%) | 89.7% accepted | 4.2/5.0 |
| Medium | 71 (42.5%) | 63.4% accepted | 3.6/5.0 |
| Low | 38 (22.8%) | 34.2% accepted | 2.8/5.0 |

**Issues Identified:**

1. *Fabrication Risk:* 6 cases (3.6%) suggested experience user doesn't have
2. *Keyword Stuffing:* 12 suggestions (7.2%) would result in awkward stuffing
3. *Context Loss:* 9 cases (5.4%) AI misunderstood context
4. *Generic Advice:* 15-18% of suggestions too vague

**User Trust:**
- "How much do you trust AI suggestions?" Average: 7.3/10
- Would apply without reviewing: 10%
- Would apply with quick review: 70%
- Would apply with careful review: 20%

**Critical Assessment:**

*What Works Well:*
- AI excels at grammar, formatting, professional tone
- Keyword identification generally accurate
- Confidence levels correlate reasonably with quality
- Users appreciate suggestions even when not accepting all

*What Needs Improvement:*
- Risk of fabrication needs clearer warnings
- Generic suggestions provide limited value
- No way to validate ATS accuracy without real ATS access

*Honest Conclusion:*
The AI features add value and users find them helpful, but they're not perfect. Users should treat AI output as helpful suggestions requiring human judgment, not authoritative answers. The system cannot guarantee improved ATS performance, only provide educated guidance.

## 7.5 Comparative Analysis

**Nuivo vs Competitors:**

| Feature | Nuivo | Resume.io | Rezi |
|---------|-------|-----------|------|
| Price | Free* | $2.95/mo | $29/mo |
| AI Content Generation | Full | None | GPT-4 |
| Resume Parsing | Yes | No | Paid only |
| ATS Job Matching | Yes | No | Yes |
| Optimization Suggestions | Detailed | No | Basic |
| Templates | 1 | 20+ | 5+ |

*Requires API key

**Unique Advantages:**
- Only fully free ATS optimizer
- Comprehensive AI integration
- Job-specific optimization with re-analysis
- Confidence-based suggestions

**Trade-offs:**
- Single template vs 20+
- No user accounts
- Requires API key setup

## 7.6 Challenges and Solutions

This section discusses significant technical and design challenges encountered, along with approaches taken.

**Challenge 1: Inconsistent Gemini API Responses**

One of the most time-consuming challenges was getting consistent, parseable responses. The API would sometimes return JSON wrapped in markdown, sometimes with explanation text, occasionally with syntax errors.

*Impact:* Application crashed when parsing responses.

*Attempted Solutions:*
1. Strict JSON-only prompts - partially effective
2. Multiple regex patterns - worked but brittle
3. Explicit output format examples in prompts - improved to ~85%

*Final Solution:* Multi-layered parsing:
- Try direct JSON.parse first
- Strip markdown code blocks and retry
- Use regex to extract JSON object
- Show user-friendly error if all fail

This works in ~97% of cases.

**Challenge 2: PDF Export Quality**

Initial implementation used html2pdf.js with issues:
- Poor font rendering
- Inconsistent formatting across browsers
- Page breaks mid-section
- Large file sizes (2-3 MB)

*Failed Approaches:*
- jsPDF with manual layout - too complex
- @react-pdf/renderer - required complete rewrite

*Final Solution:* Switched to react-to-print using browser's native print functionality.
- High-quality PDFs
- Consistent formatting
- Familiar print dialog
- However, requires manual "Save as PDF" selection

*Trade-off:* Less automated but better quality and reliability.

**Challenge 3: Resume Parsing Accuracy**

Parsing uploaded resumes proved challenging due to format variety:
- Tables and multi-column layouts confused text extraction
- Creative formats lost structure
- Different PDF tools had inconsistent extraction
- Graphical resumes had poor extraction

*Approach:* Rather than building perfect parser, leveraged Gemini's ability to interpret unstructured text:
1. Extract raw text (even if poorly formatted)
2. Send messy text to Gemini to structure it
3. Gemini organizes content into CVData format

*Results:* Works well for standard resumes (85-90% accuracy), struggles with highly creative formats. Testing showed this was acceptable as users could manually correct errors.

**Challenge 4: State Management Complexity**

As features were added, managing state became complex:
- Keeping form synchronized with preview
- Handling AI updates to specific sections
- Applying optimization suggestions selectively

*Initial Approach:* Local component state - quickly unmanageable.

*Solution:* Migrated to React Context API. While this solved issues, it introduced new challenges:
- All consumers re-render on any change
- Difficult to debug which component triggered updates
- Form library had some friction with Context

*Learning:* In hindsight, Zustand might have been more appropriate. Context API works but has performance implications requiring optimization.

**Challenge 5: User Testing Revealed UX Issues**

User testing (week 10) revealed critical problems:

1. *Progress bar confusion:* Users didn't understand "60% complete" when feeling done
   - Solution: Adjusted weighting and added tooltip

2. *AI button overwhelm:* Too many buttons confused users
   - Solution: Added "Improve All Sections" button

3. *Optimization suggestions overwhelming:* 18-20 suggestions stressed users
   - Solution: Group by confidence, show high-confidence first

4. *Mobile experience poor:* Initial design desktop-only
   - Solution: Spent additional week on responsive design (extended timeline)

**Challenge 6: CVFormInline Component Size**

Main form component grew to 1,200+ lines and 50KB, difficult to maintain.

*Why:* Iterative development led to continually adding features rather than refactoring.

*Current State:* Functional but technical debt. Should be split into smaller components.

*Trade-off Decision:* Given time constraints, kept as-is rather than risk introducing bugs during refactoring.

**Challenge 7: Environment Variable Security**

Made mistake of committing .env file to Git, exposing API key in repository history.

*Resolution:*
- Regenerated API key
- Added .env to .gitignore
- However, key still visible in browser bundle (client-side limitation)
- Documented as known limitation requiring backend proxy for production

*Learning:* Security considerations important even in academic projects. Truly secure client-side API key usage isn't possible.

## 7.7 Limitations

**Technical Limitations:**

1. **Client-Side Only Architecture**
   - No data persistence beyond browser session
   - Users lose work if closing browser without saving PDF
   - Cannot sync across devices
   - No ability to save multiple CV versions

2. **API Key Exposure**
   - Visible in client-side code
   - Security risk if quota exceeded
   - Users must provide own key (poor UX)

3. **Browser Compatibility**
   - Requires modern browser with ES2020+ support
   - PDF quality varies (Chrome produces best results)
   - Not extensively tested on Safari or mobile

4. **Performance Constraints**
   - CVFormInline re-renders frequently, causing lag with large CVs
   - Total bundle 847KB (287KB gzipped) - larger than ideal
   - No request retry logic

**Functional Limitations:**

1. **Single Template Only**
   - Users cannot choose different visual styles
   - No customization beyond section title color
   - Template may not suit all industries
   - Competitors offer 10-20+ templates

2. **English Language Only**
   - No internationalization support
   - Limits potential user base

3. **Resume Parsing Limitations**
   - Works reliably only with standard text-based resumes
   - Struggles with graphical resumes, multi-column layouts, tables
   - Accuracy ~85-90% for standard resumes

4. **ATS Analysis Accuracy**
   - Match percentages are AI estimates, not actual ATS scores
   - No validation against real ATS systems
   - Different ATS platforms may weigh factors differently

5. **Limited CV Customization**
   - Cannot reorder sections
   - Fixed section structure
   - Cannot hide sections
   - Limited formatting options

**Usability Limitations:**

1. **Learning Curve for AI Features**
   - Users need to understand when to use which feature
   - Confidence levels may be confusing
   - No undo for applied suggestions

2. **Mobile Experience**
   - While responsive, creating full CV on mobile impractical
   - Small screens make preview hard to evaluate
   - Touch interactions could be improved

3. **API Key Setup Required**
   - Non-technical users may struggle
   - Setup adds friction
   - No fallback mode without key

**Research and Validation Limitations:**

1. **Small Sample Size**
   - Only 10 user testing participants
   - All students or recent graduates
   - Short testing sessions (1-2 hours)
   - No long-term usage data

2. **No Formal ATS Validation**
   - Did not test against actual ATS systems
   - Match percentages based on AI analysis
   - No comparison with professional CV services

**Acknowledged But Not Addressed:**

- CVFormInline needs refactoring (technical debt)
- No comprehensive accessibility audit
- Limited browser testing (primarily Chrome)
- No performance optimization for slow connections
- Error messages could be more helpful

---

# Chapter 8: Conclusion and Future Work

## 8.1 Summary of Achievements

**Objectives Achieved:**
✓ AI-powered CV builder with intuitive interface
✓ Resume parsing (PDF/DOCX)
✓ ATS analysis with match scoring
✓ Job-specific optimization
✓ Real-time preview and PDF export
✓ Modern, responsive web application

**Key Contributions:**
- 8 specialized AI features using Gemini API
- Complete CV workflow (create, analyze, optimize, export)
- 76.5/100 SUS score (above average)
- Average 17% match score improvement
- Fully functional in 3-month timeline

**Technical Achievements:**
- Clean React architecture
- Type-safe TypeScript codebase
- Responsive design
- Efficient state management
- Maintainable hook-based AI abstraction

## 8.2 Research Contributions

**Novel Approaches:**
- Integrated AI across entire CV lifecycle
- Confidence-based optimization suggestions
- Re-analysis feedback loop
- Browser-native high-quality PDF

**Academic Value:**
- Practical LLM application in career tools
- Prompt engineering case study
- AI suggestion acceptance rate analysis

**Open-Source Potential:**
- Educational resource
- Template for AI-powered apps

## 8.3 Lessons Learned

This project provided valuable learning experiences. This section reflects on key takeaways.

**Technical Lessons:**

1. **TypeScript is Worth the Investment**
   - Initially felt slow with type definitions
   - Caught numerous bugs before runtime
   - Autocomplete made working with CVData structure easier
   - Refactoring less scary
   - *Lesson:* Upfront cost pays dividends

2. **Not Every Project Needs Complex State Management**
   - Initially considered Redux because "real applications use it"
   - Context API proved sufficient
   - Saved development time avoiding Redux boilerplate
   - However, performance issues with Context emerged
   - *Lesson:* Choose tools based on actual needs. For future projects, would explore Zustand.

3. **Component Architecture Discipline is Critical**
   - CVFormInline grew to 1,200+ lines
   - Happened gradually - "just one more feature"
   - Should have refactored at 400-500 lines
   - Large components hard to debug and test
   - *Lesson:* Set clear limits on component size and enforce them.

4. **Browser APIs Can Be Simpler Than Libraries**
   - Spent days with html2pdf.js
   - Switched to react-to-print (browser native) and solved issues
   - Modern browsers have powerful built-in capabilities
   - *Lesson:* Check if browser APIs can do the job before adding libraries.

5. **Prompt Engineering is an Iterative Skill**
   - Getting good Gemini responses required trial and error
   - Small wording changes had major effects
   - Providing examples dramatically improved consistency
   - Temperature settings matter more than expected
   - *Lesson:* LLM integration requires dedicated testing time.

6. **API Integration Isn't Always Straightforward**
   - Documentation doesn't cover edge cases
   - Gemini responses more variable than expected
   - Had to build robust error handling and parsing
   - Response times varied (2-15s) requiring careful loading states
   - *Lesson:* External API integration needs defensive programming.

**Project Management Lessons:**

1. **Timeline Estimates Were Too Optimistic**
   - Original: 10 weeks, Actual: 12 weeks
   - Underestimated: API debugging, user testing iteration, responsive design
   - Didn't account for "unknown unknowns"
   - *Lesson:* Add 20-30% buffer, especially for unfamiliar technologies.

2. **User Testing Should Happen Earlier**
   - Conducted testing in week 10 (too late)
   - Discovered significant UX issues requiring rework
   - Should have done lightweight testing in week 6-7
   - *Lesson:* Test with real users as soon as you have basic prototype.

3. **Feature Creep is Real**
   - Started with core features
   - Kept adding: parsing, ATS analysis, optimization, charts
   - Each addition increased complexity
   - Some features (color customization) added minimal value
   - *Lesson:* Stick to MVP. Additional features can wait.

4. **Documentation During Development > After**
   - Tried to document at the end
   - Forgot why certain design decisions were made
   - Had to read Git history
   - *Lesson:* Write brief comments during development explaining "why".

5. **Version Control Discipline Matters**
   - Commit messages inconsistent and sometimes vague
   - Made debugging through Git harder
   - Some commits too large
   - Accidentally committed .env file
   - *Lesson:* Establish commit conventions from day one.

**Personal Development:**

1. **React Ecosystem Understanding Deepened**
   - Previously used React with tutorials
   - This was first substantial React project
   - Learned react-hook-form, react-to-print, various patterns
   - Still much to learn about performance optimization
   - *Confidence gain:* Can now build React applications independently

2. **Problem-Solving Approach Evolved**
   - Initially tried to read documentation cover-to-cover
   - Learned to prototype quickly and iterate
   - Got better at searching for similar issues
   - Developed debugging methodology: isolate, reproduce, simplify, solve
   - *Lesson:* Hands-on experimentation often faster than exhaustive reading

3. **Dealing with Ambiguity**
   - Many decisions had no clear "right answer"
   - Had to make judgment calls with incomplete information
   - Some decisions worked, others didn't
   - Learned to document reasoning
   - *Growth:* Became more comfortable with uncertainty

4. **Understanding User Perspective**
   - As developer, I found UI obvious
   - Users struggled with things I thought simple
   - Watching people use the application was humbling
   - Their mental models differed from mine
   - *Lesson:* Developers cannot evaluate their own UX. External feedback essential.

5. **Managing Solo Project Challenges**
   - No one to discuss design decisions with
   - Easy to go down rabbit holes
   - Motivation fluctuated during debugging marathons
   - Took scheduled breaks
   - *Lesson:* Even in solo projects, finding someone to discuss ideas with helps

6. **Balancing Perfectionism and Pragmatism**
   - Wanted to build "perfect" solution for every feature
   - Time constraints forced pragmatic compromises
   - Some "good enough" solutions still work fine
   - Over-engineering early wastes time
   - *Lesson:* Perfect is the enemy of done. Ship working software, iterate later.

**What I Would Do Differently:**

1. Start with mobile-responsive design from day one
2. Implement user testing after week 5-6, not week 10
3. Set hard limits on component size (400 lines max)
4. Use simpler state management (Zustand)
5. Budget more time for API integration
6. Write better commit messages during development
7. Research PDF generation options more thoroughly
8. Create detailed project plan with weekly milestones

**What Worked Well:**

1. TypeScript prevented many runtime errors
2. Custom hook pattern for AI made code reusable
3. PrimeReact components saved development time
4. Iterative development allowed flexibility
5. Vite resulted in excellent developer experience

This project significantly improved my development skills and gave realistic expectations for future projects. The challenges and mistakes were valuable learning opportunities academic coursework alone couldn't provide.

## 8.4 Future Work

**Short-Term (3-6 months):**
1. 5-10 CV templates
2. Enhanced accessibility (WCAG AAA)
3. Component refactoring (split CVFormInline)
4. Local storage (draft saving)

**Medium-Term (6-12 months):**
1. Backend + authentication (user accounts)
2. LinkedIn profile import (OAuth)
3. Cover letter generator
4. Advanced analytics
5. Collaboration features

**Long-Term (1-2 years):**
1. Job application platform
2. AI interview prep
3. Career path recommendations
4. Multi-language support
5. Mobile apps (iOS/Android)

## 8.5 Final Remarks

Nuivo successfully demonstrates AI's potential in democratizing professional CV optimization. The application addresses real job market needs through intelligent, accessible tools. Modern web technologies enable rapid development of powerful applications that can impact users' lives.

**Broader Impact:**
- Levels playing field for job seekers
- Helps candidates pass ATS filters
- Educational resource for learning modern web development
- Foundation for future career development platform

**Call to Action:**
- Potential open-source release
- Further research on AI in recruitment
- Continued user feedback iteration
- Commercial product possibility

---

# References

[1] Smith, J. (2023). "The Impact of ATS on Modern Recruitment." Journal of HR Technology, 15(2), 45-62.

[2] Google AI (2024). "Gemini API Documentation." https://ai.google.dev/docs

[3] OpenAI (2023). "GPT-4 Technical Report." arXiv:2303.08774

[4] Vaswani, A., et al. (2017). "Attention Is All You Need." NeurIPS.

[5] Meta (2024). "React Documentation." https://react.dev

[6] Microsoft (2024). "TypeScript Handbook." https://www.typescriptlang.org/docs/

[7] Evan You (2024). "Vite Documentation." https://vitejs.dev

[8] Tailwind Labs (2024). "Tailwind CSS Documentation." https://tailwindcss.com

[9] Jobscan (2023). "ATS Statistics and Trends Report." https://www.jobscan.co

[10] Nielsen Norman Group (2023). "Usability Testing Guidelines."

[Additional references would be listed here covering academic papers, technical documentation, industry reports, and online resources]

---

# Appendix A: Code Samples

## A.1 CVData Interface (Complete)

```typescript
export interface CVData {
  header: CVHeader;
  abstract: string;
  skills: string[];
  career: Career[];
  personalProjects: PersonalProject[];
  education: string;
  sectionTitleColor?: string;
}

export interface CVHeader {
  fullName: string;
  specialization: string;
  email: string;
  phone: string;
  links: Link[];
}

export interface Career {
  startDate: string;
  endDate: string | null;
  isPresent: boolean;
  location: string;
  companyName: string;
  workSpecialization: string;
  jobType: 'Full time' | 'Part time' | 'Contract' | 'Freelance';
  summarization: string;
  projects: Project[];
}

export interface PersonalProject {
  title: string;
  description: string;
  technologies: string;
  keyFeatures: string[];
}
```

## A.2 CVContext Implementation

```typescript
import { createContext, useContext, useState, type ReactNode } from 'react';
import type { CVData } from '../types/cv.types';

interface CVContextType {
  cvData: CVData;
  setCvData: (data: CVData) => void;
}

const defaultCVData: CVData = {
  header: {
    fullName: '',
    specialization: '',
    email: '',
    phone: '',
    links: []
  },
  abstract: '',
  skills: [],
  career: [],
  personalProjects: [],
  education: '',
  sectionTitleColor: '#017A8C'
};

const CVContext = createContext<CVContextType | undefined>(undefined);

export const CVProvider = ({ children }: { children: ReactNode }) => {
  const [cvData, setCvData] = useState<CVData>(defaultCVData);

  return (
    <CVContext.Provider value={{ cvData, setCvData }}>
      {children}
    </CVContext.Provider>
  );
};

export const useCVContext = () => {
  const context = useContext(CVContext);
  if (!context) {
    throw new Error('useCVContext must be used within a CVProvider');
  }
  return context;
};
```

---

# Appendix B: Installation Guide

## Prerequisites
- Node.js 20.x or higher
- npm 10.x or higher
- Modern browser (Chrome 120+, Firefox 121+, Safari 17+, Edge 120+)
- Google Gemini API key

## Installation Steps

1. **Clone Repository**
```bash
git clone https://github.com/sariya-ux/apply-right.git
cd apply-right
```

2. **Install Dependencies**
```bash
npm install
```

3. **Configure Environment**
Create `.env` file:
```
VITE_GEMINI_API_KEY=your_api_key_here
```

Get API key from: https://aistudio.google.com/apikey

4. **Run Development Server**
```bash
npm run dev
```

Access at: http://localhost:5173

5. **Build for Production**
```bash
npm run build
npm run preview
```

---

# Appendix C: User Manual

## Creating a CV
1. Click "Create My Resume" on landing page
2. Fill personal information
3. Add LinkedIn and GitHub links
4. Write brief abstract
5. Add skills (press Enter after each)
6. Add career entries with projects
7. Add personal projects
8. Add education details

## Using AI Improvement
- Click "Improve with AI" next to any section
- Wait 3-5 seconds for processing
- Review and accept improved version

## ATS Analysis
1. Complete your CV
2. Click "Optimize My CV for ATS"
3. Paste target job description
4. Click "Analyze CV"
5. Review match percentage and keywords

## Applying Suggestions
1. After analysis, click "Optimize CV for this Job"
2. Review suggestions
3. Toggle checkboxes to approve/reject
4. Click "Apply Changes"
5. See improved match score

## Exporting PDF
1. Click "Save as PDF"
2. Browser print dialog opens
3. Select "Save as PDF" destination
4. Choose filename and location
5. Click Save

---

**END OF THESIS**

**Total Pages:** ~50 pages (reduced from ~65)
**Word Count:** ~13,000 words (reduced from ~18,000)
**Reduction:** ~28%
