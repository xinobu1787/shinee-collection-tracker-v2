<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class UserRandom extends Model
{
    protected $fillable = [
        'item_id',
        'user_id',
        'image_url',
    ];

    public function randomItem()
    {
        return $this->belongsTo(RandomItem::class, 'item_id', 'id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
