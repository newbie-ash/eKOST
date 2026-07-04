import { Head, Link } from '@inertiajs/react';
import { BedDouble, CheckCircle2, MapPin, ShieldCheck, Sparkles, Wifi, Car, Coffee } from 'lucide-react';
import ThemeToggle from '@/Components/ThemeToggle';

export default function Welcome({ auth, kamars }) {
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(number);
    };

    return (
        <>
            <Head title="Selamat Datang di eKOS" />
            
            <div className="min-h-screen bg-gray-50 dark:bg-cozy-brown-900 transition-colors duration-200">
                {/* Navbar */}
                <nav className="bg-white/80 dark:bg-cozy-brown-800/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 dark:border-cozy-brown-700">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16 items-center">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-[#8B5E3C] rounded-lg">
                                    <BedDouble className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xl font-bold text-[#8B5E3C] dark:text-cozy-cream-100">eKOS</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <ThemeToggle />
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="text-sm font-medium text-[#7D6B5D] dark:text-cozy-cream-200 hover:text-[#8B5E3C] dark:hover:text-white transition"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="text-sm font-medium text-[#7D6B5D] dark:text-cozy-cream-200 hover:text-[#8B5E3C] dark:hover:text-white transition"
                                        >
                                            Masuk
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="text-sm font-bold bg-[#8B5E3C] hover:bg-[#70482B] text-white px-4 py-2 rounded-xl shadow-sm transition"
                                        >
                                            Daftar Sekarang
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="relative overflow-hidden bg-white dark:bg-cozy-brown-800 border-b border-gray-200 dark:border-cozy-brown-700">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#F5F0E6] to-white dark:from-cozy-brown-800 dark:to-cozy-brown-900 opacity-90"></div>
                    </div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 relative z-10 text-center">
                        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6">
                            Temukan Kenyamanan<br/>Seperti di <span className="text-[#8B5E3C] dark:text-[#D4A373]">Rumah Sendiri</span>
                        </h1>
                        <p className="mt-4 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10">
                            eKOS menawarkan pengalaman hunian kos modern dengan fasilitas lengkap, keamanan terjamin, dan manajemen yang profesional.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <a href="#kamar-tersedia" className="bg-[#8B5E3C] hover:bg-[#70482B] text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2">
                                <BedDouble className="w-5 h-5" />
                                Lihat Kamar Kosong
                            </a>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="py-16 bg-gray-50 dark:bg-cozy-brown-900">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Fasilitas Unggulan Kami</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            <div className="bg-white dark:bg-cozy-brown-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-cozy-brown-700">
                                <div className="mx-auto w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-4">
                                    <Wifi className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white">WiFi Cepat</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Koneksi stabil 24 jam</p>
                            </div>
                            <div className="bg-white dark:bg-cozy-brown-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-cozy-brown-700">
                                <div className="mx-auto w-12 h-12 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center mb-4">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white">Keamanan</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">CCTV & Akses Terbatas</p>
                            </div>
                            <div className="bg-white dark:bg-cozy-brown-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-cozy-brown-700">
                                <div className="mx-auto w-12 h-12 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl flex items-center justify-center mb-4">
                                    <Sparkles className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white">Kebersihan</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Pembersihan berkala</p>
                            </div>
                            <div className="bg-white dark:bg-cozy-brown-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-cozy-brown-700">
                                <div className="mx-auto w-12 h-12 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mb-4">
                                    <Car className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white">Parkir Luas</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Aman untuk motor & mobil</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Available Rooms Catalog */}
                <div id="kamar-tersedia" className="py-20 bg-white dark:bg-cozy-brown-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Kamar Tersedia</h2>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">Pilih kamar yang sesuai dengan kebutuhan dan budget Anda.</p>
                        </div>

                        {kamars && kamars.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {kamars.map((kamar) => (
                                    <div key={kamar.id} className="bg-gray-50 dark:bg-cozy-brown-900 rounded-3xl overflow-hidden shadow-sm border border-gray-200 dark:border-cozy-brown-700 hover:shadow-xl transition-all duration-300 group flex flex-col">
                                        <div className="relative h-48 bg-gray-200 dark:bg-cozy-brown-800 flex items-center justify-center overflow-hidden">
                                            {/* Placeholder for Room Image */}
                                            <div className="absolute inset-0 bg-[#8B5E3C]/10 dark:bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                                            <BedDouble className="w-16 h-16 text-gray-400 dark:text-gray-600 group-hover:scale-110 transition-transform duration-500" />
                                            <div className="absolute top-4 right-4 z-20">
                                                <span className="bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                                                    Tersedia
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="p-6 flex-1 flex flex-col">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Kamar {kamar.nomor_kamar}</h3>
                                                    <p className="text-sm font-medium text-[#8B5E3C] dark:text-[#D4A373] mt-1">{kamar.tipe_kamar}</p>
                                                </div>
                                            </div>

                                            <div className="space-y-2 mb-6 flex-1">
                                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                    <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                                                    Kamar Mandi Dalam
                                                </div>
                                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                    <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                                                    AC & Lemari
                                                </div>
                                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                    <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                                                    Kasur Springbed
                                                </div>
                                            </div>

                                            <div className="pt-4 border-t border-gray-200 dark:border-cozy-brown-700 mt-auto">
                                                <div className="flex justify-between items-center mb-4">
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">Harga per bulan</span>
                                                    <span className="text-xl font-bold text-gray-900 dark:text-white">{formatRupiah(kamar.harga)}</span>
                                                </div>
                                                <Link
                                                    href={route('login')}
                                                    className="block w-full text-center bg-gray-900 hover:bg-black dark:bg-[#D4A373] dark:hover:bg-[#C28E5C] text-white font-bold py-3 px-4 rounded-xl transition-colors"
                                                >
                                                    Ajukan Sewa
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-gray-50 dark:bg-cozy-brown-900 rounded-3xl border border-dashed border-gray-300 dark:border-cozy-brown-600">
                                <BedDouble className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Mohon Maaf</h3>
                                <p className="text-gray-500 dark:text-gray-400">Saat ini tidak ada kamar yang kosong.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <footer className="bg-white dark:bg-cozy-brown-900 py-12 border-t border-gray-200 dark:border-cozy-brown-700">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center gap-2 mb-4 md:mb-0">
                            <div className="p-1.5 bg-[#8B5E3C] rounded-md">
                                <BedDouble className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-lg font-bold text-gray-900 dark:text-white">eKOS</span>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            &copy; {new Date().getFullYear()} eKOS Management System. All rights reserved.
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
