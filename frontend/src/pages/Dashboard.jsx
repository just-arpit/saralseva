import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui";
import { 
  Home, 
  FileText, 
  Shield, 
  MessageSquare, 
  Calendar, 
  MapPin, 
  User, 
  Bell, 
  Search,
  TrendingUp,
  Award,
  Clock,
  Users,
  ExternalLink,
  Star,
  Heart,
  Briefcase,
  GraduationCap,
  Building2,
  Database,
  CheckCircle,
  AlertCircle,
  ArrowRight
} from "lucide-react";

const Dashboard = () => {
  const { t, getCurrentLanguageInfo } = useLanguage();
  const { user } = useAuth();
  const [selectedTimeRange, setSelectedTimeRange] = useState("week");
  const languageInfo = getCurrentLanguageInfo();

  const [notifications] = useState([
    {
      id: 2,
      title: "Application Status Update",
      message: "Your PMAY application has been approved",
      type: "status",
      unread: true,
      timestamp: "1 day ago"
    },
    {
      id: 3,
      title: "Upcoming Event",
      message: "Digital India Workshop in Delhi on 20th Sep",
      type: "event",
      unread: false,
      timestamp: "2 days ago"
    }
  ]);

  // User profile data - combine auth user with additional dashboard data
  const userProfile = {
    name: user ? `${user.firstName} ${user.lastName}` : "Guest User",
    age: 28,
    state: "Delhi",
    occupation: "Software Engineer",
    income: "₹8,00,000",
    registeredSchemes: 5,
    completedApplications: 3
  };

  const recommendedSchemes = [
    {
      id: 1,
      name: "Startup India Seed Fund",
      category: "Employment",
      eligibility: "95% Match",
      description: "Funding support for early-stage startups",
      deadline: "Dec 31, 2024",
      maxBenefit: "₹20 Lakh",
      status: "new",
      officialLink: "https://startupindia.gov.in/content/sih/en/government-schemes/startup-india-seed-fund-scheme.html"
    },
    {
      id: 2,
      name: "IT Professional Tax Benefit",
      category: "Tax Concession",
      eligibility: "88% Match",
      description: "Tax deductions for IT professionals",
      deadline: "Mar 31, 2025",
      maxBenefit: "₹1.5 Lakh",
      status: "trending",
      officialLink: "https://incometaxindia.gov.in/Pages/default.aspx"
    },
    {
      id: 3,
      name: "Digital Skills Training",
      category: "Education",
      eligibility: "92% Match",
      description: "Free certification courses for working professionals",
      deadline: "Ongoing",
      maxBenefit: "Free Training",
      status: "popular",
      officialLink: "https://digitalindia.gov.in/content/skill-development"
    }
  ];

  const recentActivity = [
    { 
      id: 1, 
      action: "Applied for PMAY scheme", 
      status: "approved", 
      date: "Sep 10",
      link: "https://pmaymis.gov.in/"
    },
    { 
      id: 2, 
      action: "Document verification completed", 
      status: "completed", 
      date: "Sep 8",
      link: "/verify"
    },
    { 
      id: 3, 
      action: "Registered for Startup India", 
      status: "pending", 
      date: "Sep 5",
      link: "https://startupindia.gov.in/"
    },
    { 
      id: 4, 
      action: "Tax benefit calculation", 
      status: "completed", 
      date: "Sep 3",
      link: "https://incometaxindia.gov.in/"
    }
  ];

  const quickStats = [
    { 
      label: "Total Schemes Available", 
      value: "500+", 
      icon: FileText, 
      color: "text-primary",
      link: "/schemes"
    },
    { 
      label: "Schemes Applied", 
      value: userProfile.registeredSchemes, 
      icon: CheckCircle, 
      color: "text-success",
      link: "/dashboard"
    },
    { 
      label: "Applications Approved", 
      value: userProfile.completedApplications, 
      icon: Star, 
      color: "text-warning",
      link: "/profile"
    },
    { 
      label: "Pending Reviews", 
      value: "2", 
      icon: Clock, 
      color: "text-secondary",
      link: "/notifications"
    }
  ];

  const getStatusIcon = (status) => {
    switch(status) {
      case "approved": case "completed": return <CheckCircle className="h-4 w-4 text-success" />;
      case "pending": return <Clock className="h-4 w-4 text-warning" />;
      default: return <AlertCircle className="h-4 w-4 text-secondary" />;
    }
  };

  const getSchemeStatusBadge = (status) => {
    switch(status) {
      case "new": return <Badge className="bg-primary text-primary-foreground">New</Badge>;
      case "trending": return <Badge className="bg-warning text-warning-foreground">Trending</Badge>;
      case "popular": return <Badge className="bg-success text-success-foreground">Popular</Badge>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                {t('dashboard.welcomeBack')}, {userProfile.name}
                <span className="text-lg">{languageInfo.flag}</span>
              </h1>
              <p className="text-muted-foreground mt-2">
                {t('dashboard.subtitle')}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" asChild>
                <Link to="/notifications">
                  <Bell className="h-4 w-4" />
                  {notifications.filter(n => n.unread).length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full text-xs w-5 h-5 flex items-center justify-center">
                      {notifications.filter(n => n.unread).length}
                    </span>
                  )}
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/profile">
                  <User className="h-4 w-4 mr-2" />
                  {t('nav.profile')}
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <Link key={index} to={stat.link}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer hover:scale-105 transition-transform">
                <CardContent className="flex items-center p-6">
                  <div className={`p-3 rounded-lg bg-accent mr-4`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* AI Recommended Schemes */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  {t('dashboard.aiRecommended')}
                </CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/schemes">
                    {t('common.viewAll')}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {recommendedSchemes.map((scheme) => (
                  <div key={scheme.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{scheme.name}</h3>
                          {getSchemeStatusBadge(scheme.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{scheme.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <CheckCircle className="h-4 w-4 text-success" />
                            {scheme.eligibility}
                          </span>
                          <span>Max Benefit: {scheme.maxBenefit}</span>
                          <span>Deadline: {scheme.deadline}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <Button size="sm" asChild>
                          <a href={scheme.officialLink} target="_blank" rel="noopener noreferrer">
                            {t('common.applyNow')}
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <Link to="/schemes">
                            {t('common.learnMore')}
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/schemes">
                    <Search className="h-4 w-4 mr-2" />
                    {t('schemes.title')}
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  {t('dashboard.recentActivity')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                         onClick={() => {
                           if (activity.link.startsWith('http')) {
                             window.open(activity.link, '_blank');
                           } else {
                             window.location.href = activity.link;
                           }
                         }}>
                      <div className="flex items-center gap-3">
                        {getStatusIcon(activity.status)}
                        <div>
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-muted-foreground">{activity.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={activity.status === "approved" || activity.status === "completed" ? "default" : "secondary"}>
                          {activity.status}
                        </Badge>
                        {activity.link.startsWith('http') && <ExternalLink className="h-3 w-3 text-muted-foreground" />}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Profile Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Age:</span>
                    <span className="text-sm font-medium">{userProfile.age} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">State:</span>
                    <span className="text-sm font-medium">{userProfile.state}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Occupation:</span>
                    <span className="text-sm font-medium">{userProfile.occupation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Income:</span>
                    <span className="text-sm font-medium">{userProfile.income}</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link to="/profile">
                    {t('profile.editProfile')}
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Recent Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {notifications.slice(0, 3).map((notification) => (
                  <div key={notification.id} className={`p-3 rounded-lg border ${notification.unread ? 'bg-accent/50' : ''}`}>
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="text-sm font-medium">{notification.title}</h4>
                      {notification.unread && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                  </div>
                ))}
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/notifications">
                    View All Notifications
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>{t('dashboard.quickActions')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/verify">
                    <FileText className="h-4 w-4 mr-2" />
                    {t('dashboard.verifyDocuments')}
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/complaints">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    {t('dashboard.fileComplaint')}
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/events">
                    <Calendar className="h-4 w-4 mr-2" />
                    {t('dashboard.findEvents')}
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/locations">
                    <MapPin className="h-4 w-4 mr-2" />
                    {t('dashboard.findLocations')}
                  </Link>
                </Button>
                
                {/* Government Website Links */}
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-3 text-muted-foreground">Official Government Portals</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <a href="https://digitalindia.gov.in" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Digital India
                      </a>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <a href="https://mygov.in" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        MyGov India
                      </a>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <a href="https://pmmodiyojana.in" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        PM Modi Yojana
                      </a>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <a href="https://india.gov.in" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        India.gov.in
                      </a>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <a href="https://uidai.gov.in" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        UIDAI (Aadhaar)
                      </a>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <a href="https://www.nsdl.co.in/services/pan.php" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        PAN Services
                      </a>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <a href="https://pmfby.gov.in" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        PM Fasal Bima
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;