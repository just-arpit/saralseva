import mongoose from 'mongoose';
import Scheme from '../models/Scheme.js';

class AIService {
  constructor() {
    this.schemeEmbeddings = new Map();
    this.initialized = false;
    this.schemes = [];
  }

  async initialize() {
    try {
      console.log('Initializing AI Service...');
      
      // Load schemes without heavy ML models for now
      await this.loadSchemes();
      
      this.initialized = true;
      console.log('AI Service initialized successfully');
    } catch (error) {
      console.error('Error initializing AI Service:', error);
      // Don't throw error, just log it and continue with basic functionality
      this.initialized = true;
    }
  }

  async loadSchemes() {
    try {
      this.schemes = await Scheme.find({ status: 'active' });
      console.log(`Loaded ${this.schemes.length} schemes for AI service`);
    } catch (error) {
      console.error('Error loading schemes:', error);
      this.schemes = [];
    }
  }


  async processQuery(query, userProfile = null) {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      // Simple keyword-based matching for now
      const relevantSchemes = this.findRelevantSchemes(query);
      
      // Generate answer
      const answer = this.generateSimpleAnswer(query, relevantSchemes, userProfile);
      
      return {
        answer,
        relevantSchemes: relevantSchemes.map(s => ({
          id: s._id.toString(),
          name: s.name,
          description: s.shortDescription,
          similarity: s.similarity || 0.8,
          eligibility: s.eligibility,
          benefits: s.benefits,
          applicationProcess: s.applicationProcess
        })),
        confidence: relevantSchemes.length > 0 ? 85 : 30,
        sources: relevantSchemes.map(s => ({
          schemeName: s.name,
          department: s.department.name,
          similarity: s.similarity || 0.8
        }))
      };
    } catch (error) {
      console.error('Error processing query:', error);
      return {
        answer: "I'm experiencing technical difficulties. Please try again in a moment.",
        relevantSchemes: [],
        confidence: 0,
        sources: []
      };
    }
  }

  findRelevantSchemes(query) {
    const queryLower = query.toLowerCase();
    const relevantSchemes = [];
    
    for (const scheme of this.schemes) {
      let score = 0;
      
      // Check name match
      if (scheme.name.toLowerCase().includes(queryLower)) {
        score += 3;
      }
      
      // Check description match
      if (scheme.description.toLowerCase().includes(queryLower)) {
        score += 2;
      }
      
      // Check category match
      if (scheme.category.toLowerCase().includes(queryLower)) {
        score += 2;
      }
      
      // Check keywords
      if (scheme.keywords && scheme.keywords.some(keyword => 
        keyword.toLowerCase().includes(queryLower) || queryLower.includes(keyword.toLowerCase())
      )) {
        score += 1;
      }
      
      // Check eligibility keywords
      if (queryLower.includes('eligible') || queryLower.includes('qualify')) {
        if (scheme.eligibility) {
          score += 1;
        }
      }
      
      if (score > 0) {
        relevantSchemes.push({
          ...scheme.toObject(),
          similarity: Math.min(score / 5, 1)
        });
      }
    }
    
    return relevantSchemes
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5);
  }

  generateSimpleAnswer(query, relevantSchemes, userProfile) {
    const queryLower = query.toLowerCase();
    
    if (relevantSchemes.length === 0) {
      return "I couldn't find any relevant government schemes for your query. Please try rephrasing your question or provide more specific details about what you're looking for.";
    }

    const topScheme = relevantSchemes[0];
    
    if (queryLower.includes('eligible') || queryLower.includes('qualify')) {
      return this.generateEligibilityAnswer(query, relevantSchemes, userProfile);
    } else if (queryLower.includes('apply') || queryLower.includes('application')) {
      return this.generateApplicationAnswer(query, relevantSchemes);
    } else if (queryLower.includes('benefit') || queryLower.includes('amount')) {
      return this.generateBenefitAnswer(query, relevantSchemes);
    } else {
      return this.generateGeneralAnswer(query, relevantSchemes);
    }
  }

  detectHindi(text) {
    // Simple Hindi detection based on Devanagari script
    const hindiRegex = /[\u0900-\u097F]/;
    return hindiRegex.test(text);
  }

  async generateAnswer(query, similarSchemes, userProfile) {
    if (similarSchemes.length === 0) {
      return "I couldn't find any relevant government schemes for your query. Please try rephrasing your question or provide more specific details about what you're looking for.";
    }

    const topScheme = similarSchemes[0];
    const confidence = topScheme.similarity;

    // Generate contextual answer based on query type
    if (this.isEligibilityQuery(query)) {
      return this.generateEligibilityAnswer(query, similarSchemes, userProfile);
    } else if (this.isApplicationQuery(query)) {
      return this.generateApplicationAnswer(query, similarSchemes);
    } else if (this.isBenefitQuery(query)) {
      return this.generateBenefitAnswer(query, similarSchemes);
    } else {
      return this.generateGeneralAnswer(query, similarSchemes);
    }
  }

  isEligibilityQuery(query) {
    const eligibilityKeywords = [
      'eligible', 'eligibility', 'qualify', 'qualification', 'criteria',
      'age', 'income', 'category', 'state', 'education', 'occupation'
    ];
    return eligibilityKeywords.some(keyword => 
      query.toLowerCase().includes(keyword)
    );
  }

  isApplicationQuery(query) {
    const applicationKeywords = [
      'apply', 'application', 'process', 'steps', 'documents',
      'required', 'how to', 'procedure'
    ];
    return applicationKeywords.some(keyword => 
      query.toLowerCase().includes(keyword)
    );
  }

  isBenefitQuery(query) {
    const benefitKeywords = [
      'benefit', 'amount', 'money', 'financial', 'subsidy',
      'loan', 'assistance', 'support', 'help'
    ];
    return benefitKeywords.some(keyword => 
      query.toLowerCase().includes(keyword)
    );
  }

  generateEligibilityAnswer(query, relevantSchemes, userProfile) {
    const topScheme = relevantSchemes[0];
    const scheme = topScheme;
    
    let answer = `Based on your query, here's information about **${scheme.name}**:\n\n`;
    
    // Check user eligibility if profile provided
    if (userProfile) {
      const isEligible = this.checkUserEligibility(scheme, userProfile);
      answer += `**Eligibility Status**: ${isEligible ? '✅ You are eligible' : '❌ You may not be eligible'}\n\n`;
      
      if (!isEligible) {
        answer += `**Why you might not be eligible**:\n`;
        const reasons = this.getEligibilityReasons(scheme, userProfile);
        answer += reasons.map(reason => `• ${reason}`).join('\n') + '\n\n';
      }
    }
    
    answer += `**Eligibility Criteria**:\n`;
    
    if (scheme.eligibility.ageRange) {
      answer += `• Age: ${scheme.eligibility.ageRange.min || 0} to ${scheme.eligibility.ageRange.max || 100} years\n`;
    }
    
    if (scheme.eligibility.incomeRange) {
      answer += `• Income: ₹${scheme.eligibility.incomeRange.min || 0} to ₹${scheme.eligibility.incomeRange.max || 'unlimited'}\n`;
    }
    
    if (scheme.eligibility.category?.length) {
      answer += `• Categories: ${scheme.eligibility.category.join(', ')}\n`;
    }
    
    if (scheme.eligibility.states?.length) {
      answer += `• States: ${scheme.eligibility.states.join(', ')}\n`;
    }
    
    if (scheme.eligibility.occupations?.length) {
      answer += `• Occupations: ${scheme.eligibility.occupations.join(', ')}\n`;
    }
    
    if (scheme.eligibility.education?.length) {
      answer += `• Education: ${scheme.eligibility.education.join(', ')}\n`;
    }
    
    // Special categories
    const specialCategories = [];
    if (scheme.eligibility.isForWomen) specialCategories.push('Women');
    if (scheme.eligibility.isForDisabled) specialCategories.push('Disabled');
    if (scheme.eligibility.isForSeniorCitizen) specialCategories.push('Senior Citizens');
    if (scheme.eligibility.isForMinority) specialCategories.push('Minorities');
    
    if (specialCategories.length) {
      answer += `• Special Categories: ${specialCategories.join(', ')}\n`;
    }
    
    return answer;
  }

  generateApplicationAnswer(query, relevantSchemes) {
    const topScheme = relevantSchemes[0];
    const scheme = topScheme;
    
    let answer = `Here's how to apply for **${scheme.name}**:\n\n`;
    
    answer += `**Application Process**:\n`;
    
    if (scheme.applicationProcess.isOnline) {
      answer += `• **Online Application**: Available\n`;
      if (scheme.applicationProcess.onlineUrl) {
        answer += `• **Apply at**: ${scheme.applicationProcess.onlineUrl}\n`;
      }
    }
    
    if (scheme.applicationProcess.isOffline) {
      answer += `• **Offline Application**: Available\n`;
    }
    
    if (scheme.applicationProcess.steps?.length) {
      answer += `\n**Step-by-step Process**:\n`;
      scheme.applicationProcess.steps.forEach((step, index) => {
        answer += `${index + 1}. ${step.title}: ${step.description}\n`;
      });
    }
    
    if (scheme.applicationProcess.processingTime) {
      answer += `\n**Processing Time**: ${scheme.applicationProcess.processingTime}\n`;
    }
    
    if (scheme.requiredDocuments?.length) {
      answer += `\n**Required Documents**:\n`;
      scheme.requiredDocuments.forEach(doc => {
        answer += `• ${doc.name}${doc.isMandatory ? ' (Mandatory)' : ' (Optional)'}\n`;
      });
    }
    
    return answer;
  }

  generateBenefitAnswer(query, relevantSchemes) {
    const topScheme = relevantSchemes[0];
    const scheme = topScheme;
    
    let answer = `Here are the benefits of **${scheme.name}**:\n\n`;
    
    answer += `**Benefit Type**: ${scheme.benefits.type}\n`;
    answer += `**Description**: ${scheme.benefits.description}\n`;
    
    if (scheme.benefits.amount) {
      if (scheme.benefits.amount.min && scheme.benefits.amount.max) {
        answer += `**Amount**: ₹${scheme.benefits.amount.min} to ₹${scheme.benefits.amount.max}\n`;
      } else if (scheme.benefits.amount.min) {
        answer += `**Amount**: From ₹${scheme.benefits.amount.min}\n`;
      } else if (scheme.benefits.amount.max) {
        answer += `**Amount**: Up to ₹${scheme.benefits.amount.max}\n`;
      }
    }
    
    if (scheme.benefits.isRecurring) {
      answer += `**Frequency**: ${scheme.benefits.frequency || 'Recurring'}\n`;
    }
    
    return answer;
  }

  generateGeneralAnswer(query, relevantSchemes) {
    const topScheme = relevantSchemes[0];
    const scheme = topScheme;
    
    let answer = `I found **${scheme.name}** which seems relevant to your query:\n\n`;
    
    answer += `**Description**: ${scheme.shortDescription}\n\n`;
    answer += `**Category**: ${scheme.category}\n`;
    answer += `**Level**: ${scheme.level}\n`;
    answer += `**Department**: ${scheme.department.name}\n`;
    
    if (scheme.benefits.description) {
      answer += `\n**Benefits**: ${scheme.benefits.description}\n`;
    }
    
    return answer;
  }

  checkUserEligibility(scheme, userProfile) {
    const eligibility = scheme.eligibility;
    
    // Check age
    if (eligibility.ageRange && userProfile.age) {
      if (userProfile.age < eligibility.ageRange.min || userProfile.age > eligibility.ageRange.max) {
        return false;
      }
    }
    
    // Check income
    if (eligibility.incomeRange && userProfile.income) {
      if (userProfile.income < eligibility.incomeRange.min || 
          (eligibility.incomeRange.max && userProfile.income > eligibility.incomeRange.max)) {
        return false;
      }
    }
    
    // Check category
    if (eligibility.category?.length && userProfile.category) {
      if (!eligibility.category.includes(userProfile.category)) {
        return false;
      }
    }
    
    // Check state
    if (eligibility.states?.length && userProfile.state) {
      if (!eligibility.states.includes(userProfile.state)) {
        return false;
      }
    }
    
    // Check education
    if (eligibility.education?.length && userProfile.education) {
      if (!eligibility.education.includes(userProfile.education)) {
        return false;
      }
    }
    
    // Check special categories
    if (eligibility.isForWomen && userProfile.gender !== 'female') {
      return false;
    }
    
    if (eligibility.isForDisabled && !userProfile.isDisabled) {
      return false;
    }
    
    if (eligibility.isForSeniorCitizen && userProfile.age < 60) {
      return false;
    }
    
    return true;
  }

  getEligibilityReasons(scheme, userProfile) {
    const reasons = [];
    const eligibility = scheme.eligibility;
    
    if (eligibility.ageRange && userProfile.age) {
      if (userProfile.age < eligibility.ageRange.min) {
        reasons.push(`Minimum age required is ${eligibility.ageRange.min} years`);
      } else if (userProfile.age > eligibility.ageRange.max) {
        reasons.push(`Maximum age allowed is ${eligibility.ageRange.max} years`);
      }
    }
    
    if (eligibility.incomeRange && userProfile.income) {
      if (userProfile.income < eligibility.incomeRange.min) {
        reasons.push(`Minimum income required is ₹${eligibility.incomeRange.min}`);
      } else if (eligibility.incomeRange.max && userProfile.income > eligibility.incomeRange.max) {
        reasons.push(`Maximum income allowed is ₹${eligibility.incomeRange.max}`);
      }
    }
    
    if (eligibility.category?.length && userProfile.category) {
      if (!eligibility.category.includes(userProfile.category)) {
        reasons.push(`Category must be one of: ${eligibility.category.join(', ')}`);
      }
    }
    
    if (eligibility.states?.length && userProfile.state) {
      if (!eligibility.states.includes(userProfile.state)) {
        reasons.push(`Available only in: ${eligibility.states.join(', ')}`);
      }
    }
    
    if (eligibility.isForWomen && userProfile.gender !== 'female') {
      reasons.push('This scheme is specifically for women');
    }
    
    if (eligibility.isForDisabled && !userProfile.isDisabled) {
      reasons.push('This scheme is for persons with disabilities');
    }
    
    if (eligibility.isForSeniorCitizen && userProfile.age < 60) {
      reasons.push('This scheme is for senior citizens (60+ years)');
    }
    
    return reasons;
  }

  calculateConfidence(similarSchemes) {
    if (similarSchemes.length === 0) return 0;
    
    const topSimilarity = similarSchemes[0].similarity;
    const avgSimilarity = similarSchemes.reduce((sum, s) => sum + s.similarity, 0) / similarSchemes.length;
    
    // Weighted confidence based on top similarity and average
    return Math.round((topSimilarity * 0.7 + avgSimilarity * 0.3) * 100);
  }

  async translateToHindi(text) {
    try {
      // Simple translation mapping for common terms
      const translations = {
        'scheme': 'योजना',
        'eligibility': 'पात्रता',
        'benefit': 'लाभ',
        'application': 'आवेदन',
        'document': 'दस्तावेज',
        'government': 'सरकार',
        'citizen': 'नागरिक',
        'financial': 'वित्तीय',
        'assistance': 'सहायता',
        'education': 'शिक्षा',
        'healthcare': 'स्वास्थ्य सेवा',
        'employment': 'रोजगार',
        'housing': 'आवास',
        'agriculture': 'कृषि',
        'business': 'व्यापार',
        'women': 'महिला',
        'senior citizen': 'वरिष्ठ नागरिक',
        'disabled': 'विकलांग',
        'minority': 'अल्पसंख्यक'
      };

      let translatedText = text;
      for (const [english, hindi] of Object.entries(translations)) {
        const regex = new RegExp(`\\b${english}\\b`, 'gi');
        translatedText = translatedText.replace(regex, hindi);
      }
      
      return translatedText;
    } catch (error) {
      console.error('Error translating to Hindi:', error);
      return text;
    }
  }
}

export default new AIService();
