import { Button } from "@/components/ui";
import { ArrowLeft, Shield, Globe, Users } from "lucide-react";
import { Link } from "react-router-dom";

const AuthLayout = ({ children, title, subtitle, showBackButton = false, backgroundPattern = "default" }) => {
  const backgroundPatterns = {
    default: "bg-gradient-to-br from-background via-accent/20 to-muted/30",
    government: "bg-gradient-to-br from-primary/5 via-secondary/5 to-success/5",
    secure: "bg-gradient-to-br from-primary/10 via-accent/20 to-primary/5"
  };

  const features = [
    {
      icon: Shield,
      title: "Secure & Trusted",
      description: "Government-grade security with end-to-end encryption"
    },
    {
      icon: Globe,
      title: "Unified Access",
      description: "One platform for all government services across India"
    },
    {
      icon: Users,
      title: "Citizen-Centric",
      description: "Designed for every Indian citizen's convenience"
    }
  ];

  return (
    <div className={`min-h-screen ${backgroundPatterns[backgroundPattern]} relative overflow-hidden`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">SS</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl text-primary">Saral Seva</span>
              <span className="text-xs text-muted-foreground">Government Services Portal</span>
            </div>
          </Link>

          {/* Back Button */}
          {showBackButton && (
            <Button variant="outline" asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Info */}
          <div className="hidden lg:block space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-4">
                {title || "Welcome to Digital India"}
              </h1>
              <p className="text-lg text-muted-foreground">
                {subtitle || "Access all government services from a single, secure platform designed for every Indian citizen."}
              </p>
            </div>

            {/* Features */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Indicators */}
            <div className="bg-accent/30 p-6 rounded-lg border">
              <h4 className="font-semibold mb-3">Trusted by</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-2xl font-bold text-primary">50M+</div>
                  <div className="text-muted-foreground">Citizens Registered</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">500+</div>
                  <div className="text-muted-foreground">Government Schemes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">28</div>
                  <div className="text-muted-foreground">States & UTs</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">100%</div>
                  <div className="text-muted-foreground">Secure & Encrypted</div>
                </div>
              </div>
            </div>

            {/* Government Endorsement */}
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-4 rounded-lg border-l-4 border-primary">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-primary" />
                <span className="font-semibold text-sm">Government Verified</span>
              </div>
              <p className="text-xs text-muted-foreground">
                This platform is officially recognized and secured by the Government of India 
                for authentic access to all government services and schemes.
              </p>
            </div>
          </div>

          {/* Right Side - Auth Form */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            {children}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-auto p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div>
              © 2024 Saral Seva. A Government of India Initiative.
            </div>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link to="/help" className="hover:text-primary transition-colors">
                Help & Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;