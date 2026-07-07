<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Kwitansi Pembayaran eKOS</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #333;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #8b5a2b; /* cozy-brown */
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            margin: 0;
            color: #8b5a2b;
            font-size: 28px;
        }
        .header p {
            margin: 5px 0 0;
            color: #666;
            font-size: 14px;
        }
        .invoice-details {
            margin-bottom: 30px;
        }
        .invoice-details table {
            width: 100%;
        }
        .invoice-details td {
            padding: 5px 0;
        }
        .invoice-details .label {
            font-weight: bold;
            width: 150px;
            color: #555;
        }
        .amount-box {
            background-color: #f9f6f0;
            border: 1px solid #e5dac7;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin-bottom: 30px;
        }
        .amount-box h2 {
            margin: 0;
            color: #8b5a2b;
            font-size: 32px;
        }
        .amount-box p {
            margin: 5px 0 0;
            color: #666;
        }
        .stamp {
            text-align: center;
            margin-top: 50px;
        }
        .stamp-box {
            display: inline-block;
            border: 3px solid #22c55e;
            color: #22c55e;
            font-size: 24px;
            font-weight: bold;
            padding: 10px 30px;
            border-radius: 10px;
            transform: rotate(-5deg);
            opacity: 0.8;
            letter-spacing: 4px;
        }
        .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 12px;
            color: #999;
            border-top: 1px solid #eee;
            padding-top: 20px;
        }
    </style>
</head>
<body>

    <div class="header">
        <h1>eKOS</h1>
        <p>Sistem Manajemen Kos Modern</p>
    </div>

    <h2 style="text-align: center; margin-bottom: 30px; color: #444;">KWITANSI PEMBAYARAN</h2>

    <div class="invoice-details">
        <table>
            <tr>
                <td class="label">No. Tagihan</td>
                <td>: INV-{{ $tagihan->id }}-{{ strtotime($tagihan->created_at) }}</td>
            </tr>
            <tr>
                <td class="label">Tanggal Bayar</td>
                <td>: {{ $tagihan->updated_at->translatedFormat('d F Y') }}</td>
            </tr>
            <tr>
                <td class="label">Telah terima dari</td>
                <td>: {{ $user->name }}</td>
            </tr>
            <tr>
                <td class="label">Untuk Pembayaran</td>
                <td>: Sewa Kamar Kos No. {{ $kamar->nomor_kamar }} ({{ $kamar->tipe_kamar }})</td>
            </tr>
            <tr>
                <td class="label">Periode</td>
                <td>: {{ $tagihan->bulan_tagihan }}</td>
            </tr>
        </table>
    </div>

    <div class="amount-box">
        <p>Total Pembayaran</p>
        <h2>Rp {{ number_format($tagihan->jumlah_bayar, 0, ',', '.') }}</h2>
    </div>

    <div class="stamp">
        <div class="stamp-box">LUNAS</div>
    </div>

    <div class="footer">
        <p>Terima kasih telah melakukan pembayaran tepat waktu.<br>Kwitansi ini adalah bukti pembayaran yang sah dan diterbitkan secara otomatis oleh sistem eKOS.</p>
    </div>

</body>
</html>
