<?php

namespace App\Http\Controllers;

use App\Jobs\ProcessPreprocessing;
use App\Models\Group;
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

    public function show(Group $group)
    {
        $group->load("documents");

        $group->documents->map(function ($document) {
            return array_merge($document->toArray(), [
                "metadata" => $document->metadata,
            ]);
        });

        return Inertia::render("plagiarism/plagiarism-check-show", [
            "group" => $group
        ]);
    }
}
