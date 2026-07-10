<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function edit(Request $request)
    {
        $user = $request->user();
        // Pastikan relasi penyewa di-load
        $user->load('penyewa');

        return Inertia::render('User/Profile', [
            'auth' => [
                'user' => $user,
            ],
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:users,email,'.$user->id,
            'jenis_kelamin' => 'nullable|in:L,P',
            'telepon' => 'nullable|string|max:20',
            'nomor_ktp' => 'nullable|string|max:50',
            'pekerjaan' => 'nullable|string|max:255',
            'nama_kontak_darurat' => 'nullable|string|max:255',
            'kontak_darurat' => 'nullable|string|max:20',
            'foto_ktp' => 'nullable|image|max:2048', // max 2MB
            'foto_profil' => 'nullable|image|max:2048', // max 2MB
        ]);

        // Jika email berubah, set email_verified_at menjadi null (opsional)
        if ($user->email !== $validated['email']) {
            $user->email_verified_at = null;
        }

        // Update nama user dan email
        $user->name = $validated['name'];
        $user->email = $validated['email'];

        if ($request->hasFile('foto_profil')) {
            if ($user->foto_profil) {
                Storage::disk('public')->delete($user->foto_profil);
            }
            $user->foto_profil = $request->file('foto_profil')->store('profiles', 'public');
        }

        $user->save();

        // Handle foto_ktp upload
        $foto_ktp_path = $user->penyewa->foto_ktp ?? null;
        if ($request->hasFile('foto_ktp')) {
            if ($foto_ktp_path) {
                Storage::disk('public')->delete($foto_ktp_path);
            }
            $foto_ktp_path = $request->file('foto_ktp')->store('foto_ktp', 'public');
        }

        // Update atau buat data penyewa
        $user->penyewa()->updateOrCreate(
            ['user_id' => $user->id],
            [
                'jenis_kelamin' => $validated['jenis_kelamin'] ?? null,
                'telepon' => $validated['telepon'] ?? null,
                'nomor_ktp' => $validated['nomor_ktp'] ?? null,
                'pekerjaan' => $validated['pekerjaan'] ?? null,
                'nama_kontak_darurat' => $validated['nama_kontak_darurat'] ?? null,
                'kontak_darurat' => $validated['kontak_darurat'] ?? null,
                'foto_ktp' => $foto_ktp_path,
            ]
        );

        return redirect()->route('user.profile.edit')->with('success', 'Profil berhasil diperbarui.');
    }
}
