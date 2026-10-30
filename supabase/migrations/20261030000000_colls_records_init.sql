-- ==============================================================================
-- COLLS RECORDS — SUPABASE DATABASE MIGRATION & SCHEMA
-- Location: Tanga, Tanzania
-- Designed & Developed by Iyan Eman Juma
-- ==============================================================================

-- HOW TO RUN THIS IN SUPABASE:
-- 1. Create a project at https://supabase.com
-- 2. Open SQL Editor in your Supabase dashboard
-- 3. Paste and run this entire file
-- 4. Enable Realtime for tables: ticker_items, bookings, messages, songs
-- 5. To promote your first user to admin, run:
--    INSERT INTO public.user_roles (user_id, role)
--    VALUES ('<USER-UUID-FROM-AUTH>', 'admin')
--    ON CONFLICT (user_id, role) DO NOTHING;
-- ==============================================================================

-- 1. EXTENSIONS & ENUMS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ BEGIN
  CREATE TYPE app_role AS ENUM ('admin', 'staff', 'client');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE booking_status_type AS ENUM ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE project_status_type AS ENUM ('planning', 'recording', 'mixing', 'mastering', 'review', 'delivered');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE invoice_status_type AS ENUM ('unpaid', 'paid', 'partially_paid', 'overdue');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 2. USER PROFILES & ROLES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL DEFAULT '',
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'client',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, role)
);

CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);

-- SECURITY DEFINER Function for non-recursive role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- Helper to check if caller is staff or admin
CREATE OR REPLACE FUNCTION public.is_staff_or_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin', 'staff')
  );
$$;

