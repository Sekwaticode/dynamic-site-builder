import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2 } from "lucide-react";

const FooterSection = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [footerData, setFooterData] = useState<any>(null);
  const [links, setLinks] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [{ data: footer }, { data: footerLinks }] = await Promise.all([
        supabase.from("footer_content").select("*").single(),
        supabase.from("footer_links").select("*").order("display_order"),
      ]);

      if (footer) setFooterData(footer);
      if (footerLinks) setLinks(footerLinks);
    } catch (error: any) {
      if (!error.message.includes("no rows")) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load footer section",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const saveFooterSection = async () => {
    setSaving(true);
    try {
      const payload = {
        about_text: footerData?.about_text || "",
        newsletter_title: footerData?.newsletter_title || "",
        copyright_text: footerData?.copyright_text || "",
      };

      if (footerData?.id) {
        await supabase.from("footer_content").update(payload).eq("id", footerData.id);
      } else {
        const { data } = await supabase.from("footer_content").insert(payload).select().single();
        setFooterData(data);
      }

      // Delete all links and re-insert
      await supabase.from("footer_links").delete().neq("id", "00000000-0000-0000-0000-000000000000");

      const linksPayload = links.map((link, index) => ({
        section: link.section,
        text: link.text,
        url: link.url,
        display_order: index,
      }));

      await supabase.from("footer_links").insert(linksPayload);

      toast({
        title: "Success",
        description: "Footer section updated successfully",
      });

      fetchData();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save footer section",
      });
    } finally {
      setSaving(false);
    }
  };

  const addLink = () => {
    setLinks([
      ...links,
      {
        section: "company_info",
        text: "New Link",
        url: "#",
        display_order: links.length,
      },
    ]);
  };

  const deleteLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
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
      <div className="p-8 max-w-5xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Footer Content</h1>
          <p className="text-muted-foreground">
            Manage footer information, links and newsletter
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Footer Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="about">About Text</Label>
              <Textarea
                id="about"
                value={footerData?.about_text || ""}
                onChange={(e) => setFooterData({ ...footerData, about_text: e.target.value })}
                rows={3}
                placeholder="A leading wellness and health solutions company..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newsletter">Newsletter Title</Label>
              <Input
                id="newsletter"
                value={footerData?.newsletter_title || ""}
                onChange={(e) => setFooterData({ ...footerData, newsletter_title: e.target.value })}
                placeholder="Subscribe for Health & Wellness News"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="copyright">Copyright Text</Label>
              <Input
                id="copyright"
                value={footerData?.copyright_text || ""}
                onChange={(e) => setFooterData({ ...footerData, copyright_text: e.target.value })}
                placeholder="Made with love @harvagroup"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Footer Links</CardTitle>
              <Button onClick={addLink} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Link
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {links.map((link, index) => (
              <div key={index} className="p-4 border border-border rounded-lg space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Link {index + 1}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteLink(index)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Section</Label>
                    <Select
                      value={link.section}
                      onValueChange={(value) => {
                        const newLinks = [...links];
                        newLinks[index].section = value;
                        setLinks(newLinks);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="company_info">Company Info</SelectItem>
                        <SelectItem value="footer_bottom">Footer Bottom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Text</Label>
                    <Input
                      value={link.text}
                      onChange={(e) => {
                        const newLinks = [...links];
                        newLinks[index].text = e.target.value;
                        setLinks(newLinks);
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>URL</Label>
                    <Input
                      value={link.url}
                      onChange={(e) => {
                        const newLinks = [...links];
                        newLinks[index].url = e.target.value;
                        setLinks(newLinks);
                      }}
                      placeholder="#"
                    />
                  </div>
                </div>
              </div>
            ))}

            {links.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No footer links yet. Click "Add Link" to create one.
              </div>
            )}
          </CardContent>
        </Card>

        <Button onClick={saveFooterSection} disabled={saving} size="lg" className="w-full">
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Footer Section"
          )}
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default FooterSection;
