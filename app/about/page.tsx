'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import OptimizedLogo from '../homepage/OptimizedLogo';
import gsap from 'gsap';
import {
  HiArrowRight,
  HiSparkles,
  HiShieldCheck,
  HiChartBarSquare,
  HiDocumentText,
  HiUsers,
  HiLightBulb,
  HiRocketLaunch,
  HiCheckCircle,
  HiEnvelope,
  HiMapPin,
  HiPaperAirplane,
  HiCheck,
  HiXMark,
} from 'react-icons/hi2';

/* ── Team ── */
const team = [
  {
    name: 'Riya Sharma',
    role: 'Founder & CEO',
    bio: 'Ex-Google recruiter turned builder. Saw too many great candidates ghosted by ATS and decided to fix it.',
    avatar: 'RS',
    gradient: 'from-blue-600 to-indigo-700',
  },
  {
    name: 'Arjun Patel',
    role: 'CTO',
    bio: '10 years building developer tools. Passionate about making complex tech feel effortless.',
    avatar: 'AP',
    gradient: 'from-purple-600 to-fuchsia-700',
  },
  {
    name: 'Sofia Torres',
    role: 'Head of Design',
    bio: 'Believes that beautiful and functional are never at odds. Led design at two Series B startups.',
    avatar: 'ST',
    gradient: 'from-pink-500 to-rose-600',
  },
  {
    name: 'Marcus Webb',
    role: 'Head of Career Research',
    bio: 'Former CHRO at a Fortune 500. Bridges the gap between what recruiters want and what candidates submit.',
    avatar: 'MW',
    gradient: 'from-emerald-500 to-teal-600',
  },
];

/* ── Values ── */
const values = [
  {
    icon: HiShieldCheck,
    title: 'Honest & Transparent',
    desc: 'No dark patterns, no hidden paywalls. We tell you exactly how your resume scores and why.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
  },
  {
    icon: HiLightBulb,
    title: 'Research-Backed',
    desc: 'Every feature is built on real hiring data and feedback from recruiters at top companies.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
  },
  {
    icon: HiRocketLaunch,
    title: 'Speed Over Friction',
    desc: 'You can build a complete ATS-ready resume in under 10 minutes. We time ourselves.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20',
  },
  {
    icon: HiUsers,
    title: 'Candidate First',
    desc: 'We work for job seekers, not recruiters. Your data is yours — always.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
  },
];

/* ── Stats ── */
const stats = [
  { value: '120K+', label: 'Resumes built' },
  { value: '40+',   label: 'Countries' },
  { value: '94%',   label: 'ATS pass rate' },
  { value: '4.9★',  label: 'Average rating' },
];

