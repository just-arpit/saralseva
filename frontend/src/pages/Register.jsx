import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, CardContent, CardHeader, CardTitle, Separator, Badge } from "@/components/ui";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/hooks";
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  MapPin, 
  Calendar,
  Briefcase,
  CreditCard,
  Shield,
  CheckCircle,
  AlertCircle,
  Building,
  FileText,
  Camera,
  Upload,
  Download,
  Globe,
  IndianRupee
} from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    gender: "",
    address: {
      city: "",
      state: "",
      pincode: ""
    },
    occupation: "",
    annualIncome: "",
    category: "",
    acceptTerms: false,
    acceptPrivacy: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const { register, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = "Please enter a valid 10-digit mobile number";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.acceptTerms) newErrors.acceptTerms = "You must accept the terms of service";
    if (!formData.acceptPrivacy) newErrors.acceptPrivacy = "You must accept the privacy policy";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const result = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        dateOfBirth: formData.dateOfBirth || undefined,
        gender: formData.gender || undefined,
        address: {
          city: formData.address.city || undefined,
          state: formData.address.state || undefined,
          pincode: formData.address.pincode || undefined
        },
        occupation: formData.occupation || undefined,
        annualIncome: formData.annualIncome ? parseFloat(formData.annualIncome) : undefined,
        category: formData.category || undefined
      });
      
      if (result.success) {
        toast({
          title: "Registration successful!",
          description: "Welcome to Saral Seva Pro!"
        });
        
        navigate("/dashboard");
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      setErrors({ submit: error.message || "Registration failed. Please try again." });
      toast({
        title: "Registration failed",
        description: error.message || "Please try again.",
        variant: "destructive"
      });
    }
  };

  const formatPhone = (value) => {
    return value.replace(/\D/g, '').slice(0, 10);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">SS</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-2xl text-primary">Saral Seva</span>
              <span className="text-sm text-muted-foreground">Government Services</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Create Your Account</h1>
          <p className="text-muted-foreground">Join millions of citizens accessing government services</p>
        </div>

        <Card className="shadow-government">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center">Register for Saral Seva</CardTitle>
            <p className="text-center text-sm text-muted-foreground">
              Fill in your details to get started
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">First Name *</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    placeholder="Enter first name"
                    className={`w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring ${
                      errors.firstName ? 'border-destructive' : 'border-input'
                    }`}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Name *</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    placeholder="Enter last name"
                    className={`w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring ${
                      errors.lastName ? 'border-destructive' : 'border-input'
                    }`}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter email address"
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring ${
                      errors.email ? 'border-destructive' : 'border-input'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Mobile Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", formatPhone(e.target.value))}
                    placeholder="Enter 10-digit mobile number"
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring ${
                      errors.phone ? 'border-destructive' : 'border-input'
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    placeholder="Enter strong password"
                    className={`w-full pl-10 pr-12 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring ${
                      errors.password ? 'border-destructive' : 'border-input'
                    }`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.password}
                  </p>
                )}
                <div className="text-xs text-muted-foreground">
                  Password must be at least 6 characters with uppercase, lowercase, and number
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Confirm Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    placeholder="Confirm your password"
                    className={`w-full pl-10 pr-12 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring ${
                      errors.confirmPassword ? 'border-destructive' : 'border-input'
                    }`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Additional Information (Optional) */}
              <div className="space-y-4">
                <div className="text-sm font-medium text-muted-foreground">
                  Additional Information (Optional - can be completed later)
                </div>
                
                {/* Date of Birth */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange("gender", e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>

                {/* Address */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">City</label>
                    <input
                      type="text"
                      value={formData.address.city}
                      onChange={(e) => handleInputChange("address.city", e.target.value)}
                      placeholder="Enter city"
                      className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">State</label>
                    <input
                      type="text"
                      value={formData.address.state}
                      onChange={(e) => handleInputChange("address.state", e.target.value)}
                      placeholder="Enter state"
                      className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Pincode</label>
                    <input
                      type="text"
                      value={formData.address.pincode}
                      onChange={(e) => handleInputChange("address.pincode", e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="Enter pincode"
                      className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>

                {/* Occupation and Income */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Occupation</label>
                    <input
                      type="text"
                      value={formData.occupation}
                      onChange={(e) => handleInputChange("occupation", e.target.value)}
                      placeholder="Enter occupation"
                      className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Annual Income (₹)</label>
                    <input
                      type="number"
                      value={formData.annualIncome}
                      onChange={(e) => handleInputChange("annualIncome", e.target.value)}
                      placeholder="Enter annual income"
                      className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange("category", e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select Category</option>
                    <option value="general">General</option>
                    <option value="obc">OBC</option>
                    <option value="sc">SC</option>
                    <option value="st">ST</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Terms and Privacy */}
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={(e) => handleInputChange("acceptTerms", e.target.checked)}
                    className="mt-1"
                  />
                  <label htmlFor="acceptTerms" className="text-sm">
                    I accept the{" "}
                    <Link to="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and agree to the platform guidelines *
                  </label>
                </div>
                {errors.acceptTerms && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.acceptTerms}
                  </p>
                )}

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="acceptPrivacy"
                    checked={formData.acceptPrivacy}
                    onChange={(e) => handleInputChange("acceptPrivacy", e.target.checked)}
                    className="mt-1"
                  />
                  <label htmlFor="acceptPrivacy" className="text-sm">
                    I acknowledge the{" "}
                    <Link to="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>{" "}
                    and consent to data processing *
                  </label>
                </div>
                {errors.acceptPrivacy && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.acceptPrivacy}
                  </p>
                )}
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm text-destructive flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {errors.submit}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
                variant="government"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent mr-2" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <User className="h-4 w-4 mr-2" />
                    Create Account
                  </>
                )}
              </Button>
            </form>

            {/* Security Notice */}
            <div className="bg-accent/50 p-3 rounded-lg">
              <div className="flex items-start gap-2">
                <Shield className="h-4 w-4 text-primary mt-0.5" />
                <div className="text-xs">
                  <p className="font-medium">Secure Registration</p>
                  <p className="text-muted-foreground">
                    Your data is protected with government-grade encryption and security measures.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in here
            </Link>
          </p>
          <div className="mt-4 text-xs text-muted-foreground">
            <p>
              <Building className="h-3 w-3 inline mr-1" />
              A Government of India Initiative
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;