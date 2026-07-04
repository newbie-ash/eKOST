import React, { Component } from 'react';
import { Head, Link } from '@inertiajs/react';
import { 
    BedDouble, Users, ReceiptText, 
    ArrowUpRight, ArrowDownRight, TrendingUp, AlertCircle, Plus, Wallet, Home, Sparkles
} from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return <div className="p-10 text-red-500 font-bold">Error: {this.state.error.message}</div>;
    }
    return this.props.children;
  }
}

export default function DashboardPenjaga(props) {
    return (
        <ErrorBoundary>
            <DashboardContent {...props} />
        </ErrorBoundary>
    );
}

function DashboardContent({ metrik, aktivitasTerbaru }) {
    const formatRupiah = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const occupancyRate = metrik.totalKamar > 0 
        ? Math.round((metrik.kamarTerisi / metrik.totalKamar) * 100) 
        : 0;

    return (
        <AdminLayout>
            <Head title="Dashboard Admin" />

            {/* Dashboard Header */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-[#8B5E3C] dark:text-white mb-2">Dashboard Operasional</h2>
                <p className="text-[#7D6B5D] dark:text-white dark:text-white">Ringkasan tugas harian dan pemantauan aktivitas kos.</p>
            </div>
            
            {metrik.sewaMenungguKonfirmasi > 0 && (
                <div className="mb-6 bg-orange-50 dark:bg-orange-900/40 border-l-4 border-orange-500 p-4 rounded-r-xl">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <AlertCircle className="h-5 w-5 text-orange-500" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-orange-800 dark:text-orange-200">
                                Tindakan Diperlukan
                            </h3>
                            <div className="mt-2 text-sm text-orange-700 dark:text-orange-300">
                                <p>Ada {metrik.sewaMenungguKonfirmasi} pengajuan sewa kamar yang menunggu konfirmasi Anda.</p>
                            </div>
                            <div className="mt-4">
                                <Link href="/admin/sewa" className="text-sm font-medium text-orange-800 dark:text-orange-200 hover:text-orange-900 underline">
                                    Lihat Pengajuan
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                
                {/* Total Kamar Card */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-[#E8E0D5] dark:border-slate-700 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-[#F5F0E6] dark:bg-slate-700 dark:bg-slate-700 rounded-xl group-hover:scale-110 transition-transform">
                            <Home className="w-6 h-6 text-[#8B5E3C] dark:text-white" />
                        </div>
                        <span className="flex items-center text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-lg">
                            {occupancyRate}% Terisi
                        </span>
                    </div>
                    <h3 className="text-[#7D6B5D] dark:text-white dark:text-white text-sm font-medium mb-1">Total Kamar</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">{metrik.totalKamar}</span>
                        <span className="text-sm text-gray-500 dark:text-white">kamar</span>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-white">
                        <span>{metrik.kamarTerisi} Terisi</span>
                        <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
                        <span>{metrik.kamarKosong} Kosong</span>
                    </div>
                </div>

                {/* Penghuni Aktif Card */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-[#E8E0D5] dark:border-slate-700 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-[#F5F0E6] dark:bg-slate-700 dark:bg-slate-700 rounded-xl group-hover:scale-110 transition-transform">
                            <Users className="w-6 h-6 text-[#8B5E3C] dark:text-white" />
                        </div>
                    </div>
                    <h3 className="text-[#7D6B5D] dark:text-white dark:text-white text-sm font-medium mb-1">Penghuni Aktif</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">{metrik.totalPenghuni}</span>
                        <span className="text-sm text-gray-500 dark:text-white">orang</span>
                    </div>
                    <div className="mt-4">
                        <Link href="/admin/penghuni" className="text-xs font-semibold text-[#8B5E3C] dark:text-white hover:underline flex items-center">
                            Kelola Penghuni <ArrowUpRight className="w-3 h-3 ml-1" />
                        </Link>
                    </div>
                </div>

                {/* Pemasukan Card */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-[#E8E0D5] dark:border-slate-700 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-xl group-hover:scale-110 transition-transform">
                            <Wallet className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                    <h3 className="text-[#7D6B5D] dark:text-white dark:text-white text-sm font-medium mb-1">Pemasukan Bulan Ini</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">{formatRupiah(metrik.pemasukanBulanIni)}</span>
                    </div>
                    <div className="mt-4">
                        <Link href="/admin/tagihan" className="text-xs font-semibold text-green-600 dark:text-green-400 hover:underline flex items-center">
                            Lihat Laporan <ArrowUpRight className="w-3 h-3 ml-1" />
                        </Link>
                    </div>
                </div>

                {/* Tagihan Menunggak Card */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-orange-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                    {metrik.tagihanMenunggak > 0 && (
                        <div className="absolute top-0 right-0 w-16 h-16 bg-orange-50 dark:bg-orange-900/20 rounded-bl-full -mr-8 -mt-8"></div>
                    )}
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-orange-50 dark:bg-orange-900/30 rounded-xl group-hover:scale-110 transition-transform">
                            <AlertCircle className="w-6 h-6 text-orange-500 dark:text-orange-400" />
                        </div>
                    </div>
                    <h3 className="text-[#7D6B5D] dark:text-white dark:text-white text-sm font-medium mb-1">Tagihan Belum Lunas</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-orange-600 dark:text-orange-400">{metrik.tagihanMenunggak}</span>
                        <span className="text-sm text-gray-500 dark:text-white">tagihan</span>
                    </div>
                    <div className="mt-4">
                        <Link href="/admin/tagihan" className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline flex items-center">
                            Kirim Pengingat <ArrowUpRight className="w-3 h-3 ml-1" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Recent Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Main Content Area (2/3 width) - Aktivitas Terbaru */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-[#E8E0D5] dark:border-slate-700 dark:border-slate-700 shadow-sm overflow-hidden transition-colors">
                    <div className="px-6 py-5 border-b border-[#E8E0D5] dark:border-slate-700 dark:border-slate-700 flex justify-between items-center">
                        <h3 className="font-bold text-gray-900 dark:text-white">Aktivitas Tagihan Terbaru</h3>
                        <Link href="/admin/tagihan" className="text-sm font-semibold text-[#8B5E3C] dark:text-white hover:underline">
                            Lihat Semua
                        </Link>
                    </div>
                    <div className="divide-y divide-[#E8E0D5] dark:divide-slate-700 dark:divide-slate-700">
                        {aktivitasTerbaru && aktivitasTerbaru.length > 0 ? (
                            aktivitasTerbaru.map((tagihan) => (
                                <div key={tagihan.id} className="p-6 hover:bg-[#FAF6F0] dark:hover:bg-slate-700 dark:hover:bg-cozy-brown-700/50 transition-colors flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-full ${tagihan.status_lunas ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'}`}>
                                            <ReceiptText className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                {tagihan.sewa?.penyewa?.user?.name || 'Unknown'} - Kamar {tagihan.sewa?.kamar?.nomor_kamar}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-slate-400">
                                                Bulan: {tagihan.bulan_tagihan}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gray-900 dark:text-white">{formatRupiah(tagihan.jumlah_bayar)}</p>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            tagihan.status_lunas ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                                        }`}>
                                            {tagihan.status_lunas ? 'Lunas' : 'Belum Lunas'}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-500 dark:text-slate-400">
                                <ReceiptText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                <p>Belum ada aktivitas tagihan.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar (1/3 width) - Quick Actions */}
                <div className="space-y-6">
                    <div className="bg-[#8B5E3C] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="font-bold text-lg mb-2">Tindakan Cepat</h3>
                            <p className="text-amber-100 text-sm mb-6">Kelola kos Anda dengan lebih efisien.</p>
                            
                            <div className="space-y-3">
                                <Link href="/admin/sewa" className="flex items-center justify-between w-full bg-white dark:bg-white/10 hover:bg-white/90 dark:hover:bg-white/20 p-3 rounded-xl backdrop-blur-sm transition-all border border-white/10 text-[#8B5E3C] dark:text-white">
                                    <span className="flex items-center text-sm font-medium"><Plus className="w-4 h-4 mr-2" /> Penempatan Baru</span>
                                    <ArrowUpRight className="w-4 h-4 opacity-50" />
                                </Link>
                                <Link href="/admin/tagihan" className="flex items-center justify-between w-full bg-white dark:bg-white/10 hover:bg-white/90 dark:hover:bg-white/20 p-3 rounded-xl backdrop-blur-sm transition-all border border-white/10 text-[#8B5E3C] dark:text-white">
                                    <span className="flex items-center text-sm font-medium"><ReceiptText className="w-4 h-4 mr-2" /> Buat Tagihan</span>
                                    <ArrowUpRight className="w-4 h-4 opacity-50" />
                                </Link>
                                <Link href="/admin/kamar" className="flex items-center justify-between w-full bg-white dark:bg-white/10 hover:bg-white/90 dark:hover:bg-white/20 p-3 rounded-xl backdrop-blur-sm transition-all border border-white/10 text-[#8B5E3C] dark:text-white">
                                    <span className="flex items-center text-sm font-medium"><BedDouble className="w-4 h-4 mr-2" /> Kelola Kamar</span>
                                    <ArrowUpRight className="w-4 h-4 opacity-50" />
                                </Link>
                            </div>
                        </div>
                        {/* Decorative background element */}
                        <Sparkles className="absolute -bottom-4 -right-4 w-32 h-32 text-amber-700/30" strokeWidth={1} />
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
}
