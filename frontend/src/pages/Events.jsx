import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui";
import { useLanguage } from "../contexts/LanguageContext";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Star, 
  Filter,
  Search,
  BookmarkPlus,
  Share,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  Zap,
  Building,
  GraduationCap,
  Briefcase,
  Heart,
  Sprout,
  Home,
  Eye,
  CheckCircle,
  AlertCircle,
  Bell,
  Database,
  FileText
} from "lucide-react";

const Events = () => {
  const { t } = useLanguage();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    { id: "all", name: t('events.allEvents'), icon: Calendar, count: 45 },
    { id: "workshop", name: t('events.workshops'), icon: Building, count: 12 },
    { id: "training", name: t('events.training'), icon: GraduationCap, count: 8 },
    { id: "expo", name: t('events.expos'), icon: Briefcase, count: 6 },
    { id: "health", name: t('events.healthCamps'), icon: Heart, count: 5 },
    { id: "agriculture", name: t('schemes.agriculture'), icon: Sprout, count: 7 },
    { id: "housing", name: t('events.housingFairs'), icon: Home, count: 4 },
    { id: "other", name: t('events.other'), icon: Star, count: 3 }
  ];

  const events = [
    {
      id: 1,
      title: "Digital India Workshop",
      description: "Learn about government digital services and how to access them efficiently. Includes hands-on training for various online portals.",
      category: "workshop",
      date: "2024-09-20",
      time: "10:00 AM - 4:00 PM",
      location: "Pragati Maidan, New Delhi",
      address: "Pragati Maidan Road, New Delhi, Delhi 110001",
      organizer: "Ministry of Electronics & IT",
      attendees: 234,
      maxCapacity: 500,
      registrationDeadline: "2024-09-18",
      status: "open",
      featured: true,
      tags: ["digital", "technology", "government services"],
      price: "Free",
      registrationLink: "https://digitalindia.gov.in/events/register",
      officialLink: "https://digitalindia.gov.in/",
      highlights: [
        "Hands-on training sessions",
        "Direct interaction with officials",
        "Certificate of completion",
        "Networking opportunities"
      ],
      requirements: ["Valid ID proof", "Laptop/Mobile recommended"],
      contactEmail: "digital@gov.in",
      contactPhone: "+91-11-2345-6789"
    },
    {
      id: 2,
      title: "Startup Mahakumbh 2024",
      description: "India's largest startup ecosystem event bringing together entrepreneurs, investors, and policymakers.",
      category: "expo",
      date: "2024-09-25",
      time: "9:00 AM - 6:00 PM",
      location: "India Expo Mart, Greater Noida",
      address: "Knowledge Park II, Greater Noida, UP 201306",
      organizer: "Startup India",
      attendees: 1520,
      maxCapacity: 5000,
      registrationDeadline: "2024-09-22",
      status: "open",
      featured: true,
      tags: ["startup", "entrepreneurship", "investment"],
      price: "₹500",
      registrationLink: "https://startupindia.gov.in/content/sih/en/events/startup-mahakumbh.html",
      officialLink: "https://startupindia.gov.in/",
      highlights: [
        "500+ startups showcasing",
        "Investor networking sessions",
        "Government scheme information",
        "Pitch competitions"
      ],
      requirements: ["Business registration (for startups)", "Valid ID proof"],
      contactEmail: "mahakumbh@startupindia.gov.in",
      contactPhone: "+91-11-2876-5432"
    },
    {
      id: 3,
      title: "PM-KISAN Awareness Camp",
      description: "Information session about PM-KISAN scheme benefits, application process, and direct interaction with agricultural experts.",
      category: "agriculture",
      date: "2024-09-22",
      time: "11:00 AM - 3:00 PM",
      location: "District Collectorate, Meerut",
      address: "Civil Lines, Meerut, UP 250001",
      organizer: "Ministry of Agriculture",
      attendees: 78,
      maxCapacity: 200,
      registrationDeadline: "2024-09-21",
      status: "open",
      featured: false,
      tags: ["agriculture", "farmers", "pm-kisan"],
      price: "Free",
      registrationLink: "https://pmkisan.gov.in/Registrationform.aspx",
      officialLink: "https://pmkisan.gov.in/",
      highlights: [
        "Scheme registration assistance",
        "Document verification help",
        "Direct benefit transfer info",
        "Q&A with officials"
      ],
      requirements: ["Farm documents", "Bank details", "Aadhaar card"],
      contactEmail: "pmkisan@agriculture.gov.in",
      contactPhone: "+91-121-234-5678"
    },
    {
      id: 4,
      title: "Ayushman Bharat Health Camp",
      description: "Free health checkups and Ayushman Bharat card registration for eligible families.",
      category: "health",
      date: "2024-09-24",
      time: "8:00 AM - 5:00 PM",
      location: "Community Health Center, Rohini",
      address: "Sector 3, Rohini, New Delhi 110085",
      organizer: "National Health Authority",
      attendees: 156,
      maxCapacity: 300,
      registrationDeadline: "2024-09-23",
      status: "open",
      featured: false,
      tags: ["health", "ayushman bharat", "medical"],
      price: "Free",
      registrationLink: "https://pmjay.gov.in/events/register",
      officialLink: "https://pmjay.gov.in/",
      highlights: [
        "Free health checkups",
        "Card registration on spot",
        "Medicine distribution",
        "Health awareness sessions"
      ],
      requirements: ["Family income proof", "Aadhaar cards", "Ration card"],
      contactEmail: "pmjay@nha.gov.in",
      contactPhone: "+91-11-4567-8901"
    },
    {
      id: 5,
      title: "Skill Development Job Fair",
      description: "Connect with employers and learn about skill development programs available under various government schemes.",
      category: "training",
      date: "2024-09-28",
      time: "10:00 AM - 5:00 PM",
      location: "India International Centre, Delhi",
      address: "40 Max Mueller Marg, New Delhi 110003",
      organizer: "Ministry of Skill Development",
      attendees: 445,
      maxCapacity: 1000,
      registrationDeadline: "2024-09-26",
      status: "open",
      featured: true,
      tags: ["skill development", "employment", "training"],
      price: "Free",
      registrationLink: "https://www.skillindia.gov.in/content/homepage-hi.html",
      officialLink: "https://www.skillindia.gov.in/",
      highlights: [
        "200+ job opportunities",
        "Skill assessment tests",
        "Training program enrollment",
        "Resume building workshops"
      ],
      requirements: ["Resume/CV", "Educational certificates", "Valid ID"],
      contactEmail: "jobfair@skilldev.gov.in",
      contactPhone: "+91-11-3456-7890"
    },
    {
      id: 6,
      title: "PMAY Housing Scheme Seminar",
      description: "Learn about Pradhan Mantri Awas Yojana eligibility, application process, and get assistance for online applications.",
      category: "housing",
      date: "2024-09-30",
      time: "2:00 PM - 6:00 PM",
      location: "Municipal Corporation Office, Gurgaon",
      address: "Civil City Centre, Gurgaon, Haryana 122001",
      organizer: "Ministry of Housing & Urban Affairs",
      attendees: 89,
      maxCapacity: 150,
      registrationDeadline: "2024-09-29",
      status: "open",
      featured: false,
      tags: ["housing", "pmay", "urban development"],
      price: "Free",
      registrationLink: "https://pmaymis.gov.in/",
      officialLink: "https://mohua.gov.in/",
      highlights: [
        "Eligibility assessment",
        "Online application help",
        "Document verification",
        "Subsidy calculation"
      ],
      requirements: ["Income proof", "Property documents", "Bank statements"],
      contactEmail: "pmay@mhua.gov.in",
      contactPhone: "+91-124-456-7890"
    }
  ];

  const filteredEvents = events.filter(event => {
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const upcomingEvents = events.filter(event => new Date(event.date) >= new Date()).slice(0, 3);

  const getStatusBadge = (status, registrationDeadline) => {
    const deadline = new Date(registrationDeadline);
    const now = new Date();
    const daysLeft = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) {
      return <Badge className="bg-red-100 text-red-800">Registration Closed</Badge>;
    } else if (daysLeft <= 2) {
      return <Badge className="bg-yellow-100 text-yellow-800">Closing Soon</Badge>;
    } else {
      return <Badge className="bg-green-100 text-green-800">Open for Registration</Badge>;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{t('events.title')}</h1>
          <p className="text-muted-foreground">
            {t('events.subtitle')}
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder={t('events.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button 
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Category Filters */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 mb-6">
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
                <Badge variant="secondary" className="ml-2 text-xs">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Events */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Featured Events
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {events.filter(event => event.featured).map((event) => (
                  <Card key={event.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{event.title}</CardTitle>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {formatDate(event.date)}
                            <Clock className="h-4 w-4 ml-2" />
                            {event.time}
                          </div>
                        </div>
                        <Badge className="bg-primary text-primary-foreground">Featured</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          {event.location}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {event.attendees}/{event.maxCapacity} registered
                        </div>
                      </div>
                      {getStatusBadge(event.status, event.registrationDeadline)}
                      <Button className="w-full mt-3" asChild>
                        <a href={event.registrationLink} target="_blank" rel="noopener noreferrer">
                          Register Now
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* All Events */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">All Events ({filteredEvents.length})</h2>
              
              {viewMode === "grid" ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredEvents.map((event) => (
                    <Card key={event.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg mb-2">{event.title}</CardTitle>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                              <Calendar className="h-4 w-4" />
                              {formatDate(event.date)}
                              <Clock className="h-4 w-4 ml-2" />
                              {event.time}
                            </div>
                            <div className="flex items-center gap-1 mb-2">
                              {event.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <Button variant="outline" size="icon" asChild>
                            <Link to="/profile">
                              <BookmarkPlus className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            {event.location}
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            {event.organizer}
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            {event.attendees}/{event.maxCapacity} registered
                          </div>
                        </div>

                        <div className="mb-4">
                          {getStatusBadge(event.status, event.registrationDeadline)}
                          <span className="ml-2 text-sm font-medium text-primary">{event.price}</span>
                        </div>

                        <div className="flex gap-2">
                          <Button className="flex-1" asChild>
                            <a href={event.registrationLink} target="_blank" rel="noopener noreferrer">
                              Register Now
                              <ExternalLink className="h-4 w-4 ml-2" />
                            </a>
                          </Button>
                          <Button variant="outline" size="icon">
                            <Share className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" asChild>
                            <a href={event.officialLink} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredEvents.map((event) => (
                    <Card key={event.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold">{event.title}</h3>
                              {getStatusBadge(event.status, event.registrationDeadline)}
                              {event.featured && <Badge className="bg-primary text-primary-foreground">Featured</Badge>}
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                {formatDate(event.date)}
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                {event.time}
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                {event.location}
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                {event.attendees}/{event.maxCapacity}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              {event.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-2 ml-4">
                            <Button asChild>
                              <a href={event.registrationLink} target="_blank" rel="noopener noreferrer">
                                Register Now
                                <ExternalLink className="h-4 w-4 ml-2" />
                              </a>
                            </Button>
                            <div className="flex gap-1">
                              <Button variant="outline" size="icon" asChild>
                                <Link to="/profile">
                                  <BookmarkPlus className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button variant="outline" size="icon">
                                <Share className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="icon" asChild>
                                <a href={event.officialLink} target="_blank" rel="noopener noreferrer">
                                  <Eye className="h-4 w-4" />
                                </a>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="border-l-4 border-primary pl-3">
                      <h4 className="font-medium text-sm">{event.title}</h4>
                      <p className="text-xs text-muted-foreground">{formatDate(event.date)}</p>
                      <p className="text-xs text-muted-foreground">{event.location}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Event Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Event Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">45</div>
                    <div className="text-xs text-muted-foreground">Total Events</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-success">12</div>
                    <div className="text-xs text-muted-foreground">This Month</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-warning">5,234</div>
                    <div className="text-xs text-muted-foreground">Total Attendees</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-secondary">8</div>
                    <div className="text-xs text-muted-foreground">Cities</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/profile">
                    <Calendar className="h-4 w-4 mr-2" />
                    My Registrations
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/profile">
                    <BookmarkPlus className="h-4 w-4 mr-2" />
                    Saved Events
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/locations">
                    <MapPin className="h-4 w-4 mr-2" />
                    Events Near Me
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/notifications">
                    <Bell className="h-4 w-4 mr-2" />
                    Event Reminders
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Government Event Portals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  Official Event Portals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <a href="https://india.gov.in/events" target="_blank" rel="noopener noreferrer">
                    <Calendar className="h-4 w-4 mr-2" />
                    India.gov.in Events
                    <ExternalLink className="h-4 w-4 ml-auto" />
                  </a>
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <a href="https://mygov.in/events/" target="_blank" rel="noopener noreferrer">
                    <Users className="h-4 w-4 mr-2" />
                    MyGov Events
                    <ExternalLink className="h-4 w-4 ml-auto" />
                  </a>
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <a href="https://digitalindia.gov.in/events" target="_blank" rel="noopener noreferrer">
                    <Zap className="h-4 w-4 mr-2" />
                    Digital India Events
                    <ExternalLink className="h-4 w-4 ml-auto" />
                  </a>
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <a href="https://startupindia.gov.in/content/sih/en/events.html" target="_blank" rel="noopener noreferrer">
                    <Briefcase className="h-4 w-4 mr-2" />
                    Startup India Events
                    <ExternalLink className="h-4 w-4 ml-auto" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Navigation */}
            <Card>
              <CardHeader>
                <CardTitle>Navigation</CardTitle>
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
                    <FileText className="h-4 w-4 mr-2" />
                    Browse Schemes
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/verify">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Verify Documents
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;