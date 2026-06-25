import React, { useState } from 'react';
import { QuizAnswers, Question } from '../types';
import { QUESTIONS_LIST } from '../data';
import {
  ArrowLeft, ArrowRight, ArrowDown, Check, Sparkles,
  User, Mail, MessageSquare, Landmark, Lock, ShieldCheck
} from 'lucide-react';

interface QuizFlowProps {
  onFinishQuiz: (answers: QuizAnswers, score: number) => void;
  onBackToHome: () => void;
}

export default function QuizFlow({ onFinishQuiz, onBackToHome }: QuizFlowProps) {
  // Steps: 1 = Contact info | 2-11 = Best practices | 12 = Qualification | 13 = Loading
  const [currentStep, setCurrentStep] = useState<number>(1);

  const [formData, setFormData] = useState<Partial<QuizAnswers>>({
    fullName: '',
    email: '',
    whatsapp: '',
    monthlyRevenue: '',
    mobileLoadSpeed: '',
    whatsappCapture: '',
    guestCheckout: '',
    searchBar: '',
    custom404: '',
    loyaltyVisible: '',
    postPurchaseFlow: '',
    ga4Tracking: '',
    heatmapsUsed: '',
    abTesting: '',
    currentSituation: '',
    desiredOutcome: '',
    biggestObstacle: '',
    preferredSolution: '',
    additionalNotes: ''
  });

  const [validationError, setValidationError] = useState<string>('');

  const bestPracticesQuestions = QUESTIONS_LIST.filter(q => q.stepType === 'practices');
  const qualificationQuestions = QUESTIONS_LIST.filter(q => q.stepType === 'qualification');
  const totalPhysicalSteps = 13;

  const handleInputChange = (field: keyof QuizAnswers, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setValidationError('');
  };

  const calculateResultScore = (currentAnswers: Partial<QuizAnswers>): number => {
    let score = 30;
    bestPracticesQuestions.forEach(question => {
      const userAnswer = currentAnswers[question.id] as string;
      if (!userAnswer) return;
      if (question.positiveOptions.includes(userAnswer)) score += 5;
      else if (question.partialOptions && question.partialOptions.includes(userAnswer)) score += 2.5;
    });
    const revenueToBonus: Record<string, number> = {
      'Under ₦10M': 2, '₦10M – ₦50M': 5, '₦50M – ₦150M': 8, 'Over ₦150M': 10,
      '$0 - $10k': 2, '$10k - $50k': 5, '$50k - $250k': 8, '$250k - $1M': 10, '$1M+': 10,
    };
    score += revenueToBonus[currentAnswers.monthlyRevenue || ''] || 0;
    const sitToBonus: Record<string, number> = {
      'Early stage / struggling (< ₦10M revenue)': 2,
      'Stuck at 7 figures and frustrated with growth': 5,
      'Scaling past ₦50M and want faster growth': 9,
      'Already doing well but hitting a plateau': 10,
    };
    score += sitToBonus[currentAnswers.currentSituation || ''] || 0;
    return Math.min(100, Math.max(15, Math.round(score)));
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName?.trim()) { setValidationError('Please enter your full name.'); return; }
    if (!formData.email?.includes('@')) { setValidationError('Please enter a valid work email address.'); return; }
    if (!formData.whatsapp || formData.whatsapp.length < 6) { setValidationError('Please enter your WhatsApp / mobile number.'); return; }
    if (!formData.monthlyRevenue) { setValidationError('Please select your current monthly store revenue.'); return; }
    setValidationError('');
    setCurrentStep(2);
  };

  const handlePracticeSelect = (questionId: keyof QuizAnswers, optionValue: string) => {
    setFormData(prev => ({ ...prev, [questionId]: optionValue }));
    setTimeout(() => {
      const curIndex = bestPracticesQuestions.findIndex(q => q.id === questionId);
      if (curIndex !== -1 && curIndex < bestPracticesQuestions.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        setCurrentStep(12);
      }
    }, 400);
  };

  const handleQualSubmit = () => {
    if (!formData.currentSituation) { setValidationError('Please select your current situation.'); return; }
    if (!formData.desiredOutcome) { setValidationError('Please define your desired outcome.'); return; }
    if (!formData.biggestObstacle) { setValidationError('Please state your biggest obstacle.'); return; }
    if (!formData.preferredSolution) { setValidationError('Please select your preferred solution type.'); return; }
    setValidationError('');
    setCurrentStep(13);
    setTimeout(() => {
      const finalScore = calculateResultScore(formData);
      onFinishQuiz(formData as QuizAnswers, finalScore);
    }, 3200);
  };

  const handlePrevStep = () => {
    setValidationError('');
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
    else onBackToHome();
  };

  const getSectionLabel = () => {
    if (currentStep === 1) return { label: 'Step 1 of 3 · Your Details', sub: 'SECTION A' };
    if (currentStep >= 2 && currentStep <= 11) return { label: `Question ${currentStep - 1} of 10`, sub: 'SECTION B · BEST PRACTICES' };
    return { label: 'Final Questions', sub: 'SECTION C · QUALIFICATION' };
  };

  const progressPercent = ((currentStep - 1) / (totalPhysicalSteps - 1)) * 100;
  const isPracticesStep = currentStep >= 2 && currentStep <= 11;
  const currentPracticeIndex = currentStep - 2;
  const currentPracticeQuestion: Question | undefined = bestPracticesQuestions[currentPracticeIndex];
  const { label: stepLabel, sub: sectionSub } = getSectionLabel();

  const inputCls = "w-full bg-zinc-950/80 border border-white/8 rounded-xl py-3.5 px-4 text-white placeholder-zinc-600 focus:outline-none focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 transition-all text-sm";
  const labelCls = "text-[10px] font-bold text-on-surface-variant uppercase tracking-widest font-mono mb-1.5 block";

  return (
    <div className="bg-dark-bg min-h-screen text-on-surface flex flex-col font-sans">

      {/* ── HEADER ── */}
      <header className="w-full sticky top-0 z-50 bg-black/80 border-b border-white/6 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={onBackToHome}>
            <img alt="Page Profit Accelerator" className="h-8 w-auto object-contain" src="/logo.png" />
          </div>
          <div className="hidden md:flex items-center gap-2 text-[10px] font-bold tracking-widest text-primary-green uppercase">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>Assessment In Progress</span>
          </div>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="flex-grow flex flex-col items-center justify-start py-10 md:py-14 px-5 relative">

        {/* Progress bar (hidden on loading step) */}
        {currentStep < 13 && (
          <div className="w-full max-w-2xl mb-10">
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-[9px] font-mono font-bold text-primary-green tracking-widest uppercase">{sectionSub}</span>
              <span className="text-[10px] font-semibold text-on-surface-variant">{stepLabel}</span>
            </div>
            <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-green rounded-full transition-all duration-500 ease-out shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Validation error */}
        {validationError && (
          <div className="w-full max-w-2xl mb-6 bg-red-950/40 border border-red-500/25 text-red-300 p-4 rounded-xl text-sm flex items-center gap-3 animate-fade-in">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-ping shrink-0" />
            {validationError}
          </div>
        )}

        <div className="w-full max-w-2xl">

          {/* ─── STEP 1: CONTACT INFO ─── */}
          {currentStep === 1 && (
            <section className="space-y-8 animate-fade-in">
              <div>
                <span className="inline-block text-[9px] font-mono font-bold text-primary-green border border-primary-green/25 px-3 py-1 rounded-full uppercase tracking-widest bg-primary-green/5 mb-4">
                  Let's Get Started
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight uppercase mb-3" style={{ fontFamily: 'Outfit,sans-serif' }}>
                  LET'S START WITH THE FOUNDATION.
                </h1>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  Tell us about your operation so we can calibrate the accelerator for your specific volume and goals.
                </p>
              </div>

              <form onSubmit={handleContactSubmit} className="space-y-5">
                {/* Row 1: Name + Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelCls}>Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 pointer-events-none" />
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={e => handleInputChange('fullName', e.target.value)}
                        placeholder="Olayemi Solomon"
                        className={inputCls.replace('px-4', 'pl-10 pr-4')}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Work Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 pointer-events-none" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={e => handleInputChange('email', e.target.value)}
                        placeholder="olayemi@brand.com"
                        className={inputCls.replace('px-4', 'pl-10 pr-4')}
                      />
                    </div>
                  </div>
                </div>

                {/* Row 2: WhatsApp + Revenue */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelCls}>
                      WhatsApp / Phone
                      <span className="ml-2 text-primary-green normal-case font-normal tracking-normal text-[8px]">For your PDF delivery</span>
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 pointer-events-none" />
                      <input
                        type="tel"
                        value={formData.whatsapp}
                        onChange={e => handleInputChange('whatsapp', e.target.value)}
                        placeholder="+234 (812) 345-6789"
                        className={inputCls.replace('px-4', 'pl-10 pr-4')}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Current Monthly Revenue</label>
                    <div className="relative">
                      <Landmark className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 pointer-events-none" />
                      <select
                        value={formData.monthlyRevenue}
                        onChange={e => handleInputChange('monthlyRevenue', e.target.value)}
                        className={inputCls.replace('px-4', 'pl-10 pr-10') + ' appearance-none cursor-pointer'}
                      >
                        <option value="" disabled>Select Revenue Range</option>
                        <option value="Under ₦10M">Under ₦10M (or Under $10k)</option>
                        <option value="₦10M – ₦50M">₦10M – ₦50M (or $10k – $50k)</option>
                        <option value="₦50M – ₦150M">₦50M – ₦150M (or $50k – $250k)</option>
                        <option value="Over ₦150M">Over ₦150M (or Over $250k)</option>
                      </select>
                      <ArrowDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Privacy note */}
                <div className="flex items-center gap-2.5 bg-primary-green/5 border border-primary-green/15 rounded-xl p-3.5">
                  <Lock className="w-4 h-4 text-primary-green shrink-0" />
                  <p className="text-[11px] text-on-surface-variant leading-relaxed">
                    <strong className="text-white">100% Confidential.</strong> Your data is encrypted and never shared. Used only to personalise your report.
                  </p>
                </div>

                {/* Nav */}
                <div className="pt-6 flex justify-between items-center border-t border-white/5">
                  <button
                    type="button"
                    onClick={onBackToHome}
                    className="text-on-surface-variant/60 font-semibold text-xs uppercase tracking-wider flex items-center gap-2 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    type="submit"
                    className="glow-btn px-8 py-3.5 rounded-xl text-sm uppercase tracking-wider flex items-center gap-2 font-extrabold cursor-pointer"
                    style={{ fontFamily: 'Outfit,sans-serif' }}
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* ─── STEPS 2-11: BEST PRACTICES ─── */}
          {isPracticesStep && currentPracticeQuestion && (
            <section className="space-y-7 animate-fade-in" key={currentPracticeQuestion.id}>
              <div>
                <span className="inline-block text-[9px] font-mono font-bold text-primary-green border border-primary-green/25 px-3 py-1 rounded-full uppercase tracking-widest bg-primary-green/5 mb-4">
                  {currentPracticeQuestion.title}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight uppercase" style={{ fontFamily: 'Outfit,sans-serif' }}>
                  {currentPracticeQuestion.description}
                </h1>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {currentPracticeQuestion.options.map((option, idx) => {
                  const isSelected = formData[currentPracticeQuestion.id] === option;
                  return (
                    <button
                      key={idx}
                      onClick={() => handlePracticeSelect(currentPracticeQuestion.id, option)}
                      className={`w-full text-left p-5 rounded-xl border transition-all duration-200 flex items-center justify-between group cursor-pointer ${
                        isSelected
                          ? 'bg-primary-green/10 border-primary-green text-white shadow-[0_0_20px_rgba(16,185,129,0.08)]'
                          : 'bg-zinc-950/60 border-white/6 text-on-surface-variant hover:border-primary-green/30 hover:bg-zinc-900/40 hover:text-white'
                      }`}
                    >
                      <span className="text-sm font-semibold leading-relaxed">{option}</span>
                      <span className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 transition-all ml-4 ${
                        isSelected
                          ? 'border-primary-green bg-primary-green text-white'
                          : 'border-white/15 group-hover:border-primary-green/40'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-6 flex justify-between items-center border-t border-white/5">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="text-on-surface-variant/60 font-semibold text-xs uppercase tracking-wider flex items-center gap-2 hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <div className="text-[9px] font-mono text-on-surface-variant/30 uppercase tracking-widest">
                  AUTO-ADVANCE ENABLED
                </div>
              </div>
            </section>
          )}

          {/* ─── STEP 12: QUALIFICATION ─── */}
          {currentStep === 12 && (
            <section className="space-y-7 animate-fade-in">
              <div>
                <span className="inline-block text-[9px] font-mono font-bold text-primary-green border border-primary-green/25 px-3 py-1 rounded-full uppercase tracking-widest bg-primary-green/5 mb-4">
                  Final Stretch
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight uppercase mb-2" style={{ fontFamily: 'Outfit,sans-serif' }}>
                  ALMOST THERE.
                </h1>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  Help us understand your current commercial situation, top objectives, and what's slowing your growth.
                </p>
              </div>

              <div className="space-y-5">
                {/* Current situation */}
                <div>
                  <label className={labelCls}>Which best describes your current situation?</label>
                  <div className="relative">
                    <select
                      value={formData.currentSituation}
                      onChange={e => handleInputChange('currentSituation', e.target.value)}
                      className={inputCls + ' appearance-none cursor-pointer pr-10'}
                    >
                      <option value="" disabled>Select Situation</option>
                      {qualificationQuestions.find(q => q.id === 'currentSituation')?.options.map((opt, i) => (
                        <option value={opt} key={i}>{opt}</option>
                      ))}
                    </select>
                    <ArrowDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 pointer-events-none" />
                  </div>
                </div>

                {/* Desired outcome */}
                <div>
                  <label className={labelCls}>What's your #1 desired outcome in the next 90 days?</label>
                  <div className="relative">
                    <select
                      value={formData.desiredOutcome}
                      onChange={e => handleInputChange('desiredOutcome', e.target.value)}
                      className={inputCls + ' appearance-none cursor-pointer pr-10'}
                    >
                      <option value="" disabled>Select Target Outcome</option>
                      {qualificationQuestions.find(q => q.id === 'desiredOutcome')?.options.map((opt, i) => (
                        <option value={opt} key={i}>{opt}</option>
                      ))}
                    </select>
                    <ArrowDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 pointer-events-none" />
                  </div>
                </div>

                {/* Biggest obstacle */}
                <div>
                  <label className={labelCls}>What's the biggest obstacle holding you back right now?</label>
                  <textarea
                    value={formData.biggestObstacle}
                    onChange={e => handleInputChange('biggestObstacle', e.target.value)}
                    placeholder="E.g. High CPC, low landing page conversion, attribution issues, lack of time..."
                    rows={3}
                    className={inputCls + ' resize-none'}
                  />
                </div>

                {/* Solution + notes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelCls}>Which solution would suit you best?</label>
                    <div className="relative">
                      <select
                        value={formData.preferredSolution}
                        onChange={e => handleInputChange('preferredSolution', e.target.value)}
                        className={inputCls + ' appearance-none cursor-pointer pr-10'}
                      >
                        <option value="" disabled>Select Preference</option>
                        {qualificationQuestions.find(q => q.id === 'preferredSolution')?.options.map((opt, i) => (
                          <option value={opt} key={i}>{opt}</option>
                        ))}
                      </select>
                      <ArrowDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>
                      Anything else we should know?
                      <span className="ml-2 text-zinc-600 normal-case font-normal tracking-normal text-[8px]">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.additionalNotes}
                      onChange={e => handleInputChange('additionalNotes', e.target.value)}
                      placeholder="E.g. Built on Shopify, custom templates..."
                      className={inputCls}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 flex justify-between items-center border-t border-white/5">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="text-on-surface-variant/60 font-semibold text-xs uppercase tracking-wider flex items-center gap-2 hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="button"
                  onClick={handleQualSubmit}
                  className="glow-btn px-8 py-3.5 rounded-xl text-sm uppercase tracking-wider flex items-center gap-2 font-extrabold cursor-pointer"
                  style={{ fontFamily: 'Outfit,sans-serif' }}
                >
                  Generate My Report
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </section>
          )}

          {/* ─── STEP 13: LOADING ─── */}
          {currentStep === 13 && (
            <section className="text-center py-16 animate-fade-in flex flex-col items-center justify-center min-h-[60vh]">
              {/* Icon ring */}
              <div className="relative mb-8">
                <div className="w-24 h-24 rounded-full bg-primary-green/10 border border-primary-green/25 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.15)]">
                  <ShieldCheck className="w-12 h-12 text-primary-green" />
                </div>
                <span className="absolute -top-1 -right-1 flex h-5 w-5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-green opacity-50" />
                  <span className="relative inline-flex rounded-full h-5 w-5 bg-primary-green" />
                </span>
              </div>

              <h1 className="font-extrabold text-3xl sm:text-4xl text-white uppercase mb-3 tracking-tight" style={{ fontFamily: 'Outfit,sans-serif' }}>
                Analysis Complete
              </h1>
              <p className="text-on-surface-variant text-sm max-w-sm mx-auto mb-10 leading-relaxed">
                Your performance data is being processed. Our optimization engine is calculating metrics across your conversion loops and technical leaks...
              </p>

              {/* Progress bar */}
              <div className="relative overflow-hidden bg-zinc-900 h-1.5 w-full max-w-xs rounded-full mx-auto mb-3">
                <div className="h-full bg-primary-green rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ animation: 'marquee-load 3.2s ease-in-out forwards' }} />
              </div>
              <p className="font-mono text-[10px] text-primary-green/60 uppercase tracking-widest">
                Calibrating Accelerator Matrix...
              </p>

              <style>{`
                @keyframes marquee-load {
                  0%   { width: 0%; }
                  60%  { width: 72%; }
                  100% { width: 100%; }
                }
              `}</style>
            </section>
          )}

        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer className="w-full bg-zinc-950/50 border-t border-white/5 mt-auto">
        <div className="max-w-4xl mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-[10px] text-on-surface-variant/40 uppercase tracking-widest font-mono">
          <img alt="Page Profit Accelerator" className="h-6 w-auto object-contain brightness-0 invert opacity-40 hover:opacity-90 transition-opacity" src="/logo.png" />
          <div className="flex gap-5">
            <a href="/privacy" className="hover:text-primary-green transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-primary-green transition-colors">Terms</a>
            <a href="/support" className="hover:text-primary-green transition-colors">Support</a>
          </div>
          <span>© 2026 Page Profit Accelerator</span>
        </div>
      </footer>
    </div>
  );
}
