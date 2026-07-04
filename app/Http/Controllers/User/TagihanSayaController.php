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


}