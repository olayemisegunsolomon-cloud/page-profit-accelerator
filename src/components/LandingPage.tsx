import React from 'react';
import { ArrowRight, Activity, Zap, Shield, User, Download, TrendingUp, Sparkles, Lock, Check } from 'lucide-react';

interface LandingPageProps {
  onStartQuiz: () => void;
}

export default function LandingPage({ onStartQuiz }: LandingPageProps) {
  return (
    <div className="bg-dark-bg min-h-screen text-on-surface font-sans overflow-x-hidden selection:bg-primary-green selection:text-dark-bg">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/75 backdrop-blur-xl">
        <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto w-full">
          <div className="flex items-center">
            <img 
              alt="Page Profit Accelerator Logo" 
              className="h-7 md:h-8 object-contain brightness-110" 
              src="/logo.png"
            />
          </div>
          <div>
            <button 
              id="start-assessment-header-btn"
              onClick={onStartQuiz}
              className="glow-btn bg-primary-green text-dark-bg text-xs font-bold px-5 py-2.5 rounded-full inline-flex items-center gap-2 transition-all cursor-pointer font-sans tracking-wider uppercase hover:-translate-y-0.5"
            >
              <span>START ASSESSMENT</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero: Precision Diagnostic */}
      <main className="pt-20">
        <section className="relative min-h-[90vh] flex items-center px-6 py-16 bg-grid-tech overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black via-transparent to-black pointer-events-none"></div>
          
          {/* Neon radial accent blobs */}
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary-green/5 blur-[120px] rounded-full pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-primary-green/10 blur-[100px] rounded-full pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto relative z-10 w-full">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
              
              {/* Left Column info */}
              <div id="hero-marketing-col" className="w-full lg:w-[55%] space-y-8 text-center lg:text-left">
                <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[10px] font-bold tracking-[0.2em] uppercase text-primary-green">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-green opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-green"></span>
                  </span>
                  SYSTEM ANALYSIS ACTIVE
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-anton uppercase leading-[0.95] tracking-tight text-white">
                  TIRED OF PRETTY ECOMMERCE PAGES THAT <br className="hidden lg:block"/>
                  <span className="text-primary-green text-glow-green italic">DON’T CONVERT</span> <br className="hidden lg:block"/>
                  INTO REAL <span className="relative border-b-2 border-primary-green/40">SALES?</span>
                </h1>
                
                <p className="text-base sm:text-lg text-on-surface-variant max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
                  Are you ready to turn your DTC store into a <strong className="text-white border-b border-primary-green/30">Revenue Growth Engine</strong>? Answer 15 quick questions and instantly get your <strong className="text-white">Page Profit Score</strong> + the <strong className="text-white">17 Hidden Revenue Leaks Checklist</strong>.
                </p>
                
                <div className="pt-4 flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start">
                  <button 
                    id="hero-start-assessment-btn"
                    onClick={onStartQuiz}
                    className="glow-btn bg-primary-green text-dark-bg font-anton hover:scale-[1.03] transition-transform duration-300 w-full sm:w-auto px-8 py-4.5 rounded-xl text-lg sm:text-xl uppercase tracking-wider cursor-pointer shadow-xl text-center"
                  >
                    Start Free Assessment Now
                  </button>
                  
                  <div className="flex -space-x-3 items-center pt-2 sm:pt-0">
                    <div className="h-11 w-11 rounded-full border-2 border-[#09090b] bg-[#141417] flex items-center justify-center text-[10px] font-bold text-primary-green shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-all hover:scale-110 hover:z-20 cursor-default select-none relative z-10 duration-200">241%</div>
                    <div className="h-11 w-11 rounded-full border-2 border-[#09090b] bg-[#141417] flex items-center justify-center text-[10px] font-bold text-white backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-all hover:scale-110 hover:z-20 cursor-default select-none relative z-0 duration-200">8FIG</div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold ml-3.5">PROVEN IMPACT</span>
                  </div>
                </div>
              </div>
              
              {/* Right Column illustration */}
              <div className="w-full lg:w-[45%] relative mt-8 lg:mt-0">
                <div className="relative group max-w-sm mx-auto">
                  
                  {/* Digital Scanner Frame */}
                  <div className="absolute -inset-4 border border-white/5 rounded-3xl pointer-events-none"></div>
                  <div className="absolute -top-4 -right-4 w-12 h-12 border-t-2 border-r-2 border-primary-green/45 rounded-tr-xl"></div>
                  <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b-2 border-l-2 border-primary-green/45 rounded-bl-xl"></div>
                  
                  <div className="relative bg-black/60 backdrop-blur-xl p-4 rounded-2xl border border-white/15 rotate-3 group-hover:rotate-0 transition-transform duration-700">
                    
                    {/* Scanline Effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-green/10 to-transparent h-12 w-full animate-bounce pointer-events-none"></div>
                    
                    <img 
                      alt="Page Profit Accelerator Checklist Cover" 
                      className="w-full h-auto rounded-lg shadow-2xl relative z-10" 
                      src="/checklist-cover.png"
                    />
                    
                    {/* Tech Label badge details */}
                    <div className="absolute top-6 -right-6 bg-black/95 border border-primary-green/35 px-3 py-1 rounded text-[9px] font-mono text-primary-green uppercase tracking-widest backdrop-blur-md z-20">
                      V.2025_REV_CHECK
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </section>

        {/* Data Stream Ticker */}
        <section id="features-marquee" className="py-4 border-y border-white/5 bg-neutral-950 relative z-20 overflow-hidden">
          <div className="flex w-full whitespace-nowrap overflow-x-hidden">
            <div className="flex items-center gap-16 md:gap-24 px-4 animate-infinite-scroll">
              <div className="flex items-center gap-3 text-white/45 font-bold text-xs uppercase tracking-[0.2em]">
                <span className="h-1.5 w-1.5 bg-primary-green rounded-full"></span> 
                241% Proven Growth
              </div>
              <div className="flex items-center gap-3 text-white/45 font-bold text-xs uppercase tracking-[0.2em]">
                <span className="h-1.5 w-1.5 bg-primary-green rounded-full"></span> 
                7-to-8 Figure Scaling
              </div>
              <div className="flex items-center gap-3 text-white/45 font-bold text-xs uppercase tracking-[0.2em]">
                <span className="h-1.5 w-1.5 bg-primary-green rounded-full"></span> 
                Instant Results
              </div>
              <div className="flex items-center gap-3 text-white/45 font-bold text-xs uppercase tracking-[0.2em]">
                <span className="h-1.5 w-1.5 bg-primary-green rounded-full"></span> 
                Optimized Checkouts
              </div>
              {/* Duplicate for seamless visual scroll */}
              <div className="flex items-center gap-3 text-white/45 font-bold text-xs uppercase tracking-[0.2em]">
                <span className="h-1.5 w-1.5 bg-primary-green rounded-full"></span> 
                241% Proven Growth
              </div>
              <div className="flex items-center gap-3 text-white/45 font-bold text-xs uppercase tracking-[0.2em]">
                <span className="h-1.5 w-1.5 bg-primary-green rounded-full"></span> 
                7-to-8 Figure Scaling
              </div>
              <div className="flex items-center gap-3 text-white/45 font-bold text-xs uppercase tracking-[0.2em]">
                <span className="h-1.5 w-1.5 bg-primary-green rounded-full"></span> 
                Instant Results
              </div>
              <div className="flex items-center gap-3 text-white/45 font-bold text-xs uppercase tracking-[0.2em]">
                <span className="h-1.5 w-1.5 bg-primary-green rounded-full"></span> 
                Optimized Checkouts
              </div>
            </div>
          </div>
        </section>

        {/* Areas Section: Integrated Dashboard Aesthetic */}
        <section id="assessment-areas" className="py-20 px-6 relative">
          <div className="max-w-7xl mx-auto">
            
            <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6 border-l-2 border-primary-green pl-6 sm:pl-8">
              <div className="max-w-2xl">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-anton text-white uppercase leading-tight mb-2">
                  THIS ASSESSMENT WILL MEASURE AND IMPROVE <span className="text-primary-green">3 CRITICAL AREAS</span>:
                </h2>
              </div>
              <div className="text-[10px] font-mono text-white/40 tracking-widest uppercase pb-1 whitespace-nowrap">
                System_Components // Analysis_V3
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 border border-white/5 rounded-2xl overflow-hidden bg-zinc-900/40 backdrop-blur-xl">
              
              {/* Card 1 */}
              <div className="bg-black/40 p-8 sm:p-10 relative group hover:bg-black/60 transition-all duration-300">
                <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <span className="text-4xl sm:text-5xl font-anton text-white">01</span>
                </div>
                <div className="w-12 h-12 rounded-full border border-primary-green/30 flex items-center justify-center mb-8 text-primary-green bg-primary-green/5">
                  <Activity className="w-5 h-5 animate-pulse" />
                </div>
                <h3 className="text-xl sm:text-2xl font-anton text-white uppercase mb-4 tracking-wide group-hover:text-primary-green transition-colors">
                  Technical Health &amp; Speed
                </h3>
                <p className="text-sm sm:text-base text-white/50 leading-relaxed">
                  Stop losing visitors before they even reach your products. We diagnose load times and technical friction points with precision.
                </p>
                <div className="mt-8 pt-6 border-t border-white/5">
                  <div className="flex items-center gap-2 text-[10px] font-mono text-primary-green">
                    <span className="h-1.5 w-1.5 bg-primary-green rounded-full animate-ping"></span> 
                    SCANNING METRICS...
                  </div>
                </div>
              </div>
              
              {/* Card 2 */}
              <div className="bg-black/40 p-8 sm:p-10 relative group hover:bg-black/60 transition-all duration-300">
                <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <span className="text-4xl sm:text-5xl font-anton text-white">02</span>
                </div>
                <div className="w-12 h-12 rounded-full border border-primary-green/30 flex items-center justify-center mb-8 text-primary-green bg-primary-green/5">
                  <Zap className="w-5 h-5 text-glow" />
                </div>
                <h3 className="text-xl sm:text-2xl font-anton text-white uppercase mb-4 tracking-wide group-hover:text-primary-green transition-colors">
                  Conversion &amp; Funnel Flow
                </h3>
                <p className="text-sm sm:text-base text-white/50 leading-relaxed">
                  Plug leaks in checkout, WhatsApp capture, and search functionality to maximize every visitor&apos;s value and boost AOV.
                </p>
                <div className="mt-8 pt-6 border-t border-white/5">
                  <div className="flex items-center gap-2 text-[10px] font-mono text-primary-green">
                    <span className="h-1.5 w-1.5 bg-primary-green rounded-full animate-ping"></span> 
                    PLUGGING LEAKS...
                  </div>
                </div>
              </div>
              
              {/* Card 3 */}
              <div className="bg-black/40 p-8 sm:p-10 relative group hover:bg-black/60 transition-all duration-300">
                <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <span className="text-4xl sm:text-5xl font-anton text-white">03</span>
                </div>
                <div className="w-12 h-12 rounded-full border border-primary-green/30 flex items-center justify-center mb-8 text-primary-green bg-primary-green/5">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="text-xl sm:text-2xl font-anton text-white uppercase mb-4 tracking-wide group-hover:text-primary-green transition-colors">
                  Retention &amp; LTV
                </h3>
                <p className="text-sm sm:text-base text-white/50 leading-relaxed">
                  Turn one-time buyers into loyal repeat customers through automated post-purchase and highly profitable win-back flows.
                </p>
                <div className="mt-8 pt-6 border-t border-white/5">
                  <div className="flex items-center gap-2 text-[10px] font-mono text-primary-green">
                    <span className="h-1.5 w-1.5 bg-primary-green rounded-full animate-ping"></span> 
                    LIFETIME_OPTIMIZED
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </section>

        {/* Growth Engineer Section: Real Results dashboard */}
        <section id="proof-results" className="py-20 px-6 overflow-hidden relative">
          <div className="max-w-7xl mx-auto">
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-anton text-center mb-16 text-white uppercase tracking-tighter">
              BUILT FROM <span className="text-primary-green">REAL RESULTS</span>
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* The Bio Profile representation */}
              <div className="lg:col-span-7 bg-zinc-950 border border-white/10 rounded-2xl p-6 sm:p-10 flex flex-col justify-between overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-green/10 blur-[100px] pointer-events-none"></div>
                
                <div>
                  <div className="flex items-center gap-5 sm:gap-6 mb-8">
                    <div className="relative">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-zinc-900 flex items-center justify-center border border-primary-green/40">
                        <Sparkles className="w-8 h-8 text-primary-green" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-primary-green rounded-full border-4 border-[#141414] flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-black font-extrabold stroke-[3]" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-anton text-white uppercase">Olayemi</h3>
                      <p className="text-[10px] text-primary-green uppercase tracking-[0.25em] font-bold">DTC Growth Engineer</p>
                    </div>
                  </div>
                  
                  <p className="text-base sm:text-lg text-white/80 leading-relaxed max-w-xl">
                    In February 2025, I stepped in as E-Commerce &amp; Optimization Manager for a DTC brand down -9% in sales. I didn’t just redesign the website. <strong className="text-white border-b-2 border-primary-green/45">I fixed the system.</strong>
                  </p>
                </div>
                
                {/* Visual Chart Metrics block */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
                  
                  {/* Metric A */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col justify-end relative h-44 overflow-hidden group">
                    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-primary-green/5 group-hover:bg-primary-green/10 transition-colors"></div>
                    <div className="relative z-10">
                      <div className="text-4xl font-anton text-primary-green leading-none">241<span className="text-2xl">%</span></div>
                      <div className="text-[9px] uppercase font-bold text-white/40 tracking-widest mt-2 font-mono">YOY Growth</div>
                    </div>
                  </div>
                  
                  {/* Metric B */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col justify-end relative h-44 overflow-hidden">
                    <div className="absolute inset-x-0 bottom-0 h-1/2 flex items-end justify-center gap-1.5 px-4 pb-14 pointer-events-none">
                      <div className="w-1.5 bg-white/5 h-1/4 rounded-t-sm"></div>
                      <div className="w-1.5 bg-white/10 h-2/4 rounded-t-sm"></div>
                      <div className="w-1.5 bg-primary-green/30 h-3/4 rounded-t-sm"></div>
                      <div className="w-1.5 bg-primary-green h-full rounded-t-sm animate-pulse"></div>
                    </div>
                    <div className="relative z-10">
                      <div className="text-4xl font-anton text-white leading-none">8-FIG</div>
                      <div className="text-[9px] uppercase font-bold text-white/40 tracking-widest mt-2 font-mono">Revenue Reached</div>
                    </div>
                  </div>
                  
                  {/* Metric C */}
                  <div className="bg-primary-green p-5 flex flex-col justify-end relative h-44 rounded-xl group transition-all duration-300 hover:scale-[1.03]">
                    <div className="absolute top-4 right-4 h-8 w-8 bg-black/20 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-black font-bold" />
                    </div>
                    <div className="relative z-10">
                      <div className="text-4xl font-anton text-black leading-none">34%</div>
                      <div className="text-[9px] uppercase font-bold text-black/60 tracking-widest mt-2 font-mono">WhatsApp Conversion</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Testimonial: Glass card panel */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                
                <div className="bg-zinc-900/60 border border-white/15 p-8 sm:p-10 rounded-2xl flex-grow flex flex-col justify-center relative overflow-hidden backdrop-blur-xl">
                  <div className="absolute top-6 left-6 text-primary-green/10 font-anton text-8xl leading-none select-none">“</div>
                  
                  <p className="text-lg sm:text-xl text-white italic leading-relaxed mb-6 relative z-10 font-medium">
                    “I took the Page Profit Accelerator and immediately saw exactly where my store was leaking money. <strong className="text-primary-green font-bold">The checklist alone was worth it.</strong> It gave me clarity I’ve been missing for months.”
                  </p>
                  
                  <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                      <User className="w-5 h-5 text-white/40" />
                    </div>
                    <div>
                      <p className="font-anton text-white uppercase text-base leading-none">Lagos DTC Founder</p>
                      <p className="text-[8px] sm:text-[9px] font-bold text-primary-green uppercase tracking-widest mt-1">8-Figure E-commerce Entrepreneur</p>
                    </div>
                  </div>
                </div>
                
                {/* Tech Badge card details */}
                <div className="bg-primary-green/10 border border-primary-green/25 p-5 rounded-2xl flex items-center justify-between">
                  <div className="text-[9px] font-mono text-primary-green uppercase leading-tight tracking-wider">
                    STATUS: HIGH PERFORMANCE<br/>
                    RELIABILITY: 99.9%
                  </div>
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-primary-green rounded-full"></div>
                    <div className="w-2 h-2 bg-primary-green rounded-full opacity-50"></div>
                    <div className="w-2 h-2 bg-primary-green rounded-full opacity-20"></div>
                  </div>
                </div>
                
              </div>
              
            </div>
          </div>
        </section>

        {/* Final Conversion CTA node */}
        <section id="cta-bottom" className="py-20 px-6 relative overflow-hidden">
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-zinc-950/80 border border-white/10 rounded-[2rem] p-8 sm:p-16 text-center overflow-hidden backdrop-blur-md">
              
              {/* Background grid visual details */}
              <div className="absolute inset-0 bg-grid-tech opacity-15 pointer-events-none"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary-green/5 blur-[120px] rounded-full pointer-events-none"></div>
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-anton text-white uppercase tracking-normal mb-8 relative z-10 leading-tight">
                READY TO DISCOVER YOUR <br/>
                <span className="text-primary-green underline decoration-primary-green/20 underline-offset-8">PAGE PROFIT SCORE</span>?
              </h2>
              
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-10 relative z-10">
                <div className="flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full text-[10px] pr-5 sm:text-xs font-bold uppercase tracking-widest border border-white/5">
                  <span className="h-2 w-2 rounded-full bg-primary-green"></span>
                  15 Questions
                </div>
                <div className="flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full text-[10px] pr-5 sm:text-xs font-bold uppercase tracking-widest border border-white/5">
                  <span className="h-2 w-2 rounded-full bg-primary-green"></span>
                  &lt; 3 Minutes
                </div>
                <div className="flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full text-[10px] pr-5 sm:text-xs font-bold uppercase tracking-widest border border-white/5">
                  <span className="h-2 w-2 rounded-full bg-primary-green"></span>
                  Instant Results
                </div>
              </div>
              
              <div className="space-y-6 relative z-10">
                <button 
                  id="final-assessment-start-btn"
                  onClick={onStartQuiz}
                  className="glow-btn bg-primary-green text-dark-bg font-anton w-full sm:w-auto px-12 py-5 rounded-2xl text-xl uppercase tracking-wider cursor-pointer shadow-2xl transition-all duration-300 hover:scale-[1.03]"
                >
                  Start Free Assessment Now
                </button>
                
                <div className="flex items-center justify-center gap-3">
                  <div className="h-px w-8 bg-white/10"></div>
                  <p className="text-[8px] sm:text-[10px] text-white/40 flex items-center gap-2 uppercase tracking-[0.25em] font-extrabold">
                    <Lock className="w-3.5 h-3.5 text-primary-green" /> 
                    100% FREE • SECURE ANALYSIS
                  </p>
                  <div className="h-px w-8 bg-white/10"></div>
                </div>
              </div>
              
              {/* Footer Label detail */}
              <div className="absolute bottom-0 left-0 right-0 py-2.5 bg-primary-green/5 border-t border-primary-green/10 font-mono text-[9px] text-primary-green/45 uppercase tracking-[0.4em] pointer-events-none select-none">
                SYSTEM_READY_FOR_INPUT
              </div>
              
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black py-16 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
            
            <div className="space-y-6 max-w-sm">
              <img 
                alt="Page Profit Accelerator Logo Footer" 
                className="h-7 brightness-0 invert opacity-45 hover:opacity-100 transition-opacity" 
                src="/logo.png"
              />
              <p className="text-xs sm:text-sm text-white/30 leading-relaxed">
                High-performance growth engineering for Shopify &amp; WooCommerce DTC brands scaling in Nigeria &amp; Africa.
              </p>
              <p className="text-[9px] text-white/20 uppercase tracking-[0.2em] font-mono">
                © 2026 PAGE PROFIT ACCELERATOR. REV_ID: V3.01
              </p>
            </div>
            
            <nav className="grid grid-cols-2 gap-x-12 gap-y-4 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] font-sans">
              <a className="text-white/40 hover:text-primary-green transition-colors" href="/privacy">Privacy_Policy</a>
              <a className="text-white/40 hover:text-primary-green transition-colors" href="/terms">Terms_Conditions</a>
              <a className="text-white/40 hover:text-primary-green transition-colors" href="/disclaimer">Growth_Disclaimer</a>
              <a className="text-white/40 hover:text-primary-green transition-colors" href="/support">Support_Node</a>
            </nav>
            
          </div>
        </div>
      </footer>
    </div>
  );
}
