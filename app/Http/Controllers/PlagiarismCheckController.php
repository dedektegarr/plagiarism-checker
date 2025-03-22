<?php

namespace App\Http\Controllers;

use App\Models\Group;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PlagiarismCheckController extends Controller
{
    public function index()
    {
        return Inertia::render("plagiarism/plagiarism-check");
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

        return to_route("plagiarism.show", $group->id);
    }

    public function show(Group $group)
    {
        $group->load("documents");

        return Inertia::render("plagiarism/plagiarism-check-show", [
            "group" => $group
        ]);
    }
}
