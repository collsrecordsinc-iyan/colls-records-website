import { supabase, isSupabaseConfigured } from './supabase';
import { firestoreDb, testFirestoreConnection } from './firebase';
import { doc, setDoc, getDocs, collection } from 'firebase/firestore';
import {
  Song,
  VideoItem,
  TeamMember,
  ServiceItem,
  PricingPackage,
  TickerItem,
  NewsPost,
  Booking,
  ClientProject,
  ProjectFile,
  Invoice,
  MessageItem,
  MediaItem,
  SiteContent,
  ActivityLog,
  Profile
} from '../types';
import {
  INITIAL_SONGS,
  INITIAL_VIDEOS,
  INITIAL_TEAM,
  INITIAL_SERVICES,
  INITIAL_PRICING,
  INITIAL_TICKER,
  INITIAL_NEWS,
  INITIAL_SITE_CONTENT
} from './constants';

const DB_KEYS = {
  SONGS: 'colls_db_songs',
  VIDEOS: 'colls_db_videos',
  TEAM: 'colls_db_team',
  SERVICES: 'colls_db_services',
  PRICING: 'colls_db_pricing',
  TICKER: 'colls_db_ticker',
  NEWS: 'colls_db_news',
  BOOKINGS: 'colls_db_bookings',
  PROJECTS: 'colls_db_projects',
  PROJECT_FILES: 'colls_db_project_files',
  INVOICES: 'colls_db_invoices',
  MESSAGES: 'colls_db_messages',
  MEDIA: 'colls_db_media',
  SITE_CONTENT: 'colls_db_site_content',
  ACTIVITY_LOGS: 'colls_db_activity_logs',
  CURRENT_USER: 'colls_db_user'
};

// Initial sample seed records for client portal & admin testing
const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bk-101',
    client_name: 'Rashid Bakari (Alikiba Fan Club)',
    client_email: 'rashid.bakari@gmail.com',
    client_phone: '+255712345678',
    service_id: 'srv-1',
    service_name: 'Music Recording',
    package_name: 'Full Day Lockout Session',
    preferred_date: '2026-11-05',
    preferred_time: '14:00',
    notes: 'Recording 2 vocal singles for regional album release. Needs acoustic guitar mic setup.',
    status: 'confirmed',
    assigned_to: 'Peter Manyama (New Beats)',
    price_tzs: 180000,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'bk-102',
    client_name: 'Amina Salum',
    client_email: 'amina.music@yahoo.com',
    client_phone: '+255755123456',
    service_id: 'srv-3',
    service_name: 'Audio Mixing',
    package_name: 'Pro Audio Mixing',
    preferred_date: '2026-11-08',
    preferred_time: '10:00',
    notes: '24 vocal and percussion stems uploaded to client files.',
    status: 'in_progress',
    assigned_to: 'Jackson Paul (Jacoh Master)',
    price_tzs: 100000,
    created_at: new Date(Date.now() - 86400000 * 4).toISOString()
  }
];

