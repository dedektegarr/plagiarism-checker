<?php

namespace App\Http\Controllers;

use App\Jobs\ProcessPreprocessing;
use App\Models\ComparisonResult;
use App\Models\Document;
use App\Models\Group;
use App\Services\CosimService;
use App\Services\PreprocessingService;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Log;
use Throwable;

class PlagiarismCheckController extends Controller
{
    public function index()
    {
        $groups = Group::where("user_id", Auth::id())->latest()->get();

        $groups = $groups->map(function ($group) {
            return array_merge($group->toArray(), [
                "number_of_documents" => $group->documents->count()
            ]);
        });

        return Inertia::render("plagiarism/plagiarism-check", [
            "groups" => $groups
        ]);
    }

    public function create()
    {
        return Inertia::render("plagiarism/plagiarism-check-create");
    }

    public function upload(Request $request)
    {
        $validated = $request->validate([
            "documents" => "required|array",
            "documents.*" => "required|file|mimes:pdf"
        ], [
            "documents.required" => "Tidak ada dokumen yang diunggah.",
            "documents.array" => "Format dokumen tidak valid.",
            "documents.*.required" => "Setiap dokumen harus diunggah.",
            "documents.*.file" => "Setiap dokumen harus berupa file.",
            "documents.*.mimes" => "Dokumen :position harus berupa file PDF.",
        ]);

        $user = Auth::user();

        // Creating group for current user
        $group = $user->groups()->create(["name" => "grup_" . uniqid()]);

        // Insert documents to group
        $documents = [];
        foreach ($validated['documents'] as $file) {
            $documents[] = [
                "id" => Str::uuid(),
                "filename" => $file->getClientOriginalName(),
                "size" => $file->getSize(),
                "path" => $file->store('documents'),
                "uploaded_at" => now(),
                "updated_at" => now(),
                "created_at" => now(),
            ];
        }

        $group->documents()->createMany($documents);

        // Create comparison record
        $comparison = $group->comparisons()->create([
            "user_id" => $user->id,
            "group_id" => $group->id,
        ]);

        // Get stored documents
        $insertedDocuments = $group->documents()
            ->whereIn('filename', collect($documents)->pluck('filename'))
            ->get(['id', 'path'])
            ->toArray();

        // Run preprocessing
        $preprocessingService = new PreprocessingService();
        $preprocessingService->dispatchBatch($insertedDocuments, $comparison->id);

        return to_route("plagiarism.show", $group->id);
    }

    public function calculate(Group $group, CosimService $cosimService)
    {
        $start = now()->getPreciseTimestamp(3);

        $comparison = $group->comparisons()->first();
        $documents = $group->documents()->whereHas("metadata")->with("metadata")->get()->pluck("metadata.preprocessed_text", "id");
        $documentIds = $documents->keys()->values();

        $results = $cosimService->computeSimilarity($documents->values()->toArray())["similarity_matrix"];

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
                    "id" => Str::uuid(),
                    "comparison_id" => $comparison->id,
                    "document_1_id" => $documentIds[$i],
                    "document_2_id" => $filteredIds[$j],
                    "similarity_score" => $value,
                    "created_at" => now(),
                    "updated_at" => now(),
                ];
            }
        }

        ComparisonResult::insertOrIgnore($insertData);

        $end = now()->getPreciseTimestamp(3);
        $duration = $end - $start;

        $comparison->update([
            "status" => "completed",
            "comparison_time" => $duration,
        ]);

        return to_route("plagiarism.show", $group->id);
    }

    public function show(Group $group)
    {
        $group->load(["documents", "documents.metadata", "documents.comparisonResults"]);

        $group["docs"] = $group->documents
            ->map(function ($document) {
                return array_merge($document->toArray(), [
                    "metadata" => $document->metadata,
                    "max_similarity" => $document->comparisonResults->max("similarity_score"),
                ]);
            })
            ->sortByDesc("max_similarity")
            ->values()
            ->all();

        return Inertia::render("plagiarism/plagiarism-check-show", [
            "group" => $group
        ]);
    }

    public function showDocument(Group $group, Document $document)
    {
        $document->load(["metadata", "comparisonResults", "comparisonResults.document2"]);

        return Inertia::render("plagiarism/plagiarism-check-show-document", [
            "document" => $document,
            "group" => $group,
        ]);
    }
}
