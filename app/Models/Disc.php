<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Disc extends Model
{
    public function editions() {
        return $this -> hasMany(Edition::class, 'disc_id', 'id');
    }

    public function scopeLatestOrder($query) {
        return $query -> orderBy('release_date', 'desc') -> orderBy('id','asc');
    }
}
