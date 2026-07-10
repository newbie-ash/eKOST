import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Home, BedDouble, Users, ReceiptText, LogOut, Menu, Activity, Wrench, TrendingDown } from 'lucide-react';
import ThemeToggle from '@/Components/ThemeToggle';
import { Toaster } from 'sonner';

export default function AdminLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { url } = usePage();
    const { auth } = usePage().props;
    const role = auth?.user?.role || 'penjaga';

    const navItems = role === 'pemilik' ? [
        { name: 'Laporan Keuangan', icon: Home, href: '/pemilik/dashboard', active: url?.startsWith('/pemilik/dashboard') },
        { name: 'Aset Kamar', icon: BedDouble, href: '/pemilik/kamar', active: url?.startsWith('/pemilik/kamar') },
        { name: 'Demografi Penghuni', icon: Users, href: '/pemilik/penghuni', active: url?.startsWith('/pemilik/penghuni') },
        { name: 'Laporan Okupansi', icon: ReceiptText, href: '/pemilik/sewa', active: url?.startsWith('/pemilik/sewa') },
        { name: 'Arus Kas', icon: ReceiptText, href: '/pemilik/tagihan', active: url?.startsWith('/pemilik/tagihan') },
        { name: 'Catatan Pengeluaran', icon: TrendingDown, href: '/pemilik/pengeluaran', active: url?.startsWith('/pemilik/pengeluaran') },
        { name: 'Riwayat Audit', icon: Activity, href: '/pemilik/activity-log', active: url?.startsWith('/pemilik/activity-log') },
    ] : [
        { name: 'Dashboard Operasional', icon: Home, href: '/dashboard', active: url?.startsWith('/dashboard') },
        { name: 'Manajemen Kamar', icon: BedDouble, href: '/admin/kamar', active: url?.startsWith('/admin/kamar') },
        { name: 'Data Penghuni', icon: Users, href: '/admin/penghuni', active: url?.startsWith('/admin/penghuni') },
        { name: 'Kelola Sewa', icon: ReceiptText, href: '/admin/sewa', active: url?.startsWith('/admin/sewa') },
        { name: 'Kelola Tagihan', icon: ReceiptText, href: '/admin/tagihan', active: url?.startsWith('/admin/tagihan') },
        { name: 'Laporan Kerusakan', icon: Wrench, href: '/admin/komplain', active: url?.startsWith('/admin/komplain') },
    ];

    return (
        <div className="min-h-screen bg-[#FDFBF7] dark:bg-slate-900 text-[#4A3B32] dark:text-white font-sans flex overflow-hidden transition-colors">
            <Toaster richColors position="top-right" />
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-[#372213]/40 z-40 md:hidden transition-opacity backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 border-r border-[#E8E0D5] dark:border-slate-700 shadow-sm
                transform transition-transform duration-300 ease-in-out
                md:translate-x-0 md:static md:flex-shrink-0
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="h-full flex flex-col">
                    {/* Brand Header */}
                    <div className="h-16 flex items-center px-6 border-b border-[#E8E0D5] dark:border-slate-700">
                        <div className="bg-[#FAF6F0] dark:bg-slate-700 p-2 rounded-lg mr-3">
                            <BedDouble className="w-6 h-6 text-[#8B5E3C] dark:text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-[#8B5E3C] dark:text-white tracking-tight">eKOS</h1>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                        {navItems.map((item) => (
                            <Link 
                                key={item.name} 
                                href={item.href}
                                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                                    item.active 
                                    ? 'bg-[#F5F0E6] dark:bg-slate-700 text-[#8B5E3C] dark:text-white font-semibold shadow-sm' 
                                    : 'text-[#7D6B5D] dark:text-white hover:bg-[#FAF6F0] dark:hover:bg-slate-700 hover:text-[#8B5E3C] dark:hover:text-white'
                                }`}
                            >
                                <item.icon className="w-5 h-5 mr-3" />
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Footer Actions */}
                    <div className="p-4 border-t border-[#E8E0D5] dark:border-slate-700 space-y-2">

                        <Link 
                            method="post" 
                            href="/logout" 
                            as="button" 
                            className="flex items-center w-full px-4 py-3 text-[#7D6B5D] dark:text-white hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-700 dark:hover:text-red-400 rounded-xl transition-colors"
                        >
                            <LogOut className="w-5 h-5 mr-3" />
                            Logout
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 h-screen">
                <header className="h-16 bg-white dark:bg-slate-800 border-b border-[#E8E0D5] dark:border-slate-700 flex items-center justify-between px-4 sm:px-6 shadow-sm z-30 transition-colors">
                    <div className="flex items-center">
                        <button 
                            className="md:hidden p-2 -ml-2 mr-2 text-[#8B5E3C] dark:text-white hover:bg-[#FAF6F0] dark:hover:bg-slate-700 rounded-lg"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <ThemeToggle />
                        <span className="text-sm font-medium text-[#7D6B5D] dark:text-white hidden sm:block">
                            Halo, {auth?.user?.name || (role === 'pemilik' ? 'Juragan' : 'Admin')}
                        </span>
                        <Link 
                            href={role === 'pemilik' ? '/pemilik/profile' : '/admin/profile'}
                            className="w-9 h-9 rounded-full bg-[#8B5E3C] text-[#FDFBF7] flex items-center justify-center font-bold shadow-sm hover:ring-2 hover:ring-[#8B5E3C] transition-all cursor-pointer overflow-hidden"
                        >
                            {auth?.user?.foto_profil ? (
                                <img src={`/storage/${auth.user.foto_profil}`} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                auth?.user?.name ? auth.user.name.charAt(0).toUpperCase() : (role === 'pemilik' ? 'J' : 'A')
                            )}
                        </Link>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
