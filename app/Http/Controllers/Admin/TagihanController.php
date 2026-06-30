<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tagihan;
use App\Models\Sewa;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TagihanController extends Controller
{
    public function index()
    {
        // Ambil tagihan beserta relasinya (kamar dan penyewa)
        $tagihans = Tagihan::with(['sewa.penyewa.user', 'sewa.kamar'])->latest()->get();
        
        // Data sewa aktif untuk form pembuatan tagihan baru
        $sewas = Sewa::with(['penyewa.user', 'kamar'])->whereHas('kamar', function($q) {
            $q->where('status', 'terisi');
        })->get();

        return Inertia::render('Admin/Tagihan', [
            'tagihans' => $tagihans,
            'sewas' => $sewas
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'sewa_id' => 'required|exists:sewas,id',
            'bulan_tagihan' => 'required|string',
            'jumlah_bayar' => 'required|integer',
        ]);

        Tagihan::create([
            'sewa_id' => $request->sewa_id,
            'bulan_tagihan' => $request->bulan_tagihan,
            'jumlah_bayar' => $request->jumlah_bayar,
            'status_lunas' => false,
        ]);

        return redirect()->back()->with('message', 'Tagihan bulanan berhasil dibuat!');
    }

    public function update(Request $request, Tagihan $tagihan)
    {
        $request->validate([
            'status_lunas' => 'required|boolean',
        ]);

        $tagihan->update(['status_lunas' => $request->status_lunas]);

        return redirect()->back()->with('message', 'Status pembayaran berhasil diperbarui!');
    }

    public function destroy(Tagihan $tagihan)
    {
        $tagihan->delete();
        return redirect()->back()->with('message', 'Tagihan berhasil dihapus!');
    }
}