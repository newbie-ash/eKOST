<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Sewa;
use App\Models\Kamar;
use App\Models\Penyewa;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SewaController extends Controller
{
    public function index()
    {
        // Ambil riwayat sewa lengkap dengan nama penyewa dan nomor kamar
        $sewas = Sewa::with(['penyewa.user', 'kamar'])->latest()->get();
        
        // Ambil daftar kamar yang statusnya masih 'kosong' saja untuk dipilih di form
        $kamars = Kamar::where('status', 'kosong')->get();
        
        // Ambil daftar semua penyewa
        $penyewas = Penyewa::with('user')->get();
        
        return Inertia::render('Admin/Sewa', [
            'sewas' => $sewas,
            'kamars' => $kamars,
            'penyewas' => $penyewas
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'penyewa_id' => 'required|exists:penyewas,id',
            'kamar_id' => 'required|exists:kamars,id',
            'tanggal_masuk' => 'required|date',
            'durasi_bulan' => 'required|integer|min:1',
        ]);

        // Catat data sewa
        Sewa::create([
            'penyewa_id' => $request->penyewa_id,
            'kamar_id' => $request->kamar_id,
            'tanggal_masuk' => $request->tanggal_masuk,
            'durasi_bulan' => $request->durasi_bulan,
        ]);

        // Otomatis ubah status kamar menjadi 'terisi'
        Kamar::find($request->kamar_id)->update(['status' => 'terisi']);

        return redirect()->back()->with('message', 'Penempatan kamar berhasil diproses!');
    }

    public function destroy(Sewa $sewa)
    {
        // Otomatis kembalikan status kamar menjadi 'kosong'
        Kamar::find($sewa->kamar_id)->update(['status' => 'kosong']);
        
        $sewa->update([
            'status_sewa' => 'Selesai',
            'tanggal_keluar' => \Carbon\Carbon::now()
        ]);

        return redirect()->back()->with('message', 'Sewa berhasil diakhiri! Kamar kembali kosong.');
    }
}