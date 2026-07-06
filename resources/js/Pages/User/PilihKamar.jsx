import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import { BedDouble, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';

export default function PilihKamar({ kamars, punyaPengajuan }) {
    const { flash } = usePage().props;
    const [selectedKamar, setSelectedKamar] = useState(null);
    const [formData, setFormData] = useState({
        durasi_bulan: 1,
        tanggal_masuk: new Date().toISOString().split('T')[0]
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedKamar) return;
        
        setIsSubmitting(true);
        router.post(route('pilih-kamar.store'), {
            kamar_id: selectedKamar.id,
            durasi_bulan: formData.durasi_bulan,
            tanggal_masuk: formData.tanggal_masuk
        }, {
            onFinish: () => setIsSubmitting(false)
        });
    };

    return (
        <UserLayout>
            <Head title="Pilih Kamar" />
            
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">Katalog Kamar</h1>
                    <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">
                        Pilih kamar yang tersedia dan ajukan penyewaan.
                    </p>
                </div>

                {flash?.success && (
                    <div className="bg-green-50 text-green-700 p-4 rounded-xl flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5" />
                        {flash.success}
                    </div>
                )}
                
                {flash?.error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-center gap-3">
                        <AlertCircle className="w-5 h-5" />
                        {flash.error}
                    </div>
                )}

                {punyaPengajuan && !flash?.success && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-800 p-5 rounded-2xl flex items-start gap-4">
                        <AlertCircle className="w-6 h-6 mt-0.5 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold mb-1">Pengajuan Sedang Diproses</h3>
                            <p className="text-sm">Anda sudah memiliki pengajuan sewa yang sedang menunggu konfirmasi Admin. Anda tidak dapat mengajukan sewa baru saat ini.</p>
                        </div>
                    </div>
                )}

                {!punyaPengajuan && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {kamars.length === 0 ? (
                            <div className="col-span-full bg-white dark:bg-slate-800 rounded-2xl p-8 text-center text-gray-500 dark:text-slate-400">
                                Saat ini tidak ada kamar yang kosong.
                            </div>
                        ) : (
                            kamars.map((kamar) => (
                                <div 
                                    key={kamar.id} 
                                    onClick={() => setSelectedKamar(kamar)}
                                    className={`bg-white dark:bg-slate-800 border-2 rounded-2xl overflow-hidden cursor-pointer transition-all flex flex-col ${
                                        selectedKamar?.id === kamar.id 
                                        ? 'border-amber-600 shadow-lg scale-[1.02]' 
                                        : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-md'
                                    }`}
                                >
                                    <div className="relative h-48 bg-gray-100 dark:bg-slate-900 flex items-center justify-center border-b border-gray-100 dark:border-slate-700">
                                        {kamar.galeri_foto && kamar.galeri_foto.length > 0 ? (
                                            <img src={`/storage/${kamar.galeri_foto[0]}`} alt={`Kamar ${kamar.nomor_kamar}`} className="absolute inset-0 w-full h-full object-cover" />
                                        ) : (
                                            <BedDouble className="w-12 h-12 text-gray-400 dark:text-gray-600" />
                                        )}
                                        <div className="absolute top-4 right-4 z-10">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 shadow-sm">
                                                Tersedia
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Kamar {kamar.nomor_kamar}</h3>
                                        <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">Tipe: {kamar.tipe_kamar}</p>
                                        
                                        <div className="text-lg font-semibold text-gray-900 dark:text-white mt-auto">
                                            Rp {numberFormat(kamar.harga)} <span className="text-sm font-normal text-gray-500 dark:text-slate-400">/ bulan</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Form Pengajuan (Hanya tampil jika ada kamar yang dipilih) */}
                {selectedKamar && !punyaPengajuan && (
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 mt-8">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Form Pengajuan: Kamar {selectedKamar.nomor_kamar}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tanggal Masuk</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Calendar className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="date"
                                            className="block w-full pl-10 rounded-xl border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                                            value={formData.tanggal_masuk}
                                            onChange={(e) => setFormData({...formData, tanggal_masuk: e.target.value})}
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Durasi Sewa (Bulan)</label>
                                    <input
                                        type="number"
                                        min="1"
                                        className="block w-full rounded-xl border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                                        value={formData.durasi_bulan}
                                        onChange={(e) => setFormData({...formData, durasi_bulan: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="mt-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-5">
                                <h3 className="text-amber-800 dark:text-amber-500 font-bold mb-3 flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5" />
                                    Peraturan & Tata Tertib Kos
                                </h3>
                                <ul className="list-disc pl-5 text-sm text-amber-700 dark:text-amber-600 space-y-1 mb-4">
                                    <li>Dilarang membawa hewan peliharaan ke dalam kamar.</li>
                                    <li>Penyewa bertanggung jawab atas kebersihan kamar masing-masing.</li>
                                    <li>Dilarang membuat kegaduhan di atas jam 22.00 WIB.</li>
                                    <li>Pembayaran kos dilakukan paling lambat tanggal 5 setiap bulannya.</li>
                                    <li>Dilarang membawa tamu lawan jenis masuk ke dalam kamar.</li>
                                </ul>
                                
                                <div className="flex items-start mt-4">
                                    <div className="flex items-center h-5">
                                        <input
                                            id="terms"
                                            type="checkbox"
                                            className="w-4 h-4 text-amber-600 bg-white border-amber-300 rounded focus:ring-amber-500 dark:focus:ring-amber-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
                                            checked={formData.agree}
                                            onChange={(e) => setFormData({...formData, agree: e.target.checked})}
                                            required
                                        />
                                    </div>
                                    <label htmlFor="terms" className="ml-2 text-sm font-medium text-amber-900 dark:text-amber-400">
                                        Saya telah membaca dan menyetujui seluruh tata tertib kos di atas.
                                    </label>
                                </div>
                            </div>
                            
                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !formData.agree}
                                    className="bg-amber-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-amber-700 focus:ring-4 focus:ring-amber-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                >
                                    {isSubmitting ? 'Mengirim...' : 'Ajukan Sewa Kamar Ini'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </UserLayout>
    );
}

// Helper untuk format rupiah
function numberFormat(value) {
    return new Intl.NumberFormat('id-ID').format(value);
}
