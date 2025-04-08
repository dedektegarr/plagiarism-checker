import { Group } from '@/types';
import { Link, router } from '@inertiajs/react';
import { format } from 'date-fns';
import { CalendarIcon, ClockIcon, LoaderCircle } from 'lucide-react';
import { useRef, useState } from 'react';
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
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface GroupListsItemProps {
    group: Group;
}

export default function GroupListsItem({ group }: GroupListsItemProps) {
    const [deleteAlert, setDeleteAlert] = useState<boolean>(false);
    const [editAlert, setEditAlert] = useState<boolean>(false);
    const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
    const [loadingEdit, setLoadingEdit] = useState<boolean>(false);

    const nameInput = useRef<HTMLInputElement>(null);

    const handleOnDelete = (id: string) => {
        router.delete(route('group.destroy', id), {
            onStart: () => {
                setLoadingDelete(true);
            },
            onSuccess: () => {
                toast.success('Grup berhasil dihapus');
            },
            onFinish: () => {
                setLoadingDelete(false);
                setDeleteAlert(false);
            },
        });
    };

    const handleOnEdit = (id: string) => {
        router.put(
            route('group.update', id),
            {
                name: nameInput.current?.value,
            },
            {
                onStart: () => {
                    setLoadingEdit(true);
                },
                onSuccess: () => {
                    toast.success('Grup berhasil diperbarui');
                    setEditAlert(false);
                },
                onError: (error) => {
                    nameInput.current?.focus();
                    toast.error('Gagal memperbarui grup', {
                        description: error.name,
                    });
                },
                onFinish: () => {
                    setLoadingEdit(false);
                },
            },
        );
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
                            <Dialog open={editAlert} onOpenChange={setEditAlert}>
                                <DialogTrigger asChild>
                                    <DropdownMenuItem
                                        onSelect={(e) => {
                                            e.preventDefault();
                                            setEditAlert(true);
                                        }}
                                        className="focus:bg-primary-foreground cursor-pointer text-xs dark:text-gray-200"
                                    >
                                        Edit Grup
                                    </DropdownMenuItem>
                                </DialogTrigger>
                                <DialogContent aria-describedby={undefined} className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Edit Grup</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="name" className="text-right">
                                                Nama Grup
                                            </Label>
                                            <Input
                                                ref={nameInput}
                                                id="name"
                                                defaultValue={group.name}
                                                className="col-span-3"
                                                autoComplete="off"
                                                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        handleOnEdit(group.id);
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button onClick={() => handleOnEdit(group.id)} type="button" disabled={loadingEdit}>
                                            {loadingEdit && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                            Simpan
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            <AlertDialog open={deleteAlert} onOpenChange={setDeleteAlert}>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem
                                        onSelect={(e) => {
                                            e.preventDefault();
                                            setDeleteAlert(true);
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
                                        <Button type="button" onClick={() => handleOnDelete(group.id)} disabled={loadingDelete}>
                                            {loadingDelete && <LoaderCircle className="h-4 w-4 animate-spin" />}
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
