```mermaid
  flowchart TD
      %% Aktor
      Pelanggan((Pelanggan))
      Admin((Admin))
  
      %% Batas Sistem
      subgraph eKOS [Sistem Informasi eKOS]
          direction TB
          UC1([Melihat Katalog Kamar])
          UC2([Login / Register])
          UC3([Mengajukan Sewa Kamar])
          UC4([Membayar Tagihan])
          UC5([Mengajukan Komplain])
          
          UC6([Kelola Data Kamar])
          UC7([Kelola Data Penghuni])
          UC8([Buat Tagihan])
          UC9([Kelola Pengeluaran])
          UC10([Cetak Laporan])
      end
  
      %% Relasi Pelanggan
      Pelanggan --- UC1
      Pelanggan --- UC2
      Pelanggan --- UC3
      Pelanggan --- UC4
      Pelanggan --- UC5
  
      %% Relasi Admin
      Admin --- UC2
      Admin --- UC6
      Admin --- UC7
      Admin --- UC8
      Admin --- UC9
      Admin --- UC10
  
      %% Memberikan gaya warna pada aktor
      classDef actor fill:#8B5E3C,stroke:#fff,stroke-width:2px,color:#fff;
      class Pelanggan,Admin actor;
  ```