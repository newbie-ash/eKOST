<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Kamar;
use App\Models\Penyewa;
use App\Models\Sewa;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PilihKamarController extends Controller
{
    public function index()
    {
        // 1. Ambil semua kamar yang berstatus kosong
        $kamars = Kamar::where('status', 'kosong')->get();

        // 2. Cek apakah user sudah punya pengajuan yang masih 'Menunggu Konfirmasi'
        $user = Auth::user();
        $penyewa = Penyewa::where('user_id', $user->id)->first();
        $punyaPengajuan = false;

        if ($penyewa) {
            $punyaPengajuan = Sewa::where('penyewa_id', $penyewa->id)
                ->where('status_sewa', 'Menunggu Konfirmasi')
                ->exists();
        }

        return Inertia::render('User/PilihKamar', [
            'kamars' => $kamars,
            'punyaPengajuan' => $punyaPengajuan,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'kamar_id' => 'required|exists:kamars,id',
            'durasi_bulan' => 'required|integer|min:1',
            'tanggal_masuk' => 'required|date',
        ]);

        $user = Auth::user();

        // Buat data penyewa otomatis jika belum ada (misal dia baru daftar)
        $penyewa = Penyewa::firstOrCreate(
            ['user_id' => $user->id]
        );

        // Pastikan tidak ada pengajuan ganda
        $adaPengajuan = Sewa::where('penyewa_id', $penyewa->id)
            ->where('status_sewa', 'Menunggu Konfirmasi')
            ->exists();

        if ($adaPengajuan) {
            return redirect()->back()->with('error', 'Anda sudah memiliki pengajuan sewa yang sedang diproses.');
        }

        // Cek kembali status kamar (race condition prevention)
        $kamar = Kamar::findOrFail($request->kamar_id);
        if ($kamar->status !== 'kosong') {
            return redirect()->back()->with('error', 'Maaf, kamar tersebut baru saja dipesan oleh orang lain.');
        }

        // Hitung tanggal keluar
        $tanggalKeluar = Carbon::parse($request->tanggal_masuk)->addMonths((int) $request->durasi_bulan);

        // Buat pengajuan sewa
        Sewa::create([
            'kamar_id' => $kamar->id,
            'penyewa_id' => $penyewa->id,
            'tanggal_masuk' => $request->tanggal_masuk,
            'durasi_bulan' => $request->durasi_bulan,
            'tanggal_keluar' => $tanggalKeluar,
            'status_sewa' => 'Menunggu Konfirmasi',
        ]);

        // Ubah status kamar menjadi dibooking
        $kamar->update(['status' => 'dibooking']);

        return redirect()->route('tagihan-saya.index')->with('success', 'Pengajuan sewa berhasil dikirim. Silakan tunggu konfirmasi Admin.');
    }
}
