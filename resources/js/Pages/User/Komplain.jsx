import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import { Wrench, Image as ImageIcon, CheckCircle2, Clock, PlayCircle, AlertCircle, Trash2 } from 'lucide-react';

export default function Komplain({ komplains, kamarAktif }) {
    const { flash } = usePage().props;
    const [previewFoto, setPreviewFoto] = useState(null);

    const { data, setData, post, processing, errors, reset, progress } = useForm({
        kamar_id: kamarAktif ? kamarAktif.id : '',
        judul_komplain: '',
        deskripsi: '',
        foto_kerusakan: null,
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

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Menunggu':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                        <Clock className="w-3 h-3 mr-1" />
                        Menunggu
                    </span>
                );
            case 'Diproses':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                        <PlayCircle className="w-3 h-3 mr-1" />
                        Diproses
                    </span>
                );
            case 'Selesai':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Selesai
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <UserLayout>
            <Head title="Laporan Kerusakan" />

            <div className="max-w-5xl mx-auto space-y-6">
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
                            <div className="p-5 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50">
                                <h3 className="font-bold text-gray-900 dark:text-white">Buat Laporan Baru</h3>
                            </div>
                            
                            {kamarAktif ? (
                                <form onSubmit={submit} className="p-5 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Kamar Saat Ini
                                        </label>
                                        <input
                                            type="text"
                                            value={`Kamar ${kamarAktif.nomor_kamar} (${kamarAktif.tipe_kamar})`}
                                            disabled
                                            className="w-full rounded-xl border-gray-300 bg-gray-100 text-gray-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-400 sm:text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Judul Laporan
                                        </label>
                                        <input
                                            type="text"
                                            value={data.judul_komplain}
                                            onChange={e => setData('judul_komplain', e.target.value)}
                                            placeholder="Contoh: AC Bocor, Lampu Mati"
                                            className="w-full rounded-xl border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                                            required
                                        />
                                        {errors.judul_komplain && <p className="text-red-500 text-xs mt-1">{errors.judul_komplain}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Deskripsi Detail
                                        </label>
                                        <textarea
                                            value={data.deskripsi}
                                            onChange={e => setData('deskripsi', e.target.value)}
                                            rows="3"
                                            placeholder="Jelaskan kerusakannya secara detail..."
                                            className="w-full rounded-xl border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                                            required
                                        ></textarea>
                                        {errors.deskripsi && <p className="text-red-500 text-xs mt-1">{errors.deskripsi}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Foto Bukti (Opsional)
                                        </label>
                                        
                                        {previewFoto ? (
                                            <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-slate-600 group">
                                                <img src={previewFoto} alt="Preview" className="w-full h-40 object-cover" />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button 
                                                        type="button" 
                                                        onClick={() => {
                                                            setData('foto_kerusakan', null);
                                                            setPreviewFoto(null);
                                                        }}
                                                        className="text-white bg-red-600 p-2 rounded-full hover:bg-red-700 transition"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-slate-600 border-dashed rounded-xl hover:border-amber-500 dark:hover:border-amber-500 transition-colors cursor-pointer" onClick={() => document.getElementById('foto_kerusakan').click()}>
                                                <div className="space-y-1 text-center">
                                                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                                                    <div className="flex text-sm text-gray-600 dark:text-slate-400 justify-center">
                                                        <label
                                                            htmlFor="foto_kerusakan"
                                                            className="relative cursor-pointer rounded-md font-medium text-amber-600 hover:text-amber-500 focus-within:outline-none"
                                                        >
                                                            <span>Upload file</span>
                                                            <input id="foto_kerusakan" name="foto_kerusakan" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                                                        </label>
                                                        <p className="pl-1">atau drag & drop</p>
                                                    </div>
                                                    <p className="text-xs text-gray-500 dark:text-slate-400">PNG, JPG, GIF up to 2MB</p>
                                                </div>
                                            </div>
                                        )}
                                        {errors.foto_kerusakan && <p className="text-red-500 text-xs mt-1">{errors.foto_kerusakan}</p>}
                                    </div>

                                    {progress && (
                                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-slate-700">
                                            <div className="bg-amber-600 h-2.5 rounded-full" style={{ width: `${progress.percentage}%` }}></div>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 px-4 rounded-xl transition-colors disabled:opacity-50"
                                    >
                                        {processing ? 'Mengirim...' : 'Kirim Laporan'}
                                    </button>
                                </form>
                            ) : (
                                <div className="p-6 text-center text-gray-500 dark:text-slate-400">
                                    Anda tidak memiliki kamar aktif yang sedang disewa.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Riwayat Komplain */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
                            <div className="p-5 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
                                <h3 className="font-bold text-gray-900 dark:text-white">Riwayat Laporan Saya</h3>
                            </div>
                            
                            <div className="p-5">
                                {komplains.length > 0 ? (
                                    <div className="space-y-4">
                                        {komplains.map(komplain => (
                                            <div key={komplain.id} className="border border-gray-200 dark:border-slate-700 rounded-xl p-4 hover:shadow-md transition-shadow">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 dark:text-white text-lg">{komplain.judul_komplain}</h4>
                                                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                                                            Kamar {komplain.kamar?.nomor_kamar} • Dilaporkan {new Date(komplain.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'})}
                                                        </p>
                                                    </div>
                                                    {getStatusBadge(komplain.status)}
                                                </div>
                                                
                                                <p className="text-gray-700 dark:text-gray-300 text-sm mt-3 bg-gray-50 dark:bg-slate-900/50 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                                                    {komplain.deskripsi}
                                                </p>

                                                {komplain.foto_kerusakan && (
                                                    <div className="mt-3">
                                                        <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 mb-2">Foto Bukti:</p>
                                                        <a href={`/storage/${komplain.foto_kerusakan}`} target="_blank" rel="noreferrer" className="inline-block relative rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700 hover:opacity-80 transition-opacity">
                                                            <img src={`/storage/${komplain.foto_kerusakan}`} alt="Bukti" className="w-32 h-24 object-cover" />
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-10">
                                        <Wrench className="w-12 h-12 text-gray-300 dark:text-gray-600 dark:text-slate-300 mx-auto mb-3" />
                                        <h4 className="text-gray-500 dark:text-slate-400 font-medium">Belum ada riwayat laporan kerusakan.</h4>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </UserLayout>
    );
}
