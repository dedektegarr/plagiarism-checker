<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Metadata extends Model
{
    use HasUuids;

    protected $guarded = ["id"];

    public function document()
    {
        return $this->belongsTo(Document::class, "document_id");
    }
}
