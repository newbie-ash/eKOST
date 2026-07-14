<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Komplain;
use App\Models\Sewa;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KomplainController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Pastikan user adalah penyewa
        if (! $user->penyewa) {
            return redirect()->route('pilih-kamar.index')->with('error', 'Anda harus menyewa kamar terlebih dahulu.');
        }

        // Ambil riwayat komplain user ini
        $komplains = Komplain::where('penyewa_id', $user->penyewa->id)
            ->with('kamar')
            ->latest()
            ->get();

        // Cek apakah user memiliki kamar aktif yang sedang disewa
        $sewaAktif = Sewa::where('penyewa_id', $user->penyewa->id)
            ->where('status_sewa', 'Aktif')
            ->with('kamar')
            ->first();

        return Inertia::render('User/Komplain', [
            'komplains' => $komplains,
            'kamarAktif' => $sewaAktif ? $sewaAktif->kamar : null,
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        if (! $user->penyewa) {
            return redirect()->back()->with('error', 'Akses ditolak.');
        }

        $request->validate([
            'kamar_id' => 'required|exists:kamars,id',
            'judul_komplain' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'foto_kerusakan' => 'nullable|image|max:2048',
        ]);

        $fotoPath = null;
        if ($request->hasFile('foto_kerusakan')) {
            $fotoPath = $request->file('foto_kerusakan')->store('komplain_fotos', 'public');
        }

        $komplain = Komplain::create([
            'penyewa_id' => $user->penyewa->id,
            'kamar_id' => $request->kamar_id,
            'judul_komplain' => $request->judul_komplain,
            'deskripsi' => $request->deskripsi,
            'foto_kerusakan' => $fotoPath,
            'status' => 'Menunggu',
        ]);

        $komplain->load(['penyewa.user', 'kamar']);
        event(new \App\Events\MessageSent($komplain));

        return redirect()->back()->with('success', 'Laporan kerusakan berhasil dikirim.');
    }

    public function rate(Request $request, Komplain $komplain)
    {
        $user = $request->user();

        if (! $user->penyewa || $komplain->penyewa_id !== $user->penyewa->id) {
            return redirect()->back()->with('error', 'Akses ditolak.');
        }

        if ($komplain->status !== 'Selesai') {
            return redirect()->back()->with('error', 'Komplain belum selesai, tidak dapat memberikan penilaian.');
        }

        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'ulasan_penyewa' => 'nullable|string|max:1000',
        ]);

        $komplain->update([
            'rating' => $request->rating,
            'ulasan_penyewa' => $request->ulasan_penyewa,
        ]);

        return redirect()->back()->with('success', 'Terima kasih atas penilaian Anda.');
    }
}
