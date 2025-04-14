import { formatFileSize } from '@/helpers/helpers';
import { X } from 'lucide-react';
import { FileWithPreview } from './upload-document';

interface DocumentUPloadListPorps {
    file: FileWithPreview;
    onDelete: (filename: string) => void;
}

export default function DocumentUploadListsItem({ file, onDelete }: DocumentUPloadListPorps) {
    return (
        <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
                <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/20">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-blue-600 dark:text-blue-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                </div>
                <div>
                    <a href={URL.createObjectURL(file)} target="_blank" className="inline-block text-sm font-medium text-gray-900 dark:text-gray-200">
                        {file.name}
                    </a>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{formatFileSize(file.size)}</p>
                </div>
            </div>
            <button
                onClick={() => onDelete(file.name)}
                className="cursor-pointer text-red-800 transition-colors hover:text-red-900 dark:text-red-700 dark:hover:text-red-800"
            >
                <X className="h-5 w-5" />
            </button>
        </div>
    );
}
