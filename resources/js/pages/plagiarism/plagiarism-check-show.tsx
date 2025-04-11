import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatFileSize } from '@/helpers/helpers';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Document } from '@/types';
import { Head } from '@inertiajs/react';
import { ScanSearch } from 'lucide-react';

interface PlagiarismCheckShowProps {
    group: {
        id: string;
        name: string;
        documents: Document[];
    };
}

export default function PlagiarismCheckShow({ group }: PlagiarismCheckShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Periksa Plagiasi',
            href: route('plagiarism.index'),
        },
        {
            title: group.name,
            href: route('plagiarism.show', group.id),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={group.name} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-primary text-lg font-semibold">{group.name}</h2>
                    <Button className="gap-2">
                        <ScanSearch className="h-4 w-4" />
                        Periksa Semua Dokumen
                    </Button>
                </div>

                <div className="flex flex-col gap-4">
                    {group.documents.map((document) => (
                        <Card key={document.id} className="hover:bg-accent/50 grid grid-cols-12 items-center gap-4 rounded-lg p-4 transition-colors">
                            <div className="col-span-10 flex items-center truncate font-medium">
                                <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/20">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-7 w-7 text-blue-600 dark:text-blue-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                </div>

                                <div className="ms-3 flex flex-col">
                                    <span className="text-foreground">{document.filename}</span>
                                    <span className="text-muted-foreground text-sm">{document.metadata.author}</span>
                                </div>
                            </div>
                            <div className="text-muted-foreground col-span-1 text-sm">{formatFileSize(document.size)}</div>
                            <div className="col-span-1">
                                {document.plagiarismResult ? (
                                    <div className="flex items-center gap-2">
                                        <Badge variant={document.plagiarismResult >= 30 ? 'destructive' : 'default'}>
                                            {document.plagiarismResult}%
                                        </Badge>
                                        <Progress value={document.plagiarismResult} className="h-2 w-16" />
                                    </div>
                                ) : (
                                    <span className="text-muted-foreground text-sm">Belum diperiksa</span>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
