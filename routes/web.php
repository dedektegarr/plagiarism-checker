<?php

use App\Http\Controllers\GroupController;
use App\Http\Controllers\PlagiarismCheckController;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
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
        Route::get("/{group}/{document}", [PlagiarismCheckController::class, "showDocument"])->name("plagiarism.show.document");
        Route::post("/{group}/calculate", [PlagiarismCheckController::class, "calculate"])->name("plagiarism.calculate");
    });

    Route::prefix("group")->group(function () {
        Route::get("/", [GroupController::class, "index"])->name("group.index");
        Route::delete("/{group}/delete", [GroupController::class, "destroy"])->name("group.destroy");
        Route::put("/{group}/update", [GroupController::class, "update"])->name("group.update");
    });

    Route::get("/preview/{document}", function ($filename) {
        $path = Storage::path($filename);

        dd(File::exists($path), $path);

        return response()->file($path);
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
