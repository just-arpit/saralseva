import { useState } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui";
import { 
  Bell, 
  BellRing,
  CheckCircle,
  AlertCircle,
  Info,
  Star,
  Calendar,
  FileText,
  Users,
  TrendingUp,
  Filter,
  MoreVertical,
  Eye,
  EyeOff,
  Trash2,
  BookmarkPlus,
  Share,
  ExternalLink,
  Settings,
  Volume2,
  VolumeX,
  Clock,
  MapPin
} from "lucide-react";

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Scheme Available - PM Vishwakarma",
      message: "A new scheme for traditional craftsmen and artisans is now available. You may be eligible based on your profile.",
      type: "scheme",
      category: "New Scheme",
      priority: "high",
      isRead: false,
      timestamp: "2 hours ago",
      date: "2024-09-16T14:30:00",
      actionText: "Check Eligibility",
      actionUrl: "/schemes",
      tags: ["craftsmen", "artisan", "new"],
      sourceIcon: Star,
      sourceColor: "text-primary"
    },
    {
      id: 2,
      title: "Application Status Update",
      message: "Your PM-KISAN application (Ref: PMK123456789) has been approved. First installment will be credited within 7 working days.",
      type: "status",
      category: "Application Update",
      priority: "high",
      isRead: false,
      timestamp: "1 day ago",
      date: "2024-09-15T11:15:00",
      actionText: "View Details",
      actionUrl: "/dashboard",
      tags: ["pm-kisan", "approved", "payment"],
      sourceIcon: CheckCircle,
      sourceColor: "text-success"
    },
    {
      id: 3,
      title: "Document Verification Required",
      message: "Additional documents needed for your PMAY application. Please upload the required documents within 15 days.",
      type: "action",
      category: "Action Required",
      priority: "medium",
      isRead: true,
      timestamp: "2 days ago",
      date: "2024-09-14T16:45:00",
      actionText: "Upload Documents",
      actionUrl: "/verify",
      tags: ["pmay", "documents", "verification"],
      sourceIcon: AlertCircle,
      sourceColor: "text-warning"
    },
    {
      id: 4,
      title: "Upcoming Event - Digital Skills Workshop",
      message: "Reminder: Digital Skills Workshop starts tomorrow at 10:00 AM at Pragati Maidan. Don't forget to bring your ID proof.",
      type: "event",
      category: "Event Reminder",
      priority: "medium",
      isRead: true,
      timestamp: "3 days ago",
      date: "2024-09-13T18:20:00",
      actionText: "View Event",
      actionUrl: "/events",
      tags: ["workshop", "digital skills", "reminder"],
      sourceIcon: Calendar,
      sourceColor: "text-secondary"
    },
    {
      id: 5,
      title: "Government Office Hours Extended",
      message: "District Collectorate Delhi will have extended hours (9 AM - 6 PM) this week for faster service delivery.",
      type: "announcement",
      category: "Service Update",
      priority: "low",
      isRead: true,
      timestamp: "5 days ago",
      date: "2024-09-11T09:30:00",
      actionText: "Find Offices",
      actionUrl: "/locations",
      tags: ["office hours", "service", "delhi"],
      sourceIcon: Info,
      sourceColor: "text-info"
    },
    {
      id: 6,
      title: "Complaint Status Update",
      message: "Your complaint about road conditions (ID: CMP789012) has been forwarded to Municipal Corporation. Expected resolution: 7-10 days.",
      type: "complaint",
      category: "Complaint Update",
      priority: "medium",
      isRead: true,
      timestamp: "1 week ago",
      date: "2024-09-09T14:10:00",
      actionText: "Track Complaint",
      actionUrl: "/complaints",
      tags: ["complaint", "road", "municipal"],
      sourceIcon: FileText,
      sourceColor: "text-primary"
    },
    {
      id: 7,
      title: "Profile Completion Reminder",
      message: "Complete your profile to get personalized scheme recommendations. Add your occupation and income details.",
      type: "profile",
      category: "Profile Update",
      priority: "low",
      isRead: true,
      timestamp: "1 week ago",
      date: "2024-09-09T10:00:00",
      actionText: "Update Profile",
      actionUrl: "/profile",
      tags: ["profile", "completion", "recommendations"],
      sourceIcon: Users,
      sourceColor: "text-secondary"
    }
  ]);

  const [filter, setFilter] = useState("all");
  const [showSettings, setShowSettings] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    schemes: true,
    applications: true,
    events: true,
    announcements: true,
    complaints: true,
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true
  });

  const filterOptions = [
    { id: "all", name: "All Notifications", count: notifications.length },
    { id: "unread", name: "Unread", count: notifications.filter(n => !n.isRead).length },
    { id: "scheme", name: "Schemes", count: notifications.filter(n => n.type === "scheme").length },
    { id: "status", name: "Status Updates", count: notifications.filter(n => n.type === "status").length },
    { id: "action", name: "Action Required", count: notifications.filter(n => n.type === "action").length },
    { id: "event", name: "Events", count: notifications.filter(n => n.type === "event").length }
  ];

  const priorityColors = {
    high: "border-l-destructive bg-destructive/5",
    medium: "border-l-warning bg-warning/5",
    low: "border-l-muted bg-muted/20"
  };

  const priorityBadges = {
    high: <Badge className="bg-destructive text-destructive-foreground">High Priority</Badge>,
    medium: <Badge className="bg-warning text-warning-foreground">Medium</Badge>,
    low: <Badge variant="outline">Low</Badge>
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === "all") return true;
    if (filter === "unread") return !notification.isRead;
    return notification.type === filter;
  });

  const handleMarkAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const handleDelete = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }
    // Navigate to the action URL
    window.location.href = notification.actionUrl;
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
              <Bell className="h-8 w-8 text-primary" />
              Notifications
              {unreadCount > 0 && (
                <Badge className="bg-destructive text-destructive-foreground">
                  {unreadCount} new
                </Badge>
              )}
            </h1>
            <p className="text-muted-foreground">
              Stay updated with scheme announcements, application status, and government news
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            {unreadCount > 0 && (
              <Button variant="government" onClick={handleMarkAllAsRead}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark All Read
              </Button>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filter Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {filterOptions.map((option) => (
                  <Button
                    key={option.id}
                    variant={filter === option.id ? "default" : "ghost"}
                    className="w-full justify-between"
                    onClick={() => setFilter(option.id)}
                  >
                    <span>{option.name}</span>
                    <Badge variant="secondary">{option.count}</Badge>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Notifications</span>
                    <span className="font-semibold">{notifications.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Unread</span>
                    <span className="font-semibold text-destructive">{unreadCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">This Week</span>
                    <span className="font-semibold">
                      {notifications.filter(n => {
                        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                        return new Date(n.date) > weekAgo;
                      }).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">High Priority</span>
                    <span className="font-semibold text-warning">
                      {notifications.filter(n => n.priority === "high").length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-4">
            {/* Settings Panel */}
            {showSettings && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Notification Types</h4>
                      <div className="space-y-3">
                        {Object.entries({
                          schemes: "New Schemes & Updates",
                          applications: "Application Status",
                          events: "Events & Workshops", 
                          announcements: "Government Announcements",
                          complaints: "Complaint Updates"
                        }).map(([key, label]) => (
                          <label key={key} className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notificationSettings[key]}
                              onChange={(e) => setNotificationSettings(prev => ({
                                ...prev,
                                [key]: e.target.checked
                              }))}
                              className="rounded border-input"
                            />
                            <span className="text-sm">{label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3">Delivery Methods</h4>
                      <div className="space-y-3">
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings.pushNotifications}
                            onChange={(e) => setNotificationSettings(prev => ({
                              ...prev,
                              pushNotifications: e.target.checked
                            }))}
                            className="rounded border-input"
                          />
                          <Bell className="h-4 w-4" />
                          <span className="text-sm">Push Notifications</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings.emailNotifications}
                            onChange={(e) => setNotificationSettings(prev => ({
                              ...prev,
                              emailNotifications: e.target.checked
                            }))}
                            className="rounded border-input"
                          />
                          <span className="text-sm">Email Notifications</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings.smsNotifications}
                            onChange={(e) => setNotificationSettings(prev => ({
                              ...prev,
                              smsNotifications: e.target.checked
                            }))}
                            className="rounded border-input"
                          />
                          <span className="text-sm">SMS Notifications</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notifications List */}
            {filteredNotifications.length > 0 ? (
              <div className="space-y-4">
                {filteredNotifications.map((notification) => {
                  const SourceIcon = notification.sourceIcon;
                  return (
                    <Card
                      key={notification.id}
                      className={`cursor-pointer transition-all hover:shadow-md border-l-4 ${
                        priorityColors[notification.priority]
                      } ${!notification.isRead ? 'bg-accent/30' : ''}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <div className={`p-2 rounded-full bg-background ${notification.sourceColor}`}>
                              <SourceIcon className="h-5 w-5" />
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className={`font-semibold ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                                  {notification.title}
                                </h3>
                                {!notification.isRead && (
                                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                                )}
                                <Badge variant="outline" className="text-xs">
                                  {notification.category}
                                </Badge>
                                {priorityBadges[notification.priority]}
                              </div>
                              
                              <p className="text-muted-foreground mb-3 leading-relaxed">
                                {notification.message}
                              </p>
                              
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {notification.timestamp}
                                </div>
                                {notification.tags && (
                                  <div className="flex items-center gap-1">
                                    {notification.tags.map((tag, index) => (
                                      <Badge key={index} variant="outline" className="text-xs">
                                        #{tag}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Button size="sm" variant="government">
                                  {notification.actionText}
                                </Button>
                                {!notification.isRead && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleMarkAsRead(notification.id);
                                    }}
                                  >
                                    <Eye className="h-4 w-4 mr-1" />
                                    Mark Read
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle bookmark
                              }}
                            >
                              <BookmarkPlus className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle share
                              }}
                            >
                              <Share className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(notification.id);
                              }}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No notifications found</h3>
                  <p className="text-muted-foreground">
                    {filter === "all" 
                      ? "You're all caught up! Check back later for updates."
                      : `No ${filter} notifications at the moment.`
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;