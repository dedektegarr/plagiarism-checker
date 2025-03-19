<?php

namespace App\Services;

use Smalot\PdfParser\Parser;

class PDFService
{
    protected $parser;

    public function __construct()
    {
        $this->parser = new Parser();
    }

    public function parseMetadata(string $path)
    {
        $pdf = $this->parser->parseFile($path);
        return $pdf->getDetails();
    }

    public function getText(string $path)
    {
        $pdf = $this->parser->parseFile($path);
        return $this->removeRandomCharacters($pdf->getText());
    }

    private function removeRandomCharacters($text)
    {
        $text = preg_replace('/[^A-Za-z0-9\.\-\s]/', '', $text);
        $text = preg_replace('/\s+/', ' ', $text);

        return $text;
    }
}
