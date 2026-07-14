import React from 'react';
import { 
    ReceiptText, LogOut, BedDouble, Wrench
} from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';
import ThemeToggle from '@/Components/ThemeToggle';
import { Toaster } from 'sonner';

// Mobile-First, Elegant Navbar Layout for Tenants
export default function UserLayout({ children }) {
    const { url } = usePage();
    const { auth } = usePage().props;
    const userName = auth?.user?.name;

    const navLinks = [
        { name: 'Tagihan', href: '/tagihan-saya', icon: ReceiptText },
        { name: 'Kamar', href: '/pilih-kamar', icon: BedDouble },
        { name: 'Komplain', href: '/user/komplain', icon: Wrench },
    ];

    return (
        <div className="min-h-screen bg-cozy-cream-50 dark:bg-slate-900 text-cozy-brown-900 dark:text-white font-sans flex flex-col transition-colors duration-200">
            <Toaster richColors position="top-right" />
            
            {/* Top Navigation Bar (Desktop & Mobile Header) */}
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
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors active:scale-95 ${
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
                            <Link 
                                href="/profile"
                                className="w-8 h-8 rounded-full bg-cozy-brown-500 dark:bg-cozy-brown-600 text-white flex items-center justify-center font-bold text-sm shadow-sm hover:ring-2 hover:ring-cozy-brown-500 active:scale-95 transition-all cursor-pointer overflow-hidden"
                            >
                                {auth?.user?.foto_profil ? (
                                    <img src={`/storage/${auth.user.foto_profil}`} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    userName ? userName.charAt(0).toUpperCase() : 'U'
                                )}
                            </Link>
                        </div>
                        
                        {/* Logout Desktop */}
                        <Link 
                            method="post" 
                            href="/logout" 
                            as="button" 
                            className="p-2 hidden md:block text-cozy-brown-400 dark:text-slate-400 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg active:scale-95 transition"
                            title="Logout"
                        >
                            <LogOut className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Page Content - Added pb-24 for mobile bottom nav spacing */}
            <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">
                {children}
            </main>

            {/* Bottom Navigation for Mobile */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-cozy-cream-200 dark:border-slate-700 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40 pb-safe">
                <div className="flex justify-around items-center h-16">
                    {navLinks.map((link) => {
                        const isActive = url?.startsWith(link.href);
                        return (
                            <Link 
                                key={link.name}
                                href={link.href}
                                className={`flex flex-col items-center justify-center w-full h-full space-y-1 active:scale-95 transition-transform ${
                                    isActive 
                                    ? 'text-cozy-brown-600 dark:text-orange-400' 
                                    : 'text-gray-500 dark:text-slate-400'
                                }`}
                            >
                                <div className={`p-1 rounded-full ${isActive ? 'bg-cozy-brown-50 dark:bg-slate-700' : ''}`}>
                                    <link.icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                                </div>
                                <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>
                                    {link.name}
                                </span>
                            </Link>
                        );
                    })}
                    {/* Logout Button on Mobile Nav */}
                    <Link 
                        method="post" 
                        href="/logout"
                        as="button"
                        className="flex flex-col items-center justify-center w-full h-full space-y-1 text-gray-500 dark:text-slate-400 active:scale-95 transition-transform"
                    >
                        <div className="p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500">
                            <LogOut className="w-6 h-6 stroke-2" />
                        </div>
                        <span className="text-[10px] font-medium">
                            Logout
                        </span>
                    </Link>
                </div>
            </nav>
        </div>
    );
}
