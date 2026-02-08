import { Badge, badgeVariants } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatFileSize } from '@/helpers/helpers';
import AppLayout from '@/layouts/app-layout';
import { Document, Group, type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { Check, Pencil, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

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
    const [isEditing, setIsEditing] = useState(false);

    const { data, setData, put, processing, reset, errors } = useForm({
        filename: document.filename.replace('.pdf', ''),
    });

    const getPreivewPath = (path: string) => {
        const arrPath = path.split('/');
        return props.ziggy.url + '/preview/' + arrPath[arrPath.length - 1];
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('plagiarism.update-document', [group.id, document.id]), {
            onSuccess: () => {
                setIsEditing(false);
                toast.success('Nama dokumen berhasil diperbarui');
            },
            onError: () => {
                toast.error('Gagal memperbarui nama dokumen');
            },
        });
    };

    const toggleEdit = () => {
        if (isEditing) {
            reset();
        }
        setIsEditing(!isEditing);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={document.filename} />
            <div className="h-full space-y-6 rounded-xl p-4">
                {/* Header dengan Judul dan Rata-rata Plagiasi */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {isEditing ? (
                            <form onSubmit={handleUpdate} className="flex items-center gap-2">
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                        <Input
                                            value={data.filename}
                                            onChange={(e) => setData('filename', e.target.value)}
                                            className="h-8 w-[300px]"
                                            autoFocus
                                            placeholder="Nama dokumen"
                                        />
                                        <span className="text-muted-foreground text-sm font-medium">.pdf</span>
                                    </div>
                                    {errors.filename && <span className="text-destructive text-xs">{errors.filename}</span>}
                                </div>
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600" type="submit" disabled={processing}>
                                    <Check className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600" type="button" onClick={toggleEdit}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </form>
                        ) : (
                            <div className="group flex items-center gap-2">
                                <h2 className="text-lg font-bold tracking-tight">{document.filename}</h2>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="text-muted-foreground h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                                    onClick={toggleEdit}
                                >
                                    <Pencil className="h-3 w-3" />
                                </Button>
                            </div>
                        )}
                    </div>

                    {(document.comparison_results?.length ?? 0) > 0 && (
                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground text-sm">Rata-rata Plagiasi:</span>
                            <Badge variant="destructive" className="px-3 py-1">
                                {Math.floor(
                                    ((document.comparison_results?.reduce((sum, result) => sum + result.similarity_score, 0) || 0) /
                                        (document.comparison_results?.length || 1)) *
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
                                            <Link
                                                href={route('plagiarism.compare', [group.id, document.id, result.document2.id])}
                                                className={badgeVariants({ variant: 'secondary' })}
                                            >
                                                Bandingkan
                                            </Link>
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
                                        <p className="font-medium text-sm">{formatFileSize(document.size)}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-muted-foreground text-sm">Tipe File</Label>
                                        <p className="font-medium text-sm">PDF</p>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-muted-foreground text-sm">Jumlah Halaman</Label>
                                        <p className="font-medium text-sm">{document.metadata?.pages}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-muted-foreground text-sm">Dibuat Pada</Label>
                                        <p className="font-medium text-sm">
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
