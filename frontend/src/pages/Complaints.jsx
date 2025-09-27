import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui";
import { useLanguage } from "../contexts/LanguageContext";
import { 
  MessageSquare, 
  Twitter, 
  Send, 
  Image as ImageIcon, 
  MapPin, 
  Tag,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  Heart,
  MessageCircle,
  Share,
  Flag,
  Filter,
  TrendingUp,
  Users,
  FileText,
  Camera,
  Mic,
  Eye,
  ThumbsUp,
  AlertCircle,
  ExternalLink,
  Home,
  Database,
  Phone,
  Mail,
  BookmarkPlus
} from "lucide-react";

const Complaints = () => {
  const { t } = useLanguage();
  const [complaint, setComplaint] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    urgency: "medium",
    attachments: []
  });

  const [complaints, setComplaints] = useState([
    {
      id: 1,
      title: "Poor Road Conditions in Sector 15",
      description: "Multiple potholes and damaged streetlights making it dangerous for commuters, especially during night time.",
      category: "Infrastructure",
      location: "Sector 15, Noida",
      urgency: "high",
      status: "in_progress",
      author: "Priya Sharma",
      timestamp: "2 hours ago",
      upvotes: 45,
      comments: 12,
      shares: 8,
      twitterStatus: "posted",
      department: "Municipal Corporation",
      tags: ["roads", "safety", "streetlights"],
      images: 3
    },
    {
      id: 2,
      title: "Irregular Water Supply",
      description: "Water supply has been irregular for the past 2 weeks. Residents facing difficulty in daily activities.",
      category: "Water Supply",
      location: "Block A, Dwarka",
      urgency: "medium",
      status: "under_review",
      author: "Rajesh Kumar",
      timestamp: "1 day ago",
      upvotes: 23,
      comments: 7,
      shares: 4,
      twitterStatus: "scheduled",
      department: "Delhi Jal Board",
      tags: ["water", "supply", "residential"],
      images: 1
    },
    {
      id: 3,
      title: "Illegal Construction Activity",
      description: "Construction work happening without proper permits, causing noise pollution and safety concerns.",
      category: "Illegal Activity",
      location: "Green Park Extension",
      urgency: "high",
      status: "resolved",
      author: "Anonymous",
      timestamp: "3 days ago",
      upvotes: 67,
      comments: 18,
      shares: 15,
      twitterStatus: "posted",
      department: "Building Department",
      tags: ["illegal", "construction", "permits"],
      images: 5
    },
    {
      id: 4,
      title: "Power Outage Issues",
      description: "Frequent power cuts in the area for past week. No prior notice given to residents.",
      category: "Electricity",
      location: "Lajpat Nagar",
      urgency: "medium",
      status: "pending",
      author: "Sunita Devi",
      timestamp: "5 days ago",
      upvotes: 34,
      comments: 9,
      shares: 6,
      twitterStatus: "draft",
      department: "Electricity Board",
      tags: ["power", "outage", "residential"],
      images: 0
    }
  ]);

  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const categories = [
    "Infrastructure", "Water Supply", "Electricity", "Sanitation", 
    "Traffic", "Illegal Activity", "Healthcare", "Education", "Other"
  ];

  const urgencyLevels = [
    { value: "low", label: "Low", color: "bg-green-100 text-green-800" },
    { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
    { value: "high", label: "High", color: "bg-red-100 text-red-800" }
  ];

  const statusTypes = [
    { value: "pending", label: "Pending", color: "bg-gray-100 text-gray-800", icon: Clock },
    { value: "under_review", label: "Under Review", color: "bg-blue-100 text-blue-800", icon: Eye },
    { value: "in_progress", label: "In Progress", color: "bg-yellow-100 text-yellow-800", icon: AlertTriangle },
    { value: "resolved", label: "Resolved", color: "bg-green-100 text-green-800", icon: CheckCircle }
  ];

  const twitterStatusTypes = [
    { value: "draft", label: "Draft", color: "bg-gray-100 text-gray-800" },
    { value: "scheduled", label: "Scheduled", color: "bg-blue-100 text-blue-800" },
    { value: "posted", label: "Posted", color: "bg-green-100 text-green-800" }
  ];

  const handleSubmitComplaint = () => {
    if (!complaint.title || !complaint.description || !complaint.category) {
      alert("Please fill in all required fields");
      return;
    }

    const newComplaint = {
      id: complaints.length + 1,
      ...complaint,
      author: "Current User",
      timestamp: "Just now",
      upvotes: 0,
      comments: 0,
      shares: 0,
      status: "pending",
      twitterStatus: "draft",
      department: "Auto-assigned",
      tags: complaint.description.toLowerCase().split(' ').filter(word => word.length > 3).slice(0, 3),
      images: complaint.attachments.length
    };

    setComplaints([newComplaint, ...complaints]);
    setComplaint({
      title: "",
      description: "",
      category: "",
      location: "",
      urgency: "medium",
      attachments: []
    });
  };

  const getStatusBadge = (status) => {
    const statusType = statusTypes.find(s => s.value === status);
    return (
      <Badge className={statusType.color}>
        <statusType.icon className="h-3 w-3 mr-1" />
        {statusType.label}
      </Badge>
    );
  };

  const getUrgencyBadge = (urgency) => {
    const urgencyType = urgencyLevels.find(u => u.value === urgency);
    return <Badge className={urgencyType.color}>{urgencyType.label}</Badge>;
  };

  const getTwitterStatusBadge = (twitterStatus) => {
    const status = twitterStatusTypes.find(s => s.value === twitterStatus);
    return <Badge className={status.color}>{status.label}</Badge>;
  };

  const filteredComplaints = complaints.filter(complaint => {
    if (filter === "all") return true;
    return complaint.status === filter;
  });

  const sortedComplaints = [...filteredComplaints].sort((a, b) => {
    switch(sortBy) {
      case "recent": return new Date(b.timestamp) - new Date(a.timestamp);
      case "upvotes": return b.upvotes - a.upvotes;
      case "urgency": 
        const urgencyOrder = { high: 3, medium: 2, low: 1 };
        return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
      default: return 0;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{t('complaints.title')}</h1>
          <p className="text-muted-foreground">
            {t('complaints.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Complaint Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Submit New Complaint
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Complaint Title *</label>
                  <input
                    type="text"
                    placeholder="Brief description of the issue"
                    value={complaint.title}
                    onChange={(e) => setComplaint({...complaint, title: e.target.value})}
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category *</label>
                    <select
                      value={complaint.category}
                      onChange={(e) => setComplaint({...complaint, category: e.target.value})}
                      className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Urgency Level</label>
                    <select
                      value={complaint.urgency}
                      onChange={(e) => setComplaint({...complaint, urgency: e.target.value})}
                      className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      {urgencyLevels.map((level) => (
                        <option key={level.value} value={level.value}>{level.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Enter location or area"
                      value={complaint.location}
                      onChange={(e) => setComplaint({...complaint, location: e.target.value})}
                      className="w-full pl-10 pr-3 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Detailed Description *</label>
                  <textarea
                    rows={4}
                    placeholder="Provide detailed information about the issue"
                    value={complaint.description}
                    onChange={(e) => setComplaint({...complaint, description: e.target.value})}
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Attachments</label>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Add Photos
                    </Button>
                    <Button variant="outline" size="sm">
                      <Camera className="h-4 w-4 mr-2" />
                      Take Photo
                    </Button>
                    <Button variant="outline" size="sm">
                      <Mic className="h-4 w-4 mr-2" />
                      Voice Note
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Documents
                    </Button>
                  </div>
                </div>

                <div className="bg-accent/50 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Twitter className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm">Social Media Integration</h4>
                      <p className="text-xs text-muted-foreground mb-2">
                        Your complaint will be auto-posted on Twitter with relevant department tags for faster resolution.
                      </p>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="twitter-post" defaultChecked />
                        <label htmlFor="twitter-post" className="text-xs">Post on Twitter after moderation approval</label>
                      </div>
                    </div>
                  </div>
                </div>

                <Button onClick={handleSubmitComplaint} className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Submit Complaint
                </Button>
                
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link to="/profile">
                      <BookmarkPlus className="h-4 w-4 mr-2" />
                      Save Draft
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <a href="https://pgportal.gov.in/" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      CPGRAMS Portal
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Complaints List */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    All Complaints
                  </CardTitle>
                  <div className="flex gap-2">
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="px-3 py-1 border border-input rounded text-sm bg-background"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="under_review">Under Review</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-1 border border-input rounded text-sm bg-background"
                    >
                      <option value="recent">Recent</option>
                      <option value="upvotes">Most Upvoted</option>
                      <option value="urgency">Urgency</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sortedComplaints.map((complaint) => (
                    <div key={complaint.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{complaint.title}</h3>
                            {getStatusBadge(complaint.status)}
                            {getUrgencyBadge(complaint.urgency)}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{complaint.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {complaint.author}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {complaint.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {complaint.timestamp}
                            </span>
                            {complaint.images > 0 && (
                              <span className="flex items-center gap-1">
                                <ImageIcon className="h-3 w-3" />
                                {complaint.images} photos
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          {getTwitterStatusBadge(complaint.twitterStatus)}
                          <p className="text-xs text-muted-foreground mt-1">{complaint.department}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {complaint.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm">
                          <button className="flex items-center gap-1 text-muted-foreground hover:text-primary">
                            <ThumbsUp className="h-4 w-4" />
                            {complaint.upvotes}
                          </button>
                          <button className="flex items-center gap-1 text-muted-foreground hover:text-primary">
                            <MessageCircle className="h-4 w-4" />
                            {complaint.comments}
                          </button>
                          <button className="flex items-center gap-1 text-muted-foreground hover:text-primary">
                            <Share className="h-4 w-4" />
                            {complaint.shares}
                          </button>
                          <Button variant="outline" size="sm" asChild>
                            <Link to="/profile">
                              <BookmarkPlus className="h-4 w-4 mr-1" />
                              Track
                            </Link>
                          </Button>
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
            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Complaint Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">1,234</div>
                    <div className="text-xs text-muted-foreground">Total Complaints</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-success">856</div>
                    <div className="text-xs text-muted-foreground">Resolved</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-warning">245</div>
                    <div className="text-xs text-muted-foreground">In Progress</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-secondary">133</div>
                    <div className="text-xs text-muted-foreground">Pending</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <div>
                  <h4 className="font-medium">Before Filing:</h4>
                  <ul className="text-xs text-muted-foreground space-y-1 mt-1">
                    <li>• Check if similar complaint exists</li>
                    <li>• Gather evidence (photos, documents)</li>
                    <li>• Provide accurate location details</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium">Response Time:</h4>
                  <ul className="text-xs text-muted-foreground space-y-1 mt-1">
                    <li>• High urgency: 24-48 hours</li>
                    <li>• Medium urgency: 3-7 days</li>
                    <li>• Low urgency: 7-14 days</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium">Social Media:</h4>
                  <ul className="text-xs text-muted-foreground space-y-1 mt-1">
                    <li>• Auto-posted after moderation</li>
                    <li>• Tags relevant departments</li>
                    <li>• Increases visibility & response</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Popular Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Popular Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.slice(0, 6).map((category, index) => (
                    <div key={category} className="flex items-center justify-between text-sm">
                      <span>{category}</span>
                      <Badge variant="outline">{Math.floor(Math.random() * 100) + 10}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Government Grievance Portals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  Official Grievance Portals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <a href="https://pgportal.gov.in/" target="_blank" rel="noopener noreferrer">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    CPGRAMS - Public Grievances
                    <ExternalLink className="h-4 w-4 ml-auto" />
                  </a>
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <a href="https://jeevanpramaan.gov.in/" target="_blank" rel="noopener noreferrer">
                    <FileText className="h-4 w-4 mr-2" />
                    Jeevan Pramaan Grievances
                    <ExternalLink className="h-4 w-4 ml-auto" />
                  </a>
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <a href="https://consumerhelpline.gov.in/" target="_blank" rel="noopener noreferrer">
                    <Phone className="h-4 w-4 mr-2" />
                    Consumer Helpline (1915)
                    <ExternalLink className="h-4 w-4 ml-auto" />
                  </a>
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <a href="https://scores.gov.in/" target="_blank" rel="noopener noreferrer">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    SEBI SCORES Portal
                    <ExternalLink className="h-4 w-4 ml-auto" />
                  </a>
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <a href="https://lokpal.gov.in/" target="_blank" rel="noopener noreferrer">
                    <Flag className="h-4 w-4 mr-2" />
                    Lokpal Complaints
                    <ExternalLink className="h-4 w-4 ml-auto" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Emergency Contacts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  Emergency Contacts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Police Emergency</span>
                    <Badge variant="outline">100</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Fire Emergency</span>
                    <Badge variant="outline">101</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Medical Emergency</span>
                    <Badge variant="outline">108</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Women Helpline</span>
                    <Badge variant="outline">1091</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Child Helpline</span>
                    <Badge variant="outline">1098</Badge>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <a href="tel:100">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Emergency
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" asChild>
                  <Link to="/dashboard">
                    <Home className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/profile">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    My Complaints
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/events">
                    <Eye className="h-4 w-4 mr-2" />
                    Upcoming Events
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/locations">
                    <MapPin className="h-4 w-4 mr-2" />
                    Find Offices
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

export default Complaints;