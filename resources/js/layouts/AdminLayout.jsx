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

    const mainNavItems = navItems.slice(0, 4);
    const moreNavItems = navItems.slice(4);

    return (
        <div className="min-h-screen bg-[#FDFBF7] dark:bg-slate-900 text-[#4A3B32] dark:text-white font-sans flex overflow-hidden transition-colors">
            <Toaster richColors position="top-right" />
            {/* Sidebar (Desktop Only) */}
            <aside className="hidden md:flex md:flex-col md:w-64 bg-white dark:bg-slate-800 border-r border-[#E8E0D5] dark:border-slate-700 shadow-sm">
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
                        <div className="md:hidden flex items-center bg-[#FAF6F0] dark:bg-slate-700 p-1.5 rounded-lg mr-2">
                            <BedDouble className="w-5 h-5 text-[#8B5E3C] dark:text-white" />
                        </div>
                        <h1 className="md:hidden text-lg font-bold text-[#8B5E3C] dark:text-white tracking-tight">eKOS</h1>
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

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">
                    {children}
                </main>
            </div>

            {/* Bottom Navigation for Mobile (Option B) */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-[#E8E0D5] dark:border-slate-700 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40 pb-safe">
                <div className="flex justify-around items-center h-[72px] px-2">
                    {mainNavItems.map((item) => {
                        const isActive = item.active;
                        return (
                            <Link 
                                key={item.name}
                                href={item.href}
                                className={`flex flex-col items-center justify-center space-y-1 w-full active:scale-95 transition-transform ${
                                    isActive 
                                    ? 'text-[#8B5E3C] dark:text-orange-400' 
                                    : 'text-gray-500 dark:text-slate-400'
                                }`}
                            >
                                <div className={`p-1.5 rounded-full ${isActive ? 'bg-[#F5F0E6] dark:bg-slate-700' : ''}`}>
                                    <item.icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                                </div>
                                <span className={`text-[9px] text-center leading-tight px-1 ${isActive ? 'font-bold' : 'font-medium'}`}>
                                    {item.name.replace('Laporan ', '').replace('Data ', '').replace('Manajemen ', '').replace('Kelola ', '')}
                                </span>
                            </Link>
                        );
                    })}
                    {/* More Button */}
                    <button 
                        onClick={() => setIsSidebarOpen(true)}
                        className="flex flex-col items-center justify-center space-y-1 w-full text-gray-500 dark:text-slate-400 active:scale-95 transition-transform"
                    >
                        <div className="p-1.5 rounded-full">
                            <Menu className="w-6 h-6 stroke-2" />
                        </div>
                        <span className="text-[9px] text-center leading-tight font-medium">
                            Lainnya
                        </span>
                    </button>
                </div>
            </nav>

            {/* Bottom Sheet for 'Lainnya' Menu */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-50 md:hidden transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                >
                    <div 
                        className="absolute bottom-0 left-0 right-0 bg-white dark:bg-slate-800 rounded-t-3xl p-6 pb-safe space-y-2 shadow-xl transform transition-transform duration-300 translate-y-0"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="w-12 h-1.5 bg-gray-300 dark:bg-slate-600 rounded-full mx-auto mb-4"></div>
                        <h3 className="text-sm font-bold text-gray-400 mb-2 px-2 uppercase tracking-wider">Menu Lainnya</h3>
                        <div className="space-y-1">
                            {moreNavItems.map(item => (
                                <Link 
                                    key={item.name}
                                    href={item.href}
                                    className="flex items-center px-4 py-3 rounded-xl text-[#7D6B5D] dark:text-white hover:bg-[#FAF6F0] dark:hover:bg-slate-700 transition-colors"
                                >
                                    <item.icon className="w-5 h-5 mr-3 text-gray-500" />
                                    <span className="font-medium text-sm">{item.name}</span>
                                </Link>
                            ))}
                            <div className="border-t border-gray-100 dark:border-slate-700 my-2"></div>
                            <Link 
                                method="post" 
                                href="/logout" 
                                as="button"
                                className="flex items-center px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                            >
                                <LogOut className="w-5 h-5 mr-3" />
                                <span className="font-medium text-sm">Logout</span>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
