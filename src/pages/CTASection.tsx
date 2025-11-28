import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const CTASection = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [ctaData, setCtaData] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await supabase.from("cta_section").select("*").single();
      if (data) setCtaData(data);
    } catch (error: any) {
      if (!error.message.includes("no rows")) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load CTA section",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const saveCTASection = async () => {
    setSaving(true);
    try {
      const payload = {
        title: ctaData?.title || "",
        description: ctaData?.description || "",
        image_url: ctaData?.image_url || "",
      };

      if (ctaData?.id) {
        await supabase.from("cta_section").update(payload).eq("id", ctaData.id);
      } else {
        const { data } = await supabase.from("cta_section").insert(payload).select().single();
        setCtaData(data);
      }

      toast({
        title: "Success",
        description: "CTA section updated successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save CTA section",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8 max-w-3xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">CTA Section</h1>
          <p className="text-muted-foreground">
            Manage your call-to-action content
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>CTA Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={ctaData?.title || ""}
                onChange={(e) => setCtaData({ ...ctaData, title: e.target.value })}
                placeholder="Cultivating Health, Harvesting Life!"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={ctaData?.description || ""}
                onChange={(e) => setCtaData({ ...ctaData, description: e.target.value })}
                rows={4}
                placeholder="We are a Health & Wellness company dedicated to promoting holistic wellbeing..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={ctaData?.image_url || ""}
                onChange={(e) => setCtaData({ ...ctaData, image_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </CardContent>
        </Card>

        <Button onClick={saveCTASection} disabled={saving} size="lg" className="w-full">
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save CTA Section"
          )}
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default CTASection;
