import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Article {
    id: bigint;
    title: string;
    content: string;
    publishDate: string;
    coverImage: string;
    pdfUrl?: string;
    excerpt: string;
    category: string;
}
export interface PublicationInput {
    title: string;
    venue: string;
    link: string;
    year: bigint;
    authors: Array<string>;
    pubType: string;
    pdfUrl?: string;
}
export interface ContactSubmission {
    subject: string;
    name: string;
    email: string;
    message: string;
}
export interface ContactRecord {
    id: bigint;
    subject: string;
    name: string;
    createdAt: bigint;
    email: string;
    message: string;
}
export interface Profile {
    bio: string;
    name: string;
    stats: Array<StatItem>;
    avatarUrl: string;
    skills: Array<string>;
    milestones: Array<Milestone>;
}
export interface Milestone {
    title: string;
    year: bigint;
    description: string;
}
export type Result = {
    __kind__: "ok";
    ok: string;
} | {
    __kind__: "err";
    err: string;
};
export interface ResearchProject {
    id: bigint;
    title: string;
    fullContent: string;
    tags: Array<string>;
    description: string;
    seqNum: bigint;
    imageUrl: string;
    pdfUrl?: string;
}
export interface StatItem {
    value: string;
    statLabel: string;
}
export interface NoteInput {
    title: string;
    content: string;
    publishDate: string;
    tags: Array<string>;
    pdfUrl?: string;
    excerpt: string;
}
export type Token = string;
export interface Publication {
    id: bigint;
    title: string;
    venue: string;
    link: string;
    year: bigint;
    authors: Array<string>;
    pubType: string;
    pdfUrl?: string;
}
export interface ArticleInput {
    title: string;
    content: string;
    publishDate: string;
    coverImage: string;
    pdfUrl?: string;
    excerpt: string;
    category: string;
}
export interface ProfileInput {
    bio: string;
    name: string;
    stats: Array<StatItem>;
    avatarUrl: string;
    skills: Array<string>;
    milestones: Array<Milestone>;
}
export interface ResearchInput {
    title: string;
    fullContent: string;
    tags: Array<string>;
    description: string;
    seqNum: bigint;
    imageUrl: string;
    pdfUrl?: string;
}
export interface Note {
    id: bigint;
    title: string;
    content: string;
    publishDate: string;
    tags: Array<string>;
    pdfUrl?: string;
    excerpt: string;
}
export interface backendInterface {
    adminChangePassword(token: Token, newPassword: string): Promise<Result>;
    adminCreateArticle(token: Token, input: ArticleInput): Promise<Result>;
    adminCreateNote(token: Token, input: NoteInput): Promise<Result>;
    adminCreatePublication(token: Token, input: PublicationInput): Promise<Result>;
    adminCreateResearch(token: Token, input: ResearchInput): Promise<Result>;
    adminDeleteArticle(token: Token, id: bigint): Promise<Result>;
    adminDeleteNote(token: Token, id: bigint): Promise<Result>;
    adminDeletePublication(token: Token, id: bigint): Promise<Result>;
    adminDeleteResearch(token: Token, id: bigint): Promise<Result>;
    adminGetContacts(token: Token): Promise<{
        __kind__: "ok";
        ok: Array<ContactRecord>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminLogin(adminId: string, password: string): Promise<{
        __kind__: "ok";
        ok: Token;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminLogout(token: Token): Promise<Result>;
    adminUpdateArticle(token: Token, id: bigint, input: ArticleInput): Promise<Result>;
    adminUpdateNote(token: Token, id: bigint, input: NoteInput): Promise<Result>;
    adminUpdateProfile(token: Token, input: ProfileInput): Promise<Result>;
    adminUpdatePublication(token: Token, id: bigint, input: PublicationInput): Promise<Result>;
    adminUpdateResearch(token: Token, id: bigint, input: ResearchInput): Promise<Result>;
    adminValidateToken(token: Token): Promise<boolean>;
    getArticle(id: bigint): Promise<Article | null>;
    getArticles(): Promise<Array<Article>>;
    getNote(id: bigint): Promise<Note | null>;
    getNotes(): Promise<Array<Note>>;
    getProfile(): Promise<Profile | null>;
    getPublication(id: bigint): Promise<Publication | null>;
    getPublications(): Promise<Array<Publication>>;
    getResearchProject(id: bigint): Promise<ResearchProject | null>;
    getResearchProjects(): Promise<Array<ResearchProject>>;
    submitContact(submission: ContactSubmission): Promise<Result>;
}
