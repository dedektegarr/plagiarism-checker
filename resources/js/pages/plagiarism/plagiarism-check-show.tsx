import DocumentLists from '@/components/document-lists';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Group } from '@/types';
import { Head, usePoll } from '@inertiajs/react';
import { ScanSearch } from 'lucide-react';

interface PlagiarismCheckShowProps {
    group: Group;
}

export default function PlagiarismCheckShow({ group }: PlagiarismCheckShowProps) {
    usePoll(2000);

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

    const SkeletonDocumentLists = () => (
        <Card className="relative overflow-hidden p-6">
            <div className="bg-background/50 absolute inset-0 backdrop-blur-sm" />
            <div className="relative space-y-6">
                {/* Skeleton Header */}
                <div className="grid grid-cols-12 gap-4 px-4 py-2">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={`header-${i}`} className="bg-muted h-4 w-3/4 rounded-full" />
                    ))}
                </div>

                {/* Skeleton Rows */}
                {group.documents.map((_, index) => (
                    <div key={`row-${index}`} className="grid grid-cols-12 items-center gap-4 p-4">
                        <div className="col-span-6 flex items-center gap-3">
                            <Skeleton className="bg-muted h-5 w-5 rounded-md" />
                            <Skeleton className="bg-muted h-4 w-[70%]" />
                        </div>
                        <div className="col-span-3">
                            <Skeleton className="bg-muted h-4 w-[60%]" />
                        </div>
                        <div className="col-span-2">
                            <Skeleton className="bg-muted h-4 w-[50%]" />
                        </div>
                        <div className="col-span-1">
                            <Skeleton className="bg-muted h-8 w-16 rounded-full" />
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );

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

                <div className="relative">
                    {!group.documents.every((document) => document.metadata !== null) && <SkeletonDocumentLists />}

                    {group.documents.every((document) => document.metadata !== null) && (
                        <DocumentLists
                            documents={group.documents}
                            className={!group.documents.every((d) => d.metadata) ? 'pointer-events-none opacity-50' : ''}
                        />
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
