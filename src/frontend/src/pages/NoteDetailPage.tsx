import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useNote } from "@/hooks/use-backend";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Download, StickyNote, Tag } from "lucide-react";
import { motion } from "motion/react";

// ─── Prose content renderer ────────────────────────────────────────────────────

function ProseContent({ content }: { content: string }) {
  // Split by paragraph breaks for nice markdown-style rendering
  const paragraphs = content
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="space-y-5">
      {paragraphs.map((para) => (
        <p
          key={para.slice(0, 48)}
          className="text-base leading-[1.85] text-foreground/85"
        >
          {para}
        </p>
      ))}
    </div>
  );
}

// ─── NoteDetailPage ───────────────────────────────────────────────────────────

export default function NoteDetailPage() {
  const { id } = useParams({ from: "/notes/$id" });
  const { data: note, isLoading } = useNote(Number(id));

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 space-y-6">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <div className="pt-6 space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center px-6">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
          <StickyNote className="h-9 w-9 text-muted-foreground" />
        </div>
        <h2 className="font-display text-3xl font-bold text-foreground mb-3">
          Note Not Found
        </h2>
        <p className="text-muted-foreground text-sm mb-6">
          This note may have been moved or doesn't exist.
        </p>
        <Link
          to="/notes"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          data-ocid="back-to-notes-404"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Notes
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-card border-b border-border">
        {/* Background accent */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-5"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(var(--primary)), transparent)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute bottom-0 right-0 w-64 h-64 pointer-events-none opacity-10"
          style={{
            background:
              "radial-gradient(circle at bottom right, oklch(var(--accent)), transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto px-6 py-14">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
          >
            <Link
              to="/notes"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors duration-200 mb-8"
              data-ocid="back-to-notes"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Notes
            </Link>
          </motion.div>

          {/* Date + meta */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="space-y-5"
          >
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Calendar className="h-4 w-4" />
              <time dateTime={note.publishDate}>{note.publishDate}</time>
            </div>

            {/* Title */}
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground leading-tight">
              {note.title}
            </h1>

            {/* Excerpt / deck */}
            <p className="text-base text-muted-foreground leading-relaxed italic border-l-2 border-accent pl-4">
              {note.excerpt}
            </p>

            {/* Tags */}
            {note.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {note.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="inline-flex items-center gap-1.5 border-primary/25 bg-primary/8 text-primary"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* PDF Download button */}
            {note.pdfUrl && (
              <div>
                <a
                  href={note.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid="note.detail.pdf_button"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-105"
                  style={{
                    background: "rgba(212,175,55,0.15)",
                    color: "#d4af37",
                    border: "1px solid rgba(212,175,55,0.4)",
                  }}
                >
                  <Download className="h-4 w-4" />
                  View / Download PDF
                </a>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <section className="bg-background py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.25 }}
            data-ocid="note-content"
          >
            {/* Decorative rule */}
            <div className="flex items-center gap-4 mb-10">
              <div className="h-px flex-1 bg-border" />
              <div className="w-2 h-2 rounded-full bg-accent" />
              <div className="h-px flex-1 bg-border" />
            </div>

            <ProseContent content={note.content} />

            {/* Footer divider + back */}
            <div className="mt-16 pt-8 border-t border-border flex items-center justify-between">
              <Link
                to="/notes"
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
                data-ocid="note-footer-back"
              >
                <ArrowLeft className="h-4 w-4" />
                All Notes
              </Link>
              <div className="flex flex-wrap gap-1.5">
                {note.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-muted-foreground font-mono"
                  >
                    #{tag.toLowerCase().replace(/\s+/g, "-")}
                  </span>
                ))}
              </div>
            </div>
          </motion.article>
        </div>
      </section>
    </div>
  );
}
