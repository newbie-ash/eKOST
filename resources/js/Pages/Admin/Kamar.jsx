import React, { useState } from 'react';
import { 
    Plus, Edit, Trash2, X, AlertTriangle, Menu, 
    Home, BedDouble, Users, ReceiptText, LogOut 
} from 'lucide-react';
import { Link, Head, useForm } from '@inertiajs/react';

import AdminLayout from '@/Layouts/AdminLayout';

export default function Kamar({ kamars = [] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); 
    const [editingId, setEditingId] = useState(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);

    const { data, setData, post, delete: destroy, processing, reset, errors, clearErrors } = useForm({
        nomor_kamar: '',
        tipe_kamar: 'Standar',
        harga: 500000,
        status: 'kosong',
        deskripsi: '',
        link_maps: '',
        galeri_foto: [],
        _method: 'post',
    });

    // Handle auto-fill harga based on tipe_kamar
    const handleTipeKamarChange = (e) => {
        const selectedTipe = e.target.value;
        const autoHarga = selectedTipe === 'VIP' ? 1000000 : 500000;
        setData({ ...data, tipe_kamar: selectedTipe, harga: autoHarga });
    };

    const formatRupiah = (angka) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
    };

    const openAddModal = () => {
        clearErrors();
        reset(); 
        setModalMode('add');
        setIsModalOpen(true);
    };

    const openEditModal = (kamar) => {
        clearErrors();
        setData({
            nomor_kamar: kamar.nomor_kamar,
            tipe_kamar: kamar.tipe_kamar,
            harga: kamar.harga,
            status: kamar.status,
            deskripsi: kamar.deskripsi || '',
            link_maps: kamar.link_maps || '',
            galeri_foto: [],
            _method: 'put',
        });
        setEditingId(kamar.id);
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => { reset(); clearErrors(); setEditingId(null); }, 200); 
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        clearErrors();
        if (modalMode === 'add') {
            data._method = 'post';
            post('/admin/kamar', { onSuccess: closeModal });
        } else {
            post(`/admin/kamar/${editingId}`, { onSuccess: closeModal });
        }
    };

    const confirmDelete = (id) => setDeleteConfirmId(id);

    const executeDelete = () => {
        if (deleteConfirmId) {
            destroy(`/admin/kamar/${deleteConfirmId}`, {
                onSuccess: () => setDeleteConfirmId(null)
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Manajemen Kamar Kos" />

            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-2xl font-extrabold text-[#4A3B32] dark:text-white sm:hidden mb-1">Data Kamar</h2>
                        <p className="text-sm text-[#7D6B5D] dark:text-white">Kelola informasi kamar, harga, dan ketersediaan.</p>
                    </div>
                    <button
                        onClick={openAddModal}
                        className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 bg-[#8B5E3C] text-white rounded-xl font-semibold shadow-md shadow-[#8B5E3C]/20 hover:bg-[#6D462B] hover:shadow-lg transition-all duration-200"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Tambah Kamar
                    </button>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-[#E8E0D5] dark:border-slate-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-[#E8E0D5] dark:divide-slate-700">
                            <thead className="bg-[#FDFBF7] dark:bg-slate-900">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-[#7D6B5D] dark:text-white uppercase tracking-wider">No. Kamar</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-[#7D6B5D] dark:text-white uppercase tracking-wider">Tipe Kamar</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-[#7D6B5D] dark:text-white uppercase tracking-wider">Harga/Bulan</th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-[#7D6B5D] dark:text-white uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-[#7D6B5D] dark:text-white uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-slate-800 divide-y divide-[#F5F0E6] dark:divide-slate-700">
                                {kamars.length > 0 ? (
                                    kamars.map((kamar) => (
                                        <tr key={kamar.id} className="hover:bg-[#FAF6F0] dark:hover:bg-slate-700 transition-colors duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#4A3B32] dark:text-white">
                                                {kamar.nomor_kamar}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[#7D6B5D] dark:text-white">
                                                {kamar.tipe_kamar}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#8B5E3C] dark:text-orange-400">
                                                {formatRupiah(kamar.harga)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${
                                                    kamar.status === 'kosong' 
                                                        ? 'bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/30' 
                                                        : 'bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/30'
                                                }`}>
                                                    {kamar.status === 'kosong' ? 'Kosong' : 'Terisi'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                                <button 
                                                    onClick={() => openEditModal(kamar)} 
                                                    className="text-[#8B5E3C] dark:text-orange-400 hover:text-[#6D462B] dark:hover:text-orange-300 mr-3 p-2 rounded-lg hover:bg-[#F5F0E6] dark:hover:bg-slate-700 transition-colors"
                                                >
                                                    <Edit className="w-5 h-5 inline" />
                                                </button>
                                                <button 
                                                    onClick={() => confirmDelete(kamar.id)} 
                                                    className="text-red-500 hover:text-red-700 dark:hover:text-red-400 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                                                >
                                                    <Trash2 className="w-5 h-5 inline" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center">
                                            <BedDouble className="w-12 h-12 text-[#D3C6BC] mx-auto mb-3" />
                                            <p className="text-[#7D6B5D] dark:text-white text-sm">Belum ada data kamar.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[60] overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
                        <div className="fixed inset-0 bg-[#4A3B32]/40 backdrop-blur-sm transition-opacity" onClick={closeModal}></div>

                        <div className="relative inline-block align-bottom bg-white dark:bg-slate-800 rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
                            <form onSubmit={handleSubmit}>
                                <div className="bg-white dark:bg-slate-800 px-6 pt-6 pb-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xl font-bold text-[#4A3B32] dark:text-white">
                                            {modalMode === 'add' ? 'Tambah Kamar Baru' : 'Edit Data Kamar'}
                                        </h3>
                                        <button type="button" onClick={closeModal} className="text-[#D3C6BC] hover:text-[#8B5E3C] dark:text-orange-400 bg-transparent hover:bg-[#FAF6F0] dark:hover:bg-slate-700 rounded-full p-1 transition">
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>
                                    
                                    <div className="space-y-5">
                                        <div>
                                            <label className="block text-sm font-semibold text-[#7D6B5D] dark:text-white mb-1">Nomor Kamar</label>
                                            <input
                                                type="text" required placeholder="Contoh: A-01"
                                                className={`w-full bg-[#FAF6F0] dark:bg-slate-700 border ${errors.nomor_kamar ? 'border-red-500 focus:ring-red-500 shadow-sm' : 'border-[#E8E0D5] dark:border-slate-700 focus:ring-[#8B5E3C]'} text-[#4A3B32] dark:text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2`}
                                                value={data.nomor_kamar} onChange={e => setData('nomor_kamar', e.target.value)}
                                            />
                                            {errors.nomor_kamar && (
                                                <span className="text-red-500 text-xs mt-1 block font-medium">{errors.nomor_kamar}</span>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-[#7D6B5D] dark:text-white mb-1">Tipe Kamar</label>
                                            <select
                                                className={`w-full bg-[#FAF6F0] dark:bg-slate-700 border ${errors.tipe_kamar ? 'border-red-500 focus:ring-red-500 shadow-sm' : 'border-[#E8E0D5] dark:border-slate-700 focus:ring-[#8B5E3C]'} text-[#4A3B32] dark:text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2`}
                                                value={data.tipe_kamar} onChange={handleTipeKamarChange}
                                            >
                                                <option value="Standar">Standar</option>
                                                <option value="VIP">VIP</option>
                                            </select>
                                            {errors.tipe_kamar && (
                                                <span className="text-red-500 text-xs mt-1 block font-medium">{errors.tipe_kamar}</span>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-[#7D6B5D] dark:text-white mb-1">Harga Per Bulan (Rp)</label>
                                            <input
                                                type="number" required min="0" placeholder="Otomatis terisi"
                                                className={`w-full bg-[#E8E0D5] border ${errors.harga ? 'border-red-500 focus:ring-red-500 shadow-sm' : 'border-[#D3C6BC]'} text-[#7D6B5D] dark:text-white rounded-xl px-4 py-2.5 focus:outline-none cursor-not-allowed`}
                                                value={data.harga} readOnly
                                            />
                                            {errors.harga && (
                                                <span className="text-red-500 text-xs mt-1 block font-medium">{errors.harga}</span>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-[#7D6B5D] dark:text-white mb-1">Status Kamar</label>
                                            <select
                                                className={`w-full bg-[#FAF6F0] dark:bg-slate-700 border ${errors.status ? 'border-red-500 focus:ring-red-500 shadow-sm' : 'border-[#E8E0D5] dark:border-slate-700 focus:ring-[#8B5E3C]'} text-[#4A3B32] dark:text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2`}
                                                value={data.status} onChange={e => setData('status', e.target.value)}
                                            >
                                                <option value="kosong">Kosong</option>
                                                <option value="terisi">Terisi</option>
                                            </select>
                                            {errors.status && (
                                                <span className="text-red-500 text-xs mt-1 block font-medium">{errors.status}</span>
                                            )}
                                        </div>

                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-semibold text-[#7D6B5D] dark:text-white mb-1">Deskripsi Kamar</label>
                                            <textarea
                                                rows="3" placeholder="Fasilitas, keunggulan kamar..."
                                                className={`w-full bg-[#FAF6F0] dark:bg-slate-700 border ${errors.deskripsi ? 'border-red-500 focus:ring-red-500 shadow-sm' : 'border-[#E8E0D5] dark:border-slate-700 focus:ring-[#8B5E3C]'} text-[#4A3B32] dark:text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2`}
                                                value={data.deskripsi} onChange={e => setData('deskripsi', e.target.value)}
                                            ></textarea>
                                            {errors.deskripsi && (
                                                <span className="text-red-500 text-xs mt-1 block font-medium">{errors.deskripsi}</span>
                                            )}
                                        </div>

                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-semibold text-[#7D6B5D] dark:text-white mb-1">Link Embed Maps (Opsional)</label>
                                            <input
                                                type="text" placeholder="<iframe src=..."
                                                className={`w-full bg-[#FAF6F0] dark:bg-slate-700 border ${errors.link_maps ? 'border-red-500 focus:ring-red-500 shadow-sm' : 'border-[#E8E0D5] dark:border-slate-700 focus:ring-[#8B5E3C]'} text-[#4A3B32] dark:text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2`}
                                                value={data.link_maps} onChange={e => setData('link_maps', e.target.value)}
                                            />
                                            {errors.link_maps && (
                                                <span className="text-red-500 text-xs mt-1 block font-medium">{errors.link_maps}</span>
                                            )}
                                        </div>

                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-semibold text-[#7D6B5D] dark:text-white mb-1">Galeri Foto (Pilih beberapa sekaligus)</label>
                                            <input
                                                type="file" multiple accept="image/*"
                                                className={`w-full bg-[#FAF6F0] dark:bg-slate-700 border ${errors.galeri_foto ? 'border-red-500 focus:ring-red-500 shadow-sm' : 'border-[#E8E0D5] dark:border-slate-700 focus:ring-[#8B5E3C]'} text-[#4A3B32] dark:text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2`}
                                                onChange={e => setData('galeri_foto', Array.from(e.target.files))}
                                            />
                                            {errors.galeri_foto && (
                                                <span className="text-red-500 text-xs mt-1 block font-medium">{errors.galeri_foto}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-[#FAF6F0] dark:bg-slate-700 px-6 py-4 border-t border-[#E8E0D5] dark:border-slate-700 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                                    <button
                                        type="button" onClick={closeModal}
                                        className="w-full sm:w-auto px-5 py-2.5 bg-white dark:bg-slate-800 border border-[#D3C6BC] text-[#7D6B5D] dark:text-white font-semibold rounded-xl hover:bg-[#F5F0E6] dark:hover:bg-slate-700 transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit" disabled={processing}
                                        className="w-full sm:w-auto px-5 py-2.5 bg-[#8B5E3C] text-white font-semibold rounded-xl hover:bg-[#6D462B] shadow-sm shadow-[#8B5E3C]/30 disabled:opacity-50"
                                    >
                                        {processing ? 'Menyimpan...' : 'Simpan Data'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {deleteConfirmId && (
                <div className="fixed inset-0 z-[60] overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
                        <div className="fixed inset-0 bg-[#4A3B32]/40 backdrop-blur-sm transition-opacity" onClick={() => setDeleteConfirmId(null)}></div>
                        
                        <div className="relative inline-block align-bottom bg-white dark:bg-slate-800 rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm w-full p-6">
                            <div className="sm:flex sm:items-start">
                                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                    <AlertTriangle className="h-6 w-6 text-red-600" />
                                </div>
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <h3 className="text-lg font-bold text-[#4A3B32] dark:text-white">Hapus Kamar</h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-[#7D6B5D] dark:text-white">
                                            Yakin mau menghapus data kamar ini? Data yang terhapus tidak bisa dikembalikan.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                                <button
                                    type="button" onClick={() => setDeleteConfirmId(null)}
                                    className="w-full sm:w-auto px-5 py-2.5 bg-white dark:bg-slate-800 border border-[#D3C6BC] text-[#7D6B5D] dark:text-white font-semibold rounded-xl hover:bg-[#F5F0E6] dark:hover:bg-slate-700"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button" onClick={executeDelete} disabled={processing}
                                    className="w-full sm:w-auto px-5 py-2.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 shadow-sm shadow-red-600/30 disabled:opacity-50"
                                >
                                    {processing ? 'Menghapus...' : 'Ya, Hapus'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}