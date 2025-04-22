<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use HasUuids;

    protected $guarded = ["id"];

    public function metadata()
    {
        return $this->hasOne(Metadata::class, "document_id");
    }

    public function user()
    {
        return $this->belongsTo(User::class, "document_id");
    }

    public function group()
    {
        return $this->belongsTo(Group::class, "group_id");
    }

    public function comparisonResults()
    {
        return $this->hasMany(ComparisonResult::class, "document_1_id")->orderBy("similarity_score", "desc");
    }
}
