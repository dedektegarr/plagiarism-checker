<?php

namespace App\Console\Commands;

use App\Models\Document;
use App\Models\Group;
use App\Models\User;
use App\Services\PreprocessingService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class ImportDataset extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dataset:import {--user_id= : ID of the user to assign groups to}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import dataset from mapping_dataset.json';

    public function handle()
    {
        $userId = $this->option('user_id') ?? 1;
        $user = User::find($userId);

        if (! $user) {
            $this->error("User with ID {$userId} not found.");

            return 1;
        }

        $mappingPath = base_path('mapping_dataset.json');
        if (! File::exists($mappingPath)) {
            $this->error("mapping_dataset.json not found at {$mappingPath}");

            return 1;
        }

        $mapping = json_decode(File::get($mappingPath), true);
        if (! $mapping) {
            $this->error('Invalid JSON in mapping_dataset.json');

            return 1;
        }

        $this->info('Found '.count($mapping).' records in mapping.');

        // Group by subject
        $groupedBySubject = collect($mapping)->groupBy('subject');

        foreach ($groupedBySubject as $subject => $items) {
            $this->info("Processing subject: {$subject}");
            $this->info("  Creating Group: {$subject} (" . count($items) . " documents)");

            // Create Group
            $group = Group::create([
                'id' => Str::uuid(),
                'user_id' => $user->id,
                'name' => $subject, // No numbering needed as it's 1 group per subject
                'description' => "Imported group for subject {$subject}",
            ]);

            // Create Comparison
            $comparison = $group->comparisons()->create([
                'user_id' => $user->id,
                'group_id' => $group->id,
            ]);

            $batchDocumentsForService = [];

            foreach ($items as $item) {
                $sourcePath = storage_path('app/private/dataset/' . $item['subject'] . '/' . $item['file_name']);

                if (! File::exists($sourcePath)) {
                    $this->warn("    File not found: {$sourcePath}. Skipping.");

                    continue;
                }

                $fileName = $item['file_name'];
                // Ensure public/storage/documents exists
                $destDir = public_path('storage/documents');
                if (! File::exists($destDir)) {
                    File::makeDirectory($destDir, 0755, true);
                }

                $destPath = $destDir.'/'.$fileName;

                // Copy file
                File::copy($sourcePath, $destPath);
                $fileSize = File::size($destPath);
                $documentId = Str::uuid();

                $document = Document::create([
                    'id' => $documentId,
                    'group_id' => $group->id,
                    'filename' => $item['npm'], // DB uses NPM as requested
                    'path' => 'documents/'.$fileName, // Valid relative path for Storage::disk('public')
                    'size' => $fileSize,
                    'uploaded_at' => now(),
                ]);

                $batchDocumentsForService[] = [
                    'id' => $document->id,
                    'path' => 'documents/'.$fileName,
                ];

                $this->line("    Processed: {$fileName} -> DB: {$item['npm']} (ID: {$document->id})");
            }

            if (! empty($batchDocumentsForService)) {
                $this->info("    Dispatching preprocessing for group {$subject}...");
                $preprocessingService = new PreprocessingService;
                // Dispatch all documents. The service should handle chunking if needed for jobs. 
                // Currently `dispatchBatch` chunks by 3 by default.
                $preprocessingService->dispatchBatch($batchDocumentsForService, $comparison->id);
            }
        }

        $this->info('Import completed.');

        return 0;
    }
}
