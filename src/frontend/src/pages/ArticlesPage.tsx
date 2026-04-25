import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useArticles } from "@/hooks/use-backend";
import type { Article } from "@/types";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Download } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const COVER_GRADIENTS: Record<number, string> = {
  1: "from-primary via-secondary to-accent/60",
  2: "from-accent/80 via-primary/70 to-secondary/60",
  3: "from-chart-4/80 via-primary/60 to-secondary/50",
  4: "from-secondary/90 via-chart-5/60 to-primary/60",
};

function CoverArea({ article }: { article: Article }) {
  const gradient =
    COVER_GRADIENTS[article.id] ?? "from-primary via-secondary to-accent/60";
  return (
    <div
      className={`relative w-full h-48 bg-gradient-to-br ${gradient} overflow-hidden`}
    >
      <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-black/10 blur-3xl" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-display text-7xl font-bold text-white/15 select-none tracking-tight">
          {article.category.charAt(0)}
        </span>
      </div>
      {/* shimmer sweep */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
    </div>
  );
}

function ArticleCard({ article, index }: { article: Article; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.55,
        delay: index * 0.09,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="h-full"
      data-ocid="article-card"
    >
      <Link
        to="/articles/$id"
        params={{ id: String(article.id) }}
        className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl"
        data-ocid={`article-link-${article.id}`}
      >
        <div className="bg-card border border-border rounded-2xl overflow-hidden h-full card-hover card-elevated flex flex-col">
          <CoverArea article={article} />
          <div className="flex flex-col flex-1 p-6 gap-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <Badge variant="outline" className="text-xs font-medium">
                {article.category}
              </Badge>
              <span className="text-xs text-muted-foreground shrink-0">
                {article.publishDate}
              </span>
            </div>
            <h3 className="font-display text-lg font-semibold leading-snug text-card-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2">
              {article.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
              {article.excerpt}
            </p>
            <div className="flex items-center justify-between gap-2 mt-auto pt-1">
              <div className="flex items-center gap-1 text-primary text-sm font-medium">
                <span>Read article</span>
                <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform duration-200" />
              </div>
              {article.pdfUrl && (
                <a
                  href={article.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  data-ocid={`article.pdf_button.${article.id}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 transition-colors duration-200"
                  style={{
                    background: "rgba(212,175,55,0.15)",
                    color: "#d4af37",
                    border: "1px solid rgba(212,175,55,0.35)",
                  }}
                >
                  <Download className="h-3 w-3" />
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

function SkeletonCard() {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-6 space-y-3">
        <div className="flex gap-2 items-center justify-between">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-4 w-20 rounded-full" />
        </div>
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
}

export default function ArticlesPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const { data: articles, isLoading } = useArticles();

  const existingCategories = [
    "All",
    ...Array.from(new Set((articles ?? []).map((a) => a.category))),
  ];

  const filtered = (articles ?? []).filter(
    (a) => activeCategory === "All" || a.category === activeCategory,
  );

  return (
    <div className="min-h-screen">
      {/* ── Animated Gradient Header ──────────────────────────────────────── */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent/60" />
        {/* Floating orbs */}
        <motion.div
          className="absolute top-10 left-[12%] w-72 h-72 rounded-full bg-accent/25 blur-3xl pointer-events-none"
          animate={{ scale: [1, 1.25, 1], opacity: [0.35, 0.55, 0.35] }}
          transition={{
            duration: 7,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-[18%] w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none"
          animate={{ scale: [1.1, 0.88, 1.1], opacity: [0.25, 0.45, 0.25] }}
          transition={{
            duration: 9,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1.5,
          }}
        />
        <motion.div
          className="absolute top-6 right-[6%] w-48 h-48 rounded-full bg-primary-foreground/10 blur-2xl pointer-events-none"
          animate={{ y: [-12, 12, -12] }}
          transition={{
            duration: 5.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(oklch(1 0 0 / 0.15) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.15) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Content */}
        <div className="relative z-10 py-24 px-6 text-center">
          <motion.span
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block text-xs font-semibold tracking-[0.28em] uppercase text-white/70 mb-5 px-4 py-1.5 rounded-full border border-white/20 bg-white/5"
          >
            Writing & Ideas
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="font-display text-6xl md:text-8xl font-bold text-white leading-none mb-5 tracking-tight"
          >
            Articles
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.22 }}
            className="text-white/75 text-lg max-w-xl mx-auto leading-relaxed"
          >
            Research insights, review articles, and analytical studies in
            pharmacology and pharmaceutical sciences.
          </motion.p>
          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-10 flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{
                duration: 1.8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="w-5 h-8 rounded-full border-2 border-white/30 flex items-start justify-center pt-1.5"
            >
              <div className="w-1 h-1.5 rounded-full bg-white/50" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ── Sticky Category Filter ────────────────────────────────────────── */}
      <div className="sticky top-0 z-20 bg-background/90 backdrop-blur-md border-b border-border shadow-subtle">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="flex flex-wrap gap-2 items-center"
          >
            <span className="text-xs text-muted-foreground font-medium mr-1 hidden sm:inline">
              Filter:
            </span>
            {existingCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                data-ocid={`filter-${cat.toLowerCase().replace(/\s+/g, "-")}`}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-smooth cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-muted/60 text-muted-foreground border-border hover:bg-accent/10 hover:text-accent hover:border-accent/40"
                }`}
              >
                {cat}
              </button>
            ))}
            {!isLoading && (
              <span className="ml-auto text-xs text-muted-foreground">
                {filtered.length} article{filtered.length !== 1 ? "s" : ""}
              </span>
            )}
          </motion.div>
        </div>
      </div>

      {/* ── Article Grid ──────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {["sk-1", "sk-2", "sk-3", "sk-4", "sk-5", "sk-6"].map((k) => (
              <SkeletonCard key={k} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-28 text-center"
            data-ocid="empty-state"
          >
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4 text-3xl border border-border">
              ✍️
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              No articles in this category
            </h3>
            <p className="text-muted-foreground mb-6 text-sm">
              Try a different filter above.
            </p>
            <button
              type="button"
              onClick={() => setActiveCategory("All")}
              data-ocid="empty-state-cta"
              className="px-5 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-medium transition-smooth hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              View all articles
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((article, index) => (
              <ArticleCard key={article.id} article={article} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
