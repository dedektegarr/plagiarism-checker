<?php

namespace App\Console\Commands;

use App\Models\ComparisonResult;
use App\Models\Group;
use App\Services\CosimService;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class CheckSimilarity extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dataset:check-similarity {--group_id= : ID of the specific group to check} {--all : Check all groups} {--force : Force re-calculation even if already completed}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Calculate similarity for dataset groups';

    protected $cosimService;

    public function __construct()
    {
        parent::__construct();
        $this->cosimService = new CosimService();
    }

    public function handle()
    {
        $groupId = $this->option('group_id');
        $checkAll = $this->option('all');
        $force = $this->option('force');

        if (!$groupId && !$checkAll) {
            $this->error('Please specify --group_id or --all');
            return 1;
        }

        $query = Group::query();

        if ($groupId) {
            $query->where('id', $groupId);
        }

        $groups = $query->with(['comparisons', 'documents', 'documents.metadata'])->get();

        $this->info("Found " . $groups->count() . " groups to process.");

        foreach ($groups as $group) {
            $this->info("Processing Group: {$group->name} ({$group->id})");

            $comparison = $group->comparisons()->first();

            if (!$comparison) {
                // Should exist from import, but safe to create if missing
                $comparison = $group->comparisons()->create([
                    'user_id' => $group->user_id,
                    'group_id' => $group->id,
                ]);
            }

            if ($comparison->status === 'completed' && !$force) {
                $this->info("  Comparison already completed. Skipping (use --force to override).");
                continue;
            }

            // Get documents with metadata
            $documents = $group->documents;
            // Filter documents that have metadata
            $documentsWithMetadata = $documents->filter(function ($doc) {
                return $doc->metadata && $doc->metadata->preprocessed_text;
            });

            if ($documentsWithMetadata->count() < 2) {
                $this->warn("  Not enough documents with metadata to compare (Found: {$documentsWithMetadata->count()}). Skipping.");
                continue;
            }

            $this->line("  Sending {$documentsWithMetadata->count()} documents to CosimService...");

            // Prepare Payload
            $payload = $documentsWithMetadata->mapWithKeys(function ($item) {
                return [$item->id => $item->metadata->preprocessed_text];
            });
            $documentIds = $payload->keys()->values();

            $start = now()->getPreciseTimestamp(3);

            // Call API
            $response = $this->cosimService->computeSimilarity($payload->values()->toArray());

            if (!$response || !isset($response['similarity_matrix'])) {
                $this->error("  Failed to get similarity matrix from API.");
                continue;
            }

            $results = $response['similarity_matrix'];
            $insertData = [];

            // Process Matrix - Logic from Controller
            foreach ($results as $i => $rows) {
                // Remove self-comparison by current index
                 $filteredRows = collect($rows)->filter(function ($value, $key) use ($i) {
                    return $key != $i;
                })->values()->toArray();

                $filteredIds = $documentIds->filter(function ($value, $key) use ($i) {
                     return $key != $i; // Remove self from IDs too
                })->values()->toArray();

                foreach ($filteredRows as $j => $value) {
                    $insertData[] = [
                        'id' => Str::uuid(),
                        'comparison_id' => $comparison->id,
                        'document_1_id' => $documentIds[$i], // Row index
                        'document_2_id' => $filteredIds[$j], // Column index in filtered list
                        'similarity_score' => $value,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
            }

            // Batch Insert
            $this->line("  Inserting " . count($insertData) . " comparison results...");
            
            if ($force) {
                 ComparisonResult::where('comparison_id', $comparison->id)->delete();
            }

            foreach (array_chunk($insertData, 1000) as $chunk) {
                ComparisonResult::insertOrIgnore($chunk);
            }

            $end = now()->getPreciseTimestamp(3);
            $duration = $end - $start;

            $comparison->update([
                'status' => 'completed',
                'comparison_time' => $duration,
            ]);

            $this->info("  Group {$group->name} processed in {$duration}ms.");
        }

        $this->info('All operations completed.');
        return 0;
    }
}
