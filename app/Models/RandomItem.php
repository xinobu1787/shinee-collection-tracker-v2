<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class RandomItem extends Model
{
    protected $fillable = [
        'disc_id',
        'edition_id',
        'member_name',
        'item_type',
    ];

    public function disc()
    {
        return $this->belongsTo(Disc::class, 'disc_id', 'id');
    }

    public function edition()
    {
        return $this->belongsTo(Edition::class, 'edition_id', 'id');
    }

    public function userRandoms()
    {
        return $this->hasMany(UserRandom::class, 'item_id', 'id');
    }
}
