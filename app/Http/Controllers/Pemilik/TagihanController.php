<?php

namespace App\Http\Controllers\Pemilik;

use App\Http\Controllers\Controller;
use App\Models\Tagihan;
use Inertia\Inertia;

class TagihanController extends Controller
{
    public function index()
    {
        $tagihans = Tagihan::with(['sewa.penyewa.user', 'sewa.kamar'])->latest()->get();
        
        $totalPemasukan = Tagihan::where('status_lunas', true)->sum('jumlah_bayar');
        $totalPiutang = Tagihan::where('status_lunas', false)->sum('jumlah_bayar');
        
        return Inertia::render('Pemilik/Tagihan', [
            'tagihans' => $tagihans,
            'summary' => [
                'pemasukan' => $totalPemasukan,
                'piutang' => $totalPiutang,
            ]
        ]);
    }
}
