<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RandomItem extends Model
{
    protected $fillable = [
        'disc_id',
        'edition_id',
        'member_name',
        'item_type',
    ];
}
