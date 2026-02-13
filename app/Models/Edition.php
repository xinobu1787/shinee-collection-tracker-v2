<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\UserStatus;

class Edition extends Model
{
    public function disc() {
        return $this -> belongsTo(Disc::class, 'disc_id', 'id');
    }

    public function userStatus() {
        return $this -> hasOne(UserStatus::class, 'edition_id') -> where('user_id', auth() -> id());
    }
}
