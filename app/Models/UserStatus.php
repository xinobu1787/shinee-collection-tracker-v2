<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class UserStatus extends Model
{
    protected $table = 'user_status';

    protected $fillable = [
        'edition_id',
        'user_id',
        'is_purchased',
        'is_wishlist',
    ];

    protected $casts = [
        'is_purchased' => 'boolean',
        'is_wishlist' => 'boolean',
    ];

    public function user() {
        return $this -> belongsTo(User::class, 'user_id', 'id');
    }

    public function edition() {
        return $this->belongsTo(Edition::class, 'edition_id');
    }
}
