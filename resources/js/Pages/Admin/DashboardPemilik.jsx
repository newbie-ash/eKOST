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

export default function DashboardPemilik(props) {
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
            <Head title="Dashboard Pemilik" />

            {/* Dashboard Header */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-[#8B5E3C] dark:text-cozy-cream-100 mb-2">Laporan Keuangan & Performa Bisnis</h2>
                <p className="text-[#7D6B5D] dark:text-cozy-cream-300">Pantau profitabilitas dan tingkat hunian aset properti Anda.</p>
            </div>

            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                
                {/* Total Kamar Card */}
                <div className="bg-white dark:bg-cozy-brown-800 rounded-2xl p-6 border border-[#E8E0D5] dark:border-cozy-brown-700 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-[#F5F0E6] dark:bg-cozy-brown-700 rounded-xl group-hover:scale-110 transition-transform">
                            <Home className="w-6 h-6 text-[#8B5E3C] dark:text-cozy-cream-200" />
                        </div>
                        <span className="flex items-center text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-lg">
                            {occupancyRate}% Terisi
                        </span>
                    </div>
                    <h3 className="text-[#7D6B5D] dark:text-cozy-cream-300 text-sm font-medium mb-1">Total Kamar</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">{metrik.totalKamar}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">kamar</span>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>{metrik.kamarTerisi} Terisi</span>
                        <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
                        <span>{metrik.kamarKosong} Kosong</span>
                    </div>
                </div>

                {/* Penghuni Aktif Card */}
                <div className="bg-white dark:bg-cozy-brown-800 rounded-2xl p-6 border border-[#E8E0D5] dark:border-cozy-brown-700 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-[#F5F0E6] dark:bg-cozy-brown-700 rounded-xl group-hover:scale-110 transition-transform">
                            <Users className="w-6 h-6 text-[#8B5E3C] dark:text-cozy-cream-200" />
                        </div>
                    </div>
                    <h3 className="text-[#7D6B5D] dark:text-cozy-cream-300 text-sm font-medium mb-1">Penghuni Aktif</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">{metrik.totalPenghuni}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">orang</span>
                    </div>
                    <div className="mt-4">
                        <Link href="/admin/penghuni" className="text-xs font-semibold text-[#8B5E3C] dark:text-cozy-cream-200 hover:underline flex items-center">
                            Kelola Penghuni <ArrowUpRight className="w-3 h-3 ml-1" />
                        </Link>
                    </div>
                </div>

                {/* Pemasukan Card */}
                <div className="bg-white dark:bg-cozy-brown-800 rounded-2xl p-6 border border-[#E8E0D5] dark:border-cozy-brown-700 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-xl group-hover:scale-110 transition-transform">
                            <Wallet className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                    <h3 className="text-[#7D6B5D] dark:text-cozy-cream-300 text-sm font-medium mb-1">Pemasukan Bulan Ini</h3>
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
                <div className="bg-white dark:bg-cozy-brown-800 rounded-2xl p-6 border border-orange-100 dark:border-cozy-brown-700 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                    {metrik.tagihanMenunggak > 0 && (
                        <div className="absolute top-0 right-0 w-16 h-16 bg-orange-50 dark:bg-orange-900/20 rounded-bl-full -mr-8 -mt-8"></div>
                    )}
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-orange-50 dark:bg-orange-900/30 rounded-xl group-hover:scale-110 transition-transform">
                            <AlertCircle className="w-6 h-6 text-orange-500 dark:text-orange-400" />
                        </div>
                    </div>
                    <h3 className="text-[#7D6B5D] dark:text-cozy-cream-300 text-sm font-medium mb-1">Tagihan Belum Lunas</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-orange-600 dark:text-orange-400">{metrik.tagihanMenunggak}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">tagihan</span>
                    </div>
                    <div className="mt-4">
                        <Link href="/admin/tagihan" className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline flex items-center">
                            Kirim Pengingat <ArrowUpRight className="w-3 h-3 ml-1" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Financial Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Main Content Area (2/3 width) - Trend Pemasukan (Mock Chart) */}
                <div className="lg:col-span-2 bg-white dark:bg-cozy-brown-800 rounded-2xl border border-[#E8E0D5] dark:border-cozy-brown-700 shadow-sm overflow-hidden transition-colors">
                    <div className="px-6 py-5 border-b border-[#E8E0D5] dark:border-cozy-brown-700 flex justify-between items-center">
                        <h3 className="font-bold text-gray-900 dark:text-white">Tren Pemasukan 6 Bulan Terakhir</h3>
                    </div>
                    <div className="p-6">
                        <div className="h-64 flex items-end justify-between gap-2 md:gap-6 pt-10 border-b border-gray-200 dark:border-cozy-brown-700 pb-2">
                            {/* Mock Bar Chart */}
                            {[40, 65, 45, 80, 55, 90].map((height, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center group relative">
                                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                                        Rp {(height * 15000).toLocaleString('id-ID')}
                                    </div>
                                    <div 
                                        className="w-full bg-[#8B5E3C]/80 hover:bg-[#8B5E3C] dark:bg-[#D4A373]/80 dark:hover:bg-[#D4A373] rounded-t-md transition-all duration-300" 
                                        style={{ height: `${height}%` }}
                                    ></div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-4 text-sm text-gray-500 dark:text-gray-400 font-medium">
                            <span>Feb</span>
                            <span>Mar</span>
                            <span>Apr</span>
                            <span>Mei</span>
                            <span>Jun</span>
                            <span>Jul</span>
                        </div>
                    </div>
                </div>

                {/* Sidebar (1/3 width) - Business Insights */}
                <div className="space-y-6">
                    <div className="bg-[#8B5E3C] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="font-bold text-lg mb-2 flex items-center"><TrendingUp className="w-5 h-5 mr-2"/> Insight Bisnis</h3>
                            
                            <div className="space-y-4 mt-6">
                                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                                    <div className="text-xs text-amber-200 mb-1">Tingkat Retensi (Retention Rate)</div>
                                    <div className="text-2xl font-bold text-white flex items-center">
                                        85% <ArrowUpRight className="w-4 h-4 text-green-300 ml-2" />
                                    </div>
                                </div>
                                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                                    <div className="text-xs text-amber-200 mb-1">Potensi Pemasukan Tertunda</div>
                                    <div className="text-xl font-bold text-white">
                                        {formatRupiah(metrik.tagihanMenunggak * 1000000)} {/* Simulasi 1 juta per tagihan */}
                                    </div>
                                    <div className="text-xs text-orange-200 mt-1">
                                        Berasal dari {metrik.tagihanMenunggak} tagihan belum lunas
                                    </div>
                                </div>
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
