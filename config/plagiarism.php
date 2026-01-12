<?php

return [
    'similarity_threshold' => env('SIMILARITY_THRESHOLD', 30),
    'ngrams' => array_map('intval', explode(',', env('PLAGIARISM_NGRAMS', '2,3'))),
];
