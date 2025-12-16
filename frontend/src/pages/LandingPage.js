import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { default as api, publicApi } from '../api/api';
import {
    FiMenu, FiX, FiArrowRight, FiTrendingUp, FiCheckCircle, FiPlayCircle,
    FiInstagram, FiYoutube, FiMail, FiCamera, FiDollarSign, FiMessageSquare, FiStar
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

// --- UPDATED PRICING TIERS ---
const pricingTiers = [
    {
        name: 'Free Trial',
        price: '₹0',
        cadence: 'for 10 days', // 10 Days Text
        description: 'Experience the full power of Enterprise risk-free.',
        features: [
            'Unlimited Fighters',
            'Full AI Face Recognition',
            'GPS Location Tracking',
            'Doubt Chat Access',
            'No Credit Card Required'
        ],
        cta: 'Start Free Trial',
        link: '/signup?plan=trial',
        highlight: false,
        color: 'green'
    },
    {
        name: 'Base Plan',
        price: '₹999',
        cadence: 'per month',
        description: 'Essential management for growing academies.',
        features: [
            'Up to 75 Fighters',
            'RFID Attendance',
            'Manual Attendance',
            'Doubt Chat Access',
            'Basic Reports'
        ],
        cta: 'Choose Base',
        link: '/signup?plan=basic',
        highlight: false,
        color: 'blue'
    },
    {
        name: 'Enterprise',
        price: '₹1,999',
        cadence: 'per month',
        description: 'Full automation with AI & GPS tracking.',
        features: [
            'Unlimited Fighters',
            'AI Face Recognition',
            'GPS Location Attendance',
            'Priority Support',
            'Everything in Base'
        ],
        cta: 'Go Enterprise',
        link: '/signup?plan=enterprise',
        highlight: true,
        color: 'purple'
    }
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
    
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        email: '',
        phone: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const templates = [
        "I'd like to book a demo.",
        "Question about Enterprise pricing.",
        "Need help migrating from another tool.",
        "Do you support custom API access?"
    ];

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTemplateClick = (text) => {
        setFormData(prev => ({ ...prev, message: text }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.phone) {
            // More flexible phone number validation
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
                setSubmitError('Please enter a valid phone number (up to 15 digits, optional + prefix)');
                return;
            }
        }
        setIsSubmitting(true);
        setSubmitError('');
        setSubmitSuccess(false);
        try {
            await publicApi.post('/contact', formData);
            setFormData({ name: '', company: '', email: '', phone: '', message: '' });
            setSubmitSuccess(true);
            setTimeout(() => setSubmitSuccess(false), 5000);
        } catch (error) {
            setSubmitError('Failed to send message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <div className="bg-slate-950 text-slate-300 min-h-screen relative font-sans selection:bg-accent selection:text-white">
            
            <header className="fixed top-0 w-full z-40 bg-slate-950/80 backdrop-blur-md border-b border-white/5 transition-all duration-300">
                <div className="mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
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
                        <Link to="/login" className="text-white hover:text-accent transition font-medium">Login</Link>
                        <Link to="/signup" className="bg-accent hover:bg-blue-600 text-white px-5 py-2 rounded-lg transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] font-semibold">Get Started</Link>
                    </nav>
                    <button className="lg:hidden text-white text-2xl" onClick={() => setMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <FiX /> : <FiMenu />}
                    </button>
                </div>
                <div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-accent to-purple-500 z-50 transition-all duration-150 ease-out" style={{ width: `${scrollProgress * 100}%` }} />
                
                {isMenuOpen && (
                    <div className="lg:hidden px-6 pb-8 pt-4 bg-slate-900 border-b border-white/10 animate-fade-in absolute w-full left-0">
                        {navItems.map((item) => (
                            <button key={item.target} onClick={() => handleNavClick(item.target)} className="block w-full text-left py-4 text-lg font-medium text-slate-300 border-b border-white/5 last:border-none hover:text-white">
                                {item.label}
                            </button>
                        ))}
                        <div className="flex flex-col gap-4 pt-6">
                            <Link to="/login" className="w-full text-center py-3 rounded-lg border border-white/10 text-white font-semibold hover:bg-white/5 transition">Login</Link>
                            <Link to="/signup" className="w-full text-center py-3 rounded-lg bg-accent text-white font-semibold shadow-lg shadow-accent/20">Get Started</Link>
                        </div>
                    </div>
                )}
            </header>

            <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
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
                            <Link to="/signup" className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-accent hover:bg-blue-600 text-white font-semibold px-8 py-4 rounded-lg transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] hover:-translate-y-1">
                                <span>Start Free Trial</span>
                                <FiArrowRight />
                            </Link>
                            <button onClick={() => handleNavClick('demo')} className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-8 py-4 rounded-lg backdrop-blur-sm transition">
                                <FiPlayCircle className="text-xl" />
                                <span>Watch Demo</span>
                            </button>
                        </div>
                    </div>
                    
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

            <section id="features" className="py-24 bg-slate-900 relative overflow-hidden">
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
                                <div key={index} className="group p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/1 border border-white/10 hover:from-white/10 hover:to-white/5 hover:border-white/20 transition-all duration-500 transform hover:-translate-y-3 hover:shadow-2xl backdrop-blur-sm">
                                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-accent/20 to-purple-500/20 border border-accent/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-accent/10">
                                        <Icon className="text-accent text-2xl group-hover:text-white transition-colors duration-300 drop-shadow-lg" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-accent group-hover:to-purple-400 transition-all duration-300">
                                        {feature.title}
                                    </h3>
                                    <p className="text-slate-400 leading-relaxed mb-6">
                                        {feature.description}
                                    </p>
                                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                                        <div className="w-full h-1 bg-gradient-to-r from-accent to-purple-500 rounded-full"></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

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
                                            <div className="absolute bottom-0 left-0 w-full bg-accent group-hover:bg-blue-400 transition-all duration-500" style={{ height: `${h}%` }} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="pricing" className="py-24 bg-slate-900">
                <div className="mx-auto px-6 lg:px-8 max-w-7xl">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                            Simple, transparent pricing
                        </h2>
                        <p className="text-lg text-slate-400">
                            Start with a free trial. No hidden fees. Upgrade anytime.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {pricingTiers.map((tier, index) => (
                            <div key={index} className={`relative rounded-2xl p-8 border transition-all duration-300 flex flex-col ${
                                tier.highlight 
                                ? 'bg-white/5 border-accent shadow-2xl shadow-accent/10 scale-105 z-10' 
                                : 'bg-slate-950/50 border-white/5 hover:border-white/10'
                            }`}>
                                {tier.highlight && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-accent text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg">Most Popular</div>
                                )}
                                <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                                <div className="mb-6">
                                    <span className="text-4xl font-bold text-white">{tier.price}</span>
                                    {tier.cadence && <span className="text-slate-500 text-sm"> / {tier.cadence}</span>}
                                </div>
                                <p className="text-slate-400 mb-8 h-12 text-sm leading-relaxed">{tier.description}</p>
                                <ul className="space-y-4 mb-8 flex-grow">
                                    {tier.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start">
                                            <FiCheckCircle className={`mt-1 mr-3 flex-shrink-0 ${tier.highlight ? 'text-accent' : 'text-slate-600'}`} />
                                            <span className="text-slate-300 text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Link to={tier.link} className={`block w-full py-3 rounded-lg font-bold text-center transition-all ${
                                    tier.highlight 
                                    ? 'bg-accent hover:bg-blue-600 text-white shadow-lg shadow-accent/25' 
                                    : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                                }`}>
                                    {tier.cta}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

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

            <section className="py-24 bg-slate-950 relative overflow-hidden">
                <div className="absolute -left-20 top-20 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute -right-20 bottom-20 w-96 h-96 bg-accent/10 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="mx-auto px-6 lg:px-8 max-w-7xl relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-10">
                            <div>
                                <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                                    Let’s build your <br/>
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-400">legacy.</span>
                                </h2>
                                <p className="text-lg text-slate-400 leading-relaxed">
                                    Every gym is unique. Whether you are running a boutique dojo or a franchise empire, tell us your needs and we will customize the GymRatz OS for you.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {['24/7 Priority Support', 'Secure Data Migration', 'Custom Branding', 'On-Site Setup'].map((item, i) => (
                                    <div key={i} className="flex items-center space-x-3 text-slate-300">
                                        <FiCheckCircle className="text-accent" />
                                        <span className="text-sm font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 lg:p-10 shadow-[0_0_40px_rgba(0,0,0,0.3)] relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-purple-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition duration-700"></div>
                            
                            <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Company</label>
                                        <input
                                            type="text"
                                            name="company"
                                            className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                            placeholder="Dojo Name"
                                            value={formData.company}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                            placeholder="john@example.com"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Phone</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                            placeholder="+91 999..."
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Message</label>
                                        <span className="text-[10px] text-slate-500">Quick Templates:</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {templates.map((t, i) => (
                                            <button
                                                key={i}
                                                type="button"
                                                onClick={() => handleTemplateClick(t)}
                                                className="text-[10px] px-3 py-1 rounded-full bg-white/5 hover:bg-accent/20 border border-white/10 hover:border-accent/30 text-slate-300 hover:text-white transition-all cursor-pointer"
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                    <textarea
                                        name="message"
                                        rows={4}
                                        className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all resize-none"
                                        placeholder="How can we help you dominate your market?"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        required
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-accent to-blue-600 hover:to-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span>Sending Request...</span>
                                        </div>
                                    ) : (
                                        'Send Request'
                                    )}
                                </button>

                                {submitSuccess && (
                                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3 animate-fade-in">
                                        <FiCheckCircle className="text-green-400" />
                                        <p className="text-green-400 text-sm font-medium">Message received! We'll text you shortly.</p>
                                    </div>
                                )}
                                {submitError && (
                                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium text-center animate-fade-in">
                                        {submitError}
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="bg-slate-950 border-t border-white/10 pt-20 pb-10">
                <div className="mx-auto px-6 lg:px-8 max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                        <div className="col-span-1 md:col-span-1">
                            <div className="text-2xl font-bold text-white mb-4">GymRatz</div>
                            <p className="text-slate-500 text-sm mb-6">
                                The operating system for modern combat sports academies.
                            </p>
                            <div className="flex space-x-4">
                                <a href="https://www.instagram.com/techvaseegrah?igsh=MWpuMTkwcTIzOGJrMQ==" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition cursor-pointer">
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