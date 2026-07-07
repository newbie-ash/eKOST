import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { 
    User, Lock, Save, AlertCircle, CheckCircle2, Eye, EyeOff
} from 'lucide-react';
import { toast } from 'sonner';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Profile({ auth, status }) {
    const user = auth.user;
    const [showPassword, setShowPassword] = useState(false);

    const { 
        data: profileData, 
        setData: setProfileData, 
        post: postProfile, 
        errors: profileErrors, 
        processing: profileProcessing, 
        recentlySuccessful: profileSuccessful 
    } = useForm({
        name: user.name || '',
        email: user.email || '',
    });

    const { 
        data: passwordData, 
        setData: setPasswordData, 
        post: postPassword, 
        errors: passwordErrors, 
        processing: passwordProcessing, 
        recentlySuccessful: passwordSuccessful,
        reset: resetPassword
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submitProfile = (e) => {
        e.preventDefault();
        postProfile(route(user.role === 'pemilik' ? 'pemilik.profile.update' : 'admin.profile.update'));
    };

    const submitPassword = (e) => {
        e.preventDefault();
        // Determine correct route for password update (usually profile update but method put)
        // Actually we need to make sure the route is correctly defined.
        // Let's use the same URL but with a specific action or we can just use the defined route.
        // For simplicity, we can use the same route for both if we didn't specify a different route,
        // Wait, in our ProfileController we have updatePassword method.
        postPassword(route(user.role === 'pemilik' ? 'pemilik.password.update' : 'admin.password.update'), {
            preserveScroll: true,
            onSuccess: () => {
                resetPassword();
                toast.success('Password berhasil diperbarui!');
            },
        });
    };

    return (
        <AdminLayout>
            <Head title="Pengaturan Akun" />

            <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-[#E8E0D5] dark:border-slate-700 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-[#F5F0E6] dark:bg-slate-700 rounded-2xl">
                            <User className="w-8 h-8 text-[#8B5E3C] dark:text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-[#8B5E3C] dark:text-white mb-1">Pengaturan Akun</h2>
                            <p className="text-sm text-[#7D6B5D] dark:text-white">Kelola informasi profil dan keamanan akun Anda.</p>
                        </div>
                    </div>
                </div>

                {/* Profile Information */}
                <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-3xl border border-[#E8E0D5] dark:border-slate-700 shadow-sm">
                    <div className="mb-6 border-b border-[#E8E0D5] dark:border-slate-700 pb-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Informasi Profil</h3>
                        <p className="text-sm text-gray-500 dark:text-white mt-1">Perbarui nama dan alamat email akun Anda.</p>
                    </div>

                    <form onSubmit={submitProfile} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <InputLabel htmlFor="name" value="Nama Lengkap" className="text-gray-700 dark:text-gray-300" />
                                <TextInput
                                    id="name"
                                    type="text"
                                    className="mt-1 block w-full bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-600 focus:border-[#8B5E3C] dark:focus:border-[#D4A373] focus:ring-[#8B5E3C] dark:focus:ring-[#D4A373] rounded-xl"
                                    value={profileData.name}
                                    onChange={(e) => setProfileData('name', e.target.value)}
                                    required
                                />
                                {profileErrors.name && <p className="mt-2 text-sm text-red-600">{profileErrors.name}</p>}
                            </div>

                            <div>
                                <InputLabel htmlFor="email" value="Alamat Email" className="text-gray-700 dark:text-gray-300" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    className="mt-1 block w-full bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-600 focus:border-[#8B5E3C] dark:focus:border-[#D4A373] focus:ring-[#8B5E3C] dark:focus:ring-[#D4A373] rounded-xl"
                                    value={profileData.email}
                                    onChange={(e) => setProfileData('email', e.target.value)}
                                    required
                                />
                                {profileErrors.email && <p className="mt-2 text-sm text-red-600">{profileErrors.email}</p>}
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <PrimaryButton 
                                disabled={profileProcessing}
                                className="bg-[#8B5E3C] hover:bg-[#70482B] text-white rounded-xl px-6 py-3"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Simpan Profil
                            </PrimaryButton>

                            {profileSuccessful && (
                                <span className="flex items-center text-sm text-green-600 dark:text-green-400">
                                    <CheckCircle2 className="w-4 h-4 mr-1" />
                                    Berhasil disimpan.
                                </span>
                            )}
                        </div>
                    </form>
                </div>

                {/* Password Update */}
                <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-3xl border border-[#E8E0D5] dark:border-slate-700 shadow-sm">
                    <div className="mb-6 border-b border-[#E8E0D5] dark:border-slate-700 pb-4 flex items-center gap-3">
                        <div className="p-2 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
                            <Lock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Ubah Password</h3>
                            <p className="text-sm text-gray-500 dark:text-white mt-1">Pastikan akun Anda menggunakan password yang panjang dan acak untuk keamanan.</p>
                        </div>
                    </div>

                    <form onSubmit={submitPassword} className="space-y-6 max-w-xl">
                        <div>
                            <InputLabel htmlFor="current_password" value="Password Saat Ini" className="text-gray-700 dark:text-gray-300" />
                            <div className="relative mt-1">
                                <TextInput
                                    id="current_password"
                                    type={showPassword ? 'text' : 'password'}
                                    className="block w-full pr-10 bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-600 focus:border-[#8B5E3C] dark:focus:border-[#D4A373] focus:ring-[#8B5E3C] dark:focus:ring-[#D4A373] rounded-xl"
                                    value={passwordData.current_password}
                                    onChange={(e) => setPasswordData('current_password', e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {passwordErrors.current_password && <p className="mt-2 text-sm text-red-600">{passwordErrors.current_password}</p>}
                        </div>

                        <div>
                            <InputLabel htmlFor="password" value="Password Baru" className="text-gray-700 dark:text-gray-300" />
                            <div className="relative mt-1">
                                <TextInput
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    className="block w-full pr-10 bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-600 focus:border-[#8B5E3C] dark:focus:border-[#D4A373] focus:ring-[#8B5E3C] dark:focus:ring-[#D4A373] rounded-xl"
                                    value={passwordData.password}
                                    onChange={(e) => setPasswordData('password', e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {passwordErrors.password && <p className="mt-2 text-sm text-red-600">{passwordErrors.password}</p>}
                        </div>

                        <div>
                            <InputLabel htmlFor="password_confirmation" value="Konfirmasi Password Baru" className="text-gray-700 dark:text-gray-300" />
                            <div className="relative mt-1">
                                <TextInput
                                    id="password_confirmation"
                                    type={showPassword ? 'text' : 'password'}
                                    className="block w-full pr-10 bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-600 focus:border-[#8B5E3C] dark:focus:border-[#D4A373] focus:ring-[#8B5E3C] dark:focus:ring-[#D4A373] rounded-xl"
                                    value={passwordData.password_confirmation}
                                    onChange={(e) => setPasswordData('password_confirmation', e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {passwordErrors.password_confirmation && <p className="mt-2 text-sm text-red-600">{passwordErrors.password_confirmation}</p>}
                        </div>

                        <div className="flex items-center gap-4 pt-2">
                            <PrimaryButton 
                                disabled={passwordProcessing}
                                className="bg-gray-900 hover:bg-black dark:bg-[#D4A373] dark:hover:bg-[#C28E5C] text-white rounded-xl px-6 py-3"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Perbarui Password
                            </PrimaryButton>

                            {passwordSuccessful && (
                                <span className="flex items-center text-sm text-green-600 dark:text-green-400">
                                    <CheckCircle2 className="w-4 h-4 mr-1" />
                                    Password berhasil diperbarui.
                                </span>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
