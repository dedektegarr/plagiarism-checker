<?php

namespace App\Jobs;

use App\Models\Metadata;
use Illuminate\Support\Str;
use App\Services\PDFService;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;

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
        $metadataInsert = [];

        foreach ($this->documents as $document) {
            $documentPath = Storage::path($document['path']);

            $pdfService = new PDFService($documentPath);
            $metadata = $pdfService->parseMetadata();
            $text = $pdfService->getText();

            $metadataInsert[] = [
                "id" => Str::uuid(),
                "document_id" => $document['id'],
                "title" => $metadata['Title'] ?? null,
                "author" => $metadata['Author'] ?? null,
                "pages" => $metadata['Pages'] ?? null,
                "preprocessed_text" => $text,
                "created_at" => now(),
                "updated_at" => now(),
            ];
        }

        try {
            Metadata::insert($metadataInsert);
        } catch (Exception $e) {
            Log::error("Error processing document", [
                "message" => $e->getMessage(),
                "trace" => $e->getTraceAsString(),
            ]);
        }
    }
}
