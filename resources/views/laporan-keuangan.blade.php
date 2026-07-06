<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Keuangan eKOS - {{ $bulan }}</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; color: #333; }
        .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 10px; }
        .header h1 { margin: 0; font-size: 24px; color: #2c1810; }
        .header p { margin: 5px 0 0 0; font-size: 14px; color: #666; }
        .section-title { font-size: 16px; font-weight: bold; margin-bottom: 10px; margin-top: 20px; background-color: #f4f4f4; padding: 5px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f9f9f9; font-weight: bold; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .summary-box { border: 2px solid #2c1810; padding: 15px; margin-top: 20px; text-align: right; }
        .summary-box h3 { margin: 0; font-size: 18px; }
        .text-green { color: green; }
        .text-red { color: red; }
    </style>
</head>
<body>

    <div class="header">
        <h1>eKOS - Laporan Keuangan</h1>
        <p>Periode Bulan: <strong>{{ $bulan }}</strong></p>
    </div>

    <div class="section-title">A. Pemasukan (Tagihan Kos Lunas)</div>
    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Kamar</th>
                <th>Penyewa</th>
                <th>Tanggal Pembayaran</th>
                <th class="text-right">Nominal</th>
            </tr>
        </thead>
        <tbody>
            @forelse($pemasukan as $index => $item)
            <tr>
                <td class="text-center">{{ $index + 1 }}</td>
                <td>Kamar {{ $item->sewa->kamar->nomor_kamar ?? '-' }}</td>
                <td>{{ $item->sewa->penyewa->user->name ?? '-' }}</td>
                <td>{{ $item->updated_at->format('d/m/Y') }}</td>
                <td class="text-right">Rp {{ number_format($item->jumlah_bayar, 0, ',', '.') }}</td>
            </tr>
            @empty
            <tr>
                <td colspan="5" class="text-center">Tidak ada data pemasukan bulan ini.</td>
            </tr>
            @endforelse
            <tr>
                <th colspan="4" class="text-right">Total Pemasukan</th>
                <th class="text-right text-green">Rp {{ number_format($totalPemasukan, 0, ',', '.') }}</th>
            </tr>
        </tbody>
    </table>

    <div class="section-title">B. Pengeluaran Operasional</div>
    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Kamar (Opsional)</th>
                <th>Keterangan Pengeluaran</th>
                <th>Tanggal</th>
                <th class="text-right">Nominal</th>
            </tr>
        </thead>
        <tbody>
            @forelse($pengeluaran as $index => $item)
            <tr>
                <td class="text-center">{{ $index + 1 }}</td>
                <td>{{ $item->kamar ? 'Kamar ' . $item->kamar->nomor_kamar : 'Fasilitas Umum' }}</td>
                <td>{{ $item->keterangan }}</td>
                <td>{{ \Carbon\Carbon::parse($item->tanggal)->format('d/m/Y') }}</td>
                <td class="text-right">Rp {{ number_format($item->jumlah, 0, ',', '.') }}</td>
            </tr>
            @empty
            <tr>
                <td colspan="5" class="text-center">Tidak ada data pengeluaran bulan ini.</td>
            </tr>
            @endforelse
            <tr>
                <th colspan="4" class="text-right">Total Pengeluaran</th>
                <th class="text-right text-red">Rp {{ number_format($totalPengeluaran, 0, ',', '.') }}</th>
            </tr>
        </tbody>
    </table>

    <div class="summary-box">
        <p>Total Pemasukan: Rp {{ number_format($totalPemasukan, 0, ',', '.') }}</p>
        <p>Total Pengeluaran: Rp {{ number_format($totalPengeluaran, 0, ',', '.') }}</p>
        <hr style="border: 0; border-top: 1px solid #ccc; margin: 10px 0;">
        <h3>Laba Bersih: <span style="color: {{ $labaBersih >= 0 ? 'green' : 'red' }}">Rp {{ number_format($labaBersih, 0, ',', '.') }}</span></h3>
    </div>

    <div style="margin-top: 50px; text-align: right; font-size: 12px; color: #777;">
        <p>Dicetak pada: {{ \Carbon\Carbon::now()->format('d F Y, H:i') }}</p>
    </div>

</body>
</html>
