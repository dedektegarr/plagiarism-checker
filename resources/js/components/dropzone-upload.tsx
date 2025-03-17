import { useUpload } from '@/hooks/use-upload';
import { cn } from '@/lib/utils';

export default function DropzoneUpload() {
    const { files, removeFile, getInputProps, formatFileSize, getRootProps, isDragActive } = useUpload();

    const handleUpload = () => {
        console.log('Files to upload:', files);
        alert('Upload functionality to be implemented');
    };

    return (
        <div>
            <div
                {...getRootProps()}
                className={cn(
                    'cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors',
                    isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:border-gray-400',
                )}
            >
                <input {...getInputProps()} />
                <div className="space-y-2">
                    <div className="flex justify-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-12 w-12 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                        </svg>
                    </div>
                    <p className="text-gray-600">{isDragActive ? 'Lepaskan file PDF di sini' : 'Seret file PDF ke sini atau klik untuk memilih'}</p>
                    <p className="text-sm text-gray-500">Maksimal 10 file PDF</p>
                </div>
            </div>

            {/* File List */}
            {files.length > 0 && (
                <div className="space-y-4">
                    <div className="divide-y rounded-lg border">
                        {files.map((file) => (
                            <div key={file.name} className="flex items-center justify-between p-4">
                                <div className="flex items-center space-x-4">
                                    <div className="rounded-lg bg-blue-100 p-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 text-blue-600"
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
                                        <p className="font-medium text-gray-900">{file.name}</p>
                                        <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                                    </div>
                                </div>
                                <button onClick={() => removeFile(file.name)} className="text-red-600 hover:text-red-800">
                                    Hapus
                                </button>
                            </div>
                        ))}
                    </div>

                    <button onClick={handleUpload} className="w-full rounded-lg bg-blue-600 px-4 py-3 text-white transition-colors hover:bg-blue-700">
                        Upload {files.length} File
                    </button>
                </div>
            )}
        </div>
    );
}
