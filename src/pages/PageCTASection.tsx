import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface PageCTA {
  id?: string;
  page_name: string;
  title: string;
  description: string;
  image_url: string;
  button_text: string;
  button_url: string;
}

const defaultCTAs: PageCTA[] = [
  {
    page_name: "services_top",
    title: "We offer online consultations",
    description: "Harva Group offers expert online health consultations designed to support your wellness goals.",
    image_url: "",
    button_text: "Whatsapp message",
    button_url: "https://api.whatsapp.com/send?phone=27678833836",
  },
  {
    page_name: "services_photobio",
    title: "What is Photobiomodulation?",
    description: "Whole Body Vibration Plate: The vibration plate activates muscle contractions that increase the body's energy demand.",
    image_url: "",
    button_text: "",
    button_url: "",
  },
  {
    page_name: "contact",
    title: "We offer online consultations",
    description: "Harva Group offers expert online health consultations designed to support your wellness goals.",
    image_url: "",
    button_text: "Whatsapp message",
    button_url: "https://api.whatsapp.com/send?phone=27678833836",
  },
];

const pageLabels: Record<string, string> = {
  services_top: "Services Page - Top CTA",
  services_photobio: "Services Page - Photobiomodulation CTA",
  contact: "Contact Page - CTA",
};

const PageCTASection = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [ctas, setCTAs] = useState<PageCTA[]>(defaultCTAs);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from("page_cta_sections")
        .select("*");

      if (error) throw error;

      if (data && data.length > 0) {
        // Merge fetched data with defaults (keep defaults for any missing pages)
        const merged = defaultCTAs.map((defaultCTA) => {
          const found = data.find((d: any) => d.page_name === defaultCTA.page_name);
          return found ? { ...defaultCTA, ...found } : defaultCTA;
        });
        setCTAs(merged);
      }
    } catch (error: any) {
      toast({
        title: "Error loading page CTAs",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveCTAs = async () => {
    setSaving(true);
    try {
      for (const cta of ctas) {
        const { error } = await supabase
          .from("page_cta_sections")
          .upsert(
            {
              page_name: cta.page_name,
              title: cta.title,
              description: cta.description,
              image_url: cta.image_url || null,
              button_text: cta.button_text || null,
              button_url: cta.button_url || null,
            },
            { onConflict: "page_name" }
          );

        if (error) throw error;
      }

      toast({
        title: "Page CTAs saved",
        description: "All page CTA sections have been updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error saving page CTAs",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateCTA = (pageName: string, field: keyof PageCTA, value: string) => {
    setCTAs(
      ctas.map((cta) =>
        cta.page_name === pageName ? { ...cta, [field]: value } : cta
      )
    );
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Page CTA Sections</h1>
          <p className="text-muted-foreground mt-1">
            Manage call-to-action sections for Services and Contact pages
          </p>
        </div>

        <div className="space-y-6">
          {ctas.map((cta) => (
            <Card key={cta.page_name}>
              <CardHeader>
                <CardTitle>{pageLabels[cta.page_name] || cta.page_name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={cta.title}
                    onChange={(e) => updateCTA(cta.page_name, "title", e.target.value)}
                    placeholder="CTA Title"
                  />
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={cta.description}
                    onChange={(e) => updateCTA(cta.page_name, "description", e.target.value)}
                    placeholder="CTA description text..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label>Image URL</Label>
                  <Input
                    value={cta.image_url}
                    onChange={(e) => updateCTA(cta.page_name, "image_url", e.target.value)}
                    placeholder="https://..."
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Button Text</Label>
                    <Input
                      value={cta.button_text}
                      onChange={(e) => updateCTA(cta.page_name, "button_text", e.target.value)}
                      placeholder="e.g., Get in Touch"
                    />
                  </div>
                  <div>
                    <Label>Button URL</Label>
                    <Input
                      value={cta.button_url}
                      onChange={(e) => updateCTA(cta.page_name, "button_url", e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8">
          <Button onClick={saveCTAs} disabled={saving} size="lg">
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Page CTAs
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PageCTASection;
