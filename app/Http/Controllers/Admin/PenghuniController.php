<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Penyewa;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class PenghuniController extends Controller
{
    public function index()
    {
        // Ambil data penyewa beserta data akun user-nya
        $penghunis = Penyewa::with('user')->latest()->get();

        return Inertia::render('Admin/Penghuni', [
            'penghunis' => $penghunis,
        ]);
    }

    public function store(Request $request)
    {
        // 1. Validasi inputan dari form
        $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email',
            'nomor_ktp' => 'required|string|max:16',
            'pekerjaan' => 'required|string',
            'kontak_darurat' => 'required|string|max:15',
        ]);

        // 2. Buat akun User
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make('kos12345'),
            'role' => 'penyewa',
        ]);

        // 3. Simpan biodata penyewa dan sambungkan ke user
        Penyewa::create([
            'user_id' => $user->id,
            'nomor_ktp' => $request->nomor_ktp,
            'pekerjaan' => $request->pekerjaan,
            'kontak_darurat' => $request->kontak_darurat,
        ]);

        ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => 'add_penghuni',
            'description' => "Menambahkan penghuni baru bernama {$request->name}",
            'details' => ['email' => $request->email],
        ]);

        return redirect()->back()->with('message', 'Penghuni berhasil ditambahkan! Password default: kos12345');
    }

    public function destroy(Penyewa $penghuni)
    {
        $user = User::find($penghuni->user_id);
        $name = $user ? $user->name : 'Unknown';

        if ($user) {
            $user->delete();
        }

        ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => 'delete_penghuni',
            'description' => "Menghapus data penghuni bernama {$name}",
            'details' => ['penghuni_id' => $penghuni->id],
        ]);

        return redirect()->back()->with('message', 'Data Penghuni beserta Akunnya berhasil dihapus!');
    }
}
