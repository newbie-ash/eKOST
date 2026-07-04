import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Receipt, TrendingDown, Plus, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function Pengeluaran({ pengeluarans, kamars }) {
    const { flash } = usePage().props;
    const [isFormOpen, setIsFormOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        tanggal: new Date().toISOString().split('T')[0],
        kategori: 'Listrik',
        jumlah: '',
        keterangan: '',
        kamar_id: '',
    });

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('pemilik.pengeluaran.store'), {
            onSuccess: () => {
                reset();
                setIsFormOpen(false);
            },
        });
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus catatan pengeluaran ini?')) {
            useForm().delete(route('pemilik.pengeluaran.destroy', id));
        }
    };

    const kategoriOptions = [
        'Listrik', 'Air', 'Internet', 'Kebersihan', 'Keamanan', 
        'Perbaikan Kamar', 'Perawatan Fasilitas', 'Pajak', 'Gaji Pegawai', 'Lain-lain'
    ];

    return (
        <AdminLayout>
            <Head title="Manajemen Pengeluaran" />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 flex items-center gap-2">
                            <TrendingDown className="w-6 h-6 text-red-500" />
                            Catatan Pengeluaran
                        </h1>
                        <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">
                            Kelola pencatatan biaya operasional dan perawatan fasilitas kos.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsFormOpen(!isFormOpen)}
                        className="bg-cozy-brown-600 hover:bg-cozy-brown-700 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors shadow-sm"
                    >
                        {isFormOpen ? 'Batal' : <><Plus className="w-4 h-4" /> Tambah Pengeluaran</>}
                    </button>
                </div>

                {flash?.message && (
                    <div className="bg-green-50 text-green-700 p-4 rounded-xl flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5" />
                        {flash.message}
                    </div>
                )}

                {/* Form Tambah Pengeluaran */}
                {isFormOpen && (
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 animate-in fade-in slide-in-from-top-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Input Pengeluaran Baru</h3>
                        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tanggal</label>
                                <input
                                    type="date"
                                    value={data.tanggal}
                                    onChange={e => setData('tanggal', e.target.value)}
                                    className="w-full rounded-xl border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-cozy-brown-500 focus:border-cozy-brown-500"
                                    required
                                />
                                {errors.tanggal && <p className="text-red-500 text-xs mt-1">{errors.tanggal}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kategori</label>
                                <select
                                    value={data.kategori}
                                    onChange={e => setData('kategori', e.target.value)}
                                    className="w-full rounded-xl border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-cozy-brown-500 focus:border-cozy-brown-500"
                                >
                                    {kategoriOptions.map(kat => (
                                        <option key={kat} value={kat}>{kat}</option>
                                    ))}
                                </select>
                                {errors.kategori && <p className="text-red-500 text-xs mt-1">{errors.kategori}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kamar (Opsional)</label>
                                <select
                                    value={data.kamar_id}
                                    onChange={e => setData('kamar_id', e.target.value)}
                                    className="w-full rounded-xl border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-cozy-brown-500 focus:border-cozy-brown-500"
                                >
                                    <option value="">- Pengeluaran Umum / Tidak Terkait Kamar -</option>
                                    {kamars.map(kamar => (
                                        <option key={kamar.id} value={kamar.id}>Kamar {kamar.nomor_kamar}</option>
                                    ))}
                                </select>
                                {errors.kamar_id && <p className="text-red-500 text-xs mt-1">{errors.kamar_id}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Jumlah (Rp)</label>
                                <input
                                    type="number"
                                    value={data.jumlah}
                                    onChange={e => setData('jumlah', e.target.value)}
                                    placeholder="Contoh: 150000"
                                    className="w-full rounded-xl border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-cozy-brown-500 focus:border-cozy-brown-500"
                                    required
                                    min="0"
                                />
                                {errors.jumlah && <p className="text-red-500 text-xs mt-1">{errors.jumlah}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Keterangan (Opsional)</label>
                                <input
                                    type="text"
                                    value={data.keterangan}
                                    onChange={e => setData('keterangan', e.target.value)}
                                    placeholder="Contoh: Bayar token listrik lantai 1"
                                    className="w-full rounded-xl border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-cozy-brown-500 focus:border-cozy-brown-500"
                                />
                                {errors.keterangan && <p className="text-red-500 text-xs mt-1">{errors.keterangan}</p>}
                            </div>

                            <div className="md:col-span-2 flex justify-end mt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-cozy-brown-600 hover:bg-cozy-brown-700 text-white font-bold py-2 px-6 rounded-xl transition-colors disabled:opacity-50"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Pengeluaran'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Tabel Pengeluaran */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-slate-400">
                            <thead className="text-xs text-gray-700 dark:text-white uppercase bg-gray-50 dark:bg-slate-700 dark:text-slate-400 border-b border-gray-100 dark:border-slate-700">
                                <tr>
                                    <th className="px-6 py-4">Tanggal</th>
                                    <th className="px-6 py-4">Kategori</th>
                                    <th className="px-6 py-4">Kamar</th>
                                    <th className="px-6 py-4">Keterangan</th>
                                    <th className="px-6 py-4">Jumlah</th>
                                    <th className="px-6 py-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pengeluarans.length > 0 ? (
                                    pengeluarans.map((item) => (
                                        <tr key={item.id} className="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                {new Date(item.tanggal).toLocaleDateString('id-ID', {
                                                    day: 'numeric', month: 'long', year: 'numeric'
                                                })}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="bg-gray-100 text-gray-800 dark:text-white text-xs font-medium px-2.5 py-0.5 rounded dark:bg-slate-700 dark:text-gray-300">
                                                    {item.kategori}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 dark:text-slate-400 font-medium">
                                                {item.kamar ? `Kamar ${item.kamar.nomor_kamar}` : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 dark:text-slate-400">
                                                {item.keterangan || '-'}
                                            </td>
                                            <td className="px-6 py-4 font-bold text-red-600 dark:text-red-400">
                                                {formatRupiah(item.jumlah)}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="text-red-500 hover:text-red-700 dark:hover:text-red-400 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors"
                                                    title="Hapus Data"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500 dark:text-slate-400">
                                            <Receipt className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                                            Belum ada catatan pengeluaran.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
