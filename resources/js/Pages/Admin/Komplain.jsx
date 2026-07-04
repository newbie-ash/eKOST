import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Wrench, CheckCircle2, Clock, PlayCircle, Eye, AlertCircle } from 'lucide-react';

export default function Komplain({ komplains }) {
    const { flash } = usePage().props;
    const { put, processing } = useForm();
    const [selectedImage, setSelectedImage] = useState(null);

    const updateStatus = (id, newStatus) => {
        put(route('admin.komplain.updateStatus', id), {
            data: { status: newStatus },
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
        <AdminLayout>
            <Head title="Manajemen Laporan Kerusakan" />

            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Wrench className="w-6 h-6 text-cozy-brown-500" />
                            Laporan Kerusakan
                        </h1>
                        <p className="mt-1 text-sm text-gray-600 dark:text-white">
                            Kelola komplain dan laporan kerusakan dari penyewa kos.
                        </p>
                    </div>
                </div>

                {flash?.message && (
                    <div className="bg-green-50 text-green-700 p-4 rounded-xl flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5" />
                        {flash.message}
                    </div>
                )}

                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-white">
                            <thead className="text-xs text-gray-700 dark:text-white uppercase bg-gray-50 dark:bg-slate-700 dark:text-white">
                                <tr>
                                    <th className="px-6 py-4">Waktu Laporan</th>
                                    <th className="px-6 py-4">Pelapor & Kamar</th>
                                    <th className="px-6 py-4">Masalah</th>
                                    <th className="px-6 py-4">Bukti Foto</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-center">Aksi Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {komplains.length > 0 ? (
                                    komplains.map((komplain) => (
                                        <tr key={komplain.id} className="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {new Date(komplain.created_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric', month: 'short', year: 'numeric',
                                                })}
                                                <div className="text-xs text-gray-400">
                                                    {new Date(komplain.created_at).toLocaleTimeString('id-ID', {
                                                        hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-gray-900 dark:text-white">
                                                    {komplain.penyewa?.user?.name}
                                                </div>
                                                <div className="text-xs text-cozy-brown-500 mt-1 font-medium bg-cozy-brown-50 dark:bg-slate-900/30 inline-block px-2 py-0.5 rounded">
                                                    Kamar {komplain.kamar?.nomor_kamar}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 max-w-xs">
                                                <div className="font-semibold text-gray-900 dark:text-white mb-1">
                                                    {komplain.judul_komplain}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-slate-400 truncate" title={komplain.deskripsi}>
                                                    {komplain.deskripsi}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {komplain.foto_kerusakan ? (
                                                    <button 
                                                        onClick={() => setSelectedImage(`/storage/${komplain.foto_kerusakan}`)}
                                                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-xs font-medium transition"
                                                    >
                                                        <Eye className="w-4 h-4" /> Lihat
                                                    </button>
                                                ) : (
                                                    <span className="text-gray-400 text-xs italic">Tidak ada foto</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(komplain.status)}
                                            </td>
                                            <td className="px-6 py-4 flex justify-center gap-2">
                                                {komplain.status === 'Menunggu' && (
                                                    <button
                                                        onClick={() => updateStatus(komplain.id, 'Diproses')}
                                                        disabled={processing}
                                                        className="px-3 py-1.5 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg text-xs font-semibold transition"
                                                    >
                                                        Proses
                                                    </button>
                                                )}
                                                {komplain.status === 'Diproses' && (
                                                    <button
                                                        onClick={() => updateStatus(komplain.id, 'Selesai')}
                                                        disabled={processing}
                                                        className="px-3 py-1.5 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg text-xs font-semibold transition"
                                                    >
                                                        Selesaikan
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500 dark:text-slate-400">
                                            <Wrench className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                                            Belum ada laporan kerusakan dari penyewa.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Image Preview */}
            {selectedImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedImage(null)}>
                    <div className="relative max-w-4xl max-h-screen">
                        <button 
                            className="absolute -top-4 -right-4 w-8 h-8 bg-white dark:bg-slate-800 text-black rounded-full flex items-center justify-center font-bold shadow-lg"
                            onClick={() => setSelectedImage(null)}
                        >
                            ×
                        </button>
                        <img src={selectedImage} alt="Preview Kerusakan" className="max-w-full max-h-[90vh] rounded-xl shadow-2xl object-contain" />
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
