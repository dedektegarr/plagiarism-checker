import DocumentUploadListsItem from './document-upload-list-item';
import { FileWithPreview } from './upload-document';

export interface DocumentUploadListsProps {
    files: FileWithPreview[];
    onDelete: (filename: string) => void;
}

export default function DocumentUploadLists({ files, onDelete }: DocumentUploadListsProps) {
    return (
        <div className="flex-1 overflow-y-auto">
            <div className="divide-y rounded-lg border">
                {files.map((file, index) => (
                    <DocumentUploadListsItem key={index} file={file} onDelete={onDelete} />
                ))}
            </div>
        </div>
    );
}
