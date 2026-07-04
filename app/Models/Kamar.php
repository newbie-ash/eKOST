<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Kamar extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function sewas(): HasMany
    {
        return $this->hasMany(Sewa::class);
    }

    public function komplains(): HasMany
    {
        return $this->hasMany(Komplain::class);
    }

    public function pengeluarans(): HasMany
    {
        return $this->hasMany(Pengeluaran::class);
    }
}