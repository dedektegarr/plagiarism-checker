<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CosimService
{
    protected string $baseUrl;

    public function __construct()
    {
        $this->baseUrl = rtrim(env("COSIM_API_URL"), '/');
    }

    public function preprocessing(array $texts): ?array
    {
        return $this->requestApi('preprocess', ['texts' => $texts], 'Preprocessing API Error');
    }

    public function computeSimilarity(array $texts): ?array
    {
        return $this->requestApi('similarity', ['texts' => $texts], 'Calculate Similarity API Error');
    }

    private function requestApi(string $endpoint, array $payload, string $errorMessage): ?array
    {
        $response = Http::timeout(10)->post("{$this->baseUrl}/{$endpoint}", $payload);

        if ($response->failed()) {
            Log::error("$errorMessage: " . ($response->json()["error"] ?? 'Unknown error'));
            return null;
        }

        return $response->json();
    }
}
