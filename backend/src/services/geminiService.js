import mongoose from 'mongoose';
import Scheme from '../models/Scheme.js';

class EnhancedAIService {
  constructor() {
    this.schemes = [];
    this.initialized = false;
  }

  async initialize() {
    try {
      console.log('Initializing Enhanced AI Service...');
      
      // Load schemes for context
      await this.loadSchemes();
      
      this.initialized = true;
      console.log('Enhanced AI Service initialized successfully');
    } catch (error) {
      console.error('Error initializing Enhanced AI Service:', error);
      this.initialized = true; // Continue with basic functionality
    }
  }

  async loadSchemes() {
    try {
      this.schemes = await Scheme.find({ status: 'active' }).limit(50);
      console.log(`Loaded ${this.schemes.length} schemes for AI context`);
    } catch (error) {
      console.error('Error loading schemes:', error);
      this.schemes = [];
    }
  }

  async processQuery(query, userProfile = null, language = 'en') {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      // Prepare context with relevant schemes
      const context = this.prepareContext(query);
      
      // For now, use enhanced keyword-based responses until Gemini API is fixed
      const response = await this.generateEnhancedResponse(query, context, userProfile, language);
      
      return {
        answer: response.text,
        relevantSchemes: response.relevantSchemes || [],
        confidence: response.confidence || 85,
        sources: response.sources || [],
        language: language
      };
    } catch (error) {
      console.error('Error processing query:', error);
      return {
        answer: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment.",
        relevantSchemes: [],
        confidence: 0,
        sources: [],
        language: language
      };
    }
  }

  prepareContext(query) {
    const queryLower = query.toLowerCase();
    const relevantSchemes = [];

    // Find relevant schemes based on keywords
    for (const scheme of this.schemes) {
      let relevance = 0;
      
      // Check scheme name
      if (scheme.name.toLowerCase().includes(queryLower) || 
          queryLower.includes(scheme.name.toLowerCase())) {
        relevance += 3;
      }
      
      // Check description
      if (scheme.description.toLowerCase().includes(queryLower)) {
        relevance += 2;
      }
      
      // Check category
      if (scheme.category.toLowerCase().includes(queryLower)) {
        relevance += 2;
      }
      
      // Check keywords
      if (scheme.keywords && scheme.keywords.some(keyword => 
        keyword.toLowerCase().includes(queryLower) || 
        queryLower.includes(keyword.toLowerCase())
      )) {
        relevance += 1;
      }
      
      // Check eligibility-related queries
      if ((queryLower.includes('eligible') || queryLower.includes('qualify')) && 
          scheme.eligibility) {
        relevance += 1;
      }
      
      if (relevance > 0) {
        relevantSchemes.push({
          ...scheme.toObject(),
          relevance
        });
      }
    }

    // Sort by relevance and take top 5
    return relevantSchemes
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 5);
  }

  async generateEnhancedResponse(query, context, userProfile, language) {
    const queryLower = query.toLowerCase();
    let response = '';
    let confidence = 70;
    
    if (context.length === 0) {
      response = this.generateGeneralResponse(query, language);
      confidence = 50;
    } else {
      const topScheme = context[0];
      
      if (queryLower.includes('eligible') || queryLower.includes('qualify') || queryLower.includes('पात्र')) {
        response = this.generateEligibilityResponse(topScheme, userProfile, language);
        confidence = 90;
      } else if (queryLower.includes('apply') || queryLower.includes('application') || queryLower.includes('आवेदन')) {
        response = this.generateApplicationResponse(topScheme, language, userProfile);
        confidence = 85;
      } else if (queryLower.includes('benefit') || queryLower.includes('amount') || queryLower.includes('लाभ')) {
        response = this.generateBenefitResponse(topScheme, language, userProfile);
        confidence = 85;
      } else {
        response = this.generateSchemeInfoResponse(topScheme, language);
        confidence = 80;
      }
    }
    
    return {
      text: response,
      relevantSchemes: context.map(scheme => ({
        id: scheme._id.toString(),
        name: scheme.name,
        description: scheme.shortDescription,
        similarity: Math.min(scheme.relevance / 5, 1),
        eligibility: scheme.eligibility,
        benefits: scheme.benefits,
        applicationProcess: scheme.applicationProcess
      })),
      confidence,
      sources: context.map(scheme => ({
        schemeName: scheme.name,
        department: scheme.department.name,
        similarity: Math.min(scheme.relevance / 5, 1)
      }))
    };
  }

  generateEligibilityResponse(scheme, userProfile, language) {
    const eligibility = scheme.eligibility;
    let response = '';
    let overallEligible = true;
    let eligibilityIssues = [];
    
    if (language === 'hi') {
      response = `**${scheme.name} के लिए पात्रता मानदंड:**\n\n`;
      
      if (eligibility.ageRange) {
        response += `• **आयु**: ${eligibility.ageRange.min || 0} से ${eligibility.ageRange.max || 100} वर्ष\n`;
      }
      if (eligibility.incomeRange) {
        response += `• **वार्षिक आय**: ₹${eligibility.incomeRange.min || 0} से ₹${eligibility.incomeRange.max || 'असीमित'}\n`;
      }
      if (eligibility.category && eligibility.category.length > 0) {
        response += `• **श्रेणी**: ${eligibility.category.join(', ')}\n`;
      }
      if (eligibility.states && eligibility.states.length > 0) {
        response += `• **राज्य**: ${eligibility.states.join(', ')}\n`;
      }
      
      if (userProfile) {
        response += `\n**आपकी जानकारी के आधार पर व्यक्तिगत मूल्यांकन:**\n`;
        
        // Age check
        if (userProfile.age && eligibility.ageRange) {
          const eligible = userProfile.age >= (eligibility.ageRange.min || 0) && 
                          userProfile.age <= (eligibility.ageRange.max || 100);
          response += `• **आयु (${userProfile.age} वर्ष)**: ${eligible ? '✅ पात्र' : '❌ अपात्र'}\n`;
          if (!eligible) {
            overallEligible = false;
            eligibilityIssues.push(`आयु ${eligibility.ageRange.min}-${eligibility.ageRange.max} वर्ष के बीच होनी चाहिए`);
          }
        }
        
        // Income check
        if (userProfile.income && eligibility.incomeRange) {
          const eligible = userProfile.income >= (eligibility.incomeRange.min || 0) && 
                          userProfile.income <= (eligibility.incomeRange.max || Infinity);
          response += `• **वार्षिक आय (₹${userProfile.income.toLocaleString()})**: ${eligible ? '✅ पात्र' : '❌ अपात्र'}\n`;
          if (!eligible) {
            overallEligible = false;
            eligibilityIssues.push(`वार्षिक आय ₹${eligibility.incomeRange.min.toLocaleString()}-₹${eligibility.incomeRange.max.toLocaleString()} के बीच होनी चाहिए`);
          }
        }
        
        // Category check
        if (userProfile.category && eligibility.category && eligibility.category.length > 0) {
          const eligible = eligibility.category.includes(userProfile.category.toLowerCase());
          response += `• **श्रेणी (${userProfile.category})**: ${eligible ? '✅ पात्र' : '❌ अपात्र'}\n`;
          if (!eligible) {
            overallEligible = false;
            eligibilityIssues.push(`श्रेणी ${eligibility.category.join(', ')} में से एक होनी चाहिए`);
          }
        }
        
        // State check
        if (userProfile.state && eligibility.states && eligibility.states.length > 0 && !eligibility.states.includes('all')) {
          const eligible = eligibility.states.includes(userProfile.state);
          response += `• **राज्य (${userProfile.state})**: ${eligible ? '✅ पात्र' : '❌ अपात्र'}\n`;
          if (!eligible) {
            overallEligible = false;
            eligibilityIssues.push(`राज्य ${eligibility.states.join(', ')} में से एक होना चाहिए`);
          }
        }
        
        // Overall assessment
        response += `\n**🎯 आपका परिणाम**: ${overallEligible ? '✅ आप इस योजना के लिए पात्र हैं!' : '❌ आप इस समय इस योजना के लिए पात्र नहीं हैं'}\n`;
        
        if (!overallEligible && eligibilityIssues.length > 0) {
          response += `\n**📋 पात्रता के लिए आवश्यक शर्तें:**\n`;
          eligibilityIssues.forEach((issue, index) => {
            response += `${index + 1}. ${issue}\n`;
          });
        }
        
        if (overallEligible) {
          response += `\n**🎉 बधाई हो! आप इस योजना के लिए आवेदन कर सकते हैं। अगले चरणों के लिए "आवेदन कैसे करें?" पूछें।**`;
        }
      }
    } else {
      response = `**Eligibility Criteria for ${scheme.name}:**\n\n`;
      
      if (eligibility.ageRange) {
        response += `• **Age**: ${eligibility.ageRange.min || 0} to ${eligibility.ageRange.max || 100} years\n`;
      }
      if (eligibility.incomeRange) {
        response += `• **Annual Income**: ₹${eligibility.incomeRange.min || 0} to ₹${eligibility.incomeRange.max || 'unlimited'}\n`;
      }
      if (eligibility.category && eligibility.category.length > 0) {
        response += `• **Category**: ${eligibility.category.join(', ')}\n`;
      }
      if (eligibility.states && eligibility.states.length > 0) {
        response += `• **States**: ${eligibility.states.join(', ')}\n`;
      }
      
      if (userProfile) {
        response += `\n**Personal Assessment Based on Your Profile:**\n`;
        
        // Age check
        if (userProfile.age && eligibility.ageRange) {
          const eligible = userProfile.age >= (eligibility.ageRange.min || 0) && 
                          userProfile.age <= (eligibility.ageRange.max || 100);
          response += `• **Age (${userProfile.age} years)**: ${eligible ? '✅ Eligible' : '❌ Not eligible'}\n`;
          if (!eligible) {
            overallEligible = false;
            eligibilityIssues.push(`Age must be between ${eligibility.ageRange.min}-${eligibility.ageRange.max} years`);
          }
        }
        
        // Income check
        if (userProfile.income && eligibility.incomeRange) {
          const eligible = userProfile.income >= (eligibility.incomeRange.min || 0) && 
                          userProfile.income <= (eligibility.incomeRange.max || Infinity);
          response += `• **Annual Income (₹${userProfile.income.toLocaleString()})**: ${eligible ? '✅ Eligible' : '❌ Not eligible'}\n`;
          if (!eligible) {
            overallEligible = false;
            eligibilityIssues.push(`Annual income must be between ₹${eligibility.incomeRange.min.toLocaleString()}-₹${eligibility.incomeRange.max.toLocaleString()}`);
          }
        }
        
        // Category check
        if (userProfile.category && eligibility.category && eligibility.category.length > 0) {
          const eligible = eligibility.category.includes(userProfile.category.toLowerCase());
          response += `• **Category (${userProfile.category})**: ${eligible ? '✅ Eligible' : '❌ Not eligible'}\n`;
          if (!eligible) {
            overallEligible = false;
            eligibilityIssues.push(`Category must be one of: ${eligibility.category.join(', ')}`);
          }
        }
        
        // State check
        if (userProfile.state && eligibility.states && eligibility.states.length > 0 && !eligibility.states.includes('all')) {
          const eligible = eligibility.states.includes(userProfile.state);
          response += `• **State (${userProfile.state})**: ${eligible ? '✅ Eligible' : '❌ Not eligible'}\n`;
          if (!eligible) {
            overallEligible = false;
            eligibilityIssues.push(`State must be one of: ${eligibility.states.join(', ')}`);
          }
        }
        
        // Overall assessment
        response += `\n**🎯 Your Result**: ${overallEligible ? '✅ You are eligible for this scheme!' : '❌ You are not currently eligible for this scheme'}\n`;
        
        if (!overallEligible && eligibilityIssues.length > 0) {
          response += `\n**📋 Requirements to meet eligibility:**\n`;
          eligibilityIssues.forEach((issue, index) => {
            response += `${index + 1}. ${issue}\n`;
          });
        }
        
        if (overallEligible) {
          response += `\n**🎉 Congratulations! You can apply for this scheme. Ask "How to apply?" for next steps.**`;
        }
      }
    }
    
    return response;
  }

  generateApplicationResponse(scheme, language, userProfile = null) {
    const process = scheme.applicationProcess;
    let response = '';
    
    if (language === 'hi') {
      response = `**${scheme.name} के लिए आवेदन प्रक्रिया:**\n\n`;
      response += `• **आवेदन विधि**: ${process.isOnline ? 'ऑनलाइन' : 'ऑफलाइन'}\n`;
      if (process.onlineUrl) {
        response += `• **वेबसाइट**: ${process.onlineUrl}\n`;
      }
      if (process.applicationFee) {
        response += `• **आवेदन शुल्क**: ${process.applicationFee.waived ? 'मुफ्त' : `₹${process.applicationFee.amount}`}\n`;
      }
      if (process.processingTime) {
        response += `• **प्रसंस्करण समय**: ${process.processingTime}\n`;
      }
      
      if (process.steps && process.steps.length > 0) {
        response += `\n**📋 आवेदन के चरण:**\n`;
        process.steps.forEach((step, index) => {
          response += `\n**${index + 1}. ${step.title}**\n`;
          response += `   ${step.description}\n`;
          if (step.estimatedTime) {
            response += `   ⏱️ अनुमानित समय: ${step.estimatedTime}\n`;
          }
        });
      }
      
      if (userProfile) {
        response += `\n**👤 आपके लिए विशेष सुझाव:**\n`;
        if (userProfile.education && userProfile.education.includes('graduate')) {
          response += `• आपकी शैक्षिक योग्यता के कारण, आप ऑनलाइन आवेदन आसानी से कर सकते हैं\n`;
        }
        if (userProfile.occupation && userProfile.occupation.toLowerCase().includes('farmer')) {
          response += `• किसान के रूप में, आपको कृषि विभाग से अतिरिक्त सहायता मिल सकती है\n`;
        }
        if (userProfile.category && ['sc', 'st', 'obc'].includes(userProfile.category.toLowerCase())) {
          response += `• आपकी श्रेणी के लिए विशेष आरक्षण और सुविधाएं उपलब्ध हैं\n`;
        }
        response += `• सभी आवश्यक दस्तावेज तैयार रखें (आधार, पैन, बैंक खाता विवरण)\n`;
        response += `• आवेदन के बाद नियमित रूप से स्थिति की जांच करते रहें\n`;
      }
      
      response += `\n**💡 सुझाव**: आवेदन से पहले सभी दस्तावेजों की जांच कर लें और सही जानकारी भरें।`;
      
    } else {
      response = `**Application Process for ${scheme.name}:**\n\n`;
      response += `• **Application Method**: ${process.isOnline ? 'Online' : 'Offline'}\n`;
      if (process.onlineUrl) {
        response += `• **Website**: ${process.onlineUrl}\n`;
      }
      if (process.applicationFee) {
        response += `• **Application Fee**: ${process.applicationFee.waived ? 'Free' : `₹${process.applicationFee.amount}`}\n`;
      }
      if (process.processingTime) {
        response += `• **Processing Time**: ${process.processingTime}\n`;
      }
      
      if (process.steps && process.steps.length > 0) {
        response += `\n**📋 Application Steps:**\n`;
        process.steps.forEach((step, index) => {
          response += `\n**${index + 1}. ${step.title}**\n`;
          response += `   ${step.description}\n`;
          if (step.estimatedTime) {
            response += `   ⏱️ Estimated Time: ${step.estimatedTime}\n`;
          }
        });
      }
      
      if (userProfile) {
        response += `\n**👤 Personalized Tips for You:**\n`;
        if (userProfile.education && userProfile.education.includes('graduate')) {
          response += `• With your educational background, you can easily complete the online application\n`;
        }
        if (userProfile.occupation && userProfile.occupation.toLowerCase().includes('farmer')) {
          response += `• As a farmer, you may get additional support from the agriculture department\n`;
        }
        if (userProfile.category && ['sc', 'st', 'obc'].includes(userProfile.category.toLowerCase())) {
          response += `• Special reservations and benefits are available for your category\n`;
        }
        response += `• Keep all required documents ready (Aadhaar, PAN, Bank account details)\n`;
        response += `• Check application status regularly after submission\n`;
      }
      
      response += `\n**💡 Tip**: Verify all documents before applying and ensure accurate information is provided.`;
    }
    
    return response;
  }

  generateBenefitResponse(scheme, language, userProfile = null) {
    const benefits = scheme.benefits;
    let response = '';
    
    if (language === 'hi') {
      response = `**${scheme.name} के लाभ:**\n\n`;
      response += `• **विवरण**: ${benefits.description}\n`;
      if (benefits.amount) {
        response += `• **राशि**: ₹${benefits.amount.min || 0} से ₹${benefits.amount.max || 'असीमित'}\n`;
      }
      if (benefits.frequency) {
        response += `• **आवृत्ति**: ${benefits.frequency}\n`;
      }
      if (benefits.type) {
        response += `• **लाभ का प्रकार**: ${benefits.type}\n`;
      }
      
      if (userProfile) {
        response += `\n**💰 आपके लिए वित्तीय प्रभाव:**\n`;
        
        if (benefits.amount && userProfile.income) {
          const benefitAmount = benefits.amount.min || 0;
          const incomePercentage = ((benefitAmount / userProfile.income) * 100).toFixed(1);
          response += `• यह लाभ आपकी वार्षिक आय का लगभग ${incomePercentage}% है\n`;
          
          if (benefits.frequency === 'yearly') {
            response += `• प्रति वर्ष ₹${benefitAmount.toLocaleString()} की अतिरिक्त आय\n`;
          } else if (benefits.frequency === 'monthly') {
            const monthlyBenefit = benefitAmount / 12;
            response += `• प्रति माह ₹${monthlyBenefit.toLocaleString()} की अतिरिक्त आय\n`;
          }
        }
        
        if (userProfile.category && ['sc', 'st', 'obc'].includes(userProfile.category.toLowerCase())) {
          response += `• आपकी श्रेणी के लिए अतिरिक्त लाभ और सुविधाएं उपलब्ध हैं\n`;
        }
        
        if (userProfile.occupation && userProfile.occupation.toLowerCase().includes('farmer')) {
          response += `• किसान के रूप में, यह योजना आपकी कृषि गतिविधियों में सहायक होगी\n`;
        }
        
        response += `\n**📈 दीर्घकालिक लाभ:**\n`;
        response += `• वित्तीय स्थिरता में सुधार\n`;
        response += `• सामाजिक सुरक्षा का लाभ\n`;
        response += `• सरकारी योजनाओं तक पहुंच\n`;
      }
      
      response += `\n**🎯 योजना का मुख्य उद्देश्य**: ${scheme.shortDescription}`;
      
    } else {
      response = `**Benefits of ${scheme.name}:**\n\n`;
      response += `• **Description**: ${benefits.description}\n`;
      if (benefits.amount) {
        response += `• **Amount**: ₹${benefits.amount.min || 0} to ₹${benefits.amount.max || 'unlimited'}\n`;
      }
      if (benefits.frequency) {
        response += `• **Frequency**: ${benefits.frequency}\n`;
      }
      if (benefits.type) {
        response += `• **Benefit Type**: ${benefits.type}\n`;
      }
      
      if (userProfile) {
        response += `\n**💰 Financial Impact for You:**\n`;
        
        if (benefits.amount && userProfile.income) {
          const benefitAmount = benefits.amount.min || 0;
          const incomePercentage = ((benefitAmount / userProfile.income) * 100).toFixed(1);
          response += `• This benefit represents approximately ${incomePercentage}% of your annual income\n`;
          
          if (benefits.frequency === 'yearly') {
            response += `• Additional income of ₹${benefitAmount.toLocaleString()} per year\n`;
          } else if (benefits.frequency === 'monthly') {
            const monthlyBenefit = benefitAmount / 12;
            response += `• Additional income of ₹${monthlyBenefit.toLocaleString()} per month\n`;
          }
        }
        
        if (userProfile.category && ['sc', 'st', 'obc'].includes(userProfile.category.toLowerCase())) {
          response += `• Additional benefits and facilities are available for your category\n`;
        }
        
        if (userProfile.occupation && userProfile.occupation.toLowerCase().includes('farmer')) {
          response += `• As a farmer, this scheme will support your agricultural activities\n`;
        }
        
        response += `\n**📈 Long-term Benefits:**\n`;
        response += `• Improved financial stability\n`;
        response += `• Social security benefits\n`;
        response += `• Access to government schemes\n`;
      }
      
      response += `\n**🎯 Scheme's Main Objective**: ${scheme.shortDescription}`;
    }
    
    return response;
  }

  generateSchemeInfoResponse(scheme, language) {
    let response = '';
    
    if (language === 'hi') {
      response = `**${scheme.name}**\n\n`;
      response += `• **विवरण**: ${scheme.shortDescription}\n`;
      response += `• **श्रेणी**: ${scheme.category}\n`;
      response += `• **विभाग**: ${scheme.department.name}\n`;
      response += `• **स्तर**: ${scheme.level}\n`;
    } else {
      response = `**${scheme.name}**\n\n`;
      response += `• **Description**: ${scheme.shortDescription}\n`;
      response += `• **Category**: ${scheme.category}\n`;
      response += `• **Department**: ${scheme.department.name}\n`;
      response += `• **Level**: ${scheme.level}\n`;
    }
    
    return response;
  }

  generateGeneralResponse(query, language) {
    if (language === 'hi') {
      return `मैं आपकी सहायता के लिए यहाँ हूँ! मैं भारत सरकार की विभिन्न योजनाओं के बारे में जानकारी प्रदान करता हूँ। आप मुझसे पूछ सकते हैं:\n\n• किसी योजना के लिए पात्रता मानदंड\n• आवेदन प्रक्रिया\n• योजना के लाभ\n• आवश्यक दस्तावेज\n\nकृपया अपना प्रश्न अधिक विशिष्ट बनाएं।`;
    } else {
      return `I'm here to help you with information about Indian government schemes! You can ask me about:\n\n• Eligibility criteria for any scheme\n• Application process\n• Benefits of schemes\n• Required documents\n\nPlease make your question more specific for better assistance.`;
    }
  }

  async generateResponse(query, context, systemPrompt, userProfile) {
    try {
      // Prepare the context information
      let contextInfo = '';
      if (context.length > 0) {
        contextInfo = '\n\nRelevant Government Schemes Information:\n';
        context.forEach((scheme, index) => {
          contextInfo += `${index + 1}. ${scheme.name}\n`;
          contextInfo += `   Description: ${scheme.shortDescription}\n`;
          contextInfo += `   Category: ${scheme.category}\n`;
          contextInfo += `   Department: ${scheme.department.name}\n`;
          
          if (scheme.eligibility) {
            contextInfo += `   Eligibility: `;
            const eligibility = scheme.eligibility;
            if (eligibility.ageRange) {
              contextInfo += `Age ${eligibility.ageRange.min || 0}-${eligibility.ageRange.max || 100} years, `;
            }
            if (eligibility.incomeRange) {
              contextInfo += `Income ₹${eligibility.incomeRange.min || 0}-${eligibility.incomeRange.max || 'unlimited'}, `;
            }
            if (eligibility.category && eligibility.category.length > 0) {
              contextInfo += `Categories: ${eligibility.category.join(', ')}, `;
            }
            if (eligibility.states && eligibility.states.length > 0) {
              contextInfo += `States: ${eligibility.states.join(', ')}, `;
            }
            contextInfo = contextInfo.slice(0, -2) + '\n';
          }
          
          if (scheme.benefits) {
            contextInfo += `   Benefits: ${scheme.benefits.description}\n`;
            if (scheme.benefits.amount) {
              contextInfo += `   Amount: ₹${scheme.benefits.amount.min || 0} - ₹${scheme.benefits.amount.max || 'unlimited'}\n`;
            }
          }
          
          if (scheme.applicationProcess) {
            contextInfo += `   Application: ${scheme.applicationProcess.isOnline ? 'Online' : 'Offline'}`;
            if (scheme.applicationProcess.onlineUrl) {
              contextInfo += ` (${scheme.applicationProcess.onlineUrl})`;
            }
            contextInfo += '\n';
          }
          
          contextInfo += '\n';
        });
      }

      // Add user profile information if available
      let userInfo = '';
      if (userProfile) {
        userInfo = '\n\nUser Profile Information:\n';
        if (userProfile.age) userInfo += `Age: ${userProfile.age} years\n`;
        if (userProfile.gender) userInfo += `Gender: ${userProfile.gender}\n`;
        if (userProfile.income) userInfo += `Annual Income: ₹${userProfile.income}\n`;
        if (userProfile.category) userInfo += `Category: ${userProfile.category}\n`;
        if (userProfile.state) userInfo += `State: ${userProfile.state}\n`;
        if (userProfile.education) userInfo += `Education: ${userProfile.education}\n`;
        if (userProfile.occupation) userInfo += `Occupation: ${userProfile.occupation}\n`;
      }

      // Create the full prompt
      const fullPrompt = `${systemPrompt}${contextInfo}${userInfo}

User Query: "${query}"

Please provide a helpful, accurate response about government schemes. If the user is asking about eligibility, provide specific eligibility criteria. If asking about benefits, explain the benefits clearly. If asking about application process, provide step-by-step guidance.

Format your response to be clear and actionable. Include relevant scheme names and specific details when available.`;

      // Generate response using Gemini
      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();

      // Extract relevant schemes for the response
      const relevantSchemes = context.map(scheme => ({
        id: scheme._id.toString(),
        name: scheme.name,
        description: scheme.shortDescription,
        similarity: Math.min(scheme.relevance / 5, 1),
        eligibility: scheme.eligibility,
        benefits: scheme.benefits,
        applicationProcess: scheme.applicationProcess
      }));

      // Create sources
      const sources = context.map(scheme => ({
        schemeName: scheme.name,
        department: scheme.department.name,
        similarity: Math.min(scheme.relevance / 5, 1)
      }));

      return {
        text,
        relevantSchemes,
        confidence: context.length > 0 ? 90 : 70,
        sources
      };

    } catch (error) {
      console.error('Error generating Gemini response:', error);
      throw error;
    }
  }

  async translateToHindi(text) {
    try {
      // Simple translation mapping for common terms
      const translations = {
        'Eligibility Criteria': 'पात्रता मानदंड',
        'Age': 'आयु',
        'Annual Income': 'वार्षिक आय',
        'Category': 'श्रेणी',
        'States': 'राज्य',
        'years': 'वर्ष',
        'unlimited': 'असीमित',
        'Application Process': 'आवेदन प्रक्रिया',
        'Application Method': 'आवेदन विधि',
        'Online': 'ऑनलाइन',
        'Offline': 'ऑफलाइन',
        'Website': 'वेबसाइट',
        'Steps': 'चरण',
        'Benefits': 'लाभ',
        'Description': 'विवरण',
        'Amount': 'राशि',
        'Frequency': 'आवृत्ति',
        'Department': 'विभाग',
        'Level': 'स्तर'
      };

      let translatedText = text;
      Object.entries(translations).forEach(([english, hindi]) => {
        translatedText = translatedText.replace(new RegExp(english, 'g'), hindi);
      });

      return translatedText;
    } catch (error) {
      console.error('Error translating to Hindi:', error);
      return text; // Return original text if translation fails
    }
  }

  async getHealthStatus() {
    try {
      return {
        status: 'healthy',
        model: 'enhanced-ai',
        schemesLoaded: this.schemes.length,
        features: ['eligibility-check', 'application-guidance', 'benefit-analysis', 'multilingual-support']
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        schemesLoaded: this.schemes.length
      };
    }
  }
}

export default new EnhancedAIService();
