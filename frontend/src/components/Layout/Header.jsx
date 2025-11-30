import React from 'react';

const Header = () => {
    // Navigation items (can be managed by state/props in a real app)
    const navItems = [
        { name: 'Features', href: '#features' },
        { name: 'Pricing', href: '#pricing' },
        { name: 'Integrations', href: '#integrations' },
        { name: 'Documentation', href: '#docs' },
    ];

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            {/* Reduced vertical padding to make it thinner */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Reduced height class from h-20 to h-16 and adjusted items-center */}
                <div className="flex justify-between items-center h-16"> 
                    
                    {/* --- Logo/Branding --- */}
                    <div className="shirink-0">
                        <a href="/" className="flex items-center space-x-2">
                            {/* Slightly reduced font sizes for a more compact look */}
                            <span className="text-2xl text-indigo-700 font-extrabold">DF</span>
                            <span className="text-xl font-bold text-gray-800">Pro</span>
                        </a>
                    </div>

                    {/* --- Desktop Navigation --- */}
                    {/* Used py-0 (padding vertical 0) for navigation links to sit neatly in the thinner bar */}
                    <nav className="hidden md:flex space-x-6"> 
                        {navItems.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className="text-gray-600 hover:text-cyan-600 font-medium transition duration-150 ease-in-out py-0"
                            >
                                {item.name}
                            </a>
                        ))}
                    </nav>

                    {/* --- Call to Action Button --- */}
                    <div className="hidden md:block">
                        {/* Reduced button padding */}
                        <button
                            className="inline-flex items-center justify-center px-4 py-1.5 border border-transparent text-sm font-semibold rounded-lg shadow-md text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Start Free Trial
                        </button>
                    </div>

                    {/* --- Mobile Menu Button --- */}
                    <div className="md:hidden">
                        <button
                            type="button"
                            className="bg-gray-100 p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                            aria-expanded="false"
                        >
                            {/* SVG for Menu Icon */}
                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>

                </div>
            </div>
        </header>
    );
};

export default Header;