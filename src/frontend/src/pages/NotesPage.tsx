import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useNotes } from "@/hooks/use-backend";
import type { Note } from "@/types";
import { Link } from "@tanstack/react-router";
import { Download, Search, Tag } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";

// ─── NoteCard ─────────────────────────────────────────────────────────────────

function NoteCard({ note, index }: { note: Note; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: index * 0.08,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="h-full"
    >
      <Link
        to="/notes/$id"
        params={{ id: String(note.id) }}
        data-ocid={`note-card-${note.id}`}
        className="group block h-full"
      >
        <div className="relative flex flex-col h-full rounded-xl border border-border bg-card card-elevated card-hover overflow-hidden">
          {/* Accent stripe on hover */}
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="flex flex-col gap-3 p-6 flex-1">
            {/* Date */}
            <p className="text-xs font-mono text-muted-foreground tracking-widest uppercase">
              {note.publishDate}
            </p>

            {/* Title */}
            <h3 className="font-display text-lg font-semibold text-foreground leading-snug group-hover:text-primary transition-colors duration-200 line-clamp-2">
              {note.title}
            </h3>

            {/* Excerpt */}
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
              {note.excerpt}
            </p>

            {/* Tags */}
            {note.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {note.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                  >
                    <Tag className="w-2.5 h-2.5" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Read arrow */}
            <div className="flex items-center justify-between gap-2 mt-1">
              <div className="flex items-center gap-1.5 text-xs font-medium text-accent group-hover:gap-2.5 transition-all duration-200">
                <span>Read note</span>
                <span className="translate-x-0 group-hover:translate-x-1 transition-transform duration-200">
                  →
                </span>
              </div>
              {note.pdfUrl && (
                <a
                  href={note.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  data-ocid={`note.pdf_button.${note.id}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 transition-colors duration-200"
                  style={{
                    background: "rgba(212,175,55,0.15)",
                    color: "#d4af37",
                    border: "1px solid rgba(212,175,55,0.35)",
                  }}
                >
                  <Download className="w-3 h-3" />
                  PDF
                </a>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── LoadingSkeleton ───────────────────────────────────────────────────────────

function NoteCardSkeleton({ k }: { k: string }) {
  return (
    <div
      key={k}
      className="rounded-xl border border-border bg-card p-6 space-y-3"
    >
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="flex gap-1.5 pt-1">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-12 rounded-full" />
      </div>
    </div>
  );
}

// ─── EmptyState ────────────────────────────────────────────────────────────────

function EmptyState({ query }: { query: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="col-span-full flex flex-col items-center justify-center py-20 text-center"
      data-ocid="notes-empty-state"
    >
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-5">
        <Search className="w-7 h-7 text-muted-foreground" />
      </div>
      <h3 className="font-display text-xl font-semibold text-foreground mb-2">
        No notes found
      </h3>
      <p className="text-sm text-muted-foreground max-w-xs">
        No notes match{" "}
        <span className="font-medium text-primary">"{query}"</span>. Try a
        different keyword or tag.
      </p>
    </motion.div>
  );
}

// ─── NotesPage ─────────────────────────────────────────────────────────────────

export default function NotesPage() {
  const { data: notes, isLoading } = useNotes();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!notes) return [];
    const q = search.toLowerCase().trim();
    if (!q) return notes;
    return notes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.excerpt.toLowerCase().includes(q) ||
        n.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }, [notes, search]);

  const skeletonKeys = ["sk-a", "sk-b", "sk-c", "sk-d"];

  return (
    <div className="flex flex-col">
      {/* ── Animated Gradient Header ─────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-card border-b border-border">
        {/* Decorative orbs */}
        <div
          aria-hidden="true"
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-20 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, oklch(var(--primary)) 0%, transparent 70%)",
            animation: "orbPulse 6s ease-in-out infinite",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-16 right-0 w-72 h-72 rounded-full opacity-15 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, oklch(var(--accent)) 0%, transparent 70%)",
            animation: "orbPulse 8s ease-in-out infinite 2s",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[160px] opacity-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, oklch(var(--primary)), oklch(var(--accent)), oklch(var(--secondary)))",
            filter: "blur(56px)",
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge
              variant="outline"
              className="mb-5 border-primary/30 bg-primary/8 text-primary font-mono text-xs tracking-widest uppercase px-4 py-1"
            >
              Personal Notes
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="font-display text-5xl md:text-6xl font-bold text-foreground mb-4 leading-tight"
          >
            <span className="text-gradient">Thinking</span>{" "}
            <span>Out Loud</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-xl mx-auto mb-10"
          >
            Short-form observations, reading notes, and fragments of ongoing
            inquiry at the edge of cognitive science and design.
          </motion.p>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative max-w-md mx-auto"
          >
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search by title, tag, or keyword…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-ocid="notes-search-input"
              className="pl-10 pr-4 py-2.5 rounded-full border-border bg-background/70 focus-visible:ring-primary/40 text-sm"
            />
          </motion.div>

          {/* Count badge */}
          {!isLoading && notes && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="mt-4 text-xs text-muted-foreground font-mono"
            >
              {filtered.length} / {notes.length} notes
            </motion.p>
          )}
        </div>
      </section>

      {/* ── Note Grid ─────────────────────────────────────────────────────── */}
      <section className="bg-background py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading
              ? skeletonKeys.map((k) => <NoteCardSkeleton key={k} k={k} />)
              : filtered.length === 0 && search
                ? [<EmptyState key="empty" query={search} />]
                : filtered.map((note, i) => (
                    <NoteCard key={note.id} note={note} index={i} />
                  ))}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes orbPulse {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.12); opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
