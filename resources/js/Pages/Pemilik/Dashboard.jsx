import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    Banknote, BedDouble, Users, TrendingUp, TrendingDown, 
    Activity, Clock, ChevronRight, BarChart3, PieChart as PieChartIcon
} from 'lucide-react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
    Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';

export default function Dashboard({ stats, recentActivities, chartData }) {
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
    };

    const roomData = [
        { name: 'Terisi', value: stats.kamar_terisi },
        { name: 'Kosong', value: stats.kamar_kosong },
    ];
    const COLORS = ['#10B981', '#F43F5E']; // Emerald-500, Rose-500

    return (
        <AdminLayout>
            <Head title="Dashboard Eksekutif" />

            <div className="space-y-6">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            <Activity className="w-6 h-6 text-cozy-brown-500" />
                            Dashboard Eksekutif
                        </h1>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Ringkasan performa bisnis eKOS bulan ini.
                        </p>
                    </div>
                </div>

                {/* Top Metriks */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group hover:shadow-md transition-shadow">
                        <div className="absolute -right-4 -top-4 bg-blue-50 dark:bg-blue-900/20 w-24 h-24 rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
                            <BedDouble className="w-8 h-8 text-blue-500 dark:text-blue-400 opacity-20" />
                        </div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 relative z-10">Total Kamar</h3>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white relative z-10">
                            {stats.total_kamar}
                        </div>
                        <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-2 relative z-10">
                            {stats.kamar_terisi} Terisi • {stats.kamar_kosong} Kosong
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group hover:shadow-md transition-shadow">
                        <div className="absolute -right-4 -top-4 bg-green-50 dark:bg-green-900/20 w-24 h-24 rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
                            <TrendingUp className="w-8 h-8 text-green-500 dark:text-green-400 opacity-20" />
                        </div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 relative z-10">Pemasukan (Bulan Ini)</h3>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white relative z-10">
                            {formatRupiah(stats.pemasukan_bulan_ini)}
                        </div>
                        <div className="text-xs text-green-600 dark:text-green-400 font-medium mt-2 relative z-10">
                            Dari pembayaran tagihan lunas
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group hover:shadow-md transition-shadow">
                        <div className="absolute -right-4 -top-4 bg-red-50 dark:bg-red-900/20 w-24 h-24 rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
                            <TrendingDown className="w-8 h-8 text-red-500 dark:text-red-400 opacity-20" />
                        </div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 relative z-10">Pengeluaran (Bulan Ini)</h3>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white relative z-10">
                            {formatRupiah(stats.pengeluaran_bulan_ini)}
                        </div>
                        <div className="text-xs text-red-600 dark:text-red-400 font-medium mt-2 relative z-10 flex items-center gap-1">
                            Biaya operasional & perbaikan
                        </div>
                    </div>

                    <div className={`rounded-2xl p-5 shadow-sm border relative overflow-hidden group hover:shadow-md transition-shadow ${stats.laba_bersih >= 0 ? 'bg-gradient-to-br from-cozy-brown-500 to-cozy-brown-600 border-cozy-brown-600' : 'bg-gradient-to-br from-red-500 to-red-600 border-red-600'}`}>
                        <div className="absolute -right-4 -top-4 bg-white/10 w-24 h-24 rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
                            <Banknote className="w-8 h-8 text-white opacity-20" />
                        </div>
                        <h3 className="text-sm font-medium text-white/80 mb-1 relative z-10">Laba Bersih (Bulan Ini)</h3>
                        <div className="text-3xl font-bold text-white relative z-10">
                            {formatRupiah(stats.laba_bersih)}
                        </div>
                        <div className="text-xs text-white/90 font-medium mt-2 relative z-10">
                            Pemasukan dikurangi Pengeluaran
                        </div>
                    </div>
                </div>

                {/* Bagian Grafik */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Grafik Keuangan Bar Chart */}
                    <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden p-5">
                        <div className="flex items-center gap-2 mb-6">
                            <BarChart3 className="w-5 h-5 text-cozy-brown-500" />
                            <h3 className="font-bold text-gray-900 dark:text-white">Tren Keuangan (6 Bulan)</h3>
                        </div>
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 5, right: 10, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                                    <YAxis 
                                        tickFormatter={(value) => `Rp${(value / 1000000)}M`} 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: '#6B7280', fontSize: 12 }}
                                    />
                                    <RechartsTooltip 
                                        formatter={(value) => formatRupiah(value)}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend wrapperStyle={{ paddingTop: '10px' }} />
                                    <Bar dataKey="Pemasukan" fill="#10B981" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="Pengeluaran" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Grafik Status Kamar Donut */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden p-5">
                        <div className="flex items-center gap-2 mb-6">
                            <PieChartIcon className="w-5 h-5 text-cozy-brown-500" />
                            <h3 className="font-bold text-gray-900 dark:text-white">Status Kamar</h3>
                        </div>
                        <div className="h-64 w-full flex justify-center items-center relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={roomData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {roomData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip 
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total_kamar}</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">Total Kamar</span>
                            </div>
                        </div>
                        <div className="flex justify-center gap-6 mt-2">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                <span className="text-sm text-gray-600 dark:text-gray-300">Terisi ({stats.kamar_terisi})</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                                <span className="text-sm text-gray-600 dark:text-gray-300">Kosong ({stats.kamar_kosong})</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Activities Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Clock className="w-5 h-5 text-cozy-brown-500" />
                                Aktivitas Sistem Terbaru
                            </h3>
                            <Link href="/pemilik/activity-log" className="text-xs font-semibold text-cozy-brown-600 dark:text-cozy-brown-400 hover:underline flex items-center">
                                Lihat Semua <ChevronRight className="w-3 h-3 ml-0.5" />
                            </Link>
                        </div>
                        <div className="p-5">
                            {recentActivities.length > 0 ? (
                                <div className="space-y-4">
                                    {recentActivities.map((activity, index) => (
                                        <div key={activity.id} className="flex gap-4 relative">
                                            {index !== recentActivities.length - 1 && (
                                                <div className="absolute left-4 top-8 bottom-[-16px] w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                                            )}
                                            <div className="relative z-10 w-8 h-8 rounded-full bg-cozy-brown-100 dark:bg-cozy-brown-900/50 flex items-center justify-center flex-shrink-0 border border-cozy-brown-200 dark:border-cozy-brown-800 text-cozy-brown-600 dark:text-cozy-brown-400">
                                                <Activity className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1 pb-1">
                                                <p className="text-sm text-gray-900 dark:text-gray-200 font-medium">{activity.description}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{activity.user?.name || 'Sistem'}</span>
                                                    <span className="text-gray-300 dark:text-gray-600 dark:text-slate-300">•</span>
                                                    <span className="text-xs text-gray-400 dark:text-gray-500 dark:text-slate-400">
                                                        {new Date(activity.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6 text-gray-500 dark:text-gray-400 text-sm">
                                    Belum ada aktivitas tercatat.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
}
