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

    Route::prefix("plagiarism")->group(function () {
        Route::get("/", [PlagiarismCheckController::class, "index"])->name("plagiarism.index");
        Route::get("/upload", [PlagiarismCheckController::class, "create"])->name("plagiarism.create");
        Route::post("/upload", [PlagiarismCheckController::class, "upload"])->name("plagiarism.upload");
        Route::get("/{group}", [PlagiarismCheckController::class, "show"])->name("plagiarism.show");
    });

    Route::prefix("group")->group(function () {
        Route::get("/", [GroupController::class, "index"])->name("group.index");
        Route::delete("/{group}/delete", [GroupController::class, "destroy"])->name("group.destroy");
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
