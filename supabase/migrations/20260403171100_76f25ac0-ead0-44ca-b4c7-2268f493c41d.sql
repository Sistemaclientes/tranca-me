CREATE OR REPLACE VIEW public.active_braiders AS
SELECT id, user_id, name, whatsapp, email, instagram, facebook, description,
    city, neighborhood, services, braid_types, image_url, created_at, updated_at,
    professional_name, pricing, gallery_urls, video_url, is_premium, premium_since,
    plan_tier, whatsapp_click_count, view_count, trial_ends_at, status, mercado_pago_id,
    average_rating, total_reviews, leads_count,
    CASE
        WHEN status = 'active' THEN 1
        WHEN status = 'trial' THEN 2
        ELSE 3
    END AS display_priority
FROM braider_profiles bp
WHERE status = 'active' OR (status = 'trial' AND trial_ends_at > now());