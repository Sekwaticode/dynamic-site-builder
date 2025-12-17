import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import HeroSection from "./pages/HeroSection";
import AboutSection from "./pages/AboutSection";
import StatisticsSection from "./pages/StatisticsSection";
import ObjectivesSection from "./pages/ObjectivesSection";
import CTASection from "./pages/CTASection";
import PhotobioSection from "./pages/PhotobioSection";
import ContactSection from "./pages/ContactSection";
import FooterSection from "./pages/FooterSection";
import SiteSettings from "./pages/SiteSettings";
import ServicesSection from "./pages/ServicesSection";
import PageCTASection from "./pages/PageCTASection";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/hero" element={<HeroSection />} />
          <Route path="/dashboard/about" element={<AboutSection />} />
          <Route path="/dashboard/statistics" element={<StatisticsSection />} />
          <Route path="/dashboard/objectives" element={<ObjectivesSection />} />
          <Route path="/dashboard/cta" element={<CTASection />} />
          <Route path="/dashboard/services" element={<ServicesSection />} />
          <Route path="/dashboard/page-ctas" element={<PageCTASection />} />
          <Route path="/dashboard/photobio" element={<PhotobioSection />} />
          <Route path="/dashboard/contact" element={<ContactSection />} />
          <Route path="/dashboard/footer" element={<FooterSection />} />
          <Route path="/dashboard/settings" element={<SiteSettings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
