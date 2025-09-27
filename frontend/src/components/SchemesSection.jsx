import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Badge } from "@/components/ui";
import { ArrowRight, Users, Briefcase, GraduationCap, Heart, Sprout, Home } from "lucide-react";
import { Link } from "react-router-dom";
import schemesImage from "@/assets/schemes-icons.jpg";

const SchemesSection = () => {
  const schemeCategories = [
    {
      title: "Employment Schemes",
      icon: Briefcase,
      count: "45+ Schemes",
      description: "MGNREGA, PM-KISAN, Startup India, and more employment opportunities.",
      schemes: ["MGNREGA", "PM-KISAN", "Startup India", "MUDRA Loan"],
      color: "bg-primary/10 text-primary",
    },
    {
      title: "Education & Skills",
      icon: GraduationCap,
      count: "35+ Schemes",
      description: "Scholarships, skill development, and educational support programs.",
      schemes: ["PM Scholarship", "Skill India", "Digital India", "Beti Bachao"],
      color: "bg-secondary/10 text-secondary",
    },
    {
      title: "Healthcare",
      icon: Heart,
      count: "25+ Schemes",
      description: "Ayushman Bharat, health insurance, and medical assistance programs.",
      schemes: ["Ayushman Bharat", "PMJAY", "Mission Indradhanush", "Janani Suraksha"],
      color: "bg-success/10 text-success",
    },
    {
      title: "Agriculture",
      icon: Sprout,
      count: "30+ Schemes",
      description: "Farmer support, crop insurance, and agricultural development schemes.",
      schemes: ["PM-KISAN", "Crop Insurance", "Soil Health Card", "KCC"],
      color: "bg-primary/10 text-primary",
    },
    {
      title: "Housing",
      icon: Home,
      count: "20+ Schemes",
      description: "Affordable housing, rural development, and shelter programs.",
      schemes: ["PM Awas Yojana", "PMAY-G", "PMAY-U", "Pradhan Mantri Gramin"],
      color: "bg-secondary/10 text-secondary",
    },
    {
      title: "Social Welfare",
      icon: Users,
      count: "40+ Schemes",
      description: "Pension schemes, disability support, and social security programs.",
      schemes: ["APY", "PM-SYM", "NSAP", "Disability Pension"],
      color: "bg-success/10 text-success",
    },
  ];

  const eligibilityFilters = [
    "Age: 18-60 years",
    "Income: < ₹8 Lakhs",
    "State: All India",
    "Category: General",
  ];

  return (
    <section id="schemes" className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center rounded-full border px-4 py-2 text-sm bg-primary/5 border-primary/20 mb-4">
            <Users className="mr-2 h-4 w-4 text-primary" />
            500+ Government Schemes
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Discover Schemes Made for You
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Our AI-powered recommendation engine suggests the most relevant schemes based on your profile, eligibility, and current life situation.
          </p>
          
          {/* Eligibility Demo */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {eligibilityFilters.map((filter, index) => (
              <Badge key={index} variant="secondary" className="px-3 py-1">
                {filter}
              </Badge>
            ))}
          </div>
          
          <Button variant="hero" size="lg" asChild>
            <Link to="/schemes">
              Check My Eligibility
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Schemes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {schemeCategories.map((category, index) => (
            <Card key={index} className="group hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${category.color} group-hover:scale-110 transition-transform duration-300`}>
                    <category.icon className="h-6 w-6" />
                  </div>
                  <Badge variant="outline">{category.count}</Badge>
                </div>
                <CardTitle className="text-xl">{category.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{category.description}</p>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Popular Schemes:</p>
                  <div className="flex flex-wrap gap-1">
                    {category.schemes.map((scheme, schemeIndex) => (
                      <Badge key={schemeIndex} variant="secondary" className="text-xs">
                        {scheme}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button variant="ghost" className="w-full mt-4 group-hover:text-primary" asChild>
                  <Link to="/schemes">
                    View All Schemes
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Image Section */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-primary/5 to-secondary/5 p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                AI-Powered Scheme Matching
              </h3>
              <p className="text-muted-foreground mb-6">
                Answer a few questions about yourself, and our intelligent system will instantly show you all the schemes you're eligible for - from central government to your state-specific benefits.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-success"></div>
                  <span className="text-sm">Personal profile-based recommendations</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-success"></div>
                  <span className="text-sm">Real-time eligibility checking</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-success"></div>
                  <span className="text-sm">Application status tracking</span>
                </div>
              </div>
              <Button variant="government" asChild>
                <Link to="/schemes">
                  Start Scheme Discovery
                </Link>
              </Button>
            </div>
            <div className="relative">
              <img
                src={schemesImage}
                alt="Government Schemes"
                className="rounded-lg shadow-medium w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SchemesSection;