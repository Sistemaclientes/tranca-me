-- Drop and recreate active_braiders view to include braid_types
DROP VIEW IF EXISTS public.active_braiders;

CREATE VIEW public.active_braiders AS
 SELECT bp.id,
    bp.user_id,
    bp.name,
    bp.whatsapp,
    bp.email,
    bp.instagram,
    bp.facebook,
    bp.description,
    bp.city,
    bp.neighborhood,
    bp.services,
    bp.braid_types,
    bp.image_url,
    bp.created_at,
    bp.updated_at,
    bp.professional_name,
    bp.pricing,
    bp.gallery_urls,
    bp.video_url,
    bp.is_premium,
    bp.premium_since,
    bp.plan_tier,
    bp.whatsapp_click_count,
    bp.view_count,
    bp.trial_ends_at,
    bp.status,
    bp.mercado_pago_id,
    bp.average_rating,
    bp.total_reviews,
    bp.leads_count,
        CASE
            WHEN (bp.status = 'active'::text) THEN 1
            WHEN (bp.status = 'trial'::text) THEN 2
            ELSE 3
        END AS display_priority
   FROM public.braider_profiles bp
  WHERE ((bp.status = 'active'::text) OR ((bp.status = 'trial'::text) AND (bp.trial_ends_at > now())));
