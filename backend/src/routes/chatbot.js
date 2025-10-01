import express from 'express';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

const chatbotQuery = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // Google Gemini AI integration
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    
    // Temporarily disable Gemini API for testing
    // if (!GEMINI_API_KEY) {
      // Fallback response if API key is not configured
      return res.status(200).json({
        success: true,
        data: {
          response: "I'm the Saral Seva AI assistant. I can help you with government schemes, application processes, document verification, and more. I'm currently using enhanced fallback mode for reliable responses.",
          suggestions: ["Find schemes for me", "Check application status", "Government office locations", "Document verification help"],
          powered_by: "Enhanced AI (Fallback Mode)"
        }
      });
    // }

    // Create context-aware prompt for government services
    const systemPrompt = `You are Saral Seva AI Assistant, a helpful AI for Indian government services. You help citizens with:
    - Government schemes and eligibility
    - Application processes and status
    - Document verification
    - Government office locations
    - Tax-related queries
    - Digital services and e-governance
    
    Be helpful, accurate, and provide specific guidance. Keep responses concise but informative. Always suggest next steps when possible.
    
    User message: ${message}`;

    try {
      // Call Google Gemini API with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: systemPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Google API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't process your request at the moment. Please try again.";

      // Generate contextual suggestions based on the query
      const suggestions = generateSuggestions(message.toLowerCase());

      res.status(200).json({
        success: true,
        data: {
          response: aiResponse,
          suggestions: suggestions,
          powered_by: "Google Gemini AI"
        }
      });

    } catch (geminiError) {
      console.warn('Gemini API failed, using fallback response:', geminiError.message);
      
      // Enhanced fallback response based on query analysis
      const fallbackResponse = generateFallbackResponse(message);
      const suggestions = generateSuggestions(message.toLowerCase());

      res.status(200).json({
        success: true,
        data: {
          response: fallbackResponse,
          suggestions: suggestions,
          powered_by: "Enhanced AI (Fallback Mode)"
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        response: aiResponse,
        suggestions: suggestions
      }
    });

  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing your request',
      data: {
        response: "I'm experiencing some technical difficulties. Please try again in a moment or contact support for assistance.",
        suggestions: ["Try again", "Contact support", "Browse schemes", "Check application status"]
      }
    });
  }
};

// Helper function to generate fallback responses
const generateFallbackResponse = (message) => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('scheme') || lowerMessage.includes('eligibility')) {
    return "I can help you find government schemes! Some popular schemes include PM-KISAN for farmers, Ayushman Bharat for healthcare, and various scholarships for students. To check your eligibility, please provide details about your age, income, category, and state.";
  }
  
  if (lowerMessage.includes('apply') || lowerMessage.includes('application')) {
    return "For government scheme applications, you can visit official portals like Digital India, PMO website, or specific ministry websites. Most applications require documents like Aadhaar, PAN card, and bank account details. I can guide you to the right portal if you specify which scheme you're interested in.";
  }
  
  if (lowerMessage.includes('document') || lowerMessage.includes('verify')) {
    return "For document verification, you can use DigiLocker for storing digital documents, or visit official government portals. Common documents needed are Aadhaar, PAN, voter ID, and educational certificates. Let me know which specific document you need help with.";
  }
  
  if (lowerMessage.includes('farmer') || lowerMessage.includes('agriculture')) {
    return "For farmers, key schemes include PM-KISAN (₹6000/year), Crop Insurance, KCC (Kisan Credit Card), and various state-specific schemes. You can check eligibility and apply through PM-KISAN portal or your nearest Common Service Center.";
  }
  
  if (lowerMessage.includes('student') || lowerMessage.includes('scholarship')) {
    return "Students can benefit from National Scholarship Portal, Merit-cum-Means scholarships, and various central/state scholarships. Eligibility typically depends on family income, academic performance, and category. Visit scholarships.gov.in for more details.";
  }
  
  return "I'm here to help you with government schemes, applications, document verification, and more! You can ask me about eligibility criteria, application processes, or specific schemes like PM-KISAN, Ayushman Bharat, scholarships, and others.";
};

// Helper function to generate contextual suggestions
const generateSuggestions = (message) => {
  const suggestions = [];
  
  if (message.includes('scheme') || message.includes('eligibility')) {
    suggestions.push("Find schemes for me", "Check eligibility criteria", "Application process");
  }
  
  if (message.includes('document') || message.includes('verification')) {
    suggestions.push("Document verification help", "Required documents", "Upload documents");
  }
  
  if (message.includes('status') || message.includes('application')) {
    suggestions.push("Check application status", "Track my application", "Application timeline");
  }
  
  if (message.includes('office') || message.includes('location')) {
    suggestions.push("Find government offices", "Office timings", "Contact information");
  }
  
  if (message.includes('tax') || message.includes('income')) {
    suggestions.push("Tax benefits", "Income tax filing", "Tax calculation");
  }
  
  // Default suggestions if no specific keywords found
  if (suggestions.length === 0) {
    suggestions.push("Find schemes for me", "Check application status", "Document verification", "Government office locations");
  }
  
  return suggestions.slice(0, 4); // Limit to 4 suggestions
};

router.post('/query', optionalAuth, chatbotQuery);

export default router;