import React from 'react';
import { 
    ReceiptText, CreditCard, LogOut, CheckCircle, Clock, MessageSquare, ExternalLink, Sparkles, Download, XCircle, RefreshCw
} from 'lucide-react';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';

import UserLayout from '@/Layouts/UserLayout';

export default function TagihanSaya({ tagihans = [], auth = {} }) {
    console.log('Force HMR');
    const userName = auth.user?.name;

    // Format Rupiah
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    };

    const getConfirmWhatsAppUrl = (tagihan) => {
        const adminPhone = '62895601322323'; // Admin number
        const roomNo = tagihan.sewa?.kamar?.nomor_kamar || '';
        const msg = `Halo Admin eKOS, saya ingin mengonfirmasi pembayaran kos untuk Kamar ${roomNo} bulan ${tagihan.bulan_tagihan} sebesar ${formatRupiah(tagihan.jumlah_bayar)}. Berikut terlampir bukti struk transfernya.`;
        return `https://wa.me/${adminPhone}?text=${encodeURIComponent(msg)}`;
    };

    const openSnapPay = (snapToken, tagihan) => {
        window.snap.pay(snapToken, {
            onSuccess: function(result){
                router.post(route('payment.simulate-success', tagihan.id));
            },
            onPending: function(result){
                console.log('pending', result);
                router.reload();
            },
            onError: function(result){
                console.log('error / expired', result);
                retryWithNewToken(tagihan);
            },
            onClose: function(){
                console.log('popup ditutup');
                router.reload();
            }
        });
    };

    const retryWithNewToken = async (tagihan) => {
        try {
            const response = await axios.post(route('payment.snap-token', tagihan.id), { force_new: true });
            if (response.data.snap_token) {
                openSnapPay(response.data.snap_token, tagihan);
            }
        } catch (error) {
            console.error("Gagal membuat token baru:", error);
            alert("Gagal memperbarui pembayaran. Silakan coba lagi.");
        }
    };

    const handlePayment = async (tagihan) => {
        try {
            const response = await axios.post(route('payment.snap-token', tagihan.id));
            
            if (response.data.snap_token) {
                openSnapPay(response.data.snap_token, tagihan);
            } else if (response.data.error) {
                alert(response.data.error);
            }
        } catch (error) {
            console.error("Gagal memulai pembayaran:", error);
            alert("Terjadi kesalahan sistem saat menghubungi server pembayaran.");
        }
    };

    const handleCancel = (tagihan) => {
        if (confirm('Apakah Anda yakin ingin membatalkan proses pembayaran ini? Anda tetap bisa memulai pembayaran baru nanti.')) {
            router.post(route('payment.cancel', tagihan.id));
        }
    };


    return (
        <UserLayout userName={userName}>
            <Head title="Tagihan Saya" />

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Welcome Card */}
                <div className="relative overflow-hidden bg-white dark:bg-slate-800 p-6 rounded-3xl border border-cozy-cream-200 dark:border-slate-700 shadow-sm space-y-2 transition-colors">
                    <div className="absolute right-0 top-0 w-48 h-48 bg-cozy-cream-100 dark:bg-slate-700 rounded-full blur-3xl -z-10 opacity-70"></div>
                    <div className="inline-flex items-center gap-2 bg-cozy-cream-100 dark:bg-slate-700 text-cozy-brown-500 dark:text-slate-200 px-3 py-1 rounded-full text-[10px] font-bold">
                        <Sparkles className="w-3 h-3" />
                        <span>Tagihan Aktif</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-cozy-brown-900 dark:text-white">Halo, {userName}!</h2>
                    <p className="text-xs sm:text-sm text-cozy-brown-400 dark:text-slate-300">
                        Berikut adalah rincian tagihan kos bulanan Anda. Silakan selesaikan pembayaran sesuai dengan instruksi yang tertera.
                    </p>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    {/* Invoice Lists */}
                    <div className="md:col-span-2 space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-cozy-brown-400 dark:text-slate-400">Daftar Tagihan Anda</h3>
                        
                        {tagihans.length > 0 ? (
                            tagihans.map((tagihan) => (
                                <div key={tagihan.id} className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-cozy-cream-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="text-xs text-cozy-brown-400 dark:text-slate-400 font-semibold block">Periode</span>
                                            <h4 className="text-base sm:text-lg font-bold text-cozy-brown-900 dark:text-white">{tagihan.bulan_tagihan}</h4>
                                            <span className="text-[10px] sm:text-xs text-cozy-brown-400 dark:text-slate-400 mt-0.5 block">Kamar {tagihan.sewa?.kamar?.nomor_kamar} ({tagihan.sewa?.kamar?.tipe_kamar})</span>
                                        </div>
                                        
                                        <span className={`inline-flex items-center px-2.5 py-1 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold ${
                                            tagihan.status_lunas
                                            ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-800/30' 
                                            : 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border border-orange-100 dark:border-orange-800/30'
                                        }`}>
                                            {tagihan.status_lunas ? (
                                                <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" />
                                            ) : (
                                                <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" />
                                            )}
                                            {tagihan.status_lunas ? 'Lunas' : 'Belum Bayar'}
                                        </span>
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-t border-cozy-cream-100 dark:border-slate-700 pt-4">
                                        <div>
                                            <span className="text-xs text-cozy-brown-400 dark:text-slate-400 font-medium block">Total Pembayaran</span>
                                            <span className="text-xl sm:text-lg font-extrabold text-cozy-brown-900 dark:text-white">{formatRupiah(tagihan.jumlah_bayar)}</span>
                                        </div>

                                        {!tagihan.status_lunas ? (
                                            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                                <button 
                                                    onClick={() => handlePayment(tagihan)}
                                                    className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-3 sm:py-2.5 bg-cozy-brown-600 hover:bg-cozy-brown-700 text-white rounded-xl text-sm sm:text-xs font-bold shadow-sm active:scale-95 transition-all"
                                                >
                                                    {tagihan.snap_token ? (
                                                        <RefreshCw className="w-4 h-4 sm:w-4 sm:h-4 mr-1.5" />
                                                    ) : (
                                                        <CreditCard className="w-4 h-4 sm:w-4 sm:h-4 mr-1.5" />
                                                    )}
                                                    {tagihan.snap_token ? 'Bayar Ulang' : 'Bayar Online'}
                                                </button>
                                                <a 
                                                    href={getConfirmWhatsAppUrl(tagihan)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-3 sm:py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm sm:text-xs font-bold shadow-sm active:scale-95 transition-all"
                                                >
                                                    <MessageSquare className="w-4 h-4 sm:w-4 sm:h-4 mr-1.5" />
                                                    Konfirmasi WA
                                                </a>
                                                {tagihan.snap_token && (
                                                    <button 
                                                        onClick={() => handleCancel(tagihan)}
                                                        className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-3 sm:py-2.5 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/40 rounded-xl text-sm sm:text-xs font-bold shadow-sm active:scale-95 transition-all"
                                                    >
                                                        <XCircle className="w-4 h-4 sm:w-4 sm:h-4 mr-1.5" />
                                                        Batalkan
                                                    </button>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="flex gap-2 w-full sm:w-auto">
                                                <a 
                                                    href={route('tagihan.kwitansi', tagihan.id)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-3 sm:py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-xl text-sm sm:text-xs font-bold shadow-sm active:scale-95 transition-all"
                                                >
                                                    <Download className="w-4 h-4 mr-1.5" />
                                                    Download Kwitansi
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl border border-cozy-cream-200 dark:border-slate-700 shadow-sm text-center transition-colors">
                                <ReceiptText className="w-12 h-12 text-cozy-cream-400 dark:text-cozy-brown-500 mx-auto mb-3" />
                                <p className="text-cozy-brown-500 dark:text-slate-300 text-sm font-medium">Tidak ada tagihan bulanan.</p>
                                <p className="text-xs text-cozy-brown-300 dark:text-cozy-brown-400 mt-1">Hubungi admin jika Anda merasa ada kesalahan data.</p>
                            </div>
                        )}
                    </div>

                    {/* Payment Instruction Sidebar Card */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-cozy-brown-400 dark:text-slate-400">Cara Pembayaran</h3>
                        
                        <div className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-cozy-cream-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
                            <div className="flex items-center gap-3 border-b border-cozy-cream-100 dark:border-slate-700 pb-3">
                                <div className="bg-blue-100 dark:bg-slate-700 p-2 rounded-lg text-blue-500 dark:text-blue-300">
                                    <CreditCard className="w-5 h-5" />
                                </div>
                                <h4 className="font-bold text-cozy-brown-900 dark:text-white text-sm">Pembayaran Online (Otomatis)</h4>
                            </div>

                            <div className="space-y-3 text-xs">
                                <p className="text-cozy-brown-500 dark:text-slate-300">
                                    Sekarang eKOS mendukung pembayaran otomatis menggunakan QRIS, GoPay, dan Bank Transfer (Virtual Account).
                                </p>
                            </div>

                            <div className="bg-cozy-cream-50 dark:bg-slate-700/50 p-3.5 rounded-xl border border-cozy-cream-200 dark:border-slate-700 text-xs sm:text-[10px] text-cozy-brown-500 dark:text-slate-300 leading-relaxed">
                                <span className="font-bold block mb-1">💡 Langkah Mudah:</span>
                                1. Klik tombol <b className="text-cozy-brown-600 dark:text-white">Bayar Online</b> pada tagihan di samping.<br/>
                                2. Pilih metode pembayaran yang Anda inginkan pada jendela yang muncul.<br/>
                                3. Selesaikan pembayaran, dan status akan otomatis berubah menjadi <b className="text-green-600">Lunas</b>!
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
