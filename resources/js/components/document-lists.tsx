import { cn } from '@/lib/utils';
import { type Document } from '@/types';
import { Archive, FileText, User } from 'lucide-react';
import DocumentListItem from './document-list-item';
import { Card } from './ui/card';

interface DocumentListsProps {
    documents: Document[];
    className?: string;
}

export default function DocumentLists({ documents, className }: DocumentListsProps) {
    return (
        <Card className={cn('p-6', className)}>
            <div className="flex flex-col gap-4">
                <div className="text-muted-foreground grid grid-cols-12 gap-4 px-4 py-2 text-sm font-medium">
                    <div className="col-span-6 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Nama Dokumen
                    </div>
                    <div className="col-span-3 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Penulis
                    </div>
                    <div className="col-span-2 flex items-center gap-2">
                        <Archive className="h-4 w-4" />
                        Ukuran
                    </div>
                    <div className="col-span-1">Status</div>
                </div>

                {documents.map((document) => (
                    <DocumentListItem document={document} key={document.id} />
                ))}
            </div>
        </Card>
    );
}
