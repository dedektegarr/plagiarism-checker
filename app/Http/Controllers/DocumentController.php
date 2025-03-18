<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DocumentController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            "documents" => "required|array",
            "documents.*" => "required|file|mimes:pdf"
        ], [
            "documents.required" => "Tidak ada dokumen yang diunggah.",
            "documents.array" => "Format dokumen tidak valid.",
            "documents.*.required" => "Setiap dokumen harus diunggah.",
            "documents.*.file" => "Setiap dokumen harus berupa file.",
            "documents.*.mimes" => "Dokumen :position harus berupa file PDF.",
        ]);

        if ($request->hasFile('documents')) {
            foreach ($request->file('documents') as $file) {
                $file->store('documents');
            }
        }

        return to_route("plagiarism.index");
    }
}
