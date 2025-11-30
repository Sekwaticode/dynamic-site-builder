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

const HeroSection = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [heroData, setHeroData] = useState<any>(null);
  const [cards, setCards] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [{ data: hero }, { data: heroCards }] = await Promise.all([
        supabase.from("hero_section").select("*").maybeSingle(),
        supabase.from("hero_cards").select("*").order("display_order"),
      ]);

      if (hero) setHeroData(hero);
      if (heroCards) setCards(heroCards);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error loading data",
        description: error.message || "Failed to load hero section",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveHeroSection = async () => {
    setSaving(true);
    try {
      const heroPayload = {
        title: heroData?.title || "",
        subtitle: heroData?.subtitle || "",
        cta_text: heroData?.cta_text || "Get in Touch",
        cta_url: heroData?.cta_url || "#",
        hero_image_url: heroData?.hero_image_url || "",
      };

      let currentHeroId = heroData?.id;

      if (currentHeroId) {
        const { error } = await supabase.from("hero_section").update(heroPayload).eq("id", currentHeroId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("hero_section").insert(heroPayload).select().single();
        if (error) throw error;
        currentHeroId = data.id;
        setHeroData(data);
      }

      // Save cards with the correct hero_id
      for (const card of cards) {
        const cardPayload = {
          hero_id: currentHeroId,
          icon_name: card.icon_name,
          subtitle: card.subtitle,
          title: card.title,
          display_order: card.display_order,
        };

        if (card.id) {
          const { error } = await supabase.from("hero_cards").update(cardPayload).eq("id", card.id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from("hero_cards").insert(cardPayload);
          if (error) throw error;
        }
      }

      toast({
        title: "Success",
        description: "Hero section saved successfully",
      });
      
      await fetchData();
    } catch (error: any) {
      console.error("Save error:", error);
      toast({
        variant: "destructive",
        title: "Failed to save",
        description: error.message || "Please check your permissions and try again",
      });
    } finally {
      setSaving(false);
    }
  };

  const addCard = () => {
    setCards([
      ...cards,
      {
        icon_name: "heart-outline",
        subtitle: "New Subtitle",
        title: "New Title",
        display_order: cards.length,
      },
    ]);
  };

  const deleteCard = async (index: number) => {
    const card = cards[index];
    if (card.id) {
      await supabase.from("hero_cards").delete().eq("id", card.id);
    }
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Hero Section</h1>
          <p className="text-muted-foreground">
            Manage your main landing page content and feature cards
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Hero Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Main Title</Label>
              <Textarea
                id="title"
                value={heroData?.title || ""}
                onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
                placeholder="Cultivating Holistic Wellness for Your Health & Prosperity"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={heroData?.subtitle || ""}
                onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
                placeholder="Short tagline"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cta">CTA Button Text</Label>
                <Input
                  id="cta"
                  value={heroData?.cta_text || ""}
                  onChange={(e) => setHeroData({ ...heroData, cta_text: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cta-url">CTA URL</Label>
                <Input
                  id="cta-url"
                  value={heroData?.cta_url || ""}
                  onChange={(e) => setHeroData({ ...heroData, cta_url: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Hero Image URL</Label>
              <Input
                id="image"
                value={heroData?.hero_image_url || ""}
                onChange={(e) => setHeroData({ ...heroData, hero_image_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Feature Cards</CardTitle>
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

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Icon Name</Label>
                    <Input
                      value={card.icon_name}
                      onChange={(e) => {
                        const newCards = [...cards];
                        newCards[index].icon_name = e.target.value;
                        setCards(newCards);
                      }}
                      placeholder="heart-outline"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Subtitle</Label>
                    <Input
                      value={card.subtitle}
                      onChange={(e) => {
                        const newCards = [...cards];
                        newCards[index].subtitle = e.target.value;
                        setCards(newCards);
                      }}
                    />
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
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Button onClick={saveHeroSection} disabled={saving} size="lg" className="w-full">
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Hero Section"
          )}
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default HeroSection;
