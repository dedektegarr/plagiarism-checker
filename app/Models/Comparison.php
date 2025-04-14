<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Comparison extends Model
{
    use HasUuids;

    protected $guarded = ["id"];

    public function group()
    {
        return $this->belongsTo(Group::class, "group_id");
    }
}
