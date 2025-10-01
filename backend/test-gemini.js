import dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent';

async function testGeminiAPI() {
  console.log('🔑 API Key configured:', GEMINI_API_KEY ? 'Yes' : 'No');
  
  if (!GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY not found in environment variables');
    return;
  }

  try {
    console.log('🚀 Testing Gemini API...');
    
    const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'Hello! Can you tell me about the PM-KISAN scheme in one sentence?'
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 100,
        }
      })
    });

    console.log('📊 Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', response.status, errorText);
      return;
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    console.log('✅ Gemini API Response:');
    console.log(text);
    
  } catch (error) {
    console.error('❌ Error testing Gemini API:', error.message);
  }
}

testGeminiAPI();
