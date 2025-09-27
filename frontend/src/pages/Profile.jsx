import { useState } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { 
  User,
  Settings,
  FileText,
  Shield,
  Bell,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Edit3,
  Save,
  X,
  Upload,
  Download,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Info,
  Camera,
  Lock,
  Trash2,
  Plus,
  ExternalLink,
  Star,
  Award,
  Target,
  Activity,
  BarChart3,
  Clock,
  Globe,
  Smartphone,
  Laptop
} from "lucide-react";

const Profile = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [showSensitiveInfo, setShowSensitiveInfo] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: user ? `${user.firstName} ${user.lastName}` : "Guest User",
    email: user?.email || "user@example.com",
    phone: user?.phone || "+91 98765 43210",
    dateOfBirth: "1985-03-15",
    gender: "Male",
    address: {
      street: "123, Sector 15",
      area: "Dwarka",
      city: "New Delhi",
      state: "Delhi",
      pincode: "110075"
    },
    occupation: "Software Engineer",
    income: "₹8,00,000 annually",
    category: "General",
    profileImage: null
  });

  const [governmentIds, setGovernmentIds] = useState([
    {
      id: 1,
      type: "Aadhaar Card",
      number: "****-****-1234",
      fullNumber: "1234-5678-9012-1234",
      verified: true,
      expiryDate: null,
      issueDate: "2020-01-15",
      status: "verified"
    },
    {
      id: 2,
      type: "PAN Card",
      number: "ABCDE****F",
      fullNumber: "ABCDE1234F",
      verified: true,
      expiryDate: null,
      issueDate: "2018-06-20",
      status: "verified"
    },
    {
      id: 3,
      type: "Driving License",
      number: "DL-07********",
      fullNumber: "DL-07-20180012345",
      verified: false,
      expiryDate: "2028-03-15",
      issueDate: "2018-03-15",
      status: "pending"
    },
    {
      id: 4,
      type: "Voter ID",
      number: "ABC****123",
      fullNumber: "ABC1234567123",
      verified: true,
      expiryDate: null,
      issueDate: "2019-10-05",
      status: "verified"
    }
  ]);

  const [applications, setApplications] = useState([
    {
      id: "PMK123456789",
      scheme: "PM-KISAN",
      status: "approved",
      appliedDate: "2024-08-15",
      amount: "₹6,000",
      nextInstallment: "2024-12-15"
    },
    {
      id: "PMAY987654321",
      scheme: "PMAY-Urban",
      status: "under_review",
      appliedDate: "2024-09-01",
      amount: "₹2,50,000",
      estimatedApproval: "2024-10-15"
    },
    {
      id: "APL456789123",
      scheme: "APL Ration Card",
      status: "approved",
      appliedDate: "2024-07-20",
      cardNumber: "DL-02-123-456-789",
      validUntil: "2029-07-20"
    }
  ]);

  const [preferences, setPreferences] = useState({
    language: "en",
    notifications: {
      email: true,
      sms: false,
      push: true,
      schemes: true,
      applications: true,
      events: true
    },
    privacy: {
      profileVisibility: "government_only",
      dataSharing: false,
      analytics: true
    },
    accessibility: {
      fontSize: "medium",
      highContrast: false,
      screenReader: false,
      voiceAssistant: false
    }
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    loginAlerts: true,
    dataEncryption: true,
    sessionTimeout: 30,
    trustedDevices: [
      { id: 1, name: "iPhone 13", lastUsed: "2024-09-16", location: "New Delhi" },
      { id: 2, name: "MacBook Pro", lastUsed: "2024-09-15", location: "New Delhi" }
    ]
  });

  const tabItems = [
    { id: "profile", name: "Personal Info", icon: User },
    { id: "documents", name: "Documents", icon: FileText },
    { id: "applications", name: "Applications", icon: CreditCard },
    { id: "preferences", name: "Preferences", icon: Settings },
    { id: "security", name: "Security", icon: Shield },
    { id: "activity", name: "Activity", icon: Activity }
  ];

  const handleSaveProfile = () => {
    setIsEditing(false);
    // Save profile data to backend
  };

  const handleFileUpload = (type, file) => {
    // Handle file upload for documents/profile image
    console.log(`Uploading ${type}:`, file);
  };

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
          <Button
            variant={isEditing ? "ghost" : "outline"}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? (
              <>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </>
            ) : (
              <>
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </>
            )}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-6">
            <div className="relative">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
                {profileData.profileImage ? (
                  <img
                    src={profileData.profileImage}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-12 w-12 text-muted-foreground" />
                )}
              </div>
              {isEditing && (
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8"
                  onClick={() => document.getElementById('profile-image').click()}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              )}
              <input
                id="profile-image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload('profile', e.target.files[0])}
              />
            </div>
            
            <div className="flex-1 grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full mt-1 p-2 border rounded-md"
                  />
                ) : (
                  <p className="font-semibold">{profileData.name}</p>
                )}
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full mt-1 p-2 border rounded-md"
                  />
                ) : (
                  <p className="font-semibold">{profileData.email}</p>
                )}
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full mt-1 p-2 border rounded-md"
                  />
                ) : (
                  <p className="font-semibold">{profileData.phone}</p>
                )}
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={(e) => setProfileData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    className="w-full mt-1 p-2 border rounded-md"
                  />
                ) : (
                  <p className="font-semibold">{new Date(profileData.dateOfBirth).toLocaleDateString()}</p>
                )}
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Occupation</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.occupation}
                    onChange={(e) => setProfileData(prev => ({ ...prev, occupation: e.target.value }))}
                    className="w-full mt-1 p-2 border rounded-md"
                  />
                ) : (
                  <p className="font-semibold">{profileData.occupation}</p>
                )}
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Annual Income</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.income}
                    onChange={(e) => setProfileData(prev => ({ ...prev, income: e.target.value }))}
                    className="w-full mt-1 p-2 border rounded-md"
                  />
                ) : (
                  <p className="font-semibold">{profileData.income}</p>
                )}
              </div>
            </div>
          </div>
          
          {isEditing && (
            <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button variant="government" onClick={handleSaveProfile}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Address Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Address
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Street Address</label>
              <p className="font-semibold">{profileData.address.street}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Area</label>
              <p className="font-semibold">{profileData.address.area}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">City</label>
              <p className="font-semibold">{profileData.address.city}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">State</label>
              <p className="font-semibold">{profileData.address.state}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">PIN Code</label>
              <p className="font-semibold">{profileData.address.pincode}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Government Documents
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSensitiveInfo(!showSensitiveInfo)}
            >
              {showSensitiveInfo ? (
                <>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Hide Details
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Show Details
                </>
              )}
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Document
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {governmentIds.map((doc) => (
              <div key={doc.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold">{doc.type}</h4>
                      {doc.verified ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-orange-600">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Number:</span>
                        <p className="font-medium">
                          {showSensitiveInfo ? doc.fullNumber : doc.number}
                        </p>
                      </div>
                      {doc.issueDate && (
                        <div>
                          <span className="text-muted-foreground">Issue Date:</span>
                          <p className="font-medium">{new Date(doc.issueDate).toLocaleDateString()}</p>
                        </div>
                      )}
                      {doc.expiryDate && (
                        <div>
                          <span className="text-muted-foreground">Expiry Date:</span>
                          <p className="font-medium">{new Date(doc.expiryDate).toLocaleDateString()}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderApplications = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            My Applications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{app.scheme}</h4>
                    <p className="text-sm text-muted-foreground">Application ID: {app.id}</p>
                  </div>
                  <Badge
                    className={
                      app.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : app.status === "under_review"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }
                  >
                    {app.status.replace("_", " ").toUpperCase()}
                  </Badge>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Applied Date:</span>
                    <p className="font-medium">{new Date(app.appliedDate).toLocaleDateString()}</p>
                  </div>
                  {app.amount && (
                    <div>
                      <span className="text-muted-foreground">Amount:</span>
                      <p className="font-medium">{app.amount}</p>
                    </div>
                  )}
                  {app.nextInstallment && (
                    <div>
                      <span className="text-muted-foreground">Next Installment:</span>
                      <p className="font-medium">{new Date(app.nextInstallment).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2 mt-3">
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                  <Button size="sm" variant="outline">
                    Download Certificate
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPreferences = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Language & Region
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Preferred Language</label>
              <select
                value={preferences.language}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  language: e.target.value
                }))}
                className="w-full mt-1 p-2 border rounded-md"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="bn">বাংলা (Bengali)</option>
                <option value="ta">தமிழ் (Tamil)</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span>Email Notifications</span>
                <input
                  type="checkbox"
                  checked={preferences.notifications.email}
                  onChange={(e) => setPreferences(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, email: e.target.checked }
                  }))}
                  className="rounded"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span>SMS Notifications</span>
                <input
                  type="checkbox"
                  checked={preferences.notifications.sms}
                  onChange={(e) => setPreferences(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, sms: e.target.checked }
                  }))}
                  className="rounded"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span>Push Notifications</span>
                <input
                  type="checkbox"
                  checked={preferences.notifications.push}
                  onChange={(e) => setPreferences(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, push: e.target.checked }
                  }))}
                  className="rounded"
                />
              </label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Security Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <span>Two-Factor Authentication</span>
              <input
                type="checkbox"
                checked={securitySettings.twoFactorAuth}
                onChange={(e) => setSecuritySettings(prev => ({
                  ...prev,
                  twoFactorAuth: e.target.checked
                }))}
                className="rounded"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span>Login Alerts</span>
              <input
                type="checkbox"
                checked={securitySettings.loginAlerts}
                onChange={(e) => setSecuritySettings(prev => ({
                  ...prev,
                  loginAlerts: e.target.checked
                }))}
                className="rounded"
              />
            </label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Trusted Devices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {securitySettings.trustedDevices.map((device) => (
              <div key={device.id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <p className="font-medium">{device.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Last used: {device.lastUsed} • {device.location}
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderActivity = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: "Logged in", time: "2 hours ago", device: "iPhone 13" },
              { action: "Applied for PM-KISAN scheme", time: "1 day ago", device: "MacBook Pro" },
              { action: "Updated profile information", time: "3 days ago", device: "iPhone 13" },
              { action: "Downloaded Aadhaar card", time: "1 week ago", device: "MacBook Pro" }
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border rounded">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">
                    {activity.time} • {activity.device}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return renderPersonalInfo();
      case "documents":
        return renderDocuments();
      case "applications":
        return renderApplications();
      case "preferences":
        return renderPreferences();
      case "security":
        return renderSecurity();
      case "activity":
        return renderActivity();
      default:
        return renderPersonalInfo();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
              <User className="h-8 w-8 text-primary" />
              {t('profile.title')}
            </h1>
            <p className="text-muted-foreground">
              Manage your personal information, documents, and account settings
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Profile Complete
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {tabItems.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-accent transition-colors ${
                          activeTab === tab.id
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {tab.name}
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Profile Completion</span>
                    <span className="font-semibold text-green-600">95%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Verified Documents</span>
                    <span className="font-semibold">{governmentIds.filter(d => d.verified).length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Applications</span>
                    <span className="font-semibold">{applications.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Last Login</span>
                    <span className="font-semibold text-sm">Today</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;