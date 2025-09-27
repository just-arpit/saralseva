import { useState } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui";
import { 
  Search as SearchIcon, 
  Filter, 
  X,
  MapPin,
  Calendar,
  Clock,
  Star,
  Users,
  FileText,
  Building,
  Phone,
  Mail,
  ExternalLink,
  ChevronDown,
  Sliders,
  TrendingUp,
  BookmarkPlus,
  Share,
  Eye
} from "lucide-react";

const Search = () => {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedFilters, setSelectedFilters] = useState({
    location: "",
    dateRange: "",
    status: "",
    rating: "",
    urgency: ""
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const categories = [
    { id: "all", name: "All Results", count: 0 },
    { id: "schemes", name: "Government Schemes", count: 0 },
    { id: "services", name: "Services", count: 0 },
    { id: "offices", name: "Government Offices", count: 0 },
    { id: "events", name: "Events", count: 0 },
    { id: "documents", name: "Documents", count: 0 }
  ];

  const locations = [
    "All Locations", "Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", 
    "Hyderabad", "Pune", "Ahmedabad", "Jaipur", "Lucknow"
  ];

  const mockResults = {
    schemes: [
      {
        id: 1,
        type: "scheme",
        title: "PM-KISAN Samman Nidhi",
        description: "Income support scheme for farmer families across the country to supplement their financial needs.",
        category: "Agriculture",
        eligibility: "95% match",
        benefits: "₹6,000 per year",
        location: "All India",
        rating: 4.6,
        applicants: "11.8 Crore",
        deadline: "Ongoing",
        tags: ["farmer", "income support", "central scheme"]
      },
      {
        id: 2,
        type: "scheme",
        title: "Startup India Seed Fund",
        description: "Financial assistance to startups for proof of concept, prototype development, and market entry.",
        category: "Employment",
        eligibility: "88% match",
        benefits: "Up to ₹20 Lakh",
        location: "All India", 
        rating: 4.8,
        applicants: "5,000+",
        deadline: "Dec 31, 2024",
        tags: ["startup", "funding", "innovation"]
      }
    ],
    offices: [
      {
        id: 3,
        type: "office",
        title: "District Collectorate - New Delhi",
        description: "Revenue records, land registration, certificates, and NOC services.",
        category: "Revenue",
        address: "District Court Complex, Tis Hazari, Delhi 110054",
        distance: "3.8 km",
        rating: 4.5,
        phone: "+91-11-2397-1234",
        email: "dc.newdelhi@nic.in",
        timings: "10:00 AM - 4:00 PM (Mon-Fri)",
        services: ["Revenue Records", "Land Registration", "Certificates", "NOCs"]
      },
      {
        id: 4,
        type: "office",
        title: "Passport Seva Kendra - Dwarka",
        description: "Passport services including new applications, renewals, and police verification.",
        category: "Passport",
        address: "Sector 3, Dwarka, New Delhi 110078",
        distance: "12.5 km",
        rating: 4.7,
        phone: "+91-11-2505-6789",
        email: "psk.dwarka@mea.gov.in",
        timings: "9:30 AM - 4:30 PM (Mon-Sat)",
        services: ["New Passport", "Passport Renewal", "Police Verification", "Tatkal Services"]
      }
    ],
    events: [
      {
        id: 5,
        type: "event",
        title: "Digital India Workshop",
        description: "Learn about government digital services and access them efficiently.",
        category: "Workshop",
        date: "2024-09-20",
        time: "10:00 AM - 4:00 PM",
        location: "Pragati Maidan, New Delhi",
        organizer: "Ministry of Electronics & IT",
        attendees: 234,
        maxCapacity: 500,
        price: "Free",
        tags: ["digital", "technology", "government services"]
      },
      {
        id: 6,
        type: "event",
        title: "Startup Mahakumbh 2024",
        description: "India's largest startup ecosystem event bringing together entrepreneurs and investors.",
        category: "Expo",
        date: "2024-09-25",
        time: "9:00 AM - 6:00 PM",
        location: "India Expo Mart, Greater Noida",
        organizer: "Startup India",
        attendees: 1520,
        maxCapacity: 5000,
        price: "₹500",
        tags: ["startup", "entrepreneurship", "investment"]
      }
    ]
  };

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setSearchPerformed(true);

    // Simulate API call
    setTimeout(() => {
      const filteredResults = [];
      
      if (selectedCategory === "all" || selectedCategory === "schemes") {
        filteredResults.push(...mockResults.schemes.filter(item => 
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        ));
      }
      
      if (selectedCategory === "all" || selectedCategory === "offices") {
        filteredResults.push(...mockResults.offices.filter(item => 
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          item.services.some(service => service.toLowerCase().includes(query.toLowerCase()))
        ));
      }
      
      if (selectedCategory === "all" || selectedCategory === "events") {
        filteredResults.push(...mockResults.events.filter(item => 
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        ));
      }

      setResults(filteredResults);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setSearchPerformed(false);
  };

  const getResultIcon = (type) => {
    switch (type) {
      case "scheme": return FileText;
      case "office": return Building;
      case "event": return Calendar;
      default: return FileText;
    }
  };

  const renderResultCard = (result) => {
    const IconComponent = getResultIcon(result.type);
    
    return (
      <Card key={result.id} className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="p-2 rounded-lg bg-primary/10">
                <IconComponent className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold">{result.title}</h3>
                  <Badge variant="outline" className="text-xs">
                    {result.category}
                  </Badge>
                  {result.type === "scheme" && (
                    <Badge className="bg-success text-success-foreground text-xs">
                      {result.eligibility}
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground mb-3">{result.description}</p>
                
                {/* Type-specific information */}
                {result.type === "scheme" && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm mb-3">
                    <div>
                      <span className="text-muted-foreground">Benefits: </span>
                      <span className="font-medium">{result.benefits}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Deadline: </span>
                      <span className="font-medium">{result.deadline}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Applicants: </span>
                      <span className="font-medium">{result.applicants}</span>
                    </div>
                  </div>
                )}
                
                {result.type === "office" && (
                  <div className="space-y-2 text-sm mb-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{result.address}</span>
                      <Badge variant="outline" className="text-xs">{result.distance}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{result.timings}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <a href={`tel:${result.phone}`} className="flex items-center gap-1 text-primary hover:underline">
                        <Phone className="h-4 w-4" />
                        Call
                      </a>
                      <a href={`mailto:${result.email}`} className="flex items-center gap-1 text-primary hover:underline">
                        <Mail className="h-4 w-4" />
                        Email
                      </a>
                    </div>
                  </div>
                )}
                
                {result.type === "event" && (
                  <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(result.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{result.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{result.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{result.attendees}/{result.maxCapacity}</span>
                    </div>
                  </div>
                )}
                
                {/* Tags */}
                {result.tags && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {result.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {result.rating && (
              <div className="text-right">
                <div className="flex items-center gap-1 mb-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">{result.rating}</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {result.type === "scheme" && (
                <Button size="sm">Apply Now</Button>
              )}
              {result.type === "office" && (
                <Button size="sm">Get Directions</Button>
              )}
              {result.type === "event" && (
                <Button size="sm">Register</Button>
              )}
              <Button variant="outline" size="sm">
                <BookmarkPlus className="h-4 w-4 mr-1" />
                Save
              </Button>
            </div>
            
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon">
                <Share className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Search Government Services</h1>
          <p className="text-muted-foreground">
            Find schemes, offices, events, and services across all government departments
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Main Search Bar */}
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search for schemes, services, offices, events..."
                className="w-full pl-12 pr-12 py-4 text-lg border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {query && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <Button
              onClick={handleSearch}
              disabled={!query.trim() || isLoading}
              className="px-8 py-4 text-lg h-auto"
              variant="government"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent mr-2" />
                  Searching...
                </>
              ) : (
                <>
                  <SearchIcon className="h-5 w-5 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
                {searchPerformed && category.count > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {category.count}
                  </Badge>
                )}
              </Button>
            ))}
          </div>

          {/* Advanced Filters */}
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <Sliders className="h-4 w-4 mr-2" />
              Advanced Filters
              <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
            </Button>
            
            {Object.values(selectedFilters).some(filter => filter) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedFilters({ location: "", dateRange: "", status: "", rating: "", urgency: "" })}
              >
                Clear Filters
              </Button>
            )}
          </div>

          {/* Advanced Filters Panel */}
          {showAdvancedFilters && (
            <Card className="mt-4">
              <CardContent className="p-4">
                <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    <select
                      value={selectedFilters.location}
                      onChange={(e) => setSelectedFilters(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm"
                    >
                      {locations.map((location) => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Date Range</label>
                    <select
                      value={selectedFilters.dateRange}
                      onChange={(e) => setSelectedFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                      className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm"
                    >
                      <option value="">Any Time</option>
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                      <option value="quarter">Next 3 Months</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Status</label>
                    <select
                      value={selectedFilters.status}
                      onChange={(e) => setSelectedFilters(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm"
                    >
                      <option value="">All Status</option>
                      <option value="open">Open</option>
                      <option value="closing">Closing Soon</option>
                      <option value="new">Recently Added</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Rating</label>
                    <select
                      value={selectedFilters.rating}
                      onChange={(e) => setSelectedFilters(prev => ({ ...prev, rating: e.target.value }))}
                      className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm"
                    >
                      <option value="">Any Rating</option>
                      <option value="4+">4+ Stars</option>
                      <option value="3+">3+ Stars</option>
                      <option value="2+">2+ Stars</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Urgency</label>
                    <select
                      value={selectedFilters.urgency}
                      onChange={(e) => setSelectedFilters(prev => ({ ...prev, urgency: e.target.value }))}
                      className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm"
                    >
                      <option value="">All Urgency</option>
                      <option value="high">High Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="low">Low Priority</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Search Results */}
        {searchPerformed && (
          <div>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
                <p className="text-muted-foreground">Searching across all government services...</p>
              </div>
            ) : (
              <>
                {/* Results Summary */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {results.length} results found for "{query}"
                    </h2>
                    <p className="text-muted-foreground">
                      Showing relevant government schemes, offices, and events
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span className="text-sm">AI-powered relevance ranking</span>
                  </div>
                </div>

                {/* Results List */}
                {results.length > 0 ? (
                  <div className="space-y-6">
                    {results.map(renderResultCard)}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <SearchIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No results found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your search terms or filters
                    </p>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>• Check spelling and try different keywords</p>
                      <p>• Use broader search terms</p>
                      <p>• Clear filters and try again</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Popular Searches */}
        {!searchPerformed && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-4">Popular Searches</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2">Government Schemes</h3>
                  <div className="space-y-1 text-sm">
                    <button className="text-primary hover:underline block">PM-KISAN</button>
                    <button className="text-primary hover:underline block">Ayushman Bharat</button>
                    <button className="text-primary hover:underline block">Startup India</button>
                    <button className="text-primary hover:underline block">PMAY</button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2">Services</h3>
                  <div className="space-y-1 text-sm">
                    <button className="text-primary hover:underline block">Passport Services</button>
                    <button className="text-primary hover:underline block">PAN Card</button>
                    <button className="text-primary hover:underline block">Driving License</button>
                    <button className="text-primary hover:underline block">Birth Certificate</button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2">Offices</h3>
                  <div className="space-y-1 text-sm">
                    <button className="text-primary hover:underline block">District Collectorate</button>
                    <button className="text-primary hover:underline block">Passport Office</button>
                    <button className="text-primary hover:underline block">Municipal Corporation</button>
                    <button className="text-primary hover:underline block">Police Station</button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;