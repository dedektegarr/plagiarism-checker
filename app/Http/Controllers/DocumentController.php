<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Document;
use Illuminate\Support\Str;
use App\Services\PDFService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class DocumentController extends Controller
{
    public function upload(Request $request, PDFService $pdfService)
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
                $path = $file->store('documents');
                $absolutePath = Storage::path($path);

                $pdfText = $pdfService->getText($absolutePath);
                $pdfMetadata = $pdfService->parseMetadata($absolutePath);

                $document = Document::create([
                    "user_id" => Auth::user()->id,
                    "filename" => $file->getClientOriginalName(),
                    "size" => $file->getSize(),
                    "path" => $path,
                    "uploaded_at" => Carbon::now()
                ]);

                $document->metadata()->create([
                    "title" => $pdfMetadata["dc:title"] ?? null,
                    "author" => $pdfMetadata["Creator"] ?? null,
                    "pages" => $pdfMetadata["Pages"] ?? null,
                    "preprocessed_text" => $pdfText ?? null
                ]);
            }
        }

        return to_route("plagiarism.index");
    }
}
