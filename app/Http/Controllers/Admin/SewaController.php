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
            'nama_penyewa' => 'required|string|max:255',
            'kamar_id' => 'required|exists:kamars,id',
            'tanggal_masuk' => 'required|date',
            'durasi_bulan' => 'required|integer|min:1',
        ]);

        // Cari penyewa berdasarkan nama atau buat baru jika tidak ada
        $user = \App\Models\User::firstOrCreate(
            ['name' => $request->nama_penyewa],
            [
                'email' => strtolower(str_replace(' ', '', $request->nama_penyewa)) . rand(10,99) . '@ekos.com',
                'password' => \Illuminate\Support\Facades\Hash::make('kos12345'),
                'role' => 'penyewa'
            ]
        );

        $penyewa = \App\Models\Penyewa::firstOrCreate(
            ['user_id' => $user->id],
            [
                'nomor_ktp' => '0000000000000000',
                'pekerjaan' => 'Penyewa',
                'kontak_darurat' => '08000000000',
                'jenis_kelamin' => 'L',
                'nama_kontak_darurat' => 'Keluarga'
            ]
        );

        // Catat data sewa
        Sewa::create([
            'penyewa_id' => $penyewa->id,
            'kamar_id' => $request->kamar_id,
            'tanggal_masuk' => $request->tanggal_masuk,
            'durasi_bulan' => $request->durasi_bulan,
        ]);

        // Otomatis ubah status kamar menjadi 'terisi'
        Kamar::find($request->kamar_id)->update(['status' => 'terisi']);

        \App\Models\ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => 'add_sewa',
            'description' => "Menambahkan data sewa baru untuk {$request->nama_penyewa} di Kamar " . Kamar::find($request->kamar_id)->nomor_kamar,
            'details' => ['kamar_id' => $request->kamar_id]
        ]);

        return redirect()->route('admin.sewa.index')->with('success', 'Data sewa dan tagihan awal berhasil ditambahkan!');
    }

    public function terima(Sewa $sewa)
    {
        $sewa->update(['status_sewa' => 'Aktif']);
        
        $kamar = Kamar::find($sewa->kamar_id);
        if ($kamar) {
            $kamar->update(['status' => 'terisi']);
        }

        \App\Models\ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => 'terima_sewa',
            'description' => "Menerima pengajuan sewa untuk Kamar " . ($kamar ? $kamar->nomor_kamar : 'Unknown'),
            'details' => ['sewa_id' => $sewa->id]
        ]);

        return redirect()->route('admin.sewa.index')->with('success', 'Pengajuan sewa diterima. Status kamar menjadi terisi.');
    }

    public function tolak(Sewa $sewa)
    {
        $kamar = Kamar::find($sewa->kamar_id);
        if ($kamar && $kamar->status === 'dibooking') {
            $kamar->update(['status' => 'kosong']);
        }
        
        $sewa_id = $sewa->id;
        $sewa->delete();

        \App\Models\ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => 'tolak_sewa',
            'description' => "Menolak pengajuan sewa untuk Kamar " . ($kamar ? $kamar->nomor_kamar : 'Unknown'),
            'details' => ['sewa_id' => $sewa_id]
        ]);

        return redirect()->route('admin.sewa.index')->with('success', 'Pengajuan sewa ditolak.');
    }

    public function destroy(Sewa $sewa)
    {
        // Otomatis kembalikan status kamar menjadi 'kosong'
        $kamar = Kamar::find($sewa->kamar_id);
        if ($kamar) {
            $kamar->update(['status' => 'kosong']);
        }
        
        $sewa->update([
            'status_sewa' => 'Selesai',
            'tanggal_keluar' => \Carbon\Carbon::now()
        ]);

        \App\Models\ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => 'akhiri_sewa',
            'description' => "Mengakhiri sewa untuk Kamar " . ($kamar ? $kamar->nomor_kamar : 'Unknown'),
            'details' => ['sewa_id' => $sewa->id]
        ]);

        return redirect()->back()->with('message', 'Sewa berhasil diakhiri! Kamar kembali kosong.');
    }
}