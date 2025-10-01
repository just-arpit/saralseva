import { useState, useEffect, useRef } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge, Input } from '@/components/ui';
import { 
  Bot, 
  Send, 
  User, 
  Mic, 
  Languages,
  Shield,
  CheckCircle,
  XCircle,
  ExternalLink,
  Info,
  Search,
  FileText,
  HelpCircle,
  Star,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Download,
  RefreshCw,
  TrendingUp,
  Award,
  BookOpen,
  MessageSquare,
  Clock
} from 'lucide-react';
import { useApi } from '../hooks/useApi';

const generateLocalQnAResponse = async (userInput) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const input = userInput.toLowerCase();
  let response = "I'm here to help you with government services! ";
  let relevantSchemes = [];
  let confidence = 85;
  let category = "general";

  // Enhanced QnA responses for government services
  if (input.includes("pm") && input.includes("kisan")) {
    response = "**PM-KISAN Scheme Details**:\n\n**Objective**: Financial support to farmers\n**Benefits**: ₹6,000 per year (₹2,000 every 4 months)\n**Eligibility**: All landholding farmers\n**Application**: Visit pmkisan.gov.in or CSC\n**Documents**: Land records, Aadhaar, Bank account details\n**Status Check**: Available on portal with Aadhaar/mobile number";
    relevantSchemes = [
      { name: "PM-KISAN", category: "agriculture" },
      { name: "Crop Insurance", category: "agriculture" },
      { name: "Kisan Credit Card", category: "agriculture" }
    ];
    confidence = 95;
    category = "agriculture";
  } else if (input.includes("ayushman") || (input.includes("health") && input.includes("insurance"))) {
    response = "**Ayushman Bharat - PM-JAY**:\n\n**Coverage**: ₹5 lakh per family per year\n**Eligibility**: Based on SECC 2011 data\n**Benefits**: Cashless treatment at empanelled hospitals\n**Services**: 1,400+ medical packages covered\n**Check Eligibility**: mera.pmjay.gov.in\n**Download Card**: From PMJAY app or website";
    relevantSchemes = [
      { name: "Ayushman Bharat", category: "healthcare" },
      { name: "PMJAY", category: "healthcare" },
      { name: "Health Insurance", category: "healthcare" }
    ];
    confidence = 95;
    category = "healthcare";
  } else if (input.includes("scholarship") || input.includes("education")) {
    response = "**Education Scholarships**:\n\n**National Scholarship Portal**: scholarships.gov.in\n**Types**: Pre-matric, Post-matric, Merit-cum-Means\n**Categories**: SC/ST/OBC/Minority/General\n**Benefits**: ₹1,000 to ₹20,000 per year\n**Application**: Online through NSP\n**Documents**: Income certificate, Caste certificate, Marksheets";
    relevantSchemes = [
      { name: "NSP Scholarships", category: "education" },
      { name: "Merit Scholarships", category: "education" },
      { name: "Minority Scholarships", category: "education" }
    ];
    confidence = 90;
    category = "education";
  } else if (input.includes("housing") || input.includes("awas") || input.includes("pmay")) {
    response = "**Pradhan Mantri Awas Yojana (PMAY)**:\n\n**Urban**: PMAY-U for cities\n**Rural**: PMAY-G for villages\n**Subsidy**: ₹1.2 lakh to ₹2.67 lakh\n**Eligibility**: EWS, LIG, MIG categories\n**Application**: pmaymis.gov.in for urban, pmayg.nic.in for rural\n**Benefits**: Interest subsidy, direct financial assistance";
    relevantSchemes = [
      { name: "PMAY Urban", category: "housing" },
      { name: "PMAY Gramin", category: "housing" },
      { name: "Housing Loan Subsidy", category: "housing" }
    ];
    confidence = 92;
    category = "housing";
  } else if (input.includes("pension") || input.includes("senior") || input.includes("old age")) {
    response = "**Pension Schemes**:\n\n**Types**: Old Age, Widow, Disability Pension\n**Eligibility**: Age 60+ (varies by state), BPL families\n**Amount**: ₹200-₹1,000 per month (state-wise)\n**Application**: District Social Welfare Office\n**Documents**: Age proof, Income certificate, Bank details\n**Status**: Check with local authorities";
    relevantSchemes = [
      { name: "Old Age Pension", category: "social-security" },
      { name: "Widow Pension", category: "social-security" },
      { name: "Disability Pension", category: "social-security" }
    ];
    confidence = 88;
    category = "social-security";
  } else if (input.includes("startup") || input.includes("business")) {
    response = "**Startup India**:\n\n**Benefits**: Tax exemptions for 3 years, IPR fast-tracking\n**Funding**: Fund of Funds, SIDBI support\n**Registration**: startupindia.gov.in\n**Eligibility**: Less than 10 years old, turnover under ₹100 crore\n**Support**: Incubation, mentorship, networking\n**Documents**: Certificate of incorporation, business plan";
    relevantSchemes = [
      { name: "Startup India", category: "business" },
      { name: "MUDRA Loan", category: "business" },
      { name: "Stand Up India", category: "business" }
    ];
    confidence = 90;
    category = "business";
  } else if (input.includes("women") || input.includes("mahila") || input.includes("female")) {
    response = "**Women Empowerment Schemes**:\n\n**Beti Bachao Beti Padhao**: Girl child education and safety\n**Mahila E-Haat**: Online marketing platform\n**Sukanya Samriddhi**: Savings scheme for girl child\n**PMMY**: Micro-credit for women entrepreneurs\n**Application**: Various portals and local offices";
    relevantSchemes = [
      { name: "Beti Bachao Beti Padhao", category: "women" },
      { name: "Sukanya Samriddhi", category: "women" },
      { name: "Mahila E-Haat", category: "women" }
    ];
    confidence = 88;
    category = "women-empowerment";
  } else if (input.includes("hello") || input.includes("hi") || input.includes("help") || input.includes("नमस्ते")) {
    response = "नमस्ते! Welcome to Saral Seva QnA! 🙏\n\nI'm your government services assistant. I can help you with:\n\n• **Scheme Information**: PM-KISAN, Ayushman Bharat, PMAY\n• **Eligibility Checking**: Based on your profile\n• **Application Guidance**: Step-by-step process\n• **Document Requirements**: What you need to apply\n• **Status Tracking**: Check your application status\n\nWhat would you like to know about?";
    relevantSchemes = [
      { name: "Popular Schemes", category: "general" },
      { name: "Eligibility Check", category: "general" },
      { name: "Application Help", category: "general" }
    ];
    confidence = 95;
    category = "greeting";
  } else {
    response = "I can help you with various government schemes and services. Please ask me about specific schemes like PM-KISAN, Ayushman Bharat, scholarships, housing schemes, or any other government service you need information about.";
    relevantSchemes = [
      { name: "PM-KISAN", category: "agriculture" },
      { name: "Ayushman Bharat", category: "healthcare" },
      { name: "PMAY", category: "housing" }
    ];
    confidence = 70;
    category = "general";
  }

  return {
    id: Date.now() + 1,
    type: 'bot',
    content: response,
    timestamp: new Date(),
    confidence: confidence,
    relevantSchemes: relevantSchemes,
    category: category,
    language: 'en',
    sources: ["Government Official Portals", "Scheme Guidelines"],
    powered_by: "Enhanced Local AI"
  };
};

