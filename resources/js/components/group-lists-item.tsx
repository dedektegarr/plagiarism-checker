import { Group } from '@/types';
import { Link, router } from '@inertiajs/react';
import { format } from 'date-fns';
import { CalendarIcon, ClockIcon, LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from './ui/alert-dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

interface GroupListsItemProps {
    group: Group;
}

export default function GroupListsItem({ group }: GroupListsItemProps) {
    const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleOnDelete = (id: string) => {
        router.delete(route('group.destroy', id), {
            onStart: () => {
                setIsLoading(true);
            },
            onSuccess: () => {
                toast.success('Grup berhasil dihapus');
                setIsAlertOpen(false);
            },
            onFinish: () => {
                setIsLoading(false);
            },
        });
    };

    return (
        <Card className="bg-primary-foreground p-0 transition-all duration-200 hover:shadow-md">
            <CardContent className="p-5">
                <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                        <h3 className="max-w-[170px] truncate font-semibold dark:text-white" title={group.name}>
                            {group.name}
                        </h3>
                    </div>
                    <Badge variant="outline" className="bg-blue-50 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        {group.number_of_documents} dokumen
                    </Badge>
                </div>

                <div className="mb-4 space-y-2">
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <CalendarIcon className="mr-1 h-4 w-4" />
                        <span>{format(new Date(group.created_at), 'dd MMM yyyy')}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <ClockIcon className="mr-1 h-4 w-4" />
                        <span>{format(new Date(group.created_at), 'HH:mm:ss')}</span>
                    </div>
                </div>

                <div className="mt-2 flex items-center justify-between">
                    <Link
                        className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        href={route('plagiarism.show', group.id)}
                    >
                        Lihat Detail
                    </Link>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 dark:text-gray-400 dark:hover:text-white">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle cx="12" cy="12" r="1" />
                                    <circle cx="12" cy="5" r="1" />
                                    <circle cx="12" cy="19" r="1" />
                                </svg>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-background">
                            <DropdownMenuItem className="focus:bg-primary-foreground text-xs dark:text-gray-200">Edit Grup</DropdownMenuItem>
                            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem
                                        onSelect={(e) => {
                                            e.preventDefault();
                                            setIsAlertOpen(true);
                                        }}
                                        className="focus:bg-primary-foreground cursor-pointer text-xs text-red-600 dark:text-red-400"
                                    >
                                        Hapus Grup
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Apakah kamu yakin ingin menghapus grup ini?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Tindakan ini tidak dapat dibatalkan. Grup ini akan dihapus secara permanen.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Batal</AlertDialogCancel>
                                        <Button type="button" onClick={() => handleOnDelete(group.id)} disabled={isLoading}>
                                            {isLoading && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                            Hapus
                                        </Button>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardContent>
        </Card>
    );
}
