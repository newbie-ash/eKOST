<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Kamar;
use App\Models\Penyewa;
use App\Models\Sewa;
use App\Models\Tagihan;
use App\Models\Komplain;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $bulanIni = Carbon::now()->month;
        $tahunIni = Carbon::now()->year;

        // Metrik Kamar
        $totalKamar = Kamar::count();
        $kamarTerisi = Kamar::where('status', 'terisi')->count();
        $kamarKosong = Kamar::where('status', 'kosong')->count();

        // Metrik Penghuni Aktif
        $totalPenghuni = Sewa::where('status_sewa', 'Aktif')->count();

        $bulanString = $tahunIni . '-' . str_pad($bulanIni, 2, '0', STR_PAD_LEFT);

        // Keuangan Bulan Ini
        $pemasukanBulanIni = Tagihan::where('status_lunas', true)
            ->where('bulan_tagihan', $bulanString)
            ->sum('jumlah_bayar');

        $tagihanMenunggak = Tagihan::where('status_lunas', false)
            ->where('bulan_tagihan', $bulanString)
            ->count();

        // Aktivitas Terbaru (Tagihan dan Sewa)
        $aktivitasTerbaru = Tagihan::with(['sewa.penyewa.user', 'sewa.kamar'])
            ->latest('updated_at')
            ->take(5)
            ->get();

        $sewaMenungguKonfirmasi = Sewa::where('status_sewa', 'Menunggu Konfirmasi')->count();

        $data = [
            'metrik' => [
                'totalKamar' => $totalKamar,
                'kamarTerisi' => $kamarTerisi,
                'kamarKosong' => $kamarKosong,
                'totalPenghuni' => $totalPenghuni,
                'pemasukanBulanIni' => $pemasukanBulanIni,
                'tagihanMenunggak' => $tagihanMenunggak,
                'sewaMenungguKonfirmasi' => $sewaMenungguKonfirmasi
            ],
            'aktivitasTerbaru' => $aktivitasTerbaru
        ];

        if (auth()->user()->role === 'pemilik') {
            return Inertia::render('Admin/DashboardPemilik', $data);
        } else {
            return Inertia::render('Admin/DashboardPenjaga', $data);
        }
    }
}
