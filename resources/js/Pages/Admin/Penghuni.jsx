import React, { useState } from 'react';
import { 
    Plus, Trash2, X, AlertTriangle, Menu, 
    Home, BedDouble, Users, ReceiptText, LogOut, Mail, Phone, Search, MessageSquare, ShieldAlert
} from 'lucide-react';
import { Head, useForm, Link } from '@inertiajs/react';

import AdminLayout from '@/Layouts/AdminLayout';

export default function Penghuni({ penghunis = [] }) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Form Inertia untuk menambah data
    const { data, setData, post, delete: destroy, processing, reset, errors, clearErrors } = useForm({
        nomor_ktp: '',
        name: '',
        email: '',
        pekerjaan: '',
        kontak_darurat: '',
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

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/penghuni', { 
            onSuccess: () => closeAddModal(),
        });
    };

    const confirmDelete = (id) => setDeleteConfirmId(id);

    const executeDelete = () => {
        if (deleteConfirmId) {
            destroy(`/admin/penghuni/${deleteConfirmId}`, {
                onSuccess: () => setDeleteConfirmId(null)
            });
        }
    };

    // Helper untuk membuat tautan WA
    const getWhatsAppUrl = (phone) => {
        if (!phone) return '#';
        let cleaned = phone.replace(/[^0-9]/g, '');
        if (cleaned.startsWith('0')) {
            cleaned = '62' + cleaned.slice(1);
        }
        return `https://wa.me/${cleaned}`;
    };

    const filteredPenghunis = penghunis.filter((penghuni) => {
        const query = (searchTerm || '').toLowerCase();
        const safeIncludes = (val) => val ? String(val).toLowerCase().includes(query) : false;
        
        return (
            safeIncludes(penghuni.user?.name) ||
            safeIncludes(penghuni.nomor_ktp) ||
            safeIncludes(penghuni.kontak_darurat) ||
            safeIncludes(penghuni.user?.email)
        );
    });

    return (
        <AdminLayout>
            <Head title="Data Penghuni" />

            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-cozy-cream-200 dark:border-slate-700 shadow-sm">
                    <div>
                        <h2 className="text-2xl font-bold text-cozy-brown-900 dark:text-white mb-1">Data Penghuni</h2>
                        <p className="text-sm text-cozy-brown-400 dark:text-white">Kelola informasi penyewa kamar kos dan akses masuk akun mereka.</p>
                    </div>
                    <button
                        onClick={openAddModal}
                        className="w-full md:w-auto inline-flex items-center justify-center px-5 py-3 bg-cozy-brown-500 text-white rounded-xl font-semibold shadow-md shadow-cozy-brown-500/10 hover:bg-cozy-brown-600 transition-all duration-200"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Tambah Penghuni
                    </button>
                </div>

                {/* Filter and Search Action bar */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full bg-white dark:bg-slate-800 p-4 rounded-xl border border-cozy-cream-200 dark:border-slate-700 shadow-sm">
                    <div className="relative w-full sm:flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cozy-brown-300" />
                        <input
                            type="text"
                            placeholder="Cari berdasarkan nama, NIK, atau nomor telepon..."
                            className="w-full pl-10 pr-4 py-2.5 bg-cozy-cream-50 dark:bg-slate-900 border border-cozy-cream-200 dark:border-slate-700 rounded-lg text-sm text-cozy-brown-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cozy-brown-500/35 focus:border-cozy-brown-500 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button 
                                onClick={() => setSearchTerm('')} 
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-cozy-brown-300 hover:text-cozy-brown-500 text-xs"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                    <div className="text-xs text-cozy-brown-400 dark:text-white font-medium whitespace-nowrap">
                        Menampilkan {filteredPenghunis.length} dari {penghunis.length} Penghuni
                    </div>
                </div>

                {/* Table / List Section */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-cozy-cream-200 dark:border-slate-700 overflow-hidden">
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="min-w-full divide-y divide-cozy-cream-200 dark:divide-slate-700">
                            <thead className="bg-cozy-cream-50 dark:bg-slate-900">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-cozy-brown-400 dark:text-white uppercase tracking-wider">Info Penghuni</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-cozy-brown-400 dark:text-white uppercase tracking-wider">Kontak & Akun</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-cozy-brown-400 dark:text-white uppercase tracking-wider">KTP / Pekerjaan</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-cozy-brown-400 dark:text-white uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-slate-800 divide-y divide-cozy-cream-100">
                                {filteredPenghunis.length > 0 ? (
                                    filteredPenghunis.map((penghuni) => (
                                        <tr key={penghuni.id} className="hover:bg-cozy-cream-50 dark:bg-slate-900/50 transition-colors duration-150">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-cozy-cream-200 text-cozy-brown-600 flex items-center justify-center font-bold">
                                                        {penghuni.user?.name ? penghuni.user.name.charAt(0).toUpperCase() : '?'}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-bold text-cozy-brown-900 dark:text-white">{penghuni.user?.name}</div>
                                                        <div className="text-xs text-cozy-brown-400 dark:text-white truncate max-w-[200px]" title={penghuni.pekerjaan}>{penghuni.pekerjaan}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-cozy-brown-900 dark:text-white">
                                                <div className="flex items-center mb-1 text-cozy-brown-500">
                                                    <Mail className="w-4 h-4 mr-2 text-cozy-brown-300" />
                                                    <span className="text-cozy-brown-900 dark:text-white text-xs">{penghuni.user?.email || '-'}</span>
                                                </div>
                                                <div className="flex items-center text-xs">
                                                    <Phone className="w-4 h-4 mr-2 text-cozy-brown-300" />
                                                    <span className="text-cozy-brown-400 dark:text-white font-medium">{penghuni.kontak_darurat}</span>
                                                    <a 
                                                        href={getWhatsAppUrl(penghuni.kontak_darurat)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="ml-2 inline-flex items-center p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                                                        title="Hubungi via WhatsApp"
                                                    >
                                                        <MessageSquare className="w-3.5 h-3.5" />
                                                    </a>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-cozy-brown-900 dark:text-white">
                                                <div className="font-semibold text-cozy-brown-800 dark:text-white text-xs">{penghuni.nomor_ktp}</div>
                                                <div className="text-xs text-cozy-brown-400 dark:text-white">{penghuni.pekerjaan}</div>
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm font-medium">
                                                <button 
                                                    onClick={() => confirmDelete(penghuni.id)} 
                                                    className="text-red-500 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 p-2 rounded-lg transition-colors"
                                                    title="Hapus Penghuni & Akun"
                                                >
                                                    <Trash2 className="w-5 h-5 inline" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center">
                                            <Users className="w-12 h-12 text-cozy-cream-400 mx-auto mb-3" />
                                            <p className="text-cozy-brown-500 text-sm font-medium">Data penghuni tidak ditemukan.</p>
                                            <p className="text-xs text-cozy-brown-400 dark:text-white mt-1">Coba sesuaikan kata kunci pencarian Anda.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card-List View */}
                    <div className="block md:hidden divide-y divide-cozy-cream-200 dark:divide-slate-700">
                        {filteredPenghunis.length > 0 ? (
                            filteredPenghunis.map((penghuni) => (
                                <div key={penghuni.id} className="p-4 space-y-3 bg-white dark:bg-slate-800 hover:bg-cozy-cream-50 dark:bg-slate-900/50 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-9 w-9 rounded-full bg-cozy-cream-200 text-cozy-brown-600 flex items-center justify-center font-bold text-sm">
                                                {penghuni.user?.name ? penghuni.user.name.charAt(0).toUpperCase() : '?'}
                                            </div>
                                            <div className="ml-3">
                                                <h4 className="text-sm font-bold text-cozy-brown-900 dark:text-white">{penghuni.user?.name}</h4>
                                                <p className="text-xs text-cozy-brown-400 dark:text-white">{penghuni.pekerjaan}</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => confirmDelete(penghuni.id)} 
                                            className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 p-1.5 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-xs bg-cozy-cream-50 dark:bg-slate-900 p-3 rounded-lg border border-cozy-cream-200 dark:border-slate-700">
                                        <div>
                                            <span className="block text-cozy-brown-400 dark:text-white font-medium mb-0.5">Email Akun</span>
                                            <span className="text-cozy-brown-800 dark:text-white break-all">{penghuni.user?.email || '-'}</span>
                                        </div>
                                        <div>
                                            <span className="block text-cozy-brown-400 dark:text-white font-medium mb-0.5">Kontak Darurat</span>
                                            <span className="inline-flex items-center text-cozy-brown-800 dark:text-white">
                                                {penghuni.kontak_darurat}
                                                <a 
                                                    href={getWhatsAppUrl(penghuni.kontak_darurat)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="ml-1 text-green-600 p-0.5"
                                                >
                                                    <MessageSquare className="w-3.5 h-3.5 inline" />
                                                </a>
                                            </span>
                                        </div>
                                        <div>
                                            <span className="block text-cozy-brown-400 dark:text-white font-medium mb-0.5">NIK (KTP)</span>
                                            <span className="text-cozy-brown-800 dark:text-white">{penghuni.nomor_ktp}</span>
                                        </div>
                                        <div>
                                            <span className="block text-cozy-brown-400 dark:text-white font-medium mb-0.5">Pekerjaan</span>
                                            <span className="text-cozy-brown-800 dark:text-white">{penghuni.pekerjaan}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center bg-white dark:bg-slate-800">
                                <Users className="w-10 h-10 text-cozy-cream-400 mx-auto mb-2" />
                                <p className="text-cozy-brown-500 text-sm font-medium">Data penghuni tidak ditemukan.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Tenant Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[60] overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
                        <div className="fixed inset-0 bg-[#372213]/40 backdrop-blur-sm transition-opacity" onClick={closeAddModal}></div>

                        <div className="relative inline-block align-bottom bg-white dark:bg-slate-800 rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full">
                            <form onSubmit={handleSubmit}>
                                <div className="bg-white dark:bg-slate-800 px-6 pt-6 pb-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xl font-bold text-cozy-brown-900 dark:text-white">Tambah Penghuni Baru</h3>
                                        <button 
                                            type="button" 
                                            onClick={closeAddModal} 
                                            className="text-cozy-brown-300 hover:text-cozy-brown-500 bg-transparent hover:bg-cozy-cream-100 dark:bg-slate-800 rounded-full p-1 transition"
                                        >
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>
                                    
                                    <div className="bg-cozy-cream-100 dark:bg-slate-800 border border-cozy-cream-200 dark:border-slate-700 rounded-xl p-4 mb-6">
                                        <p className="text-sm text-cozy-brown-600 font-medium flex items-start">
                                            <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0 text-cozy-brown-500" />
                                            <span>
                                                Menambahkan penghuni di sini akan **otomatis membuatkan akun login** untuk anak kos tersebut dengan password default: <strong>kos12345</strong>
                                            </span>
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        {/* Nama Lengkap */}
                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-semibold text-cozy-brown-400 dark:text-white mb-1">Nama Lengkap</label>
                                            <input
                                                type="text" 
                                                required 
                                                placeholder="Sesuai KTP"
                                                className={`w-full bg-cozy-cream-50 dark:bg-slate-900 border ${errors?.name ? 'border-orange-400 focus:ring-orange-200' : 'border-cozy-cream-200 dark:border-slate-700 focus:ring-cozy-brown-500/20'} text-cozy-brown-900 dark:text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:border-cozy-brown-500`}
                                                value={data.name} 
                                                onChange={e => setData('name', e.target.value)}
                                            />
                                            {errors?.name && <span className="text-orange-600 text-xs mt-1 block font-medium">{errors.name}</span>}
                                        </div>

                                        {/* NIK */}
                                        <div>
                                            <label className="block text-sm font-semibold text-cozy-brown-400 dark:text-white mb-1">Nomor KTP (NIK)</label>
                                            <input
                                                type="text" 
                                                required 
                                                maxLength="16" 
                                                placeholder="16 Digit NIK"
                                                className={`w-full bg-cozy-cream-50 dark:bg-slate-900 border ${errors?.nomor_ktp ? 'border-orange-400 focus:ring-orange-200' : 'border-cozy-cream-200 dark:border-slate-700 focus:ring-cozy-brown-500/20'} text-cozy-brown-900 dark:text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:border-cozy-brown-500`}
                                                value={data.nomor_ktp} 
                                                onChange={e => setData('nomor_ktp', e.target.value)}
                                            />
                                            {errors?.nomor_ktp && <span className="text-orange-600 text-xs mt-1 block font-medium">{errors.nomor_ktp}</span>}
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label className="block text-sm font-semibold text-cozy-brown-400 dark:text-white mb-1">Email (Untuk Login Akun)</label>
                                            <input
                                                type="email" 
                                                required 
                                                placeholder="email@contoh.com"
                                                className={`w-full bg-cozy-cream-50 dark:bg-slate-900 border ${errors?.email ? 'border-orange-400 focus:ring-orange-200' : 'border-cozy-cream-200 dark:border-slate-700 focus:ring-cozy-brown-500/20'} text-cozy-brown-900 dark:text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:border-cozy-brown-500`}
                                                value={data.email} 
                                                onChange={e => setData('email', e.target.value)}
                                            />
                                            {errors?.email && <span className="text-orange-600 text-xs mt-1 block font-medium">{errors.email}</span>}
                                        </div>

                                        {/* Pekerjaan */}
                                        <div>
                                            <label className="block text-sm font-semibold text-cozy-brown-400 dark:text-white mb-1">Pekerjaan</label>
                                            <input
                                                type="text" 
                                                required
                                                placeholder="Mahasiswa / Karyawan"
                                                className={`w-full bg-cozy-cream-50 dark:bg-slate-900 border ${errors?.pekerjaan ? 'border-orange-400 focus:ring-orange-200' : 'border-cozy-cream-200 dark:border-slate-700 focus:ring-cozy-brown-500/20'} text-cozy-brown-900 dark:text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:border-cozy-brown-500`}
                                                value={data.pekerjaan} 
                                                onChange={e => setData('pekerjaan', e.target.value)}
                                            />
                                            {errors?.pekerjaan && <span className="text-orange-600 text-xs mt-1 block font-medium">{errors.pekerjaan}</span>}
                                        </div>

                                        {/* Kontak Darurat */}
                                        <div>
                                            <label className="block text-sm font-semibold text-cozy-brown-400 dark:text-white mb-1">Kontak Darurat (WA)</label>
                                            <input
                                                type="text" 
                                                required 
                                                placeholder="0812xxxxxx"
                                                className={`w-full bg-cozy-cream-50 dark:bg-slate-900 border ${errors?.kontak_darurat ? 'border-orange-400 focus:ring-orange-200' : 'border-cozy-cream-200 dark:border-slate-700 focus:ring-cozy-brown-500/20'} text-cozy-brown-900 dark:text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:border-cozy-brown-500`}
                                                value={data.kontak_darurat} 
                                                onChange={e => setData('kontak_darurat', e.target.value)}
                                            />
                                            {errors?.kontak_darurat && <span className="text-orange-600 text-xs mt-1 block font-medium">{errors.kontak_darurat}</span>}
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
                                        {processing ? 'Menyimpan...' : 'Simpan & Buat Akun'}
                                    </button>
                                </div>
                            </form>
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
                                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-50 sm:mx-0 sm:h-10 sm:w-10">
                                    <ShieldAlert className="h-6 w-6 text-red-600" />
                                </div>
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <h3 className="text-lg font-bold text-cozy-brown-900 dark:text-white">Hapus Penghuni</h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-cozy-brown-400 dark:text-white">
                                            Apakah Anda yakin ingin menghapus penghuni ini? **Akun login, riwayat sewa, dan tagihannya** juga akan terhapus secara permanen.
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
                                    {processing ? 'Menghapus...' : 'Ya, Hapus Semua'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}