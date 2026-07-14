import React, { useState, useEffect } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import { Wrench, Image as ImageIcon, CheckCircle2, Clock, PlayCircle, AlertCircle, Trash2, Star, X } from 'lucide-react';

export default function Komplain({ komplains, kamarAktif }) {
    const { flash } = usePage().props;
    const [previewFoto, setPreviewFoto] = useState(null);
    const [ratingModalOpen, setRatingModalOpen] = useState(false);
    const [selectedKomplain, setSelectedKomplain] = useState(null);
    const [localKomplains, setLocalKomplains] = useState(komplains);

    useEffect(() => {
        setLocalKomplains(komplains);
    }, [komplains]);

    useEffect(() => {
        if (window.Echo) {
            window.Echo.channel('chat')
                .listen('MessageSent', (e) => {
                    setLocalKomplains((prev) => {
                        const exists = prev.find(k => k.id === e.message.id);
                        if (exists) {
                            return prev.map(k => k.id === e.message.id ? {...k, ...e.message} : k);
                        }
                        return [e.message, ...prev];
                    });
                });
        }
    }, []);

    const { data, setData, post, processing, errors, reset, progress } = useForm({
        kamar_id: kamarAktif ? kamarAktif.id : '',
        judul_komplain: '',
        deskripsi: '',
        foto_kerusakan: null,
    });

    const ratingForm = useForm({
        rating: 5,
        ulasan_penyewa: '',
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('foto_kerusakan', file);
            setPreviewFoto(URL.createObjectURL(file));
        } else {
            setData('foto_kerusakan', null);
            setPreviewFoto(null);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('user.komplain.store'), {
            onSuccess: () => {
                reset('judul_komplain', 'deskripsi', 'foto_kerusakan');
                setPreviewFoto(null);
            },
            preserveScroll: true,
        });
    };

    const openRatingModal = (komplain) => {
        setSelectedKomplain(komplain);
        ratingForm.setData({ rating: 5, ulasan_penyewa: '' });
        ratingForm.clearErrors();
        setRatingModalOpen(true);
    };

    const submitRating = (e) => {
        e.preventDefault();
        ratingForm.post(route('user.komplain.rate', selectedKomplain.id), {
            onSuccess: () => {
                setRatingModalOpen(false);
                setSelectedKomplain(null);
            },
            preserveScroll: true,
        });
    };

    const getTimeline = (status) => {
        const steps = ['Menunggu', 'Diproses', 'Selesai'];
        const currentIndex = steps.indexOf(status);

        return (
            <div className="flex items-center mt-4 mb-2">
                {steps.map((step, index) => {
                    const isCompleted = index <= currentIndex;
                    const isCurrent = index === currentIndex;
                    return (
                        <React.Fragment key={step}>
                            <div className="flex flex-col items-center relative">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                                    isCompleted 
                                        ? 'bg-amber-600 border-amber-600 text-white' 
                                        : 'bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 text-gray-400'
                                } ${isCurrent ? 'ring-4 ring-amber-200 dark:ring-amber-900/50' : ''}`}>
                                    {index === 0 && <Clock className="w-4 h-4" />}
                                    {index === 1 && <PlayCircle className="w-4 h-4" />}
                                    {index === 2 && <CheckCircle2 className="w-4 h-4" />}
                                </div>
                                <span className={`text-xs font-semibold mt-2 absolute -bottom-5 w-20 text-center ${
                                    isCompleted ? 'text-amber-700 dark:text-amber-500' : 'text-gray-400'
                                }`}>{step}</span>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`flex-1 h-1 mx-2 rounded-full ${
                                    index < currentIndex ? 'bg-amber-600' : 'bg-gray-200 dark:bg-slate-700'
                                }`}></div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        );
    };

    return (
        <UserLayout>
            <Head title="Laporan Kerusakan" />

            <div className="max-w-5xl mx-auto space-y-6 pb-20">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 flex items-center gap-2">
                        <Wrench className="w-6 h-6 text-amber-600" />
                        Laporan Kerusakan
                    </h1>
                    <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">
                        Laporkan masalah atau kerusakan fasilitas di kamar Anda agar segera ditindaklanjuti.
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Form Laporan */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
                            <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50">
                                <h3 className="font-bold text-gray-900 dark:text-white">Buat Laporan Baru</h3>
                            </div>
                            
                            {kamarAktif ? (
                                <form onSubmit={submit} className="p-4 sm:p-5 space-y-4">
                                    {/* Inputs sama seperti sebelumnya */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kamar Saat Ini</label>
                                        <input type="text" value={`Kamar ${kamarAktif.nomor_kamar} (${kamarAktif.tipe_kamar})`} disabled className="w-full rounded-xl border-gray-300 bg-gray-100 text-gray-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-400 sm:text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Judul Laporan</label>
                                        <input type="text" value={data.judul_komplain} onChange={e => setData('judul_komplain', e.target.value)} placeholder="Contoh: AC Bocor, Lampu Mati" className="w-full rounded-xl border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-amber-500 focus:border-amber-500 sm:text-sm" required />
                                        {errors.judul_komplain && <p className="text-red-500 text-xs mt-1">{errors.judul_komplain}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deskripsi Detail</label>
                                        <textarea value={data.deskripsi} onChange={e => setData('deskripsi', e.target.value)} rows="3" placeholder="Jelaskan kerusakannya secara detail..." className="w-full rounded-xl border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-amber-500 focus:border-amber-500 sm:text-sm" required></textarea>
                                        {errors.deskripsi && <p className="text-red-500 text-xs mt-1">{errors.deskripsi}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Foto Bukti (Opsional)</label>
                                        {previewFoto ? (
                                            <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-slate-600 group">
                                                <img src={previewFoto} alt="Preview" className="w-full h-40 object-cover" />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button type="button" onClick={() => { setData('foto_kerusakan', null); setPreviewFoto(null); }} className="text-white bg-red-600 p-2 rounded-full hover:bg-red-700 transition active:scale-95">
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-slate-600 border-dashed rounded-xl hover:border-amber-500 transition-colors cursor-pointer" onClick={() => document.getElementById('foto_kerusakan').click()}>
                                                <div className="space-y-1 text-center">
                                                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                                                    <div className="flex text-sm text-gray-600 dark:text-slate-400 justify-center">
                                                        <label htmlFor="foto_kerusakan" className="relative cursor-pointer rounded-md font-medium text-amber-600 hover:text-amber-500 focus-within:outline-none">
                                                            <span>Upload file</span>
                                                            <input id="foto_kerusakan" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {errors.foto_kerusakan && <p className="text-red-500 text-xs mt-1">{errors.foto_kerusakan}</p>}
                                    </div>
                                    <button type="submit" disabled={processing} className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 px-4 rounded-xl transition-all active:scale-95 shadow-sm disabled:opacity-50">
                                        {processing ? 'Mengirim...' : 'Kirim Laporan'}
                                    </button>
                                </form>
                            ) : (
                                <div className="p-6 text-center text-gray-500">Anda tidak memiliki kamar aktif.</div>
                            )}
                        </div>
                    </div>

                    {/* Riwayat Komplain dengan Timeline */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
                            <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
                                <h3 className="font-bold text-gray-900 dark:text-white">Riwayat Pelacakan Laporan</h3>
                            </div>
                            
                            <div className="p-4 sm:p-5">
                                {localKomplains.length > 0 ? (
                                    <div className="space-y-6">
                                        {localKomplains.map(komplain => (
                                            <div key={komplain.id} className="border border-gray-200 dark:border-slate-700 rounded-2xl p-4 sm:p-5 hover:shadow-md transition-shadow relative">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 dark:text-white text-lg sm:text-xl">{komplain.judul_komplain}</h4>
                                                        <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
                                                            Kamar {komplain.kamar?.nomor_kamar} • {new Date(komplain.created_at).toLocaleDateString('id-ID')}
                                                        </p>
                                                    </div>
                                                </div>
                                                
                                                <p className="text-gray-700 dark:text-gray-300 text-sm mb-6 bg-gray-50 dark:bg-slate-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                                                    {komplain.deskripsi}
                                                </p>

                                                {/* Visual Timeline */}
                                                <div className="px-2 mb-8">
                                                    {getTimeline(komplain.status)}
                                                </div>

                                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mt-4 pt-4 border-t border-gray-100 dark:border-slate-700 gap-4 sm:gap-0">
                                                    {komplain.foto_kerusakan ? (
                                                        <a href={`/storage/${komplain.foto_kerusakan}`} target="_blank" rel="noreferrer" className="inline-flex items-center text-sm font-semibold text-amber-600 hover:text-amber-700">
                                                            <ImageIcon className="w-4 h-4 mr-1" /> Lihat Foto Lampiran
                                                        </a>
                                                    ) : <div></div>}
                                                    
                                                    {komplain.status === 'Selesai' && !komplain.rating && (
                                                        <button 
                                                            onClick={() => openRatingModal(komplain)}
                                                            className="w-full sm:w-auto justify-center bg-[#8B5E3C] hover:bg-[#724a2e] text-white px-4 py-2 rounded-xl font-bold text-sm shadow-sm transition-all active:scale-95 flex items-center"
                                                        >
                                                            <Star className="w-4 h-4 mr-2" /> Beri Penilaian
                                                        </button>
                                                    )}

                                                    {komplain.rating && (
                                                        <div className="flex items-center bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1.5 rounded-lg border border-yellow-200 dark:border-yellow-900/50">
                                                            <span className="text-xs sm:text-sm font-bold text-yellow-700 dark:text-yellow-500 mr-2">Dinilai:</span>
                                                            <div className="flex">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star key={i} className={`w-3 h-3 sm:w-4 sm:h-4 ${i < komplain.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-slate-600'}`} />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-10">
                                        <Wrench className="w-12 h-12 text-gray-300 dark:text-slate-600 mx-auto mb-3" />
                                        <h4 className="text-gray-500 font-medium text-sm sm:text-base">Belum ada riwayat laporan kerusakan.</h4>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rating Modal */}
            {ratingModalOpen && selectedKomplain && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={() => setRatingModalOpen(false)}></div>
                    <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md relative z-10 shadow-2xl p-5 sm:p-6 mx-2">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Nilai Hasil Perbaikan</h3>
                            <button onClick={() => setRatingModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 active:scale-95 transition-transform">
                                <X className="w-5 h-5 sm:w-6 sm:h-6" />
                            </button>
                        </div>
                        
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                            Laporan <span className="font-bold">"{selectedKomplain.judul_komplain}"</span> telah diselesaikan. Seberapa puas Anda dengan hasil perbaikannya?
                        </p>

                        <form onSubmit={submitRating}>
                            <div className="flex justify-center gap-2 sm:gap-3 mb-6">
                                {[1, 2, 3, 4, 5].map(num => (
                                    <button
                                        type="button"
                                        key={num}
                                        onClick={() => ratingForm.setData('rating', num)}
                                        className="focus:outline-none transition-transform active:scale-90 hover:scale-110"
                                    >
                                        <Star className={`w-8 h-8 sm:w-10 sm:h-10 ${ratingForm.data.rating >= num ? 'text-yellow-400 fill-yellow-400 drop-shadow-sm' : 'text-gray-300 dark:text-slate-600'}`} />
                                    </button>
                                ))}
                            </div>
                            
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Ulasan (Opsional)</label>
                                <textarea
                                    className="w-full rounded-xl border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-amber-500 sm:text-sm"
                                    rows="3"
                                    placeholder="Tuliskan ulasan Anda mengenai perbaikan ini..."
                                    value={ratingForm.data.ulasan_penyewa}
                                    onChange={e => ratingForm.setData('ulasan_penyewa', e.target.value)}
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={ratingForm.processing}
                                className="w-full bg-[#8B5E3C] hover:bg-[#724a2e] text-white font-bold py-3 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50"
                            >
                                {ratingForm.processing ? 'Menyimpan...' : 'Kirim Penilaian'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </UserLayout>
    );
}
