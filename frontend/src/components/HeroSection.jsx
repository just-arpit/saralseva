import { Button, Card, CardContent } from "@/components/ui";
import { Search, FileCheck, MessageSquare, Calendar, Shield, Users } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-government-services.jpg";

const HeroSection = () => {
  const quickActions = [
    {
      title: "Find Schemes",
      description: "Discover schemes you are eligible for",
      icon: Search,
      color: "text-primary",
      href: "/schemes",
    },
    {
      title: "Verify Documents",
      description: "AI-powered document verification",
      icon: FileCheck,
      color: "text-success",
      href: "/verify",
    },
    {
      title: "File Complaint",
      description: "Report issues to authorities",
      icon: MessageSquare,
      color: "text-secondary",
      href: "/complaints",
    },
    {
      title: "Government Events",
      description: "Find events near you",
      icon: Calendar,
      color: "text-primary",
      href: "/events",
    },
  ];

  const stats = [
    { number: "500+", label: "Government Schemes" },
    { number: "10M+", label: "Citizens Served" },
    { number: "28", label: "States Covered" },
    { number: "24/7", label: "AI Assistant" },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-accent/20 to-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-full border px-4 py-2 text-sm bg-primary/5 border-primary/20">
                <Shield className="mr-2 h-4 w-4 text-primary" />
                Trusted by Government of India
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                <span className="text-primary">Saral Seva</span>
                <br />
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  One Platform,
                </span>
                <br />
                <span className="text-foreground">All Services</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                Access all government schemes, verify documents, file complaints, and stay updated with events.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="default" size="lg" className="text-lg px-8 py-6 h-auto" asChild>
                <Link to="/schemes">
                  <Search className="mr-2 h-5 w-5" />
                  Find My Schemes
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 h-auto" asChild>
                <Link to="/dashboard">
                  <Users className="mr-2 h-5 w-5" />
                  Learn More
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-primary">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-primary/10 rounded-2xl transform rotate-3"></div>
            <img
              src={heroImage}
              alt="Government Services Platform"
              className="relative rounded-2xl w-full h-auto object-cover"
            />
          </div>
        </div>

        <div className="mt-16 lg:mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Quick Actions</h2>
            <p className="text-lg text-muted-foreground">Get started with our most popular services</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.href}>
                <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-accent mb-4 group-hover:scale-110 transition-transform duration-300">
                      <action.icon className={`h-6 w-6 ${action.color}`} />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{action.title}</h3>
                    <p className="text-muted-foreground text-sm">{action.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
