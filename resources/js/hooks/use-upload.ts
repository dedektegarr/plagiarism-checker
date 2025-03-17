import { useCallback, useState } from 'react';
import { useDropzone, type FileWithPath } from 'react-dropzone';

type FileWithPreview = FileWithPath & {
    preview?: string;
};

export function useUpload() {
    const [files, setFiles] = useState<FileWithPreview[]>([]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: useCallback((acceptedFiles: FileWithPreview[]) => {
            setFiles((prev) => [
                ...prev,
                ...acceptedFiles.map((file) => ({
                    ...file,
                    name: file.name,
                    size: file.size,
                    preview: URL.createObjectURL(file),
                })),
            ]);
        }, []),
        onDropRejected: () => {
            console.log('reject');
        },
        accept: {
            'application/pdf': ['.pdf'],
        },
        multiple: true,
    });

    const removeFile = (fileName: string) => {
        setFiles((prev) => prev.filter((file) => file.name !== fileName));
    };

    function formatFileSize(bytes: number) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    return { files, getRootProps, getInputProps, removeFile, formatFileSize, isDragActive };
}
