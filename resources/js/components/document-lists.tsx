import { cn } from '@/lib/utils';
import { type Document } from '@/types';
import { Archive, FileText, User } from 'lucide-react';
import DocumentListItem from './document-list-item';
import { Card } from './ui/card';
import { Skeleton } from './ui/skeleton';

interface DocumentListsProps {
    documents: Document[];
    className?: string;
    isPreprocessing?: boolean;
    threshold: number;
}

export default function DocumentLists({ documents, className, isPreprocessing = false, threshold }: DocumentListsProps) {
    const SkeletonDocumentLists = () => (
        <Card className="relative overflow-hidden p-6">
            <div className="bg-background/50 absolute inset-0 backdrop-blur-sm" />
            <div className="relative space-y-6">
                {/* Skeleton Header */}
                <div className="grid grid-cols-12 gap-4 px-4 py-2">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={`header-${i}`} className="bg-muted h-4 w-3/4 rounded-full" />
                    ))}
                </div>

                {/* Skeleton Rows */}
                {documents.map((_, index) => (
                    <div key={`row-${index}`} className="grid grid-cols-12 items-center gap-4 p-4">
                        <div className="col-span-6 flex items-center gap-3">
                            <Skeleton className="bg-muted h-5 w-5 rounded-md" />
                            <Skeleton className="bg-muted h-4 w-[70%]" />
                        </div>
                        <div className="col-span-3">
                            <Skeleton className="bg-muted h-4 w-[60%]" />
                        </div>
                        <div className="col-span-2">
                            <Skeleton className="bg-muted h-4 w-[50%]" />
                        </div>
                        <div className="col-span-1">
                            <Skeleton className="bg-muted h-8 w-16 rounded-full" />
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );

    return (
        <div className="relative">
            {isPreprocessing && <SkeletonDocumentLists />}
            {!isPreprocessing && (
                <Card className={cn('p-6', className)}>
                    <div className="flex flex-col gap-4">
                        <div className="text-muted-foreground grid grid-cols-12 gap-4 px-4 py-2 text-sm font-medium">
                            <div className="col-span-4 flex items-center gap-2">
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
                            <div className="col-span-1 text-center">Kemiripan</div>
                            <div className="col-span-2 text-center">Status</div>
                        </div>

                        {documents.map((document) => (
                            <DocumentListItem document={document} key={document.id} threshold={threshold} />
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
}
