import { Button, Separator } from "@/components/ui";
import { useLanguage } from "../contexts/LanguageContext";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Youtube, 
  Instagram,
  ExternalLink 
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const { t } = useLanguage();
  const quickLinks = [
    { name: "Find Schemes", href: "/schemes" },
    { name: "Apply Online", href: "/dashboard" },
    { name: "Track Application", href: "/dashboard" },
    { name: "Document Verification", href: "/verify" },
    { name: "File Complaint", href: "/complaints" },
    { name: "Government Events", href: "/events" },
  ];

  const governmentLinks = [
    { name: "Digital India", href: "https://digitalindia.gov.in" },
    { name: "MyGov India", href: "https://mygov.in" },
    { name: "India.gov.in", href: "https://india.gov.in" },
    { name: "PM Portal", href: "https://pmindia.gov.in" },
    { name: "e-Gov Portal", href: "https://egov.gov.in" },
    { name: "Jan Aushadhi", href: "https://janaushadhi.gov.in" },
  ];

  const supportLinks = [
    { name: "Help Center", href: "/dashboard" },
    { name: "User Guide", href: "/dashboard" },
    { name: "FAQs", href: "/dashboard" },
    { name: "Contact Support", href: "/complaints" },
    { name: "Report Issue", href: "/complaints" },
    { name: "Feedback", href: "/complaints" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", name: "Facebook" },
    { icon: Twitter, href: "#", name: "Twitter" },
    { icon: Youtube, href: "#", name: "YouTube" },
    { icon: Instagram, href: "#", name: "Instagram" },
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="h-10 w-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center">
                <span className="text-primary-foreground font-bold">SS</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl">Saral Seva</span>
                <span className="text-sm text-primary-foreground/70">Government Services</span>
              </div>
            </div>
            <p className="text-primary-foreground/80 mb-6">
              Unifying all government services, schemes, and citizen support through AI-powered technology. Making governance accessible to every Indian citizen.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="icon"
                  className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
                  asChild
                >
                  <a href={social.href} aria-label={social.name}>
                    <social.icon className="h-5 w-5" />
                  </a>
                </Button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-6">{t('dashboard.quickActions')}</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Government Links */}
          <div>
            <h3 className="font-semibold text-lg mb-6">{t('dashboard.governmentPortals')}</h3>
            <ul className="space-y-3">
              {governmentLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors flex items-center gap-2"
                  >
                    {link.name}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-6">{t('common.helpSupport')}</h3>
            <ul className="space-y-3 mb-6">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-primary-foreground/80">
                <Phone className="h-4 w-4" />
                <span>1800-000-XXX (Toll Free)</span>
              </div>
              <div className="flex items-center gap-3 text-primary-foreground/80">
                <Mail className="h-4 w-4" />
                <span>support@saralseva.gov.in</span>
              </div>
              <div className="flex items-center gap-3 text-primary-foreground/80">
                <MapPin className="h-4 w-4" />
                <span>New Delhi, India</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-primary-foreground/20" />

      {/* Bottom Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-primary-foreground/70 text-sm text-center sm:text-left">
            © 2024 Saral Seva Pro. A Government of India Initiative. All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-sm">
            <Link to="/profile" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="/profile" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
              Terms of Service
            </Link>
            <Link to="/profile" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;