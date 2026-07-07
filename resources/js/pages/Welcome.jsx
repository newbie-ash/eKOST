import { Head, Link } from '@inertiajs/react';
import { BedDouble, CheckCircle2, MapPin, ShieldCheck, Sparkles, Wifi, Car, Banknote, Instagram, Facebook, MessageCircle } from 'lucide-react';
import ThemeToggle from '@/Components/ThemeToggle';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet marker icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});
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
            
            <div className="min-h-screen relative transition-colors duration-200 font-sans text-gray-900 dark:text-white">
                {/* Global Fixed Background with Frosted Glass Effect */}
                <div className="fixed inset-0 z-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center bg-no-repeat"></div>
                <div className="fixed inset-0 z-0 bg-white/70 dark:bg-slate-900/80 backdrop-blur transition-colors duration-300"></div>
                
                {/* Main Content Wrapper */}
                <div className="relative z-10 flex flex-col min-h-screen">
                    {/* Navbar */}
                    <nav className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-lg sticky top-0 z-50 border-b border-white/40 dark:border-slate-700/50 shadow-sm transition-colors duration-300">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex justify-between h-20 items-center">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-[#8B5E3C] rounded-lg shadow-sm">
                                        <BedDouble className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-xl font-bold text-[#8B5E3C] dark:text-white drop-shadow-sm">KOSTNYA KITA</span>
                                </div>
                                
                                {/* Auth Links - Right */}
                                <div className="flex items-center gap-4">
                                    <ThemeToggle />
                                    {auth.user ? (
                                        <Link
                                            href={route('dashboard')}
                                            className="text-sm font-bold bg-[#10B981] hover:bg-emerald-600 text-white px-6 py-2.5 rounded-lg shadow-sm transition"
                                        >
                                            Dashboard
                                        </Link>
                                    ) : (
                                        <>
                                            <Link
                                                href={route('login')}
                                                className="text-sm font-bold text-gray-700 dark:text-gray-200 hover:text-[#8B5E3C] dark:hover:text-[#D4A373] transition bg-white/50 dark:bg-slate-800/50 px-4 py-2 rounded-lg border border-white/40 dark:border-slate-700/50"
                                            >
                                                Masuk
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </nav>

                    {/* Hero Section (Tentang Kami) */}
                    <div id="tentang-kami" className="relative pt-20 pb-32 lg:pt-28 lg:pb-48">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                            <div className="max-w-4xl mx-auto">
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6 leading-tight drop-shadow-md">
                                    Lelah setelah seharian beraktivitas?
                                </h1>
                                <p className="text-lg md:text-xl text-gray-800 dark:text-gray-200 mb-4 drop-shadow-sm leading-relaxed font-medium">
                                    Kami menyediakan kost premium dengan harga mulai dari <span className="font-bold text-[#8B5E3C] dark:text-[#D4A373]">Rp 500.000</span> saja! 
                                    Nikmati istirahat berkualitas dengan fasilitas eksklusif hanya di eKOS.
                                </p>
                                <div className="mt-10">
                                    <Link
                                        href={route('register')}
                                        className="inline-block bg-[#8B5E3C] hover:bg-[#724a2e] dark:bg-[#D4A373] dark:hover:bg-[#C28E5C] text-white dark:text-gray-900 font-bold py-4 px-10 rounded-full transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl border border-white/20"
                                    >
                                        Pesan Sekarang
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Features Cards */}
                    <div id="fasilitas" className="relative z-20 -mt-24 lg:-mt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 scroll-mt-24">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg p-6 rounded-3xl shadow-xl border border-white/50 dark:border-slate-700/50 flex items-center gap-4 group hover:-translate-y-2 transition-all duration-300">
                                <div className="w-12 h-12 bg-blue-50/80 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center shrink-0 shadow-inner">
                                    <Wifi className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white">Fasilitas Lengkap</h3>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mt-1">WiFi, AC, Parkir</p>
                                </div>
                            </div>
                            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg p-6 rounded-3xl shadow-xl border border-white/50 dark:border-slate-700/50 flex items-center gap-4 group hover:-translate-y-2 transition-all duration-300">
                                <div className="w-12 h-12 bg-[#8B5E3C]/10 dark:bg-[#D4A373]/20 text-[#8B5E3C] dark:text-[#D4A373] rounded-xl flex items-center justify-center shrink-0 shadow-inner">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white">Lokasi Aman</h3>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mt-1">Area strategis & tenang</p>
                                </div>
                            </div>
                            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg p-6 rounded-3xl shadow-xl border border-white/50 dark:border-slate-700/50 flex items-center gap-4 group hover:-translate-y-2 transition-all duration-300">
                                <div className="w-12 h-12 bg-teal-50/80 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 rounded-xl flex items-center justify-center shrink-0 shadow-inner">
                                    <Banknote className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white">Hemat & Nyaman</h3>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mt-1">Harga terbaik & terjangkau</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Available Rooms Catalog */}
                    <div id="kamar-tersedia" className="py-12">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white drop-shadow-sm">Kamar Tersedia</h2>
                                <p className="text-gray-800 dark:text-gray-200 mt-2 font-semibold drop-shadow-sm">Pilih kamar yang sesuai dengan kebutuhan dan budget Anda.</p>
                            </div>

                            {kamars && kamars.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {kamars.map((kamar) => (
                                        <div key={kamar.id} className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl overflow-hidden shadow-lg border border-white/50 dark:border-slate-700/50 hover:shadow-2xl transition-all duration-300 group flex flex-col hover:-translate-y-1">
                                            <div className="relative h-48 bg-gray-200/50 dark:bg-slate-900/50 flex items-center justify-center overflow-hidden backdrop-blur-sm">
                                                <div className="absolute inset-0 bg-[#8B5E3C]/5 dark:bg-black/10 group-hover:bg-transparent transition-colors z-10"></div>
                                                {kamar.galeri_foto && kamar.galeri_foto.length > 0 ? (
                                                    <img src={`/storage/${kamar.galeri_foto[0]}`} alt={`Kamar ${kamar.nomor_kamar}`} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                ) : (
                                                    <BedDouble className="w-16 h-16 text-gray-400 dark:text-gray-500 group-hover:scale-110 transition-transform duration-500" />
                                                )}
                                                <div className="absolute top-4 right-4 z-20">
                                                    <span className="bg-green-100/90 text-green-800 dark:bg-green-900/80 dark:text-green-300 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm backdrop-blur-md border border-green-200/50 dark:border-green-800/50">
                                                        Tersedia
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className="p-6 flex-1 flex flex-col">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Kamar {kamar.nomor_kamar}</h3>
                                                        <p className="text-sm font-bold text-[#8B5E3C] dark:text-[#D4A373] mt-1">{kamar.tipe_kamar}</p>
                                                    </div>
                                                </div>

                                                <div className="space-y-2 mb-6 flex-1">
                                                    <div className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                        <CheckCircle2 className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" />
                                                        Kamar Mandi Dalam
                                                    </div>
                                                    <div className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                        <CheckCircle2 className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" />
                                                        AC & Lemari
                                                    </div>
                                                    <div className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                        <CheckCircle2 className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" />
                                                        Kasur Springbed
                                                    </div>
                                                </div>

                                                <div className="pt-4 border-t border-gray-200/50 dark:border-slate-700/50 mt-auto">
                                                    <div className="flex justify-between items-center mb-4">
                                                        <span className="text-sm font-bold text-gray-700 dark:text-gray-400">Harga per bulan</span>
                                                        <span className="text-xl font-extrabold text-gray-900 dark:text-white">{formatRupiah(kamar.harga)}</span>
                                                    </div>
                                                    <Link
                                                        href={route('kamar.detail', kamar.id)}
                                                        className="block w-full text-center bg-gray-900/90 hover:bg-black dark:bg-[#D4A373]/90 dark:hover:bg-[#C28E5C] text-white dark:text-gray-900 font-bold py-3 px-4 rounded-xl shadow-md transition-all backdrop-blur-sm"
                                                    >
                                                        Lihat Detail
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg rounded-3xl border border-dashed border-gray-400/50 dark:border-slate-500/50 shadow-sm">
                                    <BedDouble className="w-16 h-16 text-gray-500 dark:text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Mohon Maaf</h3>
                                    <p className="text-gray-700 dark:text-gray-300 font-medium">Saat ini tidak ada kamar yang kosong.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Lokasi Kami Section */}
                    <div id="lokasi" className="py-20 mt-auto">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 drop-shadow-sm">Lokasi Kami</h2>
                            
                            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-4 rounded-3xl shadow-xl border border-white/50 dark:border-slate-700/50 overflow-hidden relative">
                                <div className="h-[400px] w-full rounded-2xl overflow-hidden z-10 relative">
                                    <MapContainer center={[5.1843, 97.1084]} zoom={15} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                                        <TileLayer
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />
                                        <Marker position={[5.1843, 97.1084]}>
                                            <Popup>
                                                <b>eKOS</b><br />
                                                Kos Premium Lhokseumawe<br />
                                                <span className="text-xs text-gray-500">Padang Sakti, Kec. Muara Satu</span>
                                            </Popup>
                                        </Marker>
                                    </MapContainer>
                                </div>
                                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-left">
                                    <div className="p-3 bg-[#8B5E3C]/10 dark:bg-[#D4A373]/20 text-[#8B5E3C] dark:text-[#D4A373] rounded-full shadow-inner border border-[#8B5E3C]/20 dark:border-[#D4A373]/30">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <span className="font-bold block text-gray-900 dark:text-white text-base mb-1">Alamat Lengkap:</span>
                                        <p className="text-gray-800 dark:text-gray-200 font-medium text-sm">
                                            Padang Sakti, Kec. Muara Satu, Kota Lhokseumawe, Aceh, Indonesia
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <footer className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md py-12 border-t border-white/30 dark:border-slate-700/30 mt-10">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-[#8B5E3C] rounded-md shadow-sm border border-white/20">
                                    <BedDouble className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-bold text-gray-900 dark:text-white drop-shadow-sm">eKOS</span>
                            </div>
                            
                            {/* Social Media */}
                            <div className="flex items-center gap-4">
                                <a href="#" className="w-10 h-10 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-md border border-white/50 dark:border-slate-700/50 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
                                    <Instagram className="w-5 h-5" />
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-md border border-white/50 dark:border-slate-700/50 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    <Facebook className="w-5 h-5" />
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-md border border-white/50 dark:border-slate-700/50 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                                    <MessageCircle className="w-5 h-5" />
                                </a>
                            </div>

                            <p className="text-gray-800 dark:text-gray-300 font-semibold text-sm text-center md:text-left drop-shadow-sm">
                                &copy; {new Date().getFullYear()} eKOS Management System. All rights reserved.
                            </p>
                        </div>
                    </footer>
                </div>
            </div>
        </>
    );
}
