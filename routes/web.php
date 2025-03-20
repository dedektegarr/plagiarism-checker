<?php

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

    Route::prefix("check")->group(function () {
        Route::get("/", [PlagiarismCheckController::class, "index"])->name("plagiarism.index");
        Route::get("/upload", [PlagiarismCheckController::class, "create"])->name("plagiarism.create");
        Route::post("/upload", [PlagiarismCheckController::class, "upload"])->name("documents.upload");
    });

    Route::get("/grup-dokumen", [GroupController::class, "index"])->name("group.index");
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
