import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { formatFileSize } from '@/helpers/helpers';
import AppLayout from '@/layouts/app-layout';
import { Document, Group, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { format } from 'date-fns';

interface PlagiarismCheckShowDocumentProps {
    group: Group;
    document: Document;
}

export default function PlagiarismCheckShowDocument({ group, document }: PlagiarismCheckShowDocumentProps) {
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
            title: document.filename,
            href: route('plagiarism.show.document', [group.id, document.id]),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={document.filename} />
            <div className="h-full rounded-xl p-4">
                <div className="grid h-full grid-cols-1 gap-6 md:grid-cols-2">
                    <Card className="flex h-[calc(100vh-150px)] flex-col p-0">
                        <div className="border-b p-4">
                            <h2 className="text-lg font-semibold">{document.filename}</h2>
                        </div>
                        <div className="flex-1 overflow-auto p-4">
                            {/* {document.content ? (
                                <PDFViewer className="h-full w-full">
                                    <DocumentContent content={document.content} />
                                </PDFViewer>
                            ) : (
                                <Skeleton className="h-full w-full rounded-lg" />
                            )} */}
                        </div>
                    </Card>

                    {/* Kolom Kanan - Informasi Similarity & Metadata */}
                    <div className="flex h-[calc(100vh-150px)] flex-col gap-6 overflow-auto">
                        {/* Bagian Similarity */}
                        <Card className="p-0">
                            <div className="p-6">
                                <h3 className="mb-4 text-lg font-semibold">Hasil Plagiasi</h3>
                                <div className="space-y-4">
                                    {document.comparison_results?.map((result, index) => (
                                        <div
                                            key={index}
                                            className="hover:bg-accent/50 flex items-center justify-between rounded-lg p-3 transition-colors"
                                        >
                                            <div className="flex-1 truncate pr-4">
                                                <p className="truncate font-medium">{result.document2.filename}</p>
                                                <p className="text-muted-foreground text-sm">{result.document2.metadata?.author}</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <Badge variant={Math.floor(result.similarity_score * 100) >= 30 ? 'destructive' : 'default'}>
                                                    {Math.floor(result.similarity_score * 100)}%
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>

                        {/* Bagian Metadata */}
                        <Card className="p-0">
                            <div className="p-6">
                                <h3 className="mb-4 text-lg font-semibold">Document Metadata</h3>
                                <dl className="space-y-3">
                                    <div className="flex justify-between">
                                        <dt className="text-muted-foreground text-sm">File Size</dt>
                                        <dd className="text-sm font-medium">{formatFileSize(document.size)}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-muted-foreground text-sm">File Type</dt>
                                        <dd className="text-sm font-medium">PDF</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-muted-foreground text-sm">Pages</dt>
                                        <dd className="text-sm font-medium">{document.metadata?.pages}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-muted-foreground text-sm">Created At</dt>
                                        <dd className="text-sm font-medium">
                                            {format(new Date(document.metadata?.created_at as string), 'dd MMM yyyy HH:mm')}
                                        </dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-muted-foreground text-sm">Last Modified</dt>
                                        <dd className="text-sm font-medium">
                                            {format(new Date(document.metadata?.updated_at as string), 'dd MMM yyyy HH:mm')}
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
