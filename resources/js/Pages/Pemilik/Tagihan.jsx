import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { 
    Wallet, TrendingUp, TrendingDown, Receipt
} from 'lucide-react';

export default function Tagihan({ tagihans = [], summary }) {
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    };

    return (
        <AdminLayout>
            <Head title="Laporan Arus Kas" />

            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-2xl">
                            <Wallet className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Laporan Arus Kas</h2>
                            <p className="text-sm text-gray-500 dark:text-slate-400">Pantau pergerakan uang masuk dan tunggakan yang belum dilunasi.</p>
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-500 dark:text-slate-400">Total Pendapatan (Lunas)</h3>
                            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                            {formatRupiah(summary.pemasukan)}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-500 dark:text-slate-400">Total Piutang (Belum Lunas)</h3>
                            <div className="p-2 bg-red-50 dark:bg-red-900/30 rounded-lg">
                                <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                            {formatRupiah(summary.piutang)}
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-slate-700">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Receipt className="w-5 h-5 text-gray-400" />
                            Rincian Transaksi
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-700">
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Penghuni / Kamar</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Periode Tagihan</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Nominal</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                                {tagihans && tagihans.length > 0 ? (
                                    tagihans.map((tagihan) => (
                                        <tr key={tagihan.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900 dark:text-white">
                                                    {tagihan.sewa?.penyewa?.user?.name || 'Tidak diketahui'}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-slate-400">
                                                    Kamar {tagihan.sewa?.kamar?.nomor_kamar}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                                {tagihan.bulan_tagihan}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                                {formatRupiah(tagihan.jumlah_bayar)}
                                            </td>
                                            <td className="px-6 py-4">
                                                {tagihan.status_lunas ? (
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 uppercase">
                                                        Lunas
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 uppercase">
                                                        Belum Lunas
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-gray-500 dark:text-slate-400">
                                            Belum ada data tagihan.
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
