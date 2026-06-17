import React, { useState } from 'react';
import { QuizAnswers, Question } from '../types';
import { QUESTIONS_LIST } from '../data';
import { ArrowLeft, ArrowRight, ArrowDown, HelpCircle, Check, Play, Sparkles, User, Mail, MessageSquare, Landmark, Lock, ShieldCheck } from 'lucide-react';

interface QuizFlowProps {
  onFinishQuiz: (answers: QuizAnswers, score: number) => void;
  onBackToHome: () => void;
}

export default function QuizFlow({ onFinishQuiz, onBackToHome }: QuizFlowProps) {
  // Current steps: 
  // 1 = Contact info step
  // 2 - 11 = Best practices questions (10 questions)
  // 12 = Qualification step (obectives and obstacle big questions)
  // 13 = Loading / processing screen
  const [currentStep, setCurrentStep] = useState<number>(1);
  
  // State for all questions as key-value
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

  // Tracking errors on inputs
  const [validationError, setValidationError] = useState<string>('');

  // Current active questions list (Best Practices and Qualification)
  const bestPracticesQuestions = QUESTIONS_LIST.filter(q => q.stepType === 'practices');
  const qualificationQuestions = QUESTIONS_LIST.filter(q => q.stepType === 'qualification');

  // Total steps in physical progression (1 = contact, 2..11 = practices questions, 12 = qualification questions summary, 13 = finish screen)
  const totalPhysicalSteps = 13;

  // Handle simple text field changes
  const handleInputChange = (field: keyof QuizAnswers, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setValidationError('');
  };

  // Process and calculate final score before transition
  const calculateResultScore = (currentAnswers: Partial<QuizAnswers>): number => {
    let score = 30; // base score representing baseline DTC benchmark

    // Score from 10 best practices (Max 50 points, 5 points each)
    bestPracticesQuestions.forEach(question => {
      const userAnswer = currentAnswers[question.id] as string;
      if (!userAnswer) return;

      if (question.positiveOptions.includes(userAnswer)) {
        score += 5; // Full score
      } else if (question.partialOptions && question.partialOptions.includes(userAnswer)) {
        score += 2.5; // Partial score
      }
    });

    // Score based on revenue level (Higher scale businesses get closer correlation metrics, Max 10 points)
    const revenueToBonus: Record<string, number> = {
      'Under ₦10M': 2,
      '₦10M – ₦50M': 5,
      '₦50M – ₦150M': 8,
      'Over ₦150M': 10,
      '$0 - $10k': 2,
      '$10k - $50k': 5,
      '$50k - $250k': 8,
      '$250k - $1M': 10,
      '$1M+': 10,
    };
    const revVal = currentAnswers.monthlyRevenue || '';
    score += revenueToBonus[revVal] || 0;

    // Score based on Qualification outcome metrics (Max 10 points)
    const sitToBonus: Record<string, number> = {
      'Early stage / struggling (< ₦10M revenue)': 2,
      'Stuck at 7 figures and frustrated with growth': 5,
      'Scaling past ₦50M and want faster growth': 9,
      'Already doing well but hitting a plateau': 10,
    };
    const sitVal = currentAnswers.currentSituation || '';
    score += sitToBonus[sitVal] || 0;

    // Limit score between 10 and 100
    const finalScore = Math.min(100, Math.max(15, Math.round(score)));
    return finalScore;
  };

  // Navigations
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || formData.fullName.trim() === '') {
      setValidationError('Please enter your full name.');
      return;
    }
    if (!formData.email || !formData.email.includes('@')) {
      setValidationError('Please enter a valid work email address.');
      return;
    }
    if (!formData.whatsapp || formData.whatsapp.length < 6) {
      setValidationError('Please enter your WhatsApp / mobile phone number.');
      return;
    }
    if (!formData.monthlyRevenue) {
      setValidationError('Please select your current monthly store revenue.');
      return;
    }

    setValidationError('');
    setCurrentStep(2); // Jump to first practices question
  };

  const handlePracticeSelect = (questionId: keyof QuizAnswers, optionValue: string) => {
    setFormData(prev => ({
      ...prev,
      [questionId]: optionValue
    }));

    // Auto advance after short delay (400ms for sleek transition)
    setTimeout(() => {
      // Find current practices index
      const curIndex = bestPracticesQuestions.findIndex(q => q.id === questionId);
      if (curIndex !== -1 && curIndex < bestPracticesQuestions.length - 1) {
        // Go to next practices question
        setCurrentStep(prev => prev + 1);
      } else {
        // Switch to Qualification step
        setCurrentStep(12);
      }
    }, 450);
  };

  const handleQualSubmit = () => {
    // Check that required qualification fields are answered
    if (!formData.currentSituation) {
      setValidationError('Please select the description that best fits your current situation.');
      return;
    }
    if (!formData.desiredOutcome) {
      setValidationError('Please define your desired outcome over the next 90 days.');
      return;
    }
    if (!formData.biggestObstacle) {
      setValidationError('Please state your biggest obstacle.');
      return;
    }
    if (!formData.preferredSolution) {
      setValidationError('Please select your preferred solution type.');
      return;
    }

    setValidationError('');
    setCurrentStep(13); // Spin loading screen

    // Trigger simulation of 3 seconds then deliver results
    setTimeout(() => {
      const finalScore = calculateResultScore(formData);
      onFinishQuiz(formData as QuizAnswers, finalScore);
    }, 3200);
  };

  const handlePrevStep = () => {
    setValidationError('');
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      onBackToHome();
    }
  };

  // Determine section header based on current steps
  const getSectionHeader = () => {
    if (currentStep === 1) return 'SECTION 1: DISCOVERY';
    if (currentStep >= 2 && currentStep <= 11) return 'SECTION 2: BEST PRACTICES';
    return 'SECTION 3: QUALIFICATION';
  };

  // Calculate percentage of progress bar
  const progressPercent = (currentStep / totalPhysicalSteps) * 100;

  // Active question render
  const isPracticesStep = currentStep >= 2 && currentStep <= 11;
  const currentPracticeIndex = currentStep - 2;
  const currentPracticeQuestion: Question | undefined = bestPracticesQuestions[currentPracticeIndex];

  return (
    <div className="bg-dark-bg min-h-screen text-on-surface flex flex-col font-sans selection:bg-primary-green selection:text-dark-bg">
      {/* Top Bar Navigation */}
      <header className="w-full sticky top-0 z-50 bg-black/80 border-b border-white/5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onBackToHome}>
            <img 
              alt="Page Profit Accelerator Logo" 
              className="h-10 w-auto object-contain" 
              src="/logo.png"
            />
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs font-bold tracking-widest text-[#00ff66]">
            <span>START ASSESSMENT</span>
            <Sparkles className="w-4 h-4 ml-1 animate-pulse" />
          </div>
        </div>
      </header>

      {/* Main Form Box */}
      <main className="flex-grow flex flex-col items-center justify-start py-10 md:py-16 px-6 relative">
        
        {/* Progress Tracker Section (Only render if not on final loading screen) */}
        {currentStep < 13 && (
          <div className="w-full max-w-3xl mb-10 transition-opacity duration-300">
            <div className="flex justify-between items-end mb-2.5">
              <span className="font-bold text-xs sm:text-sm text-primary-green tracking-wider uppercase font-mono">
                {getSectionHeader()}
              </span>
              <span className="text-xs sm:text-sm font-bold text-white/40">
                Step <span className="text-primary-green font-mono">{currentStep}</span> of {totalPhysicalSteps}
              </span>
            </div>
            
            {/* Double height high-tech styled progress bar */}
            <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary-green transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Validation Alert */}
        {validationError && (
          <div className="w-full max-w-3xl bg-red-950/40 border border-red-500/30 text-red-200 p-4 rounded-xl mb-6 text-sm flex items-center gap-3 animate-fade-in">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
            {validationError}
          </div>
        )}

        <div className="w-full max-w-3xl">
          {/* STEP 1: CONTACT INFO DISCOVERY */}
          {currentStep === 1 && (
            <section className="space-y-8 animate-fade-in">
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-anton text-white leading-tight uppercase mb-3">
                  LET&apos;S START WITH THE FOUNDATION.
                </h1>
                <p className="text-white/50 text-sm sm:text-base leading-relaxed">
                  Tell us about your current operation so we can calibrate the accelerator for your specific volume.
                </p>
              </div>

              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Full Name */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest font-mono">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/30" />
                      <input 
                        type="text" 
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        placeholder="Olayemi Solomon" 
                        className="w-full bg-zinc-950/60 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green transition-all"
                      />
                    </div>
                  </div>

                  {/* Work Email */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest font-mono">
                      Work Email
                    </label>
                    <div className="relative">
                      <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="olayemi@brand.com" 
                        className="w-full bg-zinc-950/60 border border-white/10 rounded-xl py-4 px-4 text-white focus:outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green transition-all"
                      />
                    </div>
                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* WhatsApp/Phone code input with details */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest font-mono flex items-center justify-between">
                      <span>WhatsApp / Phone</span>
                      <span className="text-[9px] text-[#00ff66] font-mono normal-case">FOR DIRECT ACCELERATOR PDF ACCORDINGLY</span>
                    </label>
                    <div className="relative">
                      <input 
                        type="tel" 
                        value={formData.whatsapp}
                        onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                        placeholder="+234 (812) 345-6789" 
                        className="w-full bg-zinc-950/60 border border-white/10 rounded-xl py-4 px-4 text-white focus:outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green transition-all"
                      />
                    </div>
                  </div>

                  {/* Current Monthly store revenue dropdown listing */}
                  <div className="flex flex-col gap-2 font-sans">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest font-mono">
                      Current Monthly Revenue
                    </label>
                    <div className="relative">
                      <select 
                        value={formData.monthlyRevenue}
                        onChange={(e) => handleInputChange('monthlyRevenue', e.target.value)}
                        className="w-full bg-zinc-950/60 border border-white/10 rounded-xl py-4 px-4 text-white focus:outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green transition-all appearance-none cursor-pointer"
                      >
                        <option value="" disabled>Select Revenue Range</option>
                        <option value="Under ₦10M">Under ₦10M (or Under $10k)</option>
                        <option value="₦10M – ₦50M">₦10M – ₦50M (or $10k - $50k)</option>
                        <option value="₦10M – ₦50M">₦50M – ₦150M (or $50k - $250k)</option>
                        <option value="Over ₦150M">Over ₦150M (or Over $250k)</option>
                      </select>
                      <ArrowDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                    </div>
                  </div>

                </div>

                <div className="pt-8 flex justify-between items-center border-t border-white/5">
                  <button 
                    type="button"
                    onClick={onBackToHome}
                    className="text-white/40 font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                  </button>
                  <button 
                    type="submit"
                    className="glow-btn bg-primary-green text-dark-bg font-anton px-8 py-4.5 rounded-xl text-md uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg hover:brightness-110 active:scale-95"
                  >
                    <span>CONTINUE</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* QUESTIONS 5 - 14: BEST PRACTICES DYNAMIC FLOW */}
          {isPracticesStep && currentPracticeQuestion && (
            <section className="space-y-8 animate-fade-in" key={currentPracticeQuestion.id}>
              <div>
                <span className="text-[10px] font-mono text-primary-green border border-primary-green/20 px-3 py-1 rounded-full uppercase tracking-widest bg-primary-green/5 inline-block mb-3">
                  {currentPracticeQuestion.title}
                </span>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-anton text-white leading-tight uppercase">
                  {currentPracticeQuestion.description}
                </h1>
              </div>

              {/* Multi-choice options listing */}
              <div className="grid grid-cols-1 gap-4">
                {currentPracticeQuestion.options.map((option, idx) => {
                  const isSelected = formData[currentPracticeQuestion.id] === option;
                  return (
                    <button
                      key={idx}
                      onClick={() => handlePracticeSelect(currentPracticeQuestion.id, option)}
                      className={`w-full text-left p-6 rounded-xl border transition-all flex items-center justify-between group cursor-pointer ${
                        isSelected 
                          ? 'bg-zinc-900 border-primary-green text-white shadow-md shadow-primary-green/5' 
                          : 'bg-zinc-950/60 border-white/5 text-white/70 hover:border-primary-green/40 hover:bg-zinc-900/40 hover:text-white'
                      }`}
                    >
                      <span className="text-sm sm:text-base font-semibold leading-relaxed">
                        {option}
                      </span>
                      
                      {/* Check/Bullet radio circle indicator */}
                      <span className={`h-6 w-6 rounded-full border flex items-center justify-center transition-all ${
                        isSelected 
                          ? 'border-primary-green bg-primary-green/20 text-primary-green' 
                          : 'border-white/10 group-hover:border-primary-green/45 text-transparent'
                      }`}>
                        <Check className="w-3.5 h-3.5 font-bold" />
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Navigation Footer */}
              <div className="pt-8 flex justify-between items-center border-t border-white/5">
                <button 
                  type="button"
                  onClick={handlePrevStep}
                  className="text-white/40 font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <div className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
                  AUTO-ADVANCE ENABLED // V2026
                </div>
              </div>
            </section>
          )}

          {/* STEP 12: QUALIFICATION TEXT DETAILS AND MAIN OBSTACLES */}
          {currentStep === 12 && (
            <section className="space-y-8 animate-fade-in">
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-anton text-white leading-tight uppercase">
                  THE FINAL STRETCH.
                </h1>
                <p className="text-white/50 text-sm sm:text-base leading-relaxed">
                  Help us understand your current commercial standing, top objectives, and what is strictly slowing your growth.
                </p>
              </div>

              <div className="space-y-6">
                
                {/* Situation Dropdown Choice */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-widest font-mono">
                    Which best describes your current situation?
                  </label>
                  <div className="relative">
                    <select
                      value={formData.currentSituation}
                      onChange={(e) => handleInputChange('currentSituation', e.target.value)}
                      className="w-full bg-zinc-950/60 border border-white/10 rounded-xl py-4 px-4 text-white focus:outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green transition-all appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Select Situation</option>
                      {qualificationQuestions.find(q => q.id === 'currentSituation')?.options.map((opt, i) => (
                        <option value={opt} key={i}>{opt}</option>
                      ))}
                    </select>
                    <ArrowDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4_h-4 text-white/30 pointer-events-none" />
                  </div>
                </div>

                {/* Outcome Dropdown Choice */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-widest font-mono">
                    What’s your #1 desired outcome in the next 90 days?
                  </label>
                  <div className="relative">
                    <select
                      value={formData.desiredOutcome}
                      onChange={(e) => handleInputChange('desiredOutcome', e.target.value)}
                      className="w-full bg-zinc-950/60 border border-white/10 rounded-xl py-4 px-4 text-white focus:outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green transition-all appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Select Target</option>
                      {qualificationQuestions.find(q => q.id === 'desiredOutcome')?.options.map((opt, i) => (
                        <option value={opt} key={i}>{opt}</option>
                      ))}
                    </select>
                    <ArrowDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                  </div>
                </div>

                {/* Obstacle Long text input */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-widest font-mono">
                    What’s the biggest obstacle holding you back right now?
                  </label>
                  <textarea 
                    value={formData.biggestObstacle}
                    onChange={(e) => handleInputChange('biggestObstacle', e.target.value)}
                    placeholder="E.g. High CPC, low landing page conversion, attribution issues, lack of time..." 
                    rows={3}
                    className="w-full bg-zinc-950/60 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green transition-all resize-none text-sm"
                  />
                </div>

                {/* Solution preference Dropdown choice */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest font-mono">
                      Which solution would suit you best?
                    </label>
                    <div className="relative">
                      <select
                        value={formData.preferredSolution}
                        onChange={(e) => handleInputChange('preferredSolution', e.target.value)}
                        className="w-full bg-zinc-950/60 border border-white/10 rounded-xl py-4 px-4 text-white focus:outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green transition-all appearance-none cursor-pointer"
                      >
                        <option value="" disabled>Select Preference</option>
                        {qualificationQuestions.find(q => q.id === 'preferredSolution')?.options.map((opt, i) => (
                          <option value={opt} key={i}>{opt}</option>
                        ))}
                      </select>
                      <ArrowDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest font-mono">
                      Anything else we should know? <span className="text-[10px] text-white/20 italic">(Optional)</span>
                    </label>
                    <input 
                      type="text"
                      value={formData.additionalNotes}
                      onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                      placeholder="E.g. built on Shopify, custom templates, etc." 
                      className="w-full bg-zinc-950/60 border border-white/10 rounded-xl py-4 px-4 text-white focus:outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green transition-all"
                    />
                  </div>

                </div>

              </div>

              {/* Footer navigation */}
              <div className="pt-8 flex justify-between items-center border-t border-white/5">
                <button 
                  type="button"
                  onClick={handlePrevStep}
                  className="text-white/40 font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button 
                  type="button"
                  onClick={handleQualSubmit}
                  className="glow-btn bg-primary-green text-dark-bg font-anton px-8 py-4.5 rounded-xl text-md uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-primary-green/10"
                >
                  <span>GENERATE REPORT</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </section>
          )}

          {/* STEP 13: LOADING SPLASH SCREEN WITH THE "ANALYSIS COMPLETE" INTERACTIVE BAR */}
          {currentStep === 13 && (
            <section className="text-center py-12 animate-fade-in flex flex-col items-center justify-center">
              <div className="mb-8 inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-primary-green/10 border-2 border-primary-green rounded-full shadow-lg shadow-primary-green/20">
                <ShieldCheck className="w-10 h-10 sm:w-12 sm:h-12 text-primary-green animate-bounce" />
              </div>
              
              <h1 className="font-anton text-3xl sm:text-4xl lg:text-5xl text-primary-green uppercase mb-4 tracking-normal">
                ANALYSIS COMPLETE
              </h1>
              
              <p className="text-white/60 text-sm sm:text-base max-w-md mx-auto mb-10 leading-relaxed font-sans">
                Your performance data is being processed. Our optimization engine is calculating metrics over your custom conversion loops and technical leaks...
              </p>

              {/* Loading Bar Slider detail */}
              <div className="relative overflow-hidden bg-zinc-900 h-2 w-full max-w-sm rounded-full mx-auto mb-4">
                <div className="h-full bg-primary-green rounded-full animate-marquee-load"></div>
              </div>

              <p className="font-mono text-xs text-[#00ff66]/60 uppercase tracking-widest font-semibold">
                CALIBRATING ACCELERATOR MATRIX PATHS...
              </p>
            </section>
          )}

        </div>
      </main>

      {/* Styled animation keyframes within CSS */}
      <style>{`
        @keyframes marquee-load {
          0% { width: 0%; }
          50% { width: 68%; }
          100% { width: 100%; }
        }
        .animate-marquee-load {
          animation: marquee-load 3s ease-in-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>

      {/* Shared Footer component matching design */}
      <footer className="w-full bg-neutral-950 border-t border-white/5 mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="font-anton text-2xl text-primary-green uppercase tracking-wider">
            PAGE PROFIT
          </div>
          <div className="flex flex-col items-center sm:items-end gap-1.5 text-[10px] text-white/30 font-sans uppercase">
            <div className="flex gap-4">
              <a href="/privacy" className="hover:text-primary-green transition-colors">Privacy Policy</a>
              <a href="/terms" className="hover:text-primary-green transition-colors">Terms of Service</a>
              <a href="/support" className="hover:text-primary-green transition-colors">Contact Support</a>
            </div>
            <p>© 2026 PAGE PROFIT ACCELERATOR. ALL RIGHTS RESERVED.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
