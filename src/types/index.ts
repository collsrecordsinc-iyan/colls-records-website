export type UserRole = 'admin' | 'staff' | 'client';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  role: UserRole;
  created_at?: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  featured_artists?: string;
  producer?: string;
  cover_url: string;
  audio_url: string;
  youtube_url?: string;
  genre: string;
  release_date: string;
  description?: string;
  play_count: number;
  is_published: boolean;
  duration?: string;
  created_at?: string;
}

export interface VideoItem {
  id: string;
  title: string;
  youtube_url?: string;
  video_url?: string;
  thumbnail_url: string;
  category: 'music_video' | 'documentary' | 'film' | 'behind_the_scenes';
  description?: string;
  is_featured: boolean;
  is_published: boolean;
  created_at?: string;
}

export interface TeamMember {
  id: string;
  full_name: string;
  stage_name?: string;
  role: string;
  bio: string;
  photo_url: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  socials?: {
    instagram?: string;
    youtube?: string;
    twitter?: string;
    linkedin?: string;
  };
  display_order: number;
  is_active: boolean;
  joined_date?: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  swahili_name?: string;
  swahili_description?: string;
  icon: string;
  image_url: string;
  starting_price: number; // in TZS
  category: 'audio' | 'video' | 'creative';
  display_order: number;
}

export interface PricingPackage {
  id: string;
  category: 'Recording' | 'Beats' | 'Mixing' | 'Mastering' | 'Full Song' | 'Promotion' | 'Distribution' | 'Video & Film';
  name: string;
  swahili_name?: string;
  price_tzs: number;
  unit: string;
  features: string[];
  swahili_features?: string[];
  is_popular: boolean;
  display_order: number;
  is_active: boolean;
}

export interface TickerItem {
  id: string;
  text: string;
  swahili_text?: string;
  link?: string;
  priority: 'normal' | 'urgent' | 'promo';
  is_active: boolean;
  display_order: number;
  created_at?: string;
}

export interface NewsPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  cover_url: string;
  author: string;
  category: string;
  published_at: string;
  is_published: boolean;
}

export interface Booking {
  id: string;
  client_id?: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  service_id: string;
  service_name: string;
  package_id?: string;
  package_name?: string;
  preferred_date: string;
  preferred_time?: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  assigned_to?: string; // Producer name
  price_tzs: number;
  created_at: string;
}

export interface ClientProject {
  id: string;
  booking_id?: string;
  client_id: string;
  client_name: string;
  title: string;
  service: string;
  status: 'planning' | 'recording' | 'mixing' | 'mastering' | 'review' | 'delivered';
  progress: number; // 0 to 100
  notes?: string;
  producer: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectFile {
  id: string;
  project_id: string;
  file_name: string;
  file_url: string;
  file_type: 'audio' | 'stems' | 'document' | 'video';
  file_size: string;
  version: string;
  uploaded_by: string;
  is_final: boolean;
  created_at: string;
}

export interface Invoice {
  id: string;
  booking_id?: string;
  client_name: string;
  client_email: string;
  amount_tzs: number;
  status: 'unpaid' | 'paid' | 'partially_paid' | 'overdue';
  due_date: string;
  payment_method?: 'M-Pesa' | 'Tigo Pesa' | 'Airtel Money' | 'Bank Transfer' | 'Cash';
  items: Array<{ description: string; amount_tzs: number }>;
  created_at: string;
}

export interface MessageItem {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  is_read: boolean;
  replied: boolean;
  created_at: string;
}

export interface MediaItem {
  id: string;
  file_name: string;
  file_url: string;
  file_type: 'image' | 'audio' | 'video' | 'document';
  size: string;
  uploaded_by: string;
  bucket: 'media' | 'audio' | 'videos' | 'client-files';
  created_at: string;
}

export interface SiteContent {
  hero_headline: string;
  hero_subheadline: string;
  hero_banner_url: string;
  hero_video_url: string;
  featured_video_url: string;
  stats: {
    songs_produced: number;
    artists_recorded: number;
    years_experience: number;
    multimedia_projects: number;
  };
  about: {
    story: string;
    mission: string;
    vision: string;
    core_values: string[];
    creative_process: Array<{ step: string; title: string; desc: string }>;
  };
  contact: {
    email: string;
    location: string;
    address: string;
    youtube: string;
    producer_1: { name: string; phone: string; whatsapp: string };
    producer_2: { name: string; phone: string; whatsapp: string };
  };
}

export interface ActivityLog {
  id: string;
  user_name: string;
  action: string;
  details: string;
  timestamp: string;
}
