<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use App\Models\UserStatus;

class Edition extends Model
{
    protected $fillable = [
        'disc_id',
        'code',
        'name',
        'display_name',
        'price',
        'currency',
        'tracklist',
        'benefit',
        'video_content',
        'remarks',
    ];

    public function disc()
    {
        return $this -> belongsTo(Disc::class, 'disc_id', 'id');
    }

    public function randomItems()
    {
        return $this -> hasMany(RandomItem::class, 'edition_id', 'id');
    }

    public function userStatus()
    {
        return $this->hasOne(UserStatus::class, 'edition_id')
            ->where('user_id', Auth::id() ?? 0);
    }
}
