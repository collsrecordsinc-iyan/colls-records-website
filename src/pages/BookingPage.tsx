import React, { useState, useEffect } from 'react';
import { db } from '../lib/db';
import { ServiceItem, PricingPackage, Booking } from '../types';
import { INITIAL_SERVICES, INITIAL_PRICING, COMPANY_INFO } from '../lib/constants';
import { formatTZS, validateEmail, validateTanzanianPhone } from '../utils/pricing';
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Headphones,
  User,
  ShieldCheck,
  CreditCard
} from 'lucide-react';

interface BookingPageProps {
  onNavigate: (route: string) => void;
  initialServiceId?: string;
  initialPackageId?: string;
}

export const BookingPage: React.FC<BookingPageProps> = ({
  onNavigate,
  initialServiceId,
  initialPackageId
}) => {
  const [services, setServices] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [packages, setPackages] = useState<PricingPackage[]>(INITIAL_PRICING);

  const [selectedServiceId, setSelectedServiceId] = useState<string>(initialServiceId || INITIAL_SERVICES[0].id);
  const [selectedPackageId, setSelectedPackageId] = useState<string>(initialPackageId || INITIAL_PRICING[1].id);
  const [preferredDate, setPreferredDate] = useState<string>(
    new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );
  const [preferredTime, setPreferredTime] = useState<string>('14:00');
  const [assignedTo, setAssignedTo] = useState<string>('Peter Manyama (New Beats)');

  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    db.getServices().then(setServices);
    db.getPricingPackages().then(setPackages);
  }, []);

  const selectedService = services.find(s => s.id === selectedServiceId) || services[0];
  const selectedPackage = packages.find(p => p.id === selectedPackageId) || packages[0];
  const calculatedPrice = selectedPackage?.price_tzs || selectedService?.starting_price || 50000;

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!clientName.trim()) newErrors.clientName = 'Full name is required';
    if (!validateEmail(clientEmail)) newErrors.clientEmail = 'Valid email is required';
    if (!clientPhone.trim()) newErrors.clientPhone = 'Phone number is required for studio confirmation';
    if (!preferredDate) newErrors.preferredDate = 'Please select a session date';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const newBooking = await db.createBooking({
        client_name: clientName.trim(),
        client_email: clientEmail.trim(),
        client_phone: clientPhone.trim(),
        service_id: selectedService.id,
        service_name: selectedService.name,
        package_id: selectedPackage.id,
        package_name: selectedPackage.name,
        preferred_date: preferredDate,
        preferred_time: preferredTime,
        notes: notes.trim(),
        assigned_to: assignedTo,
        price_tzs: calculatedPrice
      });

      setConfirmedBooking(newBooking);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest">
            <CalendarIcon className="w-4 h-4" />
            <span>Studio Reservation System</span>
          </div>
          <h1 className="font-display font-black text-4xl sm:text-5xl text-white uppercase tracking-tight">
            Book a Studio Session
          </h1>
          <p className="text-sm text-neutral-300 leading-relaxed">
            Reserve vocal tracking, beats consultation, mixing or video shoots directly at Colls Records in Tanga.
          </p>
        </div>

        {confirmedBooking ? (
          <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-emerald-500/40 text-center space-y-6 shadow-2xl max-w-2xl mx-auto animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h2 className="font-display font-bold text-3xl text-white">
              Studio Session Reserved!
            </h2>

            <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 text-left space-y-2 text-xs">
              <div className="flex justify-between pb-2 border-b border-neutral-800">
                <span className="text-neutral-400">Booking Reference:</span>
                <span className="font-mono font-bold text-amber-400">{confirmedBooking.id}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-neutral-800">
                <span className="text-neutral-400">Artist / Client:</span>
                <span className="font-semibold text-white">{confirmedBooking.client_name}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-neutral-800">
                <span className="text-neutral-400">Service &amp; Package:</span>
                <span className="font-semibold text-white">{confirmedBooking.service_name} — {confirmedBooking.package_name}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-neutral-800">
                <span className="text-neutral-400">Scheduled Date &amp; Time:</span>
                <span className="font-semibold text-white">{confirmedBooking.preferred_date} at {confirmedBooking.preferred_time}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-neutral-800">
                <span className="text-neutral-400">Lead Producer:</span>
                <span className="font-semibold text-emerald-400">{confirmedBooking.assigned_to}</span>
              </div>
              <div className="flex justify-between pt-1 text-sm font-bold">
                <span className="text-neutral-300">Estimated Total:</span>
                <span className="text-amber-400 font-mono">{formatTZS(confirmedBooking.price_tzs)}</span>
              </div>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed max-w-md mx-auto">
              Our reception will contact you on <strong>{confirmedBooking.client_phone}</strong> to confirm audio setup requirements and deposit transfer via M-Pesa or Tigo Pesa.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => onNavigate('/portal')}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold uppercase text-xs tracking-wider rounded-xl transition-all"
              >
                View in Client Portal
              </button>
              <a
                href={`https://wa.me/255741808971?text=Hello%20Colls%20Records,%20I%20have%20submitted%20booking%20${confirmedBooking.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold uppercase text-xs tracking-wider rounded-xl transition-all"
              >
                WhatsApp Producer Confirmation
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={handleBooking} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Step 1 & 2: Service & Schedule Details */}
            <div className="lg:col-span-7 space-y-6">
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-neutral-800 space-y-6">
                <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-mono font-bold">1</span>
                  <span>Select Service &amp; Package</span>
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-300 mb-1">
                      Production Service
                    </label>
                    <select
                      value={selectedServiceId}
                      onChange={(e) => setSelectedServiceId(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-amber-500"
                    >
                      {services.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} (from {formatTZS(s.starting_price)})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-300 mb-1">
                      Pricing Package
                    </label>
                    <select
                      value={selectedPackageId}
                      onChange={(e) => setSelectedPackageId(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-amber-500"
                    >
                      {packages.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} — {formatTZS(p.price_tzs)} ({p.unit})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-neutral-800 space-y-6">
                <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-mono font-bold">2</span>
                  <span>Schedule &amp; Producer Assignment</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-300 mb-1">
                      Preferred Date *
                    </label>
                    <input
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-amber-500"
                    />
                    {errors.preferredDate && (
                      <p className="text-xs text-red-400 mt-1">{errors.preferredDate}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-300 mb-1">
                      Preferred Time Block
                    </label>
                    <select
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-amber-500"
                    >
                      <option value="10:00">Morning Session (10:00 AM)</option>
                      <option value="14:00">Afternoon Session (2:00 PM)</option>
                      <option value="18:00">Evening Session (6:00 PM)</option>
                      <option value="21:00">Night Lockout (9:00 PM - 5:00 AM)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-300 mb-1">
                    Producer Preference
                  </label>
                  <select
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-amber-500"
                  >
                    <option value="Peter Manyama (New Beats)">Peter Manyama / New Beats (Chief Producer)</option>
                    <option value="Jackson Paul (Jacoh Master)">Jackson Paul / Jacoh Master (Assistant Producer)</option>
                    <option value="Colls In-House Engineer">Any Available Lead Engineer</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 3: Contact & Cost Summary */}
            <div className="lg:col-span-5 space-y-6">
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-neutral-800 space-y-6 shadow-xl">
                <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-mono font-bold">3</span>
                  <span>Client Information</span>
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-300 mb-1">
                      Full Name / Artist Stage Name *
                    </label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. Amina Salum"
                      className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-amber-500"
                    />
                    {errors.clientName && (
                      <p className="text-xs text-red-400 mt-1">{errors.clientName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="artist@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-amber-500"
                    />
                    {errors.clientEmail && (
                      <p className="text-xs text-red-400 mt-1">{errors.clientEmail}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-300 mb-1">
                      WhatsApp / Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="+255 7XX XXX XXX"
                      className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-amber-500"
                    />
                    {errors.clientPhone && (
                      <p className="text-xs text-red-400 mt-1">{errors.clientPhone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-300 mb-1">
                      Session Notes &amp; Track References
                    </label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Musical key, tempo, reference artist YouTube link, or stem count..."
                      className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Billing Summary Box */}
                <div className="pt-4 border-t border-neutral-800 space-y-2">
                  <div className="flex justify-between text-xs text-neutral-400">
                    <span>Package Rate:</span>
                    <span className="font-mono text-white">{formatTZS(calculatedPrice)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-neutral-400">
                    <span>Studio Prep &amp; Sound Check:</span>
                    <span className="text-emerald-400 font-mono">Included Free</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-neutral-800">
                    <span>Total (TZS):</span>
                    <span className="text-amber-400 font-mono">{formatTZS(calculatedPrice)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold uppercase text-xs tracking-wider rounded-xl transition-all shadow-xl shadow-amber-500/20 active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <CalendarIcon className="w-4 h-4" />
                  <span>{isSubmitting ? 'Confirming Slot...' : 'Confirm Studio Booking'}</span>
                </button>

                <p className="text-[10px] text-center text-neutral-500">
                  Payment is made upon booking confirmation via M-Pesa, Tigo Pesa, or studio desk in Tanga.
                </p>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
