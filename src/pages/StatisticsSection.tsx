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

const StatisticsSection = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await supabase
        .from("statistics")
        .select("*")
        .order("display_order");

      if (data) setStats(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load statistics",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveStatistics = async () => {
    setSaving(true);
    try {
      // Delete all existing and re-insert
      await supabase.from("statistics").delete().neq("id", "00000000-0000-0000-0000-000000000000");

      const payload = stats.map((stat, index) => ({
        number: stat.number,
        description: stat.description,
        display_order: index,
      }));

      await supabase.from("statistics").insert(payload);

      toast({
        title: "Success",
        description: "Statistics updated successfully",
      });

      fetchData();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save statistics",
      });
    } finally {
      setSaving(false);
    }
  };

  const addStat = () => {
    setStats([...stats, { number: "0", description: "", display_order: stats.length }]);
  };

  const deleteStat = (index: number) => {
    setStats(stats.filter((_, i) => i !== index));
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Statistics Section</h1>
          <p className="text-muted-foreground">
            Manage impact numbers and achievement statistics
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Statistics Cards</CardTitle>
              <Button onClick={addStat} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Statistic
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.map((stat, index) => (
              <div key={index} className="p-4 border border-border rounded-lg space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Statistic {index + 1}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteStat(index)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Number</Label>
                    <Input
                      value={stat.number}
                      onChange={(e) => {
                        const newStats = [...stats];
                        newStats[index].number = e.target.value;
                        setStats(newStats);
                      }}
                      placeholder="65"
                    />
                  </div>
                  <div className="col-span-3 space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={stat.description}
                      onChange={(e) => {
                        const newStats = [...stats];
                        newStats[index].description = e.target.value;
                        setStats(newStats);
                      }}
                      rows={1}
                      placeholder="Empowering communities with accessible, science-based wellness solutions."
                    />
                  </div>
                </div>
              </div>
            ))}

            {stats.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No statistics yet. Click "Add Statistic" to create one.
              </div>
            )}
          </CardContent>
        </Card>

        <Button onClick={saveStatistics} disabled={saving} size="lg" className="w-full">
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Statistics"
          )}
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default StatisticsSection;
