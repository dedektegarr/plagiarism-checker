<?php

namespace App\Services;

use App\Jobs\ProcessPreprocessing;
use App\Models\Comparison;
use Carbon\Carbon;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Throwable;

class PreprocessingService
{
    public function dispatchBatch(array $documents, string $comparisonId, int $batchSize = 3): string
    {
        $chunks = array_chunk($documents, $batchSize);
        $jobs = array_map(fn($chunk) => new ProcessPreprocessing($chunk), $chunks);

        $startKey = "batch_start_time_{$comparisonId}";
        Cache::put($startKey, now()->timestamp);

        $batch = Bus::batch($jobs)
            ->then(function () use ($startKey, $comparisonId) {
                $start = Cache::get($startKey);
                $end = now()->timestamp;

                $duration = $end - $start;

                Comparison::where("id", $comparisonId)
                    ->update([
                        "processing_time" => $duration
                    ]);

                Log::info("Batch completed in {$duration} seconds for comparison ID {$comparisonId}");
                Cache::forget($startKey);
            })
            ->catch(function (Throwable $e) use ($comparisonId) {
                Log::error("Batch failed for comparison ID {$comparisonId}: " . $e->getMessage());
            })
            ->dispatch();

        return $batch->id;
    }
}
