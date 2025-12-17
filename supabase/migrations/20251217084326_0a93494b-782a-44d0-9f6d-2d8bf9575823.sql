-- Service categories (for grouping services on the services page)
CREATE TABLE public.service_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  page TEXT NOT NULL DEFAULT 'services', -- which page this category belongs to
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Service items (individual service cards within categories)
CREATE TABLE public.service_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES public.service_categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  image_url TEXT,
  author TEXT NOT NULL DEFAULT 'Harva Team',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Page-specific CTA sections (for services page, contact page CTAs)
CREATE TABLE public.page_cta_sections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_name TEXT NOT NULL UNIQUE, -- 'services_top', 'services_photobio', 'contact'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  button_text TEXT,
  button_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_cta_sections ENABLE ROW LEVEL SECURITY;

-- RLS Policies for service_categories
CREATE POLICY "Anyone can view service categories" ON public.service_categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage service categories" ON public.service_categories FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for service_items
CREATE POLICY "Anyone can view service items" ON public.service_items FOR SELECT USING (true);
CREATE POLICY "Admins can manage service items" ON public.service_items FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for page_cta_sections
CREATE POLICY "Anyone can view page cta sections" ON public.page_cta_sections FOR SELECT USING (true);
CREATE POLICY "Admins can manage page cta sections" ON public.page_cta_sections FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Triggers for updated_at
CREATE TRIGGER update_service_categories_updated_at BEFORE UPDATE ON public.service_categories FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_service_items_updated_at BEFORE UPDATE ON public.service_items FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_page_cta_sections_updated_at BEFORE UPDATE ON public.page_cta_sections FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();