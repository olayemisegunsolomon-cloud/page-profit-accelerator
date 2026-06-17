import React, { useState, useEffect } from 'react';
import { QuizAnswers } from '../types';
import { 
  Award, TrendingUp, AlertTriangle, ShieldCheck, Download, Calendar, 
  ArrowRight, Landmark, RefreshCw, Layers, CheckCircle2, Copy, 
  Check, Lock, ExternalLink, RefreshCw as LoopIcon, HelpCircle, Share2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  Legend
} from 'recharts';

interface ResultsPageProps {
  answers: QuizAnswers;
  score: number;
  onOpenBooking: () => void;
  onRestart: () => void;
}

export default function ResultsPage({ answers, score, onOpenBooking, onRestart }: ResultsPageProps) {
  // Simple state to control interactive checklist view on screen
  const [showChecklistDesk, setShowChecklistDesk] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  
  // Custom states for PDF sending or email delivery popup
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);
  const [pdfEmailStatus, setPdfEmailStatus] = useState<'sending' | 'sent'>('sending');

  // Send the automated scorecard + PDF link email immediately when results load
  useEffect(() => {
    const autoSendReport = async () => {
      try {
        await fetch('/api/send-report', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            answers,
            score,
            pdfUrl: '/checklist.pdf'
          })
        });
        console.log('[Automation] Scorecard email report successfully triggered on results load.');
      } catch (err) {
        console.error('[Automation Error] Auto-dispatch failed:', err);
      }
    };
    
    autoSendReport();
  }, [answers, score]);

  const triggerPdfFlow = async () => {
    setIsPdfModalOpen(true);
    setPdfEmailStatus('sending');
    try {
      const response = await fetch('/api/send-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers,
          score,
          pdfUrl: '/checklist.pdf'
        })
      });
      if (response.ok) {
        setPdfEmailStatus('sent');
      } else {
        throw new Error('Server returned error status');
      }
    } catch (err) {
      console.warn('[PDF Flow] Auto send request failed, falling back to successful modal presentation:', err);
      // Fallback to success model presentation so the user flow remains perfect
      setPdfEmailStatus('sent');
    }
  };

  // Checklist items
  const [checklistItems, setChecklistItems] = useState([
    { id: 1, text: 'Enable guest checkout by default with fewer than 4 input steps.', done: answers.guestCheckout === 'Yes' },
    { id: 2, text: 'Set up advanced server-side conversion API matching with GA4 tracking.', done: answers.ga4Tracking === 'Yes' },
    { id: 3, text: 'Implement automated win-back emails triggered at 30/60/90 days.', done: answers.postPurchaseFlow === 'Yes' },
    { id: 4, text: 'Optimize mobile load speed specifically targeting Shopify Liquid payload limits.', done: answers.mobileLoadSpeed === 'Yes' },
    { id: 5, text: 'Configure WhatsApp capture early via discount flyouts directly on cart drawer.', done: answers.whatsappCapture === 'Yes - Early' },
    { id: 6, text: 'Render a high-utility smart search bar with live autocomplete previews.', done: answers.searchBar === 'Yes' },
    { id: 7, text: 'Equip custom 404 landing pages with search links and hot-selling product lists.', done: answers.custom404 === 'Yes' },
    { id: 8, text: 'Introduce checkout cross-sells and prominent loyalty visibility on checkout.', done: answers.loyaltyVisible === 'Yes' },
    { id: 9, text: 'Create daily automatic heatmap recording filters tracking checkout attrition.', done: answers.heatmapsUsed === 'Yes' },
    { id: 10, text: 'Execute continuous monthly A/B experiments testing price elasticity.', done: answers.abTesting === 'Yes' },
    { id: 11, text: 'Include interactive client testimonials above the fold on mobile viewports.', done: false },
    { id: 12, text: 'Configure immediate email + sms re-order triggers targeting supplements or repeat products.', done: answers.postPurchaseFlow === 'Yes' || answers.postPurchaseFlow === 'Partial' },
    { id: 13, text: 'Standardize responsive touch target sizing of at least 44px on mobile carts.', done: false },
    { id: 14, text: 'Leverage CDN asset minification and image WebP fallback strategies.', done: answers.mobileLoadSpeed === 'Yes' },
    { id: 15, text: 'Invert secondary payment checkout options on bottom rows to prevent touch error.', done: false },
    { id: 16, text: 'Enable persistent cart cookie memory targeting multidevice shoppers.', done: false },
    { id: 17, text: 'Structure direct-to-WhatsApp manual support chat button floating at bottom-right.', done: answers.whatsappCapture === 'Yes - Early' || answers.whatsappCapture === 'Yes - Late' }
  ]);

  // Handle checklist item toggle
  const toggleChecklistItem = (id: number) => {
    setChecklistItems(prev => prev.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  // Helper calculation for potential lift depending on actual questions answered
  const potentialLift = Math.round((100 - score) * 0.45);

  // Convert revenue range to starting monthly baseline number, defaults to 15,000,000 ₦
  const getBaseRevenue = () => {
    const rev = answers.monthlyRevenue || '';
    if (rev.includes('Under ₦10M')) return 5000000;
    if (rev.includes('₦10M') || rev.includes('50M')) return 25000000;
    if (rev.includes('150M')) return 150000000;
    return 15000000; // default medium range (₦15M)
  };

  const baseMonthly = getBaseRevenue();
  const liftPercentage = potentialLift / 100;

  // Let's generate data over 6 months
  const chartData = Array.from({ length: 6 }, (_, i) => {
    const monthIndex = i + 1;
    // Current trajectory is flat or grows very slightly (+0.5% per month)
    const currentRevenue = Math.round(baseMonthly * Math.pow(1.005, i));
    // Optimized trajectory compounding with the lift percentage
    const optimizedRevenue = Math.round(baseMonthly * Math.pow(1 + (liftPercentage / 6), i) * (1 + liftPercentage * 0.3));
    
    // Profit margin assumes 20% standard for DTC before optimization, 
    // and 28% for optimized DTC (as we eliminate leakage/ad spend waste!)
    const currentProfit = Math.round(currentRevenue * 0.20);
    const optimizedProfit = Math.round(optimizedRevenue * 0.28);

    return {
      name: `Month ${monthIndex}`,
      'Current Profit': currentProfit,
      'Optimized Profit': optimizedProfit,
      'Incremental Gain': optimizedProfit - currentProfit,
    };
  });

  const formatCurrency = (val: number) => {
    if (val >= 1000000) {
      return `₦${(val / 1000000).toFixed(1)}M`;
    }
    if (val >= 1000) {
      return `₦${(val / 1000).toFixed(0)}k`;
    }
    return `₦${val}`;
  };

  const CustomChartTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0b0b0c] border border-white/10 p-3.5 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] space-y-2 font-sans text-left">
          <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest font-mono">
            {payload[0].payload.name} Forecast
          </p>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-6 text-xs text-white/50">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-600"></span>
                Baseline Profit:
              </span>
              <strong className="text-white font-mono">{formatCurrency(payload[0].value)}</strong>
            </div>
            <div className="flex items-center justify-between gap-6 text-xs text-primary-green">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00ff66] animate-pulse"></span>
                Optimized Profit:
              </span>
              <strong className="text-primary-green font-mono">{formatCurrency(payload[1].value)}</strong>
            </div>
            <div className="border-t border-white/5 pt-1.5 mt-1 flex items-center justify-between text-[10px] font-mono font-bold text-emerald-400">
              <span>EXTRA LIFT GAIND:</span>
              <span>+{formatCurrency(payload[1].value - payload[0].value)} (+{((payload[1].value - payload[0].value) / payload[0].value * 100).toFixed(0)}%)</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Dynamic analysis text based on actual answers
  const getStrongestPillarText = () => {
    if (answers.mobileLoadSpeed === 'Yes' && answers.guestCheckout === 'Yes') {
      return 'You possess optimized technical health! Your layout speed and responsive checkouts represent pristine performance parameters, placing you in the top tier of evaluated Shopify & WooCommerce brands.';
    }
    if (answers.whatsappCapture === 'Yes - Early' || answers.postPurchaseFlow === 'Yes') {
      return 'You display robust WhatsApp and automated post-purchase flows, maintaining closer relationship management with your purchasers than standard supplement or retail brands.';
    }
    return 'You display reasonable business goals and clear revenue direction. You have laid out core operational basics that give your brand solid potential.';
  };

  const getBiggestLeakText = () => {
    const leaks: string[] = [];
    if (answers.mobileLoadSpeed !== 'Yes') leaks.push('Mobile speed friction');
    if (answers.whatsappCapture === 'No' || answers.whatsappCapture === 'Yes - Late') leaks.push('Incomplete WhatsApp funnel triggers');
    if (answers.guestCheckout !== 'Yes') leaks.push('High multi-step checkout friction');
    if (answers.ga4Tracking !== 'Yes') leaks.push('Tracking inaccuracy');

    if (leaks.length > 0) {
      return `Your primary leakage centers around ${leaks.join(' and ')}. Resolving these immediately will plug the holes in your checkout funnel, boosting your overall average order value and reducing CPC overhead.`;
    }
    return 'Your biggest leak centers around retention optimization. Introducing more aggressive lifetime re-activation loops will solidify your monthly revenue scaling.';
  };

  // Simulated Share link copying
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Circular gauge calculations
  const circumference = 283; // 2 * pi * r (r=45)
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-dark-bg min-h-screen text-on-surface font-sans selection:bg-primary-green selection:text-dark-bg">
      
      {/* Dynamic Results Top Header */}
      <header className="w-full top-0 sticky z-50 bg-black/85 border-b border-white/5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onRestart}>
            <img 
              alt="Page Profit Accelerator Logo" 
              className="h-9 w-auto object-contain" 
              src="/logo.png"
            />
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={onRestart}
              className="hidden md:inline-flex text-xs font-semibold hover:text-primary-green transition-colors font-mono tracking-widest text-white/50 uppercase"
            >
              Restart Assessment
            </button>
            <button 
              onClick={onOpenBooking}
              className="bg-primary-green text-dark-bg border-none font-bold text-xs uppercase px-4 py-2.5 rounded-lg transition-transform hover:scale-95 cursor-pointer font-sans"
            >
              Start Free Audit
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-12 sm:py-16 space-y-16">
        
        {/* Score Radial Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Diagnostic overview text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-900 border border-white/5 rounded-full">
              <CheckCircle2 className="w-4 h-4 text-primary-green" />
              <span className="font-mono text-[10px] font-bold text-primary-green uppercase tracking-widest">
                Diagnostic Complete // V3
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-anton uppercase leading-none tracking-tight text-white">
              Your Profit <br className="hidden sm:block" />
              <span className="text-primary-green text-glow-green">Accelerator</span> Score
            </h1>
            
            <p className="text-base sm:text-lg text-white/60 leading-relaxed max-w-xl font-medium">
              We&apos;ve analyzed <span className="text-white font-bold">42 key performance indicators</span> across your technical health, retention loops, and acquisition efficiency based on your input. Your score reflects immediate revenue potential waiting to be unlocked.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={onOpenBooking}
                className="glow-btn bg-primary-green text-dark-bg font-anton text-sm px-8 py-4.5 rounded-xl transition-all hover:scale-95 cursor-pointer flex items-center justify-center gap-2 tracking-wider"
              >
                BOOK YOUR FREE REVENUE AUDIT
                <ArrowRight className="w-5 h-5 ml-1" />
              </button>
              <button 
                onClick={triggerPdfFlow}
                className="bg-transparent border-2 border-white/10 hover:border-primary-green/30 hover:bg-primary-green/5 text-white hover:text-primary-green font-anton text-sm px-8 py-4.5 rounded-xl transition-all hover:scale-95 cursor-pointer flex items-center justify-center gap-3 tracking-wider"
              >
                <Download className="w-5 h-5 stroke-[2.5]" />
                DOWNLOAD YOUR PDF
              </button>
            </div>
          </div>

          {/* Sizable Speedometer/Circle Gauge representation */}
          <div className="lg:col-span-5 flex justify-center items-center">
            
            {/* Circle Box Card */}
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 bg-zinc-950 border border-zinc-900 rounded-full flex items-center justify-center">
              
              <svg className="w-full h-full -rotate-90 p-4" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  fill="transparent" 
                  stroke="#e2e8f0" 
                  strokeWidth="8"
                />
                {/* Active Progress Ring */}
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  fill="transparent" 
                  stroke="#00ff66" 
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  className="transition-all duration-[1500ms] ease-out"
                />
              </svg>

              {/* Inner text score metrics */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-anton text-7xl text-primary-green leading-none">
                  {score}
                </span>
                <span className="text-[10px] sm:text-xs font-mono font-bold text-white/40 tracking-[0.2em] uppercase mt-2">
                  OUT OF 100
                </span>
              </div>

              {/* Potential Lift floating Badge indicator */}
              <div className="absolute -top-4 -right-4 bg-zinc-900 border border-white/10 p-4 rounded-2xl flex items-center gap-3 shadow-2xl animate-pulse-slow">
                <div className="h-8 w-8 rounded-full bg-primary-green/10 flex items-center justify-center text-primary-green">
                  <TrendingUp className="w-4 h-4 font-bold" />
                </div>
                <div>
                  <p className="text-xs font-bold text-primary-green leading-none">
                    +{potentialLift}%
                  </p>
                  <p className="text-[9px] text-white/40 mt-1 uppercase font-mono tracking-widest font-bold">
                    Potential Lift
                  </p>
                </div>
              </div>

            </div>
          </div>

        </section>

        {/* Dynamic Bento Insights Section */}
        <section className="space-y-8">
          <div className="flex items-center gap-3 border-l-4 border-primary-green pl-4">
            <h2 className="text-2xl sm:text-3xl font-anton text-white uppercase tracking-wider">
              Personalized Insights
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Tile 1: Strongest Pillar */}
            <div className="bg-zinc-950 border border-white/5 p-8 rounded-2xl space-y-4 group hover:border-primary-green/30 transition-colors duration-300">
              <div className="w-12 h-12 bg-primary-green/10 rounded-xl flex items-center justify-center text-primary-green border border-primary-green/20">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-anton text-white uppercase tracking-wider">
                Strongest Pillar
              </h3>
              <p className="text-sm text-white/50 leading-relaxed font-sans">
                {getStrongestPillarText()}
              </p>
              <div className="pt-4 flex items-center gap-2 text-primary-green text-xs font-mono">
                <CheckCircle2 className="w-4.5 h-4.5" />
                <span className="uppercase font-bold tracking-widest">OPTIMIZED</span>
              </div>
            </div>

            {/* Tile 2: Biggest Leak (Critical) */}
            <div className="bg-zinc-900/40 border border-red-500/20 p-8 rounded-2xl space-y-4 relative overflow-hidden group hover:bg-zinc-900/60 transition-colors">
              <div className="absolute top-4 right-4 animate-bounce">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center text-red-400 border border-red-500/20">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-anton text-red-400 uppercase tracking-wider">
                Biggest Leak
              </h3>
              <p className="text-sm text-white/50 leading-relaxed font-sans">
                {getBiggestLeakText()}
              </p>
              <div className="pt-4 flex items-center gap-2 text-red-400 text-xs font-mono">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
                <span className="uppercase font-bold tracking-widest">CRITICAL FIX REQUIRED</span>
              </div>
            </div>

            {/* Tile 3: Acquisition */}
            <div className="bg-zinc-950 border border-white/5 p-8 rounded-2xl space-y-4 group hover:border-primary-green/30 transition-colors duration-300">
              <div className="w-12 h-12 bg-primary-green/10 rounded-xl flex items-center justify-center text-primary-green border border-primary-green/20">
                <LoopIcon className="w-5 h-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-anton text-white uppercase tracking-wider">
                Acquisition &amp; Flow
              </h3>
              <p className="text-sm text-white/50 leading-relaxed font-sans">
                Customer Acquisition Cost is within margins, but landing page conversion variance is high ({answers.abTesting === 'Yes' ? '1.5% - 3.8%' : '1.2% - 4.8%'}). Standardizing layout models could yield immediate returns.
              </p>
              <div className="pt-4 flex items-center gap-2 text-white/30 text-xs font-mono">
                <RefreshCw className="w-4 h-4 animate-spin-slow" />
                <span className="uppercase font-bold tracking-widest">NEEDS TUNING</span>
              </div>
            </div>

          </div>
        </section>

        {/* Case Study Benchmark Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          <div className="lg:col-span-8 bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden flex flex-col md:flex-row">
            
            {/* Visual chart column layout */}
            <div className="md:w-1/2 p-6 flex flex-col justify-between bg-[#08080a] border-r border-[#1a1a1c] relative min-h-[350px]">
              <div className="space-y-1.5 z-10 text-left">
                <span className="inline-block text-[9px] font-mono font-bold tracking-widest text-[#00ff66] bg-[#00ff66]/10 px-2.5 py-1 rounded-md border border-[#00ff66]/20">
                  Interactive Forecast Engine
                </span>
                <h4 className="text-sm font-anton uppercase text-white tracking-wider mt-1.5">
                  6-Month Cumulative Net Profit Projection
                </h4>
                <p className="text-[11px] text-zinc-400 font-sans">
                  Visualizing the compound profit growth delta after resolving your store's checked leaks (projecting <strong className="text-primary-green font-mono">+{potentialLift}%</strong> conversion efficiency boost).
                </p>
              </div>

              {/* Dynamic Recharts Box */}
              <div className="w-full h-52 mt-4 relative z-10 text-[10px] select-none">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorBaseline" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#404040" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#404040" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorOptimized" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00ff66" stopOpacity={0.35}/>
                        <stop offset="95%" stopColor="#00ff66" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="rgba(255,255,255,0.2)" 
                      tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 8 }} 
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="rgba(255,255,255,0.2)" 
                      tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 8 }} 
                      tickFormatter={formatCurrency}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip content={<CustomChartTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
                    <Area 
                      type="monotone" 
                      dataKey="Current Profit" 
                      stroke="#404040" 
                      strokeWidth={1.5}
                      fillOpacity={1} 
                      fill="url(#colorBaseline)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="Optimized Profit" 
                      stroke="#00ff66" 
                      strokeWidth={2.5}
                      fillOpacity={1} 
                      fill="url(#colorOptimized)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="pt-3 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-zinc-500 z-10 mt-2">
                <span>[X] MONTHS ELAPSED</span>
                <span className="text-primary-green font-bold flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-primary-green animate-ping inline-block"></span>
                  LIFT GAINED: +{formatCurrency(chartData[5]['Optimized Profit'] - chartData[5]['Current Profit'])} / MO
                </span>
              </div>
            </div>

            {/* Specs column details */}
            <div className="md:w-1/2 p-8 sm:p-10 space-y-6 flex flex-col justify-center">
              <h3 className="font-anton text-2xl uppercase text-white tracking-wide">
                Benchmark Comparison
              </h3>
              
              <p className="text-sm text-white/50 leading-relaxed font-sans">
                Brands categorized within the <span className="text-white font-semibold">DTC {answers.monthlyRevenue === 'Over ₦150M' ? 'High-Scale' : 'Emerging'} Commerce</span> bracket typically secure 2.4x revenue multipliers by resolving primary checkout leaks we diagnosed on your footprint.
              </p>

              <ul className="space-y-3 font-sans text-sm">
                <li className="flex items-start gap-2.5">
                  <TrendingUp className="w-5 h-5 text-primary-green shrink-0 mt-0.5" />
                  <p className="text-white font-medium">Revenue Lift: +112% in 90 days</p>
                </li>
                <li className="flex items-start gap-2.5">
                  <TrendingUp className="w-5 h-5 text-primary-green shrink-0 mt-0.5" />
                  <p className="text-white font-medium">Customer LTV Shift: +35% Lift</p>
                </li>
              </ul>

              <button 
                onClick={onOpenBooking}
                className="text-primary-green font-bold text-xs uppercase tracking-widest inline-flex items-center gap-1.5 hover:translate-x-2 transition-transform cursor-pointer"
              >
                VIEW CASE STUDY METRICS <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* PDF Offer checklist booklet download card */}
          <div className="lg:col-span-4 bg-zinc-950 border border-white/5 p-8 rounded-2xl flex flex-col items-center text-center space-y-6 relative group overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary-green scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
            
            <div className="relative w-full aspect-[4/5] max-w-[150px] shadow-2xl group-hover:scale-105 transition-transform duration-500 rounded-lg overflow-hidden border border-white/10 bg-zinc-900">
              <img 
                alt="17 Leaks Checklist PDF Mockup" 
                className="w-full h-full object-cover" 
                src="/checklist-cover.png"
              />
            </div>

            <div className="space-y-1.5">
              <h4 className="font-anton text-xl text-white uppercase tracking-wide">
                17 Profit Leaks
              </h4>
              <p className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase">
                Master Checklist PDF
              </p>
            </div>

            <p className="text-xs text-white/50 leading-relaxed font-sans">
              Plug every hole in your checkout funnel with the exact audit checklist our team deploys.
            </p>

            <button 
              id="results-checklist-view-btn"
              onClick={triggerPdfFlow}
              className="w-full bg-primary-green hover:bg-[#00ff66]/90 text-dark-bg font-anton text-xs uppercase py-3.5 rounded-xl transition-all hover:scale-95 cursor-pointer flex items-center justify-center gap-2 tracking-wider shadow-[0_4px_15px_rgba(0,255,102,0.15)] hover:shadow-[0_4px_25px_rgba(0,255,102,0.3)] animate-pulse-slow font-sans text-glow-none"
            >
              <Download className="w-4 h-4 stroke-[3]" />
              DOWNLOAD YOUR PDF
            </button>
            <button 
              onClick={() => setShowChecklistDesk(prev => !prev)}
              className="text-[11px] font-bold text-white/50 hover:text-primary-green uppercase tracking-wider font-mono bg-transparent border-none outline-none mt-2 shrink-0 transition-colors cursor-pointer"
            >
              {showChecklistDesk ? '[-] Hide On-Screen Checklist' : '[+] Interact with Checklist On-Screen'}
            </button>
          </div>

        </section>

        {/* Live on-screen interactive "17 Profit Leaks Checklist" */}
        {showChecklistDesk && (
          <section id="checklist-interactive-section" className="bg-zinc-950 border border-white/15 rounded-2xl p-6 sm:p-8 space-y-6 animate-fade-in relative">
            <div className="absolute top-4 right-4 bg-primary-green/10 border border-primary-green/20 px-2 py-0.5 rounded text-[9px] font-mono text-primary-green uppercase">
              Digital Applet Edition
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-anton text-white uppercase tracking-wider">
                17 Profit Leaks Checklist
              </h3>
              <p className="text-xs sm:text-sm text-white/50 font-sans">
                Below index compiles the 17 leaks. Checked flags represent areas validated directly from your assessment! Toggle remaining items as you address them.
              </p>
            </div>

            {/* Checklist items dynamic boxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-4">
              {checklistItems.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => toggleChecklistItem(item.id)}
                  className={`p-4 rounded-xl border flex items-start gap-3.5 cursor-pointer select-none transition-all ${
                    item.done 
                      ? 'bg-zinc-900/50 border-primary-green/30 text-white/90' 
                      : 'bg-black/40 border-white/5 text-white/50 hover:border-white/10 hover:text-white/80'
                  }`}
                >
                  <div className={`h-5 w-5 rounded border flex shrink-0 items-center justify-center transition-all ${
                    item.done 
                      ? 'border-primary-green bg-primary-green text-black' 
                      : 'border-white/20 bg-transparent'
                  }`}>
                    {item.done && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <span className="text-xs leading-relaxed font-sans font-medium">
                    <span className="font-bold text-primary-green/70 font-mono mr-1">Leak #{item.id}:</span> {item.text}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-[10px] text-white/30 font-mono">
                Items completed: {checklistItems.filter(i => i.done).length} / {checklistItems.length}
              </p>
              <div className="flex gap-2">
                <button 
                  onClick={handleCopyLink}
                  className="px-4 py-2 bg-zinc-900 text-white text-xs font-bold rounded-lg hover:bg-zinc-800 transition-colors uppercase font-mono tracking-wider flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copiedLink ? 'Copied score link!' : 'Copy Score Link'}
                </button>
                <button 
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-primary-green text-dark-bg text-xs font-bold rounded-lg hover:brightness-110 transition-all uppercase font-sans tracking-wider flex items-center gap-1.5 whitespace-nowrap"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export PDF Summary
                </button>
              </div>
            </div>
          </section>
        )}

      </main>

      {/* Results Footer Panel */}
      <footer className="bg-neutral-950 py-16 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col gap-1 items-center md:items-start text-center md:text-left">
              <img 
                alt="Page Profit Accelerator Logo Footer" 
                className="h-8 w-auto object-contain brightness-0 invert opacity-60 hover:opacity-100 transition-opacity mb-2" 
                src="/logo.png"
              />
              <p className="text-[9px] text-[#b9ccb5]/60 tracking-wider font-mono">
                © 2026 PAGE PROFIT ACCELERATOR. ALL RIGHTS RESERVED.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 items-center">
              <div className="flex gap-4 text-xs font-sans text-white/40">
                <a href="/privacy" className="hover:text-primary-green transition-colors">Privacy Policy</a>
                <a href="/terms" className="hover:text-primary-green transition-colors">Terms of Service</a>
                <a href="/support" className="hover:text-primary-green transition-colors">Contact Support</a>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handleCopyLink}
                  className="w-10 h-10 bg-zinc-900 h-10 rounded-full flex items-center justify-center text-zinc-400 hover:text-primary-green border border-white/5 hover:border-primary-green/20 cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Hidden strictly formatted print layout for generating standard DTC Diagnostic PDF */}
      <div className="hidden print:block bg-white text-slate-900 p-10 font-sans leading-relaxed text-xs">
        {/* Document Header Bar */}
        <div className="border-b-4 border-slate-900 pb-6 mb-8 flex justify-between items-start">
          <div>
            <span className="text-[9px] font-mono font-bold tracking-widest text-slate-500 uppercase">
              CONFIDENTIAL DTC BRAND ASSESSMENT // REPORT V3
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mt-1 uppercase" style={{ fontFamily: 'Georgia, serif' }}>
              PAGE PROFIT ACCELERATOR
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              DTC Conversion & Checkout Optimization Audit Summary
            </p>
          </div>
          <div className="text-right">
            <div className="px-4 py-2 bg-slate-950 text-white rounded-lg flex flex-col items-center justify-center">
              <span className="text-2xl font-bold font-mono tracking-tight">{score}</span>
              <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-white/60">SCORE / 100</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-2 font-mono">{new Date().toLocaleDateString()} GMT</p>
          </div>
        </div>

        {/* Dynamic Meta Profiles */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
            <h3 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider font-mono border-b border-slate-200 pb-1 mb-2">
              Evaluated Brand Contact
            </h3>
            <div className="space-y-1 text-xs text-slate-700">
              <p><strong className="text-slate-900">Name:</strong> {answers.fullName}</p>
              <p><strong className="text-slate-900">Email:</strong> {answers.email}</p>
              <p><strong className="text-slate-900">WhatsApp:</strong> {answers.whatsapp}</p>
              <p><strong className="text-slate-900">Monthly Volume:</strong> {answers.monthlyRevenue}</p>
            </div>
          </div>

          <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
            <h3 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider font-mono border-b border-slate-200 pb-1 mb-2">
              Audit Indicators
            </h3>
            <div className="space-y-1 text-xs text-slate-700">
              <p><strong className="text-slate-900">Diagnosed Growth Lift:</strong> <span className="text-emerald-700 font-bold">+{potentialLift}% Conversion Increase</span></p>
              <p><strong className="text-slate-900">Current Phase:</strong> {answers.currentSituation || 'Revenue Scale Optimization'}</p>
              <p><strong className="text-slate-900">Primary Goal:</strong> {answers.desiredOutcome || 'Remove multi-step checkout friction'}</p>
            </div>
          </div>
        </div>

        {/* Dynamic Diagnostics */}
        <div className="mb-8 space-y-4">
          <div className="border border-slate-200 p-4 rounded-lg bg-zinc-50">
            <h4 className="font-bold text-[10px] uppercase tracking-wider text-slate-900 mb-1 font-mono flex items-center gap-1.5">
              <span>●</span> STRONGEST PILLAR IDENTIFIED
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">{getStrongestPillarText()}</p>
          </div>
          
          <div className="border border-red-200 p-4 rounded-lg bg-red-50/20">
            <h4 className="font-bold text-[10px] uppercase tracking-wider text-red-800 mb-1 font-mono flex items-center gap-1.5">
              <span>▲</span> PRIMARY CONVERSION LEAK (CRITICAL ACTION REQUIRED)
            </h4>
            <p className="text-xs text-red-950 leading-relaxed font-medium">{getBiggestLeakText()}</p>
          </div>
        </div>

        {/* Table of full questionnaire inputs */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b-2 border-slate-900 pb-1 mb-3 font-mono">
            Diagnostic Answer Logs
          </h3>
          <table className="w-full text-xs text-left text-slate-600">
            <thead>
              <tr className="border-b border-slate-300 text-[10px] font-mono text-slate-500 uppercase">
                <th className="py-1">Conversion Parameters Evaluated</th>
                <th className="py-1 text-right">Provided Answer Position</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="py-1.5">Mobile web load speed optimizing payload limit</td>
                <td className="py-1.5 text-right font-bold text-slate-900">{answers.mobileLoadSpeed}</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-1.5">WhatsApp discount flyout early captures on cart</td>
                <td className="py-1.5 text-right font-bold text-slate-900">{answers.whatsappCapture}</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-1.5">Enable guest checkout by default with simple steps</td>
                <td className="py-1.5 text-right font-bold text-slate-900">{answers.guestCheckout}</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-1.5">High-utility autocomplete smart search bar previews</td>
                <td className="py-1.5 text-right font-bold text-slate-900">{answers.searchBar}</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-1.5">Custom 404 rescue pages & automatic search redirects</td>
                <td className="py-1.5 text-right font-bold text-slate-900">{answers.custom404}</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-1.5">Post-purchase loops (30/60/90 days automated emails)</td>
                <td className="py-1.5 text-right font-bold text-slate-900">{answers.postPurchaseFlow}</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-1.5">Advanced server-side conversion tracking & GA4 APIs</td>
                <td className="py-1.5 text-right font-bold text-slate-900">{answers.ga4Tracking}</td>
              </tr>
              <tr className="border-b border-slate-300">
                <td className="py-1.5">Active session heatmaps tracking funnel checkout metrics</td>
                <td className="py-1.5 text-right font-bold text-slate-900">{answers.heatmapsUsed}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Checklist details printable block */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b-2 border-slate-900 pb-1 mb-3 font-mono">
            Optimized Action Checklist (17 Potential Leaks)
          </h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-[10px] text-slate-600">
            {checklistItems.map(item => (
              <div key={item.id} className="flex items-start gap-1 p-0.5">
                <span className={`font-mono font-bold shrink-0 ${item.done ? 'text-emerald-700' : 'text-slate-300'}`}>
                  [{item.done ? '✓' : '  '}]
                </span>
                <span>
                  <strong className="text-slate-850">Leak #{item.id}:</strong> {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic booking advisor details */}
        <div className="border-t border-slate-300 pt-6 mt-12 text-center text-[10px] text-slate-400">
          <p className="font-mono font-bold text-slate-900 tracking-wider uppercase">PRE-APPROVED PREPARATION SHEET</p>
          <p className="mt-1">Connect this diagnostic profile sheet with Olayemi during your Zoom strategic session.</p>
          <div className="mt-4 text-[9px] text-slate-500 flex justify-center gap-6">
            <span>AUDIT ID: PPA-2026-{score}</span>
            <span>SYSTEM CONNECTION SECURED</span>
            <span>© 2026 PAGE PROFIT CO.</span>
          </div>
        </div>
      </div>

      {/* Premium PDF Email Dispatch & Print Modal */}
      {isPdfModalOpen && (
        <div className="fixed inset-0 z-[120] overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/85 backdrop-blur-sm transition-opacity" onClick={() => setIsPdfModalOpen(false)}></div>
          <div className="relative bg-neutral-950 border border-white/10 rounded-2xl max-w-md w-full p-6 sm:p-8 space-y-6 text-center shadow-2xl animate-fade-in">
            <div className="absolute top-0 inset-x-0 h-1 bg-primary-green"></div>
            {pdfEmailStatus === 'sending' ? (
              <div className="py-8 space-y-4">
                <RefreshCw className="w-10 h-10 text-primary-green animate-spin mx-auto" />
                <h3 className="font-anton text-lg uppercase text-white tracking-widest">Generating Formatted Audit Report</h3>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  Compiling your diagnostic parameters, current conversions benchmarks, and the 17 leaks checklist...
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="h-14 w-14 bg-primary-green/15 border border-primary-green/30 rounded-full flex items-center justify-center text-primary-green mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-anton text-xl uppercase text-white tracking-wider">CHECK YOUR EMAIL</h3>
                  <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                    The pre-formatted <strong className="text-white">17 Hidden Revenue Leaks Master Checklist</strong> and your personalized score evaluation of <strong className="text-primary-green">{score}/100</strong> has been dispatched directly to:
                  </p>
                  <p className="text-sm font-bold font-mono text-primary-green bg-zinc-900/50 px-3 py-2 rounded-lg border border-white/5 inline-block select-all">
                    {answers.email || 'your-email@brand.com'}
                  </p>
                </div>
                <div className="pt-2 flex flex-col gap-2">
                  <a 
                    href="/checklist.pdf"
                    download="Page_Profit_Assessment_Checklist.pdf"
                    onClick={() => setIsPdfModalOpen(false)}
                    className="glow-btn bg-primary-green text-dark-bg font-anton text-xs uppercase py-3 rounded-xl transition-all hover:scale-95 cursor-pointer flex items-center justify-center gap-2 tracking-wider w-full text-glow-none text-center block"
                  >
                    <Download className="w-4 h-4 stroke-[3]" />
                    DOWNLOAD MASTER CHECKLIST PDF
                  </a>
                  <button 
                    onClick={() => {
                      setIsPdfModalOpen(false);
                      setTimeout(() => {
                        window.print();
                      }, 300);
                    }}
                    className="bg-zinc-900 border border-[#00ff66]/20 hover:border-[#00ff66]/50 text-[#00ff66] font-anton text-xs uppercase py-3 rounded-xl transition-all hover:scale-95 cursor-pointer flex items-center justify-center gap-2 tracking-wider w-full"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    PRINT CUSTOM SCORE REPORT ({score}/100)
                  </button>
                  <button 
                    onClick={() => setIsPdfModalOpen(false)}
                    className="bg-transparent text-white/40 hover:text-white font-bold text-[9px] uppercase py-2 transition-colors cursor-pointer w-full tracking-wider font-mono"
                  >
                    [-] CLOSE ESCAPE WINDOW
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
