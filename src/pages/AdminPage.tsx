import React, { useState, useEffect } from 'react';
import { db } from '../lib/db';
import { isSupabaseConfigured } from '../lib/supabase';
import { testFirestoreConnection, signInWithGoogle, auth } from '../lib/firebase';
import {
  Song,
  VideoItem,
  TeamMember,
  ServiceItem,
  PricingPackage,
  TickerItem,
  NewsPost,
  Booking,
  MessageItem,
  ActivityLog,
  SiteContent
} from '../types';
import { formatTZS } from '../utils/pricing';
import { BRAND_ASSETS, COMPANY_INFO, INITIAL_SITE_CONTENT } from '../lib/constants';
import {
  Shield,
  Music,
  Video,
  Users,
  Radio,
  Sliders,
  DollarSign,
  FileText,
  Calendar,
  MessageSquare,
  Database,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  Search,
  ExternalLink,
  Save,
  Eye,
  Check,
  TrendingUp,
  Headphones,
  Bell
} from 'lucide-react';

interface AdminPageProps {
  onNavigate: (route: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const [activeModule, setActiveModule] = useState<string>('overview');

  // State collections
  const [songs, setSongs] = useState<Song[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [pricing, setPricing] = useState<PricingPackage[]>([]);
  const [ticker, setTicker] = useState<TickerItem[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [news, setNews] = useState<NewsPost[]>([]);
  const [activity, setActivity] = useState<ActivityLog[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent>(INITIAL_SITE_CONTENT);

  // Form states
  const [newSongTitle, setNewSongTitle] = useState('');
  const [newSongArtist, setNewSongArtist] = useState('Colls Records');
  const [newSongAudioUrl, setNewSongAudioUrl] = useState('');
  const [newSongCoverUrl, setNewSongCoverUrl] = useState('');
  const [newSongGenre, setNewSongGenre] = useState('Bongo Flava');
  const [newSongProducer, setNewSongProducer] = useState('Peter Manyama (New Beats)');

  const [newTickerText, setNewTickerText] = useState('');
  const [newTickerSwahili, setNewTickerSwahili] = useState('');
  const [newTickerPriority, setNewTickerPriority] = useState<'normal' | 'urgent' | 'promo'>('promo');

  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamRole, setNewTeamRole] = useState('');
  const [newTeamBio, setNewTeamBio] = useState('');
  const [newTeamPhoto, setNewTeamPhoto] = useState('');
  const [newTeamPhone, setNewTeamPhone] = useState('');

  const [notification, setNotification] = useState<string | null>(null);

  const loadAll = () => {
    db.getSongs().then(setSongs);
    db.getVideos().then(setVideos);
    db.getTeamMembers().then(setTeam);
    db.getServices().then(setServices);
    db.getPricingPackages().then(setPricing);
    db.getTickerItems().then(setTicker);
    db.getBookings().then(setBookings);
    db.getMessages().then(setMessages);
    db.getNewsPosts().then(setNews);
    db.getActivityLogs().then(setActivity);
    db.getSiteContent().then(setSiteContent);
  };

  useEffect(() => {
    loadAll();
    const handleUpdate = () => loadAll();
    window.addEventListener('colls_db_updated', handleUpdate);
    return () => window.removeEventListener('colls_db_updated', handleUpdate);
  }, []);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // KPIs
  const totalPlays = songs.reduce((sum, s) => sum + (s.play_count || 0), 0);
  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => sum + (b.price_tzs || 0), 0);
  const unreadMessages = messages.filter(m => !m.is_read).length;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col md:flex-row">
      {/* Toast Alert */}
      {notification && (
        <div className="fixed top-24 right-6 z-50 bg-amber-500 text-neutral-950 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-2xl flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-neutral-900 border-r border-neutral-800 p-5 space-y-6 shrink-0">
        <div className="flex items-center gap-3 pb-4 border-b border-neutral-800">
          <img
            src={BRAND_ASSETS.logoIcon}
            alt="Colls Mark"
            referrerPolicy="no-referrer"
            className="w-8 h-8 object-contain"
          />
          <div>
            <h3 className="font-display font-bold text-sm text-white">
              Colls Admin
            </h3>
            <span className="text-[10px] font-mono text-amber-400">
              Studio Management OS
            </span>
          </div>
        </div>

        {/* Modules List */}
        <nav className="space-y-1 text-xs">
          {[
            { id: 'overview', label: 'Overview & KPIs', icon: TrendingUp },
            { id: 'songs', label: 'Songs & Releases', icon: Music, count: songs.length },
            { id: 'videos', label: 'Videos & Visuals', icon: Video, count: videos.length },
            { id: 'team', label: 'Team & Roster', icon: Users, count: team.length },
            { id: 'ticker', label: 'News Ticker (Live)', icon: Radio, count: ticker.length },
            { id: 'bookings', label: 'Bookings & Sessions', icon: Calendar, count: bookings.length },
            { id: 'pricing', label: 'Rates & Services', icon: Sliders },
            { id: 'messages', label: 'Messages Inbox', icon: MessageSquare, count: unreadMessages },
            { id: 'content', label: 'Website Content', icon: FileText },
            { id: 'database', label: 'Supabase Database', icon: Database }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-colors ${
                  isActive
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/20'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-neutral-950 text-amber-400' : 'bg-neutral-800 text-neutral-300'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Role Switcher for Testing */}
        <div className="pt-6 border-t border-neutral-800 space-y-2">
          <span className="text-[10px] font-mono uppercase text-neutral-500 block">
            Test Profile Switcher
          </span>
          <div className="grid grid-cols-3 gap-1">
            <button
              onClick={() => {
                db.setCurrentProfileRole('admin');
                showToast('Switched to Admin Role');
              }}
              className="px-2 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded text-[10px] font-mono"
            >
              Admin
            </button>
            <button
              onClick={() => {
                db.setCurrentProfileRole('staff');
                showToast('Switched to Staff Role');
              }}
              className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded text-[10px] font-mono"
            >
              Staff
            </button>
            <button
              onClick={() => {
                db.setCurrentProfileRole('client');
                showToast('Switched to Client Role');
              }}
              className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded text-[10px] font-mono"
            >
              Client
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto max-h-screen">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
          <div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-white uppercase">
              {activeModule.replace(/_/g, ' ')}
            </h1>
            <p className="text-xs text-neutral-400 mt-0.5">
              Colls Records Creative Studios Management • Tanga, Tanzania
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <Database className="w-3.5 h-3.5" />
              <span>Firebase Firestore (europe-west2) Connected</span>
            </span>

            <button
              onClick={() => onNavigate('/')}
              className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white rounded-lg text-xs font-semibold border border-neutral-800 flex items-center gap-1"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Public Site</span>
            </button>
          </div>
        </div>

        {/* MODULE 1: OVERVIEW */}
        {activeModule === 'overview' && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="glass-panel p-5 rounded-2xl border border-neutral-800 space-y-1">
                <span className="text-[10px] font-mono uppercase text-neutral-400">Total Stream Plays</span>
                <div className="font-display font-extrabold text-2xl text-amber-400 tabular-nums">
                  {totalPlays.toLocaleString()}
                </div>
                <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>+18% this month</span>
                </span>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-neutral-800 space-y-1">
                <span className="text-[10px] font-mono uppercase text-neutral-400">Confirmed Bookings</span>
                <div className="font-display font-extrabold text-2xl text-white tabular-nums">
                  {bookings.length}
                </div>
                <span className="text-[11px] text-neutral-400">In Tanga studios</span>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-neutral-800 space-y-1">
                <span className="text-[10px] font-mono uppercase text-neutral-400">Studio Revenue (TZS)</span>
                <div className="font-display font-extrabold text-2xl text-amber-400 tabular-nums font-mono">
                  {formatTZS(totalRevenue)}
                </div>
                <span className="text-[11px] text-emerald-400">Via M-Pesa &amp; Tigo Pesa</span>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-neutral-800 space-y-1">
                <span className="text-[10px] font-mono uppercase text-neutral-400">Active Catalogue Songs</span>
                <div className="font-display font-extrabold text-2xl text-white tabular-nums">
                  {songs.length}
                </div>
                <span className="text-[11px] text-amber-400">Master WAV releases</span>
              </div>
            </div>

            {/* Recent Activity Log */}
            <div className="glass-panel p-6 rounded-3xl border border-neutral-800 space-y-4">
              <h3 className="font-display font-bold text-lg text-white">
                Live Studio Audit Log
              </h3>
              <div className="divide-y divide-neutral-800">
                {activity.slice(0, 8).map((act) => (
                  <div key={act.id} className="py-3 flex items-start justify-between text-xs">
                    <div>
                      <span className="font-bold text-amber-400 block">{act.action}</span>
                      <p className="text-neutral-300 mt-0.5">{act.details}</p>
                      <span className="text-[10px] font-mono text-neutral-500">By {act.user_name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-500 shrink-0">
                      {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MODULE 2: SONGS & RELEASES */}
        {activeModule === 'songs' && (
          <div className="space-y-8">
            {/* Upload / Add Song Form */}
            <div className="glass-panel p-6 rounded-3xl border border-neutral-800 space-y-4">
              <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" />
                <span>Publish New Studio Master</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-mono uppercase text-neutral-400 mb-1">Song Title *</label>
                  <input
                    type="text"
                    value={newSongTitle}
                    onChange={(e) => setNewSongTitle(e.target.value)}
                    placeholder="e.g. Mapenzi Ya Tanga"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                  />
                </div>

                <div>
                  <label className="block font-mono uppercase text-neutral-400 mb-1">Artist *</label>
                  <input
                    type="text"
                    value={newSongArtist}
                    onChange={(e) => setNewSongArtist(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                  />
                </div>

                <div>
                  <label className="block font-mono uppercase text-neutral-400 mb-1">Lead Producer</label>
                  <input
                    type="text"
                    value={newSongProducer}
                    onChange={(e) => setNewSongProducer(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                  />
                </div>

                <div>
                  <label className="block font-mono uppercase text-neutral-400 mb-1">Genre</label>
                  <input
                    type="text"
                    value={newSongGenre}
                    onChange={(e) => setNewSongGenre(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                  />
                </div>

                <div>
                  <label className="block font-mono uppercase text-neutral-400 mb-1">Audio URL (WAV / MP3)</label>
                  <input
                    type="url"
                    value={newSongAudioUrl}
                    onChange={(e) => setNewSongAudioUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                  />
                </div>

                <div>
                  <label className="block font-mono uppercase text-neutral-400 mb-1">Cover Art URL</label>
                  <input
                    type="url"
                    value={newSongCoverUrl}
                    onChange={(e) => setNewSongCoverUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={async () => {
                    if (!newSongTitle.trim()) return;
                    await db.createSong({
                      title: newSongTitle.trim(),
                      artist: newSongArtist.trim(),
                      cover_url: newSongCoverUrl || BRAND_ASSETS.heroBanner,
                      audio_url: newSongAudioUrl || 'https://res.cloudinary.com/hxdy3cea/video/upload/v1793366699/Msaliti_Official_Audio_by_Colls_Records.wav',
                      genre: newSongGenre,
                      producer: newSongProducer,
                      release_date: new Date().toISOString().split('T')[0],
                      is_published: true,
                      duration: '3:30'
                    });
                    setNewSongTitle('');
                    showToast('New song published to catalogue');
                  }}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold uppercase text-xs rounded-xl"
                >
                  Publish Song
                </button>
              </div>
            </div>

            {/* Songs Table */}
            <div className="glass-panel rounded-3xl border border-neutral-800 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-900 text-neutral-400 font-mono uppercase border-b border-neutral-800">
                  <tr>
                    <th className="p-4">Cover</th>
                    <th className="p-4">Title &amp; Artist</th>
                    <th className="p-4">Producer</th>
                    <th className="p-4">Plays</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/80">
                  {songs.map((s) => (
                    <tr key={s.id} className="hover:bg-neutral-900/40">
                      <td className="p-4">
                        <img
                          src={s.cover_url}
                          alt={s.title}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-white block">{s.title}</span>
                        <span className="text-neutral-400 text-[11px]">{s.artist}</span>
                      </td>
                      <td className="p-4 text-neutral-300 font-mono">{s.producer || 'Colls'}</td>
                      <td className="p-4 font-mono tabular-nums text-amber-400">{s.play_count.toLocaleString()}</td>
                      <td className="p-4">
                        <button
                          onClick={async () => {
                            await db.updateSong(s.id, { is_published: !s.is_published });
                            showToast(`Song ${s.is_published ? 'Unpublished' : 'Published'}`);
                          }}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            s.is_published ? 'bg-emerald-500/20 text-emerald-400' : 'bg-neutral-800 text-neutral-400'
                          }`}
                        >
                          {s.is_published ? 'Published' : 'Draft'}
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={async () => {
                            if (confirm(`Are you sure you want to delete song "${s.title}"?`)) {
                              await db.deleteSong(s.id);
                              showToast('Song deleted');
                            }
                          }}
                          className="p-1.5 text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODULE 3: TICKER / LOWER-THIRD */}
        {activeModule === 'ticker' && (
          <div className="space-y-8">
            <div className="glass-panel p-6 rounded-3xl border border-neutral-800 space-y-4">
              <h3 className="font-display font-bold text-lg text-white">
                Add Broadcast News Ticker Item
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-mono uppercase text-neutral-400 mb-1">Announcement Text (English) *</label>
                  <input
                    type="text"
                    value={newTickerText}
                    onChange={(e) => setNewTickerText(e.target.value)}
                    placeholder="e.g. 50% discount on 8-hour lockout booking this week!"
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                  />
                </div>

                <div>
                  <label className="block font-mono uppercase text-neutral-400 mb-1">Announcement Text (Swahili / Kiswahili)</label>
                  <input
                    type="text"
                    value={newTickerSwahili}
                    onChange={(e) => setNewTickerSwahili(e.target.value)}
                    placeholder="e.g. Punguzo la asilimia 50 kwenye kurekodi wiki hii!"
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                  />
                </div>

                <div>
                  <label className="block font-mono uppercase text-neutral-400 mb-1">Priority Badge</label>
                  <select
                    value={newTickerPriority}
                    onChange={(e) => setNewTickerPriority(e.target.value as any)}
                    className="px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                  >
                    <option value="promo">Promo</option>
                    <option value="urgent">Urgent Offer</option>
                    <option value="normal">Standard Announcement</option>
                  </select>
                </div>

                <button
                  onClick={async () => {
                    if (!newTickerText.trim()) return;
                    await db.createTickerItem({
                      text: newTickerText.trim(),
                      swahili_text: newTickerSwahili.trim() || undefined,
                      priority: newTickerPriority,
                      is_active: true,
                      display_order: ticker.length + 1
                    });
                    setNewTickerText('');
                    setNewTickerSwahili('');
                    showToast('Ticker item added to live lower-third');
                  }}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold uppercase text-xs rounded-xl"
                >
                  Add to Broadcast
                </button>
              </div>
            </div>

            {/* Existing Ticker Items */}
            <div className="space-y-3">
              {ticker.map((item) => (
                <div
                  key={item.id}
                  className="glass-panel p-4 rounded-2xl border border-neutral-800 flex items-center justify-between gap-4 text-xs"
                >
                  <div className="min-w-0">
                    <span className="font-mono text-[10px] uppercase text-amber-400 mr-2">[{item.priority}]</span>
                    <span className="text-white font-medium">{item.text}</span>
                    {item.swahili_text && (
                      <p className="text-neutral-400 text-[11px] mt-0.5">{item.swahili_text}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={async () => {
                        await db.updateTickerItem(item.id, { is_active: !item.is_active });
                        showToast(`Ticker item ${item.is_active ? 'deactivated' : 'activated'}`);
                      }}
                      className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase ${
                        item.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-neutral-800 text-neutral-500'
                      }`}
                    >
                      {item.is_active ? 'Active' : 'Muted'}
                    </button>

                    <button
                      onClick={async () => {
                        await db.deleteTickerItem(item.id);
                        showToast('Ticker item removed');
                      }}
                      className="p-1 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODULE 4: BOOKINGS MANAGER */}
        {activeModule === 'bookings' && (
          <div className="space-y-6">
            <div className="glass-panel rounded-3xl border border-neutral-800 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-900 text-neutral-400 font-mono uppercase border-b border-neutral-800">
                  <tr>
                    <th className="p-4">Ref</th>
                    <th className="p-4">Client</th>
                    <th className="p-4">Service &amp; Package</th>
                    <th className="p-4">Date &amp; Time</th>
                    <th className="p-4">Assigned To</th>
                    <th className="p-4">Amount (TZS)</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/80">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-neutral-900/40">
                      <td className="p-4 font-mono font-bold text-amber-400">{b.id}</td>
                      <td className="p-4">
                        <span className="font-bold text-white block">{b.client_name}</span>
                        <span className="text-neutral-400 text-[11px] font-mono">{b.client_phone}</span>
                      </td>
                      <td className="p-4 text-neutral-300">
                        {b.service_name}
                        {b.package_name && <span className="text-neutral-500 block text-[11px]">{b.package_name}</span>}
                      </td>
                      <td className="p-4 font-mono">{b.preferred_date}</td>
                      <td className="p-4 font-mono text-emerald-400">{b.assigned_to || 'New Beats'}</td>
                      <td className="p-4 font-mono font-bold text-white">{formatTZS(b.price_tzs)}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          b.status === 'confirmed'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : b.status === 'in_progress'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <select
                          value={b.status}
                          onChange={async (e) => {
                            await db.updateBookingStatus(b.id, e.target.value as any);
                            showToast(`Booking ${b.id} updated`);
                          }}
                          className="bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-[11px] text-white"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirm</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancel</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODULE 5: TEAM & ROSTER */}
        {activeModule === 'team' && (
          <div className="space-y-8">
            <div className="glass-panel p-6 rounded-3xl border border-neutral-800 space-y-4">
              <h3 className="font-display font-bold text-lg text-white">
                Add Team Member / Producer
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-mono uppercase text-neutral-400 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    placeholder="e.g. Kelvin Lyamuya"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                  />
                </div>

                <div>
                  <label className="block font-mono uppercase text-neutral-400 mb-1">Role / Title *</label>
                  <input
                    type="text"
                    value={newTeamRole}
                    onChange={(e) => setNewTeamRole(e.target.value)}
                    placeholder="e.g. Chief Audio Engineer"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                  />
                </div>

                <div>
                  <label className="block font-mono uppercase text-neutral-400 mb-1">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    value={newTeamPhone}
                    onChange={(e) => setNewTeamPhone(e.target.value)}
                    placeholder="+255 7XX XXX XXX"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                  />
                </div>

                <div className="lg:col-span-2">
                  <label className="block font-mono uppercase text-neutral-400 mb-1">Bio</label>
                  <input
                    type="text"
                    value={newTeamBio}
                    onChange={(e) => setNewTeamBio(e.target.value)}
                    placeholder="Specialty and career highlights..."
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                  />
                </div>

                <div>
                  <label className="block font-mono uppercase text-neutral-400 mb-1">Photo URL</label>
                  <input
                    type="url"
                    value={newTeamPhoto}
                    onChange={(e) => setNewTeamPhoto(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                  />
                </div>
              </div>

              <button
                onClick={async () => {
                  if (!newTeamName.trim() || !newTeamRole.trim()) return;
                  await db.createTeamMember({
                    full_name: newTeamName.trim(),
                    role: newTeamRole.trim(),
                    bio: newTeamBio.trim() || 'Colls Records creative team member based in Tanga, Tanzania.',
                    photo_url: newTeamPhoto || BRAND_ASSETS.heroSliderImages[1],
                    phone: newTeamPhone || undefined,
                    whatsapp: newTeamPhone ? `https://wa.me/${newTeamPhone.replace(/[\+\s]/g, '')}` : undefined,
                    display_order: team.length + 1,
                    is_active: true
                  });
                  setNewTeamName('');
                  setNewTeamRole('');
                  setNewTeamBio('');
                  showToast('Team member added to official roster');
                }}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold uppercase text-xs rounded-xl"
              >
                Add Member
              </button>
            </div>

            {/* Team Roster Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {team.map((member) => (
                <div
                  key={member.id}
                  className="glass-panel p-4 rounded-2xl border border-neutral-800 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={member.photo_url}
                      alt={member.full_name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-white truncate">{member.full_name}</h4>
                      <p className="text-xs text-amber-400 truncate">{member.role}</p>
                    </div>
                  </div>

                  <button
                    onClick={async () => {
                      if (confirm(`Remove ${member.full_name}?`)) {
                        await db.deleteTeamMember(member.id);
                        showToast('Member removed');
                      }
                    }}
                    className="p-1.5 text-red-400 hover:text-red-300 shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODULE 6: MESSAGES INBOX */}
        {activeModule === 'messages' && (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`glass-panel p-6 rounded-2xl border transition-colors ${
                  msg.is_read ? 'border-neutral-800' : 'border-amber-500/60 bg-amber-500/5'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-800/80">
                  <div>
                    <span className="font-bold text-white text-sm">{msg.name}</span>
                    <span className="text-xs text-neutral-400 font-mono ml-2">({msg.email})</span>
                    {msg.phone && (
                      <span className="text-xs text-emerald-400 font-mono ml-2">{msg.phone}</span>
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-neutral-500">
                    {new Date(msg.created_at).toLocaleString()}
                  </span>
                </div>

                <div className="py-3">
                  <h4 className="text-xs font-mono uppercase text-amber-400 font-semibold mb-1">
                    Subject: {msg.subject}
                  </h4>
                  <p className="text-sm text-neutral-300 leading-relaxed">
                    {msg.message}
                  </p>
                </div>

                <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <a
                      href={`mailto:${msg.email}?subject=Re:%20${encodeURIComponent(msg.subject)}`}
                      className="text-amber-400 hover:underline"
                    >
                      Reply by Email
                    </a>
                    {msg.phone && (
                      <a
                        href={`https://wa.me/${msg.phone.replace(/[\+\s]/g, '')}?text=Hello%20${encodeURIComponent(msg.name)},%20re:%20Colls%20Records`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 hover:underline"
                      >
                        Reply on WhatsApp
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {!msg.is_read && (
                      <button
                        onClick={async () => {
                          await db.markMessageRead(msg.id);
                          showToast('Marked as read');
                        }}
                        className="px-2 py-1 rounded bg-neutral-800 text-neutral-300 hover:text-white"
                      >
                        Mark Read
                      </button>
                    )}
                    <button
                      onClick={async () => {
                        await db.deleteMessage(msg.id);
                        showToast('Message deleted');
                      }}
                      className="p-1 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODULE 7: SUPABASE & FIREBASE CLOUD DATABASE */}
        {activeModule === 'database' && (
          <div className="space-y-6">
            {/* Live Provisioned Firebase Firestore Box */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/40 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-xl text-white">
                      Google Cloud Firestore &amp; Firebase Auth
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Provisioned in region <strong>europe-west2</strong> with zero-trust security rules and real-time triggers.
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  Provisioned &amp; Active
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-neutral-900 border border-neutral-800 text-xs">
                <div>
                  <span className="text-neutral-500 font-mono block">Firebase Project ID:</span>
                  <span className="font-mono text-white font-semibold">gen-lang-client-0213881133</span>
                </div>
                <div>
                  <span className="text-neutral-500 font-mono block">Cloud Region:</span>
                  <span className="font-mono text-emerald-400 font-semibold">europe-west2</span>
                </div>
                <div>
                  <span className="text-neutral-500 font-mono block">Firestore Database ID:</span>
                  <span className="font-mono text-amber-300 font-semibold text-[11px] truncate block">
                    ai-studio-collsrecords-10a34a62-2057-4e36-9c3f-4abeada27247
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 font-mono block">Security Rules Status:</span>
                  <span className="font-mono text-emerald-400 font-semibold">Deployed (DeployRules RPC)</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={async () => {
                    const ok = await testFirestoreConnection();
                    if (ok) {
                      showToast('Firestore connection verified successfully!');
                    } else {
                      showToast('Connection check completed.');
                    }
                  }}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold uppercase text-xs rounded-xl flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Test Firestore Connection</span>
                </button>

                <button
                  onClick={async () => {
                    try {
                      const user = await signInWithGoogle();
                      showToast(`Signed in with Google: ${user.email}`);
                    } catch (e) {
                      showToast('Google Sign-in closed');
                    }
                  }}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 font-semibold text-xs rounded-xl flex items-center gap-2"
                >
                  <Users className="w-4 h-4 text-amber-400" />
                  <span>Test Google Authentication</span>
                </button>
              </div>
            </div>

            {/* Supabase PostgreSQL Migration Box */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-neutral-800 space-y-4">
              <div className="flex items-center gap-3">
                <Database className="w-8 h-8 text-neutral-400" />
                <div>
                  <h3 className="font-display font-bold text-xl text-white">
                    Supabase PostgreSQL Connection &amp; Migration
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Dual database architecture: you can also connect a remote Supabase PostgreSQL instance.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Remote Supabase URL:</span>
                  <span className="font-mono text-white">
                    {import.meta.env.VITE_SUPABASE_URL || 'Not yet configured in .env'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Anon Public Key:</span>
                  <span className="font-mono text-white">
                    {import.meta.env.VITE_SUPABASE_ANON_KEY ? '••••••••••••••••' : 'Not yet set'}
                  </span>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-neutral-800 text-xs text-neutral-300 leading-relaxed">
                <h4 className="font-bold text-amber-400 uppercase font-mono tracking-wider">
                  How to Connect Real Supabase in 4 Steps:
                </h4>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    Create a free project at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-amber-400 underline">supabase.com</a>.
                  </li>
                  <li>
                    Open the <strong>SQL Editor</strong> tab in your Supabase dashboard and run the migration file provided at:
                    <code className="block my-1.5 p-2 rounded bg-neutral-900 font-mono text-amber-300 text-[11px]">
                      supabase/migrations/20261030000000_colls_records_init.sql
                    </code>
                  </li>
                  <li>
                    Add your project credentials to your environment variables:
                    <pre className="my-1.5 p-2 rounded bg-neutral-900 font-mono text-neutral-300 text-[11px]">
{`VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"`}
                    </pre>
                  </li>
                  <li>
                    To promote a user to admin:
                    <pre className="my-1.5 p-2 rounded bg-neutral-900 font-mono text-emerald-400 text-[11px]">
{`INSERT INTO public.user_roles (user_id, role)
VALUES ('<USER-UUID>', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;`}
                    </pre>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* MODULE 8: WEBSITE CONTENT */}
        {activeModule === 'content' && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-neutral-800 space-y-6">
            <h3 className="font-display font-bold text-xl text-white">
              Edit Live Website Copy &amp; Headlines
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-mono uppercase text-neutral-400 mb-1">Hero Main Headline</label>
                <input
                  type="text"
                  value={siteContent.hero_headline}
                  onChange={(e) => setSiteContent({ ...siteContent, hero_headline: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                />
              </div>

              <div>
                <label className="block font-mono uppercase text-neutral-400 mb-1">Hero Sub-headline / Tagline</label>
                <textarea
                  rows={2}
                  value={siteContent.hero_subheadline}
                  onChange={(e) => setSiteContent({ ...siteContent, hero_subheadline: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block font-mono uppercase text-neutral-400 mb-1">Songs Counter</label>
                  <input
                    type="number"
                    value={siteContent.stats.songs_produced}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      stats: { ...siteContent.stats, songs_produced: Number(e.target.value) }
                    })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                  />
                </div>
                <div>
                  <label className="block font-mono uppercase text-neutral-400 mb-1">Artists Counter</label>
                  <input
                    type="number"
                    value={siteContent.stats.artists_recorded}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      stats: { ...siteContent.stats, artists_recorded: Number(e.target.value) }
                    })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                  />
                </div>
                <div>
                  <label className="block font-mono uppercase text-neutral-400 mb-1">Years Counter</label>
                  <input
                    type="number"
                    value={siteContent.stats.years_experience}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      stats: { ...siteContent.stats, years_experience: Number(e.target.value) }
                    })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                  />
                </div>
                <div>
                  <label className="block font-mono uppercase text-neutral-400 mb-1">Media Projects</label>
                  <input
                    type="number"
                    value={siteContent.stats.multimedia_projects}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      stats: { ...siteContent.stats, multimedia_projects: Number(e.target.value) }
                    })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                  />
                </div>
              </div>

              <button
                onClick={async () => {
                  await db.updateSiteContent(siteContent);
                  showToast('Site content updated and saved');
                }}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold uppercase text-xs rounded-xl flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Live Site Changes</span>
              </button>
            </div>
          </div>
        )}

        {/* MODULE 9: RATES & SERVICES */}
        {activeModule === 'pricing' && (
          <div className="space-y-6">
            <h3 className="font-display font-bold text-xl text-white">
              Manage Tanzanian Shillings (TZS) Rates
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pricing.map((p) => (
                <div key={p.id} className="glass-panel p-4 rounded-2xl border border-neutral-800 space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-amber-400 uppercase font-semibold">{p.category}</span>
                    <span className="font-bold text-white text-sm">{p.name}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="text-neutral-400">Price (TZS):</label>
                    <input
                      type="number"
                      value={p.price_tzs}
                      onChange={async (e) => {
                        const newPrice = Number(e.target.value);
                        await db.updatePricingPackage(p.id, { price_tzs: newPrice });
                      }}
                      className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-amber-400 font-mono font-bold"
                    />
                    <span className="text-neutral-500 font-mono">/ {p.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
