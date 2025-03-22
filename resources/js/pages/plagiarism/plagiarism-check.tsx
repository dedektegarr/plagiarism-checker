import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Periksa Plagiasi',
        href: route('plagiarism.index'),
    },
];

export default function PlagiarismCheck() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Periksa Plagiasi" />

            <div className="h-full rounded-xl p-4">
                <Button asChild size="lg">
                    <Link href={route('plagiarism.create')}>Unggah Dokumen</Link>
                </Button>
            </div>
        </AppLayout>
    );
}
