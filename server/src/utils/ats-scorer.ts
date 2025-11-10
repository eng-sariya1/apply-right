interface CVData {
  personalInfo: any;
  experience: any[];
  education: any[];
  skills: any[];
  certifications: any[];
  projects: any[];
}

interface ATSScore {
  overall: number;
  keywordMatch: number;
  formatCompatibility: number;
  sectionCompleteness: number;
  contactInfo: number;
  fileFormat: number;
  lengthScore: number;
  suggestions: string[];
  missingKeywords: string[];
  strengths: string[];
}

export class ATSScorer {
  private commonKeywords = [
    'leadership', 'management', 'communication', 'teamwork', 'problem-solving',
    'analytical', 'project management', 'strategic planning', 'collaboration',
    'innovation', 'results-driven', 'customer service', 'technical skills'
  ];

  calculateScore(cvData: CVData, targetKeywords: string[] = []): ATSScore {
    const keywordScore = this.calculateKeywordMatch(cvData, targetKeywords);
    const formatScore = this.calculateFormatCompatibility(cvData);
    const completenessScore = this.calculateSectionCompleteness(cvData);
    const contactScore = this.calculateContactInfo(cvData);
    const fileFormatScore = 100; // Assuming JSON/text format is ATS-friendly
    const lengthScore = this.calculateLengthScore(cvData);

    // Weighted calculation
    const overall = Math.round(
      keywordScore * 0.30 +
      formatScore * 0.25 +
      completenessScore * 0.20 +
      contactScore * 0.10 +
      fileFormatScore * 0.10 +
      lengthScore * 0.05
    );

    const suggestions = this.generateSuggestions(cvData, keywordScore, completenessScore);
    const missingKeywords = this.findMissingKeywords(cvData, targetKeywords);
    const strengths = this.identifyStrengths(cvData);

    return {
      overall,
      keywordMatch: keywordScore,
      formatCompatibility: formatScore,
      sectionCompleteness: completenessScore,
      contactInfo: contactScore,
      fileFormat: fileFormatScore,
      lengthScore,
      suggestions,
      missingKeywords,
      strengths
    };
  }

  private calculateKeywordMatch(cvData: CVData, targetKeywords: string[]): number {
    const allKeywords = [...this.commonKeywords, ...targetKeywords];
    const cvText = JSON.stringify(cvData).toLowerCase();
    
    let matchCount = 0;
    allKeywords.forEach(keyword => {
      if (cvText.includes(keyword.toLowerCase())) {
        matchCount++;
      }
    });

    return Math.min(100, Math.round((matchCount / Math.max(allKeywords.length, 1)) * 100));
  }

  private calculateFormatCompatibility(cvData: CVData): number {
    let score = 100;
    
    // Check for special characters that might cause issues
    const cvText = JSON.stringify(cvData);
    const problematicChars = /[^\x00-\x7F]/g;
    const specialCharCount = (cvText.match(problematicChars) || []).length;
    
    if (specialCharCount > 50) score -= 20;
    else if (specialCharCount > 20) score -= 10;

    // Check for proper structure
    if (!cvData.personalInfo) score -= 20;
    if (!cvData.experience || cvData.experience.length === 0) score -= 15;
    if (!cvData.education || cvData.education.length === 0) score -= 15;

    return Math.max(0, score);
  }

  private calculateSectionCompleteness(cvData: CVData): number {
    let score = 0;
    const maxScore = 100;
    const sectionWeights = {
      personalInfo: 25,
      experience: 25,
      education: 20,
      skills: 15,
      certifications: 7.5,
      projects: 7.5
    };

    // Personal Info
    if (cvData.personalInfo) {
      const pi = cvData.personalInfo;
      let piScore = 0;
      if (pi.fullName) piScore += 30;
      if (pi.email) piScore += 25;
      if (pi.phone) piScore += 20;
      if (pi.location) piScore += 15;
      if (pi.summary) piScore += 10;
      score += (piScore / 100) * sectionWeights.personalInfo;
    }

    // Experience
    if (cvData.experience && cvData.experience.length > 0) {
      const hasDetails = cvData.experience.some(exp => 
        exp.description && exp.achievements && exp.achievements.length > 0
      );
      score += hasDetails ? sectionWeights.experience : sectionWeights.experience * 0.6;
    }

    // Education
    if (cvData.education && cvData.education.length > 0) {
      score += sectionWeights.education;
    }

    // Skills
    if (cvData.skills && cvData.skills.length >= 5) {
      score += sectionWeights.skills;
    } else if (cvData.skills && cvData.skills.length > 0) {
      score += sectionWeights.skills * 0.5;
    }

    // Certifications
    if (cvData.certifications && cvData.certifications.length > 0) {
      score += sectionWeights.certifications;
    }

    // Projects
    if (cvData.projects && cvData.projects.length > 0) {
      score += sectionWeights.projects;
    }

    return Math.round(score);
  }

