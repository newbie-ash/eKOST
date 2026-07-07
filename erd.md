```mermaid
  erDiagram
      USERS ||--o{ SEWAS : melakukan
      USERS ||--o{ KOMPLAINS : mengajukan
      KAMARS ||--o{ SEWAS : disewa
      SEWAS ||--o{ TAGIHANS : memiliki
      USERS {
          int id PK
          string name
          string email
          string role "admin/user"
          string no_hp
      }
      KAMARS {
          int id PK
          string nomor_kamar
          string tipe_kamar
          int harga
          string status
      }
      SEWAS {
          int id PK
          int user_id FK
          int kamar_id FK
          date tanggal_masuk
          int durasi_bulan
          string status
      }
      TAGIHANS {
          int id PK
          int sewa_id FK
          string bulan_tagihan
          int jumlah
          string status
      }
      KOMPLAINS {
          int id PK
          int user_id FK
          string deskripsi
          string status
      }
  ```