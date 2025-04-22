import { formatFileSize } from '@/helpers/helpers';
import { type Document } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Badge } from './ui/badge';
import { Card } from './ui/card';

interface DocumentListItemProps {
    document: Document;
}

export default function DocumentListItem({ document }: DocumentListItemProps) {
    const { props }: { props: { group: { id: string } } } = usePage();

    return (
        <Card key={document.id} className="hover:bg-accent/50 grid grid-cols-12 items-center gap-4 rounded-lg p-4 transition-colors">
            <div className="col-span-6 line-clamp-1 flex items-center truncate font-medium">
                <Link href={route('plagiarism.show.document', [props.group.id, document.id])}>{document.filename}</Link>
            </div>
            <div className="text-muted-foreground col-span-3 truncate text-sm">{document.metadata?.author ?? 'Unknown'}</div>
            <div className="text-muted-foreground col-span-2 text-sm">{formatFileSize(document.size)}</div>

            <div className="col-span-1">
                {document.max_similarity ? (
                    <div className="flex items-center gap-2">
                        <Badge variant={Math.floor(document.max_similarity * 100) >= 30 ? 'destructive' : 'default'}>
                            {Math.floor(document.max_similarity * 100)}%
                        </Badge>
                    </div>
                ) : (
                    <span className="text-muted-foreground text-sm">Belum diperiksa</span>
                )}
            </div>
        </Card>
    );
}
