<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\KamarController;



Route::get('/', function () {
    $kamars = \App\Models\Kamar::where('status', 'kosong')->get();
    return Inertia::render('Welcome', [
        'kamars' => $kamars,
    ]);
})->name('welcome');

Route::get('/kamar/{kamar}', function (\App\Models\Kamar $kamar) {
    return Inertia::render('KamarDetail', [
        'kamar' => $kamar,
    ]);
})->name('kamar.detail');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        if (auth()->user()->role === 'pemilik') {
            return redirect()->route('pemilik.dashboard');
        } elseif (auth()->user()->role === 'penjaga') {
            return app(\App\Http\Controllers\Admin\DashboardController::class)->index();
        }
        return redirect()->route('tagihan-saya.index');
    })->name('dashboard');
    
    // Route khusus Anak Kos (User Biasa)
    Route::middleware(['is_penghuni'])->group(function () {
        Route::get('/user/tagihan', function () {
            return redirect()->route('tagihan-saya.index');
        });
        Route::get('/tagihan-saya', [\App\Http\Controllers\User\TagihanSayaController::class, 'index'])->name('tagihan-saya.index');

        Route::get('/pilih-kamar', [\App\Http\Controllers\User\PilihKamarController::class, 'index'])->name('pilih-kamar.index');
        Route::post('/pilih-kamar', [\App\Http\Controllers\User\PilihKamarController::class, 'store'])->name('pilih-kamar.store');
        
        // Komplain
        Route::get('/user/komplain', [\App\Http\Controllers\User\KomplainController::class, 'index'])->name('user.komplain.index');
        Route::post('/user/komplain', [\App\Http\Controllers\User\KomplainController::class, 'store'])->name('user.komplain.store');
        Route::post('/user/komplain/{komplain}/rate', [\App\Http\Controllers\User\KomplainController::class, 'rate'])->name('user.komplain.rate');
        
        // Profile
        Route::get('/profile', [\App\Http\Controllers\User\ProfileController::class, 'edit'])->name('user.profile.edit');
        Route::post('/profile', [\App\Http\Controllers\User\ProfileController::class, 'update'])->name('user.profile.update');
    });
});

// Route Khusus ADMIN (Dilindungi middleware 'admin' yang baru kita buat)
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/kamar', [\App\Http\Controllers\Admin\KamarController::class, 'index'])->name('kamar.index');
    Route::post('/kamar', [\App\Http\Controllers\Admin\KamarController::class, 'store'])->name('kamar.store');
    Route::put('/kamar/{kamar}', [\App\Http\Controllers\Admin\KamarController::class, 'update'])->name('kamar.update');
    Route::delete('/kamar/{kamar}', [\App\Http\Controllers\Admin\KamarController::class, 'destroy'])->name('kamar.destroy');
    
    Route::get('/penghuni', [\App\Http\Controllers\Admin\PenghuniController::class, 'index'])->name('penghuni.index');
    Route::post('/penghuni', [\App\Http\Controllers\Admin\PenghuniController::class, 'store'])->name('penghuni.store');
    Route::put('/penghuni/{penghuni}', [\App\Http\Controllers\Admin\PenghuniController::class, 'update'])->name('penghuni.update');
    Route::delete('/penghuni/{penghuni}', [\App\Http\Controllers\Admin\PenghuniController::class, 'destroy'])->name('penghuni.destroy');

    Route::get('/sewa', [\App\Http\Controllers\Admin\SewaController::class, 'index'])->name('sewa.index');
    Route::post('/sewa', [\App\Http\Controllers\Admin\SewaController::class, 'store'])->name('sewa.store');
    Route::delete('/sewa/{sewa}', [\App\Http\Controllers\Admin\SewaController::class, 'destroy'])->name('sewa.destroy');
    Route::post('/sewa/{sewa}/terima', [\App\Http\Controllers\Admin\SewaController::class, 'terima'])->name('sewa.terima');
    Route::post('/sewa/{sewa}/tolak', [\App\Http\Controllers\Admin\SewaController::class, 'tolak'])->name('sewa.tolak');

    Route::get('/tagihan', [\App\Http\Controllers\Admin\TagihanController::class, 'index'])->name('tagihan.index');
    Route::post('/tagihan', [\App\Http\Controllers\Admin\TagihanController::class, 'store'])->name('tagihan.store');
    Route::put('/tagihan/{tagihan}', [\App\Http\Controllers\Admin\TagihanController::class, 'updateStatus'])->name('tagihan.updateStatus');

    // Komplain
    Route::get('/komplain', [\App\Http\Controllers\Admin\KomplainController::class, 'index'])->name('komplain.index');
    Route::put('/komplain/{komplain}/status', [\App\Http\Controllers\Admin\KomplainController::class, 'updateStatus'])->name('komplain.updateStatus');

    // Profile Settings
    Route::get('/profile', [\App\Http\Controllers\Admin\ProfileController::class, 'edit'])->name('profile.edit');
    Route::post('/profile', [\App\Http\Controllers\Admin\ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/password', [\App\Http\Controllers\Admin\ProfileController::class, 'updatePassword'])->name('password.update');
});

// Route Khusus PEMILIK (Dilindungi middleware 'pemilik')
Route::middleware(['auth', 'pemilik'])->prefix('pemilik')->name('pemilik.')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\Pemilik\DashboardController::class, 'index'])->name('dashboard');
    Route::get('/export-pdf', [\App\Http\Controllers\Pemilik\DashboardController::class, 'exportPdf'])->name('export.pdf');
    Route::get('/kamar', [\App\Http\Controllers\Pemilik\KamarController::class, 'index'])->name('kamar.index');
    Route::get('/penghuni', [\App\Http\Controllers\Pemilik\PenghuniController::class, 'index'])->name('penghuni.index');
    Route::get('/sewa', [\App\Http\Controllers\Pemilik\SewaController::class, 'index'])->name('sewa.index');
    Route::get('/tagihan', [\App\Http\Controllers\Pemilik\TagihanController::class, 'index'])->name('tagihan.index');
    Route::get('/activity-log', [\App\Http\Controllers\Pemilik\ActivityLogController::class, 'index'])->name('activity-log.index');

    // Pengeluaran
    Route::get('/pengeluaran', [\App\Http\Controllers\Pemilik\PengeluaranController::class, 'index'])->name('pengeluaran.index');
    Route::post('/pengeluaran', [\App\Http\Controllers\Pemilik\PengeluaranController::class, 'store'])->name('pengeluaran.store');
    Route::delete('/pengeluaran/{pengeluaran}', [\App\Http\Controllers\Pemilik\PengeluaranController::class, 'destroy'])->name('pengeluaran.destroy');

    // Profile Settings
    Route::get('/profile', [\App\Http\Controllers\Admin\ProfileController::class, 'edit'])->name('profile.edit');
    Route::post('/profile', [\App\Http\Controllers\Admin\ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/password', [\App\Http\Controllers\Admin\ProfileController::class, 'updatePassword'])->name('password.update');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';