<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Kamar;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KamarController extends Controller
{
    /**
     * Menampilkan daftar kamar (Pengganti SELECT * FROM kamar)
     */
    public function index()
    {
        // Ambil semua data kamar dari database, urutkan dari yang terbaru
        $kamars = Kamar::latest()->get();

        // Kirim data ke tampilan React (Fase 4 nanti)
        return Inertia::render('Admin/Kamar', [
            'kamars' => $kamars,
        ]);
    }

    /**
     * Menyimpan data kamar baru (Pengganti INSERT INTO kamar)
     */
    public function store(Request $request)
    {
        // Validasi: Pastikan admin tidak mengosongkan form
        $request->validate([
            'nomor_kamar' => 'required|string|max:10|unique:kamars,nomor_kamar',
            'tipe_kamar' => 'required|string|max:50',
            'harga' => 'required|integer',
            'status' => 'required|string|max:20',
            'fasilitas' => 'nullable|string',
            'deskripsi' => 'nullable|string',
            'link_maps' => 'nullable|string',
            'galeri_foto.*' => 'nullable|image|max:2048',
        ]);

        $data = $request->except('galeri_foto');

        if ($request->hasFile('galeri_foto')) {
            $paths = [];
            foreach ($request->file('galeri_foto') as $file) {
                $paths[] = $file->store('kamar_galeri', 'public');
            }
            $data['galeri_foto'] = $paths;
        }

        // Simpan ke database secara otomatis dengan Eloquent ORM
        $kamar = Kamar::create($data);

        ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => 'tambah_kamar',
            'description' => "Menambahkan data kamar baru: Kamar {$request->nomor_kamar} ({$request->tipe_kamar})",
            'details' => ['kamar_id' => $kamar->id],
        ]);

        // Kembalikan halaman dengan pesan sukses
        return redirect()->back()->with('message', 'Kamar berhasil ditambahkan!');
    }

    /**
     * Mengubah data kamar (Pengganti UPDATE kamar SET ...)
     */
    public function update(Request $request, Kamar $kamar)
    {
        // Validasi inputan
        $request->validate([
            'nomor_kamar' => 'required|string|max:10|unique:kamars,nomor_kamar,'.$kamar->id,
            'tipe_kamar' => 'required|string|max:50',
            'harga' => 'required|integer',
            'status' => 'required|string|max:20',
            'fasilitas' => 'nullable|string',
            'deskripsi' => 'nullable|string',
            'link_maps' => 'nullable|string',
            'galeri_foto.*' => 'nullable|image|max:2048',
        ]);

        $data = $request->except('galeri_foto');

        if ($request->hasFile('galeri_foto')) {
            $paths = [];
            foreach ($request->file('galeri_foto') as $file) {
                $paths[] = $file->store('kamar_galeri', 'public');
            }
            $data['galeri_foto'] = $paths;

            // Optionally delete old files here, but keeping it simple for now
        }

        // Update data yang dipilih
        $kamar->update($data);

        ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => 'edit_kamar',
            'description' => "Mengedit data Kamar {$request->nomor_kamar}",
            'details' => ['kamar_id' => $kamar->id],
        ]);

        return redirect()->back()->with('message', 'Data Kamar berhasil diperbarui!');
    }

    /**
     * Menghapus data kamar (Pengganti DELETE FROM kamar)
     */
    public function destroy(Kamar $kamar)
    {
        $nomor = $kamar->nomor_kamar;
        // Hapus data dari database
        $kamar->delete();

        ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => 'hapus_kamar',
            'description' => "Menghapus data Kamar {$nomor}",
            'details' => ['kamar_id' => $kamar->id ?? null],
        ]);

        return redirect()->back()->with('message', 'Kamar berhasil dihapus!');
    }
}
