import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { usePublications } from "@/hooks/use-backend";
import type { Publication } from "@/types";
import {
  BookOpen,
  Download,
  ExternalLink,
  FileText,
  Filter,
  ScrollText,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";

// ─── Badge color map ──────────────────────────────────────────────────────────
const TYPE_STYLES: Record<string, string> = {
  "Conference Paper": "bg-primary/10 text-primary border-primary/20",
  "Journal Article": "bg-accent/10 text-accent border-accent/20",
  "Workshop Paper":
    "bg-[oklch(0.62_0.14_190/0.12)] text-[oklch(0.42_0.14_190)] border-[oklch(0.62_0.14_190/0.25)]",
  "Book Chapter":
    "bg-[oklch(0.55_0.12_130/0.12)] text-[oklch(0.38_0.12_130)] border-[oklch(0.55_0.12_130/0.25)]",
  Preprint:
    "bg-[oklch(0.72_0.1_300/0.12)] text-[oklch(0.48_0.1_300)] border-[oklch(0.72_0.1_300/0.25)]",
  Other: "bg-muted text-muted-foreground border-border",
};

function getTypeStyle(pubType: string): string {
  return TYPE_STYLES[pubType] ?? TYPE_STYLES.Other;
}

// ─── Publication row ──────────────────────────────────────────────────────────
function PublicationRow({
  pub,
  index,
}: {
  pub: Publication;
  index: number;
}) {
  const hasPdf = pub.link !== "#" && pub.link.endsWith(".pdf");
  const hasLink = Boolean(pub.link && pub.link !== "#");

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, delay: index * 0.07, ease: "easeOut" }}
      data-ocid={`pub-item-${pub.id}`}
      className="group relative flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 px-5 py-5 rounded-xl border border-transparent bg-card hover:border-border hover:shadow-subtle transition-smooth"
    >
      {/* Left accent stripe */}
      <span className="hidden sm:block absolute left-0 top-4 bottom-4 w-0.5 rounded-full bg-primary/20 group-hover:bg-primary/60 transition-smooth" />

      {/* Content */}
      <div className="flex-1 min-w-0 sm:pl-3">
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          <Badge
            variant="outline"
            className={`text-xs font-medium px-2 py-0.5 ${getTypeStyle(pub.pubType)}`}
            data-ocid="pub-type-badge"
          >
            {pub.pubType}
          </Badge>
        </div>

        <h3 className="font-display text-base sm:text-lg font-semibold text-foreground leading-snug mb-1.5 group-hover:text-primary transition-smooth">
          {pub.title}
        </h3>

        <p className="text-sm text-muted-foreground mb-1">
          {pub.authors.join(", ")}
        </p>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <BookOpen className="w-3.5 h-3.5 shrink-0" />
            <span className="italic">{pub.venue}</span>
          </span>
          <span className="text-border hidden sm:inline">·</span>
          <span className="text-muted-foreground font-medium">{pub.year}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0 self-start sm:self-center mt-1 sm:mt-0">
        {pub.pdfUrl && (
          <a
            href={pub.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View / Download PDF"
            data-ocid={`pub.pdf_button.${pub.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 hover:scale-105"
            style={{
              background: "rgba(212,175,55,0.15)",
              color: "#d4af37",
              border: "1px solid rgba(212,175,55,0.35)",
            }}
          >
            <Download className="w-3.5 h-3.5" />
            View / Download
          </a>
        )}
        {hasPdf && !pub.pdfUrl && (
          <a
            href={pub.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Download PDF"
            data-ocid="pub-pdf-link"
            className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-smooth"
          >
            <FileText className="w-4 h-4" />
          </a>
        )}
        {hasLink && !hasPdf && !pub.pdfUrl && (
          <a
            href={pub.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open publication link"
            data-ocid="pub-external-link"
            className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-smooth"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </motion.div>
  );
}

// ─── Year group ───────────────────────────────────────────────────────────────
function YearGroup({
  year,
  pubs,
  globalOffset,
}: {
  year: number;
  pubs: Publication[];
  globalOffset: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: globalOffset * 0.05 }}
      className="mb-10"
    >
      {/* Year divider */}
      <div className="flex items-center gap-4 mb-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
        <span
          className="font-display text-3xl font-bold text-gradient select-none"
          data-ocid="year-divider"
        >
          {year}
        </span>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent via-border to-transparent" />
      </div>

      <div className="space-y-2">
        {pubs.map((pub, i) => (
          <PublicationRow key={pub.id} pub={pub} index={globalOffset + i} />
        ))}
      </div>
    </motion.div>
  );
}

// ─── Skeleton loader ──────────────────────────────────────────────────────────
function PublicationsSkeleton() {
  return (
    <div className="space-y-10">
      {[2023, 2022].map((year) => (
        <div key={year} className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px flex-1 bg-border" />
            <Skeleton className="w-16 h-8 rounded" />
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="space-y-2">
            {[1, 2].map((n) => (
              <div
                key={n}
                className="px-5 py-5 rounded-xl border border-border bg-card"
              >
                <Skeleton className="w-20 h-5 rounded mb-2" />
                <Skeleton className="w-3/4 h-6 rounded mb-2" />
                <Skeleton className="w-1/2 h-4 rounded mb-2" />
                <Skeleton className="w-40 h-4 rounded" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── All publication types for filter ────────────────────────────────────────
const ALL_TYPES = [
  "All",
  "Conference Paper",
  "Journal Article",
  "Workshop Paper",
  "Book Chapter",
  "Preprint",
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PublicationsPage() {
  const { data: publications, isLoading } = usePublications();
  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const availableYears = useMemo(() => {
    if (!publications) return [];
    return Array.from(new Set(publications.map((p) => p.year))).sort(
      (a, b) => b - a,
    );
  }, [publications]);

  const filtered = useMemo(() => {
    if (!publications) return [];
    return publications.filter((p) => {
      const typeMatch = selectedType === "All" || p.pubType === selectedType;
      const yearMatch = selectedYear === null || p.year === selectedYear;
      return typeMatch && yearMatch;
    });
  }, [publications, selectedType, selectedYear]);

  const grouped = useMemo(() => {
    const map = new Map<number, Publication[]>();
    for (const pub of filtered) {
      const arr = map.get(pub.year) ?? [];
      arr.push(pub);
      map.set(pub.year, arr);
    }
    return Array.from(map.entries()).sort(([a], [b]) => b - a);
  }, [filtered]);

  const totalCount = filtered.length;

  // Compute global index offsets for stagger
  const groupOffsets: number[] = [];
  let offset = 0;
  for (const [, pubs] of grouped) {
    groupOffsets.push(offset);
    offset += pubs.length;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ── Animated gradient header ─────────────────────────────────────── */}
      <header
        className="relative overflow-hidden py-24 sm:py-36"
        style={{
          background:
            "linear-gradient(160deg, oklch(0.15 0.05 265) 0%, oklch(0.12 0.08 285) 50%, oklch(0.18 0.04 240) 100%)",
        }}
      >
        {/* Fine grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.75 0.10 265) 1px, transparent 1px), linear-gradient(90deg, oklch(0.75 0.10 265) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Ambient glow top-center */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[360px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, oklch(0.50 0.18 265 / 0.35) 0%, transparent 70%)",
          }}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        {/* Accent glow bottom-right */}
        <div
          className="absolute bottom-0 right-1/4 w-64 h-64 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, oklch(0.68 0.18 45 / 0.18) 0%, transparent 70%)",
          }}
        />

        {/* Decorative orbs with pulse animation */}
        <motion.div
          className="absolute -top-16 -right-16 w-72 h-72 rounded-full blur-3xl pointer-events-none"
          style={{ background: "oklch(0.68 0.18 45 / 0.30)" }}
          animate={{ scale: [1, 1.12, 1], opacity: [0.3, 0.42, 0.3] }}
          transition={{
            duration: 7,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 0,
          }}
        />
        <motion.div
          className="absolute -bottom-12 -left-12 w-56 h-56 rounded-full blur-3xl pointer-events-none"
          style={{ background: "oklch(0.72 0.16 265 / 0.25)" }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.25, 0.35, 0.25] }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        {/* Floating particles — golden accent dots */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${10 + i * 11}%`,
              top: `${18 + (i % 3) * 26}%`,
              background:
                i % 2 === 0
                  ? "oklch(0.68 0.18 45 / 0.7)"
                  : "oklch(0.65 0.14 265 / 0.6)",
            }}
            animate={{ y: [0, -12, 0], opacity: [0.3, 0.85, 0.3] }}
            transition={{
              duration: 2.5 + i * 0.4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        ))}

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          {/* Pill badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[oklch(0.68_0.18_45/0.5)] bg-[oklch(0.68_0.18_45/0.15)] text-[oklch(0.82_0.14_45)] text-sm font-semibold mb-8 backdrop-blur-sm"
          >
            <ScrollText className="w-3.5 h-3.5" />
            Academic Publications
          </motion.div>

          {/* Main title — gradient text */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.65,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="font-display text-6xl sm:text-7xl font-bold mb-6 tracking-tight leading-[1.05]"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.72 0.14 265) 0%, oklch(0.80 0.18 45) 55%, oklch(0.70 0.16 285) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 24px oklch(0.68 0.18 45 / 0.45))",
            }}
          >
            PUBLICATIONS
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.22, ease: "easeOut" }}
            className="text-lg max-w-xl mx-auto"
            style={{ color: "oklch(0.88 0.04 265)" }}
          >
            Peer-reviewed papers, conference proceedings, and scholarly
            contributions in pharmaceutical sciences and pharmacology.
          </motion.p>

          {/* Animated accent line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.45, ease: "easeOut" }}
            className="mt-8 mx-auto h-1 w-28 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, oklch(0.60 0.18 265), oklch(0.70 0.18 45))",
            }}
          />
        </div>

        {/* Fade to page background */}
        <div
          className="absolute bottom-0 inset-x-0 h-20 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, transparent, oklch(0.98 0.01 240))",
          }}
        />
      </header>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* ── Filters ──────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mb-10"
        >
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Filter className="w-4 h-4" />
              <span>Filter publications</span>
            </div>
            {!isLoading && (
              <span
                className="text-sm text-muted-foreground"
                data-ocid="pub-count"
              >
                {totalCount} publication{totalCount !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Type filter */}
          <fieldset
            className="flex flex-wrap gap-2 mb-3 border-0 p-0 m-0"
            data-ocid="type-filter"
            aria-label="Filter by publication type"
          >
            {ALL_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                aria-pressed={selectedType === type}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  selectedType === type
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                }`}
                data-ocid={`type-filter-${type.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {type}
              </button>
            ))}
          </fieldset>

          {/* Year filter */}
          <fieldset
            className="flex flex-wrap gap-2 border-0 p-0 m-0"
            data-ocid="year-filter"
            aria-label="Filter by year"
          >
            <button
              type="button"
              onClick={() => setSelectedYear(null)}
              aria-pressed={selectedYear === null}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                selectedYear === null
                  ? "bg-accent text-accent-foreground border-accent shadow-sm"
                  : "bg-card text-muted-foreground border-border hover:border-accent/40 hover:text-foreground"
              }`}
              data-ocid="year-filter-all"
            >
              All Years
            </button>
            {availableYears.map((year) => (
              <button
                key={year}
                type="button"
                onClick={() =>
                  setSelectedYear(selectedYear === year ? null : year)
                }
                aria-pressed={selectedYear === year}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  selectedYear === year
                    ? "bg-accent text-accent-foreground border-accent shadow-sm"
                    : "bg-card text-muted-foreground border-border hover:border-accent/40 hover:text-foreground"
                }`}
                data-ocid={`year-filter-${year}`}
              >
                {year}
              </button>
            ))}
          </fieldset>
        </motion.div>

        {/* ── Publication list ─────────────────────────────────────────── */}
        {isLoading ? (
          <PublicationsSkeleton />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedType}-${selectedYear ?? "all"}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {grouped.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-24 text-center"
                  data-ocid="empty-state"
                >
                  <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                    <BookOpen className="w-7 h-7 text-muted-foreground" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    No publications found
                  </h3>
                  <p className="text-muted-foreground text-sm max-w-xs mb-4">
                    Try adjusting the filters to see more results.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedType("All");
                      setSelectedYear(null);
                    }}
                    className="text-sm text-primary hover:underline transition-smooth"
                    data-ocid="clear-filters"
                  >
                    Clear all filters
                  </button>
                </motion.div>
              ) : (
                grouped.map(([year, pubs], gi) => (
                  <YearGroup
                    key={year}
                    year={year}
                    pubs={pubs}
                    globalOffset={groupOffsets[gi]}
                  />
                ))
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}
