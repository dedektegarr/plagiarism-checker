import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    [key: string]: unknown;
}

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Group {
    id: string;
    user_id: string;
    name: string;
    number_of_documents: number;
    created_at: string;
    updated_at: string;
}

export interface Metadata {
    id: string;
    document_id: string;
    title?: string | null;
    author?: string | null;
    pages?: number | null;
    preprocessed_text: string;
}

export interface Document {
    id: string;
    filename: string;
    path: string;
    group_id: string;
    size: number;
    metadata?: Metadata | null;
}

export interface Group {
    id: string;
    user_id: string;
    name: string;
    documents: Document[];
    updated_at: string;
}
