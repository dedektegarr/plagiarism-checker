<?php

namespace App\Services;

use Smalot\PdfParser\Document;
use Smalot\PdfParser\Parser;

class PDFService
{
    protected Parser $parser;
    protected ?Document $pdf = null;

    public function __construct(string $path)
    {
        $this->parser = new Parser();
        $this->pdf = $this->parser->parseFile($path);
    }

    public function parseMetadata(): array
    {
        return $this->pdf->getDetails();
    }

    public function getText(): string
    {
        return $this->cleanText($this->pdf->getText());
    }

    private function cleanText(string $text): string
    {
        return preg_replace('/[^\w\s\.\-]/u', '', preg_replace('/\s+/', ' ', $text));
    }
}
