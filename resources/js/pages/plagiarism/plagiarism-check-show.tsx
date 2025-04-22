import DocumentLists from '@/components/document-lists';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Group } from '@/types';
import { Head, router, usePoll } from '@inertiajs/react';
import { LoaderCircle, ScanSearch } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface PlagiarismCheckShowProps {
    group: Group;
}

export default function PlagiarismCheckShow({ group }: PlagiarismCheckShowProps) {
    usePoll(5000);
    const [isCalculating, setIsCalculating] = useState<boolean>(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Periksa Plagiasi',
            href: route('plagiarism.index'),
        },
        {
            title: group.name,
            href: route('plagiarism.show', group.id),
        },
    ];

    const isPreprocessing: boolean = group.docs.every((document) => document.metadata === null);

    const handleCalculateSimilarity = (id: string) => {
        router.post(
            route('plagiarism.calculate', id),
            {},
            {
                onStart: () => {
                    setIsCalculating(true);
                    toast.loading('Menghitung plagiasi...', { id: 'calculate-progress' });
                },
                onSuccess: () => {
                    toast.success('Berhasil menghitung plagiasi');
                },
                onError: (errors) => {
                    console.log(errors);
                },
                onFinish: () => {
                    toast.dismiss('calculate-progress');
                    setIsCalculating(false);
                },
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={group.name} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-primary text-lg font-semibold">{group.name}</h2>
                    <Button className="cursor-pointer gap-2" disabled={isPreprocessing} onClick={() => handleCalculateSimilarity(group.id)}>
                        {isPreprocessing || isCalculating ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ScanSearch className="h-4 w-4" />}
                        {isPreprocessing || isCalculating ? 'Memproses...' : 'Periksa Plagiasi'}
                    </Button>
                </div>

                <DocumentLists
                    isPreprocessing={isPreprocessing}
                    documents={group.docs}
                    className={!group.docs.every((d) => d.metadata) ? 'pointer-events-none opacity-50' : ''}
                />
            </div>
        </AppLayout>
    );
}
