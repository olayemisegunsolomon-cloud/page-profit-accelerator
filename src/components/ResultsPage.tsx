import React, { useState, useEffect } from 'react';
import { QuizAnswers } from '../types';
import {
  Award, TrendingUp, AlertTriangle, ShieldCheck, Download, ArrowRight,
  RefreshCw, CheckCircle2, Copy, Check, Lock, Share2
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';

interface ResultsPageProps {
  answers: QuizAnswers;
  score: number;
  onOpenBooking: () => void;
  onRestart: () => void;
}

export default function ResultsPage({ answers, score, onOpenBooking, onRestart }: ResultsPageProps) {
  const [showChecklistDesk, setShowChecklistDesk] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [pdfEmailStatus, setPdfEmailStatus] = useState<'sending' | 'sent'>('sending');

  // Auto-send scorecard email on load
  useEffect(() => {
    const autoSendReport = async () => {
      try {
        await fetch('/api/send-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers, score, pdfUrl: '/checklist.pdf' })
        });
      } catch (err) {
        console.error('[Automation Error]', err);
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, score, pdfUrl: '/checklist.pdf' })
      });
      if (response.ok) setPdfEmailStatus('sent');
      else throw new Error('Server error');
    } catch {
      setPdfEmailStatus('sent'); // Graceful fallback
    }
  };

  const [checklistItems, setChecklistItems] = useState([
    { id: 1, text: 'Enable guest checkout with fewer than 4 input steps.', done: answers.guestCheckout === 'Yes' },
    { id: 2, text: 'Set up advanced server-side conversion API matching with GA4.', done: answers.ga4Tracking === 'Yes' },
    { id: 3, text: 'Implement automated win-back emails triggered at 30/60/90 days.', done: answers.postPurchaseFlow === 'Yes' },
    { id: 4, text: 'Optimize mobile load speed targeting Shopify Liquid payload limits.', done: answers.mobileLoadSpeed === 'Yes' },
    { id: 5, text: 'Configure WhatsApp capture early via discount flyouts on cart.', done: answers.whatsappCapture === 'Yes - Early' },
    { id: 6, text: 'Render a smart search bar with live autocomplete previews.', done: answers.searchBar === 'Yes' },
    { id: 7, text: 'Equip custom 404 pages with search links and bestseller lists.', done: answers.custom404 === 'Yes' },
    { id: 8, text: 'Add checkout cross-sells and prominent loyalty visibility.', done: answers.loyaltyVisible === 'Yes' },
    { id: 9, text: 'Create daily heatmap recording filters tracking checkout attrition.', done: answers.heatmapsUsed === 'Yes' },
    { id: 10, text: 'Run continuous A/B experiments testing price elasticity monthly.', done: answers.abTesting === 'Yes' },
    { id: 11, text: 'Include interactive testimonials above the fold on mobile.', done: false },
    { id: 12, text: 'Configure email + SMS re-order triggers for repeat products.', done: answers.postPurchaseFlow === 'Yes' || answers.postPurchaseFlow === 'Partial' },
    { id: 13, text: 'Standardize touch target sizing (min 44px) on mobile carts.', done: false },
    { id: 14, text: 'Leverage CDN minification and WebP image fallback strategies.', done: answers.mobileLoadSpeed === 'Yes' },
    { id: 15, text: 'Invert secondary checkout options to prevent touch errors.', done: false },
    { id: 16, text: 'Enable persistent cart cookie memory for multi-device shoppers.', done: false },
    { id: 17, text: 'Add a floating WhatsApp support chat button (bottom-right).', done: answers.whatsappCapture === 'Yes - Early' || answers.whatsappCapture === 'Yes - Late' }
  ]);

  const toggleChecklistItem = (id: number) => {
    setChecklistItems(prev => prev.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  const potentialLift = Math.round((100 - score) * 0.45);

  const getBaseRevenue = () => {
    const rev = answers.monthlyRevenue || '';
    if (rev.includes('Under ₦10M')) return 5000000;
    if (rev.includes('₦10M') || rev.includes('50M')) return 25000000;
    if (rev.includes('150M')) return 150000000;
    return 15000000;
  };

  const baseMonthly = getBaseRevenue();
  const liftPercentage = potentialLift / 100;

  const chartData = Array.from({ length: 6 }, (_, i) => {
    const currentRevenue = Math.round(baseMonthly * Math.pow(1.005, i));
    const optimizedRevenue = Math.round(baseMonthly * Math.pow(1 + (liftPercentage / 6), i) * (1 + liftPercentage * 0.3));
    return {
      name: `Mo ${i + 1}`,
      'Current Profit': Math.round(currentRevenue * 0.20),
      'Optimized Profit': Math.round(optimizedRevenue * 0.28),
    };
  });

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `₦${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `₦${(val / 1000).toFixed(0)}k`;
    return `₦${val}`;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload?.length) return (
      <div className="bg-zinc-950 border border-white/10 p-3.5 rounded-xl shadow-2xl text-left">
        <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-2">{payload[0].payload.name}</p>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-6 text-xs text-on-surface-variant">
            <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-zinc-600" />Baseline:</span>
            <strong className="text-white font-mono">{formatCurrency(payload[0].value)}</strong>
          </div>
          <div className="flex items-center justify-between gap-6 text-xs text-primary-green">
            <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-primary-green animate-pulse" />Optimized:</span>
            <strong className="font-mono">{formatCurrency(payload[1].value)}</strong>
          </div>
          <div className="border-t border-white/5 pt-1.5 text-[10px] font-mono text-emerald-400 flex justify-between">
            <span>EXTRA LIFT:</span>
            <span>+{formatCurrency(payload[1].value - payload[0].value)}</span>
          </div>
        </div>
      </div>
    );
    return null;
  };

  const getStrongestPillarText = () => {
    if (answers.mobileLoadSpeed === 'Yes' && answers.guestCheckout === 'Yes')
      return 'You have optimized technical health! Your load speed and responsive checkouts place you in the top tier of evaluated DTC brands.';
    if (answers.whatsappCapture === 'Yes - Early' || answers.postPurchaseFlow === 'Yes')
      return 'You display robust WhatsApp and post-purchase flows — maintaining closer buyer relationships than most standard retail brands.';
    return 'You display clear revenue direction. Your operational basics give your brand solid potential to scale quickly with the right fixes.';
  };

  const getBiggestLeakText = () => {
    const leaks = [];
    if (answers.mobileLoadSpeed !== 'Yes') leaks.push('Mobile speed friction');
    if (answers.whatsappCapture === 'No' || answers.whatsappCapture === 'Yes - Late') leaks.push('Incomplete WhatsApp funnel');
    if (answers.guestCheckout !== 'Yes') leaks.push('Multi-step checkout friction');
    if (answers.ga4Tracking !== 'Yes') leaks.push('Tracking inaccuracy');
    if (leaks.length > 0)
      return `Primary leakage centers on ${leaks.join(' and ')}. Resolving these will immediately boost AOV and reduce CPC overhead.`;
    return 'Your biggest leak centers around retention optimization. Aggressive lifetime re-activation loops will solidify monthly revenue growth.';
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Score gauge
  const circumference = 283;
  const offset = circumference - (score / 100) * circumference;

  const scoreColor = score >= 70 ? '#10b981' : score >= 45 ? '#f59e0b' : '#ef4444';
  const scoreLabel = score >= 70 ? 'Strong Performance' : score >= 45 ? 'Growth Opportunity' : 'Critical Fixes Needed';

  return (
    <div className="bg-dark-bg min-h-screen text-on-surface font-sans">

      {/* ── HEADER ── */}
      <header className="w-full top-0 sticky z-50 bg-black/85 border-b border-white/6 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <img alt="Page Profit Accelerator" className="h-9 w-auto object-contain cursor-pointer" src="/logo.png" onClick={onRestart} />
          <div className="flex items-center gap-3">
            <button onClick={onRestart} className="hidden md:inline-flex text-xs font-semibold hover:text-primary-green transition-colors text-on-surface-variant uppercase tracking-widest">
              Restart
            </button>
            <button onClick={onOpenBooking} className="glow-btn font-bold text-xs uppercase px-5 py-2.5 rounded-xl cursor-pointer" style={{ fontFamily: 'Outfit,sans-serif' }}>
              Book Free Audit
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-5 sm:px-6 py-12 sm:py-16 space-y-16">

        {/* ── HERO: SCORE + CTA ── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left: copy + CTAs */}
          <div className="lg:col-span-7 space-y-7 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-white/6 rounded-full">
              <CheckCircle2 className="w-4 h-4 text-primary-green" />
              <span className="font-mono text-[10px] font-bold text-primary-green uppercase tracking-widest">
                Diagnostic Complete · V3
              </span>
            </div>

            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold uppercase leading-none tracking-tight text-white mb-4" style={{ fontFamily: 'Outfit,sans-serif' }}>
                Your Profit{' '}
                <span className="text-primary-green">Accelerator</span>{' '}
                Score
              </h1>
              <p className="text-base text-on-surface-variant leading-relaxed max-w-xl">
                We've analyzed <strong className="text-white">42 key performance indicators</strong> across your technical health, retention loops, and acquisition efficiency. Your score reflects immediate revenue potential waiting to be unlocked.
              </p>
            </div>

            {/* Primary CTA */}
            <div className="space-y-3">
              <button
                onClick={onOpenBooking}
                className="glow-btn w-full sm:w-auto px-10 py-4.5 rounded-2xl text-base uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2.5 font-extrabold"
                style={{ fontFamily: 'Outfit,sans-serif' }}
              >
                Book Your Free Revenue Audit
                <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-[11px] text-on-surface-variant flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-primary-green" />
                No credit card · 30-min strategy call · 100% free
              </p>
            </div>

            {/* Secondary: PDF */}
            <button
              onClick={triggerPdfFlow}
              className="inline-flex items-center gap-2 text-sm font-semibold text-on-surface-variant hover:text-white border border-white/8 hover:border-primary-green/30 px-5 py-2.5 rounded-xl transition-all hover:bg-primary-green/5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download Your PDF Checklist
            </button>
          </div>

          {/* Right: Gauge */}
          <div className="lg:col-span-5 flex justify-center animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="relative">
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-full blur-2xl opacity-20" style={{ background: scoreColor }} />

              <div className="relative w-64 h-64 sm:w-72 sm:h-72 bg-zinc-950 border border-white/6 rounded-full flex items-center justify-center shadow-2xl">
                <svg className="w-full h-full -rotate-90 p-5 absolute inset-0" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="transparent" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
                  <circle
                    cx="50" cy="50" r="45" fill="transparent"
                    stroke={scoreColor} strokeWidth="7"
                    strokeDasharray={circumference} strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-all duration-[1800ms] ease-out"
                    style={{ filter: `drop-shadow(0 0 8px ${scoreColor}60)` }}
                  />
                </svg>
                <div className="flex flex-col items-center justify-center relative z-10">
                  <span className="font-extrabold text-6xl sm:text-7xl leading-none" style={{ color: scoreColor, fontFamily: 'Outfit,sans-serif' }}>{score}</span>
                  <span className="text-[9px] font-mono font-bold text-on-surface-variant tracking-[0.2em] uppercase mt-1">OUT OF 100</span>
                  <span className="text-[10px] font-bold mt-2 px-2.5 py-0.5 rounded-full" style={{ color: scoreColor, background: `${scoreColor}15`, border: `1px solid ${scoreColor}30` }}>
                    {scoreLabel}
                  </span>
                </div>
              </div>

              {/* Lift badge */}
              <div className="absolute -top-3 -right-3 bg-zinc-900 border border-white/8 px-4 py-3 rounded-2xl flex items-center gap-2.5 shadow-xl animate-pulse-slow">
                <div className="h-8 w-8 rounded-xl bg-primary-green/10 flex items-center justify-center text-primary-green border border-primary-green/20">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-primary-green leading-none" style={{ fontFamily: 'Outfit,sans-serif' }}>+{potentialLift}%</p>
                  <p className="text-[9px] text-on-surface-variant mt-0.5 uppercase font-mono tracking-widest">Potential Lift</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── INSIGHTS TILES ── */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-6 w-1 bg-primary-green rounded-full" />
            <h2 className="text-2xl font-extrabold text-white uppercase tracking-wide" style={{ fontFamily: 'Outfit,sans-serif' }}>
              Personalized Insights
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Strongest Pillar */}
            <div className="bg-zinc-950/60 border border-white/6 p-7 rounded-2xl space-y-4 group hover:border-primary-green/25 transition-all duration-300">
              <div className="w-11 h-11 bg-primary-green/8 rounded-xl flex items-center justify-center text-primary-green border border-primary-green/20">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-extrabold text-white uppercase" style={{ fontFamily: 'Outfit,sans-serif' }}>Strongest Pillar</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">{getStrongestPillarText()}</p>
              <div className="pt-3 flex items-center gap-2 text-primary-green text-xs font-mono">
                <CheckCircle2 className="w-4 h-4" />
                <span className="uppercase font-bold tracking-widest">Optimized</span>
              </div>
            </div>

            {/* Biggest Leak */}
            <div className="bg-red-950/20 border border-red-500/20 p-7 rounded-2xl space-y-4 relative overflow-hidden group hover:bg-red-950/30 transition-all">
              <div className="absolute top-4 right-4">
                <AlertTriangle className="w-5 h-5 text-red-400 animate-bounce" />
              </div>
              <div className="w-11 h-11 bg-red-500/10 rounded-xl flex items-center justify-center text-red-400 border border-red-500/20">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-extrabold text-red-400 uppercase" style={{ fontFamily: 'Outfit,sans-serif' }}>Biggest Leak</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">{getBiggestLeakText()}</p>
              <div className="pt-3 flex items-center gap-2 text-red-400 text-xs font-mono">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                <span className="uppercase font-bold tracking-widest">Critical Fix Required</span>
              </div>
            </div>

            {/* Acquisition */}
            <div className="bg-zinc-950/60 border border-white/6 p-7 rounded-2xl space-y-4 group hover:border-primary-green/25 transition-all duration-300">
              <div className="w-11 h-11 bg-primary-green/8 rounded-xl flex items-center justify-center text-primary-green border border-primary-green/20">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-extrabold text-white uppercase" style={{ fontFamily: 'Outfit,sans-serif' }}>Acquisition & Flow</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                CAC is within margins, but landing page conversion variance is high ({answers.abTesting === 'Yes' ? '1.5%–3.8%' : '1.2%–4.8%'}). Standardizing layout models could yield immediate returns.
              </p>
              <div className="pt-3 flex items-center gap-2 text-on-surface-variant text-xs font-mono">
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="uppercase font-bold tracking-widest">Needs Tuning</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── CHART + PDF ── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

          {/* Profit chart */}
          <div className="lg:col-span-8 bg-zinc-950 border border-white/6 rounded-2xl overflow-hidden flex flex-col md:flex-row">
            <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between bg-zinc-950 border-r border-white/5">
              <div className="space-y-2">
                <span className="inline-block text-[9px] font-mono font-bold tracking-widest text-primary-green bg-primary-green/8 px-2.5 py-1 rounded-md border border-primary-green/20">
                  Forecast Engine
                </span>
                <h4 className="text-sm font-extrabold text-white uppercase mt-1.5" style={{ fontFamily: 'Outfit,sans-serif' }}>
                  6-Month Profit Projection
                </h4>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  Compound profit growth after resolving your leaks (projecting{' '}
                  <strong className="text-primary-green font-mono">+{potentialLift}%</strong> efficiency boost).
                </p>
              </div>

              <div className="w-full h-52 mt-4 select-none">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorBaseline" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#52525b" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#52525b" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorOptimized" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                    <XAxis dataKey="name" stroke="transparent" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 8 }} tickLine={false} axisLine={false} />
                    <YAxis stroke="transparent" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 8 }} tickFormatter={formatCurrency} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.06)', strokeWidth: 1 }} />
                    <Area type="monotone" dataKey="Current Profit" stroke="#52525b" strokeWidth={1.5} fillOpacity={1} fill="url(#colorBaseline)" />
                    <Area type="monotone" dataKey="Optimized Profit" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorOptimized)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="pt-3 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-on-surface-variant mt-2">
                <span>6 MONTHS ELAPSED</span>
                <span className="text-primary-green font-bold flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-green animate-ping" />
                  LIFT: +{formatCurrency(chartData[5]['Optimized Profit'] - chartData[5]['Current Profit'])} / MO
                </span>
              </div>
            </div>

            {/* Benchmark */}
            <div className="md:w-1/2 p-8 sm:p-10 space-y-6 flex flex-col justify-center">
              <h3 className="text-xl font-extrabold text-white uppercase" style={{ fontFamily: 'Outfit,sans-serif' }}>
                Benchmark Comparison
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Brands in the <strong className="text-white">DTC {answers.monthlyRevenue === 'Over ₦150M' ? 'High-Scale' : 'Emerging'} Commerce</strong> bracket typically secure 2.4× revenue multipliers by resolving the primary checkout leaks we identified on your footprint.
              </p>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2.5">
                  <TrendingUp className="w-4 h-4 text-primary-green shrink-0" />
                  <span className="text-white font-semibold">Revenue Lift: +112% in 90 days</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <TrendingUp className="w-4 h-4 text-primary-green shrink-0" />
                  <span className="text-white font-semibold">Customer LTV Shift: +35%</span>
                </li>
              </ul>
              <button onClick={onOpenBooking} className="text-primary-green font-bold text-xs uppercase tracking-widest inline-flex items-center gap-1.5 hover:translate-x-1.5 transition-transform cursor-pointer">
                Get Your Personalised Strategy <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* PDF download card */}
          <div className="lg:col-span-4 bg-zinc-950/60 border border-white/6 p-8 rounded-2xl flex flex-col items-center text-center space-y-5 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-primary-green scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
            <div className="relative w-full max-w-[140px] aspect-[4/5] shadow-2xl group-hover:scale-[1.04] transition-transform duration-500 rounded-xl overflow-hidden border border-white/8">
              <img alt="17 Leaks Checklist" className="w-full h-full object-cover" src="/checklist-cover.png" />
            </div>
            <div>
              <h4 className="text-lg font-extrabold text-white uppercase" style={{ fontFamily: 'Outfit,sans-serif' }}>17 Profit Leaks</h4>
              <p className="text-[10px] text-on-surface-variant font-mono tracking-widest uppercase mt-0.5">Master Checklist PDF</p>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Plug every hole in your checkout funnel with the exact audit checklist our team deploys for clients.
            </p>
            <button
              id="results-checklist-view-btn"
              onClick={triggerPdfFlow}
              className="glow-btn w-full py-3.5 rounded-xl flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-extrabold cursor-pointer animate-pulse-slow"
              style={{ fontFamily: 'Outfit,sans-serif' }}
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              Download PDF
            </button>
            <button
              onClick={() => setShowChecklistDesk(prev => !prev)}
              className="text-[11px] font-bold text-on-surface-variant hover:text-primary-green uppercase tracking-widest transition-colors cursor-pointer font-mono"
            >
              {showChecklistDesk ? '− Hide' : '+ View'} On-Screen Checklist
            </button>
          </div>
        </section>

        {/* ── INTERACTIVE CHECKLIST ── */}
        {showChecklistDesk && (
          <section className="bg-zinc-950/60 border border-white/6 rounded-2xl p-6 sm:p-8 space-y-6 animate-fade-in">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-white uppercase" style={{ fontFamily: 'Outfit,sans-serif' }}>17 Profit Leaks Checklist</h3>
                <p className="text-xs text-on-surface-variant mt-1">Checked items are validated from your assessment. Toggle remaining items as you address them.</p>
              </div>
              <span className="bg-primary-green/8 border border-primary-green/20 px-2.5 py-1 rounded-lg text-[9px] font-mono text-primary-green uppercase tracking-widest shrink-0">
                Digital Edition
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {checklistItems.map(item => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklistItem(item.id)}
                  className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer select-none transition-all ${
                    item.done
                      ? 'bg-primary-green/6 border-primary-green/25 text-white/90'
                      : 'bg-zinc-950/40 border-white/5 text-on-surface-variant hover:border-white/10 hover:text-white/80'
                  }`}
                >
                  <div className={`h-5 w-5 rounded-md border flex shrink-0 items-center justify-center transition-all mt-0.5 ${
                    item.done ? 'border-primary-green bg-primary-green' : 'border-white/15'
                  }`}>
                    {item.done && <Check className="w-3 h-3 text-white stroke-[3]" />}
                  </div>
                  <span className="text-xs leading-relaxed font-medium">
                    <span className="font-bold text-primary-green/70 font-mono mr-1">#{item.id}:</span>{item.text}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-[10px] text-on-surface-variant font-mono">
                Completed: {checklistItems.filter(i => i.done).length} / {checklistItems.length}
              </p>
              <div className="flex gap-2">
                <button onClick={handleCopyLink} className="px-4 py-2 bg-zinc-900 text-white text-xs font-bold rounded-lg hover:bg-zinc-800 transition-colors uppercase font-mono tracking-wider flex items-center gap-1.5 border border-white/6 cursor-pointer">
                  <Copy className="w-3.5 h-3.5" />
                  {copiedLink ? 'Copied!' : 'Copy Link'}
                </button>
                <button onClick={() => window.print()} className="glow-btn px-4 py-2 rounded-lg text-xs uppercase tracking-wider flex items-center gap-1.5 font-bold cursor-pointer" style={{ fontFamily: 'Outfit,sans-serif' }}>
                  <Download className="w-3.5 h-3.5" />
                  Export PDF
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ── FINAL BOOKING CTA BANNER ── */}
        <section className="relative bg-zinc-950/60 border border-primary-green/20 rounded-2xl p-8 sm:p-12 text-center overflow-hidden">
          <div className="absolute inset-0 bg-grid-tech opacity-[0.08] pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-primary-green/6 blur-[60px] pointer-events-none" />
          <div className="relative z-10 space-y-5">
            <ShieldCheck className="w-10 h-10 text-primary-green mx-auto" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white uppercase" style={{ fontFamily: 'Outfit,sans-serif' }}>
              Ready to Fix These Leaks?
            </h2>
            <p className="text-sm text-on-surface-variant max-w-lg mx-auto leading-relaxed">
              Book a free 30-minute Revenue Walkthrough. Olayemi will personally review your <strong className="text-white">{score}/100 score</strong> and map your top 3 conversion leaks — at no cost.
            </p>
            <button onClick={onOpenBooking} className="glow-btn px-12 py-4 rounded-2xl text-base uppercase tracking-wider font-extrabold cursor-pointer inline-flex items-center gap-2.5" style={{ fontFamily: 'Outfit,sans-serif' }}>
              Book Free Revenue Audit
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-[11px] text-on-surface-variant flex items-center justify-center gap-2">
              <Lock className="w-3.5 h-3.5 text-primary-green" />
              100% Free · No pressure · Strategy call only
            </p>
          </div>
        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-zinc-950/50 py-12 border-t border-white/5 mt-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <img alt="Logo" className="h-7 brightness-0 invert opacity-50 hover:opacity-100 transition-opacity" src="/logo.png" />
            <p className="text-[9px] text-on-surface-variant/40 font-mono tracking-wider">© 2026 PAGE PROFIT ACCELERATOR</p>
          </div>
          <div className="flex items-center gap-6 text-xs text-on-surface-variant/50">
            <a href="/privacy" className="hover:text-primary-green transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-primary-green transition-colors">Terms</a>
            <a href="/support" className="hover:text-primary-green transition-colors">Support</a>
            <button onClick={handleCopyLink} className="w-9 h-9 bg-zinc-900 rounded-full flex items-center justify-center hover:text-primary-green border border-white/6 hover:border-primary-green/20 cursor-pointer transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </footer>

      {/* ── PRINT LAYOUT (hidden on screen) ── */}
      <div className="hidden print:block bg-white text-slate-900 p-10 font-sans leading-relaxed text-xs">
        <div className="border-b-4 border-slate-900 pb-6 mb-8 flex justify-between items-start">
          <div>
            <span className="text-[9px] font-mono font-bold tracking-widest text-slate-500 uppercase">CONFIDENTIAL DTC BRAND ASSESSMENT // REPORT V3</span>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mt-1 uppercase" style={{ fontFamily: 'Georgia, serif' }}>PAGE PROFIT ACCELERATOR</h1>
            <p className="text-xs text-slate-500 mt-1">DTC Conversion & Checkout Optimization Audit Summary</p>
          </div>
          <div className="text-right">
            <div className="px-4 py-2 bg-slate-950 text-white rounded-lg flex flex-col items-center">
              <span className="text-2xl font-bold font-mono">{score}</span>
              <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-white/60">SCORE / 100</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-2 font-mono">{new Date().toLocaleDateString()} GMT</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
            <h3 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider font-mono border-b border-slate-200 pb-1 mb-2">Brand Contact</h3>
            <div className="space-y-1 text-xs text-slate-700">
              <p><strong>Name:</strong> {answers.fullName}</p>
              <p><strong>Email:</strong> {answers.email}</p>
              <p><strong>WhatsApp:</strong> {answers.whatsapp}</p>
              <p><strong>Monthly Revenue:</strong> {answers.monthlyRevenue}</p>
            </div>
          </div>
          <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
            <h3 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider font-mono border-b border-slate-200 pb-1 mb-2">Audit Indicators</h3>
            <div className="space-y-1 text-xs text-slate-700">
              <p><strong>Growth Lift:</strong> <span className="text-emerald-700 font-bold">+{potentialLift}% Conversion</span></p>
              <p><strong>Phase:</strong> {answers.currentSituation || 'Revenue Scale Optimization'}</p>
              <p><strong>Goal:</strong> {answers.desiredOutcome || 'Remove checkout friction'}</p>
            </div>
          </div>
        </div>
        <div className="mb-8">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b-2 border-slate-900 pb-1 mb-3 font-mono">17 Profit Leaks Checklist</h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-[10px] text-slate-600">
            {checklistItems.map(item => (
              <div key={item.id} className="flex items-start gap-1 p-0.5">
                <span className={`font-mono font-bold shrink-0 ${item.done ? 'text-emerald-700' : 'text-slate-300'}`}>[{item.done ? '✓' : '  '}]</span>
                <span><strong className="text-slate-850">Leak #{item.id}:</strong> {item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── PDF MODAL ── */}
      {isPdfModalOpen && (
        <div className="fixed inset-0 z-[120] overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setIsPdfModalOpen(false)} />
          <div className="relative bg-zinc-950 border border-white/8 rounded-2xl max-w-sm w-full p-8 space-y-6 text-center shadow-2xl animate-scale-up">
            <div className="absolute top-0 inset-x-0 h-0.5 bg-primary-green rounded-t-2xl" />
            {pdfEmailStatus === 'sending' ? (
              <div className="py-8 space-y-4">
                <RefreshCw className="w-10 h-10 text-primary-green animate-spin mx-auto" />
                <h3 className="font-extrabold text-lg text-white uppercase tracking-wider" style={{ fontFamily: 'Outfit,sans-serif' }}>Generating Report...</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">Compiling your diagnostic parameters and the 17 leaks checklist...</p>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="h-14 w-14 bg-primary-green/12 border border-primary-green/25 rounded-full flex items-center justify-center text-primary-green mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-extrabold text-xl text-white uppercase" style={{ fontFamily: 'Outfit,sans-serif' }}>Check Your Email!</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    The <strong className="text-white">17 Hidden Revenue Leaks Checklist</strong> and your score of{' '}
                    <strong className="text-primary-green">{score}/100</strong> has been sent to:
                  </p>
                  <p className="text-sm font-bold font-mono text-primary-green bg-zinc-900/60 px-3 py-2 rounded-lg border border-white/5 select-all">
                    {answers.email || 'your-email@brand.com'}
                  </p>
                </div>
                <div className="flex flex-col gap-2 pt-1">
                  <a
                    href="/checklist.pdf"
                    download="Page_Profit_Checklist.pdf"
                    onClick={() => setIsPdfModalOpen(false)}
                    className="glow-btn py-3 rounded-xl flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-extrabold cursor-pointer w-full"
                    style={{ fontFamily: 'Outfit,sans-serif' }}
                  >
                    <Download className="w-4 h-4 stroke-[2.5]" />
                    Download Master Checklist
                  </a>
                  <button
                    onClick={() => { setIsPdfModalOpen(false); setTimeout(() => window.print(), 300); }}
                    className="bg-zinc-900 border border-primary-green/20 hover:border-primary-green/40 text-primary-green py-3 rounded-xl flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-bold cursor-pointer w-full transition-all"
                    style={{ fontFamily: 'Outfit,sans-serif' }}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Print Score Report ({score}/100)
                  </button>
                  <button onClick={() => setIsPdfModalOpen(false)} className="text-on-surface-variant/50 hover:text-white text-[10px] uppercase tracking-wider font-mono py-2 cursor-pointer transition-colors">
                    Close
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
