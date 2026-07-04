import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    Users, Search, ShieldAlert, Mail, Phone, MessageSquare
} from 'lucide-react';

export default function Penghuni({ penghunis = [] }) {
    const [searchTerm, setSearchTerm] = useState('');

    const getWhatsAppUrl = (phone) => {
        if (!phone) return '#';
        let cleaned = phone.replace(/[^0-9]/g, '');
        if (cleaned.startsWith('0')) {
            cleaned = '62' + cleaned.slice(1);
        }
        return `https://wa.me/${cleaned}`;
    };

    const filteredPenghunis = penghunis.filter((penghuni) => {
        const query = (searchTerm || '').toLowerCase();
        const safeIncludes = (val) => val ? String(val).toLowerCase().includes(query) : false;
        
        return (
            safeIncludes(penghuni.user?.name) ||
            safeIncludes(penghuni.nomor_ktp) ||
            safeIncludes(penghuni.kontak_darurat) ||
            safeIncludes(penghuni.user?.email)
        );
    });

    return (
        <AdminLayout>
            <Head title="Demografi Penghuni" />

            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-2xl">
                            <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Demografi Penghuni</h2>
                            <p className="text-sm text-gray-500 dark:text-slate-400">Pantau loyalitas dan data demografis penghuni Anda (Read-Only).</p>
                        </div>
                    </div>
                </div>

                {/* Filter and Search Action bar */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
                    <div className="relative w-full sm:flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari berdasarkan nama, NIK, atau email..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/35 focus:border-blue-500 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Data Grid / Cards */}
                {filteredPenghunis.length === 0 ? (
                    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 p-12 flex flex-col items-center justify-center text-center shadow-sm">
                        <div className="bg-gray-50 dark:bg-slate-900 w-24 h-24 rounded-full flex items-center justify-center mb-6">
                            <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 dark:text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Belum ada data penghuni.</h3>
                        <p className="text-gray-500 dark:text-slate-400 max-w-md">Data penghuni akan muncul di sini ketika ada penyewa yang mendaftar.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPenghunis.map((penghuni) => (
                            <div key={penghuni.id} className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow group relative">
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-lg font-bold">
                                                {penghuni.user?.name ? penghuni.user.name.charAt(0).toUpperCase() : '?'}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1">{penghuni.user?.name}</h3>
                                                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{penghuni.pekerjaan || 'Belum diatur'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-3 mt-6 pt-6 border-t border-gray-100 dark:border-slate-700">
                                        <div className="flex items-center text-sm">
                                            <Mail className="w-4 h-4 text-gray-400 mr-3 shrink-0" />
                                            <span className="text-gray-600 dark:text-gray-300 truncate">{penghuni.user?.email}</span>
                                        </div>
                                        <div className="flex items-center text-sm">
                                            <ShieldAlert className="w-4 h-4 text-gray-400 mr-3 shrink-0" />
                                            <span className="text-gray-600 dark:text-gray-300 truncate font-mono">NIK: {penghuni.nomor_ktp || 'Belum diisi'}</span>
                                        </div>
                                        <div className="flex items-center text-sm">
                                            <Phone className="w-4 h-4 text-gray-400 mr-3 shrink-0" />
                                            <span className="text-gray-600 dark:text-gray-300">Darurat: {penghuni.kontak_darurat || 'Belum diatur'}</span>
                                        </div>
                                    </div>

                                    {/* Action row */}
                                    {penghuni.kontak_darurat && (
                                        <div className="mt-6 flex justify-end">
                                            <a 
                                                href={getWhatsAppUrl(penghuni.kontak_darurat)} 
                                                target="_blank" 
                                                rel="noreferrer"
                                                className="inline-flex items-center px-4 py-2 text-sm bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-lg transition-colors font-medium"
                                            >
                                                <MessageSquare className="w-4 h-4 mr-2" />
                                                Hubungi Darurat
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}