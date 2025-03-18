import UploadDocument, { FileWithPreview } from '@/components/upload-document';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Periksa Plagiasi',
        href: '/periksa-plagiasi',
    },
];

export default function PlagiarismCheck() {
    const [uploading, setUploading] = useState<boolean>(false);

    const acceptedFiles = {
        'application/pdf': ['.pdf'],
    };

    const handleOnUpload = (files: FileWithPreview[]) => {
        router.post(
            route('documents.upload'),
            { documents: files },
            {
                forceFormData: true,
                onProgress: (data) => {
                    setUploading(true);
                    toast.loading('Mengunggah...', { id: 'upload-progress' });
                },
                onSuccess: () => {
                    toast.dismiss('upload-progress');
                    toast.success('Berhasil Mengunggah Dokumen');
                },
                onError: () => {
                    toast.dismiss('upload-progress');
                    toast.error('Gagal Mengunggah File', {
                        description: 'Hanya file dengan format PDF yang diperbolehkan',
                    });
                },
                onFinish: () => setUploading(false),
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
