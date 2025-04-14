import DocumentLists from '@/components/document-lists';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Group } from '@/types';
import { Head, usePoll } from '@inertiajs/react';
import { LoaderCircle, ScanSearch } from 'lucide-react';

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

    const isPreprocessing = group.documents.every((document) => document.metadata === null);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={group.name} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-primary text-lg font-semibold">{group.name}</h2>
                    <Button className="gap-2" disabled={isPreprocessing}>
                        {isPreprocessing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ScanSearch className="h-4 w-4" />}
                        {isPreprocessing ? 'Memproses' : 'Periksa Plagiasi'}
                    </Button>
                </div>

                <DocumentLists
                    isPreprocessing={isPreprocessing}
                    documents={group.documents}
                    className={!group.documents.every((d) => d.metadata) ? 'pointer-events-none opacity-50' : ''}
                />
            </div>
        </AppLayout>
    );
}
