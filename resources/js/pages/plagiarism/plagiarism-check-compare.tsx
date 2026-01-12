import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, ComparisonResult, Document, Group } from '@/types';
import { Head } from '@inertiajs/react';
import { useMemo } from 'react';

interface PlagiarismCheckCompareProps {
    group: Group;
    document1: Document;
    document2: Document;
    comparisonResult: ComparisonResult;
    originalText1?: string;
    originalText2?: string;
    threshold: number;
}

interface TextChunk {
    text: string;
    highlighted: boolean;
}

// Helper to normalize a word for comparison (lowercase, remove punctuation)
const normalize = (word: string) => word.toLowerCase().replace(/[^\w]/g, '');

const getNGrams = (words: string[], n: number): Set<string> => {
    const ngrams = new Set<string>();
    if (words.length < n) return ngrams;
    for (let i = 0; i <= words.length - n; i++) {
        // Create n-gram from normalized words
        const gram = words.slice(i, i + n).join(' ');
        ngrams.add(gram);
    }
    return ngrams;
};

const processText = (text: string, otherText: string): TextChunk[] => {
    // Split by whitespace but keep the whitespace layout if possible, 
    // or just simple split for now. 
    // To preserve exact layout we might need sophisticated tokenization, 
    // but standard split is usually "good enough" for plain text view.
    const words = text.split(/\s+/);
    const otherWords = otherText.split(/\s+/);

    // Create normalized versions for comparison
    const normalizedWords = words.map(normalize);
    const normalizedOtherWords = otherWords.map(normalize);

    // Generate N-grams from the OTHER document's normalized text
    const otherBiGrams = getNGrams(normalizedOtherWords, 2);
    const otherTriGrams = getNGrams(normalizedOtherWords, 3);

    const matchIndices = new Set<number>();

    // Check bi-grams
    if (normalizedWords.length >= 2) {
        for (let i = 0; i <= normalizedWords.length - 2; i++) {
            const gram = normalizedWords.slice(i, i + 2).join(' ');
            // Only consider if gram is not empty (e.g. " . " might normalize to empty strings)
            if (gram.trim() !== '' && otherBiGrams.has(gram)) {
                matchIndices.add(i);
                matchIndices.add(i + 1);
            }
        }
    }

    // Check tri-grams
    if (normalizedWords.length >= 3) {
        for (let i = 0; i <= normalizedWords.length - 3; i++) {
            const gram = normalizedWords.slice(i, i + 3).join(' ');
            if (gram.trim() !== '' && otherTriGrams.has(gram)) {
                matchIndices.add(i);
                matchIndices.add(i + 1);
                matchIndices.add(i + 2);
            }
        }
    }

    // Group words into chunks based on highlight status
    const chunks: TextChunk[] = [];
    if (words.length === 0 || (words.length === 1 && words[0] === '')) return chunks;

    let currentChunk: TextChunk = {
        text: words[0],
        highlighted: matchIndices.has(0),
    };

    for (let i = 1; i < words.length; i++) {
        const isHighlighted = matchIndices.has(i);
        if (isHighlighted === currentChunk.highlighted) {
            currentChunk.text += ' ' + words[i];
        } else {
            chunks.push(currentChunk);
            currentChunk = {
                text: words[i],
                highlighted: isHighlighted,
            };
        }
    }
    chunks.push(currentChunk);

    return chunks;
};


export default function PlagiarismCheckCompare({
    group,
    document1,
    document2,
    comparisonResult,
    originalText1 = '',
    originalText2 = '',
    threshold,
}: PlagiarismCheckCompareProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Periksa Plagiasi',
            href: route('plagiarism.index'),
        },
        {
            title: group.name,
            href: route('plagiarism.show', group.id),
        },
        {
            title: 'Perbandingan Dokumen',
            href: route('plagiarism.compare', [group.id, document1.id, document2.id]),
        },
    ];

    const { doc1Chunks, doc2Chunks } = useMemo(() => {
        // Use original text if available, fallback to preprocessed (though backend should guarantee original)
        const text1 = originalText1 || document1.metadata?.preprocessed_text || '';
        const text2 = originalText2 || document2.metadata?.preprocessed_text || '';

        return {
            doc1Chunks: processText(text1, text2),
            doc2Chunks: processText(text2, text1)
        };
    }, [document1, document2, originalText1, originalText2]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Perbandingan Dokumen" />
            <div className="h-full space-y-6 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">Perbandingan Dokumen</h2>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Tingkat Kemiripan:</span>
                        <Badge
                            variant={comparisonResult.similarity_score * 100 >= threshold ? 'destructive' : 'outline'}
                            className="px-3 py-1"
                        >
                            {comparisonResult.similarity_score * 100 >= threshold ? 'Plagiat' : 'Tidak Plagiat'} ({Math.floor(comparisonResult.similarity_score * 100)}%)
                        </Badge>
                    </div>
                </div>

                <div className="grid h-[calc(100vh-200px)] grid-cols-2 gap-6 overflow-hidden">
                    {/* Document 1 Column */}
                    <Card className="flex flex-col overflow-hidden">
                        <CardHeader className="border-b bg-muted/50 py-3">
                            <CardTitle className="text-base font-medium truncate" title={document1.filename}>
                                {document1.filename}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto p-4 leading-relaxed font-mono text-sm whitespace-pre-wrap">
                            {doc1Chunks.map((chunk, index) => (
                                <span
                                    key={index}
                                    className={chunk.highlighted ? 'bg-yellow-200 dark:bg-yellow-900/50' : ''}
                                >
                                    {chunk.text + ' '}
                                </span>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Document 2 Column */}
                    <Card className="flex flex-col overflow-hidden">
                        <CardHeader className="border-b bg-muted/50 py-3">
                            <CardTitle className="text-base font-medium truncate" title={document2.filename}>
                                {document2.filename}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto p-4 leading-relaxed font-mono text-sm whitespace-pre-wrap">
                            {doc2Chunks.map((chunk, index) => (
                                <span
                                    key={index}
                                    className={chunk.highlighted ? 'bg-yellow-200 dark:bg-yellow-900/50' : ''}
                                >
                                    {chunk.text + ' '}
                                </span>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
