import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Sewa({ sewas, kamars, penyewas }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('aktif');
    const { data, setData, post, processing, errors, reset } = useForm({
        nama_penyewa: '',
        kamar_id: '',
        tanggal_masuk: '',
        durasi_bulan: 1,
    });

    const sewaMenunggu = sewas.filter(s => s.status_sewa === 'Menunggu Konfirmasi');
    const sewaAktif = sewas.filter(s => s.status_sewa !== 'Menunggu Konfirmasi');

    const submit = (e) => {
        e.preventDefault();
        post('/admin/sewa', {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            }
        });
    };

    const handleAkhiriSewa = (id) => {
        if (confirm('Yakin ingin mengakhiri sewa ini? Status kamar akan kembali kosong.')) {
            router.delete(`/admin/sewa/${id}`);
        }
    };

    const handleTerima = (id) => {
        if (confirm('Terima pengajuan sewa ini?')) {
            router.post(`/admin/sewa/${id}/terima`);
        }
    };

    const handleTolak = (id) => {
        if (confirm('Tolak pengajuan sewa ini?')) {
            router.post(`/admin/sewa/${id}/tolak`);
        }
    };

    const currentData = activeTab === 'aktif' ? sewaAktif : sewaMenunggu;

    return (
        <AdminLayout>
            <Head title="Manajemen Sewa" />

            {/* Header Section */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-2xl font-bold text-[#8B5E3C] dark:text-orange-400">Riwayat & Status Sewa</h3>
                    <p className="text-[#7D6B5D] dark:text-white text-sm mt-1">Kelola data penyewaan kamar kos Anda</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#8B5E3C] hover:bg-[#7D6B5D] text-white font-bold py-2 px-6 rounded-lg shadow-md transition-colors flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Penempatan Baru
                </button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-4 mb-6 border-b border-[#E8E0D5] dark:border-slate-700">
                <button
                    onClick={() => setActiveTab('aktif')}
                    className={`py-2 px-4 font-semibold text-sm transition-colors border-b-2 ${
                        activeTab === 'aktif' 
                        ? 'border-[#8B5E3C] text-[#8B5E3C] dark:text-orange-400' 
                        : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:text-white'
                    }`}
                >
                    Sewa Aktif & Riwayat
                </button>
                <button
                    onClick={() => setActiveTab('menunggu')}
                    className={`py-2 px-4 font-semibold text-sm transition-colors border-b-2 flex items-center gap-2 ${
                        activeTab === 'menunggu' 
                        ? 'border-amber-600 text-amber-700' 
                        : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:text-white'
                    }`}
                >
                    Menunggu Konfirmasi
                    {sewaMenunggu.length > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{sewaMenunggu.length}</span>
                    )}
                </button>
            </div>

            {/* Table Section */}
            <div className="bg-white dark:bg-slate-800 overflow-hidden shadow-sm sm:rounded-xl border border-[#E8E0D5] dark:border-slate-700">
                <div className="overflow-x-auto">
                    <table className="w-full whitespace-nowrap">
                        <thead>
                            <tr className="bg-[#FAF6F0] dark:bg-slate-700 text-[#8B5E3C] dark:text-orange-400 text-left text-sm font-semibold uppercase tracking-wider border-b border-[#E8E0D5] dark:border-slate-700">
                                <th className="px-6 py-4 rounded-tl-xl text-center">Kamar</th>
                                <th className="px-6 py-4">Penyewa</th>
                                <th className="px-6 py-4">Tgl Masuk</th>
                                <th className="px-6 py-4">Durasi</th>
                                <th className="px-6 py-4 text-center">Status Sewa</th>
                                <th className="px-6 py-4 rounded-tr-xl text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E8E0D5] dark:divide-slate-700">
                            {currentData.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-[#7D6B5D] dark:text-white italic">
                                        Belum ada data sewa.
                                    </td>
                                </tr>
                            ) : (
                                currentData.map((sewa) => (
                                    <tr key={sewa.id} className="hover:bg-[#FAF6F0] dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-[#F5F0E6] dark:bg-slate-700 text-[#8B5E3C] dark:text-orange-400 font-bold text-sm">
                                                Kamar {sewa.kamar?.nomor_kamar}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-900 dark:text-white">{sewa.penyewa?.user?.name || 'Unknown'}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-slate-300">
                                            {new Date(sewa.tanggal_masuk).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-slate-300">
                                            {sewa.durasi_bulan} Bulan
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                sewa.status_sewa === 'Aktif' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : sewa.status_sewa === 'Menunggu Konfirmasi'
                                                    ? 'bg-amber-100 text-amber-800'
                                                    : 'bg-gray-100 text-gray-800 dark:text-white'
                                            }`}>
                                                {sewa.status_sewa}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {sewa.status_sewa === 'Aktif' && (
                                                <button 
                                                    onClick={() => handleAkhiriSewa(sewa.id)}
                                                    className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                                                >
                                                    Akhiri Sewa
                                                </button>
                                            )}
                                            {sewa.status_sewa === 'Menunggu Konfirmasi' && (
                                                <div className="flex justify-center gap-2">
                                                    <button 
                                                        onClick={() => handleTerima(sewa.id)}
                                                        className="text-green-700 bg-green-100 hover:bg-green-200 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                                                    >
                                                        Terima
                                                    </button>
                                                    <button 
                                                        onClick={() => handleTolak(sewa.id)}
                                                        className="text-red-700 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                                                    >
                                                        Tolak
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Tambah Sewa */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        
                        <div className="fixed inset-0 bg-[#372213]/40 backdrop-blur-sm transition-opacity" aria-hidden="true" onClick={() => setIsModalOpen(false)}></div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white dark:bg-slate-800 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full border border-[#E8E0D5] dark:border-slate-700">
                            <div className="bg-white dark:bg-slate-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-[#F5F0E6] dark:bg-slate-700 sm:mx-0 sm:h-10 sm:w-10">
                                        <svg className="h-6 w-6 text-[#8B5E3C] dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                        </svg>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                        <h3 className="text-lg leading-6 font-bold text-gray-900 dark:text-white" id="modal-title">
                                            Penempatan Kamar Baru
                                        </h3>
                                        <div className="mt-4">
                                            <form onSubmit={submit} className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-white">Nama Penyewa</label>
                                                    <input 
                                                        type="text"
                                                        list="penyewa-list"
                                                        placeholder="Ketik nama atau pilih..."
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8B5E3C] focus:ring-[#8B5E3C] sm:text-sm"
                                                        value={data.nama_penyewa}
                                                        onChange={e => setData('nama_penyewa', e.target.value)}
                                                        required
                                                    />
                                                    <datalist id="penyewa-list">
                                                        {penyewas.map(p => (
                                                            <option key={p.id} value={p.user?.name} />
                                                        ))}
                                                    </datalist>
                                                    {errors.nama_penyewa && <p className="text-red-500 text-xs mt-1">{errors.nama_penyewa}</p>}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-white">Pilih Kamar Kosong</label>
                                                    <select 
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8B5E3C] focus:ring-[#8B5E3C] sm:text-sm"
                                                        value={data.kamar_id}
                                                        onChange={e => setData('kamar_id', e.target.value)}
                                                        required
                                                    >
                                                        <option value="">-- Pilih Kamar --</option>
                                                        {kamars.map(k => (
                                                            <option key={k.id} value={k.id}>Kamar {k.nomor_kamar} - Rp {k.harga.toLocaleString('id-ID')}</option>
                                                        ))}
                                                    </select>
                                                    {errors.kamar_id && <p className="text-red-500 text-xs mt-1">{errors.kamar_id}</p>}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-white">Tanggal Masuk</label>
                                                    <input 
                                                        type="date"
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8B5E3C] focus:ring-[#8B5E3C] sm:text-sm"
                                                        value={data.tanggal_masuk}
                                                        onChange={e => setData('tanggal_masuk', e.target.value)}
                                                        required
                                                    />
                                                    {errors.tanggal_masuk && <p className="text-red-500 text-xs mt-1">{errors.tanggal_masuk}</p>}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-white">Durasi (Bulan)</label>
                                                    <input 
                                                        type="number"
                                                        min="1"
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8B5E3C] focus:ring-[#8B5E3C] sm:text-sm"
                                                        value={data.durasi_bulan}
                                                        onChange={e => setData('durasi_bulan', e.target.value)}
                                                        required
                                                    />
                                                    {errors.durasi_bulan && <p className="text-red-500 text-xs mt-1">{errors.durasi_bulan}</p>}
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-2xl border-t border-[#E8E0D5] dark:border-slate-700">
                                <button 
                                    type="button" 
                                    onClick={submit}
                                    disabled={processing}
                                    className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-[#8B5E3C] text-base font-medium text-white hover:bg-[#7D6B5D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B5E3C] sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Data'}
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setIsModalOpen(false)}
                                    className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white dark:bg-slate-800 text-base font-medium text-gray-700 dark:text-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B5E3C] sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                                >
                                    Batal
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
