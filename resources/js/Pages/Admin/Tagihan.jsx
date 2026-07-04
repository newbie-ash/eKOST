import React, { useState } from 'react';
import { 
    Plus, Trash2, X, AlertTriangle, Menu, 
    Home, BedDouble, Users, ReceiptText, LogOut, CheckCircle, Clock, Eye, Download, Search, DollarSign
} from 'lucide-react';
import { Head, useForm, Link, router } from '@inertiajs/react';

import AdminLayout from '@/Layouts/AdminLayout';

export default function Tagihan({ tagihans = [], sewas = [] }) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);
    const [statusFilter, setStatusFilter] = useState('Semua');
    const [searchTerm, setSearchTerm] = useState('');
    const [viewProofUrl, setViewProofUrl] = useState(null);

    const { data, setData, post, put, delete: destroy, processing, reset, errors, clearErrors } = useForm({
        sewa_id: '',
        bulan_tagihan: new Date().toISOString().slice(0, 7),
        jumlah_bayar: '',
    });

    const openAddModal = () => {
        clearErrors();
        reset();
        setIsAddModalOpen(true);
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
        setTimeout(() => reset(), 200);
    };

    const handleSewaChange = (sewaId) => {
        setData(prev => {
            const updated = { ...prev, sewa_id: sewaId };
            // Auto fill jumlah tagihan berdasarkan harga sewa kamar yang dipilih
            const selectedSewa = sewas.find(s => s.id.toString() === sewaId.toString());
            if (selectedSewa && selectedSewa.kamar) {
                updated.jumlah_bayar = selectedSewa.kamar.harga;
            } else {
                updated.jumlah_bayar = '';
            }
            return updated;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/tagihan', { 
            onSuccess: () => closeAddModal(),
        });
    };

    // Update status pembayaran (Lunas / Belum Bayar)
    const handleUpdateStatus = (id, newStatus) => {
        router.put(`/admin/tagihan/${id}`, {
            status_lunas: newStatus === 'Lunas' ? true : false
        });
    };

    const confirmDelete = (id) => setDeleteConfirmId(id);

    const executeDelete = () => {
        if (deleteConfirmId) {
            destroy(`/admin/tagihan/${deleteConfirmId}`, {
                onSuccess: () => setDeleteConfirmId(null)
            });
        }
    };

    const filteredTagihans = tagihans.filter((tagihan) => {
        const query = searchTerm.toLowerCase();
        const matchesSearch = 
            (tagihan.sewa?.kamar?.nomor_kamar && tagihan.sewa.kamar.nomor_kamar.toLowerCase().includes(query)) ||
            (tagihan.sewa?.penyewa?.user?.name && tagihan.sewa.penyewa.user.name.toLowerCase().includes(query)) ||
            tagihan.bulan_tagihan.toLowerCase().includes(query);

        const statusLabel = tagihan.status_lunas ? 'Lunas' : 'Belum Bayar';
        const matchesStatus = 
            statusFilter === 'Semua' || 
            statusLabel === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    };

    const listBulan = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    return (
        <AdminLayout>
            <Head title="Kelola Tagihan Kos" />

            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-cozy-cream-200 dark:border-slate-700 shadow-sm">
                    <div>
                        <h2 className="text-2xl font-bold text-cozy-brown-900 dark:text-white mb-1">Tagihan Penyewa Kos</h2>
                        <p className="text-sm text-cozy-brown-400 dark:text-white">Terbitkan tagihan bulanan dan kelola verifikasi pembayaran anak kos.</p>
                    </div>
                    <button
                        onClick={openAddModal}
                        disabled={sewas.length === 0}
                        className="w-full md:w-auto inline-flex items-center justify-center px-5 py-3 bg-cozy-brown-500 text-white rounded-xl font-semibold shadow-md shadow-cozy-brown-500/10 hover:bg-cozy-brown-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Buat Tagihan Baru
                    </button>
                </div>

                {/* Filter and Search Action bar */}
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full bg-white dark:bg-slate-800 p-4 rounded-xl border border-cozy-cream-200 dark:border-slate-700 shadow-sm">
                    {/* Search bar */}
                    <div className="relative w-full sm:flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cozy-brown-300" />
                        <input
                            type="text"
                            placeholder="Cari kamar, nama anak kos, bulan..."
                            className="w-full pl-10 pr-4 py-2.5 bg-cozy-cream-50 dark:bg-slate-900 border border-cozy-cream-200 dark:border-slate-700 rounded-lg text-sm text-cozy-brown-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cozy-brown-500/35 focus:border-cozy-brown-500 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-cozy-brown-300">
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Dropdown Filter Status */}
                    <div className="flex gap-2 w-full sm:w-auto justify-end">
                        {['Semua', 'Belum Bayar', 'Lunas'].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setStatusFilter(filter)}
                                className={`px-4 py-2 rounded-lg text-xs font-semibold border transition ${
                                    statusFilter === filter 
                                    ? 'bg-cozy-cream-100 dark:bg-slate-800 text-cozy-brown-500 border-cozy-cream-300' 
                                    : 'bg-white dark:bg-slate-800 text-cozy-brown-400 dark:text-white border-cozy-cream-200 dark:border-slate-700 hover:bg-cozy-cream-50 dark:bg-slate-900'
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table / List Section */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-cozy-cream-200 dark:border-slate-700 overflow-hidden">
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="min-w-full divide-y divide-cozy-cream-200 dark:divide-slate-700">
                            <thead className="bg-cozy-cream-50 dark:bg-slate-900">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-cozy-brown-400 dark:text-white uppercase tracking-wider">Kamar & Nama</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-cozy-brown-400 dark:text-white uppercase tracking-wider">Bulan Tagihan</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-cozy-brown-400 dark:text-white uppercase tracking-wider">Jumlah Tagihan</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-cozy-brown-400 dark:text-white uppercase tracking-wider">Status & Bukti</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-cozy-brown-400 dark:text-white uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-slate-800 divide-y divide-cozy-cream-100">
                                {filteredTagihans.length > 0 ? (
                                    filteredTagihans.map((tagihan) => (
                                        <tr key={tagihan.id} className="hover:bg-cozy-cream-50 dark:bg-slate-900/50 transition-colors duration-150">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-bold text-cozy-brown-900 dark:text-white">Kamar {tagihan.sewa?.kamar?.nomor_kamar}</div>
                                                <div className="text-xs text-cozy-brown-400 dark:text-white font-medium">{tagihan.sewa?.penyewa?.user?.name}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-cozy-brown-900 dark:text-white font-semibold">
                                                {tagihan.bulan_tagihan}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-cozy-brown-900 dark:text-white font-bold">
                                                {formatRupiah(tagihan.jumlah_bayar)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-cozy-brown-900 dark:text-white">
                                                <div className="flex items-center space-x-2">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                                                        tagihan.status_lunas
                                                        ? 'bg-green-50 text-green-700 border border-green-100' 
                                                        : 'bg-orange-50 text-orange-700 border border-orange-100'
                                                    }`}>
                                                        {tagihan.status_lunas ? (
                                                            <CheckCircle className="w-3 h-3 mr-1.5" />
                                                        ) : (
                                                            <Clock className="w-3 h-3 mr-1.5" />
                                                        )}
                                                        {tagihan.status_lunas ? 'Lunas' : 'Belum Bayar'}
                                                    </span>
                                                    
                                                    {/* Bukti Bayar */}
                                                    {tagihan.bukti_transfer && (
                                                        <button 
                                                            onClick={() => setViewProofUrl(`/storage/${tagihan.bukti_transfer}`)}
                                                            className="inline-flex items-center text-xs font-semibold text-cozy-brown-500 hover:text-cozy-brown-700 hover:bg-cozy-cream-100 dark:bg-slate-800 px-2 py-1 rounded transition"
                                                        >
                                                            <Eye className="w-3.5 h-3.5 mr-1" />
                                                            Struk
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                                                {!tagihan.status_lunas ? (
                                                    <button 
                                                        onClick={() => handleUpdateStatus(tagihan.id, 'Lunas')}
                                                        className="text-green-600 hover:bg-green-50 border border-transparent hover:border-green-200 px-2.5 py-1.5 rounded-lg text-xs font-bold transition"
                                                    >
                                                        Set Lunas
                                                    </button>
                                                ) : (
                                                    <button 
                                                        onClick={() => handleUpdateStatus(tagihan.id, 'Belum Bayar')}
                                                        className="text-orange-600 hover:bg-orange-50 border border-transparent hover:border-orange-200 px-2.5 py-1.5 rounded-lg text-xs font-bold transition"
                                                    >
                                                        Batalkan Lunas
                                                    </button>
                                                )}
                                                <button 
                                                    onClick={() => confirmDelete(tagihan.id)}
                                                    className="text-red-500 hover:text-red-700 dark:hover:text-red-400 p-2 rounded-lg transition"
                                                    title="Hapus Tagihan"
                                                >
                                                    <Trash2 className="w-4 h-4 inline" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center">
                                            <ReceiptText className="w-12 h-12 text-cozy-cream-400 mx-auto mb-3" />
                                            <p className="text-cozy-brown-500 text-sm font-medium">Data tagihan tidak ditemukan.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card-List View */}
                    <div className="block md:hidden divide-y divide-cozy-cream-200 dark:divide-slate-700">
                        {filteredTagihans.length > 0 ? (
                            filteredTagihans.map((tagihan) => (
                                <div key={tagihan.id} className="p-4 space-y-3 bg-white dark:bg-slate-800 hover:bg-cozy-cream-50 dark:bg-slate-900/50 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="text-sm font-bold text-cozy-brown-900 dark:text-white">Kamar {tagihan.sewa?.kamar?.nomor_kamar}</h4>
                                            <p className="text-xs text-cozy-brown-400 dark:text-white">{tagihan.sewa?.penyewa?.user?.name}</p>
                                        </div>
                                        <button 
                                            onClick={() => confirmDelete(tagihan.id)} 
                                            className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 p-1.5 rounded-lg transition"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-xs bg-cozy-cream-50 dark:bg-slate-900 p-3 rounded-lg border border-cozy-cream-200 dark:border-slate-700">
                                        <div>
                                            <span className="block text-cozy-brown-400 dark:text-white font-medium mb-0.5">Bulan</span>
                                            <span className="text-cozy-brown-900 dark:text-white font-bold">{tagihan.bulan_tagihan}</span>
                                        </div>
                                        <div>
                                            <span className="block text-cozy-brown-400 dark:text-white font-medium mb-0.5">Jumlah</span>
                                            <span className="text-cozy-brown-900 dark:text-white font-extrabold">{formatRupiah(tagihan.jumlah_bayar)}</span>
                                        </div>
                                        <div>
                                            <span className="block text-cozy-brown-400 dark:text-white font-medium mb-0.5">Status</span>
                                            <span className={`inline-flex items-center font-bold ${
                                                tagihan.status_lunas ? 'text-green-700' : 'text-orange-700'
                                            }`}>
                                                {tagihan.status_lunas ? 'Lunas' : 'Belum Bayar'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="block text-cozy-brown-400 dark:text-white font-medium mb-0.5 font-bold">Bukti Transfer</span>
                                            {tagihan.bukti_transfer ? (
                                                <button 
                                                    onClick={() => setViewProofUrl(`/storage/${tagihan.bukti_transfer}`)}
                                                    className="text-cozy-brown-500 font-bold underline"
                                                >
                                                    Lihat Struk
                                                </button>
                                            ) : (
                                                <span className="text-cozy-brown-300">Belum diupload</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        {!tagihan.status_lunas ? (
                                            <button 
                                                onClick={() => handleUpdateStatus(tagihan.id, 'Lunas')}
                                                className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold shadow-sm transition"
                                            >
                                                Tandai Lunas
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => handleUpdateStatus(tagihan.id, 'Belum Bayar')}
                                                className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold shadow-sm transition"
                                            >
                                                Batalkan Lunas
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center bg-white dark:bg-slate-800">
                                <ReceiptText className="w-10 h-10 text-cozy-cream-400 mx-auto mb-2" />
                                <p className="text-cozy-brown-500 text-sm font-medium">Data tagihan tidak ditemukan.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Invoice Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[60] overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
                        <div className="fixed inset-0 bg-[#372213]/40 backdrop-blur-sm transition-opacity" onClick={closeAddModal}></div>

                        <div className="relative inline-block align-bottom bg-white dark:bg-slate-800 rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md w-full">
                            <form onSubmit={handleSubmit}>
                                <div className="bg-white dark:bg-slate-800 px-6 pt-6 pb-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xl font-bold text-cozy-brown-900 dark:text-white">Buat Tagihan Baru</h3>
                                        <button 
                                            type="button" 
                                            onClick={closeAddModal} 
                                            className="text-cozy-brown-300 hover:text-cozy-brown-500 bg-transparent hover:bg-cozy-cream-100 dark:bg-slate-800 rounded-full p-1 transition"
                                        >
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {/* Pilih Sewa Kamar Aktif */}
                                        <div>
                                            <label className="block text-sm font-semibold text-cozy-brown-400 dark:text-white mb-1">Pilih Penempatan Sewa</label>
                                            <select
                                                required
                                                className={`w-full bg-cozy-cream-50 dark:bg-slate-900 border ${errors?.sewa_id ? 'border-orange-400' : 'border-cozy-cream-200 dark:border-slate-700'} text-cozy-brown-900 dark:text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cozy-brown-500/20 focus:border-cozy-brown-500`}
                                                value={data.sewa_id}
                                                onChange={e => handleSewaChange(e.target.value)}
                                            >
                                                <option value="">-- Pilih Kamar & Penghuni --</option>
                                                {sewas.map((sewa) => (
                                                    <option key={sewa.id} value={sewa.id}>
                                                        Kamar {sewa.kamar?.nomor_kamar} - {sewa.penyewa?.user?.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors?.sewa_id && <span className="text-orange-600 text-xs mt-1 block font-medium">{errors.sewa_id}</span>}
                                        </div>

                                        <div className="grid grid-cols-1 gap-4">
                                            {/* Bulan Tagihan */}
                                            <div>
                                                <label className="block text-sm font-semibold text-cozy-brown-400 dark:text-white mb-1">Bulan & Tahun (Pilih dari kalender)</label>
                                                <input
                                                    type="month"
                                                    required
                                                    className="w-full bg-cozy-cream-50 dark:bg-slate-900 border border-cozy-cream-200 dark:border-slate-700 text-cozy-brown-900 dark:text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cozy-brown-500/20 focus:border-cozy-brown-500"
                                                    value={data.bulan_tagihan}
                                                    onChange={e => setData('bulan_tagihan', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        {/* Jumlah Tagihan */}
                                        <div>
                                            <label className="block text-sm font-semibold text-cozy-brown-400 dark:text-white mb-1">Jumlah Tagihan (Nominal Rupiah)</label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-cozy-brown-400 dark:text-white">Rp</div>
                                                <input
                                                    type="number"
                                                    required
                                                    placeholder="Jumlah Tagihan"
                                                    className={`w-full pl-9 pr-4 py-2.5 bg-cozy-cream-50 dark:bg-slate-900 border ${errors?.jumlah_bayar ? 'border-orange-400' : 'border-cozy-cream-200 dark:border-slate-700'} text-cozy-brown-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-cozy-brown-500/20 focus:border-cozy-brown-500`}
                                                    value={data.jumlah_bayar}
                                                    onChange={e => setData('jumlah_bayar', e.target.value)}
                                                />
                                            </div>
                                            <span className="text-[10px] text-cozy-brown-400 dark:text-white mt-1 block">
                                                *Otomatis terisi sesuai harga sewa bulanan kamar yang dipilih.
                                            </span>
                                            {errors?.jumlah_bayar && <span className="text-orange-600 text-xs mt-1 block font-medium">{errors.jumlah_bayar}</span>}
                                        </div>
                                    </div>
                                </div>

                                {/* Modal Actions */}
                                <div className="bg-cozy-cream-50 dark:bg-slate-900 px-6 py-4 border-t border-cozy-cream-200 dark:border-slate-700 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                                    <button
                                        type="button" 
                                        onClick={closeAddModal}
                                        className="w-full sm:w-auto px-5 py-2.5 bg-white dark:bg-slate-800 border border-cozy-cream-300 text-cozy-brown-400 dark:text-white font-semibold rounded-xl hover:bg-cozy-cream-100 dark:bg-slate-800 transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit" 
                                        disabled={processing}
                                        className="w-full sm:w-auto px-5 py-2.5 bg-cozy-brown-500 text-white font-semibold rounded-xl hover:bg-cozy-brown-600 shadow-md shadow-cozy-brown-500/10 disabled:opacity-50"
                                    >
                                        {processing ? 'Menyimpan...' : 'Terbitkan Tagihan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Proof of Payment Viewer Modal */}
            {viewProofUrl && (
                <div className="fixed inset-0 z-[70] overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
                        <div className="fixed inset-0 bg-[#372213]/40 backdrop-blur-sm transition-opacity" onClick={() => setViewProofUrl(null)}></div>
                        
                        <div className="relative inline-block align-bottom bg-white dark:bg-slate-800 rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-cozy-brown-900 dark:text-white">Bukti Transfer Struk</h3>
                                <button onClick={() => setViewProofUrl(null)} className="text-cozy-brown-300 hover:text-cozy-brown-500">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            
                            <div className="bg-cozy-cream-50 dark:bg-slate-900 border border-cozy-cream-200 dark:border-slate-700 rounded-xl overflow-hidden flex items-center justify-center p-2 max-h-[400px]">
                                <img 
                                    src={viewProofUrl} 
                                    alt="Bukti Pembayaran Struk"
                                    className="max-h-[380px] object-contain rounded-lg shadow-sm"
                                />
                            </div>
                            
                            <div className="mt-6 flex justify-end">
                                <button
                                    type="button" 
                                    onClick={() => setViewProofUrl(null)}
                                    className="px-5 py-2 bg-cozy-brown-500 text-white font-semibold rounded-xl hover:bg-cozy-brown-600 transition"
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirmId && (
                <div className="fixed inset-0 z-[60] overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
                        <div className="fixed inset-0 bg-[#372213]/40 backdrop-blur-sm transition-opacity" onClick={() => setDeleteConfirmId(null)}></div>
                        
                        <div className="relative inline-block align-bottom bg-white dark:bg-slate-800 rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm w-full p-6">
                            <div className="sm:flex sm:items-start">
                                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                    <AlertTriangle className="h-6 w-6 text-red-600" />
                                </div>
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <h3 className="text-lg font-bold text-cozy-brown-900 dark:text-white">Hapus Tagihan</h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-cozy-brown-400 dark:text-white">
                                            Apakah Anda yakin ingin menghapus tagihan bulanan ini secara permanen dari sistem keuangan?
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                                <button
                                    type="button" 
                                    onClick={() => setDeleteConfirmId(null)}
                                    className="w-full sm:w-auto px-5 py-2.5 bg-white dark:bg-slate-800 border border-cozy-cream-300 text-cozy-brown-400 dark:text-white font-semibold rounded-xl hover:bg-cozy-cream-100 dark:bg-slate-800"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button" 
                                    onClick={executeDelete} 
                                    disabled={processing}
                                    className="w-full sm:w-auto px-5 py-2.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 shadow-md shadow-red-600/10 disabled:opacity-50"
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
