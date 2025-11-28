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

const AboutSection = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aboutData, setAboutData] = useState<any>(null);
  const [listItems, setListItems] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [{ data: about }, { data: items }] = await Promise.all([
        supabase.from("about_section").select("*").single(),
        supabase.from("about_list_items").select("*").order("display_order"),
      ]);

      if (about) setAboutData(about);
      if (items) setListItems(items.map((i: any) => i.text));
    } catch (error: any) {
      if (!error.message.includes("no rows")) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load about section",
        });
      } else {
        setListItems(["Science-Based Innovation", "Community Empowerment & Education"]);
      }
    } finally {
      setLoading(false);
    }
  };

  const saveAboutSection = async () => {
    setSaving(true);
    try {
      const payload = {
        section_subtitle: aboutData?.section_subtitle || "Why We Exist",
        section_title: aboutData?.section_title || "",
        main_paragraph: aboutData?.main_paragraph || "",
        mission_title: aboutData?.mission_title || "Our Mission",
        mission_text: aboutData?.mission_text || "",
        mission_icon: aboutData?.mission_icon || "bonfire-outline",
        vision_title: aboutData?.vision_title || "Our Vision",
        vision_text: aboutData?.vision_text || "",
        vision_icon: aboutData?.vision_icon || "document-text-outline",
        image_1_url: aboutData?.image_1_url || "",
        image_2_url: aboutData?.image_2_url || "",
      };

      let aboutId = aboutData?.id;

      if (aboutId) {
        await supabase.from("about_section").update(payload).eq("id", aboutId);
      } else {
        const { data } = await supabase.from("about_section").insert(payload).select().single();
        aboutId = data.id;
        setAboutData(data);
      }

      // Delete old list items and insert new ones
      await supabase.from("about_list_items").delete().eq("about_id", aboutId);
      
      const itemsPayload = listItems.map((text, index) => ({
        about_id: aboutId,
        text,
        display_order: index,
      }));

      await supabase.from("about_list_items").insert(itemsPayload);

      toast({
        title: "Success",
        description: "About section updated successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save about section",
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
      <div className="p-8 max-w-5xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">About Section</h1>
          <p className="text-muted-foreground">
            Manage your company information, mission, and vision
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Section Header</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subtitle">Section Subtitle</Label>
              <Input
                id="subtitle"
                value={aboutData?.section_subtitle || ""}
                onChange={(e) => setAboutData({ ...aboutData, section_subtitle: e.target.value })}
                placeholder="Why We Exist"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Section Title</Label>
              <Input
                id="title"
                value={aboutData?.section_title || ""}
                onChange={(e) => setAboutData({ ...aboutData, section_title: e.target.value })}
                placeholder="Together We Inspire Holistic Wellbeing"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paragraph">Main Paragraph</Label>
              <Textarea
                id="paragraph"
                value={aboutData?.main_paragraph || ""}
                onChange={(e) => setAboutData({ ...aboutData, main_paragraph: e.target.value })}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Mission</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Icon Name</Label>
                <Input
                  value={aboutData?.mission_icon || ""}
                  onChange={(e) => setAboutData({ ...aboutData, mission_icon: e.target.value })}
                  placeholder="bonfire-outline"
                />
              </div>

              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={aboutData?.mission_title || ""}
                  onChange={(e) => setAboutData({ ...aboutData, mission_title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Text</Label>
                <Textarea
                  value={aboutData?.mission_text || ""}
                  onChange={(e) => setAboutData({ ...aboutData, mission_text: e.target.value })}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vision</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Icon Name</Label>
                <Input
                  value={aboutData?.vision_icon || ""}
                  onChange={(e) => setAboutData({ ...aboutData, vision_icon: e.target.value })}
                  placeholder="document-text-outline"
                />
              </div>

              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={aboutData?.vision_title || ""}
                  onChange={(e) => setAboutData({ ...aboutData, vision_title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Text</Label>
                <Textarea
                  value={aboutData?.vision_text || ""}
                  onChange={(e) => setAboutData({ ...aboutData, vision_text: e.target.value })}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>List Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {listItems.map((item, index) => (
              <div key={index} className="space-y-2">
                <Label>Item {index + 1}</Label>
                <Input
                  value={item}
                  onChange={(e) => {
                    const newItems = [...listItems];
                    newItems[index] = e.target.value;
                    setListItems(newItems);
                  }}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Image 1 URL</Label>
              <Input
                value={aboutData?.image_1_url || ""}
                onChange={(e) => setAboutData({ ...aboutData, image_1_url: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <Label>Image 2 URL</Label>
              <Input
                value={aboutData?.image_2_url || ""}
                onChange={(e) => setAboutData({ ...aboutData, image_2_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </CardContent>
        </Card>

        <Button onClick={saveAboutSection} disabled={saving} size="lg" className="w-full">
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save About Section"
          )}
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default AboutSection;