export default function AboutPage() {
  const [mounted, setMounted] = useState(false);
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    gsap.fromTo('.about-hero-text',
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.14, ease: 'power3.out' },
    );
    gsap.fromTo('.about-section',
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out', delay: 0.35 },
    );
  }, [mounted]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;
    setFormStatus('sending');
    // Simulate async send
    await new Promise(r => setTimeout(r, 1400));
    setFormStatus('sent');
    setFormState({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setFormStatus('idle'), 5000);
  };

  return (
    <div className="min-h-screen bg-[#05060f] text-white">

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#05060f]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <OptimizedLogo />
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/toolbox" className="hover:text-white transition-colors">Toolbox</Link>
            <Link href="/insights" className="hover:text-white transition-colors">Insights</Link>
            <Link href="/about" className="text-white font-medium">About</Link>
            <Link href="/builder" className="px-4 py-1.5 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors">
              Build Resume
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Hero ── */}
      <section ref={heroRef} className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-20">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-175 h-80 bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-10 right-0 w-72 h-72 bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="about-hero-text inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-medium mb-6">
            <HiSparkles className="w-3.5 h-3.5" /> Our Mission
          </div>
          <h1 className="about-hero-text text-5xl md:text-6xl font-bold tracking-tight mb-5 leading-tight">
            We help great people
            <span className="block bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              get past the bots
            </span>
          </h1>
          <p className="about-hero-text text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            ResumeForge was built because skilled candidates were being rejected by software before a
            human ever read their name. We decided that was worth fixing.
          </p>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="about-section max-w-5xl mx-auto px-6 mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(s => (
            <div key={s.label} className="rounded-2xl border border-white/8 bg-white/3 p-6 text-center">
              <div className="text-3xl font-bold text-white mb-1">{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Story ── */}
      <section className="about-section max-w-5xl mx-auto px-6 mb-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-5">The story behind ResumeForge</h2>
            <div className="space-y-4 text-gray-400 text-sm leading-relaxed">
              <p>
                In 2023, our founder Riya was reviewing hundreds of applications at Google when she
                noticed a pattern: the ATS was quietly discarding qualified candidates whose resumes
                used two-column layouts, embedded fonts, or non-standard headings.
              </p>
              <p>
                She started manually coaching candidates on formatting. The results were immediate —
                same person, better-formatted resume, dramatically higher callback rates. She knew
                this shouldn't require a personal connection to a recruiter to fix.
              </p>
              <p>
                ResumeForge launched in early 2024 with one goal: give every job seeker access to
                the same insider knowledge that insiders take for granted. No expensive career
                coaches required.
              </p>
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              {['Founded 2024', 'Bootstrapped', 'Remote Team', 'Open Roadmap'].map(tag => (
                <span key={tag} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400">
                  <HiCheckCircle className="w-3.5 h-3.5 text-blue-400" /> {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Visual card */}
          <div className="relative">
            <div className="rounded-3xl border border-white/10 bg-white/3 p-8">
              <div className="space-y-4">
                {[
                  { icon: HiDocumentText,  label: 'ATS-optimised templates',  color: 'text-blue-400'   },
                  { icon: HiChartBarSquare,label: 'Real-time ATS score',       color: 'text-purple-400' },
                  { icon: HiShieldCheck,   label: 'No-account required',       color: 'text-emerald-400'},
                  { icon: HiRocketLaunch,  label: 'PDF & DOCX export',         color: 'text-pink-400'   },
                  { icon: HiSparkles,      label: 'Insights & career guides',   color: 'text-amber-400'  },
                ].map(({ icon: Icon, label, color }) => (
                  <div key={label} className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-0">
                    <Icon className={`w-5 h-5 shrink-0 ${color}`} />
                    <span className="text-sm text-gray-300">{label}</span>
                    <HiCheck className="w-4 h-4 text-emerald-400 ml-auto shrink-0" />
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-blue-600/15 blur-3xl rounded-full pointer-events-none" />
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="about-section max-w-5xl mx-auto px-6 mb-24">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">What we stand for</h2>
        <p className="text-gray-500 text-sm text-center mb-10">Principles that guide every decision we make.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {values.map(v => (
            <div key={v.title} className={`rounded-2xl border p-6 ${v.bg}`}>
              <v.icon className={`w-7 h-7 mb-3 ${v.color}`} />
              <h3 className="text-base font-semibold text-white mb-1.5">{v.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Team ── */}
      <section className="about-section max-w-5xl mx-auto px-6 mb-24">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">Meet the team</h2>
        <p className="text-gray-500 text-sm text-center mb-10">Small team, big opinions about resume formatting.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {team.map(member => (
            <div key={member.name} className="rounded-2xl border border-white/8 bg-white/3 p-5 text-center hover:bg-white/6 hover:border-white/15 transition-all">
              <div className={`w-16 h-16 rounded-2xl bg-linear-to-br ${member.gradient} flex items-center justify-center text-xl font-bold text-white mx-auto mb-4 shadow-lg`}>
                {member.avatar}
              </div>
              <h3 className="font-semibold text-white text-sm mb-0.5">{member.name}</h3>
              <p className="text-xs text-blue-400 mb-3">{member.role}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Contact Form ── */}
      <section id="contact" className="about-section max-w-5xl mx-auto px-6 mb-24">
        <div className="grid md:grid-cols-2 gap-12">

          {/* Left info */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-3">Get in touch</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              Have a question, a feature idea, found a bug, or just want to say hi? We read every
              message and usually reply within 24 hours.
            </p>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                  <HiEnvelope className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Email us</p>
                  <p className="text-sm text-white">hello@resumeforge.app</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                  <HiMapPin className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Based in</p>
                  <p className="text-sm text-white">Bengaluru, India &amp; Remote</p>
                </div>
              </div>
            </div>

            <div className="mt-10 rounded-2xl border border-white/8 bg-white/3 p-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Typical response times</p>
              <div className="space-y-2 text-sm">
                {[
                  { type: 'General enquiries', time: '< 24 hours' },
                  { type: 'Bug reports',        time: '< 4 hours'  },
                  { type: 'Feature requests',   time: '2–3 days'   },
                ].map(row => (
                  <div key={row.type} className="flex justify-between text-xs">
                    <span className="text-gray-400">{row.type}</span>
                    <span className="text-blue-400 font-medium">{row.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right form */}
          <div className="rounded-3xl border border-white/10 bg-white/3 p-7">
            {formStatus === 'sent' ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mb-5">
                  <HiCheck className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Message sent!</h3>
                <p className="text-sm text-gray-400">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-base font-semibold text-white mb-5">Send us a message</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Name *</label>
                    <input
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm !text-white !caret-white placeholder-gray-600 outline-none focus:border-blue-500/50 focus:bg-white/8 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Email *</label>
                    <input
                      name="email"
                      type="email"
                      value={formState.email}
                      onChange={handleChange}
                      required
                      placeholder="you@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm !text-white !caret-white placeholder-gray-600 outline-none focus:border-blue-500/50 focus:bg-white/8 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Subject</label>
                  <select
                    name="subject"
                    value={formState.subject}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm !text-white outline-none focus:border-blue-500/50 transition-all appearance-none"
                  >
                    <option value="" className="bg-gray-900">Select a topic</option>
                    <option value="General"        className="bg-gray-900">General enquiry</option>
                    <option value="Bug"            className="bg-gray-900">Bug report</option>
                    <option value="Feature"        className="bg-gray-900">Feature request</option>
                    <option value="Partnership"    className="bg-gray-900">Partnership</option>
                    <option value="Press"          className="bg-gray-900">Press &amp; media</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Message *</label>
                  <textarea
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell us what's on your mind..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm !text-white !caret-white placeholder-gray-600 outline-none focus:border-blue-500/50 focus:bg-white/8 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={formStatus === 'sending'}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:from-blue-500 hover:to-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-600/20"
                >
                  {formStatus === 'sending' ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <HiPaperAirplane className="w-4 h-4" /> Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <section className="border-t border-white/8 bg-white/2 py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-3">Ready to build your resume?</h2>
          <p className="text-gray-400 mb-7 text-sm">Free, no sign-up, ATS-ready in minutes.</p>
          <Link
            href="/builder"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-500 hover:to-indigo-500 transition-all shadow-xl shadow-blue-600/30 hover:scale-105"
          >
            Get Started <HiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}
