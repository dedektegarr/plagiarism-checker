import { formatFileSize } from '@/helpers/helpers';
import { type Document } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Badge } from './ui/badge';
import { Card } from './ui/card';

interface DocumentListItemProps {
    document: Document;
    threshold: number;
}

export default function DocumentListItem({ document, threshold }: DocumentListItemProps) {
    const { props }: { props: { group: { id: string } } } = usePage();

    return (
        <Card key={document.id} className="hover:bg-accent/50 grid grid-cols-12 items-center gap-4 rounded-lg p-4 transition-colors">
            <div className="col-span-4 line-clamp-1 flex items-center truncate font-medium">
                <Link href={route('plagiarism.show.document', [props.group.id, document.id])}>{document.filename}</Link>
            </div>
            <div className="text-muted-foreground col-span-3 truncate text-sm">{document.metadata?.author ?? 'Unknown'}</div>
            <div className="text-muted-foreground col-span-2 text-sm">{formatFileSize(document.size)}</div>

            <div className="col-span-1 flex justify-center">
                {document.max_similarity ? (
                    <span className="text-sm font-medium">{Math.floor(document.max_similarity * 100)}%</span>
                ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                )}
            </div>

            <div className="col-span-2 flex justify-center">
                {document.max_similarity ? (
                    <Badge variant={Math.floor(document.max_similarity * 100) >= threshold ? 'destructive' : 'default'}>
                        {Math.floor(document.max_similarity * 100) >= threshold ? 'Plagiat' : 'Tidak Plagiat'}
                    </Badge>
                ) : (
                    <span className="text-muted-foreground text-sm">Belum diperiksa</span>
                )}
            </div>
        </Card>
    );
}
