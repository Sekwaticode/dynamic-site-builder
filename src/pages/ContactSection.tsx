import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2 } from "lucide-react";

const ContactSection = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [contactData, setContactData] = useState<any>(null);
  const [socialLinks, setSocialLinks] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [{ data: contact }, { data: socials }] = await Promise.all([
        supabase.from("contact_details").select("*").single(),
        supabase.from("social_links").select("*").order("display_order"),
      ]);

      if (contact) setContactData(contact);
      if (socials) setSocialLinks(socials);
    } catch (error: any) {
      if (!error.message.includes("no rows")) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load contact section",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const saveContactSection = async () => {
    setSaving(true);
    try {
      const payload = {
        hotline: contactData?.hotline || "",
        email: contactData?.email || "",
        address: contactData?.address || "",
      };

      if (contactData?.id) {
        await supabase.from("contact_details").update(payload).eq("id", contactData.id);
      } else {
        const { data } = await supabase.from("contact_details").insert(payload).select().single();
        setContactData(data);
      }

      // Delete all social links and re-insert
      await supabase.from("social_links").delete().neq("id", "00000000-0000-0000-0000-000000000000");

      const socialsPayload = socialLinks.map((social, index) => ({
        platform: social.platform,
        url: social.url,
        icon_name: social.icon_name,
        display_order: index,
      }));

      await supabase.from("social_links").insert(socialsPayload);

      toast({
        title: "Success",
        description: "Contact section updated successfully",
      });

      fetchData();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save contact section",
      });
    } finally {
      setSaving(false);
    }
  };

  const addSocialLink = () => {
    setSocialLinks([
      ...socialLinks,
      {
        platform: "New Platform",
        url: "#",
        icon_name: "logo-facebook",
        display_order: socialLinks.length,
      },
    ]);
  };

  const deleteSocialLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
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
      <div className="p-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Contact Details</h1>
          <p className="text-muted-foreground">
            Manage contact information and social media links
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hotline">Hotline</Label>
              <Input
                id="hotline"
                value={contactData?.hotline || ""}
                onChange={(e) => setContactData({ ...contactData, hotline: e.target.value })}
                placeholder="+27 12 345 6789"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={contactData?.email || ""}
                onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                placeholder="info@harvagroup.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Physical Address</Label>
              <Input
                id="address"
                value={contactData?.address || ""}
                onChange={(e) => setContactData({ ...contactData, address: e.target.value })}
                placeholder="45 Wellness Ave, Cape Town, South Africa"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Social Media Links</CardTitle>
              <Button onClick={addSocialLink} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Link
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {socialLinks.map((social, index) => (
              <div key={index} className="p-4 border border-border rounded-lg space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Link {index + 1}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteSocialLink(index)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Platform</Label>
                    <Input
                      value={social.platform}
                      onChange={(e) => {
                        const newLinks = [...socialLinks];
                        newLinks[index].platform = e.target.value;
                        setSocialLinks(newLinks);
                      }}
                      placeholder="Facebook"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Icon Name</Label>
                    <Input
                      value={social.icon_name}
                      onChange={(e) => {
                        const newLinks = [...socialLinks];
                        newLinks[index].icon_name = e.target.value;
                        setSocialLinks(newLinks);
                      }}
                      placeholder="logo-facebook"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>URL</Label>
                    <Input
                      value={social.url}
                      onChange={(e) => {
                        const newLinks = [...socialLinks];
                        newLinks[index].url = e.target.value;
                        setSocialLinks(newLinks);
                      }}
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>
            ))}

            {socialLinks.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No social links yet. Click "Add Link" to create one.
              </div>
            )}
          </CardContent>
        </Card>

        <Button onClick={saveContactSection} disabled={saving} size="lg" className="w-full">
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Contact Section"
          )}
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default ContactSection;
