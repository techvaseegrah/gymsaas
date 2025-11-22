import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();
    // Role selection state is no longer needed
        // const [showRoleSelection, setShowRoleSelection] = useState(false);

    const plans = [
        {
            name: "Basic",
            price: "$29",
            period: "per month",
            features: [
                "Up to 50 fighters",
                "Basic attendance tracking",
                "Email support",
                "Mobile app access"
            ],
            popular: false
        },
        {
            name: "Pro",
            price: "$59",
            period: "per month",
            features: [
                "Up to 200 fighters",
                "Advanced analytics",
                "Priority support",
                "RFID integration",
                "Custom branding"
            ],
            popular: true
        },
        {
            name: "Enterprise",
            price: "$99",
            period: "per month",
            features: [
                "Unlimited fighters",
                "Advanced reporting",
                "24/7 dedicated support",
                "API access",
                "Custom integrations",
                "White-label solution"
            ],
            popular: false
        }
    ];

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleSignUpClick = () => {
        navigate('/signup');
    };

    // This function is no longer needed as we're redirecting directly to signup
    // const handleRoleSelect = (role) => {
    //     navigate('/login');
    //     setShowRoleSelection(false);
    // };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Header */}
            <header className="bg-gray-900 border-b border-gray-800">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-red-600 rounded-full"></div>
                        <span className="text-xl font-bold">GymLive</span>
                    </div>
                    
                    <div className="flex space-x-4">
                        <button 
                            onClick={handleLoginClick}
                            className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                        >
                            Login
                        </button>
                        <button 
                            onClick={handleSignUpClick}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
                
                // Role selection modal is no longer needed
                {/* {showRoleSelection && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                        <div className="bg-gray-800 rounded-xl p-8 w-full max-w-md relative">
                            <button
                                onClick={() => setShowRoleSelection(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                            >
                                ✕
                            </button>
                            
                            <h2 className="text-2xl font-bold mb-6 text-center">Select Your Role</h2>
                            
                            <div className="space-y-4">
                                <button
                                    onClick={() => handleRoleSelect('admin')}
                                    className="w-full bg-red-600 hover:bg-red-700 py-4 rounded-lg font-semibold transition-colors"
                                >
                                    Gym Owner / Admin
                                </button>
                                <button
                                    onClick={() => handleRoleSelect('trainer')}
                                    className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-lg font-semibold transition-colors"
                                >
                                    Trainer
                                </button>
                                <button
                                    onClick={() => handleRoleSelect('fighter')}
                                    className="w-full bg-green-600 hover:bg-green-700 py-4 rounded-lg font-semibold transition-colors"
                                >
                                    Fighter / Member
                                </button>
                            </div>
                        </div>
                    </div>
                )} */}
            </header>

            {/* Hero Section */}
            <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl font-bold mb-6">Manage Your Gym Smarter</h1>
                    <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                        All-in-one platform for gym management, attendance tracking, and fighter progress monitoring.
                    </p>
                    <div className="flex justify-center space-x-4">
                        <button 
                            onClick={handleSignUpClick}
                            className="px-8 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold text-lg transition-colors"
                        >
                            Get Started Free
                        </button>
                        <button className="px-8 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold text-lg transition-colors">
                            Schedule Demo
                        </button>
                    </div>
                </div>
            </section>

            {/* Plans Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-4">Simple, Transparent Pricing</h2>
                    <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
                        Choose the perfect plan for your gym. All plans include our core features with no hidden fees.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {plans.map((plan, index) => (
                            <div 
                                key={index}
                                className={`bg-gray-800 rounded-xl p-8 border ${
                                    plan.popular 
                                        ? 'border-red-500 relative transform scale-105' 
                                        : 'border-gray-700'
                                }`}
                            >
                                {plan.popular && (
                                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                                        MOST POPULAR
                                    </div>
                                )}
                                
                                <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                                <div className="mb-6">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    <span className="text-gray-400"> {plan.period}</span>
                                </div>
                                
                                <ul className="mb-8 space-y-3">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center">
                                            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                
                                <button 
                                    onClick={handleSignUpClick}
                                    className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                                        plan.popular 
                                            ? 'bg-red-600 hover:bg-red-700' 
                                            : 'bg-gray-700 hover:bg-gray-600'
                                    }`}
                                >
                                    Get Started
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gray-800">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-16">Powerful Features</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Attendance Tracking</h3>
                            <p className="text-gray-400">
                                Real-time attendance monitoring with RFID integration and manual check-in options.
                            </p>
                        </div>
                        
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Performance Analytics</h3>
                            <p className="text-gray-400">
                                Detailed progress reports and analytics to track fighter performance and gym metrics.
                            </p>
                        </div>
                        
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Member Management</h3>
                            <p className="text-gray-400">
                                Comprehensive member profiles, progress tracking, and communication tools.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 border-t border-gray-800 pt-16 pb-8">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div>
                            <div className="flex items-center space-x-2 mb-6">
                                <div className="w-8 h-8 bg-red-600 rounded-full"></div>
                                <span className="text-xl font-bold">GymLive</span>
                            </div>
                            <p className="text-gray-400 mb-6">
                                The ultimate gym management solution for modern fitness centers.
                            </p>
                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10 5.523 0 10-4.477 10-10 0-5.523-4.477-10-10-10zm-1.75 15c-.414 0-.75-.336-.75-.75v-7.5c0-.414.336-.75.75-.75s.75.336.75.75v7.5c0 .414-.336.75-.75.75zm3.5-7.5c-.414 0-.75-.336-.75-.75s.336-.75.75-.75.75.336.75.75-.336.75-.75.75zm-7.5 0c-.414 0-.75-.336-.75-.75s.336-.75.75-.75.75.336.75.75-.336.75-.75.75zm11.25 0c-.414 0-.75-.336-.75-.75s.336-.75.75-.75.75.336.75.75-.336.75-.75.75z"></path>
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-2.5L5 9l5-2.5L15 9v6l-5 2.5zm6.25-8.5c-.41 0-.75.34-.75.75s.34.75.75.75.75-.34.75-.75-.34-.75-.75-.75z"></path>
                                    </svg>
                                </a>
                            </div>
                        </div>
                        
                        <div>
                            <h4 className="text-lg font-semibold mb-6">Product</h4>
                            <ul className="space-y-3">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Integrations</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Roadmap</a></li>
                            </ul>
                        </div>
                        
                        <div>
                            <h4 className="text-lg font-semibold mb-6">Resources</h4>
                            <ul className="space-y-3">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API Status</a></li>
                            </ul>
                        </div>
                        
                        <div>
                            <h4 className="text-lg font-semibold mb-6">Company</h4>
                            <ul className="space-y-3">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Partners</a></li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className="pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
                        <p>© 2023 GymLive. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;