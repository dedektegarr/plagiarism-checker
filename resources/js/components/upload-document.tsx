import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useCallback, useState } from 'react';
import { Accept, FileWithPath } from 'react-dropzone';
import { toast } from 'sonner';
import DocumentList from './document-list';
import Dropzone from './dropzone';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

export type FileWithPreview = FileWithPath & {
    preview?: string;
};

interface UploadDocumentProps {
    limit?: number;
    acceptedFiles?: Accept;
    isUploading?: boolean;
    onUpload: (files: FileWithPreview[]) => void;
}

export default function UploadDocument({ acceptedFiles, isUploading, onUpload, limit = 10 }: UploadDocumentProps) {
    const [files, setFiles] = useState<FileWithPreview[]>([]);

    const handleOnDrop = useCallback((acceptedFiles: FileWithPreview[]) => {
        setFiles((prev) => [...prev, ...acceptedFiles]);
    }, []);

    const handleOnReject = () => {
        toast.error('Gagal Mengunggah File', {
            description: 'Hanya file dengan format PDF yang diperbolehkan',
        });
    };

    const handleOnDeleteFile = (fileName: string) => {
        setFiles((prev) => prev.filter((file) => file.name !== fileName));
    };

    const handleOnUpload: FormEventHandler = (e) => {
        e.preventDefault();
        onUpload(files);
    };

    return (
        <div className="w-full">
            <div className="grid grid-cols-12 items-start gap-4">
                <div className="col-span-12 flex flex-col lg:col-span-4">
                    <h2 className="text-primary mb-4 text-lg font-semibold">Ringkasan</h2>

                    <div className="mb-4 flex flex-col space-y-4 text-sm">
                        <div className="bg-primary-foreground flex items-center justify-between rounded-lg p-4">
                            <span className="text-gray-700 dark:text-gray-300">Total Dokumen</span>
                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"> {files.length}</Badge>
                        </div>

                        <div className="bg-primary-foreground flex items-center justify-between rounded-lg p-4">
                            <span className="text-gray-700 dark:text-gray-300">Batas Upload</span>
                            <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">{limit} Dokumen</Badge>
                        </div>
                    </div>

                    {files.length < limit && <Dropzone onDrop={handleOnDrop} onDropRejected={handleOnReject} accept={acceptedFiles} />}
                    {files.length > 0 && (
                        <form onSubmit={handleOnUpload}>
                            <Button
                                disabled={isUploading}
                                onClick={handleOnUpload}
                                className="w-full cursor-pointer bg-blue-600 text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                                size="lg"
                            >
                                {isUploading && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Upload {files.length} Dokumen
                            </Button>
                        </form>
                    )}
                </div>

                <div className="col-span-12 flex flex-col lg:col-span-8">
                    <h2 className="text-primary mb-4 text-lg font-semibold">Daftar Dokumen</h2>

                    {files.length === 0 ? (
                        <div className="bg-primary-foreground flex h-full flex-col items-center justify-center rounded-lg p-8">
                            <p className="text-center text-sm text-gray-500 dark:text-gray-400">Belum ada dokumen yang diunggah</p>
                        </div>
                    ) : (
                        <DocumentList files={files} onDelete={handleOnDeleteFile} />
                    )}
                </div>
            </div>
        </div>
    );
}
