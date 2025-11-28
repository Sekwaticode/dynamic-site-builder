import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const SiteSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await supabase.from("site_settings").select("*").single();
      if (data) setSettings(data);
    } catch (error: any) {
      if (!error.message.includes("no rows")) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load site settings",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const saveSiteSettings = async () => {
    setSaving(true);
    try {
      const payload = {
        site_title: settings?.site_title || "",
        site_description: settings?.site_description || "",
        logo_url: settings?.logo_url || "",
        favicon_url: settings?.favicon_url || "",
      };

      if (settings?.id) {
        await supabase.from("site_settings").update(payload).eq("id", settings.id);
      } else {
        const { data } = await supabase.from("site_settings").insert(payload).select().single();
        setSettings(data);
      }

      toast({
        title: "Success",
        description: "Site settings updated successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save site settings",
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Site Settings</h1>
          <p className="text-muted-foreground">
            Manage global site configuration
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Site Title</Label>
              <Input
                id="title"
                value={settings?.site_title || ""}
                onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
                placeholder="Harva Group - Health baked by science"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Site Description</Label>
              <Input
                id="description"
                value={settings?.site_description || ""}
                onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
                placeholder="Health, Science, rejuvenation, replenishment"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo">Logo URL</Label>
              <Input
                id="logo"
                value={settings?.logo_url || ""}
                onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="favicon">Favicon URL</Label>
              <Input
                id="favicon"
                value={settings?.favicon_url || ""}
                onChange={(e) => setSettings({ ...settings, favicon_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </CardContent>
        </Card>

        <Button onClick={saveSiteSettings} disabled={saving} size="lg" className="w-full">
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Site Settings"
          )}
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default SiteSettings;
