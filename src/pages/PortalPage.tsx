import React, { useState, useEffect } from 'react';
import { db } from '../lib/db';
import { Booking, ClientProject, ProjectFile, Invoice, Profile } from '../types';
import { formatTZS } from '../utils/pricing';
import {
  User,
  Music,
  FileText,
  Upload,
  Download,
  CheckCircle,
  Clock,
  CreditCard,
  MessageSquare,
  Check,
  RefreshCw,
  FolderLock
} from 'lucide-react';

interface PortalPageProps {
  onNavigate: (route: string) => void;
}

export const PortalPage: React.FC<PortalPageProps> = ({ onNavigate }) => {
  const [profile, setProfile] = useState<Profile>(db.getCurrentProfile());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [projectFiles, setProjectFiles] = useState<ProjectFile[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [activeTab, setActiveTab] = useState<'projects' | 'files' | 'invoices' | 'bookings'>('projects');

  // File upload state
  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState<'audio' | 'stems' | 'document'>('audio');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const loadPortalData = () => {
    db.getBookings().then(setBookings);
    db.getClientProjects().then((projs) => {
      setProjects(projs);
      if (projs.length > 0) {
        db.getProjectFiles(projs[0].id).then(setProjectFiles);
      }
    });
    db.getInvoices().then(setInvoices);
  };

  useEffect(() => {
    loadPortalData();
    const handleUpdate = () => loadPortalData();
    window.addEventListener('colls_db_updated', handleUpdate);
    return () => window.removeEventListener('colls_db_updated', handleUpdate);
  }, []);

  const handleUploadFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim() || projects.length === 0) return;

    db.addProjectFile({
      project_id: projects[0].id,
      file_name: newFileName.trim(),
      file_url: 'https://res.cloudinary.com/hxdy3cea/video/upload/v1793367458/Don_Salale_Iyan_eman_ft_Zinty_Visualizer_Produced_by_Colls_Records_Jacoh_Master.mp3',
      file_type: newFileType,
      file_size: `${(Math.random() * 20 + 5).toFixed(1)} MB`,
      version: `v${Math.floor(Math.random() * 3) + 1}.0`,
      uploaded_by: profile.full_name,
      is_final: false
    });

    setNewFileName('');
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 3000);
    loadPortalData();
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* User Banner */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-700 shrink-0">
              <img
                src={profile.avatar_url || 'https://res.cloudinary.com/hxdy3cea/image/upload/v1793362935/file_00000000a7f88211afb6c4fd65672b92.png'}
                alt={profile.full_name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded tracking-wider">
                  Client Portal
                </span>
                <span className="text-xs text-neutral-400">Tanga Studio Session</span>
              </div>
              <h1 className="text-2xl font-bold text-white mt-1">
                {profile.full_name}
              </h1>
              <p className="text-xs text-neutral-400 font-mono mt-0.5">
                {profile.email} · {profile.phone || '+255 7XX XXX XXX'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/book')}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold uppercase text-xs tracking-wider rounded-xl transition-all shadow-md active:scale-95"
            >
              Book New Studio Slot
            </button>
            <a
              href="https://wa.me/255741808971?text=Hello%20Colls%20Records,%20checking%20on%20my%20studio%20project"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 rounded-xl text-xs font-semibold"
            >
              Message Studio
            </a>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-neutral-800 gap-2 sm:gap-6 overflow-x-auto">
          {[
            { id: 'projects', label: 'Active Projects', icon: Music, count: projects.length },
            { id: 'files', label: 'Stems & Deliverables', icon: FolderLock, count: projectFiles.length },
            { id: 'invoices', label: 'Invoices & Payments', icon: CreditCard, count: invoices.length },
            { id: 'bookings', label: 'Bookings History', icon: Clock, count: bookings.length }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                  isActive
                    ? 'border-amber-500 text-amber-400'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                <span className="text-[11px] font-mono px-1.5 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400">
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Active Projects */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="glass-panel p-6 sm:p-8 rounded-3xl border border-neutral-800 space-y-5 shadow-xl"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-mono uppercase bg-neutral-900 text-amber-400 border border-neutral-800 px-2 py-0.5 rounded">
                        {proj.status.toUpperCase()}
                      </span>
                      <h3 className="text-xl font-bold text-white mt-2">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        {proj.service}
                      </p>
                    </div>

                    <span className="font-mono text-lg font-bold text-amber-400 tabular-nums">
                      {proj.progress}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="h-2 w-full bg-neutral-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-500"
                        style={{ width: `${proj.progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] font-mono text-neutral-500">
                      <span>Concept</span>
                      <span>Recording</span>
                      <span>Mixing</span>
                      <span>Master</span>
                      <span>Delivered</span>
                    </div>
                  </div>

                  {proj.notes && (
                    <div className="p-3.5 rounded-xl bg-neutral-900/80 border border-neutral-800 text-xs text-neutral-300">
                      <strong className="text-white block mb-0.5">Producer Note:</strong>
                      {proj.notes}
                    </div>
                  )}

                  <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
                    <span>Assigned: <strong className="text-white">{proj.producer}</strong></span>
                    <span>Updated: {new Date(proj.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Stems & Deliverables */}
        {activeTab === 'files' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Files List */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="font-display font-bold text-lg text-white">
                Project Audio Files &amp; Masters
              </h3>

              <div className="space-y-3">
                {projectFiles.map((file) => (
                  <div
                    key={file.id}
                    className="glass-panel p-4 rounded-2xl border border-neutral-800 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                        <Music className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-semibold text-white truncate">
                          {file.file_name}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-400 mt-0.5">
                          <span>{file.version}</span>
                          <span>·</span>
                          <span>{file.file_size}</span>
                          <span>·</span>
                          <span>By {file.uploaded_by}</span>
                        </div>
                      </div>
                    </div>

                    <a
                      href={file.file_url}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-amber-400 border border-neutral-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Upload Stems / Reference files */}
            <div className="lg:col-span-5">
              <div className="glass-panel p-6 rounded-3xl border border-neutral-800 space-y-4">
                <h3 className="font-display font-bold text-lg text-white">
                  Upload Stems or Reference
                </h3>
                <p className="text-xs text-neutral-400">
                  Upload raw vocal wav files, beat loops, or reference mp3 tracks directly for the mixing engineer.
                </p>

                {uploadSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>File uploaded and queued for producer Jacoh Master!</span>
                  </div>
                )}

                <form onSubmit={handleUploadFile} className="space-y-3">
                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-300 mb-1">
                      File Name / Description
                    </label>
                    <input
                      type="text"
                      value={newFileName}
                      onChange={(e) => setNewFileName(e.target.value)}
                      placeholder="e.g. Lead_Vocal_Dry_Take_3.wav"
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-300 mb-1">
                      Type
                    </label>
                    <select
                      value={newFileType}
                      onChange={(e) => setNewFileType(e.target.value as any)}
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-amber-500"
                    >
                      <option value="audio">Vocal / Instrument Audio</option>
                      <option value="stems">ZIP Multi-track Stems</option>
                      <option value="document">Lyrics / Chord Sheet</option>
                    </select>
                  </div>

                  <div className="p-6 border-2 border-dashed border-neutral-800 rounded-2xl text-center bg-neutral-950/40">
                    <Upload className="w-8 h-8 text-neutral-500 mx-auto mb-2" />
                    <span className="text-xs text-neutral-400 block font-medium">
                      Drag &amp; drop stem file or click to browse
                    </span>
                    <span className="text-[10px] text-neutral-500 font-mono mt-1 block">
                      WAV, MP3, ZIP, PDF up to 250MB
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold uppercase text-xs tracking-wider rounded-xl transition-all shadow-md active:scale-95"
                  >
                    Submit File to Studio
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Invoices */}
        {activeTab === 'invoices' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {invoices.map((inv) => (
                <div
                  key={inv.id}
                  className="glass-panel p-6 sm:p-8 rounded-3xl border border-neutral-800 space-y-4 shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-xs font-bold text-amber-400">
                        {inv.id}
                      </span>
                      <h4 className="text-base font-bold text-white mt-1">
                        Studio Production Invoice
                      </h4>
                    </div>

                    <span
                      className={`text-xs font-mono uppercase px-2.5 py-1 rounded-md font-bold ${
                        inv.status === 'paid'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </div>

                  <div className="space-y-2 py-3 border-y border-neutral-800/80 text-xs">
                    {inv.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-neutral-300">
                        <span>{item.description}</span>
                        <span className="font-mono font-semibold">{formatTZS(item.amount_tzs)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-2 text-sm font-bold text-white">
                      <span>Total Amount:</span>
                      <span className="text-amber-400 font-mono">{formatTZS(inv.amount_tzs)}</span>
                    </div>
                  </div>

                  <div className="text-xs text-neutral-400 space-y-1">
                    <p>Due Date: <strong>{inv.due_date}</strong></p>
                    {inv.payment_method && <p>Method: <strong>{inv.payment_method}</strong></p>}
                  </div>

                  {inv.status !== 'paid' && (
                    <div className="pt-2">
                      <a
                        href="https://wa.me/255741808971?text=Hello%20Colls%20Records,%20I%20would%20like%20to%20complete%20payment%20via%20M-Pesa"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold uppercase text-xs tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>Pay via M-Pesa / Tigo Pesa</span>
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Bookings History */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="glass-panel p-5 rounded-2xl border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                    <span>{b.id}</span>
                    <span>·</span>
                    <span>{b.preferred_date} ({b.preferred_time || 'Day'})</span>
                  </div>
                  <h4 className="text-base font-bold text-white mt-1">
                    {b.service_name} {b.package_name ? `— ${b.package_name}` : ''}
                  </h4>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Assigned Producer: <strong className="text-white">{b.assigned_to || 'New Beats'}</strong>
                  </p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2">
                  <span className="font-mono text-sm font-bold text-amber-400">
                    {formatTZS(b.price_tzs)}
                  </span>
                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                    b.status === 'confirmed'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-neutral-800 text-neutral-300'
                  }`}>
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
