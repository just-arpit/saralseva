import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui";
import { useLanguage } from "../contexts/LanguageContext";
import { 
  Upload, 
  FileCheck, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Camera,
  Scan,
  Download,
  Eye,
  Clock,
  Database,
  Lock,
  Zap,
  RefreshCw,
  FileText,
  Image as ImageIcon,
  File,
  ExternalLink,
  Home,
  BookmarkPlus
} from "lucide-react";

const DocumentVerification = () => {
  const { t } = useLanguage();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [verificationResults, setVerificationResults] = useState([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const supportedDocuments = [
    { 
      type: "Aadhaar Card", 
      icon: FileText, 
      description: "12-digit unique identity", 
      formats: ["PDF", "JPG", "PNG"],
      verifyLink: "https://resident.uidai.gov.in/verify-email-mobile",
      officialLink: "https://uidai.gov.in/"
    },
    { 
      type: "PAN Card", 
      icon: FileText, 
      description: "Permanent Account Number", 
      formats: ["PDF", "JPG", "PNG"],
      verifyLink: "https://www.incometax.gov.in/iec/foportal/help/individual/return-preparationcheck-pan-aadhaar-linking-status",
      officialLink: "https://www.incometax.gov.in/"
    },
    { 
      type: "Voter ID", 
      icon: FileText, 
      description: "Electoral Photo Identity Card", 
      formats: ["PDF", "JPG", "PNG"],
      verifyLink: "https://electoralsearch.in/",
      officialLink: "https://eci.gov.in/"
    },
    { 
      type: "Driving License", 
      icon: FileText, 
      description: "Motor Vehicle License", 
      formats: ["PDF", "JPG", "PNG"],
      verifyLink: "https://parivahan.gov.in/rcdlstatus/",
      officialLink: "https://parivahan.gov.in/"
    },
    { 
      type: "Passport", 
      icon: FileText, 
      description: "Travel Document", 
      formats: ["PDF", "JPG", "PNG"],
      verifyLink: "https://passportstatus.gov.in/",
      officialLink: "https://www.passportindia.gov.in/"
    },
    { 
      type: "Ration Card", 
      icon: FileText, 
      description: "Food Security Card", 
      formats: ["PDF", "JPG", "PNG"],
      verifyLink: "https://nfsa.gov.in/portal/ration_card_details",
      officialLink: "https://nfsa.gov.in/"
    },
    { 
      type: "Bank Passbook", 
      icon: FileText, 
      description: "Account Statement", 
      formats: ["PDF", "JPG", "PNG"],
      verifyLink: "https://rbi.org.in/Scripts/bs_viewcontent.aspx?Id=2009",
      officialLink: "https://rbi.org.in/"
    },
    { 
      type: "Income Certificate", 
      icon: FileText, 
      description: "Income Proof Document", 
      formats: ["PDF", "JPG", "PNG"],
      verifyLink: "https://serviceonline.gov.in/",
      officialLink: "https://digitalindia.gov.in/"
    }
  ];

  const verificationFeatures = [
    {
      icon: Shield,
      title: "AI-Powered Detection",
      description: "Advanced machine learning algorithms detect tampering, forgery, and fake documents"
    },
    {
      icon: Database,
      title: "Government Database Check",
      description: "Cross-verification with official government databases for authenticity"
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Get verification results within seconds of upload"
    },
    {
      icon: Lock,
      title: "Secure Processing",
      description: "End-to-end encryption ensures your documents remain private"
    }
  ];

  const recentVerifications = [
    {
      id: 1,
      document: "Aadhaar Card",
      status: "verified",
      confidence: 98,
      timestamp: "2 hours ago",
      details: "Document verified successfully against UIDAI database"
    },
    {
      id: 2,
      document: "PAN Card",
      status: "verified",
      confidence: 95,
      timestamp: "1 day ago",
      details: "Valid PAN format and database match confirmed"
    },
    {
      id: 3,
      document: "Driving License",
      status: "warning",
      confidence: 78,
      timestamp: "2 days ago",
      details: "Document appears modified, please verify with original"
    },
    {
      id: 4,
      document: "Voter ID",
      status: "failed",
      confidence: 23,
      timestamp: "3 days ago",
      details: "Document appears to be forged or heavily tampered"
    }
  ];

  const handleFileUpload = (files) => {
    const newFiles = Array.from(files).map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
      status: 'uploaded'
    }));
    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const simulateVerification = (fileId) => {
    setIsVerifying(true);
    
    // Simulate AI verification process
    setTimeout(() => {
      const mockResults = [
        { status: 'verified', confidence: 98, message: 'Document verified successfully' },
        { status: 'verified', confidence: 95, message: 'Document authentic with minor quality issues' },
        { status: 'warning', confidence: 78, message: 'Document appears modified, manual review recommended' },
        { status: 'failed', confidence: 23, message: 'Document appears to be forged' }
      ];
      
      const result = mockResults[Math.floor(Math.random() * mockResults.length)];
      
      setVerificationResults(prev => [...prev, {
        fileId,
        ...result,
        timestamp: new Date().toLocaleString(),
        details: {
          tamperingCheck: result.status === 'verified' ? 'Passed' : 'Failed',
          formatValidation: 'Passed',
          databaseMatch: result.status === 'verified' ? 'Confirmed' : 'Not Found',
          qualityScore: result.confidence
        }
      }]);
      
      setUploadedFiles(prev => 
        prev.map(file => 
          file.id === fileId 
            ? { ...file, status: 'verified', result: result.status }
            : file
        )
      );
      
      setIsVerifying(false);
    }, 3000);
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'verified': return <CheckCircle className="h-5 w-5 text-success" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-warning" />;
      case 'failed': return <XCircle className="h-5 w-5 text-destructive" />;
      default: return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status, confidence) => {
    switch(status) {
      case 'verified': 
        return <Badge className="bg-success text-success-foreground">Verified ({confidence}%)</Badge>;
      case 'warning': 
        return <Badge className="bg-warning text-warning-foreground">Warning ({confidence}%)</Badge>;
      case 'failed': 
        return <Badge className="bg-destructive text-destructive-foreground">Failed ({confidence}%)</Badge>;
      default: 
        return <Badge variant="secondary">Processing</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{t('verify.title')}</h1>
          <p className="text-muted-foreground">
            {t('verify.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Verification Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upload Area */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-primary" />
                  {t('verify.uploadDocuments')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 rounded-full bg-primary/10">
                      <Upload className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{t('verify.dragDrop')}</h3>
                      <p className="text-muted-foreground mb-4">
                        {t('verify.supportedFormats')}
                      </p>
                      <div className="flex gap-2 justify-center">
                        <Button>
                          <Upload className="h-4 w-4 mr-2" />
                          {t('verify.chooseFiles')}
                          <input 
                            type="file" 
                            multiple 
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e) => handleFileUpload(e.target.files)}
                          />
                        </Button>
                        <Button variant="outline">
                          <Camera className="h-4 w-4 mr-2" />
                          {t('verify.takePhoto')}
                        </Button>
                        <Button variant="outline">
                          <Scan className="h-4 w-4 mr-2" />
                          {t('verify.scanDocument')}
                        </Button>
                      </div>
                      <div className="mt-4 text-xs text-muted-foreground">
                        <p>Supported formats: PDF, JPG, PNG • Max size: 10MB per file</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Uploaded Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {uploadedFiles.map((file) => {
                      const result = verificationResults.find(r => r.fileId === file.id);
                      return (
                        <div key={file.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="p-2 rounded-lg bg-accent">
                              {file.type.includes('image') ? <ImageIcon className="h-6 w-6" /> : <File className="h-6 w-6" />}
                            </div>
                            <div>
                              <h4 className="font-medium">{file.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            {result ? (
                              <div className="text-right">
                                {getStatusBadge(result.status, result.confidence)}
                                <p className="text-xs text-muted-foreground mt-1">{result.timestamp}</p>
                              </div>
                            ) : (
                              <div className="text-right">
                                {file.status === 'uploaded' && (
                                  <Button 
                                    size="sm" 
                                    onClick={() => simulateVerification(file.id)}
                                    disabled={isVerifying}
                                  >
                                    {isVerifying ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <FileCheck className="h-4 w-4 mr-2" />}
                                    Verify
                                  </Button>
                                )}
                              </div>
                            )}
                            <Button variant="outline" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" asChild>
                              <Link to="/profile">
                                <BookmarkPlus className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Verification Results */}
            {verificationResults.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileCheck className="h-5 w-5 text-primary" />
                    Verification Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {verificationResults.map((result, index) => {
                      const file = uploadedFiles.find(f => f.id === result.fileId);
                      return (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              {getStatusIcon(result.status)}
                              <div>
                                <h4 className="font-medium">{file?.name}</h4>
                                <p className="text-sm text-muted-foreground">{result.message}</p>
                              </div>
                            </div>
                            {getStatusBadge(result.status, result.confidence)}
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Tampering Check:</span>
                              <span className={`ml-2 font-medium ${result.details.tamperingCheck === 'Passed' ? 'text-success' : 'text-destructive'}`}>
                                {result.details.tamperingCheck}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Format Validation:</span>
                              <span className="ml-2 font-medium text-success">{result.details.formatValidation}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Database Match:</span>
                              <span className={`ml-2 font-medium ${result.details.databaseMatch === 'Confirmed' ? 'text-success' : 'text-destructive'}`}>
                                {result.details.databaseMatch}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Quality Score:</span>
                              <span className="ml-2 font-medium">{result.details.qualityScore}%</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Verification Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Verification Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {verificationFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{feature.title}</h4>
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Supported Documents */}
            <Card>
              <CardHeader>
                <CardTitle>Supported Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  {supportedDocuments.map((doc, index) => (
                    <div key={index} className="p-3 rounded-lg border hover:bg-accent/50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <doc.icon className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <span className="text-sm font-medium">{doc.type}</span>
                            <p className="text-xs text-muted-foreground">{doc.description}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="outline" asChild>
                          <a href={doc.verifyLink} target="_blank" rel="noopener noreferrer">
                            <FileCheck className="h-3 w-3 mr-1" />
                            Verify Online
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </Button>
                        <Button size="sm" variant="ghost" asChild>
                          <a href={doc.officialLink} target="_blank" rel="noopener noreferrer">
                            Official Site
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Verifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Recent Verifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentVerifications.map((verification) => (
                    <div key={verification.id} className="flex items-start gap-3 p-3 rounded-lg border">
                      {getStatusIcon(verification.status)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{verification.document}</span>
                          <span className="text-xs text-muted-foreground">{verification.timestamp}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{verification.details}</p>
                        <div className="mt-1">
                          {getStatusBadge(verification.status, verification.confidence)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link to="/profile">
                      <Eye className="h-4 w-4 mr-2" />
                      View All History
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Government Document Portals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Official Document Portals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <a href="https://digitallocker.gov.in/" target="_blank" rel="noopener noreferrer">
                    <Database className="h-4 w-4 mr-2" />
                    DigiLocker - Digital Documents
                    <ExternalLink className="h-4 w-4 ml-auto" />
                  </a>
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <a href="https://umang.gov.in/" target="_blank" rel="noopener noreferrer">
                    <FileText className="h-4 w-4 mr-2" />
                    UMANG - Unified Mobile App
                    <ExternalLink className="h-4 w-4 ml-auto" />
                  </a>
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <a href="https://serviceonline.gov.in/" target="_blank" rel="noopener noreferrer">
                    <FileCheck className="h-4 w-4 mr-2" />
                    Service Online Portal
                    <ExternalLink className="h-4 w-4 ml-auto" />
                  </a>
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <a href="https://india.gov.in/topics/governance/e-governance" target="_blank" rel="noopener noreferrer">
                    <Lock className="h-4 w-4 mr-2" />
                    e-Governance Portal
                    <ExternalLink className="h-4 w-4 ml-auto" />
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
                    <FileText className="h-4 w-4 mr-2" />
                    My Documents
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/schemes">
                    <Database className="h-4 w-4 mr-2" />
                    Browse Schemes
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

export default DocumentVerification;