<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DocumentController extends Controller
{
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

        $userId = Auth::id();
        $documents = [];

        foreach ($validated['documents'] as $file) {
            $documents[] = [
                "id" => Str::uuid(),
                "user_id" => $userId,
                "filename" => $file->getClientOriginalName(),
                "size" => $file->getSize(),
                "path" => $file->store('documents'),
                "uploaded_at" => now(),
                "updated_at" => now(),
                "created_at" => now(),
            ];
        }

        Document::insert($documents);

        return to_route("plagiarism.index")->with("success", "Dokumen berhasil diunggah.");
    }
}
