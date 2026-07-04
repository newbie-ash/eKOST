import { useState } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff, LogIn } from 'lucide-react';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register - eKOS" />

            {/* Welcoming Header */}
            <div className="mb-6 space-y-1 text-center">
                <h3 className="text-xl font-bold text-cozy-brown-900">Daftar Akun Baru</h3>
                <p className="text-xs text-cozy-brown-400">Silakan isi form di bawah ini untuk membuat akun.</p>
            </div>

            <form onSubmit={submit} className="space-y-4">
                {/* Name */}
                <div className="space-y-1">
                    <label htmlFor="name" className="block text-xs font-bold text-cozy-brown-400 uppercase tracking-wider">
                        Nama Lengkap
                    </label>
                    <input
                        id="name"
                        name="name"
                        value={data.name}
                        placeholder="Nama Anda"
                        className={`mt-1 block w-full px-4 py-2.5 bg-cozy-cream-50 border ${
                            errors.name ? 'border-orange-400 focus:ring-orange-200' : 'border-cozy-cream-200 focus:ring-cozy-brown-500/20'
                        } text-cozy-brown-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-cozy-brown-500 transition-all`}
                        autoComplete="name"
                        autoFocus
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    {errors.name && (
                        <span className="text-xs font-semibold text-orange-600 block mt-1">
                            {errors.name}
                        </span>
                    )}
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                    <label htmlFor="email" className="block text-xs font-bold text-cozy-brown-400 uppercase tracking-wider">
                        Alamat Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        placeholder="nama@email.com"
                        className={`mt-1 block w-full px-4 py-2.5 bg-cozy-cream-50 border ${
                            errors.email ? 'border-orange-400 focus:ring-orange-200' : 'border-cozy-cream-200 focus:ring-cozy-brown-500/20'
                        } text-cozy-brown-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-cozy-brown-500 transition-all`}
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    {errors.email && (
                        <span className="text-xs font-semibold text-orange-600 block mt-1">
                            {errors.email}
                        </span>
                    )}
                </div>

                {/* Password */}
                <div className="space-y-1">
                    <label htmlFor="password" className="block text-xs font-bold text-cozy-brown-400 uppercase tracking-wider">
                        Kata Sandi
                    </label>
                    <div className="relative mt-1">
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={data.password}
                            placeholder="••••••••"
                            className={`block w-full px-4 pr-10 py-2.5 bg-cozy-cream-50 border ${
                                errors.password ? 'border-orange-400 focus:ring-orange-200' : 'border-cozy-cream-200 focus:ring-cozy-brown-500/20'
                            } text-cozy-brown-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-cozy-brown-500 transition-all`}
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-cozy-brown-400 hover:text-cozy-brown-600 focus:outline-none"
                            title={showPassword ? "Sembunyikan sandi" : "Tampilkan sandi"}
                        >
                            {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                        </button>
                    </div>
                    {errors.password && (
                        <span className="text-xs font-semibold text-orange-600 block mt-1">
                            {errors.password}
                        </span>
                    )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                    <label htmlFor="password_confirmation" className="block text-xs font-bold text-cozy-brown-400 uppercase tracking-wider">
                        Konfirmasi Sandi
                    </label>
                    <div className="relative mt-1">
                        <input
                            id="password_confirmation"
                            type={showPasswordConfirmation ? 'text' : 'password'}
                            name="password_confirmation"
                            value={data.password_confirmation}
                            placeholder="••••••••"
                            className={`block w-full px-4 pr-10 py-2.5 bg-cozy-cream-50 border ${
                                errors.password_confirmation ? 'border-orange-400 focus:ring-orange-200' : 'border-cozy-cream-200 focus:ring-cozy-brown-500/20'
                            } text-cozy-brown-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-cozy-brown-500 transition-all`}
                            autoComplete="new-password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-cozy-brown-400 hover:text-cozy-brown-600 focus:outline-none"
                            title={showPasswordConfirmation ? "Sembunyikan sandi" : "Tampilkan sandi"}
                        >
                            {showPasswordConfirmation ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                        </button>
                    </div>
                    {errors.password_confirmation && (
                        <span className="text-xs font-semibold text-orange-600 block mt-1">
                            {errors.password_confirmation}
                        </span>
                    )}
                </div>

                {/* Submit Action */}
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full inline-flex items-center justify-center px-5 py-3 bg-cozy-brown-500 hover:bg-cozy-brown-600 text-white rounded-xl font-bold shadow-md shadow-cozy-brown-500/10 transition-all duration-200 disabled:opacity-50"
                    >
                        <LogIn className="w-4 h-4 mr-2" />
                        {processing ? 'Memproses...' : 'Daftar Sekarang'}
                    </button>
                </div>

                {/* Login Link */}
                <div className="text-center pt-2 text-xs text-cozy-brown-400 font-medium">
                    Sudah punya akun?{' '}
                    <Link
                        href={route('login')}
                        className="text-cozy-brown-500 hover:text-cozy-brown-600 font-bold hover:underline"
                    >
                        Login di sini
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
