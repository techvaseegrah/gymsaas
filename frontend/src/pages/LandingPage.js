import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    FiMenu,
    FiX,
    FiArrowRight,
    FiShield,
    FiClock,
    FiCpu,
    FiUsers,
    FiCheckCircle,
    FiPlayCircle,
    FiTrendingUp,
    FiZap
} from 'react-icons/fi';

const navItems = [
    { label: 'Platform', target: 'features' },
    { label: 'Benefits', target: 'benefits' },
    { label: 'Demo', target: 'demo' },
    { label: 'Pricing', target: 'pricing' },
    { label: 'Testimonials', target: 'testimonials' },
    { label: 'FAQ', target: 'faq' },
];

const featureCards = [
    {
        title: 'AI-ready Attendance',
        description: 'Hybrid RFID + face recognition stack that keeps every class accountable in seconds.',
        icon: FiShield,
    },
    {
        title: 'Realtime dashboards',
        description: 'See every fighter\'s training streak, readiness, and gaps with live updating metrics.',
        icon: FiTrendingUp,
    },
    {
        title: 'Automated workflows',
        description: 'Smart nudges, doubt resolution queues, and leveling checkpoints built-in.',
        icon: FiZap,
    },
];

const benefits = [
    {
        title: 'Unified control room',
        description: 'Admins operate the entire academy from a single panel that ties together people, progress, and performance.',
    },
    {
        title: 'Motivated fighters',
        description: 'Fighters see clear goals, milestones, and streak rewards that keep them progressing every week.',
    },
    {
        title: 'Operational clarity',
        description: 'Forecast staffing, prep certifications, and de-risk events with proactive alerts.',
    },
];

const pricingTiers = [
    {
        name: 'Starter',
        price: '₹3,999',
        cadence: 'per month',
        description: 'Perfect for boutique academies getting started with digital ops.',
        features: ['30 fighters included', 'Attendance automation', '1 admin seat', 'Email support'],
        cta: 'Launch Starter',
    },
    {
        name: 'Growth',
        highlight: true,
        price: '₹9,999',
        cadence: 'per month',
        description: 'Everything you need to run a multi-location combat program.',
        features: ['120 fighters included', 'Advanced analytics', '3 admin seats', 'Priority support'],
        cta: 'Scale with Growth',
    },
    {
        name: 'Elite',
        price: 'Custom',
        cadence: 'engagement',
        description: 'White-glove enablement for franchises and enterprise training orgs.',
        features: ['Unlimited fighters', 'Dedicated CSM', 'Custom integrations', 'On-site onboarding'],
        cta: 'Talk to Sales',
    },
];

const testimonials = [
    {
        quote: 'GymRatz turned our chaotic attendance manual into a 2-minute ritual. Fighters love the instant feedback.',
        name: 'Coach Aisha Bhatt',
        role: 'Head Coach, Iron Circle',
    },
    {
        quote: 'Level tracking and doubt queues brought transparency. We finally know who needs help before belt tests.',
        name: 'Santiago Rivera',
        role: 'Program Director, Pulse Combat',
    },
    {
        quote: 'Our admin overhead dropped by 40%. The platform pays for itself every quarter.',
        name: 'Mei Chen',
        role: 'Operations Lead, Titan Dojo',
    },
];

const faqs = [
    {
        question: 'How long does onboarding take?',
        answer: 'Most academies launch within a single week. We migrate your rosters, set up attendance devices, and train staff.',
    },
    {
        question: 'Does it work with our existing RFID cards?',
        answer: 'Yes. We support common RFID/NFC standards and can ship pre-configured readers if needed.',
    },
    {
        question: 'Is fighter data secure?',
        answer: 'All data is encrypted in transit and at rest. Role-based access keeps sensitive information locked down.',
    },
    {
        question: 'Can we export reports?',
        answer: 'Absolutely. Download CSV/PDF summaries for attendance, progress, leveling, and payout operations anytime.',
    },
];

const scrollToSection = (target) => {
    const el = document.getElementById(target);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};

