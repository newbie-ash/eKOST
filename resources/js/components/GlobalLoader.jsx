import React, { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import { BedDouble } from 'lucide-react';

export default function GlobalLoader() {
    const [loading, setLoading] = useState(false);

    const timeoutIdRef = React.useRef(null);

    useEffect(() => {
        const removeStart = router.on('start', () => {
            if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
            timeoutIdRef.current = setTimeout(() => setLoading(true), 250);
        });
        
        const removeFinish = router.on('finish', () => {
            if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
            setLoading(false);
        });

        const removeException = router.on('exception', () => {
            if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
            setLoading(false);
        });

        return () => {
            removeStart();
            removeFinish();
            removeException();
            if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
        };
    }, []);

    if (!loading) return null;

    return (
        <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300">
            <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl flex flex-col items-center border border-gray-200 dark:border-slate-700 scale-100 animate-in zoom-in-95 duration-200">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-amber-100 dark:border-slate-700 rounded-full"></div>
                    <div className="w-16 h-16 border-4 border-[#8B5E3C] dark:border-amber-500 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <BedDouble className="w-6 h-6 text-[#8B5E3C] dark:text-amber-500 animate-pulse" />
                    </div>
                </div>
                <h3 className="mt-4 font-bold text-gray-800 dark:text-gray-200">Memuat data...</h3>
            </div>
        </div>
    );
}
