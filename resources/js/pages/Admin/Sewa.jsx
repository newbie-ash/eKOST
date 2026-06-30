import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Sewa({ auth, sewas, kamars, penyewas }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        penyewa_id: '',
        kamar_id: '',
        tanggal_masuk: '',
        durasi_bulan: 1,
    });

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

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-amber-900 leading-tight">Manajemen Sewa Kos</h2>}
        >
            <Head title="Manajemen Sewa" />

            <div className="py-12 bg-amber-50 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-2xl font-bold text-amber-900">Riwayat & Status Sewa</h3>
                            <p className="text-amber-700 text-sm mt-1">Kelola data penyewaan kamar kos Anda</p>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-colors flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Penempatan Baru
                        </button>
                    </div>

                    {/* Table Section */}
                    <div className="bg-white overflow-hidden shadow-lg sm:rounded-xl border border-amber-100">
                        <div className="overflow-x-auto">
                            <table className="w-full whitespace-nowrap">
                                <thead>
                                    <tr className="bg-amber-100 text-amber-900 text-left text-sm font-semibold uppercase tracking-wider">
                                        <th className="px-6 py-4 rounded-tl-xl">Kamar</th>
                                        <th className="px-6 py-4">Penyewa</th>
                                        <th className="px-6 py-4">Tgl Masuk</th>
                                        <th className="px-6 py-4">Durasi</th>
                                        <th className="px-6 py-4">Status Sewa</th>
                                        <th className="px-6 py-4 rounded-tr-xl text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-amber-50">
                                    {sewas.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-8 text-center text-amber-500 italic">
                                                Belum ada data sewa.
                                            </td>
                                        </tr>
                                    ) : (
                                        sewas.map((sewa) => (
                                            <tr key={sewa.id} className="hover:bg-amber-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-sm">
                                                        Kamar {sewa.kamar?.nomor_kamar}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-semibold text-gray-900">{sewa.penyewa?.user?.name || 'Unknown'}</div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    {new Date(sewa.tanggal_masuk).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    {sewa.durasi_bulan} Bulan
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        sewa.status_sewa === 'Aktif' 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-gray-100 text-gray-800'
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
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Tambah Sewa */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        
                        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setIsModalOpen(false)}></div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full border border-amber-100">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-amber-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                        </svg>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                        <h3 className="text-lg leading-6 font-bold text-gray-900" id="modal-title">
                                            Penempatan Kamar Baru
                                        </h3>
                                        <div className="mt-4">
                                            <form onSubmit={submit} className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Pilih Penyewa</label>
                                                    <select 
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                                                        value={data.penyewa_id}
                                                        onChange={e => setData('penyewa_id', e.target.value)}
                                                        required
                                                    >
                                                        <option value="">-- Pilih Anak Kos --</option>
                                                        {penyewas.map(p => (
                                                            <option key={p.id} value={p.id}>{p.user?.name}</option>
                                                        ))}
                                                    </select>
                                                    {errors.penyewa_id && <p className="text-red-500 text-xs mt-1">{errors.penyewa_id}</p>}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Pilih Kamar Kosong</label>
                                                    <select 
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
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
                                                    <label className="block text-sm font-medium text-gray-700">Tanggal Masuk</label>
                                                    <input 
                                                        type="date"
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                                                        value={data.tanggal_masuk}
                                                        onChange={e => setData('tanggal_masuk', e.target.value)}
                                                        required
                                                    />
                                                    {errors.tanggal_masuk && <p className="text-red-500 text-xs mt-1">{errors.tanggal_masuk}</p>}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Durasi (Bulan)</label>
                                                    <input 
                                                        type="number"
                                                        min="1"
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
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
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-2xl border-t border-gray-200">
                                <button 
                                    type="button" 
                                    onClick={submit}
                                    disabled={processing}
                                    className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-amber-600 text-base font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Data'}
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setIsModalOpen(false)}
                                    className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                                >
                                    Batal
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
