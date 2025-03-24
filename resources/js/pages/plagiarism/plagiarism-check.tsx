import { GroupLists } from '@/components/group-lists';
import AppLayout from '@/layouts/app-layout';
import { Group, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

interface PlagiarismCheckProps {
    groups: Group[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Periksa Plagiasi',
        href: route('plagiarism.index'),
    },
];

export default function PlagiarismCheck({ groups }: PlagiarismCheckProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Periksa Plagiasi" />

            <div className="h-full rounded-xl p-4">
                <GroupLists groups={groups} />
            </div>
        </AppLayout>
    );
}
