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

const ObjectivesSection = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [objectives, setObjectives] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [{ data: sectionSettings }, { data: objectivesList }] = await Promise.all([
        supabase.from("objectives_section_settings").select("*").single(),
        supabase.from("objectives").select("*").order("display_order"),
      ]);

      if (sectionSettings) setSettings(sectionSettings);
      if (objectivesList) setObjectives(objectivesList);
    } catch (error: any) {
      if (!error.message.includes("no rows")) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load objectives section",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const saveObjectivesSection = async () => {
    setSaving(true);
    try {
      const settingsPayload = {
        section_subtitle: settings?.section_subtitle || "Our Objectives",
        section_title: settings?.section_title || "",
        banner_image_url: settings?.banner_image_url || "",
      };

      if (settings?.id) {
        await supabase.from("objectives_section_settings").update(settingsPayload).eq("id", settings.id);
      } else {
        const { data } = await supabase.from("objectives_section_settings").insert(settingsPayload).select().single();
        setSettings(data);
      }

      // Delete all and re-insert objectives
      await supabase.from("objectives").delete().neq("id", "00000000-0000-0000-0000-000000000000");

      const objectivesPayload = objectives.map((obj, index) => ({
        title: obj.title,
        description: obj.description,
        icon_name: obj.icon_name,
        position: obj.position,
        display_order: index,
      }));

      await supabase.from("objectives").insert(objectivesPayload);

      toast({
        title: "Success",
        description: "Objectives section updated successfully",
      });

      fetchData();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save objectives section",
      });
    } finally {
      setSaving(false);
    }
  };

  const addObjective = () => {
    setObjectives([
      ...objectives,
      {
        title: "New Objective",
        description: "",
        icon_name: "leaf-outline",
        position: "left",
        display_order: objectives.length,
      },
    ]);
  };

  const deleteObjective = (index: number) => {
    setObjectives(objectives.filter((_, i) => i !== index));
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Objectives Section</h1>
          <p className="text-muted-foreground">
            Manage your services and organizational goals
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
                placeholder="Our Objectives"
              />
            </div>

            <div className="space-y-2">
              <Label>Section Title</Label>
              <Textarea
                value={settings?.section_title || ""}
                onChange={(e) => setSettings({ ...settings, section_title: e.target.value })}
                placeholder="We Work Together to Cultivate Health and Prosperity"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Banner Image URL (center)</Label>
              <Input
                value={settings?.banner_image_url || ""}
                onChange={(e) => setSettings({ ...settings, banner_image_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Objectives</CardTitle>
              <Button onClick={addObjective} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Objective
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {objectives.map((obj, index) => (
              <div key={index} className="p-4 border border-border rounded-lg space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Objective {index + 1}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteObjective(index)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Icon Name</Label>
                    <Input
                      value={obj.icon_name}
                      onChange={(e) => {
                        const newObjs = [...objectives];
                        newObjs[index].icon_name = e.target.value;
                        setObjectives(newObjs);
                      }}
                      placeholder="leaf-outline"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={obj.title}
                      onChange={(e) => {
                        const newObjs = [...objectives];
                        newObjs[index].title = e.target.value;
                        setObjectives(newObjs);
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Position</Label>
                    <Select
                      value={obj.position}
                      onValueChange={(value) => {
                        const newObjs = [...objectives];
                        newObjs[index].position = value;
                        setObjectives(newObjs);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="left">Left</SelectItem>
                        <SelectItem value="right">Right</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={obj.description}
                    onChange={(e) => {
                      const newObjs = [...objectives];
                      newObjs[index].description = e.target.value;
                      setObjectives(newObjs);
                    }}
                    rows={2}
                  />
                </div>
              </div>
            ))}

            {objectives.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No objectives yet. Click "Add Objective" to create one.
              </div>
            )}
          </CardContent>
        </Card>

        <Button onClick={saveObjectivesSection} disabled={saving} size="lg" className="w-full">
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Objectives Section"
          )}
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default ObjectivesSection;
