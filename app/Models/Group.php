<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    use HasUuids;

    protected $guarded = ["id"];

    public function documents()
    {
        return $this->hasMany(Document::class, "group_id");
    }

    public function user()
    {
        return $this->belongsTo(User::class, "user_id");
    }

    public function comparisons()
    {
        return $this->hasMany(Comparison::class, "group_id");
    }
}
