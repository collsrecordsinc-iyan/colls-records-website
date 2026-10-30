import React, { useState, useEffect } from 'react';
import { db } from '../lib/db';
import { TeamMember } from '../types';
import { INITIAL_TEAM, COMPANY_INFO } from '../lib/constants';
import { useI18n } from '../lib/i18n';
import {
  Users,
  MessageCircle,
  Phone,
  Mail,
  Instagram,
  Youtube,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface TeamPageProps {
  onNavigate: (route: string) => void;
}

export const TeamPage: React.FC<TeamPageProps> = ({ onNavigate }) => {
  const { t } = useI18n();
  const [team, setTeam] = useState<TeamMember[]>(INITIAL_TEAM);

  useEffect(() => {
    db.getTeamMembers().then(setTeam);
    const handleUpdate = () => db.getTeamMembers().then(setTeam);
    window.addEventListener('colls_db_updated', handleUpdate);
    return () => window.removeEventListener('colls_db_updated', handleUpdate);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest">
            <Users className="w-4 h-4" />
            <span>Colls Records Family &amp; Leadership</span>
          </div>
          <h1 className="font-display font-black text-4xl sm:text-6xl text-white uppercase tracking-tight">
            Meet the Creative Vanguard
          </h1>
          <p className="text-base text-neutral-300 leading-relaxed">
            The visionary executives, hit producers, digital architects, and vocal talents propelling Colls Records from Tanga, Tanzania to the global stage.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member) => (
            <div
              key={member.id}
              className="glass-panel rounded-3xl overflow-hidden border border-neutral-800 hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between group shadow-xl"
            >
              <div>
                {/* Photo with overlay */}
                <div className="relative aspect-[4/3] overflow-hidden bg-neutral-900 border-b border-neutral-800">
                  <img
                    src={member.photo_url}
                    alt={member.full_name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent opacity-90" />

                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold block mb-0.5">
                      {member.role}
                    </span>
                    <h3 className="text-xl font-bold text-white leading-tight">
                      {member.full_name}
                    </h3>
                    {member.stage_name && (
                      <span className="text-xs font-mono text-neutral-300">
                        aka <strong className="text-amber-400">{member.stage_name}</strong>
                      </span>
                    )}
                  </div>
                </div>

                {/* Bio text */}
                <div className="p-6">
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>

              {/* Action and contact footer */}
              <div className="p-6 pt-0">
                <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {member.whatsapp && (
                      <a
                        href={`${member.whatsapp}?text=Hello%20${encodeURIComponent(member.full_name)},%20I%20would%20like%20to%20connect%20regarding%20Colls%20Records`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
                        title="Chat on WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    )}
                    {member.phone && (
                      <a
                        href={`tel:${member.phone}`}
                        className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 transition-colors"
                        title="Direct Call"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    )}
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 transition-colors"
                        title="Send Email"
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  <button
                    onClick={() => onNavigate('/book')}
                    className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1"
                  >
                    <span>Book Session</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Join the label CTA */}
        <div className="p-8 sm:p-12 rounded-3xl bg-neutral-900/40 border border-neutral-800 text-center space-y-4">
          <h3 className="font-display font-bold text-2xl sm:text-3xl text-white">
            Want to Join the Colls Records Team or Artist Roster?
          </h3>
          <p className="text-sm text-neutral-400 max-w-xl mx-auto">
            We are always scouting for gifted vocalists, multi-instrumentalists, sound designers, and visual cinematographers across Tanzania.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('/contact')}
              className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold uppercase text-xs tracking-wider rounded-xl transition-all shadow-md active:scale-95"
            >
              Get in Touch with Management
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
