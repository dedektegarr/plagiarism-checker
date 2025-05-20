import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { formatFileSize } from '@/helpers/helpers';
import AppLayout from '@/layouts/app-layout';
import { Document, Group, type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { format } from 'date-fns';

interface PlagiarismCheckShowDocumentProps {
    group: Group;
    document: Document;
}

export default function PlagiarismCheckShowDocument({ group, document }: PlagiarismCheckShowDocumentProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Periksa Plagiasi',
            href: route('plagiarism.index'),
        },
        {
            title: group.name,
            href: route('plagiarism.show', group.id),
        },
        {
            title: document.filename,
            href: route('plagiarism.show.document', [group.id, document.id]),
        },
    ];

    const { props }: { props: { ziggy: { url: string } } } = usePage();

    const getPreivewPath = (path: string) => {
        const arrPath = path.split('/');
        return props.ziggy.url + '/preview/' + arrPath[arrPath.length - 1];
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={document.filename} />
            <div className="h-full space-y-6 rounded-xl p-4">
                {/* Header dengan Judul dan Rata-rata Plagiasi */}
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">Detail Dokumen</h2>
                    {document.comparison_results?.length > 0 && (
                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground text-sm">Rata-rata Plagiasi:</span>
                            <Badge variant="destructive" className="px-3 py-1 text-lg">
                                {Math.floor(
                                    (document.comparison_results.reduce((sum, result) => sum + result.similarity_score, 0) /
                                        document.comparison_results.length) *
                                        100,
                                )}
                                %
                            </Badge>
                        </div>
                    )}
                </div>

                <div className="grid h-full grid-cols-1 gap-6 md:grid-cols-2">
                    <iframe src={getPreivewPath(document.path)} className="h-full w-full rounded-b-lg" title="Document preview" />

                    {/* Kolom Kanan - Informasi Similarity & Metadata */}
                    <div className="flex h-[calc(100vh-180px)] flex-col gap-6 overflow-auto">
                        {/* Bagian Similarity */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Hasil Deteksi Plagiasi</CardTitle>
                                <CardDescription>Dokumen yang memiliki kemiripan dengan dokumen ini</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 p-0">
                                {document.comparison_results?.map((result, index) => (
                                    <div
                                        key={index}
                                        className="hover:bg-accent/50 flex items-center justify-between border-b p-4 transition-colors last:border-b-0"
                                    >
                                        <div className="flex-1 truncate pr-4">
                                            <Link
                                                href={route('plagiarism.show.document', [group.id, result.document2.id])}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-medium hover:underline"
                                            >
                                                {result.document2.filename}
                                            </Link>
                                            <p className="text-muted-foreground mt-1 text-sm">{result.document2.metadata?.author}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Badge
                                                variant={Math.floor(result.similarity_score * 100) >= 30 ? 'destructive' : 'outline'}
                                                className="w-20 justify-center text-sm"
                                            >
                                                {Math.floor(result.similarity_score * 100)}%
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Bagian Metadata */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Metadata Dokumen</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label className="text-muted-foreground text-sm">Ukuran File</Label>
                                        <p className="font-medium">{formatFileSize(document.size)}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-muted-foreground text-sm">Tipe File</Label>
                                        <p className="font-medium">PDF</p>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-muted-foreground text-sm">Jumlah Halaman</Label>
                                        <p className="font-medium">{document.metadata?.pages}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-muted-foreground text-sm">Dibuat Pada</Label>
                                        <p className="font-medium">
                                            {format(new Date(document.metadata?.created_at as string), 'dd MMM yyyy HH:mm')}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-muted-foreground text-sm">Terakhir Diubah</Label>
                                        <p className="font-medium">
                                            {format(new Date(document.metadata?.updated_at as string), 'dd MMM yyyy HH:mm')}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
