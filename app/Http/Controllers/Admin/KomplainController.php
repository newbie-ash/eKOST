<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Komplain;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KomplainController extends Controller
{
    public function index()
    {
        $komplains = Komplain::with(['penyewa.user', 'kamar'])->latest()->get();

        return Inertia::render('Admin/Komplain', [
            'komplains' => $komplains
        ]);
    }

    public function updateStatus(Request $request, Komplain $komplain)
    {
        $request->validate([
            'status' => 'required|in:Menunggu,Diproses,Selesai'
        ]);

        $komplain->update([
            'status' => $request->status
        ]);

        \App\Models\ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => 'update_komplain',
            'description' => "Memperbarui status komplain '{$komplain->judul_komplain}' (Kamar {$komplain->kamar->nomor_kamar}) menjadi {$request->status}.",
            'details' => ['komplain_id' => $komplain->id, 'status' => $request->status]
        ]);

        return redirect()->back()->with('message', 'Status komplain berhasil diperbarui!');
    }
}
