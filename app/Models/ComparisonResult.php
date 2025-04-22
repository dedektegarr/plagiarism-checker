<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class ComparisonResult extends Model
{
    use HasUuids;

    protected $guarded = ["id"];

    public function comparison()
    {
        return $this->belongsTo(Comparison::class, "comparison_id");
    }

    public function document1()
    {
        return $this->belongsTo(Document::class, "document_1_id");
    }

    public function document2()
    {
        return $this->belongsTo(Document::class, "document_2_id");
    }
}
