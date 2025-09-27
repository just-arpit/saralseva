import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui";
import { useLanguage } from "../contexts/LanguageContext";
import { 
  MapPin, 
  Search, 
  Navigation, 
  Clock, 
  Phone, 
  Mail,
  ExternalLink,
  Filter,
  Building,
  Star,
  Navigation2,
  Info,
  Users,
  Calendar,
  AlertCircle,
  CheckCircle,
  Map,
  List,
  Target,
  Home,
  Database,
  BookmarkPlus,
  FileText
} from "lucide-react";

const Locations = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("list");
  const [userLocation, setUserLocation] = useState("Delhi, India");

  const categories = [
    { id: "all", name: t('schemes.all'), count: 145 },
    { id: "municipal", name: t('locations.municipal'), count: 25 },
    { id: "revenue", name: t('locations.revenue'), count: 20 },
    { id: "police", name: t('locations.police'), count: 18 },
    { id: "health", name: t('schemes.health'), count: 15 },
    { id: "education", name: t('schemes.education'), count: 12 },
    { id: "transport", name: t('locations.transport'), count: 10 },
    { id: "agriculture", name: t('schemes.agriculture'), count: 8 },
    { id: "other", name: t('events.other'), count: 37 }
  ];

  const offices = [
    {
      id: 1,
      name: "Municipal Corporation Office - Central Delhi",
      category: "municipal",
      address: "Town Hall, Chandni Chowk, Delhi 110006",
      distance: "2.5 km",
      phone: "+91-11-2396-7890",
      email: "central@dmc.gov.in",
      timings: "9:00 AM - 5:00 PM (Mon-Fri)",
      rating: 4.2,
      services: ["Birth Certificate", "Death Certificate", "Property Tax", "Trade License"],
      status: "open",
      coordinates: { lat: 28.6562, lng: 77.2410 },
      waitTime: "15-30 mins",
      lastUpdated: "2 hours ago"
    },
    {
      id: 2,
      name: "District Collectorate - New Delhi",
      category: "revenue",
      address: "District Court Complex, Tis Hazari, Delhi 110054",
      distance: "3.8 km",
      phone: "+91-11-2397-1234",
      email: "dc.newdelhi@nic.in",
      timings: "10:00 AM - 4:00 PM (Mon-Fri)",
      rating: 4.5,
      services: ["Revenue Records", "Land Registration", "Certificates", "NOCs"],
      status: "open",
      coordinates: { lat: 28.6692, lng: 77.2269 },
      waitTime: "30-45 mins",
      lastUpdated: "1 hour ago"
    },
    {
      id: 3,
      name: "Passport Seva Kendra - Dwarka",
      category: "other",
      address: "Sector 3, Dwarka, New Delhi 110078",
      distance: "12.5 km",
      phone: "+91-11-2505-6789",
      email: "psk.dwarka@mea.gov.in",
      timings: "9:30 AM - 4:30 PM (Mon-Sat)",
      rating: 4.7,
      services: ["New Passport", "Passport Renewal", "Police Verification", "Tatkal Services"],
      status: "open",
      coordinates: { lat: 28.5921, lng: 77.0460 },
      waitTime: "45-60 mins",
      lastUpdated: "30 mins ago"
    },
    {
      id: 4,
      name: "Income Tax Office - Pragati Maidan",
      category: "revenue",
      address: "Pragati Maidan, New Delhi 110001",
      distance: "4.2 km",
      phone: "+91-11-2337-8901",
      email: "ito.pragati@incometax.gov.in",
      timings: "10:00 AM - 5:00 PM (Mon-Fri)",
      rating: 3.8,
      services: ["Tax Filing", "PAN Services", "TDS", "Refund Processing"],
      status: "open",
      coordinates: { lat: 28.6139, lng: 77.2473 },
      waitTime: "20-35 mins",
      lastUpdated: "45 mins ago"
    },
    {
      id: 5,
      name: "Delhi Police Station - Connaught Place",
      category: "police",
      address: "Connaught Place, New Delhi 110001",
      distance: "1.8 km",
      phone: "+91-11-2336-2345",
      email: "cp.police@delhipolice.gov.in",
      timings: "24 hours",
      rating: 4.0,
      services: ["FIR Registration", "Character Certificate", "Verification", "NOC"],
      status: "open",
      coordinates: { lat: 28.6315, lng: 77.2167 },
      waitTime: "10-20 mins",
      lastUpdated: "15 mins ago"
    },
    {
      id: 6,
      name: "Central Health Office - Janpath",
      category: "health",
      address: "Janpath, New Delhi 110001",
      distance: "3.1 km",
      phone: "+91-11-2301-4567",
      email: "health.central@gov.in",
      timings: "9:00 AM - 4:00 PM (Mon-Fri)",
      rating: 4.3,
      services: ["Health Card", "Medical Certificates", "Vaccination", "Health Schemes"],
      status: "closed",
      coordinates: { lat: 28.6219, lng: 77.2194 },
      waitTime: "Closed",
      lastUpdated: "3 hours ago"
    }
  ];

  const filteredOffices = offices.filter(office => {
    const matchesCategory = selectedCategory === "all" || office.category === selectedCategory;
    const matchesSearch = office.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         office.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch(status) {
      case "open":
        return <Badge className="bg-green-100 text-green-800">Open</Badge>;
      case "closed":
        return <Badge className="bg-red-100 text-red-800">Closed</Badge>;
      case "busy":
        return <Badge className="bg-yellow-100 text-yellow-800">Busy</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "open":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "closed":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const handleGetDirections = (office) => {
    // This would integrate with Google Maps or similar service
    const url = `https://www.google.com/maps/dir/${userLocation}/${office.coordinates.lat},${office.coordinates.lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{t('locations.title')}</h1>
          <p className="text-muted-foreground">
            {t('locations.subtitle')}
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search by office name or services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button 
                variant={viewMode === "map" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("map")}
              >
                <Map className="h-4 w-4" />
              </Button>
              <Button variant="outline">
                <Target className="h-4 w-4 mr-2" />
                Use My Location
              </Button>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
                <Badge variant="secondary" className="ml-2">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Location Info */}
          <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>Showing results near: {userLocation}</span>
            <Button variant="link" size="sm" className="p-0 h-auto">
              Change Location
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Offices List */}
          <div className="lg:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {filteredOffices.length} offices found
              </h2>
              <select className="px-3 py-2 border border-input rounded-lg bg-background text-sm">
                <option>Sort by distance</option>
                <option>Sort by rating</option>
                <option>Sort by wait time</option>
              </select>
            </div>

            <div className="space-y-4">
              {filteredOffices.map((office) => (
                <Card key={office.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{office.name}</h3>
                          {getStatusBadge(office.status)}
                        </div>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {office.address}
                          </div>
                          <div className="flex items-center gap-2">
                            <Navigation className="h-4 w-4" />
                            {office.distance} away
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {office.timings}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium">{office.rating}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Wait: {office.waitTime}
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-sm mb-2">Services Available:</h4>
                      <div className="flex flex-wrap gap-1">
                        {office.services.map((service, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm">
                        <a href={`tel:${office.phone}`} className="flex items-center gap-1 text-primary hover:underline">
                          <Phone className="h-4 w-4" />
                          Call
                        </a>
                        <a href={`mailto:${office.email}`} className="flex items-center gap-1 text-primary hover:underline">
                          <Mail className="h-4 w-4" />
                          Email
                        </a>
                        <span className="text-muted-foreground">
                          Updated {office.lastUpdated}
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleGetDirections(office)}
                        >
                          <Navigation2 className="h-4 w-4 mr-2" />
                          Directions
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link to="/profile">
                            <BookmarkPlus className="h-4 w-4 mr-2" />
                            Save
                          </Link>
                        </Button>
                        <Button size="sm" asChild>
                          <a href={`https://maps.google.com/?q=${office.coordinates.lat},${office.coordinates.lng}`} target="_blank" rel="noopener noreferrer">
                            <Info className="h-4 w-4 mr-2" />
                            More Info
                            <ExternalLink className="h-4 w-4 ml-1" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-success">128</div>
                    <div className="text-xs text-muted-foreground">Open Now</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-destructive">17</div>
                    <div className="text-xs text-muted-foreground">Closed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">4.2</div>
                    <div className="text-xs text-muted-foreground">Avg Rating</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-warning">25m</div>
                    <div className="text-xs text-muted-foreground">Avg Wait</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Nearby Services */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Nearby Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["ATM - 150m", "Hospital - 500m", "Post Office - 300m", "Bank - 200m"].map((service, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span>{service}</span>
                      <Button variant="link" size="sm" className="p-0 h-auto" asChild>
                        <a href={`https://www.google.com/maps/search/${service.split(' - ')[0]}+near+${userLocation}`} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Popular Services */}
            <Card>
              <CardHeader>
                <CardTitle>Popular Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    "Birth Certificate",
                    "Passport Services", 
                    "PAN Card",
                    "Driving License",
                    "Property Registration"
                  ].map((service, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span>{service}</span>
                      <Badge variant="outline">{Math.floor(Math.random() * 20) + 5}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Help & Support */}
            <Card>
              <CardHeader>
                <CardTitle>Help & Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start text-sm" asChild>
                  <a href="tel:1800-121-3468" target="_blank">
                    <Phone className="h-4 w-4 mr-2" />
                    Helpline: 1800-121-3468
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm" asChild>
                  <Link to="/complaints">
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Support
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm" asChild>
                  <Link to="/complaints">
                    <Building className="h-4 w-4 mr-2" />
                    Report Issue
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Government Office Locators */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  Official Office Locators
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <a href="https://districts.gov.in/" target="_blank" rel="noopener noreferrer">
                    <Building className="h-4 w-4 mr-2" />
                    District Administration Offices
                    <ExternalLink className="h-4 w-4 ml-auto" />
                  </a>
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <a href="https://passportindia.gov.in/AppOnlineProject/online/procFormSubOnl" target="_blank" rel="noopener noreferrer">
                    <FileText className="h-4 w-4 mr-2" />
                    Passport Seva Kendra
                    <ExternalLink className="h-4 w-4 ml-auto" />
                  </a>
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <a href="https://incometax.gov.in/iec/foportal/help/individual/assessee-services/income-tax-offices" target="_blank" rel="noopener noreferrer">
                    <Building className="h-4 w-4 mr-2" />
                    Income Tax Offices
                    <ExternalLink className="h-4 w-4 ml-auto" />
                  </a>
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <a href="https://eci.gov.in/electoral-roll/electoral-registration-officers/" target="_blank" rel="noopener noreferrer">
                    <Users className="h-4 w-4 mr-2" />
                    Election Commission Offices
                    <ExternalLink className="h-4 w-4 ml-auto" />
                  </a>
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <a href="https://esic.gov.in/find-your-nearest-esic-office" target="_blank" rel="noopener noreferrer">
                    <Building className="h-4 w-4 mr-2" />
                    ESIC Offices
                    <ExternalLink className="h-4 w-4 ml-auto" />
                  </a>
                </Button>
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
                    <FileText className="h-4 w-4 mr-2" />
                    Browse Schemes
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/events">
                    <Calendar className="h-4 w-4 mr-2" />
                    Nearby Events
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/profile">
                    <BookmarkPlus className="h-4 w-4 mr-2" />
                    Saved Locations
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

export default Locations;