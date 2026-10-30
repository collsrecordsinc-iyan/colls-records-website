import React, { useState } from 'react';
import { db } from '../lib/db';
import { COMPANY_INFO } from '../lib/constants';
import { validateEmail, validateTanzanianPhone } from '../utils/pricing';
import {
  Mail,
  MapPin,
  Phone,
  MessageCircle,
  Send,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!validateEmail(formData.email)) newErrors.email = 'Valid email address is required';
    if (formData.phone && !validateTanzanianPhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid East African phone number (e.g. +255741808971)';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim() || formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      await db.createMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        subject: formData.subject.trim(),
        message: formData.message.trim()
      });

      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest">
            <Mail className="w-4 h-4" />
            <span>Studio Headquarters &amp; Inquiries</span>
          </div>
          <h1 className="font-display font-black text-4xl sm:text-6xl text-white uppercase tracking-tight">
            Connect with Colls Records
          </h1>
          <p className="text-base text-neutral-300 leading-relaxed">
            Reach our production offices in Tanga Mjini, Tanzania, or contact our producers directly via WhatsApp.
          </p>
        </div>

        {/* Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Producer Hotlines & Location Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-neutral-800 space-y-6 shadow-xl">
              <h3 className="font-display font-bold text-xl text-white">
                Official Studio Contacts
              </h3>

              <div className="space-y-4 text-sm">
                <a
                  href={`mailto:${COMPANY_INFO.email}`}
                  className="flex items-start gap-3 p-3 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-amber-500/40 transition-colors group"
                >
                  <Mail className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-mono text-neutral-400 block">Official Email</span>
                    <span className="font-semibold text-white group-hover:text-amber-400">
                      {COMPANY_INFO.email}
                    </span>
                  </div>
                </a>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                  <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-mono text-neutral-400 block">Studio Location</span>
                    <span className="font-semibold text-white">
                      {COMPANY_INFO.fullAddress}
                    </span>
                    <span className="text-xs text-neutral-400 block mt-0.5">Tanga Mjini, Coastal Region, Tanzania</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                  <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-mono text-neutral-400 block">Operating Hours</span>
                    <span className="font-semibold text-white">Monday - Sunday: 9:00 AM – 11:00 PM EAT</span>
                    <span className="text-xs text-neutral-400 block mt-0.5">24/7 Booking via Website &amp; WhatsApp</span>
                  </div>
                </div>
              </div>

              {/* Direct Producer WhatsApp Cards */}
              <div className="pt-4 border-t border-neutral-800/80 space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                  Direct WhatsApp Hotlines
                </h4>

                <a
                  href="https://wa.me/255741808971?text=Hello,%20I%20would%20like%20to%20inquire%20about%20Colls%20Records%20services"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all text-xs text-emerald-300 font-semibold"
                >
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>Peter Manyama (New Beats)</span>
                  </div>
                  <span className="font-mono text-white">+255741808971</span>
                </a>

                <a
                  href="https://wa.me/255620742182?text=Hello,%20I%20would%20like%20to%20inquire%20about%20Colls%20Records%20services"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all text-xs text-emerald-300 font-semibold"
                >
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>Jackson Paul (Jacoh Master)</span>
                  </div>
                  <span className="font-mono text-white">+255620742182</span>
                </a>
              </div>
            </div>

            {/* Embedded Stylized Map Card for Tanga Mjini, Tanzania */}
            <div className="glass-panel p-6 rounded-3xl border border-neutral-800 shadow-xl space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-amber-400 font-bold uppercase">Tanga Mjini Coordinates</span>
                <span className="font-mono text-neutral-400">5.0690° S, 39.0988° E</span>
              </div>
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                <iframe
                  title="Colls Records Tanga Location"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  src="https://maps.google.com/maps?q=Tanga%20Mjini,%20Tanzania&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full filter invert contrast-125 opacity-80"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-7">
            <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-neutral-800 shadow-2xl space-y-6">
              <div>
                <h3 className="font-display font-bold text-2xl text-white">
                  Send a Direct Studio Message
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                  Submissions are sent directly to the Colls Records management inbox and producer roster.
                </p>
              </div>

              {submitted ? (
                <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h4 className="text-lg font-bold text-white">
                    Message Dispatched Successfully!
                  </h4>
                  <p className="text-xs sm:text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out to Colls Records. Our studio management and producers will review your inquiry and respond promptly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-6 py-2 bg-neutral-900 hover:bg-neutral-800 text-amber-400 font-semibold text-xs rounded-xl border border-neutral-700"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-neutral-300 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Baraka Mnyika"
                        className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-amber-500"
                      />
                      {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-neutral-300 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="artist@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-amber-500"
                      />
                      {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-neutral-300 mb-1">
                        Phone / WhatsApp (Optional)
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+255 7XX XXX XXX"
                        className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-amber-500"
                      />
                      {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-neutral-300 mb-1">
                        Subject / Project Topic *
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="e.g. EP Mixing &amp; Mastering Inquiry"
                        className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-amber-500"
                      />
                      {errors.subject && <p className="text-xs text-red-400 mt-1">{errors.subject}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-300 mb-1">
                      Message / Project Details *
                    </label>
                    <textarea
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your tracks, desired studio dates, reference sounds, or multimedia specifications..."
                      className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-amber-500"
                    />
                    {errors.message && <p className="text-xs text-red-400 mt-1">{errors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold uppercase text-xs tracking-wider rounded-xl transition-all shadow-lg shadow-amber-500/20 active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Transmitting to Studio...' : 'Send Message to Studio'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
