<?php

namespace App\Http\Controllers\Pemilik;

use App\Http\Controllers\Controller;
use App\Models\Pengeluaran;
use App\Models\Kamar;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PengeluaranController extends Controller
{
    public function index()
    {
        $pengeluarans = Pengeluaran::with('kamar')->latest('tanggal')->get();
        $kamars = Kamar::orderBy('nomor_kamar')->get();

        return Inertia::render('Pemilik/Pengeluaran', [
            'pengeluarans' => $pengeluarans,
            'kamars' => $kamars
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'tanggal' => 'required|date',
            'kategori' => 'required|string',
            'jumlah' => 'required|integer|min:0',
            'keterangan' => 'nullable|string',
            'kamar_id' => 'nullable|exists:kamars,id'
        ]);

        $pengeluaran = Pengeluaran::create($request->all());

        \App\Models\ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => 'buat_pengeluaran',
            'description' => "Mencatat pengeluaran baru: {$request->kategori} sebesar Rp " . number_format($request->jumlah, 0, ',', '.'),
            'details' => ['pengeluaran_id' => $pengeluaran->id]
        ]);

        return redirect()->back()->with('message', 'Catatan pengeluaran berhasil ditambahkan!');
    }

    public function destroy(Pengeluaran $pengeluaran)
    {
        $pengeluaran->delete();

        \App\Models\ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => 'hapus_pengeluaran',
            'description' => "Menghapus data pengeluaran: {$pengeluaran->kategori}",
            'details' => ['pengeluaran_id' => $pengeluaran->id]
        ]);

        return redirect()->back()->with('message', 'Catatan pengeluaran berhasil dihapus!');
    }
}
