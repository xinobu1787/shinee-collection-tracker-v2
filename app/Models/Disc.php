<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Disc extends Model
{

    protected $fillable = [
        'code',
        'artist',
        'title',
        'title_sub',
        'category',
        'country',
        'release_date',
    ];

    public function editions()
    {
        return $this -> hasMany(Edition::class, 'disc_id', 'id');
    }

    public function randomItems()
    {
        return $this -> hasMany(RandomItem::class, 'disc_id', 'id');
    }

    public function scopeLatestOrder($query)
    {
        return $query -> orderBy('release_date', 'desc')
                      -> orderBy('id', 'asc');
    }
}
