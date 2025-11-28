import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2 } from "lucide-react";

const PhotobioSection = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [cards, setCards] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [{ data: sectionSettings }, { data: serviceCards }] = await Promise.all([
        supabase.from("photobio_section_settings").select("*").single(),
        supabase.from("photobiomodulation_cards").select("*").order("display_order"),
      ]);

      if (sectionSettings) setSettings(sectionSettings);
      if (serviceCards) setCards(serviceCards);
    } catch (error: any) {
      if (!error.message.includes("no rows")) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load photobiomodulation section",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const savePhotobioSection = async () => {
    setSaving(true);
    try {
      const settingsPayload = {
        section_subtitle: settings?.section_subtitle || "Photobiomodulation Therapy",
        section_title: settings?.section_title || "",
        cta_text: settings?.cta_text || "View More Services",
      };

      if (settings?.id) {
        await supabase.from("photobio_section_settings").update(settingsPayload).eq("id", settings.id);
      } else {
        const { data } = await supabase.from("photobio_section_settings").insert(settingsPayload).select().single();
        setSettings(data);
      }

      // Delete all and re-insert cards
      await supabase.from("photobiomodulation_cards").delete().neq("id", "00000000-0000-0000-0000-000000000000");

      const cardsPayload = cards.map((card, index) => ({
        title: card.title,
        image_url: card.image_url,
        author: card.author || "Harva Team",
        comments_count: parseInt(card.comments_count) || 0,
        description: card.description,
        display_order: index,
      }));

      await supabase.from("photobiomodulation_cards").insert(cardsPayload);

      toast({
        title: "Success",
        description: "Photobiomodulation section updated successfully",
      });

      fetchData();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save photobiomodulation section",
      });
    } finally {
      setSaving(false);
    }
  };

  const addCard = () => {
    setCards([
      ...cards,
      {
        title: "New Service",
        image_url: "",
        author: "Harva Team",
        comments_count: 0,
        description: "",
        display_order: cards.length,
      },
    ]);
  };

  const deleteCard = (index: number) => {
    setCards(cards.filter((_, i) => i !== index));
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Photobiomodulation Section</h1>
          <p className="text-muted-foreground">
            Manage your therapy services and blog cards
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Section Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Section Subtitle</Label>
              <Input
                value={settings?.section_subtitle || ""}
                onChange={(e) => setSettings({ ...settings, section_subtitle: e.target.value })}
                placeholder="Photobiomodulation Therapy"
              />
            </div>

            <div className="space-y-2">
              <Label>Section Title</Label>
              <Textarea
                value={settings?.section_title || ""}
                onChange={(e) => setSettings({ ...settings, section_title: e.target.value })}
                rows={2}
                placeholder="Experience the various benefits of our Photobiomodulation Therapy Services"
              />
            </div>

            <div className="space-y-2">
              <Label>CTA Button Text</Label>
              <Input
                value={settings?.cta_text || ""}
                onChange={(e) => setSettings({ ...settings, cta_text: e.target.value })}
                placeholder="View More Services"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Service Cards</CardTitle>
              <Button onClick={addCard} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Card
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {cards.map((card, index) => (
              <div key={index} className="p-4 border border-border rounded-lg space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Card {index + 1}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteCard(index)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={card.title}
                    onChange={(e) => {
                      const newCards = [...cards];
                      newCards[index].title = e.target.value;
                      setCards(newCards);
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Author</Label>
                    <Input
                      value={card.author}
                      onChange={(e) => {
                        const newCards = [...cards];
                        newCards[index].author = e.target.value;
                        setCards(newCards);
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Comments Count</Label>
                    <Input
                      type="number"
                      value={card.comments_count}
                      onChange={(e) => {
                        const newCards = [...cards];
                        newCards[index].comments_count = e.target.value;
                        setCards(newCards);
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Image URL</Label>
                  <Input
                    value={card.image_url}
                    onChange={(e) => {
                      const newCards = [...cards];
                      newCards[index].image_url = e.target.value;
                      setCards(newCards);
                    }}
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={card.description || ""}
                    onChange={(e) => {
                      const newCards = [...cards];
                      newCards[index].description = e.target.value;
                      setCards(newCards);
                    }}
                    rows={2}
                  />
                </div>
              </div>
            ))}

            {cards.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No service cards yet. Click "Add Card" to create one.
              </div>
            )}
          </CardContent>
        </Card>

        <Button onClick={savePhotobioSection} disabled={saving} size="lg" className="w-full">
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Photobiomodulation Section"
          )}
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default PhotobioSection;
