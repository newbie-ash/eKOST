import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { 
    BedDouble, ShieldCheck, AlertCircle, Wrench
} from 'lucide-react';

export default function Kamar({ kamars = [], summary }) {
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    };

    return (
        <AdminLayout>
            <Head title="Aset Kamar" />

            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl">
                            <BedDouble className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Aset Kamar Properti</h2>
                            <p className="text-sm text-gray-500 dark:text-slate-400">Tinjau nilai aset, kapasitas, dan potensi penghasilan per bulan.</p>
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">Total Kapasitas</h3>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary.total} <span className="text-sm font-normal text-gray-400">Kamar</span></p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 shadow-sm">
                        <h3 className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-1">Terisi</h3>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary.terisi} <span className="text-sm font-normal text-gray-400">Kamar</span></p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-orange-100 dark:border-orange-900/30 shadow-sm">
                        <h3 className="text-sm font-medium text-orange-600 dark:text-orange-400 mb-1">Tersedia</h3>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary.kosong} <span className="text-sm font-normal text-gray-400">Kamar</span></p>
                    </div>
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 sm:p-5 rounded-2xl border border-indigo-100 dark:border-indigo-800 shadow-sm">
                        <h3 className="text-xs sm:text-sm font-medium text-indigo-800 dark:text-indigo-300 mb-1 leading-tight">Potensi Omzet</h3>
                        <p className="text-base sm:text-xl font-bold text-indigo-900 dark:text-indigo-200 tracking-tight truncate">{formatRupiah(summary.potensi_pendapatan)}<span className="text-[10px] sm:text-sm font-normal text-indigo-600/70 dark:text-indigo-400/70 ml-1">/bln</span></p>
                    </div>
                </div>

                {/* Grid Kamar */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {kamars && kamars.length > 0 ? (
                        kamars.map((kamar) => (
                            <div key={kamar.id} className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 bg-gray-50 dark:bg-slate-700/50 rounded-2xl flex items-center justify-center border border-gray-100 dark:border-slate-600">
                                            <BedDouble className="w-6 h-6 text-gray-400" />
                                        </div>
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border
                                            ${kamar.status === 'terisi' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' :
                                              kamar.status === 'kosong' ? 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800' :
                                              'bg-gray-50 text-gray-700 dark:text-white border-gray-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'}
                                        `}>
                                            {kamar.status === 'terisi' && <ShieldCheck className="w-3 h-3 mr-1" />}
                                            {kamar.status === 'kosong' && <AlertCircle className="w-3 h-3 mr-1" />}
                                            {kamar.status === 'perawatan' && <Wrench className="w-3 h-3 mr-1" />}
                                            <span className="capitalize">{kamar.status}</span>
                                        </span>
                                    </div>
                                    
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Kamar {kamar.nomor_kamar}</h3>
                                        <p className="text-sm font-medium text-gray-500 dark:text-slate-400 mb-4">{kamar.tipe_kamar}</p>
                                        
                                        <div className="pt-4 border-t border-gray-100 dark:border-slate-700">
                                            <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider font-semibold mb-1">Harga Sewa</p>
                                            <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{formatRupiah(kamar.harga)}<span className="text-sm font-normal text-gray-400 dark:text-slate-500">/bln</span></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full bg-white dark:bg-slate-800 p-12 rounded-3xl border border-gray-100 dark:border-slate-700 text-center">
                            <BedDouble className="w-12 h-12 text-gray-300 dark:text-gray-600 dark:text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Belum ada data kamar</h3>
                            <p className="text-gray-500 dark:text-slate-400 mt-2">Minta admin untuk menambahkan data kamar terlebih dahulu.</p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