const INITIAL_PROJECTS: ClientProject[] = [
  {
    id: 'proj-1',
    booking_id: 'bk-102',
    client_id: 'client-1',
    client_name: 'Amina Salum',
    title: 'Safari Ya Pwani (Album Single)',
    service: 'Audio Mixing & Vocal Tuning',
    status: 'mixing',
    progress: 75,
    notes: 'Lead vocals tuned and compressed. Jacoh Master adjusting analog saturation on percussion.',
    producer: 'Jackson Paul (Jacoh Master)',
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

const INITIAL_FILES: ProjectFile[] = [
  {
    id: 'pf-1',
    project_id: 'proj-1',
    file_name: 'Safari_Ya_Pwani_Vocal_Mix_v2.wav',
    file_url: 'https://res.cloudinary.com/hxdy3cea/video/upload/v1793367458/Don_Salale_Iyan_eman_ft_Zinty_Visualizer_Produced_by_Colls_Records_Jacoh_Master.mp3',
    file_type: 'audio',
    file_size: '34.2 MB',
    version: 'v2.1',
    uploaded_by: 'Jackson Paul (Jacoh Master)',
    is_final: false,
    created_at: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'INV-2026-001',
    booking_id: 'bk-101',
    client_name: 'Rashid Bakari',
    client_email: 'rashid.bakari@gmail.com',
    amount_tzs: 180000,
    status: 'paid',
    due_date: '2026-11-04',
    payment_method: 'M-Pesa',
    items: [{ description: 'Full Day Lockout Studio Session (8 Hours)', amount_tzs: 180000 }],
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'INV-2026-002',
    booking_id: 'bk-102',
    client_name: 'Amina Salum',
    client_email: 'amina.music@yahoo.com',
    amount_tzs: 100000,
    status: 'unpaid',
    due_date: '2026-11-09',
    payment_method: 'Tigo Pesa',
    items: [{ description: 'Pro Audio Mixing (Up to 48 multitrack stems)', amount_tzs: 100000 }],
    created_at: new Date(Date.now() - 86400000 * 4).toISOString()
  }
];

const INITIAL_MESSAGES: MessageItem[] = [
  {
    id: 'msg-1',
    name: 'Baraka Mnyika',
    email: 'baraka@coastalbeats.tz',
    phone: '+255744889900',
    subject: 'Collaboration inquiry on Afro-Taarab project',
    message: 'Hello Colls Records team. We are producing a coastal heritage EP and would love to contract Jacoh Master and New Beats for 4 songs mixing.',
    is_read: false,
    replied: false,
    created_at: new Date(Date.now() - 3600000 * 4).toISOString()
  }
];

const INITIAL_ACTIVITY: ActivityLog[] = [
  {
    id: 'act-1',
    user_name: 'Iyan Eman',
    action: 'Release Published',
    details: 'Released new song "Don Salale" to global music catalogue',
    timestamp: new Date(Date.now() - 3600000 * 8).toISOString()
  },
  {
    id: 'act-2',
    user_name: 'Kelvin Lyamuya',
    action: 'Booking Approved',
    details: 'Confirmed 8-hour Lockout session for Rashid Bakari',
    timestamp: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

// Helper to get from local storage or set defaults
function getStored<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(item);
  } catch {
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent('colls_db_updated', { detail: { key } }));
  } catch (e) {
    console.error('Storage write error', e);
  }
}

// Database Service
export const db = {
  // Activity logs
  logActivity: (action: string, details: string, user_name: string = 'Staff Admin') => {
    const logs = getStored<ActivityLog[]>(DB_KEYS.ACTIVITY_LOGS, INITIAL_ACTIVITY);
    const newLog: ActivityLog = {
      id: `act-${Date.now()}`,
      user_name,
      action,
      details,
      timestamp: new Date().toISOString()
    };
    setStored(DB_KEYS.ACTIVITY_LOGS, [newLog, ...logs.slice(0, 49)]);
  },

  getActivityLogs: async (): Promise<ActivityLog[]> => {
    return getStored<ActivityLog[]>(DB_KEYS.ACTIVITY_LOGS, INITIAL_ACTIVITY);
  },

  // Songs
  getSongs: async (): Promise<Song[]> => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('songs').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data as Song[];
      } catch (err) {
        console.warn('Supabase fetch failed, falling back to local state:', err);
      }
    }
    return getStored<Song[]>(DB_KEYS.SONGS, INITIAL_SONGS);
  },

  createSong: async (song: Omit<Song, 'id' | 'play_count' | 'created_at'>): Promise<Song> => {
    const newSong: Song = {
      ...song,
      id: `song-${Date.now()}`,
      play_count: 0,
      created_at: new Date().toISOString()
    };
    if (isSupabaseConfigured) {
      try {
        await supabase.from('songs').insert(newSong);
      } catch (e) {
        console.error('Supabase insert error', e);
      }
    }
    const current = getStored<Song[]>(DB_KEYS.SONGS, INITIAL_SONGS);
    const updated = [newSong, ...current];
    setStored(DB_KEYS.SONGS, updated);
    db.logActivity('Song Created', `Added song "${newSong.title}" by ${newSong.artist}`);
    return newSong;
  },

  updateSong: async (id: string, updates: Partial<Song>): Promise<Song | null> => {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('songs').update(updates).eq('id', id);
      } catch (e) {
        console.error(e);
      }
    }
    const current = getStored<Song[]>(DB_KEYS.SONGS, INITIAL_SONGS);
    let updatedSong: Song | null = null;
    const updated = current.map(s => {
      if (s.id === id) {
        updatedSong = { ...s, ...updates };
        return updatedSong;
      }
      return s;
    });
    setStored(DB_KEYS.SONGS, updated);
    if (updatedSong) {
      db.logActivity('Song Updated', `Updated song details for "${(updatedSong as Song).title}"`);
    }
    return updatedSong;
  },

  deleteSong: async (id: string): Promise<boolean> => {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('songs').delete().eq('id', id);
      } catch (e) {
        console.error(e);
      }
    }
    const current = getStored<Song[]>(DB_KEYS.SONGS, INITIAL_SONGS);
    const target = current.find(s => s.id === id);
    const filtered = current.filter(s => s.id !== id);
    setStored(DB_KEYS.SONGS, filtered);
    if (target) {
      db.logActivity('Song Deleted', `Deleted song "${target.title}"`);
    }
    return true;
  },

  incrementPlayCount: async (id: string): Promise<void> => {
    const current = getStored<Song[]>(DB_KEYS.SONGS, INITIAL_SONGS);
    const updated = current.map(s => {
      if (s.id === id) return { ...s, play_count: (s.play_count || 0) + 1 };
      return s;
    });
    setStored(DB_KEYS.SONGS, updated);
  },

  // Videos
  getVideos: async (): Promise<VideoItem[]> => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data as VideoItem[];
      } catch (err) {
        console.warn(err);
      }
    }
    return getStored<VideoItem[]>(DB_KEYS.VIDEOS, INITIAL_VIDEOS);
  },

  createVideo: async (video: Omit<VideoItem, 'id' | 'created_at'>): Promise<VideoItem> => {
    const newVideo: VideoItem = {
      ...video,
      id: `vid-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    if (isSupabaseConfigured) {
      try {
        await supabase.from('videos').insert(newVideo);
      } catch (e) {
        console.error(e);
      }
    }
    const current = getStored<VideoItem[]>(DB_KEYS.VIDEOS, INITIAL_VIDEOS);
    setStored(DB_KEYS.VIDEOS, [newVideo, ...current]);
    db.logActivity('Video Added', `Added video "${newVideo.title}"`);
    return newVideo;
  },

  deleteVideo: async (id: string): Promise<boolean> => {
    const current = getStored<VideoItem[]>(DB_KEYS.VIDEOS, INITIAL_VIDEOS);
    const filtered = current.filter(v => v.id !== id);
    setStored(DB_KEYS.VIDEOS, filtered);
    return true;
  },

  // Team
  getTeamMembers: async (): Promise<TeamMember[]> => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('team_members').select('*').order('display_order', { ascending: true });
        if (!error && data && data.length > 0) return data as TeamMember[];
      } catch (err) {
        console.warn(err);
      }
    }
    return getStored<TeamMember[]>(DB_KEYS.TEAM, INITIAL_TEAM);
  },

  createTeamMember: async (member: Omit<TeamMember, 'id'>): Promise<TeamMember> => {
    const newMember: TeamMember = {
      ...member,
      id: `team-${Date.now()}`
    };
    const current = getStored<TeamMember[]>(DB_KEYS.TEAM, INITIAL_TEAM);
    setStored(DB_KEYS.TEAM, [...current, newMember]);
    db.logActivity('Team Member Added', `Added ${newMember.full_name} (${newMember.role})`);
    return newMember;
  },

  updateTeamMember: async (id: string, updates: Partial<TeamMember>): Promise<TeamMember | null> => {
    const current = getStored<TeamMember[]>(DB_KEYS.TEAM, INITIAL_TEAM);
    let updatedMember: TeamMember | null = null;
    const updated = current.map(m => {
      if (m.id === id) {
        updatedMember = { ...m, ...updates };
        return updatedMember;
      }
      return m;
    });
    setStored(DB_KEYS.TEAM, updated);
    return updatedMember;
  },

  deleteTeamMember: async (id: string): Promise<boolean> => {
    const current = getStored<TeamMember[]>(DB_KEYS.TEAM, INITIAL_TEAM);
    const target = current.find(m => m.id === id);
    setStored(DB_KEYS.TEAM, current.filter(m => m.id !== id));
    if (target) {
      db.logActivity('Team Member Removed', `Removed ${target.full_name}`);
    }
    return true;
  },

  // Services
  getServices: async (): Promise<ServiceItem[]> => {
    return getStored<ServiceItem[]>(DB_KEYS.SERVICES, INITIAL_SERVICES);
  },

  updateService: async (id: string, updates: Partial<ServiceItem>): Promise<void> => {
    const current = getStored<ServiceItem[]>(DB_KEYS.SERVICES, INITIAL_SERVICES);
    const updated = current.map(s => s.id === id ? { ...s, ...updates } : s);
    setStored(DB_KEYS.SERVICES, updated);
  },

  // Pricing
  getPricingPackages: async (): Promise<PricingPackage[]> => {
    return getStored<PricingPackage[]>(DB_KEYS.PRICING, INITIAL_PRICING);
  },

  updatePricingPackage: async (id: string, updates: Partial<PricingPackage>): Promise<void> => {
    const current = getStored<PricingPackage[]>(DB_KEYS.PRICING, INITIAL_PRICING);
    const updated = current.map(p => p.id === id ? { ...p, ...updates } : p);
    setStored(DB_KEYS.PRICING, updated);
    db.logActivity('Pricing Updated', `Updated package details`);
  },

  createPricingPackage: async (pkg: Omit<PricingPackage, 'id'>): Promise<PricingPackage> => {
    const newPkg: PricingPackage = {
      ...pkg,
      id: `prc-${Date.now()}`
    };
    const current = getStored<PricingPackage[]>(DB_KEYS.PRICING, INITIAL_PRICING);
    setStored(DB_KEYS.PRICING, [...current, newPkg]);
    return newPkg;
  },

  // Ticker
  getTickerItems: async (): Promise<TickerItem[]> => {
    return getStored<TickerItem[]>(DB_KEYS.TICKER, INITIAL_TICKER);
  },

  createTickerItem: async (item: Omit<TickerItem, 'id'>): Promise<TickerItem> => {
    const newItem: TickerItem = {
      ...item,
      id: `t-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    const current = getStored<TickerItem[]>(DB_KEYS.TICKER, INITIAL_TICKER);
    setStored(DB_KEYS.TICKER, [newItem, ...current]);
    db.logActivity('Ticker Item Created', `Added announcement: "${newItem.text.slice(0, 30)}..."`);
    return newItem;
  },

  updateTickerItem: async (id: string, updates: Partial<TickerItem>): Promise<void> => {
    const current = getStored<TickerItem[]>(DB_KEYS.TICKER, INITIAL_TICKER);
    const updated = current.map(t => t.id === id ? { ...t, ...updates } : t);
    setStored(DB_KEYS.TICKER, updated);
  },

  deleteTickerItem: async (id: string): Promise<boolean> => {
    const current = getStored<TickerItem[]>(DB_KEYS.TICKER, INITIAL_TICKER);
    setStored(DB_KEYS.TICKER, current.filter(t => t.id !== id));
    return true;
  },

  // News
  getNewsPosts: async (): Promise<NewsPost[]> => {
    return getStored<NewsPost[]>(DB_KEYS.NEWS, INITIAL_NEWS);
  },

  createNewsPost: async (news: Omit<NewsPost, 'id' | 'published_at'>): Promise<NewsPost> => {
    const newPost: NewsPost = {
      ...news,
      id: `news-${Date.now()}`,
      published_at: new Date().toISOString().split('T')[0]
    };
    const current = getStored<NewsPost[]>(DB_KEYS.NEWS, INITIAL_NEWS);
    setStored(DB_KEYS.NEWS, [newPost, ...current]);
    db.logActivity('Article Published', `Published article: "${newPost.title}"`);
    return newPost;
  },

  // Bookings
  getBookings: async (): Promise<Booking[]> => {
    return getStored<Booking[]>(DB_KEYS.BOOKINGS, INITIAL_BOOKINGS);
  },

  createBooking: async (booking: Omit<Booking, 'id' | 'created_at' | 'status'>): Promise<Booking> => {
    const newBooking: Booking = {
      ...booking,
      id: `bk-${Date.now()}`,
      status: 'pending',
      created_at: new Date().toISOString()
    };
    try {
      await setDoc(doc(firestoreDb, 'bookings', newBooking.id), newBooking);
    } catch (e) {
      console.warn('Firestore booking write notice:', e);
    }
    const current = getStored<Booking[]>(DB_KEYS.BOOKINGS, INITIAL_BOOKINGS);
    setStored(DB_KEYS.BOOKINGS, [newBooking, ...current]);
    db.logActivity('Booking Received', `New booking request from ${newBooking.client_name} for ${newBooking.service_name}`);
    return newBooking;
  },

  updateBookingStatus: async (id: string, status: Booking['status'], assigned_to?: string): Promise<void> => {
    const current = getStored<Booking[]>(DB_KEYS.BOOKINGS, INITIAL_BOOKINGS);
    const updated = current.map(b => {
      if (b.id === id) {
        return {
          ...b,
          status,
          ...(assigned_to ? { assigned_to } : {})
        };
      }
      return b;
    });
    setStored(DB_KEYS.BOOKINGS, updated);
    db.logActivity('Booking Status Changed', `Booking ${id} status set to "${status}"`);
  },

  // Client Projects
  getClientProjects: async (clientId?: string): Promise<ClientProject[]> => {
    const projects = getStored<ClientProject[]>(DB_KEYS.PROJECTS, INITIAL_PROJECTS);
    if (clientId) return projects.filter(p => p.client_id === clientId);
    return projects;
  },

  updateProject: async (id: string, updates: Partial<ClientProject>): Promise<void> => {
    const current = getStored<ClientProject[]>(DB_KEYS.PROJECTS, INITIAL_PROJECTS);
    const updated = current.map(p => p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p);
    setStored(DB_KEYS.PROJECTS, updated);
  },

  // Project Files
  getProjectFiles: async (projectId: string): Promise<ProjectFile[]> => {
    const files = getStored<ProjectFile[]>(DB_KEYS.PROJECT_FILES, INITIAL_FILES);
    return files.filter(f => f.project_id === projectId);
  },

  addProjectFile: async (file: Omit<ProjectFile, 'id' | 'created_at'>): Promise<ProjectFile> => {
    const newFile: ProjectFile = {
      ...file,
      id: `pf-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    const current = getStored<ProjectFile[]>(DB_KEYS.PROJECT_FILES, INITIAL_FILES);
    setStored(DB_KEYS.PROJECT_FILES, [newFile, ...current]);
    return newFile;
  },

  // Invoices
  getInvoices: async (): Promise<Invoice[]> => {
    return getStored<Invoice[]>(DB_KEYS.INVOICES, INITIAL_INVOICES);
  },

  updateInvoiceStatus: async (id: string, status: Invoice['status'], payment_method?: Invoice['payment_method']): Promise<void> => {
    const current = getStored<Invoice[]>(DB_KEYS.INVOICES, INITIAL_INVOICES);
    const updated = current.map(i => i.id === id ? { ...i, status, ...(payment_method ? { payment_method } : {}) } : i);
    setStored(DB_KEYS.INVOICES, updated);
    db.logActivity('Invoice Updated', `Invoice ${id} marked as ${status}`);
  },

  createInvoice: async (inv: Omit<Invoice, 'id' | 'created_at'>): Promise<Invoice> => {
    const newInv: Invoice = {
      ...inv,
      id: `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      created_at: new Date().toISOString()
    };
    const current = getStored<Invoice[]>(DB_KEYS.INVOICES, INITIAL_INVOICES);
    setStored(DB_KEYS.INVOICES, [newInv, ...current]);
    return newInv;
  },

  // Messages
  getMessages: async (): Promise<MessageItem[]> => {
    return getStored<MessageItem[]>(DB_KEYS.MESSAGES, INITIAL_MESSAGES);
  },

  createMessage: async (msg: Omit<MessageItem, 'id' | 'is_read' | 'replied' | 'created_at'>): Promise<MessageItem> => {
    const newMsg: MessageItem = {
      ...msg,
      id: `msg-${Date.now()}`,
      is_read: false,
      replied: false,
      created_at: new Date().toISOString()
    };
    try {
      await setDoc(doc(firestoreDb, 'messages', newMsg.id), newMsg);
    } catch (e) {
      console.warn('Firestore message write notice:', e);
    }
    const current = getStored<MessageItem[]>(DB_KEYS.MESSAGES, INITIAL_MESSAGES);
    setStored(DB_KEYS.MESSAGES, [newMsg, ...current]);
    db.logActivity('Contact Form Submitted', `New message from ${newMsg.name}: "${newMsg.subject}"`);
    return newMsg;
  },

  markMessageRead: async (id: string): Promise<void> => {
    const current = getStored<MessageItem[]>(DB_KEYS.MESSAGES, INITIAL_MESSAGES);
    const updated = current.map(m => m.id === id ? { ...m, is_read: true } : m);
    setStored(DB_KEYS.MESSAGES, updated);
  },

  deleteMessage: async (id: string): Promise<boolean> => {
    const current = getStored<MessageItem[]>(DB_KEYS.MESSAGES, INITIAL_MESSAGES);
    setStored(DB_KEYS.MESSAGES, current.filter(m => m.id !== id));
    return true;
  },

  // Site Content
  getSiteContent: async (): Promise<SiteContent> => {
    return getStored<SiteContent>(DB_KEYS.SITE_CONTENT, INITIAL_SITE_CONTENT);
  },

  updateSiteContent: async (content: SiteContent): Promise<void> => {
    setStored(DB_KEYS.SITE_CONTENT, content);
    db.logActivity('Website Content Updated', 'Administrator edited global site content/copy');
  },

  // Current session mock profile
  getCurrentProfile: (): Profile => {
    return getStored<Profile>(DB_KEYS.CURRENT_USER, {
      id: 'admin-iyan',
      email: 'collsrecords.inc@gmail.com',
      full_name: 'Iyan Eman Juma',
      phone: '+255741808971',
      avatar_url: 'https://res.cloudinary.com/hxdy3cea/image/upload/v1793362831/NEW_ERA_2026.jpg',
      role: 'admin'
    });
  },

  setCurrentProfileRole: (role: 'admin' | 'staff' | 'client'): void => {
    const current = db.getCurrentProfile();
    const updated: Profile = {
      ...current,
      role,
      full_name: role === 'admin' ? 'Iyan Eman (Admin)' : role === 'staff' ? 'Jacoh Master (Staff)' : 'Amina Salum (Client)',
      email: role === 'admin' ? 'collsrecords.inc@gmail.com' : role === 'staff' ? 'jacoh@collsrecords.com' : 'amina.music@yahoo.com'
    };
    setStored(DB_KEYS.CURRENT_USER, updated);
    window.dispatchEvent(new CustomEvent('colls_user_changed', { detail: updated }));
  }
};
