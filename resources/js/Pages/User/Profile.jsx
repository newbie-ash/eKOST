import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { User, Phone, Briefcase, FileText, Camera, Upload, CheckCircle2, UserCircle2, Shield } from 'lucide-react';
import UserLayout from '@/Layouts/UserLayout';
import ImageCropper from '@/Components/ImageCropper';
import UpdatePasswordForm from '@/Pages/Profile/Partials/UpdatePasswordForm';

export default function Profile() {
    const { auth } = usePage().props;
    const user = auth.user;
    const penyewa = user.penyewa || {};

    const { data, setData, post, processing, errors, progress } = useForm({
        name: user.name || '',
        email: user.email || '',
        jenis_kelamin: penyewa.jenis_kelamin || '',
        nomor_ktp: penyewa.nomor_ktp || '',
        pekerjaan: penyewa.pekerjaan || '',
        telepon: penyewa.telepon || '',
        nama_kontak_darurat: penyewa.nama_kontak_darurat || '',
        kontak_darurat: penyewa.kontak_darurat || '',
        foto_ktp: null,
        foto_profil: null,
    });

    const [previewKtp, setPreviewKtp] = useState(
        penyewa.foto_ktp ? `/storage/${penyewa.foto_ktp}` : null
    );

    const [previewProfil, setPreviewProfil] = useState(
        user.foto_profil ? `/storage/${user.foto_profil}` : null
    );

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('foto_ktp', file);
            setPreviewKtp(URL.createObjectURL(file));
        }
    };

    const [cropperImage, setCropperImage] = useState(null);
    const [showCropper, setShowCropper] = useState(false);

    const handleProfilChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCropperImage(URL.createObjectURL(file));
            setShowCropper(true);
        }
        e.target.value = '';
    };

    const handleCropDone = ({ file, url }) => {
        setData('foto_profil', file);
        setPreviewProfil(url);
        setShowCropper(false);
        setCropperImage(null);
    };

    const handleCropCancel = () => {
        setShowCropper(false);
        setCropperImage(null);
    };

    const submit = (e) => {
        e.preventDefault();
        // Inertia uses POST for file uploads, we can spoof PUT using _method if needed,
        // but our route is defined as POST.
        post(route('user.profile.update'), {
            preserveScroll: true,
        });
    };

    return (
        <UserLayout>
            <Head title="Profil Saya" />

            {showCropper && cropperImage && (
                <ImageCropper
                    imageSrc={cropperImage}
                    onCropDone={handleCropDone}
                    onCancel={handleCropCancel}
                    aspectRatio={1}
                    cropShape="round"
                />
            )}

            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-cozy-brown-900 dark:text-white">Profil & Biodata</h2>
                    <p className="text-sm text-cozy-brown-500 dark:text-slate-300">Lengkapi data diri Anda sebagai persyaratan sewa kos.</p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-cozy-cream-200 dark:border-slate-700 shadow-sm overflow-hidden transition-colors">
                    <form onSubmit={submit} className="p-6 sm:p-8 space-y-8">
                        
                        {/* Section 1: Informasi Dasar */}
                        <div>
                            <h3 className="text-lg font-bold text-cozy-brown-800 dark:text-white flex items-center mb-4 pb-2 border-b border-cozy-cream-100 dark:border-slate-700">
                                <UserCircle2 className="w-5 h-5 mr-2 text-cozy-brown-500" />
                                Informasi Dasar
                            </h3>
                            
                            <div className="mb-8 flex items-center gap-6">
                                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-cozy-cream-200 dark:border-slate-600 bg-cozy-cream-50 dark:bg-slate-700 flex items-center justify-center shrink-0">
                                    {previewProfil ? (
                                        <img src={previewProfil} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-8 h-8 text-cozy-brown-300" />
                                    )}
                                </div>
                                <div>
                                    <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-white dark:bg-slate-800 border border-cozy-cream-300 dark:border-slate-600 rounded-xl text-sm font-medium text-cozy-brown-700 dark:text-slate-200 hover:bg-cozy-cream-50 dark:hover:bg-slate-700 transition shadow-sm">
                                        <Camera className="w-4 h-4 mr-2" />
                                        Ganti Foto Profil
                                        <input type="file" className="hidden" accept="image/*" onChange={handleProfilChange} />
                                    </label>
                                    <p className="text-xs text-cozy-brown-400 dark:text-slate-400 mt-2">Maks. 2MB (JPG, PNG)</p>
                                    {errors.foto_profil && <p className="mt-1 text-sm text-red-600">{errors.foto_profil}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-cozy-brown-400 dark:text-slate-400 uppercase tracking-wider mb-1">
                                        Nama Lengkap
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="w-full rounded-xl border-cozy-cream-200 dark:border-slate-600 bg-cozy-cream-50 dark:bg-slate-700/50 text-cozy-brown-900 dark:text-white focus:ring-cozy-brown-500 text-sm"
                                        required
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-bold text-cozy-brown-400 dark:text-slate-400 uppercase tracking-wider mb-1">
                                        Alamat Email
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        className="w-full rounded-xl border-cozy-cream-200 dark:border-slate-600 bg-cozy-cream-50 dark:bg-slate-700/50 text-cozy-brown-900 dark:text-white focus:ring-cozy-brown-500 text-sm"
                                        required
                                    />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-bold text-cozy-brown-400 dark:text-slate-400 uppercase tracking-wider mb-1">
                                        Jenis Kelamin
                                    </label>
                                    <select
                                        value={data.jenis_kelamin}
                                        onChange={e => setData('jenis_kelamin', e.target.value)}
                                        className="w-full rounded-xl border-cozy-cream-200 dark:border-slate-600 bg-cozy-cream-50 dark:bg-slate-700/50 text-cozy-brown-900 dark:text-white focus:ring-cozy-brown-500 text-sm"
                                    >
                                        <option value="">Pilih Jenis Kelamin</option>
                                        <option value="L">Laki-laki</option>
                                        <option value="P">Perempuan</option>
                                    </select>
                                    {errors.jenis_kelamin && <p className="text-red-500 text-xs mt-1">{errors.jenis_kelamin}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-cozy-brown-400 dark:text-slate-400 uppercase tracking-wider mb-1">
                                        Nomor HP / WhatsApp
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cozy-brown-300" />
                                        <input
                                            type="text"
                                            value={data.telepon}
                                            onChange={e => setData('telepon', e.target.value)}
                                            className="w-full pl-9 rounded-xl border-cozy-cream-200 dark:border-slate-600 bg-cozy-cream-50 dark:bg-slate-700/50 text-cozy-brown-900 dark:text-white focus:ring-cozy-brown-500 text-sm"
                                            placeholder="0812xxxx"
                                        />
                                    </div>
                                    {errors.telepon && <p className="text-red-500 text-xs mt-1">{errors.telepon}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-cozy-brown-400 dark:text-slate-400 uppercase tracking-wider mb-1">
                                        Pekerjaan / Instansi
                                    </label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cozy-brown-300" />
                                        <input
                                            type="text"
                                            value={data.pekerjaan}
                                            onChange={e => setData('pekerjaan', e.target.value)}
                                            className="w-full pl-9 rounded-xl border-cozy-cream-200 dark:border-slate-600 bg-cozy-cream-50 dark:bg-slate-700/50 text-cozy-brown-900 dark:text-white focus:ring-cozy-brown-500 text-sm"
                                            placeholder="Mahasiswa Universitas X / Karyawan PT Y"
                                        />
                                    </div>
                                    {errors.pekerjaan && <p className="text-red-500 text-xs mt-1">{errors.pekerjaan}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Identitas */}
                        <div>
                            <h3 className="text-lg font-bold text-cozy-brown-800 dark:text-white flex items-center mb-4 pb-2 border-b border-cozy-cream-100 dark:border-slate-700">
                                <FileText className="w-5 h-5 mr-2 text-cozy-brown-500" />
                                Identitas (KTP)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-cozy-brown-400 dark:text-slate-400 uppercase tracking-wider mb-1">
                                        Nomor KTP (NIK)
                                    </label>
                                    <input
                                        type="text"
                                        value={data.nomor_ktp}
                                        onChange={e => setData('nomor_ktp', e.target.value)}
                                        className="w-full rounded-xl border-cozy-cream-200 dark:border-slate-600 bg-cozy-cream-50 dark:bg-slate-700/50 text-cozy-brown-900 dark:text-white focus:ring-cozy-brown-500 text-sm"
                                        placeholder="16 digit angka"
                                    />
                                    {errors.nomor_ktp && <p className="text-red-500 text-xs mt-1">{errors.nomor_ktp}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-cozy-brown-400 dark:text-slate-400 uppercase tracking-wider mb-2">
                                        Foto KTP
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-32 h-20 bg-cozy-cream-100 dark:bg-slate-700 rounded-xl overflow-hidden border border-dashed border-cozy-brown-300 dark:border-cozy-brown-500 flex items-center justify-center">
                                            {previewKtp ? (
                                                <img src={previewKtp} alt="Preview KTP" className="w-full h-full object-cover" />
                                            ) : (
                                                <Camera className="w-6 h-6 text-cozy-brown-300 dark:text-cozy-brown-500" />
                                            )}
                                        </div>
                                        <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-white dark:bg-slate-800 border border-cozy-cream-300 dark:border-slate-600 rounded-xl text-sm font-medium text-cozy-brown-700 dark:text-slate-200 hover:bg-cozy-cream-50 dark:hover:bg-slate-700 transition">
                                            <Upload className="w-4 h-4 mr-2" />
                                            Pilih Foto
                                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                        </label>
                                    </div>
                                    {errors.foto_ktp && <p className="text-red-500 text-xs mt-1">{errors.foto_ktp}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Kontak Darurat */}
                        <div>
                            <h3 className="text-lg font-bold text-cozy-brown-800 dark:text-white flex items-center mb-4 pb-2 border-b border-cozy-cream-100 dark:border-slate-700">
                                <Phone className="w-5 h-5 mr-2 text-cozy-brown-500" />
                                Kontak Darurat
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-cozy-brown-400 dark:text-slate-400 uppercase tracking-wider mb-1">
                                        Nama Kontak Darurat
                                    </label>
                                    <input
                                        type="text"
                                        value={data.nama_kontak_darurat}
                                        onChange={e => setData('nama_kontak_darurat', e.target.value)}
                                        className="w-full rounded-xl border-cozy-cream-200 dark:border-slate-600 bg-cozy-cream-50 dark:bg-slate-700/50 text-cozy-brown-900 dark:text-white focus:ring-cozy-brown-500 text-sm"
                                        placeholder="Nama orang tua/wali"
                                    />
                                    {errors.nama_kontak_darurat && <p className="text-red-500 text-xs mt-1">{errors.nama_kontak_darurat}</p>}
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-bold text-cozy-brown-400 dark:text-slate-400 uppercase tracking-wider mb-1">
                                        Nomor Kontak Darurat
                                    </label>
                                    <input
                                        type="text"
                                        value={data.kontak_darurat}
                                        onChange={e => setData('kontak_darurat', e.target.value)}
                                        className="w-full rounded-xl border-cozy-cream-200 dark:border-slate-600 bg-cozy-cream-50 dark:bg-slate-700/50 text-cozy-brown-900 dark:text-white focus:ring-cozy-brown-500 text-sm"
                                        placeholder="Nomor HP orang tua/wali"
                                    />
                                    {errors.kontak_darurat && <p className="text-red-500 text-xs mt-1">{errors.kontak_darurat}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Submit Action */}
                        <div className="pt-4 flex justify-end items-center border-t border-cozy-cream-100 dark:border-slate-700 mt-6">
                            {progress && (
                                <span className="text-sm text-cozy-brown-500 dark:text-slate-300 mr-4">Uploading... {progress.percentage}%</span>
                            )}
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center px-6 py-3 bg-cozy-brown-600 hover:bg-cozy-brown-700 text-white font-bold rounded-xl shadow-md transition disabled:opacity-50"
                            >
                                <CheckCircle2 className="w-5 h-5 mr-2" />
                                Simpan Profil
                            </button>
                        </div>
                    </form>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-cozy-cream-200 dark:border-slate-700 shadow-sm overflow-hidden transition-colors mt-8">
                    <div className="p-6 sm:p-8">
                        <h3 className="text-lg font-bold text-cozy-brown-800 dark:text-white flex items-center mb-4 pb-2 border-b border-cozy-cream-100 dark:border-slate-700">
                            <Shield className="w-5 h-5 mr-2 text-cozy-brown-500" />
                            Ubah Password
                        </h3>
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>
                </div>

            </div>
        </UserLayout>
    );
}