-- Trigger to create profile upon new signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', '')
  )
  ON CONFLICT (id) DO NOTHING;

  -- Default role: client
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'client')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. DOMAIN TABLES
CREATE TABLE IF NOT EXISTS public.songs (
  id TEXT PRIMARY KEY DEFAULT ('song-' || replace(uuid_generate_v4()::text, '-', '')),
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  featured_artists TEXT,
  producer TEXT,
  cover_url TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  youtube_url TEXT,
  genre TEXT NOT NULL DEFAULT 'Bongo Flava',
  release_date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT,
  play_count BIGINT NOT NULL DEFAULT 0,
  duration TEXT DEFAULT '3:30',
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.videos (
  id TEXT PRIMARY KEY DEFAULT ('vid-' || replace(uuid_generate_v4()::text, '-', '')),
  title TEXT NOT NULL,
  youtube_url TEXT,
  video_url TEXT,
  thumbnail_url TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'music_video',
  description TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.team_members (
  id TEXT PRIMARY KEY DEFAULT ('team-' || replace(uuid_generate_v4()::text, '-', '')),
  full_name TEXT NOT NULL,
  stage_name TEXT,
  role TEXT NOT NULL,
  bio TEXT NOT NULL,
  photo_url TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  whatsapp TEXT,
  socials JSONB DEFAULT '{}'::jsonb,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  joined_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY DEFAULT ('srv-' || replace(uuid_generate_v4()::text, '-', '')),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  swahili_name TEXT,
  swahili_description TEXT,
  icon TEXT NOT NULL DEFAULT 'Music2',
  image_url TEXT NOT NULL,
  starting_price BIGINT NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'audio',
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.pricing_packages (
  id TEXT PRIMARY KEY DEFAULT ('prc-' || replace(uuid_generate_v4()::text, '-', '')),
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  swahili_name TEXT,
  price_tzs BIGINT NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'per track',
  features TEXT[] NOT NULL DEFAULT '{}',
  swahili_features TEXT[] DEFAULT '{}',
  is_popular BOOLEAN NOT NULL DEFAULT false,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ticker_items (
  id TEXT PRIMARY KEY DEFAULT ('t-' || replace(uuid_generate_v4()::text, '-', '')),
  text TEXT NOT NULL,
  swahili_text TEXT,
  link TEXT,
  priority TEXT NOT NULL DEFAULT 'normal',
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.news_posts (
  id TEXT PRIMARY KEY DEFAULT ('news-' || replace(uuid_generate_v4()::text, '-', '')),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  cover_url TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'Colls Records',
  category TEXT NOT NULL DEFAULT 'Studio News',
  published_at DATE NOT NULL DEFAULT CURRENT_DATE,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.site_content (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY DEFAULT ('bk-' || replace(uuid_generate_v4()::text, '-', '')),
  client_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  service_id TEXT NOT NULL,
  service_name TEXT NOT NULL,
  package_name TEXT,
  preferred_date DATE NOT NULL,
  preferred_time TEXT,
  notes TEXT,
  status booking_status_type NOT NULL DEFAULT 'pending',
  assigned_to TEXT,
  price_tzs BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.client_projects (
  id TEXT PRIMARY KEY DEFAULT ('proj-' || replace(uuid_generate_v4()::text, '-', '')),
  booking_id TEXT REFERENCES public.bookings(id) ON DELETE SET NULL,
  client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  title TEXT NOT NULL,
  service TEXT NOT NULL,
  status project_status_type NOT NULL DEFAULT 'planning',
  progress INT NOT NULL DEFAULT 0,
  notes TEXT,
  producer TEXT NOT NULL DEFAULT 'Peter Manyama (New Beats)',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.project_files (
  id TEXT PRIMARY KEY DEFAULT ('pf-' || replace(uuid_generate_v4()::text, '-', '')),
  project_id TEXT NOT NULL REFERENCES public.client_projects(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL DEFAULT 'audio',
  file_size TEXT NOT NULL DEFAULT '0 MB',
  version TEXT NOT NULL DEFAULT 'v1',
  uploaded_by TEXT NOT NULL,
  is_final BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.invoices (
  id TEXT PRIMARY KEY,
  booking_id TEXT REFERENCES public.bookings(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  amount_tzs BIGINT NOT NULL,
  status invoice_status_type NOT NULL DEFAULT 'unpaid',
  due_date DATE NOT NULL,
  payment_method TEXT,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.messages (
  id TEXT PRIMARY KEY DEFAULT ('msg-' || replace(uuid_generate_v4()::text, '-', '')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  replied BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.media_library (
  id TEXT PRIMARY KEY DEFAULT ('media-' || replace(uuid_generate_v4()::text, '-', '')),
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  size TEXT NOT NULL,
  uploaded_by TEXT NOT NULL,
  bucket TEXT NOT NULL,
  path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.activity_logs (
  id TEXT PRIMARY KEY DEFAULT ('act-' || replace(uuid_generate_v4()::text, '-', '')),
  user_name TEXT NOT NULL,
  action TEXT NOT NULL,
  details TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticker_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Public Read for Published Content
CREATE POLICY "Public songs are viewable by anyone" ON public.songs
  FOR SELECT USING (is_published = true OR auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role IN ('admin', 'staff')));

CREATE POLICY "Public videos are viewable by anyone" ON public.videos
  FOR SELECT USING (is_published = true OR auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role IN ('admin', 'staff')));

CREATE POLICY "Active team members are viewable by anyone" ON public.team_members
  FOR SELECT USING (is_active = true OR auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role IN ('admin', 'staff')));

CREATE POLICY "Services are viewable by anyone" ON public.services
  FOR SELECT USING (true);

CREATE POLICY "Active pricing packages are viewable by anyone" ON public.pricing_packages
  FOR SELECT USING (is_active = true OR auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role IN ('admin', 'staff')));

CREATE POLICY "Active ticker items are viewable by anyone" ON public.ticker_items
  FOR SELECT USING (is_active = true OR auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role IN ('admin', 'staff')));

CREATE POLICY "Published news posts are viewable by anyone" ON public.news_posts
  FOR SELECT USING (is_published = true OR auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role IN ('admin', 'staff')));

CREATE POLICY "Site content is viewable by anyone" ON public.site_content
  FOR SELECT USING (true);

-- Public insert for contact messages & bookings
CREATE POLICY "Anyone can submit a contact message" ON public.messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can submit a booking request" ON public.bookings
  FOR INSERT WITH CHECK (true);

-- Client access for their own bookings/projects/files
CREATE POLICY "Clients can view own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = client_id OR auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role IN ('admin', 'staff')));

CREATE POLICY "Clients can view own projects" ON public.client_projects
  FOR SELECT USING (auth.uid() = client_id OR auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role IN ('admin', 'staff')));

CREATE POLICY "Clients can view project files for their projects" ON public.project_files
  FOR SELECT USING (
    project_id IN (SELECT id FROM public.client_projects WHERE client_id = auth.uid())
    OR auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role IN ('admin', 'staff'))
  );

CREATE POLICY "Clients can upload reference files for their projects" ON public.project_files
  FOR INSERT WITH CHECK (
    project_id IN (SELECT id FROM public.client_projects WHERE client_id = auth.uid())
    OR auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role IN ('admin', 'staff'))
  );

-- Staff and Admin Full Control
CREATE POLICY "Staff and Admins manage all tables" ON public.songs
  FOR ALL USING (public.is_staff_or_admin(auth.uid()));

CREATE POLICY "Staff and Admins manage videos" ON public.videos
  FOR ALL USING (public.is_staff_or_admin(auth.uid()));

CREATE POLICY "Staff and Admins manage team" ON public.team_members
  FOR ALL USING (public.is_staff_or_admin(auth.uid()));

CREATE POLICY "Staff and Admins manage services" ON public.services
  FOR ALL USING (public.is_staff_or_admin(auth.uid()));

CREATE POLICY "Staff and Admins manage pricing" ON public.pricing_packages
  FOR ALL USING (public.is_staff_or_admin(auth.uid()));

CREATE POLICY "Staff and Admins manage ticker" ON public.ticker_items
  FOR ALL USING (public.is_staff_or_admin(auth.uid()));

CREATE POLICY "Staff and Admins manage news" ON public.news_posts
  FOR ALL USING (public.is_staff_or_admin(auth.uid()));

CREATE POLICY "Staff and Admins manage site content" ON public.site_content
  FOR ALL USING (public.is_staff_or_admin(auth.uid()));

CREATE POLICY "Staff and Admins manage bookings" ON public.bookings
  FOR ALL USING (public.is_staff_or_admin(auth.uid()));

CREATE POLICY "Staff and Admins manage client projects" ON public.client_projects
  FOR ALL USING (public.is_staff_or_admin(auth.uid()));

CREATE POLICY "Staff and Admins manage project files" ON public.project_files
  FOR ALL USING (public.is_staff_or_admin(auth.uid()));

CREATE POLICY "Staff and Admins manage invoices" ON public.invoices
  FOR ALL USING (public.is_staff_or_admin(auth.uid()));

CREATE POLICY "Staff and Admins manage messages" ON public.messages
  FOR ALL USING (public.is_staff_or_admin(auth.uid()));

CREATE POLICY "Staff and Admins manage media library" ON public.media_library
  FOR ALL USING (public.is_staff_or_admin(auth.uid()));

CREATE POLICY "Staff and Admins view activity logs" ON public.activity_logs
  FOR ALL USING (public.is_staff_or_admin(auth.uid()));

-- 5. STORAGE BUCKETS (Run in SQL or create in Dashboard)
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('media', 'media', true),
  ('audio', 'audio', true),
  ('videos', 'videos', true),
  ('client-files', 'client-files', false)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Public media access" ON storage.objects
  FOR SELECT USING (bucket_id IN ('media', 'audio', 'videos'));

CREATE POLICY "Staff/Admin upload to all buckets" ON storage.objects
  FOR ALL USING (public.is_staff_or_admin(auth.uid()));

-- ==============================================================================
-- 6. INITIAL SEED DATA
-- ==============================================================================

-- Songs
INSERT INTO public.songs (id, title, artist, featured_artists, producer, cover_url, audio_url, youtube_url, genre, release_date, description, play_count, duration, is_published)
VALUES 
(
  'song-1',
  'Msaliti (Official Audio)',
  'Colls Records',
  'Colls Family',
  'Peter Manyama (New Beats)',
  'https://res.cloudinary.com/hxdy3cea/image/upload/v1793364493/Studio_Banner_Wall_Portraits.png',
  'https://res.cloudinary.com/hxdy3cea/video/upload/v1793366699/Msaliti_Official_Audio_by_Colls_Records.wav',
  'https://www.youtube.com/@CollsRecords',
  'Bongo Flava / Afro-Fusion',
  '2025-11-14',
  'The monumental studio release from Colls Records capturing heart-rending melodic flows and signature Tanga coastal grooves.',
  2480,
  '3:45',
  true
),
(
  'song-2',
  'Don Salale',
  'Iyan Eman',
  'Zinty',
  'Colls Records & Jacoh Master',
  'https://res.cloudinary.com/hxdy3cea/image/upload/v1793362935/file_00000000a7f88211afb6c4fd65672b92.png',
  'https://res.cloudinary.com/hxdy3cea/video/upload/v1793367458/Don_Salale_Iyan_eman_ft_Zinty_Visualizer_Produced_by_Colls_Records_Jacoh_Master.mp3',
  'https://www.youtube.com/@CollsRecords',
  'Urban Afro / Visualizer Hit',
  '2026-01-20',
  'Electric synergy between Iyan Eman and vocal powerhouse Zinty, produced with precision engineering at Colls Records.',
  5120,
  '3:22',
  true
)
ON CONFLICT (id) DO NOTHING;

-- Team Members
INSERT INTO public.team_members (id, full_name, stage_name, role, bio, photo_url, display_order, is_active, phone, whatsapp)
VALUES 
(
  'team-1',
  'Kelvin Lyamuya',
  NULL,
  'Chief Executive Officer (CEO)',
  'Visionary leader orchestrating Colls Records international expansion, talent acquisition, and creative enterprise throughout East Africa and beyond.',
  'https://res.cloudinary.com/hxdy3cea/image/upload/v1793362643/CEO.png',
  1,
  true,
  NULL,
  NULL
),
(
  'team-2',
  'Ashrack Miraji',
  NULL,
  'Marketing Manager',
  'Strategic brand architect overseeing artist PR, global digital streaming partnerships, tour promotions, and commercial corporate partnerships.',
  'https://res.cloudinary.com/hxdy3cea/image/upload/v1793362703/Marketing_manager.png',
  2,
  true,
  NULL,
  NULL
),
(
  'team-3',
  'Iyan Eman Juma',
  'Iyan Eman',
  'Head of Digital, Multimedia & Brand Growth',
  'The creative catalyst behind Colls Records digital presence, web architecture, UI/UX systems, visual storytelling, and viral growth campaigns.',
  'https://res.cloudinary.com/hxdy3cea/image/upload/v1793362831/NEW_ERA_2026.jpg',
  3,
  true,
  NULL,
  NULL
),
(
  'team-4',
  'Peter Manyama',
  'New Beats',
  'Chief Producer',
  'Legendary sound sculptor with acoustic mastery in Afro-Beats, Amapiano, Singeli, and R&B. Lead engineer on Colls Records top-charting records.',
  'https://res.cloudinary.com/hxdy3cea/image/upload/v1793362238/Cinematic_Producer_Portrait_with_Blue_Locs.png',
  4,
  true,
  '+255741808971',
  'https://wa.me/255741808971'
),
(
  'team-5',
  'Jackson Paul',
  'Jacoh Master',
  'Assistant Producer & Audio Engineer',
  'Precision mixing and mastering virtuoso specializing in acoustic clarity, spatial dynamics, vocal layering, and multi-track stems balancing.',
  'https://res.cloudinary.com/hxdy3cea/image/upload/v1793364686/file_00000000bb248211ae52b82e10503011.png',
  5,
  true,
  '+255620742182',
  'https://wa.me/255620742182'
),
(
  'team-6',
  'Upendo Eliud',
  NULL,
  'Studio Operations & Receptionist',
  'Client experience champion ensuring studio booking schedules, artist hospitality, session log management, and executive front-desk liaison.',
  'https://res.cloudinary.com/hxdy3cea/image/upload/v1793362723/Reall_Estate_Profile.jpg',
  6,
  true,
  NULL,
  NULL
),
(
  'team-7',
  'Zenaty Baruti',
  'Zinty',
  'Featured Artist & Vocal Stylist',
  'Sensational vocal force and songwriter under Colls Records whose magnetic timbre and lyrical range deliver uncompromised emotional resonance.',
  'https://res.cloudinary.com/hxdy3cea/image/upload/v1793362935/file_00000000a7f88211afb6c4fd65672b92.png',
  7,
  true,
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;

-- Ticker Items
INSERT INTO public.ticker_items (id, text, swahili_text, link, priority, is_active, display_order)
VALUES
(
  't-1',
  '🔥 NEW RELEASE: ''Don Salale'' by Iyan Eman ft. Zinty — Stream now on all platforms!',
  '🔥 WIMBO MPYA: ''Don Salale'' ya Iyan Eman ft. Zinty — Sikiliza sasa kwenye mifumo yote!',
  '/music',
  'promo',
  true,
  1
),
(
  't-2',
  '🎙️ STUDIO SPECIAL: Book a 5-hour recording block this month & receive free professional stereo mastering!',
  '🎙️ OFA YA STUDIO: Lipia masaa 5 ya kurekodi mwezi huu upate mastering ya bure!',
  '/book',
  'urgent',
  true,
  2
),
(
  't-3',
  '🌍 Colls Records signs new talent in Tanga! Connect with Chief Producer New Beats on WhatsApp: +255741808971',
  '🌍 Colls Records inakaribisha wasanii wapya Tanga! Wasiliana na Chief Producer New Beats WhatsApp: +255741808971',
  '/team',
  'normal',
  true,
  3
)
ON CONFLICT (id) DO NOTHING;

-- End of Colls Records Migration
