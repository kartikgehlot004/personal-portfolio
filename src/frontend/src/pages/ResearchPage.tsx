import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useResearchProjects } from "@/hooks/use-backend";
import type { ResearchProject } from "@/types";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Download, FlaskConical } from "lucide-react";
import { motion } from "motion/react";

// ─── Per-card gradient themes ─────────────────────────────────────────────────
const CARD_GRADIENTS = [
  {
    from: "oklch(0.22 0.08 265)",
    via: "oklch(0.30 0.14 285)",
    to: "oklch(0.18 0.06 300)",
  },
  {
    from: "oklch(0.20 0.06 225)",
    via: "oklch(0.28 0.10 245)",
    to: "oklch(0.16 0.08 260)",
  },
  {
    from: "oklch(0.32 0.10 310)",
    via: "oklch(0.24 0.14 285)",
    to: "oklch(0.18 0.08 265)",
  },
];

const TAG_VARIANTS = [
  "border-[oklch(0.55_0.18_265/0.5)] bg-[oklch(0.45_0.18_265/0.15)] text-[oklch(0.78_0.12_265)]",
  "border-[oklch(0.65_0.18_45/0.5)] bg-[oklch(0.68_0.18_45/0.15)] text-[oklch(0.82_0.14_45)]",
  "border-[oklch(0.55_0.10_190/0.5)] bg-[oklch(0.50_0.10_190/0.15)] text-[oklch(0.78_0.08_190)]",
];

function ResearchCard({
  project,
  index,
}: { project: ResearchProject; index: number }) {
  const g = CARD_GRADIENTS[index % CARD_GRADIENTS.length];
  const gradStyle = {
    background: `linear-gradient(145deg, ${g.from}, ${g.via}, ${g.to})`,
  };
  const seqNum = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      initial={{ opacity: 0, y: 44 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.55,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="h-full"
    >
      <Link
        to="/research/$id"
        params={{ id: String(project.id) }}
        data-ocid={`research.item.${index + 1}`}
        className="group flex flex-col rounded-2xl overflow-hidden border border-border card-elevated card-hover bg-card h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {/* ── Gradient thumbnail ─────────────────────────────────── */}
        <div
          className="relative h-52 overflow-hidden flex-shrink-0"
          style={gradStyle}
        >
          {/* Grid dots */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle, oklch(0.80 0.08 265 / 0.6) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          {/* Glassy orb */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full"
            style={{
              background:
                "radial-gradient(ellipse at 38% 32%, oklch(0.92 0.02 240 / 0.55), oklch(0.60 0.16 265 / 0.20) 55%, transparent 80%)",
              boxShadow:
                "inset 0 0 24px oklch(0.70 0.12 265 / 0.35), 0 6px 32px oklch(0.20 0.16 265 / 0.5)",
            }}
            animate={{
              scale: [1, 1.07, 1],
              rotate: [0, 10, 0],
            }}
            transition={{
              duration: 7,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: index * 1.1,
            }}
          />
          {/* Shimmer on hover */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          {/* Sequence badge — top-left */}
          <span
            className="absolute top-3 left-3 font-display text-xs font-bold px-2 py-0.5 rounded-full select-none tracking-widest"
            style={{
              background: "oklch(0.20 0.06 265 / 0.65)",
              color: "oklch(0.82 0.14 45)",
              border: "1px solid oklch(0.68 0.18 45 / 0.45)",
              backdropFilter: "blur(6px)",
            }}
          >
            {seqNum}
          </span>
          {/* Large decorative number — bottom-right */}
          <span className="absolute bottom-2 right-4 font-display text-6xl font-bold text-white/12 select-none leading-none">
            {seqNum}
          </span>
        </div>

        {/* ── Card body ──────────────────────────────────────────── */}
        <div className="flex flex-col flex-1 p-6 gap-3">
          <h2 className="font-display text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-200 leading-snug line-clamp-2">
            {project.title}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.tags.map((tag, ti) => (
              <Badge
                key={tag}
                variant="outline"
                className={`text-xs px-2 py-0.5 font-medium border ${TAG_VARIANTS[ti % TAG_VARIANTS.length]}`}
              >
                {tag}
              </Badge>
            ))}
          </div>

          {/* CTA row */}
          <div className="flex items-center justify-between gap-2 mt-1">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-3 transition-all duration-200">
              <span>View Project</span>
              <ArrowRight className="w-4 h-4" />
            </div>
            {project.pdfUrl && (
              <a
                href={project.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                data-ocid={`research.pdf_button.${project.id}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors duration-200 shrink-0"
                style={{
                  background: "rgba(212,175,55,0.15)",
                  color: "#d4af37",
                  border: "1px solid rgba(212,175,55,0.35)",
                }}
              >
                <Download className="w-3 h-3" />
                View / Download
              </a>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function CardSkeleton({ k }: { k: string }) {
  return (
    <div
      key={k}
      className="rounded-2xl overflow-hidden border border-border bg-card card-elevated"
    >
      <Skeleton className="h-52 w-full rounded-none" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default function ResearchPage() {
  const { data: projects, isLoading } = useResearchProjects();

  return (
    <div className="min-h-screen bg-background">
      {/* ── Animated Hero ─────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-24 md:py-36"
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
              "radial-gradient(circle, oklch(0.68 0.18 45 / 0.15) 0%, transparent 70%)",
          }}
        />

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          {/* Pill badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[oklch(0.55_0.14_265/0.5)] bg-[oklch(0.28_0.10_265/0.4)] text-[oklch(0.80_0.10_265)] text-sm font-semibold mb-8 backdrop-blur-sm"
          >
            <FlaskConical className="w-3.5 h-3.5" />
            Scholarly Research
          </motion.div>

          {/* H1 */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.65,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="font-display text-5xl md:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-6"
          >
            pharmacologist and researcher
          </motion.h1>

          {/* Animated accent line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.45, ease: "easeOut" }}
            className="mt-10 mx-auto h-0.5 w-28 rounded-full"
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
              "linear-gradient(to bottom, transparent, oklch(var(--background)))",
          }}
        />
      </section>

      {/* ── Project Grid ─────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mb-10 flex items-end justify-between gap-4"
        >
          <header>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="inline-block text-xs font-bold tracking-widest uppercase text-accent mb-2"
            >
              Active Projects
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.07 }}
              className="font-display text-3xl md:text-4xl font-bold leading-tight"
            >
              <span className="text-gradient">Research</span>{" "}
              <span className="text-foreground">Projects</span>
            </motion.h2>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="origin-left mt-3 h-1 w-16 rounded-full bg-gradient-to-r from-primary to-accent"
            />
          </header>
          {!isLoading && projects && (
            <span className="hidden sm:block text-sm text-muted-foreground font-medium pb-1">
              {projects.length} project{projects.length !== 1 ? "s" : ""}
            </span>
          )}
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {isLoading
            ? ["sk-r1", "sk-r2", "sk-r3"].map((k) => (
                <CardSkeleton key={k} k={k} />
              ))
            : projects?.map((proj, i) => (
                <ResearchCard key={proj.id} project={proj} index={i} />
              ))}
        </div>
      </section>
    </div>
  );
}
