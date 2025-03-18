import DocumentListItem from './document-list-item';
import { FileWithPreview } from './upload-document';

interface DocumentListProps {
    files: FileWithPreview[];
    onDelete: (filename: string) => void;
}

export default function DocumentList({ files, onDelete }: DocumentListProps) {
    return (
        <div className="flex-1 overflow-y-auto">
            <div className="divide-y rounded-lg border dark:border-gray-600">
                {files.map((file, index) => (
                    <DocumentListItem key={index} file={file} onDelete={onDelete} />
                ))}
            </div>
        </div>
    );
}
