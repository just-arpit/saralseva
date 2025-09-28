import { Toaster, Sonner, TooltipProvider } from "@/components/ui";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { useState } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Schemes from "./pages/Schemes";
import DocumentVerification from "./pages/DocumentVerification";
import Complaints from "./pages/Complaints";
import Events from "./pages/Events";
import Locations from "./pages/Locations";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Search from "./pages/Search";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import SarkarQnA from "./pages/SarkarQnA";
import Language from "./components/Language";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
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
            <Toaster />
            <Sonner />
            <BrowserRouter future={{ v7_relativeSplatPath: true }}>
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
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
                </main>
                <Footer />
                
                {/* AI Chatbot */}
                {showChatbot && (
                  <Chatbot
                    isMinimized={isChatbotMinimized}
                    onToggleMinimize={() => setIsChatbotMinimized(!isChatbotMinimized)}
                    onClose={() => setShowChatbot(false)}
                  />
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
