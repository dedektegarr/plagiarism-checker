import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Grup Dokumen',
        href: '/grup-dokumen',
    },
];

export default function DocumentGroup() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Grup Dokumen" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1>Hello World 2</h1>
            </div>
        </AppLayout>
    );
}
