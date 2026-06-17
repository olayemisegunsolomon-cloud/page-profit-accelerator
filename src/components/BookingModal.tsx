import React, { useState } from 'react';
import { QuizAnswers } from '../types';
import { X, Calendar, Clock, Phone, Mail, User, CheckCircle2, Shield, AlertCircle } from 'lucide-react';

interface BookingModalProps {
  answers: QuizAnswers;
  onClose: () => void;
}

export default function BookingModal({ answers, onClose }: BookingModalProps) {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>('');

  const timeSlots = [
    '09:30 AM (WAT/Lagos)',
    '11:00 AM (WAT/Lagos)',
    '01:30 PM (WAT/Lagos)',
    '03:00 PM (WAT/Lagos)',
    '04:30 PM (WAT/Lagos)'
  ];

  const calComLinkBase = (import.meta as any).env.VITE_CAL_COM_LINK;
  const hasCalCom = !!calComLinkBase;

  const getCalComIframeUrl = () => {
    if (!calComLinkBase) return '';
    try {
      const url = new URL(calComLinkBase.startsWith('http') ? calComLinkBase : `https://${calComLinkBase}`);
      url.searchParams.set('name', answers.fullName || '');
      url.searchParams.set('email', answers.email || '');
      url.searchParams.set('notes', `Page Profit Accelerator Audit. Score details target: ${answers.monthlyRevenue || 'N/A'}`);
      return url.toString();
    } catch (e) {
      const cleanLink = calComLinkBase.startsWith('http') ? calComLinkBase : `https://cal.com/${calComLinkBase}`;
      return `${cleanLink}?name=${encodeURIComponent(answers.fullName || '')}&email=${encodeURIComponent(answers.email || '')}&notes=${encodeURIComponent(`Page Profit Accelerator Audit (${answers.monthlyRevenue || 'N/A'})`)}`;
    }
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) {
      setErrorText('Please choose a preferred date for the audit.');
      return;
    }
    if (!selectedTime) {
      setErrorText('Please choose an available time slot.');
      return;
    }

    setErrorText('');
    setFormSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-[110] overflow-y-auto font-sans flex items-center justify-center p-4">
      {/* Black glass Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Card wrapper */}
      <div className={`relative bg-zinc-950 border border-white/10 rounded-2xl ${hasCalCom ? 'max-w-2xl h-[90vh] sm:h-[650px]' : 'max-w-lg'} w-full overflow-hidden shadow-2xl z-10 animate-scale-up text-left flex flex-col`}>
        
        {/* Banner accent decoration */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-primary-green z-20"></div>

        {/* Close Button Trigger */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors h-8 w-8 hover:bg-white/5 rounded-full flex items-center justify-center cursor-pointer z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {hasCalCom ? (
          /* Live Cal.com Embed Layout */
          <div className="flex-1 flex flex-col p-6 sm:p-8 pt-10 h-full overflow-hidden">
            <div className="mb-4 text-left">
              <span className="inline-block text-[9px] font-mono font-bold tracking-widest text-[#00ff66] bg-[#00ff66]/10 px-2 py-0.5 rounded border border-[#00ff66]/20 uppercase">
                Secure Cal.com Calendar Integrator
              </span>
              <h2 className="text-xl font-anton uppercase text-white tracking-wide mt-1.5">
                Schedule Your Revenue Walkthrough
              </h2>
              <p className="text-[11px] text-zinc-400 mt-1 font-sans">
                Below is Olayemi's live scheduler. Pick any time that works for you. Your details have been auto-filled!
              </p>
            </div>
            
            <div className="flex-1 w-full bg-zinc-900/60 rounded-xl border border-white/5 overflow-hidden">
              <iframe
                src={getCalComIframeUrl()}
                className="w-full h-full border-0 rounded-xl"
                title="Schedule 1-on-1 walkthrough with Olayemi"
                allow="camera; microphone; geolocation"
              />
            </div>
          </div>
        ) : !formSubmitted ? (
          <form onSubmit={handleSubmitBooking} className="p-6 sm:p-8 space-y-6">
            
            <div className="space-y-2 pr-6">
              <h2 className="text-2xl font-anton uppercase text-white tracking-wide">
                Book Your Free Revenue Audit
              </h2>
              <p className="text-xs text-white/50 leading-relaxed font-sans">
                Olayemi will personally join you over Zoom or WhatsApp call to review your <strong>Page Profit Score ({answers.monthlyRevenue})</strong> and map out your top 3 conversion leaks.
              </p>
            </div>

            {/* Error alerts */}
            {errorText && (
              <div className="bg-red-950/40 border border-red-500/20 text-red-200 p-3 rounded-lg text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                {errorText}
              </div>
            )}

            <div className="space-y-4">
              
              {/* Pre-filled Account info cards */}
              <div className="bg-zinc-900/60 rounded-xl p-4 border border-white/5 space-y-2 text-xs font-sans">
                <p className="font-mono text-[9px] uppercase tracking-widest text-[#00ff66]/70">Confirming Contact info</p>
                <div className="flex flex-col gap-1.5 text-white/80">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-white/30" />
                    <span>{answers.fullName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-white/30" />
                    <span>{answers.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-white/30" />
                    <span>{answers.whatsapp}</span>
                  </div>
                </div>
              </div>

              {/* Date selection input helper */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 font-mono">
                  1. Select Preferred Date
                </label>
                <div id="booking-date-container" className="relative">
                  <input 
                    type="date" 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]} // restrict past dates
                    className="w-full bg-zinc-900 border border-white/5 rounded-xl py-3.5 px-4 text-white focus:outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green cursor-pointer text-sm"
                  />
                </div>
              </div>

              {/* Time slot option cards selection */}
              <div className="space-y-2.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 font-mono">
                  2. Available Slots (Lagos Peak Times)
                </label>
                <div id="booking-time-grid" className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                  {timeSlots.map((slot, i) => {
                    const isSelected = selectedTime === slot;
                    return (
                      <button
                        type="button"
                        key={i}
                        onClick={() => setSelectedTime(slot)}
                        className={`text-left p-3 rounded-lg border transition-all truncate hover:-translate-y-0.5 ${
                          isSelected 
                            ? 'bg-zinc-900 border-primary-green text-white font-semibold' 
                            : 'bg-black/60 border-white/5 text-white/50 hover:border-white/10 hover:text-white'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Modal submit buttons */}
            <div className="pt-4 border-t border-white/5 flex gap-3">
              <button 
                type="button"
                onClick={onClose}
                className="w-1/3 bg-transparent hover:bg-white/5 border border-white/10 text-white font-bold text-xs uppercase rounded-lg transition-colors cursor-pointer py-3.5 text-center"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="w-2/3 glow-btn bg-primary-green text-dark-bg font-anton text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer py-3.5 text-center shadow-lg"
              >
                Confirm Booking Now
              </button>
            </div>

            <div className="flex items-center justify-center gap-2.5 text-[9px] text-white/30 font-mono uppercase text-center">
              <Shield className="w-3.5 h-3.5 text-primary-green" />
              <span>Private Zoom URL sent to {answers.email} instantly</span>
            </div>

          </form>
        ) : (
          /* Confirmation Success display view */
          <div className="p-8 text-center space-y-6 animate-fade-in md:py-12">
            <div className="h-16 w-16 bg-primary-green/10 border-2 border-primary-green rounded-full flex items-center justify-center text-primary-green mx-auto">
              <CheckCircle2 className="w-8 h-8 animate-bounce" />
            </div>

            <div className="space-y-2">
              <h1 className="font-anton text-2xl uppercase tracking-wide text-primary-green">
                AUDIT CONFIRMED!
              </h1>
              <p className="text-sm text-white/70 leading-relaxed font-sans max-w-sm mx-auto">
                Congrats, <span className="text-white font-bold">{answers.fullName}</span>! Your Free Revenue Audit has been verified for <span className="text-primary-green font-bold text-nowrap">{selectedDate}</span> at <span className="text-primary-green font-bold text-nowrap">{selectedTime}</span>.
              </p>
            </div>

            <div className="bg-zinc-900/60 p-4 border border-white/5 rounded-xl text-left text-xs font-sans space-y-2 max-w-sm mx-auto">
              <p className="font-mono text-[9px] uppercase tracking-widest text-primary-green font-bold">NEXT STEPS:</p>
              <ol className="list-decimal list-inside space-y-1 text-white/50">
                <li>Check email for the custom zoom link invitation.</li>
                <li>Ensure Shopify/WooCommerce admin access is ready.</li>
                <li>Olayemi will ping you on WhatsApp: <strong>{answers.whatsapp}</strong>.</li>
              </ol>
            </div>

            <button 
              onClick={onClose}
              className="glow-btn bg-primary-green text-dark-bg font-anton text-xs uppercase tracking-wider rounded-lg px-8 py-3.5 transition-colors cursor-pointer mt-4"
            >
              Back to Assessment
            </button>
          </div>
        )}

      </div>

      <style>{`
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-up {
          animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