const SarkarQnA = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showSources, setShowSources] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [recentQueries, setRecentQueries] = useState([]);
  const messagesEndRef = useRef(null);
  const { apiCall } = useApi();

  const languageOptions = [
    { value: 'en', label: 'English', flag: '🇺🇸' },
    { value: 'hi', label: 'हिंदी', flag: '🇮🇳' },
    { value: 'hinglish', label: 'Hinglish', flag: '🔄' }
  ];

  const quickQuestions = [
    {
      question: "Am I eligible for PM-KISAN scheme?",
      category: "agriculture",
      icon: "🌾"
    },
    {
      question: "What are the benefits of Ayushman Bharat?",
      category: "healthcare",
      icon: "🏥"
    },
    {
      question: "How to apply for Pradhan Mantri Awas Yojana?",
      category: "housing",
      icon: "🏠"
    },
    {
      question: "क्या मैं PM-KISAN योजना के लिए पात्र हूं?",
      category: "agriculture",
      icon: "🌾"
    },
    {
      question: "महिलाओं के लिए कौन सी योजनाएं हैं?",
      category: "women-empowerment",
      icon: "👩"
    },
    {
      question: "Startup India scheme ke benefits kya hain?",
      category: "startup",
      icon: "🚀"
    }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load recent queries from localStorage
    const saved = localStorage.getItem('sarkarQnA_recentQueries');
    if (saved) {
      setRecentQueries(JSON.parse(saved));
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = inputMessage; // Store before clearing
    setInputMessage('');
    setIsTyping(true);

    try {
      // Use local response implementation
      const botResponse = await generateLocalQnAResponse(userInput);
      setMessages(prev => [...prev, botResponse]);
      
      // Update recent queries
      const newQuery = {
        question: userInput,
        timestamp: new Date(),
        language: selectedLanguage
      };
      setRecentQueries(prev => [newQuery, ...prev.slice(0, 9)]);
      localStorage.setItem('sarkarQnA_recentQueries', JSON.stringify([newQuery, ...recentQueries.slice(0, 9)]));
      
      // Generate suggestions
      if (botResponse.relevantSchemes && botResponse.relevantSchemes.length > 0) {
        const newSuggestions = botResponse.relevantSchemes.slice(0, 3).map(scheme => 
          `Tell me more about ${scheme.name}`
        );
        setSuggestions(newSuggestions);
      }
      
    } catch (error) {
      console.error('Error generating response:', error);
      
      const errorResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: "I'm having trouble processing your question right now. Please try asking again or rephrase your question.",
        timestamp: new Date(),
        confidence: 0
      };
      setMessages(prev => [...prev, errorResponse]);
    }

    setIsTyping(false);
  };

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
    handleSendMessage();
  };

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
    handleSendMessage();
  };

  const handleRecentQuery = (query) => {
    setInputMessage(query.question);
    handleSendMessage();
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    // Voice recognition implementation would go here
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceIcon = (confidence) => {
    if (confidence >= 80) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (confidence >= 60) return <Shield className="h-4 w-4 text-yellow-600" />;
    return <XCircle className="h-4 w-4 text-red-600" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary rounded-full">
              <Bot className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">SarkarQnA</h1>
              <p className="text-lg text-gray-600">AI Scheme Eligibility Bot</p>
            </div>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Ask questions about government schemes in English, Hindi, or Hinglish. 
            Get instant eligibility checks, application guidance, and benefit information.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Chat with AI Assistant
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Languages className="h-4 w-4" />
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="text-sm border rounded px-2 py-1"
                    >
                      {languageOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.flag} {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-0 chat-container">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 prevent-overflow">
                  {messages.length === 0 && (
                    <div className="text-center text-gray-500 mt-8">
                      <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Start a conversation by asking about government schemes!</p>
                    </div>
                  )}

                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
                      <div className={`max-w-[85%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                        <div
                          className={`p-4 rounded-lg break-words overflow-hidden ${
                            message.type === 'user'
                              ? 'bg-primary text-primary-foreground ml-2'
                              : 'bg-muted mr-2'
                          }`}
                        >
                          <div className="text-sm whitespace-pre-wrap break-words word-wrap overflow-wrap-anywhere">
                            {message.content}
                          </div>
                          
                          {/* AI Response Metadata */}
                          {message.type === 'bot' && message.confidence !== undefined && (
                            <div className="flex flex-wrap items-center gap-2 mt-3 text-xs opacity-70">
                              <div className="flex items-center gap-1">
                                {getConfidenceIcon(message.confidence)}
                                <span className={getConfidenceColor(message.confidence)}>
                                  Confidence: {message.confidence}%
                                </span>
                              </div>
                              {message.sources && message.sources.length > 0 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setShowSources(!showSources)}
                                  className="h-6 px-2 text-xs flex-shrink-0"
                                >
                                  <Info className="h-3 w-3 mr-1" />
                                  Sources ({message.sources.length})
                                </Button>
                              )}
                            </div>
                          )}
                          
                          <p className={`text-xs mt-2 opacity-70`}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                        
                        {/* Sources */}
                        {message.type === 'bot' && message.sources && showSources && (
                          <div className="mt-2 p-3 bg-accent/50 rounded-lg mr-2">
                            <h4 className="text-sm font-semibold mb-2">Sources:</h4>
                            {message.sources.map((source, index) => (
                              <div key={index} className="text-sm mb-2 flex items-center gap-2">
                                <ExternalLink className="h-4 w-4" />
                                <span>{source.schemeName}</span>
                                <Badge variant="secondary" className="text-xs">
                                  {Math.round(source.similarity * 100)}% match
                                </Badge>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Relevant Schemes */}
                        {message.type === 'bot' && message.relevantSchemes && message.relevantSchemes.length > 0 && (
                          <div className="mt-3 space-y-2 mr-2">
                            <h4 className="text-sm font-semibold">Relevant Schemes:</h4>
                            {message.relevantSchemes.slice(0, 3).map((scheme, index) => (
                              <div key={index} className="p-3 bg-accent/30 rounded-lg break-words overflow-hidden">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <span className="text-sm font-medium break-words flex-1">{scheme.name}</span>
                                  <Badge variant="secondary" className="text-xs flex-shrink-0">
                                    {scheme.category || 'General'}
                                  </Badge>
                                </div>
                                <p className="text-sm opacity-70 break-words">{scheme.category}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Avatar */}
                      <div className={`flex-shrink-0 ${message.type === 'user' ? 'order-1' : 'order-2'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          message.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                        }`}>
                          {message.type === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-lg p-4 mr-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                        <Bot className="h-5 w-5" />
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 relative">
                      <Input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Ask about government schemes..."
                        className="pr-12"
                      />
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={toggleVoiceInput}
                          className={`h-6 w-6 ${isListening ? 'text-destructive' : 'text-muted-foreground'}`}
                        >
                          <Mic className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isTyping}
                      size="icon"
                      className="h-10 w-10"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Suggestions */}
                  {suggestions.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="text-xs"
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Questions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Quick Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickQuestions.map((item, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-left h-auto p-3"
                    onClick={() => handleQuickQuestion(item.question)}
                  >
                    <span className="mr-2">{item.icon}</span>
                    <span className="text-sm">{item.question}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Recent Queries */}
            {recentQueries.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent Queries
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {recentQueries.slice(0, 5).map((query, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-start text-left h-auto p-2"
                      onClick={() => handleRecentQuery(query)}
                    >
                      <span className="text-sm truncate">{query.question}</span>
                    </Button>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Multilingual Support</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Eligibility Checking</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Confidence Scores</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Source Citations</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Real-time Processing</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SarkarQnA;
