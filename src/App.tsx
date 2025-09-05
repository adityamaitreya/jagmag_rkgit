import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

// Lazy load dashboard pages
import { lazy, Suspense } from "react";
const IssueManagement = lazy(() => import("./pages/IssueManagement"));
const UserManagement = lazy(() => import("./pages/UserManagement"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Settings = lazy(() => import("./pages/Settings"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            
            {/* Dashboard Routes */}
            <Route path="/issues" element={
              <ProtectedRoute>
                <Suspense fallback={<div className="min-h-screen flex flex-col items-center justify-center gap-4">
                  <img src="/jagmag-logo.svg" alt="JAGMAG Logo" className="w-32 h-32" />
                  <p>Loading...</p>
                </div>}>
                  <IssueManagement />
                </Suspense>
              </ProtectedRoute>
            } />
            
            <Route path="/users" element={
              <ProtectedRoute requiredRole="super_admin">
                <Suspense fallback={<div className="min-h-screen flex flex-col items-center justify-center gap-4">
                  <img src="/jagmag-logo.svg" alt="JAGMAG Logo" className="w-32 h-32" />
                  <p>Loading...</p>
                </div>}>
                  <UserManagement />
                </Suspense>
              </ProtectedRoute>
            } />
            
            <Route path="/notifications" element={
              <ProtectedRoute>
                <Suspense fallback={<div className="min-h-screen flex flex-col items-center justify-center gap-4">
                  <img src="/jagmag-logo.svg" alt="JAGMAG Logo" className="w-32 h-32" />
                  <p>Loading...</p>
                </div>}>
                  <Notifications />
                </Suspense>
              </ProtectedRoute>
            } />
            
            <Route path="/settings" element={
              <ProtectedRoute requiredRole="super_admin">
                <Suspense fallback={<div className="min-h-screen flex flex-col items-center justify-center gap-4">
                  <img src="/jagmag-logo.svg" alt="JAGMAG Logo" className="w-32 h-32" />
                  <p>Loading...</p>
                </div>}>
                  <Settings />
                </Suspense>
              </ProtectedRoute>
            } />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;