const LandingPage = () => {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [openFaqIndex, setOpenFaqIndex] = useState(0);
    const [scrollProgress, setScrollProgress] = useState(0);

    // --- SCROLL PROGRESS LOGIC ---
    useEffect(() => {
        const handleScroll = () => {
            const totalScroll = document.documentElement.scrollTop;
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scroll = totalScroll / windowHeight;
            setScrollProgress(scroll);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleFaq = (index) => {
        setOpenFaqIndex((prev) => (prev === index ? -1 : index));
    };

    const handleNavClick = (target) => {
        scrollToSection(target);
        setMenuOpen(false);
    };

    return (
        <div className="bg-neutral text-slate-800 min-h-screen relative">
            
            {/* --- FIXED HEADER --- */}
            <header className="fixed top-0 w-full z-40 bg-slate-900/95 backdrop-blur-md border-b border-white/10 transition-all duration-300">
                <div className="mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-2xl bg-accent/20 border border-white/20 flex items-center justify-center font-bold text-white">
                            GR
                        </div>
                        <div>
                            <p className="text-xl font-semibold text-white">GymRatz</p>
                            <p className="text-xs text-white/70 tracking-widest uppercase">Combat Platform</p>
                        </div>
                    </div>
                    <nav className="hidden lg:flex items-center space-x-8 text-sm uppercase tracking-wide">
                        {navItems.map((item) => (
                            <button
                                key={item.target}
                                onClick={() => handleNavClick(item.target)}
                                className="text-white/80 hover:text-white transition"
                            >
                                {item.label}
                            </button>
                        ))}
                        <Link
                            to="/login"
                            className="inline-flex items-center space-x-2 bg-white text-primary font-semibold px-5 py-2 rounded-full hover:bg-accent hover:text-white transition"
                        >
                            <span>Login</span>
                        </Link>
                        <Link
                            to="/signup"
                            className="inline-flex items-center space-x-2 bg-accent text-white font-semibold px-5 py-2 rounded-full hover:bg-accent/80 transition"
                        >
                            <span>Sign Up</span>
                        </Link>
                    </nav>
                    <button
                        className="lg:hidden text-white text-2xl"
                        onClick={() => setMenuOpen((prev) => !prev)}
                        aria-label="Toggle navigation menu"
                    >
                        {isMenuOpen ? <FiX /> : <FiMenu />}
                    </button>
                </div>

                {/* --- SCROLL PROGRESS BAR (MOVED INSIDE HEADER, BOTTOM) --- */}
                <div 
                    className="absolute bottom-0 left-0 h-1 bg-accent z-50 transition-all duration-150 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                    style={{ width: `${scrollProgress * 100}%` }}
                />

                {/* Mobile Menu Dropdown */}
                {isMenuOpen && (
                    <div className="lg:hidden px-6 pb-6 text-white space-y-4 bg-slate-900 border-t border-white/10 animate-fade-in">
                        {navItems.map((item) => (
                            <button
                                key={item.target}
                                onClick={() => handleNavClick(item.target)}
                                className="block w-full text-left py-3 text-lg font-semibold border-b border-white/5 last:border-none"
                            >
                                {item.label}
                            </button>
                        ))}
                        <div className="flex flex-col gap-3 pt-4">
                            <Link
                                to="/login"
                                onClick={() => setMenuOpen(false)}
                                className="inline-flex w-full items-center justify-center space-x-2 bg-white text-primary font-semibold px-5 py-3 rounded-full hover:bg-accent hover:text-white transition"
                            >
                                <span>Login</span>
                            </Link>
                            <Link
                                to="/signup"
                                onClick={() => setMenuOpen(false)}
                                className="inline-flex w-full items-center justify-center space-x-2 bg-accent text-white font-semibold px-5 py-3 rounded-full hover:bg-accent/80 transition"
                            >
                                <span>Sign Up</span>
                            </Link>
                        </div>
                    </div>
                )}
            </header>

            {/* --- HERO SECTION --- */}
            {/* Added pt-28 to push content down below the fixed header */}
            <div className="relative isolate overflow-hidden text-white bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 pt-28">
                <div className="absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.45),_transparent_55%)]" />
                <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.35),_transparent_60%)]" />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-transparent to-slate-950/80" />

                <div className="relative z-10">
                    <section className="mx-auto px-6 lg:px-8 pb-16 pt-10 lg:pt-16">
                        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
                            <div className="space-y-8">
                                <p className="inline-flex items-center space-x-2 text-sm uppercase tracking-[0.3em] text-white/60">
                                    <span className="h-px w-8 bg-white/40" />
                                    <span>Combat ops cloud</span>
                                </p>
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl leading-tight font-semibold">
                                    Elite training orchestration for high-growth academies.
                                </h1>
                                <p className="text-lg text-white/80">
                                    GymRatz unifies attendance, leveling, doubts, and coaching workflows so teams can train harder and ship results faster.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <Link
                                        to="/login"
                                        className="inline-flex items-center space-x-3 bg-accent text-white font-semibold px-6 py-3 rounded-full shadow-lg shadow-accent/30 hover:-translate-y-0.5 transition transform"
                                    >
                                        <span>Go to Console</span>
                                        <FiArrowRight />
                                    </Link>
                                    <button
                                        onClick={() => handleNavClick('demo')}
                                        className="inline-flex items-center space-x-3 border border-white/30 bg-white/10 backdrop-blur px-6 py-3 rounded-full hover:bg-white/20 transition"
                                    >
                                        <FiPlayCircle className="text-xl" />
                                        <span>Watch Demo</span>
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 gap-6 text-white/80">
                                    <div>
                                        <p className="text-4xl font-bold">12k+</p>
                                        <p className="text-sm uppercase tracking-wide">Sessions automated</p>
                                    </div>
                                    <div>
                                        <p className="text-4xl font-bold">97%</p>
                                        <p className="text-sm uppercase tracking-wide">Attendance accuracy</p>
                                    </div>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="absolute -inset-4 bg-accent/20 blur-3xl rounded-[56px]" />
                                <div className="relative bg-white/5 border border-white/10 rounded-[48px] aspect-video flex items-center justify-center">
                                    <div className="bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20 rounded-[40px] w-[90%] h-[90%] flex items-center justify-center">
                                        <FiPlayCircle className="text-5xl text-accent" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {/* Features Section */}
            <section id="features" className="py-20 bg-white">
                <div className="mx-auto px-6 lg:px-8 max-w-7xl">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <p className="inline-flex items-center space-x-2 text-sm uppercase tracking-[0.3em] text-slate-500 mb-4">
                            <span className="h-px w-8 bg-slate-400" />
                            <span>Platform capabilities</span>
                        </p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                            Precision tools for modern academies
                        </h2>
                        <p className="text-lg text-slate-600">
                            Purpose-built features that eliminate manual work and surface actionable insights.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {featureCards.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div key={index} className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-accent/30 hover:shadow-lg transition">
                                    <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-6">
                                        <Icon className="text-accent text-xl" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                                    <p className="text-slate-600">{feature.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section id="benefits" className="py-20 bg-slate-50">
                <div className="mx-auto px-6 lg:px-8 max-w-7xl">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <p className="inline-flex items-center space-x-2 text-sm uppercase tracking-[0.3em] text-slate-500 mb-4">
                                <span className="h-px w-8 bg-slate-400" />
                                <span>Proven outcomes</span>
                            </p>
                            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                                Measurable impact across your academy
                            </h2>
                            <div className="space-y-8">
                                {benefits.map((benefit, index) => (
                                    <div key={index} className="flex gap-4">
                                        <div className="flex-shrink-0 mt-1">
                                            <FiCheckCircle className="text-accent text-xl" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-slate-900 mb-2">{benefit.title}</h3>
                                            <p className="text-slate-600">{benefit.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-3xl p-8 border border-accent/20">
                            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="font-semibold text-slate-900">Weekly Attendance</span>
                                    <span className="text-sm text-slate-500">Last 30 days</span>
                                </div>
                                <div className="h-32 flex items-end gap-2">
                                    {[65, 78, 82, 75, 90, 85, 92].map((value, index) => (
                                        <div key={index} className="flex-1 flex flex-col items-center">
                                            <div
                                                className="w-full bg-gradient-to-t from-accent to-accent/80 rounded-t-sm"
                                                style={{ height: `${value}%` }}
                                            />
                                            <span className="text-xs text-slate-500 mt-2">{index + 1}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white rounded-xl p-4 border border-slate-200">
                                    <p className="text-2xl font-bold text-slate-900">89%</p>
                                    <p className="text-sm text-slate-600">Avg. retention</p>
                                </div>
                                <div className="bg-white rounded-xl p-4 border border-slate-200">
                                    <p className="text-2xl font-bold text-slate-900">2.1x</p>
                                    <p className="text-sm text-slate-600">Faster leveling</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Demo Section */}
            <section id="demo" className="py-20 bg-white">
                <div className="mx-auto px-6 lg:px-8 max-w-4xl text-center">
                    <p className="inline-flex items-center space-x-2 text-sm uppercase tracking-[0.3em] text-slate-500 mb-4">
                        <span className="h-px w-8 bg-slate-400" />
                        <span>Interactive preview</span>
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                        See the platform in action
                    </h2>
                    <p className="text-lg text-slate-600 mb-12 max-w-2xl mx-auto">
                        Watch how GymRatz transforms academy operations from chaos to clarity.
                    </p>
                    <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl overflow-hidden border border-slate-700 aspect-video max-w-4xl mx-auto">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.15),_transparent_70%)]" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <button className="inline-flex items-center space-x-3 bg-accent text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:bg-accent/90 transition">
                                <FiPlayCircle className="text-2xl" />
                                <span>Play Demo (2:47)</span>
                            </button>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                            <div className="text-white/80 text-sm">Platform Tour</div>
                            <div className="text-white/60 text-sm">2:47</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-20 bg-slate-50">
                <div className="mx-auto px-6 lg:px-8 max-w-7xl">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <p className="inline-flex items-center space-x-2 text-sm uppercase tracking-[0.3em] text-slate-500 mb-4">
                            <span className="h-px w-8 bg-slate-400" />
                            <span>Simple pricing</span>
                        </p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                            Plans that scale with your academy
                        </h2>
                        <p className="text-lg text-slate-600">
                            Start free, then pay as you grow. All plans include core features.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {pricingTiers.map((tier, index) => (
                            <div
                                key={index}
                                className={`rounded-2xl p-8 border ${tier.highlight
                                        ? 'border-accent bg-gradient-to-b from-accent/5 to-white relative ring-1 ring-accent/20 shadow-lg shadow-accent/10'
                                        : 'border-slate-200 bg-white'
                                    }`}
                            >
                                {tier.highlight && (
                                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-accent text-white px-4 py-1 rounded-full text-sm font-semibold">
                                        MOST POPULAR
                                    </div>
                                )}
                                <h3 className={`text-xl font-semibold mb-2 ${tier.highlight ? 'text-slate-900' : 'text-slate-900'}`}>
                                    {tier.name}
                                </h3>
                                <div className="mb-4">
                                    <span className="text-4xl font-bold text-slate-900">{tier.price}</span>
                                    {tier.cadence && <span className="text-slate-600"> {tier.cadence}</span>}
                                </div>
                                <p className={`mb-6 ${tier.highlight ? 'text-slate-700' : 'text-slate-600'}`}>
                                    {tier.description}
                                </p>
                                <ul className="mb-8 space-y-3">
                                    {tier.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center">
                                            <FiCheckCircle className={`mr-2 ${tier.highlight ? 'text-accent' : 'text-slate-400'}`} />
                                            <span className={tier.highlight ? 'text-slate-700' : 'text-slate-600'}>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    to="/signup"
                                    className={`w-full py-3 rounded-lg font-semibold text-center transition ${tier.highlight
                                            ? 'bg-accent text-white hover:bg-accent/90 shadow-md shadow-accent/20'
                                            : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                                        }`}
                                >
                                    {tier.cta}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="py-20 bg-white">
                <div className="mx-auto px-6 lg:px-8 max-w-7xl">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <p className="inline-flex items-center space-x-2 text-sm uppercase tracking-[0.3em] text-slate-500 mb-4">
                            <span className="h-px w-8 bg-slate-400" />
                            <span>Trusted by pros</span>
                        </p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                            Loved by academy leaders worldwide
                        </h2>
                        <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
                            Join thousands of academy leaders who trust GymRatz to streamline operations and boost fighter performance.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
                                <div className="text-accent mb-4">
                                    {'★'.repeat(5)}
                                </div>
                                <p className="text-lg text-slate-700 mb-6 italic">"{testimonial.quote}"</p>
                                <div>
                                    <p className="font-semibold text-slate-900">{testimonial.name}</p>
                                    <p className="text-slate-600">{testimonial.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="py-20 bg-slate-50">
                <div className="mx-auto px-6 lg:px-8 max-w-4xl">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <p className="inline-flex items-center space-x-2 text-sm uppercase tracking-[0.3em] text-slate-500 mb-4">
                            <span className="h-px w-8 bg-slate-400" />
                            <span>Questions answered</span>
                        </p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                            Frequently asked questions
                        </h2>
                    </div>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
                            >
                                <button
                                    className="w-full flex justify-between items-center p-6 text-left"
                                    onClick={() => toggleFaq(index)}
                                >
                                    <span className="font-semibold text-slate-900">{faq.question}</span>
                                    <FiArrowRight
                                        className={`transform transition-transform ${openFaqIndex === index ? 'rotate-90' : ''
                                            }`}
                                    />
                                </button>
                                {openFaqIndex === index && (
                                    <div className="px-6 pb-6 text-slate-600">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
                <div className="mx-auto px-6 lg:px-8 max-w-4xl text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                        Ready to transform your academy?
                    </h2>
                    <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto">
                        Join thousands of academy leaders who trust GymRatz to streamline operations and boost fighter performance.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            to="/signup"
                            className="inline-flex items-center space-x-3 bg-accent text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:bg-accent/90 transition"
                        >
                            <span>Start Free Trial</span>
                        </Link>
                        <Link
                            to="/login"
                            className="inline-flex items-center space-x-3 border border-white/30 bg-white/10 backdrop-blur px-8 py-4 rounded-full hover:bg-white/20 transition"
                        >
                            <span>Login</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 py-16">
                <div className="mx-auto px-6 lg:px-8 max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
                        <div className="lg:col-span-2">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="h-10 w-10 rounded-2xl bg-accent/20 border border-white/20 flex items-center justify-center font-bold text-white">
                                    GR
                                </div>
                                <div>
                                    <p className="text-xl font-semibold text-white">GymRatz</p>
                                    <p className="text-xs text-white/70 tracking-widest uppercase">Combat Platform</p>
                                </div>
                            </div>
                            <p className="mb-6 max-w-sm">
                                Elite training orchestration for high-growth academies worldwide.
                            </p>
                            <div className="flex space-x-4">
                                <a href="#" className="text-slate-400 hover:text-white transition">
                                    <FiUsers className="text-xl" />
                                </a>
                                <a href="#" className="text-slate-400 hover:text-white transition">
                                    <FiClock className="text-xl" />
                                </a>
                                <a href="#" className="text-slate-400 hover:text-white transition">
                                    <FiCpu className="text-xl" />
                                </a>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-6">Product</h4>
                            <ul className="space-y-4">
                                <li><a href="#" className="hover:text-white transition">Features</a></li>
                                <li><a href="#" className="hover:text-white transition">Solutions</a></li>
                                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                                <li><a href="#" className="hover:text-white transition">Demo</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-6">Resources</h4>
                            <ul className="space-y-4">
                                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                                <li><a href="#" className="hover:text-white transition">Documentation</a></li>
                                <li><a href="#" className="hover:text-white transition">Guides</a></li>
                                <li><a href="#" className="hover:text-white transition">Support</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-6">Company</h4>
                            <ul className="space-y-4">
                                <li><a href="#" className="hover:text-white transition">About</a></li>
                                <li><a href="#" className="hover:text-white transition">Careers</a></li>
                                <li><a href="#" className="hover:text-white transition">Contact</a></li>
                                <li><a href="#" className="hover:text-white transition">Partners</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-slate-800 mt-16 pt-8 text-sm text-center">
                        <p>© {new Date().getFullYear()} GymRatz. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;