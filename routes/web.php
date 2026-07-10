<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\KamarController;
use App\Http\Controllers\Admin\PenghuniController;
use App\Http\Controllers\Admin\SewaController;
use App\Http\Controllers\Admin\TagihanController;
use App\Http\Controllers\Pemilik\ActivityLogController;
use App\Http\Controllers\Pemilik\PengeluaranController;
use App\Http\Controllers\User\KomplainController;
use App\Http\Controllers\User\PaymentController;
use App\Http\Controllers\User\PilihKamarController;
use App\Http\Controllers\User\ProfileController;
use App\Http\Controllers\User\TagihanSayaController;
use App\Models\Kamar;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $kamars = Kamar::where('status', 'kosong')->get();

    return Inertia::render('Welcome', [
        'kamars' => $kamars,
    ]);
})->name('welcome');

// Midtrans Webhook (Harus di luar middleware auth)
Route::post('/midtrans/webhook', [PaymentController::class, 'webhook'])->name('midtrans.webhook');

Route::get('/kamar/{kamar}', function (Kamar $kamar) {
    return Inertia::render('KamarDetail', [
        'kamar' => $kamar,
    ]);
})->name('kamar.detail');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        if (auth()->user()->role === 'pemilik') {
            return redirect()->route('pemilik.dashboard');
        } elseif (auth()->user()->role === 'penjaga') {
            return app(DashboardController::class)->index();
        }

        return redirect()->route('tagihan-saya.index');
    })->name('dashboard');

    // Route khusus Anak Kos (User Biasa)
    Route::middleware(['is_penghuni'])->group(function () {
        Route::get('/user/tagihan', function () {
            return redirect()->route('tagihan-saya.index');
        });
        Route::get('/tagihan-saya', [TagihanSayaController::class, 'index'])->name('tagihan-saya.index');
        Route::get('/tagihan/{tagihan}/kwitansi', [TagihanSayaController::class, 'kwitansi'])->name('tagihan.kwitansi');
        Route::get('/pilih-kamar', [PilihKamarController::class, 'index'])->name('pilih-kamar.index');
        Route::post('/pilih-kamar', [PilihKamarController::class, 'store'])->name('pilih-kamar.store');

        // Pembayaran Midtrans
        Route::post('/tagihan/{tagihan}/snap-token', [PaymentController::class, 'getSnapToken'])->name('payment.snap-token');
        Route::post('/tagihan/{tagihan}/simulate-success', [PaymentController::class, 'simulateSuccess'])->name('payment.simulate-success');

        // Komplain
        Route::get('/user/komplain', [KomplainController::class, 'index'])->name('user.komplain.index');
        Route::post('/user/komplain', [KomplainController::class, 'store'])->name('user.komplain.store');
        Route::post('/user/komplain/{komplain}/rate', [KomplainController::class, 'rate'])->name('user.komplain.rate');

        // Profile
        Route::get('/profile', [ProfileController::class, 'edit'])->name('user.profile.edit');
        Route::post('/profile', [ProfileController::class, 'update'])->name('user.profile.update');
    });
});

// Route Khusus ADMIN (Dilindungi middleware 'admin' yang baru kita buat)
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/kamar', [KamarController::class, 'index'])->name('kamar.index');
    Route::post('/kamar', [KamarController::class, 'store'])->name('kamar.store');
    Route::put('/kamar/{kamar}', [KamarController::class, 'update'])->name('kamar.update');
    Route::delete('/kamar/{kamar}', [KamarController::class, 'destroy'])->name('kamar.destroy');

    Route::get('/penghuni', [PenghuniController::class, 'index'])->name('penghuni.index');
    Route::post('/penghuni', [PenghuniController::class, 'store'])->name('penghuni.store');
    Route::put('/penghuni/{penghuni}', [PenghuniController::class, 'update'])->name('penghuni.update');
    Route::delete('/penghuni/{penghuni}', [PenghuniController::class, 'destroy'])->name('penghuni.destroy');

    Route::get('/sewa', [SewaController::class, 'index'])->name('sewa.index');
    Route::post('/sewa', [SewaController::class, 'store'])->name('sewa.store');
    Route::delete('/sewa/{sewa}', [SewaController::class, 'destroy'])->name('sewa.destroy');
    Route::post('/sewa/{sewa}/terima', [SewaController::class, 'terima'])->name('sewa.terima');
    Route::post('/sewa/{sewa}/tolak', [SewaController::class, 'tolak'])->name('sewa.tolak');

    Route::get('/tagihan', [TagihanController::class, 'index'])->name('tagihan.index');
    Route::post('/tagihan', [TagihanController::class, 'store'])->name('tagihan.store');
    Route::put('/tagihan/{tagihan}', [TagihanController::class, 'updateStatus'])->name('tagihan.updateStatus');

    // Komplain
    Route::get('/komplain', [App\Http\Controllers\Admin\KomplainController::class, 'index'])->name('komplain.index');
    Route::put('/komplain/{komplain}/status', [App\Http\Controllers\Admin\KomplainController::class, 'updateStatus'])->name('komplain.updateStatus');

    // Profile Settings
    Route::get('/profile', [App\Http\Controllers\Admin\ProfileController::class, 'edit'])->name('profile.edit');
    Route::post('/profile', [App\Http\Controllers\Admin\ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/password', [App\Http\Controllers\Admin\ProfileController::class, 'updatePassword'])->name('password.update');
});

// Route Khusus PEMILIK (Dilindungi middleware 'pemilik')
Route::middleware(['auth', 'pemilik'])->prefix('pemilik')->name('pemilik.')->group(function () {
    Route::get('/dashboard', [App\Http\Controllers\Pemilik\DashboardController::class, 'index'])->name('dashboard');
    Route::get('/export-pdf', [App\Http\Controllers\Pemilik\DashboardController::class, 'exportPdf'])->name('export.pdf');
    Route::get('/kamar', [App\Http\Controllers\Pemilik\KamarController::class, 'index'])->name('kamar.index');
    Route::get('/penghuni', [App\Http\Controllers\Pemilik\PenghuniController::class, 'index'])->name('penghuni.index');
    Route::get('/sewa', [App\Http\Controllers\Pemilik\SewaController::class, 'index'])->name('sewa.index');
    Route::get('/tagihan', [App\Http\Controllers\Pemilik\TagihanController::class, 'index'])->name('tagihan.index');
    Route::get('/activity-log', [ActivityLogController::class, 'index'])->name('activity-log.index');

    // Pengeluaran
    Route::get('/pengeluaran', [PengeluaranController::class, 'index'])->name('pengeluaran.index');
    Route::post('/pengeluaran', [PengeluaranController::class, 'store'])->name('pengeluaran.store');
    Route::delete('/pengeluaran/{pengeluaran}', [PengeluaranController::class, 'destroy'])->name('pengeluaran.destroy');

    // Profile Settings
    Route::get('/profile', [App\Http\Controllers\Admin\ProfileController::class, 'edit'])->name('profile.edit');
    Route::post('/profile', [App\Http\Controllers\Admin\ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/password', [App\Http\Controllers\Admin\ProfileController::class, 'updatePassword'])->name('password.update');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
