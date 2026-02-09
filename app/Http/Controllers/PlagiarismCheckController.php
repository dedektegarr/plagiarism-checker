<?php

namespace App\Http\Controllers;

use App\Models\ComparisonResult;
use App\Models\Document;
use App\Models\Group;
use App\Jobs\ProcessSimilarityCheck;
use App\Services\PreprocessingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PlagiarismCheckController extends Controller
{
    public function index()
    {
        $groups = Group::where('user_id', Auth::id())->latest()->get();

        $groups = $groups->map(function ($group) {
            return array_merge($group->toArray(), [
                'number_of_documents' => $group->documents->count(),
            ]);
        });

        return Inertia::render('plagiarism/plagiarism-check', [
            'groups' => $groups,
        ]);
    }

    public function create()
    {
        return Inertia::render('plagiarism/plagiarism-check-create');
    }

    public function upload(Request $request)
    {
        $validated = $request->validate([
            'documents' => 'required|array',
            'documents.*' => 'required|file|mimes:pdf',
        ], [
            'documents.required' => 'Tidak ada dokumen yang diunggah.',
            'documents.array' => 'Format dokumen tidak valid.',
            'documents.*.required' => 'Setiap dokumen harus diunggah.',
            'documents.*.file' => 'Setiap dokumen harus berupa file.',
            'documents.*.mimes' => 'Dokumen :position harus berupa file PDF.',
        ]);

        $user = Auth::user();

        // Creating group for current user
        $group = $user->groups()->create(['name' => 'grup_'.uniqid()]);

        // Insert documents to group
        $documents = [];
        foreach ($validated['documents'] as $file) {
            $documents[] = [
                'id' => Str::uuid(),
                'filename' => $file->getClientOriginalName(),
                'size' => $file->getSize(),
                'path' => $file->store('documents', 'public'),
                'uploaded_at' => now(),
                'updated_at' => now(),
                'created_at' => now(),
            ];
        }

        $group->documents()->createMany($documents);

        // Create comparison record
        $comparison = $group->comparisons()->create([
            'user_id' => $user->id,
            'group_id' => $group->id,
        ]);

        // Get stored documents
        $insertedDocuments = $group->documents()
            ->whereIn('filename', collect($documents)->pluck('filename'))
            ->get(['id', 'path'])
            ->toArray();

        // Run preprocessing
        $preprocessingService = new PreprocessingService;
        $preprocessingService->dispatchBatch($insertedDocuments, $comparison->id);

        return to_route('plagiarism.show', $group->id);
    }

    public function calculate(Group $group)
    {
        $comparison = $group->comparisons()->first();
        
        $comparison->update([
            'status' => 'processing',
        ]);

        ProcessSimilarityCheck::dispatch($group, $comparison);

        return to_route('plagiarism.show', $group->id)->with('message', 'Similarity check started in background.');
    }

    public function show(Group $group)
    {
        $group->load(['documents', 'documents.metadata', 'documents.comparisonResults', 'comparisons']);

        $group['docs'] = $group->documents
            ->map(function ($document) {
                return array_merge($document->toArray(), [
                    'metadata' => $document->metadata,
                    'max_similarity' => $document->comparisonResults->max('similarity_score'),
                ]);
            })
            ->sortByDesc('max_similarity')
            ->values()
            ->all();

        return Inertia::render('plagiarism/plagiarism-check-show', [
            'group' => $group,
            'threshold' => config('plagiarism.similarity_threshold'),
        ]);
    }

    public function showDocument(Group $group, Document $document)
    {
        $document->load(['metadata', 'comparisonResults', 'comparisonResults.document2']);

        return Inertia::render('plagiarism/plagiarism-check-show-document', [
            'document' => $document,
            'group' => $group,
        ]);
    }

    public function compare(Group $group, Document $document1, Document $document2)
    {
        $document1->load('metadata');
        $document2->load('metadata');

        $pdfService = new \App\Services\PDFService;

        $pdfService->setPath(Storage::path($document1->path));
        $originalText1 = $pdfService->getRawText();

        $pdfService->setPath(Storage::path($document2->path));
        $originalText2 = $pdfService->getRawText();

        $comparisonResult = ComparisonResult::where('comparison_id', $group->comparisons()->first()->id)
            ->where(function ($query) use ($document1, $document2) {
                $query->where('document_1_id', $document1->id)
                    ->where('document_2_id', $document2->id);
            })
            ->orWhere(function ($query) use ($document1, $document2) {
                $query->where('document_1_id', $document2->id)
                    ->where('document_2_id', $document1->id);
            })
            ->first();

        return Inertia::render('plagiarism/plagiarism-check-compare', [
            'group' => $group,
            'document1' => $document1,
            'document2' => $document2,
            'originalText1' => $originalText1,
            'originalText2' => $originalText2,
            'comparisonResult' => $comparisonResult,
            'threshold' => config('plagiarism.similarity_threshold'),
            'ngrams' => config('plagiarism.ngrams'),
        ]);
    }

    public function update(Request $request, Group $group, Document $document)
    {
        $validated = $request->validate([
            'filename' => 'required|string|max:255',
        ]);

        // Ensure the filename ends with .pdf if it was removed
        if (!Str::endsWith($validated['filename'], '.pdf')) {
            $validated['filename'] .= '.pdf';
        }

        $document->update($validated);

        return back();
    }
}
