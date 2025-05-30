import { cn } from '@/lib/utils';
import { DropzoneOptions, useDropzone } from 'react-dropzone';

export default function Dropzone(props: DropzoneOptions) {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ ...props });

    return (
        <div
            {...getRootProps()}
            className={cn(
                'group mb-4 cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-colors',
                'dark:border-gray-600 dark:hover:border-gray-400',
                isDragActive
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'bg-primary-foreground border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-400',
            )}
        >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center">
                <div className="rounded-full bg-gray-100 p-2 transition-colors dark:bg-gray-600 group-hover:dark:bg-gray-400">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-gray-400 transition-colors group-hover:dark:text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
