import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ServiceItem {
  id?: string;
  category_id?: string;
  title: string;
  image_url: string;
  author: string;
  display_order: number;
}

interface ServiceCategory {
  id?: string;
  title: string;
  subtitle: string;
  display_order: number;
  page: string;
  items: ServiceItem[];
}

const ServicesSection = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: categoriesData, error: catError } = await supabase
        .from("service_categories")
        .select("*")
        .order("display_order", { ascending: true });

      if (catError) throw catError;

      const { data: itemsData, error: itemsError } = await supabase
        .from("service_items")
        .select("*")
        .order("display_order", { ascending: true });

      if (itemsError) throw itemsError;

      const categoriesWithItems = (categoriesData || []).map((cat: any) => ({
        ...cat,
        items: (itemsData || []).filter((item: any) => item.category_id === cat.id),
      }));

      setCategories(categoriesWithItems);
      
      // Open all categories by default
      const openState: Record<string, boolean> = {};
      categoriesWithItems.forEach((cat: any) => {
        openState[cat.id || `new-${cat.display_order}`] = true;
      });
      setOpenCategories(openState);
    } catch (error: any) {
      toast({
        title: "Error loading services",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveServices = async () => {
    setSaving(true);
    try {
      // Delete all existing data first
      await supabase.from("service_items").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      await supabase.from("service_categories").delete().neq("id", "00000000-0000-0000-0000-000000000000");

      // Insert categories
      for (const cat of categories) {
        const { data: newCat, error: catError } = await supabase
          .from("service_categories")
          .insert({
            title: cat.title,
            subtitle: cat.subtitle,
            display_order: cat.display_order,
            page: cat.page,
          })
          .select()
          .single();

        if (catError) throw catError;

        // Insert items for this category
        if (cat.items.length > 0) {
          const itemsToInsert = cat.items.map((item) => ({
            category_id: newCat.id,
            title: item.title,
            image_url: item.image_url,
            author: item.author,
            display_order: item.display_order,
          }));

          const { error: itemsError } = await supabase
            .from("service_items")
            .insert(itemsToInsert);

          if (itemsError) throw itemsError;
        }
      }

      toast({
        title: "Services saved",
        description: "All service categories and items have been updated.",
      });

      fetchData();
    } catch (error: any) {
      toast({
        title: "Error saving services",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const addCategory = () => {
    const newId = `new-${Date.now()}`;
    setCategories([
      ...categories,
      {
        title: "New Service Category",
        subtitle: "Category description",
        display_order: categories.length,
        page: "services",
        items: [],
      },
    ]);
    setOpenCategories({ ...openCategories, [newId]: true });
  };

  const deleteCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const addItem = (categoryIndex: number) => {
    const newCategories = [...categories];
    newCategories[categoryIndex].items.push({
      title: "New Service",
      image_url: "",
      author: "Harva Team",
      display_order: newCategories[categoryIndex].items.length,
    });
    setCategories(newCategories);
  };

  const deleteItem = (categoryIndex: number, itemIndex: number) => {
    const newCategories = [...categories];
    newCategories[categoryIndex].items = newCategories[categoryIndex].items.filter(
      (_, i) => i !== itemIndex
    );
    setCategories(newCategories);
  };

  const toggleCategory = (id: string) => {
    setOpenCategories({ ...openCategories, [id]: !openCategories[id] });
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
      <div className="p-6 md:p-8 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Services Page</h1>
            <p className="text-muted-foreground mt-1">
              Manage service categories and items for the services page
            </p>
          </div>
          <Button onClick={addCategory} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>

        <div className="space-y-6">
          {categories.map((category, catIndex) => (
            <Card key={category.id || `cat-${catIndex}`}>
              <Collapsible
                open={openCategories[category.id || `cat-${catIndex}`]}
                onOpenChange={() => toggleCategory(category.id || `cat-${catIndex}`)}
              >
                <CardHeader className="cursor-pointer">
                  <CollapsibleTrigger className="flex items-center justify-between w-full">
                    <CardTitle className="text-lg">{category.title || "Untitled Category"}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteCategory(catIndex);
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                      {openCategories[category.id || `cat-${catIndex}`] ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                  </CollapsibleTrigger>
                </CardHeader>

                <CollapsibleContent>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label>Category Title</Label>
                        <Input
                          value={category.title}
                          onChange={(e) => {
                            const newCategories = [...categories];
                            newCategories[catIndex].title = e.target.value;
                            setCategories(newCategories);
                          }}
                          placeholder="e.g., Core Primary Health Care Services"
                        />
                      </div>
                      <div>
                        <Label>Display Order</Label>
                        <Input
                          type="number"
                          value={category.display_order}
                          onChange={(e) => {
                            const newCategories = [...categories];
                            newCategories[catIndex].display_order = parseInt(e.target.value) || 0;
                            setCategories(newCategories);
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Category Subtitle</Label>
                      <Input
                        value={category.subtitle}
                        onChange={(e) => {
                          const newCategories = [...categories];
                          newCategories[catIndex].subtitle = e.target.value;
                          setCategories(newCategories);
                        }}
                        placeholder="Category description..."
                      />
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">Service Items</h3>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addItem(catIndex)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Item
                        </Button>
                      </div>

                      <div className="space-y-4">
                        {category.items.map((item, itemIndex) => (
                          <div
                            key={item.id || `item-${itemIndex}`}
                            className="border rounded-lg p-4 bg-muted/30"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <span className="text-sm font-medium text-muted-foreground">
                                Item #{itemIndex + 1}
                              </span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteItem(catIndex, itemIndex)}
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>

                            <div className="grid gap-3 md:grid-cols-2">
                              <div className="md:col-span-2">
                                <Label>Title</Label>
                                <Input
                                  value={item.title}
                                  onChange={(e) => {
                                    const newCategories = [...categories];
                                    newCategories[catIndex].items[itemIndex].title = e.target.value;
                                    setCategories(newCategories);
                                  }}
                                  placeholder="Service title"
                                />
                              </div>
                              <div>
                                <Label>Image URL</Label>
                                <Input
                                  value={item.image_url}
                                  onChange={(e) => {
                                    const newCategories = [...categories];
                                    newCategories[catIndex].items[itemIndex].image_url = e.target.value;
                                    setCategories(newCategories);
                                  }}
                                  placeholder="https://..."
                                />
                              </div>
                              <div>
                                <Label>Author</Label>
                                <Input
                                  value={item.author}
                                  onChange={(e) => {
                                    const newCategories = [...categories];
                                    newCategories[catIndex].items[itemIndex].author = e.target.value;
                                    setCategories(newCategories);
                                  }}
                                  placeholder="Harva Team"
                                />
                              </div>
                            </div>
                          </div>
                        ))}

                        {category.items.length === 0 && (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            No items yet. Click "Add Item" to create one.
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}

          {categories.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">No service categories yet.</p>
                <Button onClick={addCategory}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Category
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="mt-8">
          <Button onClick={saveServices} disabled={saving} size="lg">
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Services
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ServicesSection;
