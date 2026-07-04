import { BedDouble } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { useEffect } from 'react';

export default function GuestLayout({ children }) {
    useEffect(() => {
        // Force light mode on auth pages
        document.documentElement.classList.remove('dark');
    }, []);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-cozy-cream-50 px-4 py-8 relative overflow-hidden transition-colors duration-200">
            {/* Background Warm Cozy Blur Orbs */}
            <div className="absolute -left-20 -top-20 w-80 h-80 bg-cozy-cream-200 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-cozy-cream-200 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

            <div className="z-10 w-full max-w-md flex flex-col items-center space-y-6">
                {/* Logo and Brand Header */}
                <div className="flex flex-col items-center space-y-2">
                    <Link href="/" className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-cozy-cream-200 shadow-sm hover:shadow transition-shadow">
                        <BedDouble className="w-8 h-8 text-cozy-brown-500" />
                        <span className="text-3xl font-extrabold text-cozy-brown-500 tracking-tight">eKOS</span>
                    </Link>
                    <p className="text-xs text-cozy-brown-400 font-medium">Aplikasi Manajemen Kos-kosan Modern</p>
                </div>

                {/* Main Card Container */}
                <div className="w-full bg-white px-8 py-8 border border-cozy-cream-200 shadow-lg shadow-cozy-brown-500/5 rounded-3xl z-10 transition-all duration-300">
                    {children}
                </div>
            </div>
        </div>
    );
}
