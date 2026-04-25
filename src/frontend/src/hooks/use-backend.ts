import { createActor } from "@/backend";
import type {
  Article,
  ArticleInput,
  ContactRecord,
  ContactSubmission,
  Note,
  NoteInput,
  Profile,
  ProfileInput,
  Publication,
  PublicationInput,
  ResearchInput,
  ResearchProject,
} from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ─── Mappers (bigint → number for frontend types) ─────────────────────────────

function mapResearch(r: {
  id: bigint;
  seqNum: bigint;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  fullContent: string;
  pdfUrl?: string;
}): ResearchProject {
  return {
    id: Number(r.id),
    seqNum: Number(r.seqNum),
    title: r.title,
    description: r.description,
    tags: r.tags,
    imageUrl: r.imageUrl,
    fullContent: r.fullContent,
    pdfUrl: r.pdfUrl,
  };
}

function mapArticle(a: {
  id: bigint;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  publishDate: string;
  coverImage: string;
  pdfUrl?: string;
}): Article {
  return {
    id: Number(a.id),
    title: a.title,
    excerpt: a.excerpt,
    content: a.content,
    category: a.category,
    publishDate: a.publishDate,
    coverImage: a.coverImage,
    pdfUrl: a.pdfUrl,
  };
}

function mapPublication(p: {
  id: bigint;
  title: string;
  authors: string[];
  venue: string;
  year: bigint;
  pubType: string;
  link: string;
  pdfUrl?: string;
}): Publication {
  return {
    id: Number(p.id),
    title: p.title,
    authors: p.authors,
    venue: p.venue,
    year: Number(p.year),
    pubType: p.pubType,
    link: p.link,
    pdfUrl: p.pdfUrl,
  };
}

function mapNote(n: {
  id: bigint;
  title: string;
  excerpt: string;
  content: string;
  publishDate: string;
  tags: string[];
  pdfUrl?: string;
}): Note {
  return {
    id: Number(n.id),
    title: n.title,
    excerpt: n.excerpt,
    content: n.content,
    publishDate: n.publishDate,
    tags: n.tags,
    pdfUrl: n.pdfUrl,
  };
}

function mapProfile(p: {
  name: string;
  bio: string;
  avatarUrl: string;
  stats: { value: string; statLabel: string }[];
  skills: string[];
  milestones: { year: bigint; title: string; description: string }[];
}): Profile {
  return {
    name: p.name,
    bio: p.bio,
    avatarUrl: p.avatarUrl,
    stats: p.stats.map((s) => ({ value: s.value, label: s.statLabel })),
    skills: p.skills,
    milestones: p.milestones.map((m) => ({
      year: Number(m.year),
      title: m.title,
      description: m.description,
    })),
  };
}

function mapContactRecord(c: {
  id: bigint;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: bigint;
}): ContactRecord {
  return {
    id: Number(c.id),
    name: c.name,
    email: c.email,
    subject: c.subject,
    message: c.message,
    createdAt: Number(c.createdAt),
  };
}

// ─── Public Queries ───────────────────────────────────────────────────────────

export function useResearchProjects() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ResearchProject[]>({
    queryKey: ["research"],
    queryFn: async () => {
      if (!actor) return [];
      const data = await actor.getResearchProjects();
      return data.map(mapResearch).sort((a, b) => a.seqNum - b.seqNum);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000,
    staleTime: 0,
  });
}

export function useResearchProject(id: number) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ResearchProject | null>({
    queryKey: ["research", id],
    queryFn: async () => {
      if (!actor) return null;
      const data = await actor.getResearchProject(BigInt(id));
      return data ? mapResearch(data) : null;
    },
    enabled: !!actor && !isFetching && !!id,
    refetchInterval: 5000,
    staleTime: 0,
  });
}

export function useArticles() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Article[]>({
    queryKey: ["articles"],
    queryFn: async () => {
      if (!actor) return [];
      const data = await actor.getArticles();
      return data.map(mapArticle);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000,
    staleTime: 0,
  });
}

export function useArticle(id: number) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Article | null>({
    queryKey: ["articles", id],
    queryFn: async () => {
      if (!actor) return null;
      const data = await actor.getArticle(BigInt(id));
      return data ? mapArticle(data) : null;
    },
    enabled: !!actor && !isFetching && !!id,
    refetchInterval: 5000,
    staleTime: 0,
  });
}

export function usePublications() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Publication[]>({
    queryKey: ["publications"],
    queryFn: async () => {
      if (!actor) return [];
      const data = await actor.getPublications();
      return data.map(mapPublication);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000,
    staleTime: 0,
  });
}

export function useNotes() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Note[]>({
    queryKey: ["notes"],
    queryFn: async () => {
      if (!actor) return [];
      const data = await actor.getNotes();
      return data.map(mapNote);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000,
    staleTime: 0,
  });
}

export function useNote(id: number) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Note | null>({
    queryKey: ["notes", id],
    queryFn: async () => {
      if (!actor) return null;
      const data = await actor.getNote(BigInt(id));
      return data ? mapNote(data) : null;
    },
    enabled: !!actor && !isFetching && !!id,
    refetchInterval: 5000,
    staleTime: 0,
  });
}

