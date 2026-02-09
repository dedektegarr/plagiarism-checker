<?php

namespace App\Jobs;

use App\Models\Comparison;
use App\Models\ComparisonResult;
use App\Models\Group;
use App\Services\CosimService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Str;

class ProcessSimilarityCheck implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;
    public $timeout = 300;

    protected Group $group;
    protected Comparison $comparison;

    /**
     * Create a new job instance.
     */
    public function __construct(Group $group, Comparison $comparison)
    {
        $this->group = $group;
        $this->comparison = $comparison;
    }

    /**
     * Execute the job.
     */
    public function handle(CosimService $cosimService): void
    {
        $start = now()->getPreciseTimestamp(3);

        $documents = $this->group->documents()
            ->whereHas('metadata')
            ->with('metadata')
            ->get()
            ->pluck('metadata.preprocessed_text', 'id');

        $documentIds = $documents->keys()->values();
        
        // Ensure there are enough documents to compare
        if ($documents->count() < 2) {
             $this->comparison->update([
                'status' => 'failed',
                'comparison_time' => 0,
            ]);
            return;
        }

        $results = $cosimService->computeSimilarity($documents->values()->toArray())['similarity_matrix'];

        $insertData = [];

        foreach ($results as $i => $rows) {
            // Remove self-comparison by current index
            $filteredRows = collect($rows)->filter(function ($value, $key) use ($i) {
                return $key != $i;
            })->values()->toArray();

            foreach ($filteredRows as $j => $value) {
                $filteredIds = $documentIds->filter(function ($value, $key) use ($i) {
                    return $key != $i;
                })->values()->toArray();

                $insertData[] = [
                    'id' => Str::uuid(),
                    'comparison_id' => $this->comparison->id,
                    'document_1_id' => $documentIds[$i],
                    'document_2_id' => $filteredIds[$j],
                    'similarity_score' => $value,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        foreach (array_chunk($insertData, 1000) as $chunk) {
            ComparisonResult::insertOrIgnore($chunk);
        }

        $end = now()->getPreciseTimestamp(3);
        $duration = $end - $start;

        $this->comparison->update([
            'status' => 'completed',
            'comparison_time' => $duration,
        ]);
    }
}
