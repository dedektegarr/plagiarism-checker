<?php

namespace App\Jobs;

use Exception;
use App\Models\Metadata;
use Illuminate\Support\Str;
use App\Services\PDFService;
use App\Services\CosimService;
use Illuminate\Bus\Batchable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;

class ProcessPreprocessing implements ShouldQueue
{
    use Queueable, Batchable;

    public $tries = 5;

    public $documents;
    public $pdfService;

    public function __construct(array $documents)
    {
        $this->documents = $documents;
        $this->pdfService = new PDFService();
    }

    public function retryUntil()
    {
        return now()->addMinutes(5);
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $metadataInsert = [];
        $texts = [];

        foreach ($this->documents as $document) {
            $documentPath = Storage::path($document['path']);

            $this->pdfService->setPath($documentPath);
            $metadata = $this->pdfService->parseMetadata();
            $text = $this->pdfService->getText();

            $texts[] = $text;

            $metadataInsert[] = [
                "id" => Str::uuid(),
                "document_id" => $document['id'],
                "title" => $metadata['Title'] ?? null,
                "author" => $metadata['Author'] ?? null,
                "pages" => $metadata['Pages'] ?? null,
                "created_at" => now(),
                "updated_at" => now(),
            ];
        }

        // Preprocessing to API
        $cosimService = new CosimService();

        $results = $cosimService->preprocessing($texts);

        for ($i = 0; $i < count($metadataInsert); $i++) {
            if (isset($results["preprocessed_texts"][$i])) {
                $metadataInsert[$i]['preprocessed_text'] = $results["preprocessed_texts"][$i];
            } else {
                Log::warning("Missing preprocessed_text for index $i");
            }
        }

        Metadata::insert($metadataInsert);
    }
}
