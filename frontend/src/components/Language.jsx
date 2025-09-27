import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui";
import { 
  Globe,
  Check,
  Languages,
  ChevronDown,
  Volume2,
  Download,
  Settings,
  Star,
  Users,
  BookOpen,
  Headphones,
  Type,
  Mic,
  Eye,
  Home,
  ArrowLeft
} from "lucide-react";

const Language = () => {
  const { currentLanguage, changeLanguage, t, getCurrentLanguageInfo } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);
  const [showDropdown, setShowDropdown] = useState(false);
  const [translationSettings, setTranslationSettings] = useState({
    autoTranslate: true,
    voiceSupport: false,
    rtlSupport: false,
    fontSizeAdjustment: "medium",
    dialectSupport: true
  });

  const languages = [
    {
      code: "en",
      name: "English",
      nativeName: "English",
      flag: "🇺🇸",
      speakers: "1.5B+",
      coverage: 100,
      isOfficial: true,
      hasVoice: true,
      hasOffline: true,
      region: "Global"
    },
    {
      code: "hi",
      name: "Hindi",
      nativeName: "हिन्दी",
      flag: "🇮🇳",
      speakers: "600M+",
      coverage: 95,
      isOfficial: true,
      hasVoice: true,
      hasOffline: true,
      region: "North India"
    },
    {
      code: "bn",
      name: "Bengali",
      nativeName: "বাংলা",
      flag: "🇧🇩",
      speakers: "300M+",
      coverage: 85,
      isOfficial: false,
      hasVoice: true,
      hasOffline: false,
      region: "West Bengal, Bangladesh"
    },
    {
      code: "te",
      name: "Telugu",
      nativeName: "తెలుగు",
      flag: "🏴󠁩󠁮󠁴󠁧󠁿",
      speakers: "95M+",
      coverage: 80,
      isOfficial: false,
      hasVoice: true,
      hasOffline: false,
      region: "Andhra Pradesh, Telangana"
    },
    {
      code: "mr",
      name: "Marathi",
      nativeName: "मराठी",
      flag: "🏴󠁩󠁮󠁭󠁨󠁿",
      speakers: "83M+",
      coverage: 75,
      isOfficial: false,
      hasVoice: false,
      hasOffline: false,
      region: "Maharashtra"
    },
    {
      code: "ta",
      name: "Tamil",
      nativeName: "தமிழ்",
      flag: "🏴󠁩󠁮󠁴󠁮󠁿",
      speakers: "78M+",
      coverage: 85,
      isOfficial: false,
      hasVoice: true,
      hasOffline: false,
      region: "Tamil Nadu, Sri Lanka"
    },
    {
      code: "gu",
      name: "Gujarati",
      nativeName: "ગુજરાતી",
      flag: "🏴󠁩󠁮󠁧󠁪󠁿",
      speakers: "56M+",
      coverage: 70,
      isOfficial: false,
      hasVoice: false,
      hasOffline: false,
      region: "Gujarat"
    },
    {
      code: "ur",
      name: "Urdu",
      nativeName: "اردو",
      flag: "🇵🇰",
      speakers: "70M+",
      coverage: 75,
      isOfficial: false,
      hasVoice: true,
      hasOffline: false,
      region: "Pakistan, North India"
    },
    {
      code: "kn",
      name: "Kannada",
      nativeName: "ಕನ್ನಡ",
      flag: "🏴󠁩󠁮󠁫󠁡󠁿",
      speakers: "44M+",
      coverage: 65,
      isOfficial: false,
      hasVoice: false,
      hasOffline: false,
      region: "Karnataka"
    },
    {
      code: "ml",
      name: "Malayalam",
      nativeName: "മലയാളം",
      flag: "🏴󠁩󠁮󠁫󠁬󠁿",
      speakers: "38M+",
      coverage: 70,
      isOfficial: false,
      hasVoice: false,
      hasOffline: false,
      region: "Kerala"
    },
    {
      code: "pa",
      name: "Punjabi",
      nativeName: "ਪੰਜਾਬੀ",
      flag: "🏴󠁩󠁮󠁰󠁢󠁿",
      speakers: "33M+",
      coverage: 60,
      isOfficial: false,
      hasVoice: false,
      hasOffline: false,
      region: "Punjab"
    },
    {
      code: "or",
      name: "Odia",
      nativeName: "ଓଡ଼ିଆ",
      flag: "🏴󠁩󠁮󠁯󠁲󠁿",
      speakers: "38M+",
      coverage: 55,
      isOfficial: false,
      hasVoice: false,
      hasOffline: false,
      region: "Odisha"
    },
    {
      code: "as",
      name: "Assamese",
      nativeName: "অসমীয়া",
      flag: "🏴󠁩󠁮󠁡󠁳󠁿",
      speakers: "15M+",
      coverage: 50,
      isOfficial: false,
      hasVoice: false,
      hasOffline: false,
      region: "Assam"
    }
  ];

  const currentLanguageInfo = languages.find(lang => lang.code === selectedLanguage);

  const handleLanguageChange = async (languageCode) => {
    setSelectedLanguage(languageCode);
    setShowDropdown(false);
    
    // Use the context method to change language
    await changeLanguage(languageCode);
  };

  const sampleTexts = {
    en: {
      welcome: "Welcome to Jan Sahayak",
      description: "Your digital gateway to government services and citizen support",
      schemes: "Government Schemes",
      services: "Services",
      apply: "Apply Now"
    },
    hi: {
      welcome: "जन सहायक में आपका स्वागत है",
      description: "सरकारी सेवाओं और नागरिक सहायता के लिए आपका डिजिटल गेटवे",
      schemes: "सरकारी योजनाएं",
      services: "सेवाएं",
      apply: "अभी आवेदन करें"
    },
    bn: {
      welcome: "জন সহায়কে স্বাগতম",
      description: "সরকারি সেবা এবং নাগরিক সহায়তার জন্য আপনার ডিজিটাল গেটওয়ে",
      schemes: "সরকারি স্কিম",
      services: "সেবাসমূহ",
      apply: "এখনই আবেদন করুন"
    }
  };

  const currentText = sampleTexts[selectedLanguage] || sampleTexts.en;

  useEffect(() => {
    // Sync with context
    setSelectedLanguage(currentLanguage);
  }, [currentLanguage]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
              <Globe className="h-8 w-8 text-primary" />
              Language Settings
            </h1>
            <p className="text-muted-foreground">
              Choose your preferred language for the best experience with government services
            </p>
          </div>
          
          {/* Language Selector */}
          <div className="relative">
            <Button
              variant="outline"
              className="min-w-[200px] justify-between"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{currentLanguageInfo?.flag}</span>
                <span>{currentLanguageInfo?.name}</span>
                <span className="text-sm text-muted-foreground">
                  ({currentLanguageInfo?.nativeName})
                </span>
              </div>
              <ChevronDown className="h-4 w-4" />
            </Button>
            
            {showDropdown && (
              <div className="absolute top-full mt-2 right-0 w-80 bg-background border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                <div className="p-2">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => handleLanguageChange(language.code)}
                      className={`w-full text-left p-3 rounded-md hover:bg-accent transition-colors ${
                        selectedLanguage === language.code ? 'bg-accent' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{language.flag}</span>
                          <div>
                            <div className="font-medium">{language.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {language.nativeName}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {language.isOfficial && (
                            <Badge variant="government" className="text-xs">Official</Badge>
                          )}
                          {language.hasVoice && (
                            <Volume2 className="h-3 w-3 text-muted-foreground" />
                          )}
                          {selectedLanguage === language.code && (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Language Preview */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Language Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
                    <h2 className="text-2xl font-bold text-primary mb-2">
                      {currentText.welcome}
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      {currentText.description}
                    </p>
                    <div className="flex gap-4">
                      <Button variant="government">{currentText.schemes}</Button>
                      <Button variant="outline">{currentText.services}</Button>
                      <Button>{currentText.apply}</Button>
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <p>This preview shows how the interface will appear in {currentLanguageInfo?.name}.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Language Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Languages className="h-5 w-5" />
                  Available Languages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {languages.map((language) => (
                    <div
                      key={language.code}
                      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        selectedLanguage === language.code 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => handleLanguageChange(language.code)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-2xl">{language.flag}</span>
                          <div>
                            <h4 className="font-semibold flex items-center gap-2">
                              {language.name}
                              {language.isOfficial && (
                                <Badge variant="government" className="text-xs">Official</Badge>
                              )}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {language.nativeName} • {language.speakers} speakers
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {language.region}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-24 bg-muted rounded-full h-2">
                              <div 
                                className="h-2 bg-primary rounded-full transition-all"
                                style={{ width: `${language.coverage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {language.coverage}%
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {language.hasVoice && (
                              <div className="flex items-center gap-1">
                                <Volume2 className="h-3 w-3 text-green-500" />
                                <span className="text-xs text-green-500">Voice</span>
                              </div>
                            )}
                            {language.hasOffline && (
                              <div className="flex items-center gap-1">
                                <Download className="h-3 w-3 text-blue-500" />
                                <span className="text-xs text-blue-500">Offline</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Language Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Current Language
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="text-4xl">{currentLanguageInfo?.flag}</div>
                  <div>
                    <h3 className="font-semibold text-lg">{currentLanguageInfo?.name}</h3>
                    <p className="text-muted-foreground">{currentLanguageInfo?.nativeName}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Speakers</span>
                      <p className="font-semibold">{currentLanguageInfo?.speakers}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Coverage</span>
                      <p className="font-semibold">{currentLanguageInfo?.coverage}%</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center gap-4">
                    {currentLanguageInfo?.hasVoice && (
                      <Badge variant="outline" className="text-xs">
                        <Volume2 className="h-3 w-3 mr-1" />
                        Voice Support
                      </Badge>
                    )}
                    {currentLanguageInfo?.hasOffline && (
                      <Badge variant="outline" className="text-xs">
                        <Download className="h-3 w-3 mr-1" />
                        Offline Mode
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Language Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Language Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm">Auto-translate content</span>
                  <input
                    type="checkbox"
                    checked={translationSettings.autoTranslate}
                    onChange={(e) => setTranslationSettings(prev => ({
                      ...prev,
                      autoTranslate: e.target.checked
                    }))}
                    className="rounded"
                  />
                </label>
                
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm">Voice support</span>
                  <input
                    type="checkbox"
                    checked={translationSettings.voiceSupport}
                    onChange={(e) => setTranslationSettings(prev => ({
                      ...prev,
                      voiceSupport: e.target.checked
                    }))}
                    className="rounded"
                  />
                </label>
                
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm">RTL text support</span>
                  <input
                    type="checkbox"
                    checked={translationSettings.rtlSupport}
                    onChange={(e) => setTranslationSettings(prev => ({
                      ...prev,
                      rtlSupport: e.target.checked
                    }))}
                    className="rounded"
                  />
                </label>
                
                <div>
                  <label className="text-sm mb-2 block">Font size</label>
                  <select
                    value={translationSettings.fontSizeAdjustment}
                    onChange={(e) => setTranslationSettings(prev => ({
                      ...prev,
                      fontSizeAdjustment: e.target.value
                    }))}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                    <option value="extra-large">Extra Large</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Language Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Available Languages</span>
                    <span className="font-semibold">{languages.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Voice Supported</span>
                    <span className="font-semibold">
                      {languages.filter(l => l.hasVoice).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Offline Available</span>
                    <span className="font-semibold">
                      {languages.filter(l => l.hasOffline).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Official Languages</span>
                    <span className="font-semibold">
                      {languages.filter(l => l.isOfficial).length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Navigation */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Navigation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" asChild>
                  <Link to="/dashboard">
                    <Home className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/schemes">
                    <Star className="h-4 w-4 mr-2" />
                    Browse Schemes
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/profile">
                    <Users className="h-4 w-4 mr-2" />
                    My Profile
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Language Demo */}
            <Card>
              <CardHeader>
                <CardTitle>Live Translation Demo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">{t('dashboard.title')}</h4>
                    <p className="text-sm text-muted-foreground">{t('dashboard.subtitle')}</p>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm">{t('common.apply')}</Button>
                      <Button size="sm" variant="outline">{t('common.learnMore')}</Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This content changes automatically when you select a different language above.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Language;