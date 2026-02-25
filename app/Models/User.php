<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'icon_url',
    ];

    protected $hidden = [
        'password',
        'remember_token'
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }

    public function userStatuses() {
        return $this -> hasMany(UserStatus::class, 'user_id', 'id');
    }

    public function userRandoms()
    {
        return $this->hasMany(UserRandom::class, 'user_id', 'id');
    }
}
