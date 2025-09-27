import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { 
  Bot, 
  FileCheck, 
  MessageSquare, 
  MapPin, 
  Calendar, 
  Shield, 
  Bell, 
  Smartphone,
  ArrowRight 
} from "lucide-react";
import { Link } from "react-router-dom";

const ServicesSection = () => {
  const services = [
    {
      title: "AI Assistant",
      description: "24/7 chatbot for instant help with schemes, eligibility, and applications.",
      icon: Bot,
      features: ["Natural language queries", "Eligibility checks", "Application guidance", "Status tracking"],
      color: "text-primary",
      bgGradient: "from-primary/10 to-primary/5",
      href: "/dashboard", // AI Assistant will be available on dashboard
    },
    {
      title: "Document Verification",
      description: "AI-powered verification to detect fake documents and ensure authenticity.",
      icon: FileCheck,
      features: ["Instant verification", "Fraud detection", "Government database check", "Digital signatures"],
      color: "text-success",
      bgGradient: "from-success/10 to-success/5",
      href: "/verify",
    },
    {
      title: "Smart Complaints",
      description: "File complaints that automatically reach the right authorities via social media.",
      icon: MessageSquare,
      features: ["Auto-routing", "Twitter integration", "Progress tracking", "Resolution updates"],
      color: "text-secondary",
      bgGradient: "from-secondary/10 to-secondary/5",
      href: "/complaints",
    },
    {
      title: "Location Services",
      description: "Find government offices, scheme centers, and event venues near you.",
      icon: MapPin,
      features: ["Google Maps integration", "Real-time directions", "Office hours", "Contact details"],
      color: "text-primary",
      bgGradient: "from-primary/10 to-primary/5",
      href: "/locations",
    },
    {
      title: "Event Management",
      description: "Stay updated with government events, workshops, and training programs.",
      icon: Calendar,
      features: ["Event calendar", "Registration assistance", "Reminders", "Check-in system"],
      color: "text-success",
      bgGradient: "from-success/10 to-success/5",
      href: "/events",
    },
    {
      title: "Security & Privacy",
      description: "End-to-end encryption and secure handling of all your personal data.",
      icon: Shield,
      features: ["Data encryption", "Secure login", "Privacy controls", "Audit trails"],
      color: "text-secondary",
      bgGradient: "from-secondary/10 to-secondary/5",
      href: "/profile", // Privacy settings will be in profile
    },
  ];

  const keyFeatures = [
    {
      icon: Smartphone,
      title: "Mobile First",
      description: "Optimized for smartphones with offline capabilities for rural areas.",
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description: "Personalized alerts for new schemes, deadlines, and updates.",
    },
    {
      icon: Shield,
      title: "Government Verified",
      description: "Official partnership with Government of India for authentic data.",
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center rounded-full border px-4 py-2 text-sm bg-secondary/5 border-secondary/20 mb-4">
            <Bot className="mr-2 h-4 w-4 text-secondary" />
            AI-Powered Services
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Comprehensive Digital Services
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            From AI assistance to document verification, our platform provides all the tools you need to interact with government services efficiently and securely.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <Card key={index} className="group hover:shadow-medium transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-br ${service.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              <CardHeader className="relative">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-accent to-accent/50 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className={`h-6 w-6 ${service.color}`} />
                </div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-muted-foreground mb-4">{service.description}</p>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Key Features:</p>
                  <ul className="space-y-1">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-success"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button variant="ghost" className="w-full mt-4 group-hover:text-primary" asChild>
                  <Link to={service.href}>
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Key Features Banner */}
        <div className="bg-gradient-to-r from-primary/5 via-secondary/5 to-success/5 rounded-2xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">
              Why Choose Saral Seva Pro?
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built with cutting-edge technology and deep understanding of citizen needs, we're revolutionizing how Indians access government services.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {keyFeatures.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button variant="hero" size="lg" asChild>
              <Link to="/dashboard">
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;