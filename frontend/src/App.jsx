import { Toaster, Sonner, TooltipProvider } from "@/components/ui";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { useState, useEffect, Suspense, lazy } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";

// Lazy load components for better performance
const Index = lazy(() => import("./pages/Index"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Schemes = lazy(() => import("./pages/Schemes"));
const DocumentVerification = lazy(() => import("./pages/DocumentVerification"));
const Complaints = lazy(() => import("./pages/Complaints"));
const Events = lazy(() => import("./pages/Events"));
const Locations = lazy(() => import("./pages/Locations"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Search = lazy(() => import("./pages/Search"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Profile = lazy(() => import("./pages/Profile"));
const SarkarQnA = lazy(() => import("./pages/SarkarQnA"));
const Language = lazy(() => import("./components/Language"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-accent/20 to-muted/30">
    <div className="text-center space-y-4">
      <div className="relative w-16 h-16 mx-auto">
        <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="text-muted-foreground font-medium">Loading Saral Seva...</p>
    </div>
  </div>
);

// Page transition component
const PageTransition = ({ children }) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState("fadeIn");

  useEffect(() => {
    if (location !== displayLocation) setTransitionStage("fadeOut");
  }, [location, displayLocation]);

  return (
    <div
      className={`transition-opacity duration-300 ${
        transitionStage === "fadeOut" ? "opacity-0" : "opacity-100"
      }`}
      onTransitionEnd={() => {
        if (transitionStage === "fadeOut") {
          setTransitionStage("fadeIn");
          setDisplayLocation(location);
        }
      }}
    >
      {children}
    </div>
  );
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      refetchOnWindowFocus: false,
      staleTime: 10 * 60 * 1000, // 10 minutes
      cacheTime: 15 * 60 * 1000, // 15 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

const App = () => {
  const [isChatbotMinimized, setIsChatbotMinimized] = useState(true);
  const [showChatbot, setShowChatbot] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'hsl(var(--card))',
                  color: 'hsl(var(--card-foreground))',
                  border: '1px solid hsl(var(--border))',
                },
              }}
            />
            <Sonner 
              position="top-center"
              expand={true}
              richColors
              closeButton
            />
            <BrowserRouter future={{ v7_relativeSplatPath: true }}>
              <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-accent/5 to-muted/10">
                <Header />
                <main className="flex-1 relative">
                  <Suspense fallback={<LoadingSpinner />}>
                    <PageTransition>
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/schemes" element={<Schemes />} />
                        <Route path="/events" element={<Events />} />
                        <Route path="/locations" element={<Locations />} />
                        <Route path="/sarkarqna" element={<SarkarQnA />} />
                        <Route path="/language" element={<Language />} />
                        
                        {/* Protected Routes */}
                        <Route path="/dashboard" element={
                          <ProtectedRoute>
                            <Dashboard />
                          </ProtectedRoute>
                        } />
                        <Route path="/verify" element={
                          <ProtectedRoute>
                            <DocumentVerification />
                          </ProtectedRoute>
                        } />
                        <Route path="/complaints" element={
                          <ProtectedRoute>
                            <Complaints />
                          </ProtectedRoute>
                        } />
                        <Route path="/search" element={
                          <ProtectedRoute>
                            <Search />
                          </ProtectedRoute>
                        } />
                        <Route path="/notifications" element={
                          <ProtectedRoute>
                            <Notifications />
                          </ProtectedRoute>
                        } />
                        <Route path="/profile" element={
                          <ProtectedRoute>
                            <Profile />
                          </ProtectedRoute>
                        } />
                        
                        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </PageTransition>
                  </Suspense>
                </main>
                <Footer />
                
                {/* Enhanced AI Chatbot */}
                {showChatbot && (
                  <div className="fixed bottom-6 right-6 z-50">
                    <Chatbot
                      isMinimized={isChatbotMinimized}
                      onToggleMinimize={() => setIsChatbotMinimized(!isChatbotMinimized)}
                      onClose={() => setShowChatbot(false)}
                    />
                  </div>
                )}
              </div>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
