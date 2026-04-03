-- Ensure user_roles table exists and is configured
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_roles') THEN
        CREATE TABLE public.user_roles (
            id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            role TEXT NOT NULL CHECK (role IN ('admin', 'trancista', 'cliente')),
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            UNIQUE(user_id, role)
        );
        
        ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin'));
        CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
    END IF;
END $$;

-- Insert admin role for the specific user
INSERT INTO public.user_roles (user_id, role)
VALUES ('2e1cf899-1114-4519-85ea-9835cfa11c58', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
