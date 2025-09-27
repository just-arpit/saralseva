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
    const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
    
    if (!GOOGLE_API_KEY) {
      // Fallback response if API key is not configured
      return res.status(200).json({
        success: true,
        data: {
          response: "I'm the Saral Seva AI assistant. I can help you with government schemes, application processes, document verification, and more. However, I'm currently running in basic mode. Please contact support for full AI assistance.",
          suggestions: ["Find schemes for me", "Check application status", "Government office locations", "Document verification help"]
        }
      });
    }

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

    // Call Google Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GOOGLE_API_KEY}`, {
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
      })
    });

    if (!response.ok) {
      throw new Error(`Google API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't process your request at the moment. Please try again.";

    // Generate contextual suggestions based on the query
    const suggestions = generateSuggestions(message.toLowerCase());

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