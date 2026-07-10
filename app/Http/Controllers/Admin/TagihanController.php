<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Sewa;
use App\Models\Tagihan;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TagihanController extends Controller
{
    public function index()
    {
        // Ambil tagihan beserta relasinya (kamar dan penyewa)
        $tagihans = Tagihan::with(['sewa.penyewa.user', 'sewa.kamar'])->latest()->get()->map(function ($tagihan) {
            $is_late = false;

            if (! $tagihan->status_lunas && $tagihan->sewa && $tagihan->sewa->tanggal_masuk) {
                // Parse bulan_tagihan safely (handle both "2026-07" and "July" formats)
                try {
                    $bulanTagihan = Carbon::createFromFormat('Y-m', $tagihan->bulan_tagihan);
                } catch (\Exception $e) {
                    $bulanTagihan = Carbon::parse($tagihan->bulan_tagihan);
                }
                $tanggalMasuk = Carbon::parse($tagihan->sewa->tanggal_masuk);

                // Set the day of the due date to the day they started renting
                $dueDate = $bulanTagihan->copy()->day($tanggalMasuk->day);

                // If today is past the due date, it's late
                if (Carbon::now()->startOfDay()->gt($dueDate)) {
                    $is_late = true;
                }

                $tagihan->due_date = $dueDate->translatedFormat('d F Y');
            }

            $tagihan->is_late = $is_late;

            return $tagihan;
        });

        // Data sewa aktif untuk form pembuatan tagihan baru
        $sewas = Sewa::with(['penyewa.user', 'kamar'])->whereHas('kamar', function ($q) {
            $q->where('status', 'terisi');
        })->get();

        return Inertia::render('Admin/Tagihan', [
            'tagihans' => $tagihans,
            'sewas' => $sewas,
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

        ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => 'buat_tagihan',
            'description' => "Membuat tagihan baru untuk bulan {$request->bulan_tagihan} sejumlah ".number_format($request->jumlah_bayar, 0, ',', '.'),
            'details' => ['tagihan_id' => $tagihan->id],
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
        ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => 'update_tagihan',
            'description' => "Mengubah status tagihan bulan {$tagihan->bulan_tagihan} menjadi {$status_text}",
            'details' => ['tagihan_id' => $tagihan->id, 'status' => $request->status_lunas],
        ]);

        return redirect()->back()->with('message', 'Status pembayaran berhasil diperbarui!');
    }

    public function destroy(Tagihan $tagihan)
    {
        $id = $tagihan->id;
        $bulan = $tagihan->bulan_tagihan;
        $tagihan->delete();

        ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => 'hapus_tagihan',
            'description' => "Menghapus data tagihan bulan {$bulan}",
            'details' => ['tagihan_id' => $id],
        ]);

        return redirect()->back()->with('message', 'Tagihan berhasil dihapus!');
    }
}
