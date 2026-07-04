import React from 'react';
import { 
    ReceiptText, LogOut, BedDouble, UserCircle2, Wrench
} from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';
import ThemeToggle from '@/Components/ThemeToggle';

// Simple, Elegant Top Navbar Layout for Tenants
export default function UserLayout({ children }) {
    const { url } = usePage();
    const { auth } = usePage().props;
    const userName = auth?.user?.name;

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
                        
                        {/* Navigation Links for User */}
                        <nav className="hidden md:flex ml-8 space-x-4">
                            <Link 
                                href="/tagihan-saya" 
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                    url?.startsWith('/tagihan-saya') 
                                    ? 'bg-cozy-brown-100 dark:bg-slate-700 text-cozy-brown-900 dark:text-white' 
                                    : 'text-cozy-brown-600 dark:text-slate-300 hover:bg-cozy-cream-100 dark:hover:bg-slate-700 hover:text-cozy-brown-900 dark:hover:text-white'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <ReceiptText className="w-4 h-4" /> Tagihan Saya
                                </div>
                            </Link>
                            <Link 
                                href="/pilih-kamar" 
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                    url?.startsWith('/pilih-kamar') 
                                    ? 'bg-cozy-brown-100 dark:bg-slate-700 text-cozy-brown-900 dark:text-white' 
                                    : 'text-cozy-brown-600 dark:text-slate-300 hover:bg-cozy-cream-100 dark:hover:bg-slate-700 hover:text-cozy-brown-900 dark:hover:text-white'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <BedDouble className="w-4 h-4" /> Pilih Kamar
                                </div>
                            </Link>
                            <Link 
                                href="/user/komplain" 
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                    url?.startsWith('/user/komplain') 
                                    ? 'bg-cozy-brown-100 dark:bg-slate-700 text-cozy-brown-900 dark:text-white' 
                                    : 'text-cozy-brown-600 dark:text-slate-300 hover:bg-cozy-cream-100 dark:hover:bg-slate-700 hover:text-cozy-brown-900 dark:hover:text-white'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <Wrench className="w-4 h-4" /> Laporan Kerusakan
                                </div>
                            </Link>
                            <Link 
                                href="/profile" 
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                    url?.startsWith('/profile') 
                                    ? 'bg-cozy-brown-100 dark:bg-slate-700 text-cozy-brown-900 dark:text-white' 
                                    : 'text-cozy-brown-600 dark:text-slate-300 hover:bg-cozy-cream-100 dark:hover:bg-slate-700 hover:text-cozy-brown-900 dark:hover:text-white'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <UserCircle2 className="w-4 h-4" /> Profil Saya
                                </div>
                            </Link>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-semibold text-cozy-brown-800 dark:text-slate-200 hidden sm:block">{userName || 'Penghuni Kos'}</span>
                            <div className="w-8 h-8 rounded-full bg-cozy-brown-500 dark:bg-cozy-brown-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                                {userName ? userName.charAt(0).toUpperCase() : 'U'}
                            </div>
                        </div>
                        
                        {/* Logout */}
                        <Link 
                            method="post" 
                            href="/logout" 
                            as="button" 
                            className="p-2 text-cozy-brown-400 dark:text-slate-400 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"
                            title="Keluar Aplikasi"
                        >
                            <LogOut className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Page Content */}
            <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
                {children}
            </main>
        </div>
    );
}