  private calculateContactInfo(cvData: CVData): number {
    if (!cvData.personalInfo) return 0;
    
    let score = 0;
    const pi = cvData.personalInfo;
    
    if (pi.email && this.isValidEmail(pi.email)) score += 40;
    if (pi.phone) score += 30;
    if (pi.location) score += 20;
    if (pi.linkedin || pi.website) score += 10;

    return score;
  }

  private calculateLengthScore(cvData: CVData): number {
    const experienceCount = cvData.experience?.length || 0;
    const educationCount = cvData.education?.length || 0;
    const totalSections = experienceCount + educationCount;

    // Ideal: 2-4 experiences, 1-2 education entries
    if (totalSections >= 3 && totalSections <= 6) return 100;
    if (totalSections >= 2 && totalSections <= 8) return 80;
    if (totalSections >= 1) return 60;
    return 40;
  }

  private generateSuggestions(cvData: CVData, keywordScore: number, completenessScore: number): string[] {
    const suggestions: string[] = [];

    if (keywordScore < 50) {
      suggestions.push('Add more industry-relevant keywords to improve ATS matching');
    }

    if (!cvData.personalInfo?.summary) {
      suggestions.push('Add a professional summary to highlight your key qualifications');
    }

    if (!cvData.skills || cvData.skills.length < 5) {
      suggestions.push('Include at least 5-10 relevant skills to improve keyword matching');
    }

    if (cvData.experience && cvData.experience.length > 0) {
      const hasQuantifiableAchievements = cvData.experience.some(exp =>
        exp.achievements?.some((ach: string) => /\d+/.test(ach))
      );
      if (!hasQuantifiableAchievements) {
        suggestions.push('Add quantifiable achievements (numbers, percentages) to your experience');
      }
    }

    if (!cvData.certifications || cvData.certifications.length === 0) {
      suggestions.push('Consider adding relevant certifications to strengthen your profile');
    }

    if (completenessScore < 70) {
      suggestions.push('Complete all sections to maximize your ATS score');
    }

    return suggestions;
  }

  private findMissingKeywords(cvData: CVData, targetKeywords: string[]): string[] {
    const cvText = JSON.stringify(cvData).toLowerCase();
    const missing: string[] = [];

    [...this.commonKeywords, ...targetKeywords].forEach(keyword => {
      if (!cvText.includes(keyword.toLowerCase())) {
        missing.push(keyword);
      }
    });

    return missing.slice(0, 10); // Return top 10 missing keywords
  }

  private identifyStrengths(cvData: CVData): string[] {
    const strengths: string[] = [];

    if (cvData.personalInfo?.summary) {
      strengths.push('Professional summary included');
    }

    if (cvData.experience && cvData.experience.length >= 2) {
      strengths.push('Strong work experience section');
    }

    if (cvData.skills && cvData.skills.length >= 8) {
      strengths.push('Comprehensive skills list');
    }

    if (cvData.certifications && cvData.certifications.length > 0) {
      strengths.push('Professional certifications included');
    }

    if (cvData.projects && cvData.projects.length > 0) {
      strengths.push('Relevant projects showcased');
    }

    const hasQuantifiableAchievements = cvData.experience?.some(exp =>
      exp.achievements?.some((ach: string) => /\d+/.test(ach))
    );
    if (hasQuantifiableAchievements) {
      strengths.push('Quantifiable achievements present');
    }

    return strengths;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

export default new ATSScorer();
