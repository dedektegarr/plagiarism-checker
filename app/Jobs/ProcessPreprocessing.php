<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class ProcessPreprocessing implements ShouldQueue
{
    use Queueable;

    public $documents;

    public function __construct(array $documents)
    {
        $this->documents = $documents;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Log::info("Processing documents for plagiarism check", [
            "documents" => $this->documents
        ]);
    }
}