export function useProfile() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Profile | null>({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!actor) return null;
      const data = await actor.getProfile();
      return data ? mapProfile(data) : null;
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000,
    staleTime: 0,
  });
}

export function useSubmitContact() {
  const { actor } = useActor(createActor);
  return useMutation<void, Error, ContactSubmission>({
    mutationFn: async (submission: ContactSubmission) => {
      if (!actor) throw new Error("Backend not ready");
      const result = await actor.submitContact(submission);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
  });
}

// ─── Admin Queries ────────────────────────────────────────────────────────────

export function useAdminGetContacts(token: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ContactRecord[]>({
    queryKey: ["admin-contacts"],
    queryFn: async () => {
      if (!actor || !token) return [];
      const result = await actor.adminGetContacts(token);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok.map(mapContactRecord);
    },
    enabled: !!actor && !isFetching && !!token,
    refetchInterval: 5000,
    staleTime: 0,
  });
}

// ─── Admin Mutation Helpers ───────────────────────────────────────────────────

function useAdminMutation<TVariables>(
  mutationFn: (
    actor: ReturnType<typeof createActor>,
    vars: TVariables,
  ) => Promise<
    { __kind__: "ok"; ok: string } | { __kind__: "err"; err: string }
  >,
  invalidateKeys: string[][],
) {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<void, Error, TVariables>({
    mutationFn: async (vars) => {
      if (!actor) throw new Error("Backend not ready");
      const result = await mutationFn(actor, vars);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      for (const key of invalidateKeys) {
        queryClient.invalidateQueries({ queryKey: key });
      }
    },
  });
}

// ─── Research Admin Mutations ─────────────────────────────────────────────────

export function useAdminCreateResearch(token: string) {
  return useAdminMutation<ResearchInput>(
    (actor, input) =>
      actor.adminCreateResearch(token, {
        ...input,
        seqNum: BigInt(input.seqNum),
      }),
    [["research"]],
  );
}

export function useAdminUpdateResearch(token: string) {
  return useAdminMutation<{ id: number; input: ResearchInput }>(
    (actor, { id, input }) =>
      actor.adminUpdateResearch(token, BigInt(id), {
        ...input,
        seqNum: BigInt(input.seqNum),
      }),
    [["research"]],
  );
}

export function useAdminDeleteResearch(token: string) {
  return useAdminMutation<number>(
    (actor, id) => actor.adminDeleteResearch(token, BigInt(id)),
    [["research"]],
  );
}

// ─── Article Admin Mutations ──────────────────────────────────────────────────

export function useAdminCreateArticle(token: string) {
  return useAdminMutation<ArticleInput>(
    (actor, input) => actor.adminCreateArticle(token, input),
    [["articles"]],
  );
}

export function useAdminUpdateArticle(token: string) {
  return useAdminMutation<{ id: number; input: ArticleInput }>(
    (actor, { id, input }) =>
      actor.adminUpdateArticle(token, BigInt(id), input),
    [["articles"]],
  );
}

export function useAdminDeleteArticle(token: string) {
  return useAdminMutation<number>(
    (actor, id) => actor.adminDeleteArticle(token, BigInt(id)),
    [["articles"]],
  );
}

// ─── Publication Admin Mutations ──────────────────────────────────────────────

export function useAdminCreatePublication(token: string) {
  return useAdminMutation<PublicationInput>(
    (actor, input) =>
      actor.adminCreatePublication(token, {
        ...input,
        year: BigInt(input.year),
      }),
    [["publications"]],
  );
}

export function useAdminUpdatePublication(token: string) {
  return useAdminMutation<{ id: number; input: PublicationInput }>(
    (actor, { id, input }) =>
      actor.adminUpdatePublication(token, BigInt(id), {
        ...input,
        year: BigInt(input.year),
      }),
    [["publications"]],
  );
}

export function useAdminDeletePublication(token: string) {
  return useAdminMutation<number>(
    (actor, id) => actor.adminDeletePublication(token, BigInt(id)),
    [["publications"]],
  );
}

// ─── Note Admin Mutations ─────────────────────────────────────────────────────

export function useAdminCreateNote(token: string) {
  return useAdminMutation<NoteInput>(
    (actor, input) => actor.adminCreateNote(token, input),
    [["notes"]],
  );
}

export function useAdminUpdateNote(token: string) {
  return useAdminMutation<{ id: number; input: NoteInput }>(
    (actor, { id, input }) => actor.adminUpdateNote(token, BigInt(id), input),
    [["notes"]],
  );
}

export function useAdminDeleteNote(token: string) {
  return useAdminMutation<number>(
    (actor, id) => actor.adminDeleteNote(token, BigInt(id)),
    [["notes"]],
  );
}

// ─── Profile Admin Mutation ───────────────────────────────────────────────────

export function useAdminUpdateProfile(token: string) {
  return useAdminMutation<ProfileInput>(
    (actor, input) =>
      actor.adminUpdateProfile(token, {
        ...input,
        milestones: input.milestones.map((m) => ({
          ...m,
          year: BigInt(m.year),
        })),
      }),
    [["profile"]],
  );
}
