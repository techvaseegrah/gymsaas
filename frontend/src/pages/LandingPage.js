import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    FiMenu,
    FiX,
    FiArrowRight,
    FiShield,
    FiTrendingUp,
    FiZap,
    FiCheckCircle,
    FiPlayCircle,
    FiUsers,
    FiClock,
    FiCpu,
    FiInstagram,
    FiYoutube,
    FiMail,
    FiCamera,
    FiDollarSign,
    FiMessageSquare
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
        title: 'AI-Powered Face Recognition Attendance',
        description: 'Kill the queue. Clock in with a look. Our proprietary AI stack verifies identity in milliseconds.',
        icon: FiCamera,
    },
    {
        title: 'Realtime Dashboards',
        description: 'Your entire academy at a glance. Track roster health and revenue in real-time.',
        icon: FiTrendingUp,
    },
    {
        title: 'Revenue & Subscription Tracking',
        description: 'Never miss a renewal. Automated expiry tracking keeps your cash flow positive.',
        icon: FiDollarSign,
    },
    {
        title: '"Doubt" & Query Resolution',
        description: 'Coaching doesn\'t stop when class ends. A dedicated channel for technique Q&A.',
        icon: FiMessageSquare,
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
        // Changed main bg to slate-950 and text to slate-300 for dark mode base
        <div className="bg-slate-950 text-slate-300 min-h-screen relative font-sans selection:bg-accent selection:text-white">
            
            {/* --- FIXED HEADER --- */}
            <header className="fixed top-0 w-full z-40 bg-slate-950/80 backdrop-blur-md border-b border-white/5 transition-all duration-300">
                <div className="mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        {/* Logo Container */}
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-accent to-blue-700 flex items-center justify-center font-bold text-white shadow-lg shadow-accent/20">
                            GR
                        </div>
                        <div>
                            <p className="text-xl font-bold text-white tracking-tight">GymRatz</p>
                            <p className="text-[10px] text-slate-400 tracking-[0.2em] uppercase font-medium">Combat Platform</p>
                        </div>
                    </div>
                    <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium">
                        {navItems.map((item) => (
                            <button
                                key={item.target}
                                onClick={() => handleNavClick(item.target)}
                                className="text-slate-400 hover:text-white transition duration-200"
                            >
                                {item.label}
                            </button>
                        ))}
                        <Link
                            to="/login"
                            className="text-white hover:text-accent transition font-medium"
                        >
                            Login
                        </Link>
                        <Link
                            to="/signup"
                            className="bg-accent hover:bg-blue-600 text-white px-5 py-2 rounded-lg transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] font-semibold"
                        >
                            Get Started
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

                {/* Progress Bar */}
                <div 
                    className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-accent to-purple-500 z-50 transition-all duration-150 ease-out"
                    style={{ width: `${scrollProgress * 100}%` }}
                />

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="lg:hidden px-6 pb-8 pt-4 bg-slate-900 border-b border-white/10 animate-fade-in absolute w-full left-0">
                        {navItems.map((item) => (
                            <button
                                key={item.target}
                                onClick={() => handleNavClick(item.target)}
                                className="block w-full text-left py-4 text-lg font-medium text-slate-300 border-b border-white/5 last:border-none hover:text-white"
                            >
                                {item.label}
                            </button>
                        ))}
                        <div className="flex flex-col gap-4 pt-6">
                            <Link
                                to="/login"
                                onClick={() => setMenuOpen(false)}
                                className="w-full text-center py-3 rounded-lg border border-white/10 text-white font-semibold hover:bg-white/5 transition"
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                onClick={() => setMenuOpen(false)}
                                className="w-full text-center py-3 rounded-lg bg-accent text-white font-semibold shadow-lg shadow-accent/20"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                )}
            </header>

            {/* --- HERO SECTION --- */}
            <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                {/* Background Glows */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                    <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px] mix-blend-screen animate-blob" />
                    <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen animate-blob animation-delay-2000" />
                </div>

                <div className="relative z-10 mx-auto px-6 lg:px-8 max-w-7xl">
                    <div className="text-center max-w-4xl mx-auto mb-12">
                        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
                            <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
                            <span className="text-xs font-medium text-slate-300 tracking-wide uppercase">v2.0 Now Live</span>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-white mb-8 leading-tight">
                            Elite orchestration for <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-400">combat academies</span>
                        </h1>
                        <p className="text-lg lg:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Unify attendance, fighter progression, and academy operations in one high-performance command center.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to="/signup"
                                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-accent hover:bg-blue-600 text-white font-semibold px-8 py-4 rounded-lg transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] hover:-translate-y-1"
                            >
                                <span>Start Free Trial</span>
                                <FiArrowRight />
                            </Link>
                            <button
                                onClick={() => handleNavClick('demo')}
                                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-8 py-4 rounded-lg backdrop-blur-sm transition"
                            >
                                <FiPlayCircle className="text-xl" />
                                <span>Watch Demo</span>
                            </button>
                        </div>
                    </div>
                    
                    {/* Hero Stats/Image Placeholder */}
                    <div className="relative mx-auto max-w-5xl mt-16">
                        <div className="absolute -inset-1 bg-gradient-to-r from-accent to-purple-600 rounded-2xl blur opacity-20"></div>
                        <div className="relative bg-slate-900 border border-white/10 rounded-2xl aspect-[16/9] flex items-center justify-center overflow-hidden shadow-2xl">
                             <div className="text-center">
                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                                    <FiPlayCircle className="text-4xl text-accent" />
                                </div>
                                <p className="text-slate-500 font-medium">Platform Interface Preview</p>
                             </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- FEATURES SECTION --- */}
            <section id="features" className="py-24 bg-slate-900 relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute top-0 left-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
                
                <div className="mx-auto px-6 lg:px-8 max-w-7xl relative z-10">
                    <div className="max-w-3xl mb-16 text-center mx-auto">
                        <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                            Precision tools for the gym
                        </h2>
                        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                            Built by fighters for gym owners. Features that actually save you time.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featureCards.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div 
                                    key={index} 
                                    className="group p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/1 border border-white/10 hover:from-white/10 hover:to-white/5 hover:border-white/20 transition-all duration-500 transform hover:-translate-y-3 hover:shadow-2xl backdrop-blur-sm"
                                >
                                    {/* Icon container with enhanced animation */}
                                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-accent/20 to-purple-500/20 border border-accent/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-accent/10">
                                        <Icon className="text-accent text-2xl group-hover:text-white transition-colors duration-300 drop-shadow-lg" />
                                    </div>
                                    
                                    {/* Title with gradient effect */}
                                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-accent group-hover:to-purple-400 transition-all duration-300">
                                        {feature.title}
                                    </h3>
                                    
                                    {/* Description with better spacing */}
                                    <p className="text-slate-400 leading-relaxed mb-6">
                                        {feature.description}
                                    </p>
                                    
                                    {/* Animated accent bar */}
                                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                                        <div className="w-full h-1 bg-gradient-to-r from-accent to-purple-500 rounded-full"></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* --- BENEFITS SECTION --- */}
            <section id="benefits" className="py-24 bg-slate-950">
                <div className="mx-auto px-6 lg:px-8 max-w-7xl">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-10">
                            <div>
                                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                                    Measurable impact
                                </h2>
                                <p className="text-lg text-slate-400">
                                    Stop guessing. Start tracking data that drives revenue and retention.
                                </p>
                            </div>
                            <div className="space-y-6">
                                {benefits.map((benefit, index) => (
                                    <div key={index} className="flex gap-4 p-4 rounded-xl hover:bg-white/5 transition border border-transparent hover:border-white/5">
                                        <div className="flex-shrink-0 mt-1">
                                            <FiCheckCircle className="text-accent text-xl" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white mb-2">{benefit.title}</h3>
                                            <p className="text-slate-400">{benefit.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        {/* Abstract Graph UI */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-accent/10 blur-3xl rounded-full" />
                            <div className="relative bg-slate-900 border border-white/10 rounded-2xl p-8 shadow-2xl">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="space-y-1">
                                        <p className="text-sm text-slate-400 uppercase tracking-wider">Attendance Rate</p>
                                        <p className="text-3xl font-bold text-white">94.2%</p>
                                    </div>
                                    <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-400 text-sm rounded-full flex items-center gap-1">
                                        <FiTrendingUp /> +12%
                                    </div>
                                </div>
                                <div className="h-48 flex items-end gap-3">
                                    {[40, 65, 55, 80, 70, 90, 85, 95].map((h, i) => (
                                        <div key={i} className="flex-1 w-full bg-slate-800 rounded-t-sm relative group overflow-hidden">
                                            <div 
                                                className="absolute bottom-0 left-0 w-full bg-accent group-hover:bg-blue-400 transition-all duration-500" 
                                                style={{ height: `${h}%` }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- PRICING SECTION --- */}
            <section id="pricing" className="py-24 bg-slate-900">
                <div className="mx-auto px-6 lg:px-8 max-w-7xl">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                            Simple, transparent pricing
                        </h2>
                        <p className="text-lg text-slate-400">
                            No hidden fees. Upgrade or cancel anytime.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {pricingTiers.map((tier, index) => (
                            <div
                                key={index}
                                className={`relative rounded-2xl p-8 border transition-all duration-300 ${tier.highlight
                                        ? 'bg-white/5 border-accent shadow-2xl shadow-accent/10 scale-105 z-10'
                                        : 'bg-slate-950/50 border-white/5 hover:border-white/10'
                                    }`}
                            >
                                {tier.highlight && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-accent text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg">
                                        Most Popular
                                    </div>
                                )}
                                <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                                <div className="mb-6">
                                    <span className="text-4xl font-bold text-white">{tier.price}</span>
                                    {tier.cadence && <span className="text-slate-500 text-sm"> / {tier.cadence}</span>}
                                </div>
                                <p className="text-slate-400 mb-8 h-12 text-sm leading-relaxed">
                                    {tier.description}
                                </p>
                                <ul className="space-y-4 mb-8">
                                    {tier.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start">
                                            <FiCheckCircle className={`mt-1 mr-3 flex-shrink-0 ${tier.highlight ? 'text-accent' : 'text-slate-600'}`} />
                                            <span className="text-slate-300 text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    to="/signup"
                                    className={`block w-full py-3 rounded-lg font-bold text-center transition-all ${tier.highlight
                                            ? 'bg-accent hover:bg-blue-600 text-white shadow-lg shadow-accent/25'
                                            : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                                        }`}
                                >
                                    {tier.cta}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- TESTIMONIALS --- */}
            <section id="testimonials" className="py-24 bg-slate-950 border-t border-white/5">
                <div className="mx-auto px-6 lg:px-8 max-w-7xl">
                    <h2 className="text-3xl font-bold text-white text-center mb-16">Trusted by the best</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="bg-slate-900 p-8 rounded-2xl border border-white/5 relative">
                                <div className="text-accent/30 text-6xl absolute top-4 left-4 font-serif">"</div>
                                <p className="text-slate-300 relative z-10 mb-6 leading-relaxed pt-4">
                                    {testimonial.quote}
                                </p>
                                <div className="flex items-center gap-4 border-t border-white/5 pt-6">
                                    <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center font-bold text-white text-sm">
                                        {testimonial.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-white text-sm">{testimonial.name}</p>
                                        <p className="text-slate-500 text-xs uppercase tracking-wide">{testimonial.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- FAQ SECTION --- */}
            <section id="faq" className="py-24 bg-slate-900">
                <div className="mx-auto px-6 lg:px-8 max-w-3xl">
                    <h2 className="text-3xl font-bold text-white text-center mb-12">FAQ</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-white/5 rounded-xl border border-white/5 overflow-hidden transition-colors hover:border-white/10"
                            >
                                <button
                                    className="w-full flex justify-between items-center p-6 text-left"
                                    onClick={() => toggleFaq(index)}
                                >
                                    <span className="font-medium text-white">{faq.question}</span>
                                    <FiArrowRight
                                        className={`text-slate-500 transform transition-transform duration-300 ${openFaqIndex === index ? 'rotate-90 text-accent' : ''
                                            }`}
                                    />
                                </button>
                                <div 
                                    className={`px-6 text-slate-400 overflow-hidden transition-all duration-300 ease-in-out ${openFaqIndex === index ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
                                >
                                    {faq.answer}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="bg-slate-950 border-t border-white/10 pt-20 pb-10">
                <div className="mx-auto px-6 lg:px-8 max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                        <div className="col-span-1 md:col-span-1">
                            <div className="text-2xl font-bold text-white mb-4">GymRatz</div>
                            <p className="text-slate-500 text-sm mb-6">
                                The operating system for modern combat sports academies.
                            </p>
                            <div className="flex space-x-4">
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition cursor-pointer">
                                    <FiInstagram size={20} />
                                </a>
                                <a href="https://www.youtube.com/@TechVaseegrah" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition cursor-pointer">
                                    <FiYoutube size={20} />
                                </a>
                                <a href="mailto:techvaseegrah@gmail.com" className="text-slate-500 hover:text-white transition cursor-pointer">
                                    <FiMail size={20} />
                                </a>
                            </div>
                        </div>
                        {/* Footer Links (simplified for layout) */}
                        <div>
                            <h4 className="text-white font-bold mb-6">Product</h4>
                            <ul className="space-y-3 text-sm text-slate-500">
                                <li className="hover:text-accent cursor-pointer transition">Features</li>
                                <li className="hover:text-accent cursor-pointer transition">Pricing</li>
                                <li className="hover:text-accent cursor-pointer transition">API</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-6">Company</h4>
                            <ul className="space-y-3 text-sm text-slate-500">
                                <li className="hover:text-accent cursor-pointer transition">About</li>
                                <li className="hover:text-accent cursor-pointer transition">Blog</li>
                                <li className="hover:text-accent cursor-pointer transition">Careers</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-6">Legal</h4>
                            <ul className="space-y-3 text-sm text-slate-500">
                                <li className="hover:text-accent cursor-pointer transition">Privacy</li>
                                <li className="hover:text-accent cursor-pointer transition">Terms</li>
                                <li className="hover:text-accent cursor-pointer transition">Security</li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-white/5 pt-8 text-center text-slate-600 text-sm">
                        <div className="flex flex-col md:flex-row justify-center items-center gap-2">
                            <span>&copy; {new Date().getFullYear()} GymRatz Inc. All rights reserved.</span>
                            <span className="hidden md:inline">•</span>
                            <span className="text-slate-500">Powered by <a href="https://www.youtube.com/@TechVaseegrah" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-white transition">Tech Vaseegrah</a></span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;