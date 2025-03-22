import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

type DocumentType = {
    filename: string;
    path: string;
    group_id: string;
    size: number;
};

interface PlagiarismCheckShowProps {
    group: {
        id: string;
        name: string;
        documents: DocumentType[];
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
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4"></div>
        </AppLayout>
    );
}
