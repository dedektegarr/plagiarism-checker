import UploadDocument, { FileWithPreview } from '@/components/upload-document';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Periksa Plagiasi',
        href: route('plagiarism.index'),
    },
    {
        title: 'Unggah Dokumen',
        href: route('plagiarism.create'),
    },
];

export default function PlagiarismCheckCreate() {
    const [uploading, setUploading] = useState<boolean>(false);

    const acceptedFiles = {
        'application/pdf': ['.pdf'],
    };

    const handleOnUpload = (files: FileWithPreview[]) => {
        router.post(
            route('plagiarism.upload'),
            { documents: files },
            {
                forceFormData: true,
                onProgress: (data) => {
                    setUploading(true);
                    toast.loading('Mengunggah...', { id: 'upload-progress' });
                },
                onSuccess: (data) => {
                    toast.success('Berhasil Mengunggah Dokumen');
                },
                onError: (errors) => {
                    const errorMessages = (
                        <ul className="list-inside list-disc">
                            {Object.values(errors).map((msg, index) => (
                                <li key={index}>{msg}</li>
                            ))}
                        </ul>
                    );

                    toast.error('Gagal Mengunggah File', {
                        description: errorMessages,
                    });
                },
                onFinish: () => {
                    toast.dismiss('upload-progress');
                    setUploading(false);
                },
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Periksa Plagiasi" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <UploadDocument acceptedFiles={acceptedFiles} isUploading={uploading} onUpload={handleOnUpload} />
            </div>
        </AppLayout>
    );
}
