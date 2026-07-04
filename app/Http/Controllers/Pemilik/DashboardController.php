<?php

namespace App\Http\Controllers\Pemilik;

use App\Http\Controllers\Controller;
use App\Models\Kamar;
use App\Models\Penyewa;
use App\Models\Tagihan;
use App\Models\Pengeluaran;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $bulanSekarang = Carbon::now()->month;
        $tahunSekarang = Carbon::now()->year;

        $totalKamar = Kamar::count();
        $kamarTerisi = Kamar::where('status', 'terisi')->count();
        $kamarKosong = Kamar::where('status', 'kosong')->count();

        $totalPenyewa = Penyewa::count();

        // Pemasukan dari tagihan lunas bulan ini
        $pemasukanBulanIni = Tagihan::where('status_lunas', true)
            ->whereMonth('created_at', $bulanSekarang)
            ->whereYear('created_at', $tahunSekarang)
            ->sum('jumlah_bayar');

        // Pengeluaran bulan ini
        $pengeluaranBulanIni = Pengeluaran::whereMonth('tanggal', $bulanSekarang)
            ->whereYear('tanggal', $tahunSekarang)
            ->sum('jumlah');

        $labaBersih = $pemasukanBulanIni - $pengeluaranBulanIni;

        // Ambil data aktivitas terbaru
        $recentActivities = \App\Models\ActivityLog::with('user')
            ->latest()
            ->take(5)
            ->get();

        // Data Grafik Keuangan (6 bulan terakhir)
        $chartData = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $monthName = $month->translatedFormat('M Y');
            
            $pemasukan = Tagihan::where('status_lunas', true)
                ->whereMonth('created_at', $month->month)
                ->whereYear('created_at', $month->year)
                ->sum('jumlah_bayar');
                
            $pengeluaran = Pengeluaran::whereMonth('tanggal', $month->month)
                ->whereYear('tanggal', $month->year)
                ->sum('jumlah');
                
            $chartData[] = [
                'name' => $monthName,
                'Pemasukan' => (int) $pemasukan,
                'Pengeluaran' => (int) $pengeluaran,
            ];
        }

        return Inertia::render('Pemilik/Dashboard', [
            'stats' => [
                'total_kamar' => $totalKamar,
                'kamar_terisi' => $kamarTerisi,
                'kamar_kosong' => $kamarKosong,
                'total_penyewa' => $totalPenyewa,
                'pemasukan_bulan_ini' => $pemasukanBulanIni,
                'pengeluaran_bulan_ini' => $pengeluaranBulanIni,
                'laba_bersih' => $labaBersih,
            ],
            'recentActivities' => $recentActivities,
            'chartData' => $chartData
        ]);
    }
}
