import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui";
import { useLanguage } from "../contexts/LanguageContext";
import { 
  Search, 
  Filter, 
  Star, 
  BookmarkPlus,
  Users,
  Briefcase,
  GraduationCap,
  Heart,
  Home,
  Sprout,
  TrendingUp,
  Clock,
  MapPin,
  CheckCircle,
  ArrowRight,
  Sliders,
  SortAsc,
  ExternalLink
} from "lucide-react";

const Schemes = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedState, setSelectedState] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");

  const categories = [
    { id: "all", name: t('schemes.all'), icon: Star, count: 500 },
    { id: "employment", name: t('schemes.employment'), icon: Briefcase, count: 45 },
    { id: "education", name: t('schemes.education'), icon: GraduationCap, count: 35 },
    { id: "healthcare", name: t('schemes.health'), icon: Heart, count: 25 },
    { id: "agriculture", name: t('schemes.agriculture'), icon: Sprout, count: 30 },
    { id: "housing", name: t('schemes.housing'), icon: Home, count: 20 },
    { id: "welfare", name: t('schemes.social'), icon: Users, count: 40 }
  ];

  const states = [
    "All States", "Delhi", "Maharashtra", "Karnataka", "Tamil Nadu", "Gujarat", 
    "Rajasthan", "Uttar Pradesh", "West Bengal", "Kerala", "Punjab"
  ];

  const schemes = [
    {
      id: 1,
      name: "PM-KISAN Samman Nidhi",
      category: "Agriculture",
      state: "All India",
      description: "Income support to farmer families across the country to supplement their financial needs for procuring various inputs related to agriculture and allied activities as well as domestic needs.",
      eligibility: ["Small & Marginal Farmers", "Land holding up to 2 hectares", "All states covered"],
      benefits: "₹6,000 per year in 3 installments",
      deadline: "Ongoing",
      applicants: "11.8 Crore",
      rating: 4.6,
      tags: ["farmer", "income support", "central scheme"],
      status: "active",
      matchScore: 95,
      trending: true,
      lastUpdated: "2 days ago",
      officialLink: "https://pmkisan.gov.in/",
      applyLink: "https://pmkisan.gov.in/RegistrationNew.aspx"
    },
    {
      id: 2,
      name: "Startup India Seed Fund Scheme",
      category: "Employment",
      state: "All India",
      description: "Provides financial assistance to startups for proof of concept, prototype development, product trials, market entry and commercialization.",
      eligibility: ["DPIIT recognized startups", "Incorporated for not more than 2 years", "Annual turnover not exceeding ₹25 Crore"],
      benefits: "Up to ₹20 Lakh seed funding",
      deadline: "Dec 31, 2024",
      applicants: "5,000+",
      rating: 4.8,
      tags: ["startup", "funding", "innovation"],
      status: "active",
      matchScore: 88,
      trending: false,
      lastUpdated: "1 week ago",
      officialLink: "https://startupindia.gov.in/content/sih/en/government-schemes/startup-india-seed-fund-scheme.html",
      applyLink: "https://startupindia.gov.in/content/sih/en/government-schemes/startup-india-seed-fund-scheme.html"
    },
    {
      id: 3,
      name: "Pradhan Mantri Awas Yojana",
      category: "Housing",
      state: "All India",
      description: "Aims to provide pucca houses with basic amenities to all eligible families by the year 2022.",
      eligibility: ["EWS/LIG/MIG families", "No pucca house in family name", "Not availed central/state housing scheme benefits"],
      benefits: "Subsidy up to ₹2.67 Lakh",
      deadline: "Mar 31, 2024",
      applicants: "1.2 Crore",
      rating: 4.4,
      tags: ["housing", "subsidy", "urban"],
      status: "active",
      matchScore: 82,
      trending: true,
      lastUpdated: "3 days ago",
      officialLink: "https://pmaymis.gov.in/",
      applyLink: "https://pmaymis.gov.in/"
    },
    {
      id: 4,
      name: "Ayushman Bharat PM-JAY",
      category: "Healthcare",
      state: "All India",
      description: "World's largest health insurance scheme providing health cover of ₹5 lakh per family per year for secondary and tertiary care hospitalization.",
      eligibility: ["SECC 2011 beneficiaries", "Rural & Urban poor families", "Automatic enrollment for eligible families"],
      benefits: "₹5 Lakh health cover per family",
      deadline: "Ongoing",
      applicants: "23 Crore",
      rating: 4.7,
      tags: ["health insurance", "medical", "coverage"],
      status: "active",
      matchScore: 90,
      trending: false,
      lastUpdated: "1 day ago",
      officialLink: "https://pmjay.gov.in/",
      applyLink: "https://pmjay.gov.in/search/beneficiary"
    },
    {
      id: 5,
      name: "Digital India Land Records Modernization",
      category: "Technology",
      state: "All India",
      description: "Modernization of land records to conclusive land titling with title guarantee.",
      eligibility: ["All land owners", "State government participation", "Digital infrastructure availability"],
      benefits: "Conclusive land titles",
      deadline: "Ongoing",
      applicants: "50 Lakh+",
      rating: 4.2,
      tags: ["land records", "digital", "title"],
      status: "active",
      matchScore: 75,
      trending: false,
      lastUpdated: "5 days ago",
      officialLink: "https://digitalindia.gov.in/content/digital-india-land-records-modernization",
      applyLink: "https://webland.ap.gov.in/"
    },
    {
      id: 6,
      name: "Skill India Mission",
      category: "Education",
      state: "All India",
      description: "Skill development initiative to train over 40 crore people in India in different skills by 2025.",
      eligibility: ["Age 18-35 years", "School dropouts welcome", "Prior experience not mandatory"],
      benefits: "Free skill training + certification",
      deadline: "Ongoing",
      applicants: "1.4 Crore",
      rating: 4.5,
      tags: ["skill development", "training", "employment"],
      status: "active",
      matchScore: 85,
      trending: true,
      lastUpdated: "1 week ago",
      officialLink: "https://www.skillindia.gov.in/",
      applyLink: "https://www.skillindia.gov.in/registration"
    }
  ];

  const filteredSchemes = schemes.filter(scheme => {
    const matchesSearch = scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scheme.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scheme.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || 
                           scheme.category.toLowerCase() === selectedCategory;
    
    const matchesState = selectedState === "all" || selectedState === "All States" ||
                        scheme.state === selectedState || scheme.state === "All India";
    
    return matchesSearch && matchesCategory && matchesState;
  });

  const sortedSchemes = [...filteredSchemes].sort((a, b) => {
    switch(sortBy) {
      case "relevance": return b.matchScore - a.matchScore;
      case "rating": return b.rating - a.rating;
      case "deadline": return new Date(a.deadline) - new Date(b.deadline);
      case "applicants": return parseInt(b.applicants.replace(/[^\d]/g, '')) - parseInt(a.applicants.replace(/[^\d]/g, ''));
      default: return 0;
    }
  });

  const getStatusBadge = (scheme) => {
    if (scheme.trending) return <Badge className="bg-warning text-warning-foreground">Trending</Badge>;
    if (scheme.matchScore > 90) return <Badge className="bg-success text-success-foreground">Perfect Match</Badge>;
    if (scheme.matchScore > 80) return <Badge className="bg-primary text-primary-foreground">Good Match</Badge>;
    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{t('schemes.title')}</h1>
          <p className="text-muted-foreground">
            {t('schemes.subtitle')}
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder={t('schemes.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            
            {/* Filter Toggle */}
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="lg:w-auto"
            >
              <Filter className="h-4 w-4 mr-2" />
              {t('common.filter')}
            </Button>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="relevance">Sort by Relevance</option>
              <option value="rating">Sort by Rating</option>
              <option value="deadline">Sort by Deadline</option>
              <option value="applicants">Sort by Popularity</option>
            </select>
          </div>

          {/* Category Filters */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 mb-6">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="justify-start"
              >
                <category.icon className="h-4 w-4 mr-2" />
                {category.name}
                <Badge variant="secondary" className="ml-2">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sliders className="h-5 w-5" />
                  Advanced Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">State</label>
                    <select
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      className="w-full px-3 py-2 border border-input rounded-lg bg-background"
                    >
                      {states.map((state) => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Age Group</label>
                    <select className="w-full px-3 py-2 border border-input rounded-lg bg-background">
                      <option>All Ages</option>
                      <option>18-25 years</option>
                      <option>26-40 years</option>
                      <option>41-60 years</option>
                      <option>Above 60 years</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Income Range</label>
                    <select className="w-full px-3 py-2 border border-input rounded-lg bg-background">
                      <option>All Income Levels</option>
                      <option>Below ₹2 Lakh</option>
                      <option>₹2-5 Lakh</option>
                      <option>₹5-10 Lakh</option>
                      <option>Above ₹10 Lakh</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            Showing {sortedSchemes.length} schemes matching your criteria
          </p>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-sm">AI-powered recommendations</span>
          </div>
        </div>

        {/* Schemes Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {sortedSchemes.map((scheme) => (
            <Card key={scheme.id} className="hover:shadow-md transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-xl">{scheme.name}</CardTitle>
                      {getStatusBadge(scheme)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        {scheme.rating}
                      </span>
                      <span>{scheme.category}</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {scheme.state}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{scheme.matchScore}%</div>
                    <div className="text-xs text-muted-foreground">Match</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{scheme.description}</p>
                
                <div className="space-y-3 mb-4">
                  <div>
                    <h4 className="font-medium text-sm mb-1">Eligibility:</h4>
                    <div className="flex flex-wrap gap-1">
                      {scheme.eligibility.map((criteria, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {criteria}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Benefits: </span>
                      <span className="font-medium">{scheme.benefits}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Deadline: </span>
                      <span className="font-medium">{scheme.deadline}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {scheme.applicants} applicants
                    </span>
                    <span className="text-muted-foreground">
                      Updated {scheme.lastUpdated}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button className="flex-1" asChild>
                    <a href={scheme.applyLink} target="_blank" rel="noopener noreferrer">
                      {t('common.applyNow')}
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <a href={scheme.officialLink} target="_blank" rel="noopener noreferrer" title="Official Website">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <Link to="/profile" title="Save to Profile">
                      <BookmarkPlus className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        {sortedSchemes.length > 0 && (
          <div className="text-center mt-8">
            <Button variant="outline" size="lg" asChild>
              <Link to="/dashboard">
                View More in Dashboard
              </Link>
            </Button>
          </div>
        )}

        {/* Government Portal Links */}
        <div className="mt-12 p-6 bg-muted/30 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Official Government Portals</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="justify-start" asChild>
              <a href="https://www.india.gov.in/topics/agriculture" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Agriculture Schemes
              </a>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <a href="https://www.india.gov.in/topics/employment" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Employment Schemes
              </a>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <a href="https://www.india.gov.in/topics/health" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Health Schemes
              </a>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <a href="https://www.india.gov.in/topics/education" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Education Schemes
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schemes;