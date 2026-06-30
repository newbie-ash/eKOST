<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Komplain extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function penyewa(): BelongsTo
    {
        return $this->belongsTo(Penyewa::class);
    }

    public function kamar(): BelongsTo
    {
        return $this->belongsTo(Kamar::class);
    }
}
