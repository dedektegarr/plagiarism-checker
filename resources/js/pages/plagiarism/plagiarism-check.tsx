import DropzoneUpload from '@/components/dropzone-upload';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Periksa Plagiasi',
        href: '/periksa-plagiasi',
    },
];

export default function PlagiarismCheck() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Periksa Plagiasi" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="mx-auto max-w-screen-xl">
                    <DropzoneUpload />
                </div>
            </div>
        </AppLayout>
    );
}
