import React, { useState } from 'react';
import { 
    ReceiptText, LogOut, BedDouble, UserCircle2, Wrench, Menu, X
} from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';
import ThemeToggle from '@/Components/ThemeToggle';

// Simple, Elegant Top Navbar Layout for Tenants
export default function UserLayout({ children }) {
    const { url } = usePage();
    const { auth } = usePage().props;
    const userName = auth?.user?.name;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { name: 'Tagihan Saya', href: '/tagihan-saya', icon: ReceiptText },
        { name: 'Pilih Kamar', href: '/pilih-kamar', icon: BedDouble },
        { name: 'Laporan Kerusakan', href: '/user/komplain', icon: Wrench },
        { name: 'Profil Saya', href: '/profile', icon: UserCircle2 },
    ];

    return (
        <div className="min-h-screen bg-cozy-cream-50 dark:bg-slate-900 text-cozy-brown-900 dark:text-white font-sans flex flex-col transition-colors duration-200">
            {/* Top Navigation Bar */}
            <header className="h-16 bg-white dark:bg-slate-800 border-b border-cozy-cream-200 dark:border-slate-700 shadow-sm z-30 sticky top-0 transition-colors duration-200">
                <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-cozy-cream-100 dark:bg-slate-700 p-2 rounded-lg">
                            <ReceiptText className="w-5 h-5 text-cozy-brown-500 dark:text-slate-200" />
                        </div>
                        <span className="text-xl font-bold text-cozy-brown-500 dark:text-slate-200 tracking-tight">eKOS</span>
                        
                        {/* Navigation Links for Desktop */}
                        <nav className="hidden md:flex ml-8 space-x-4">
                            {navLinks.map((link) => (
                                <Link 
                                    key={link.name}
                                    href={link.href} 
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                        url?.startsWith(link.href) 
                                        ? 'bg-cozy-brown-100 dark:bg-slate-700 text-cozy-brown-900 dark:text-white' 
                                        : 'text-cozy-brown-600 dark:text-slate-300 hover:bg-cozy-cream-100 dark:hover:bg-slate-700 hover:text-cozy-brown-900 dark:hover:text-white'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <link.icon className="w-4 h-4" /> {link.name}
                                    </div>
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <ThemeToggle />
                        <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-semibold text-cozy-brown-800 dark:text-slate-200 hidden sm:block">{userName || 'Penghuni Kos'}</span>
                            <div className="w-8 h-8 rounded-full bg-cozy-brown-500 dark:bg-cozy-brown-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                                {userName ? userName.charAt(0).toUpperCase() : 'U'}
                            </div>
                        </div>
                        
                        {/* Logout Desktop */}
                        <Link 
                            method="post" 
                            href="/logout" 
                            as="button" 
                            className="p-2 hidden md:block text-cozy-brown-400 dark:text-slate-400 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"
                            title="Keluar Aplikasi"
                        >
                            <LogOut className="w-4 h-4" />
                        </Link>

                        {/* Hamburger Button (Mobile) */}
                        <button 
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 md:hidden text-cozy-brown-600 dark:text-slate-300 hover:bg-cozy-cream-100 dark:hover:bg-slate-700 rounded-lg transition"
                        >
                            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Dropdown */}
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute w-full left-0 top-16 bg-white dark:bg-slate-800 border-b border-cozy-cream-200 dark:border-slate-700 shadow-lg px-4 py-4 space-y-2 z-40">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.name}
                                href={link.href} 
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                                    url?.startsWith(link.href) 
                                    ? 'bg-cozy-brown-100 dark:bg-slate-700 text-cozy-brown-900 dark:text-white' 
                                    : 'text-cozy-brown-600 dark:text-slate-300 hover:bg-cozy-cream-50 dark:hover:bg-slate-700/50'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <link.icon className="w-5 h-5" /> {link.name}
                                </div>
                            </Link>
                        ))}
                        <div className="pt-2 mt-2 border-t border-cozy-cream-100 dark:border-slate-700">
                            <Link 
                                method="post" 
                                href="/logout" 
                                as="button" 
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                                <LogOut className="w-5 h-5" /> Keluar Aplikasi
                            </Link>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Page Content */}
            <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
                {children}
            </main>
        </div>
    );
}
