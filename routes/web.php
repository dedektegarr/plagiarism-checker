<?php

use App\Http\Controllers\DocumentController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\PlagiarismCheckController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get("/periksa-plagiasi", [PlagiarismCheckController::class, "index"])->name("plagiarism.index");
    Route::get("/grup-dokumen", [GroupController::class, "index"])->name("group.index");

    Route::post("/documents/upload", [DocumentController::class, "upload"])->name("documents.upload");
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
