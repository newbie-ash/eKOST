<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Tagihan;
use App\Models\Penyewa;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TagihanSayaController extends Controller
{
    public function index()
    {
        // 1. Ketahui siapa user yang sedang login
        $user = Auth::user();
        
        // 2. Cari data 'penyewa' miliknya berdasarkan user_id
        $penyewa = Penyewa::where('user_id', $user->id)->first();

        // 3. Cari semua tagihan yang terhubung dengan id sewa milik penyewa ini
        $tagihans = collect(); // Kumpulan kosong (jaga-jaga kalau dia belum nyewa kamar)
        
        if ($penyewa) {
            $tagihans = Tagihan::whereHas('sewa', function($query) use ($penyewa) {
                $query->where('penyewa_id', $penyewa->id);
            })->with('sewa.kamar')->latest()->get();
        }

        return Inertia::render('User/TagihanSaya', [
            'tagihans' => $tagihans
        ]);
    }

    public function kwitansi(Tagihan $tagihan)
    {
        // Pastikan tagihan ini milik user yang sedang login
        $user = Auth::user();
        $penyewa = Penyewa::where('user_id', $user->id)->first();

        if (!$penyewa || $tagihan->sewa->penyewa_id !== $penyewa->id) {
            abort(403, 'Unauthorized action.');
        }

        if (!$tagihan->status_lunas) {
            abort(403, 'Tagihan belum lunas.');
        }

        $tagihan->load(['sewa.kamar', 'sewa.penyewa.user']);

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('kwitansi-pdf', [
            'tagihan' => $tagihan,
            'kamar' => $tagihan->sewa->kamar,
            'user' => $user,
        ]);

        return $pdf->download('Kwitansi_Pembayaran_' . $tagihan->bulan_tagihan . '.pdf');
    }
}