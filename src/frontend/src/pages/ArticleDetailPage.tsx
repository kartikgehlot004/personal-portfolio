import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useArticle, useArticles } from "@/hooks/use-backend";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, Calendar, Download, Tag } from "lucide-react";
import { motion } from "motion/react";

const COVER_GRADIENTS: Record<number, string> = {
  1: "from-primary via-secondary to-accent/60",
  2: "from-accent/80 via-primary/70 to-secondary/60",
  3: "from-chart-4/80 via-primary/60 to-secondary/50",
  4: "from-secondary/90 via-chart-5/60 to-primary/60",
};

function HeroCover({
  id,
  title,
  category,
}: { id: number; title: string; category: string }) {
  const gradient =
    COVER_GRADIENTS[id] ?? "from-primary via-secondary to-accent/60";
  return (
    <div
      className={`relative w-full h-72 md:h-96 bg-gradient-to-br ${gradient} overflow-hidden rounded-2xl`}
    >
      {/* Animated orbs */}
      <motion.div
        className="absolute -top-10 -left-10 w-56 h-56 rounded-full bg-white/10 blur-3xl"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute -bottom-12 right-[10%] w-64 h-64 rounded-full bg-black/10 blur-3xl"
        animate={{ scale: [1.1, 0.9, 1.1] }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      {/* Big category letter */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-display text-[180px] font-bold text-white/10 leading-none select-none pointer-events-none">
          {category.charAt(0)}
        </span>
      </div>
      {/* Grid lines */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(oklch(1 0 0 / 0.2) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.2) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* Centered title label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-8 text-center">
        <span className="text-xs font-semibold tracking-[0.25em] uppercase text-white/60 bg-white/5 border border-white/15 px-3 py-1 rounded-full">
          {category}
        </span>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-white/90 leading-snug max-w-xl drop-shadow-lg">
          {title}
        </h2>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20 space-y-6">
      <Skeleton className="h-6 w-28" />
      <Skeleton className="h-12 w-3/4" />
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-80 w-full rounded-2xl" />
      <div className="space-y-3 pt-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  );
}

export default function ArticleDetailPage() {
  const { id } = useParams({ from: "/articles/$id" });
  const { data: article, isLoading } = useArticle(Number(id));
  const { data: allArticles } = useArticles();

  if (isLoading) return <LoadingState />;

  if (!article) {
    return (
      <div className="container py-32 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto border border-border">
          <BookOpen className="h-7 w-7 text-muted-foreground" />
        </div>
        <h2 className="font-display text-2xl font-bold text-foreground">
          Article Not Found
        </h2>
        <p className="text-muted-foreground text-sm">
          The article you're looking for doesn't exist.
        </p>
        <Link
          to="/articles"
          className="inline-flex items-center gap-1.5 text-primary text-sm font-medium hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Articles
        </Link>
      </div>
    );
  }

  const related = (allArticles ?? [])
    .filter((a) => a.id !== article.id && a.category === article.category)
    .slice(0, 2);

  return (
    <div className="min-h-screen">
      {/* ── Page Header Banner ──────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-foreground/5 via-primary/5 to-accent/5 border-b border-border py-10">
        <div className="max-w-3xl mx-auto px-6">
          <Link
            to="/articles"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            data-ocid="back-to-articles"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Articles
          </Link>
        </div>
      </div>

      {/* ── Hero Area ───────────────────────────────────────────────────── */}
      <div className="bg-background pt-12 pb-0">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-5 mb-10"
          >
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3">
              <Badge
                variant="outline"
                className="flex items-center gap-1.5 text-xs"
              >
                <Tag className="h-3 w-3" />
                {article.category}
              </Badge>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{article.publishDate}</span>
              </div>
            </div>
            {/* Title */}
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground leading-tight tracking-tight">
              {article.title}
            </h1>
            {/* Excerpt */}
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed italic border-l-4 border-primary/40 pl-4">
              {article.excerpt}
            </p>

            {/* PDF Download button */}
            {article.pdfUrl && (
              <div>
                <a
                  href={article.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid="article.detail.pdf_button"
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

          {/* Hero image / gradient cover */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.15 }}
          >
            <HeroCover
              id={article.id}
              title={article.title}
              category={article.category}
            />
          </motion.div>
        </div>
      </div>

      {/* ── Article Content ─────────────────────────────────────────────── */}
      <div className="bg-background py-14">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Drop cap / styled lead paragraph */}
            <div className="prose-article">
              <p className="text-foreground/90 text-lg leading-[1.85] first-letter:text-5xl first-letter:font-display first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:leading-none first-letter:text-primary">
                {article.content}
              </p>
            </div>

            {/* Divider */}
            <div className="my-12 flex items-center gap-4">
              <div className="flex-1 h-px bg-border" />
              <div className="w-2 h-2 rounded-full bg-accent" />
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Author / cite callout */}
            <div className="bg-muted/50 border border-border rounded-xl px-6 py-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                <span className="text-primary-foreground text-sm font-bold font-display">
                  ASC
                </span>
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-foreground text-sm">
                  Ashwin Singh Chouhan
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Assistant Professor · JNVU, Jodhpur, Rajasthan · Published{" "}
                  {article.publishDate}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Related Articles ────────────────────────────────────────────── */}
      {related.length > 0 && (
        <div className="bg-muted/30 border-t border-border py-14">
          <div className="max-w-3xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                Related Articles
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {related.map((rel, i) => {
                  const gradient =
                    COVER_GRADIENTS[rel.id] ??
                    "from-primary via-secondary to-accent/60";
                  return (
                    <motion.div
                      key={rel.id}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Link
                        to="/articles/$id"
                        params={{ id: String(rel.id) }}
                        className="group flex gap-4 bg-card border border-border rounded-xl p-4 card-hover card-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        data-ocid={`related-article-${rel.id}`}
                      >
                        <div
                          className={`w-16 h-16 rounded-lg bg-gradient-to-br ${gradient} flex-shrink-0 overflow-hidden`}
                        />
                        <div className="min-w-0 flex flex-col gap-1">
                          <Badge variant="outline" className="text-xs w-fit">
                            {rel.category}
                          </Badge>
                          <p className="text-sm font-semibold text-card-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2 leading-snug">
                            {rel.title}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {rel.publishDate}
                          </span>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-8 text-center">
                <Link
                  to="/articles"
                  className="inline-flex items-center gap-2 text-primary text-sm font-medium hover:underline focus-visible:outline-none"
                  data-ocid="all-articles-link"
                >
                  <ArrowLeft className="h-4 w-4" />
                  View all articles
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}
