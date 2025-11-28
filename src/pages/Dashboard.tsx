import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import {
  Image,
  Info,
  BarChart3,
  Target,
  Megaphone,
  Lightbulb,
  Phone,
  FileText,
} from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState({
    heroCards: 0,
    stats: 0,
    objectives: 0,
    photobioCards: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [heroCards, statistics, objectives, photobioCards] = await Promise.all([
        supabase.from("hero_cards").select("*", { count: "exact", head: true }),
        supabase.from("statistics").select("*", { count: "exact", head: true }),
        supabase.from("objectives").select("*", { count: "exact", head: true }),
        supabase.from("photobiomodulation_cards").select("*", { count: "exact", head: true }),
      ]);

      setStats({
        heroCards: heroCards.count || 0,
        stats: statistics.count || 0,
        objectives: objectives.count || 0,
        photobioCards: photobioCards.count || 0,
      });
    };

    fetchStats();
  }, []);

  const sections = [
    {
      title: "Hero Section",
      description: "Main landing section with feature cards",
      icon: Image,
      count: stats.heroCards,
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      title: "About Section",
      description: "Mission, vision and company info",
      icon: Info,
      count: 1,
      color: "bg-purple-500/10 text-purple-600",
    },
    {
      title: "Statistics",
      description: "Impact numbers and achievements",
      icon: BarChart3,
      count: stats.stats,
      color: "bg-green-500/10 text-green-600",
    },
    {
      title: "Objectives",
      description: "Services and goals",
      icon: Target,
      count: stats.objectives,
      color: "bg-orange-500/10 text-orange-600",
    },
    {
      title: "CTA Section",
      description: "Call-to-action content",
      icon: Megaphone,
      count: 1,
      color: "bg-pink-500/10 text-pink-600",
    },
    {
      title: "Photobiomodulation",
      description: "Service cards and therapy info",
      icon: Lightbulb,
      count: stats.photobioCards,
      color: "bg-yellow-500/10 text-yellow-600",
    },
    {
      title: "Contact Details",
      description: "Phone, email and address",
      icon: Phone,
      count: 1,
      color: "bg-cyan-500/10 text-cyan-600",
    },
    {
      title: "Footer Content",
      description: "Footer text and links",
      icon: FileText,
      count: 1,
      color: "bg-indigo-500/10 text-indigo-600",
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Content Overview</h1>
          <p className="text-muted-foreground">
            Manage all sections of your Harva Group website
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sections.map((section) => (
            <Card key={section.title} className="hover:shadow-medium transition-shadow">
              <CardHeader className="pb-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${section.color} mb-3`}>
                  <section.icon className="w-6 h-6" />
                </div>
                <CardTitle className="text-lg">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  {section.description}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-foreground">
                    {section.count}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {section.count === 1 ? "item" : "items"}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Start Guide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">Getting Started</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Navigate through sections using the sidebar</li>
                  <li>• Edit existing content or create new entries</li>
                  <li>• Upload images for visual sections</li>
                  <li>• Preview changes before publishing</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">API Access</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Public API endpoints available</li>
                  <li>• Fetch content for your static site</li>
                  <li>• Real-time updates supported</li>
                  <li>• Check documentation for details</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
