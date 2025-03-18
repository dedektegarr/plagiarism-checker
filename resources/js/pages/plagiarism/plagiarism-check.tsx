import UploadDocument from '@/components/upload-document';
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
    const acceptedFiles = {
        'application/pdf': ['.pdf'],
    };

    const handleOnUpload = () => {
        console.log('Uploading...');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Periksa Plagiasi" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* <DropzoneUpload /> */} <UploadDocument acceptedFiles={acceptedFiles} onUpload={handleOnUpload} />
            </div>
        </AppLayout>
    );
}
