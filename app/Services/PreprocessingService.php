<?php

namespace App\Services;

use App\Jobs\ProcessPreprocessing;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Log;
use Throwable;

class PreprocessingService
{
    public function dispatchBatch(array $documents, int $batchSize = 3): string
    {
        $chunks = array_chunk($documents, $batchSize);
        $jobs = array_map(fn($chunk) => new ProcessPreprocessing($chunk), $chunks);

        $batch =  Bus::batch($jobs)
            ->then(fn() => Log::info('All preprocessing jobs done.'))
            ->catch(fn(Throwable $e) => Log::error($e))
            ->dispatch();

        return $batch->id;
    }
}
