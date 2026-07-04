import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { 
    ReceiptText, BedDouble, CheckCircle2, XCircle
} from 'lucide-react';

export default function Sewa({ sewas = [], summary }) {
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <AdminLayout>
            <Head title="Data Sewa & Okupansi" />

            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl">
                            <ReceiptText className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Data Sewa & Okupansi</h2>
                            <p className="text-sm text-gray-500 dark:text-slate-400">Pantau tingkat hunian dan masa kontrak penyewa Anda.</p>
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-500 dark:text-slate-400">Sewa Aktif</h3>
                            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg">
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">{summary.aktif}</div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-500 dark:text-slate-400">Kamar Terisi</h3>
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                                <BedDouble className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">{summary.terisi}</div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-500 dark:text-slate-400">Kamar Kosong</h3>
                            <div className="p-2 bg-red-50 dark:bg-red-900/30 rounded-lg">
                                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">{summary.kosong}</div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-700">
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Penyewa</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Kamar</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Durasi</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Tgl Masuk</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                                {sewas && sewas.length > 0 ? (
                                    sewas.map((sewa) => (
                                        <tr key={sewa.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900 dark:text-white">
                                                    {sewa.penyewa?.user?.name || 'Tidak diketahui'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                                Kamar {sewa.kamar?.nomor_kamar}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                                {sewa.durasi_bulan} Bulan
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                                {formatDate(sewa.tanggal_masuk)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium uppercase
                                                    ${sewa.status_sewa === 'Aktif' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' :
                                                      sewa.status_sewa === 'Selesai' ? 'bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-slate-200' :
                                                      'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'}
                                                `}>
                                                    {sewa.status_sewa}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500 dark:text-slate-400">
                                            Belum ada riwayat penyewaan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
