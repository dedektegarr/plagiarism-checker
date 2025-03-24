import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Group } from '@/types';
import { Link } from '@inertiajs/react';
import { FolderIcon, Plus, SearchIcon } from 'lucide-react';
import { useState } from 'react';
import GroupListsItem from './group-lists-item';

type GroupListsProps = {
    groups: Group[];
};

export function GroupLists({ groups }: GroupListsProps) {
    const [searchQuery, setSearchQuery] = useState<string>('');

    const filteredGroups = groups.filter((group) => group.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-primary text-lg font-semibold">Grup Dokumen</h2>
                <div className="relative w-72">
                    <SearchIcon className="absolute top-3 left-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                    <Input
                        placeholder="Cari grup..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-primary-foreground pl-10 dark:border-gray-800 dark:placeholder-gray-500"
                    />
                </div>
            </div>

            {filteredGroups.length === 0 && searchQuery ? (
                <Card className="bg-primary-foreground">
                    <CardContent className="flex flex-col items-center justify-center py-10">
                        <FolderIcon className="mb-4 h-16 w-16 text-gray-300 dark:text-gray-600" />
                        <p className="text-primary text-md font-medium">Belum ada grup ditemukan</p>
                        {searchQuery && <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">Coba kata kunci lain</p>}
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    <Card className="hover:bg-primary-foreground/30 flex min-h-40 items-center justify-center border-2 border-dashed bg-transparent p-0 transition-all duration-200 hover:shadow-md">
                        <CardContent className="h-full w-full p-0">
                            <Link className="flex h-full w-full items-center justify-center" href={route('plagiarism.upload')}>
                                <Plus className="h-8 w-8" />
                            </Link>
                        </CardContent>
                    </Card>
                    {filteredGroups.map((group) => (
                        <GroupListsItem key={group.id} group={group} />
                    ))}
                </div>
            )}
        </div>
    );
}
