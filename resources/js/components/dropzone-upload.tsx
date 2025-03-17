import { useUpload } from '@/hooks/use-upload';
import { cn } from '@/lib/utils';
import { Plus, X } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

export default function DropzoneUpload() {
    const { files, removeFile, getInputProps, formatFileSize, getRootProps, isDragActive } = useUpload();

    const handleUpload = () => {
        console.log('Files to upload:', files);
        alert('Upload functionality to be implemented');
    };

    return (
        <div className="w-full">
            {/* Desktop Layout - Two Column */}
            <div className="hidden items-start md:grid md:grid-cols-12 md:gap-6">
                {/* Left Column - Overview */}
                <div className="flex flex-col md:col-span-4">
                    <h2 className="mb-4 text-xl font-semibold dark:text-gray-100">Ringkasan</h2>

                    <div className="mb-4 flex flex-col space-y-4">
                        <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                            <span className="text-gray-700 dark:text-gray-300">Total Dokumen</span>
                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"> {files.length}</Badge>
                        </div>

                        <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                            <span className="text-gray-700 dark:text-gray-300">Batas Upload</span>
                            <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">10 Dokumen</Badge>
                        </div>
                    </div>

                    {/* Upload Drop Area */}
                    {files.length < 10 && (
                        <div
                            {...getRootProps()}
                            className={cn(
                                'group mb-4 cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-colors',
                                'dark:border-gray-600 dark:hover:border-gray-400',
                                isDragActive
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                    : 'border-gray-300 bg-gray-50 hover:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:hover:border-gray-400',
                            )}
                        >
                            <input {...getInputProps()} />
                            <div className="flex flex-col items-center justify-center">
                                <div className="rounded-full bg-gray-100 p-2 dark:bg-gray-700">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-gray-400 dark:text-gray-500"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Upload Button */}
                    {files.length > 0 && (
                        <Button
                            onClick={handleUpload}
                            className="cursor-pointer bg-blue-600 text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                            size="lg"
                        >
                            Upload {files.length} Dokumen
                        </Button>
                    )}
                </div>

                {/* Right Column - File List */}
                <div className="flex flex-col md:col-span-8">
                    <h2 className="mb-4 text-xl font-semibold dark:text-gray-100">Daftar Dokumen</h2>

                    {files.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center rounded-lg bg-gray-50 p-8 dark:bg-gray-800">
                            <p className="text-center text-gray-500 dark:text-gray-400">Belum ada dokumen yang diunggah</p>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto">
                            <div className="divide-y rounded-lg border dark:border-gray-600">
                                {files.map((file, index) => (
                                    <div key={file.name + index} className="flex items-center justify-between p-4">
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
                                                <p className="text-sm font-medium text-gray-900 dark:text-gray-200">{file.name}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{formatFileSize(file.size)}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeFile(file.name)}
                                            className="cursor-pointer text-red-800 transition-colors hover:text-red-900 dark:text-red-700 dark:hover:text-red-800"
                                        >
                                            <X className="h-6 w-6" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Layout - Single Column */}
            <div className="flex flex-col gap-4 md:hidden">
                {files.length < 10 && (
                    <div
                        {...getRootProps()}
                        className={cn(
                            'group cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-colors',
                            'dark:border-gray-600 dark:bg-gray-800 dark:hover:border-gray-400',
                            isDragActive
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-300 bg-gray-50 hover:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:hover:border-gray-400',
                        )}
                    >
                        <input {...getInputProps()} />
                        <div className="flex items-center justify-center">
                            <Plus className="text-gray-300 transition-colors group-hover:text-gray-400 dark:text-gray-600 dark:group-hover:text-gray-400" />
                        </div>
                    </div>
                )}

                {/* File List */}
                {files.length > 0 && (
                    <div className="space-y-4">
                        <div className="divide-y rounded-lg border dark:border-gray-600">
                            {files.map((file, index) => (
                                <div key={file.name + index} className="flex items-center justify-between p-4">
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
                                            <p className="font-medium text-gray-900 dark:text-gray-200">{file.name}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{formatFileSize(file.size)}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeFile(file.name)}
                                        className="cursor-pointer text-red-800 transition-colors hover:text-red-900 dark:text-red-700 dark:hover:text-red-800"
                                    >
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={handleUpload}
                            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                        >
                            Upload {files.length} {files.length === 1 ? 'File' : 'Files'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
