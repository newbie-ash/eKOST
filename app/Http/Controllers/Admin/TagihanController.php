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

        $tagihan = Tagihan::create([
            'sewa_id' => $request->sewa_id,
            'bulan_tagihan' => $request->bulan_tagihan,
            'jumlah_bayar' => $request->jumlah_bayar,
            'status_lunas' => false,
        ]);

        \App\Models\ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => 'buat_tagihan',
            'description' => "Membuat tagihan baru untuk bulan {$request->bulan_tagihan} sejumlah " . number_format($request->jumlah_bayar, 0, ',', '.'),
            'details' => ['tagihan_id' => $tagihan->id]
        ]);

        return redirect()->back()->with('message', 'Tagihan bulanan berhasil dibuat!');
    }

    public function updateStatus(Request $request, Tagihan $tagihan)
    {
        $request->validate([
            'status_lunas' => 'required|boolean',
        ]);

        $tagihan->update(['status_lunas' => $request->status_lunas]);

        $status_text = $request->status_lunas ? 'Lunas' : 'Belum Lunas';
        \App\Models\ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => 'update_tagihan',
            'description' => "Mengubah status tagihan bulan {$tagihan->bulan_tagihan} menjadi {$status_text}",
            'details' => ['tagihan_id' => $tagihan->id, 'status' => $request->status_lunas]
        ]);

        return redirect()->back()->with('message', 'Status pembayaran berhasil diperbarui!');
    }

    public function destroy(Tagihan $tagihan)
    {
        $id = $tagihan->id;
        $bulan = $tagihan->bulan_tagihan;
        $tagihan->delete();

        \App\Models\ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => 'hapus_tagihan',
            'description' => "Menghapus data tagihan bulan {$bulan}",
            'details' => ['tagihan_id' => $id]
        ]);

        return redirect()->back()->with('message', 'Tagihan berhasil dihapus!');
    }
}