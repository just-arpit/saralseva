import { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { Button, Sheet, SheetContent, SheetTrigger, Badge } from "@/components/ui";
import { 
  Menu, Search, Bell, User, Globe, LogOut, X, 
  Clock, CheckCircle, AlertCircle, Star, Filter,
  Calendar, FileText, TrendingUp, Eye, ArrowRight,
  ChevronDown, Check
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Language from "./Language";

const Header = () => {
  const { currentLanguage, changeLanguage, t, getCurrentLanguageInfo } = useLanguage();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [unreadNotifications, setUnreadNotifications] = useState(3);

  const languageInfo = getCurrentLanguageInfo();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showLanguageDropdown && !event.target.closest('.language-dropdown')) {
        setShowLanguageDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLanguageDropdown]);

  const navItems = [
    { name: t('nav.dashboard'), href: "/dashboard" },
    { name: t('nav.schemes'), href: "/schemes" },
    { name: t('nav.verify'), href: "/verify" },
    { name: t('nav.events'), href: "/events" },
    { name: t('nav.complaints'), href: "/complaints" },
    { name: t('nav.locations'), href: "/locations" },
    { name: "SarkarQnA", href: "/sarkarqna" },
  ];

  const availableLanguages = [
    { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
    { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
    { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇧🇩" },
    { code: "te", name: "Telugu", nativeName: "తెలుగు", flag: "🏴󠁩󠁮󠁴󠁧󠁿" },
    { code: "mr", name: "Marathi", nativeName: "मराठी", flag: "🏴󠁩󠁮󠁭󠁨󠁿" },
    { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🏴󠁩󠁮󠁴󠁮󠁿" },
    { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", flag: "🏴󠁩󠁮󠁧󠁪󠁿" },
    { code: "ur", name: "Urdu", nativeName: "اردو", flag: "🇵🇰" }
  ];

  const handleLanguageChange = async (languageCode) => {
    await changeLanguage(languageCode);
    setShowLanguageDropdown(false);
  };

  // Mock data for quick search results
  const quickSearchResults = [
    { id: 1, title: "PM-KISAN Scheme", type: "scheme", href: "/schemes", description: "Direct income support to farmers" },
    { id: 2, title: "Aadhaar Card", type: "document", href: "/verify", description: "Identity verification document" },
    { id: 3, title: "Digital Skills Workshop", type: "event", href: "/events", description: "Upcoming workshop on digital literacy" },
    { id: 4, title: "Delhi District Office", type: "location", href: "/locations", description: "Government office in Delhi" },
    { id: 5, title: "Complaint Status", type: "service", href: "/complaints", description: "Track your complaint status" }
  ];

  // Mock data for quick notifications
  const quickNotifications = [
    {
      id: 1,
      title: "PM-KISAN Application Approved",
      message: "Your application has been approved. Payment will be processed soon.",
      time: "2 hours ago",
      type: "success",
      unread: true
    },
    {
      id: 2,
      title: "Document Verification Required",
      message: "Please upload additional documents for PMAY application.",
      time: "1 day ago",
      type: "warning",
      unread: true
    },
    {
      id: 3,
      title: "New Scheme Available",
      message: "PM Vishwakarma scheme is now available for artisans.",
      time: "2 days ago",
      type: "info",
      unread: false
    }
  ];

  const filteredSearchResults = searchQuery 
    ? quickSearchResults.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">SS</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-primary">Saral Seva</span>
                <span className="text-xs text-muted-foreground -mt-1">Government Services</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="hidden sm:inline-flex"
              onClick={() => setShowSearchModal(true)}
            >
              <Search className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="hidden sm:inline-flex relative"
              onClick={() => setShowNotificationModal(true)}
            >
              <Bell className="h-4 w-4" />
              {unreadNotifications > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 h-5 w-5 text-xs flex items-center justify-center bg-destructive text-destructive-foreground p-0"
                >
                  {unreadNotifications}
                </Badge>
              )}
            </Button>
            
            {/* Language Selector */}
            <div className="relative hidden sm:block language-dropdown">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                className="flex items-center gap-2"
              >
                <span className="text-lg">{languageInfo.flag}</span>
                <span className="hidden md:inline">{languageInfo.name}</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
              
              {showLanguageDropdown && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-background border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                  <div className="p-2">
                    {availableLanguages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => handleLanguageChange(language.code)}
                        className={`w-full text-left p-3 rounded-md hover:bg-accent transition-colors ${
                          currentLanguage === language.code ? 'bg-accent' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{language.flag}</span>
                            <div>
                              <div className="font-medium text-sm">{language.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {language.nativeName}
                              </div>
                            </div>
                          </div>
                          {currentLanguage === language.code && (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                        </div>
                      </button>
                    ))}
                    <div className="border-t mt-2 pt-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full justify-start"
                        onClick={() => {
                          setShowLanguageModal(true);
                          setShowLanguageDropdown(false);
                        }}
                      >
                        <Globe className="h-4 w-4 mr-2" />
                        More Languages...
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {isAuthenticated ? (
              <div className="hidden sm:flex items-center space-x-2">
                <Button variant="ghost" size="icon" asChild>
                  <Link to="/profile">
                    <User className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button variant="government" size="sm" className="hidden sm:inline-flex" asChild>
                <Link to="/login">
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Link>
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-6">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  
                  {/* Mobile Quick Actions */}
                  <div className="pt-4 border-t space-y-2">
                    <Link 
                      to="/search" 
                      className="flex items-center space-x-3 text-lg font-medium text-foreground hover:text-primary transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <Search className="h-5 w-5" />
                      <span>Search</span>
                    </Link>
                    <Link 
                      to="/notifications" 
                      className="flex items-center space-x-3 text-lg font-medium text-foreground hover:text-primary transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <Bell className="h-5 w-5" />
                      <span>Notifications</span>
                      {unreadNotifications > 0 && (
                        <Badge className="bg-destructive text-destructive-foreground">
                          {unreadNotifications}
                        </Badge>
                      )}
                    </Link>
                    <Link 
                      to="/language" 
                      className="flex items-center space-x-3 text-lg font-medium text-foreground hover:text-primary transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <Globe className="h-5 w-5" />
                      <span>Language</span>
                    </Link>
                  </div>
                  
                  <div className="pt-4 border-t">
                    {isAuthenticated ? (
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full" asChild>
                          <Link to="/profile" onClick={() => setIsOpen(false)}>
                            <User className="h-4 w-4 mr-2" />
                            Profile
                          </Link>
                        </Button>
                        <Button variant="government" className="w-full" onClick={handleLogout}>
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </Button>
                      </div>
                    ) : (
                      <Button variant="government" className="w-full" asChild>
                        <Link to="/login" onClick={() => setIsOpen(false)}>
                          <User className="h-4 w-4 mr-2" />
                          Login / Register
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      
      {/* Search Dropdown */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50" onClick={() => setShowSearchModal(false)}>
          <div className="absolute top-16 right-20 bg-background border rounded-lg shadow-lg w-96 max-h-96 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Quick Search</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSearchModal(false)}
                  className="h-6 w-6"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search schemes, services, documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                />
              </div>
            </div>
            
            <div className="max-h-64 overflow-y-auto">
              {searchQuery ? (
                filteredSearchResults.length > 0 ? (
                  <div className="p-2">
                    {filteredSearchResults.map((result) => (
                      <Link
                        key={result.id}
                        to={result.href}
                        onClick={() => {
                          setShowSearchModal(false);
                          setSearchQuery("");
                        }}
                        className="block p-3 rounded-md hover:bg-accent transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded">
                            {result.type === 'scheme' && <Star className="h-4 w-4 text-primary" />}
                            {result.type === 'document' && <FileText className="h-4 w-4 text-primary" />}
                            {result.type === 'event' && <Calendar className="h-4 w-4 text-primary" />}
                            {result.type === 'location' && <Globe className="h-4 w-4 text-primary" />}
                            {result.type === 'service' && <CheckCircle className="h-4 w-4 text-primary" />}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{result.title}</h4>
                            <p className="text-sm text-muted-foreground">{result.description}</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No results found for "{searchQuery}"</p>
                  </div>
                )
              ) : (
                <div className="p-4">
                  <h4 className="font-medium mb-3">Popular Searches</h4>
                  <div className="space-y-2">
                    {["PM-KISAN", "Aadhaar Card", "Ration Card", "Driving License", "PAN Card"].map((term) => (
                      <button
                        key={term}
                        onClick={() => setSearchQuery(term)}
                        className="block w-full text-left p-2 rounded hover:bg-accent transition-colors text-sm"
                      >
                        <TrendingUp className="h-3 w-3 inline mr-2" />
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-3 border-t">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                asChild
              >
                <Link to="/search" onClick={() => setShowSearchModal(false)}>
                  Advanced Search
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Dropdown */}
      {showNotificationModal && (
        <div className="fixed inset-0 z-50" onClick={() => setShowNotificationModal(false)}>
          <div className="absolute top-16 right-12 bg-background border rounded-lg shadow-lg w-96 max-h-96 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Notifications</h3>
                  <p className="text-sm text-muted-foreground">{unreadNotifications} unread</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowNotificationModal(false)}
                  className="h-6 w-6"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            <div className="max-h-64 overflow-y-auto">
              {quickNotifications.length > 0 ? (
                <div className="p-2">
                  {quickNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-md border-l-4 mb-2 cursor-pointer hover:bg-accent transition-colors ${
                        notification.type === 'success' ? 'border-l-green-500' :
                        notification.type === 'warning' ? 'border-l-yellow-500' :
                        'border-l-blue-500'
                      } ${notification.unread ? 'bg-accent/50' : ''}`}
                      onClick={() => {
                        setShowNotificationModal(false);
                        window.location.href = '/notifications';
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-1 rounded-full ${
                          notification.type === 'success' ? 'bg-green-100' :
                          notification.type === 'warning' ? 'bg-yellow-100' :
                          'bg-blue-100'
                        }`}>
                          {notification.type === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
                          {notification.type === 'warning' && <AlertCircle className="h-4 w-4 text-yellow-600" />}
                          {notification.type === 'info' && <Bell className="h-4 w-4 text-blue-600" />}
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-medium text-sm ${notification.unread ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {notification.title}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                          <div className="flex items-center gap-1 mt-2">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{notification.time}</span>
                            {notification.unread && (
                              <div className="w-2 h-2 bg-primary rounded-full ml-auto"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No notifications</p>
                </div>
              )}
            </div>
            
            <div className="p-3 border-t flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => {
                  setUnreadNotifications(0);
                  // Mark all as read logic would go here
                }}
              >
                <Eye className="h-3 w-3 mr-1" />
                Mark All Read
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                asChild
              >
                <Link to="/notifications" onClick={() => setShowNotificationModal(false)}>
                  View All
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Language Dropdown */}
      {showLanguageModal && (
        <div className="fixed inset-0 z-50" onClick={() => setShowLanguageModal(false)}>
          <div className="absolute top-16 right-4 bg-background border rounded-lg shadow-lg w-80 max-h-96 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Select Language</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowLanguageModal(false)}
                  className="h-6 w-6"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div className="p-2">
              {[
                { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
                { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
                { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇧🇩" },
                { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🏴󠁩󠁮󠁴󠁮󠁿" },
                { code: "te", name: "Telugu", nativeName: "తెలుగు", flag: "🏴󠁩󠁮󠁴󠁧󠁿" },
                { code: "mr", name: "Marathi", nativeName: "मराठी", flag: "🏴󠁩󠁮󠁭󠁨󠁿" },
                { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", flag: "🏴󠁩󠁮󠁧󠁪󠁿" },
                { code: "ur", name: "Urdu", nativeName: "اردو", flag: "🇵🇰" }
              ].map((language) => (
                <button
                  key={language.code}
                  onClick={() => {
                    localStorage.setItem('jan-sahayak-language', language.code);
                    setShowLanguageModal(false);
                    // Dispatch custom event for language change
                    window.dispatchEvent(new CustomEvent('languageChanged', { 
                      detail: { language: language.code } 
                    }));
                  }}
                  className="w-full text-left p-3 rounded-md hover:bg-accent transition-colors flex items-center gap-3"
                >
                  <span className="text-lg">{language.flag}</span>
                  <div>
                    <div className="font-medium">{language.name}</div>
                    <div className="text-sm text-muted-foreground">{language.nativeName}</div>
                  </div>
                </button>
              ))}
            </div>
            <div className="p-3 border-t">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                asChild
              >
                <Link to="/language" onClick={() => setShowLanguageModal(false)}>
                  More Language Settings
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;