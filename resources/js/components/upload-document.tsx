import { FormEventHandler, useCallback, useState } from 'react';
import { Accept, FileWithPath } from 'react-dropzone';
import { toast } from 'sonner';
import DocumentList from './document-list';
import Dropzone from './dropzone';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Toaster } from './ui/sonner';

export type FileWithPreview = FileWithPath & {
    preview?: string;
};

interface UploadDocumentProps {
    limit?: number;
    acceptedFiles?: Accept;
    onUpload: () => void;
}

export default function UploadDocument({ acceptedFiles, onUpload, limit = 10 }: UploadDocumentProps) {
    const [files, setFiles] = useState<FileWithPreview[]>([]);

    const handleOnDrop = useCallback((acceptedFiles: FileWithPreview[]) => {
        setFiles((prev) => [
            ...prev,
            ...acceptedFiles.map((file) => ({
                ...file,
                name: file.name,
                size: file.size,
                preview: URL.createObjectURL(file),
            })),
        ]);
    }, []);

    const handleOnReject = () => {
        toast.error('Gagal Mengunggah File', {
            description: 'Hanya file dengan format PDF yang diperbolehkan',
            position: 'top-right',
        });
    };

    const handleOnDeleteFile = (fileName: string) => {
        setFiles((prev) => prev.filter((file) => file.name !== fileName));
    };

    const handleOnUpload: FormEventHandler = (e) => {
        e.preventDefault();
        onUpload();
    };

    return (
        <div className="w-full">
            <Toaster richColors />
            <div className="hidden items-start md:grid md:grid-cols-12 md:gap-6">
                <div className="flex flex-col md:col-span-4">
                    <h2 className="mb-4 text-xl font-semibold dark:text-gray-100">Ringkasan</h2>

                    <div className="mb-4 flex flex-col space-y-4">
                        <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                            <span className="text-gray-700 dark:text-gray-300">Total Dokumen</span>
                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"> {files.length}</Badge>
                        </div>

                        <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                            <span className="text-gray-700 dark:text-gray-300">Batas Upload</span>
                            <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">{limit} Dokumen</Badge>
                        </div>
                    </div>

                    {files.length < limit && <Dropzone onDrop={handleOnDrop} onDropRejected={handleOnReject} accept={acceptedFiles} />}
                    {files.length > 0 && (
                        <Button
                            onClick={handleOnUpload}
                            className="cursor-pointer bg-blue-600 text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                            size="lg"
                        >
                            Upload {files.length} Dokumen
                        </Button>
                    )}
                </div>

                <div className="flex flex-col md:col-span-8">
                    <h2 className="mb-4 text-xl font-semibold dark:text-gray-100">Daftar Dokumen</h2>

                    {files.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center rounded-lg bg-gray-50 p-8 dark:bg-gray-800">
                            <p className="text-center text-gray-500 dark:text-gray-400">Belum ada dokumen yang diunggah</p>
                        </div>
                    ) : (
                        <DocumentList files={files} onDelete={handleOnDeleteFile} />
                    )}
                </div>
            </div>
        </div>
    );
}
