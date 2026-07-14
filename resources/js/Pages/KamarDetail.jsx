import { Head, Link } from '@inertiajs/react';
import { BedDouble, CheckCircle2, MapPin, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import ThemeToggle from '@/Components/ThemeToggle';
import { useState } from 'react';

export default function KamarDetail({ auth, kamar }) {
    const [mainImage, setMainImage] = useState(
        kamar.galeri_foto && kamar.galeri_foto.length > 0 
            ? `/storage/${kamar.galeri_foto[0]}` 
            : '/images/hero-bg.jpg'
    );

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(number);
    };

    return (
        <>
            <Head title={`Detail Kamar ${kamar.nomor_kamar} - eKOS`} />
            
            <div className="min-h-screen relative transition-colors duration-200 font-sans text-gray-900 dark:text-white bg-slate-50 dark:bg-slate-900">
                {/* Navbar */}
                <nav className="bg-white dark:bg-slate-800 sticky top-0 z-50 border-b border-gray-200 dark:border-slate-700 shadow-sm transition-colors duration-300">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-20 items-center">
                            <div className="flex items-center gap-4">
                                <Link href={route('welcome')} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition">
                                    <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                </Link>
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-[#8B5E3C] rounded-lg shadow-sm">
                                        <BedDouble className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-xl font-bold text-[#8B5E3C] dark:text-white drop-shadow-sm hidden sm:block">KOSTNYA KITA</span>
                                </div>
                            </div>
                            
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
                                    <Link
                                        href={route('login')}
                                        className="text-sm font-bold bg-[#8B5E3C] hover:bg-[#724a2e] dark:bg-[#D4A373] dark:hover:bg-[#C28E5C] text-white dark:text-gray-900 px-6 py-2.5 rounded-lg shadow-sm transition"
                                    >
                                        Masuk / Daftar
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Gallery Section */}
                        <div className="space-y-4">
                            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-gray-200 dark:bg-slate-800 shadow-md">
                                <img src={mainImage} alt={`Kamar ${kamar.nomor_kamar}`} className="w-full h-full object-cover" />
                            </div>
                            
                            {kamar.galeri_foto && kamar.galeri_foto.length > 0 ? (
                                <div className="grid grid-cols-4 gap-4">
                                    {kamar.galeri_foto.map((foto, index) => (
                                        <button 
                                            key={index}
                                            onClick={() => setMainImage(`/storage/${foto}`)}
                                            className={`aspect-video rounded-xl overflow-hidden bg-gray-200 dark:bg-slate-800 border-2 transition-all ${
                                                mainImage === `/storage/${foto}` 
                                                    ? 'border-[#8B5E3C] dark:border-[#D4A373] opacity-100' 
                                                    : 'border-transparent opacity-60 hover:opacity-100'
                                            }`}
                                        >
                                            <img src={`/storage/${foto}`} alt={`Galeri ${index}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex items-center justify-center p-8 bg-gray-100 dark:bg-slate-800 rounded-xl border border-dashed border-gray-300 dark:border-slate-600">
                                    <div className="text-center">
                                        <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Tidak ada galeri foto</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Details Section */}
                        <div className="flex flex-col">
                            <div className="mb-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Kamar {kamar.nomor_kamar}</h1>
                                    <span className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 px-3 py-1 rounded-full text-sm font-bold border border-green-200 dark:border-green-800">
                                        Tersedia
                                    </span>
                                </div>
                                <p className="text-xl font-bold text-[#8B5E3C] dark:text-[#D4A373]">{kamar.tipe_kamar}</p>
                            </div>

                            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 mb-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Harga Sewa</h3>
                                <div className="text-4xl font-extrabold text-gray-900 dark:text-white mb-1">
                                    {formatRupiah(kamar.harga)} <span className="text-lg text-gray-500 font-medium">/ bulan</span>
                                </div>
                                
                                <Link
                                    href={route('login')}
                                    className="mt-6 block w-full text-center bg-[#8B5E3C] hover:bg-[#724a2e] dark:bg-[#D4A373] dark:hover:bg-[#C28E5C] text-white dark:text-gray-900 font-bold py-4 px-4 rounded-xl shadow-md transition-all transform hover:scale-[1.02]"
                                >
                                    Pesan Kamar Ini Sekarang
                                </Link>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Deskripsi Kamar</h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                                    {kamar.deskripsi || "Kamar nyaman dengan desain minimalis, cocok untuk Anda yang membutuhkan ketenangan dan kenyamanan optimal. Cocok untuk mahasiswa atau pekerja kantoran."}
                                </p>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Fasilitas Termasuk</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center text-gray-700 dark:text-gray-300 font-medium">
                                        <CheckCircle2 className="w-5 h-5 mr-3 text-green-500" /> Kamar Mandi Dalam
                                    </div>
                                    <div className="flex items-center text-gray-700 dark:text-gray-300 font-medium">
                                        <CheckCircle2 className="w-5 h-5 mr-3 text-green-500" /> Kasur Springbed
                                    </div>
                                    <div className="flex items-center text-gray-700 dark:text-gray-300 font-medium">
                                        <CheckCircle2 className="w-5 h-5 mr-3 text-green-500" /> Lemari Pakaian
                                    </div>
                                    <div className="flex items-center text-gray-700 dark:text-gray-300 font-medium">
                                        <CheckCircle2 className="w-5 h-5 mr-3 text-green-500" /> Meja Belajar
                                    </div>
                                    <div className="flex items-center text-gray-700 dark:text-gray-300 font-medium">
                                        <CheckCircle2 className="w-5 h-5 mr-3 text-green-500" /> Listrik Token Sendiri
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
