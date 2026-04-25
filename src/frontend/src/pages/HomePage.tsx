import {
  useArticles,
  useNotes,
  useProfile,
  usePublications,
  useResearchProjects,
} from "@/hooks/use-backend";
import type { Article, Note, Publication, ResearchProject } from "@/types";
import { Link } from "@tanstack/react-router";
import { motion, useInView, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef } from "react";

// ─── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedCounter({
  target,
  suffix = "",
}: {
  target: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { damping: 30, stiffness: 80 });

  useEffect(() => {
    if (inView) motionVal.set(target);
  }, [inView, target, motionVal]);

  useEffect(() => {
    return spring.on("change", (v) => {
      if (ref.current) ref.current.textContent = Math.round(v) + suffix;
    });
  }, [spring, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

// ─── Hero Orb ─────────────────────────────────────────────────────────────────
function HeroOrb() {
  return (
    <motion.div
      className="absolute top-[-60px] left-1/2 -translate-x-1/2 pointer-events-none"
      animate={{ y: [0, -18, 0] }}
      transition={{
        duration: 5,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
    >
      <div className="relative w-56 h-56">
        <div className="absolute inset-0 rounded-full gradient-primary opacity-80 blur-sm" />
        <div className="absolute inset-3 rounded-full bg-primary/30 backdrop-blur-sm" />
        <motion.div
          className="absolute -inset-4 rounded-full border border-primary/20"
          animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.15, 0.4] }}
          transition={{
            duration: 3.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -inset-10 rounded-full border border-primary/10"
          animate={{ scale: [1, 1.12, 1], opacity: [0.2, 0.05, 0.2] }}
          transition={{
            duration: 4.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
        <div className="absolute top-6 left-8 w-10 h-6 bg-white/20 rounded-full blur-md rotate-[-20deg]" />
        <div className="absolute inset-3 rounded-full bg-gradient-to-br from-primary/10 to-transparent" />
      </div>
    </motion.div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({
  label,
  title,
  subtitle,
}: {
  label: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-10">
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="inline-block text-xs font-bold tracking-widest uppercase text-accent mb-2"
      >
        {label}
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.07 }}
        className="font-display text-4xl md:text-5xl text-foreground"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.14 }}
          className="text-muted-foreground mt-3 max-w-xl"
        >
          {subtitle}
        </motion.p>
      )}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="origin-left mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-primary to-accent"
      />
    </div>
  );
}

// ─── Feature Preview Card ──────────────────────────────────────────────────────
interface FeatureCardProps {
  icon: string;
  gradient: string;
  label: string;
  title: string;
  description: string;
  link: string;
  delay: number;
}

function FeatureCard({
  icon,
  gradient,
  label,
  title,
  description,
  link,
  delay,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className="card-elevated card-hover bg-card border border-border rounded-2xl p-6 flex flex-col gap-4 group"
      data-ocid={`feature-card-${label.toLowerCase()}`}
    >
      <div
        className={`w-12 h-12 rounded-xl ${gradient} flex items-center justify-center text-2xl shadow-md`}
      >
        {icon}
      </div>
      <div>
        <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
          {label}
        </span>
        <h3 className="font-display text-xl mt-1 text-foreground group-hover:text-primary transition-colors duration-200">
          {title}
        </h3>
      </div>
      <p className="text-muted-foreground text-sm leading-relaxed flex-1">
        {description}
      </p>
      <Link
        to={link as "/research" | "/articles" | "/notes"}
        className="inline-flex items-center gap-2 text-primary text-sm font-semibold hover:gap-3 transition-all duration-200"
        data-ocid={`feature-link-${label.toLowerCase()}`}
      >
        Explore {label} <span className="text-accent">→</span>
      </Link>
    </motion.div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  value,
  suffix,
  label,
  delay,
}: {
  value: number;
  suffix: string;
  label: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className="flex flex-col items-center gap-1 p-6 rounded-2xl bg-card/80 border border-border card-elevated"
      data-ocid={`stat-card-${label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <span className="font-display text-5xl font-bold text-gradient leading-none">
        <AnimatedCounter target={value} suffix={suffix} />
      </span>
      <span className="text-muted-foreground text-sm font-medium text-center">
        {label}
      </span>
    </motion.div>
  );
}

// ─── Research Card ────────────────────────────────────────────────────────────
function ResearchCard({
  project,
  index,
}: {
  project: ResearchProject;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -24 : 24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: index * 0.12, ease: "easeOut" }}
      className="card-elevated card-hover bg-card border border-border rounded-2xl overflow-hidden group"
      data-ocid={`research-card-${project.id}`}
    >
      <div className="h-40 gradient-primary opacity-80 relative flex items-end p-4">
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
        <div className="relative z-10 flex flex-wrap gap-1">
          {project.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-primary-foreground/20 text-primary-foreground font-medium backdrop-blur-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="p-5">
        <h4 className="font-display text-lg text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2">
          {project.title}
        </h4>
        <p className="text-muted-foreground text-sm mt-2 line-clamp-3 leading-relaxed">
          {project.description}
        </p>
        <Link
          to="/research/$id"
          params={{ id: String(project.id) }}
          className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-accent hover:text-primary transition-colors duration-200"
        >
          Read more →
        </Link>
      </div>
    </motion.div>
  );
}

// ─── Article Card ─────────────────────────────────────────────────────────────
function ArticleCard({
  article,
  index,
}: {
  article: Article;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      className="card-elevated card-hover bg-card border border-border rounded-2xl p-5 group"
      data-ocid={`article-card-${article.id}`}
    >
      <span className="text-xs font-semibold text-accent uppercase tracking-widest">
        {article.category}
      </span>
      <h4 className="font-display text-base mt-1.5 text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2">
        {article.title}
      </h4>
      <p className="text-xs text-muted-foreground mt-1">
        {article.publishDate}
      </p>
      <Link
        to="/articles/$id"
        params={{ id: String(article.id) }}
        className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-accent transition-colors duration-200"
      >
        Read →
      </Link>
    </motion.div>
  );
}

// ─── Note Card ────────────────────────────────────────────────────────────────
function NoteCard({ note, index }: { note: Note; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      className="card-elevated card-hover bg-card border border-border rounded-2xl p-5 group"
      data-ocid={`note-card-${note.id}`}
    >
      <div className="flex flex-wrap gap-1 mb-2">
        {note.tags.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>
      <h4 className="font-display text-base text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2">
        {note.title}
      </h4>
      <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
        {note.excerpt}
      </p>
      <Link
        to="/notes/$id"
        params={{ id: String(note.id) }}
        className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-accent transition-colors duration-200"
      >
        Read →
      </Link>
    </motion.div>
  );
}

// ─── Publication Row ──────────────────────────────────────────────────────────
function PublicationRow({
  pub,
  index,
}: {
  pub: Publication;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: "easeOut" }}
      className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 py-4 border-b border-border last:border-0 group"
      data-ocid={`pub-row-${pub.id}`}
    >
      <span className="shrink-0 text-xs font-bold text-accent bg-accent/10 px-2 py-1 rounded-md self-start">
        {pub.year}
      </span>
      <div className="flex-1 min-w-0">
        <span className="font-medium text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-1 text-sm">
          {pub.title}
        </span>
        <p className="text-xs text-muted-foreground mt-0.5">
          {pub.authors.join(", ")} — <em>{pub.venue}</em>
        </p>
      </div>
      <span className="shrink-0 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary self-start">
        {pub.pubType}
      </span>
    </motion.div>
  );
}

// ─── Floating Particle dots for hero ──────────────────────────────────────────
const PARTICLES = [
  { id: "p1", x: "10%", y: "20%", size: 6, delay: 0 },
  { id: "p2", x: "85%", y: "15%", size: 4, delay: 0.8 },
  { id: "p3", x: "75%", y: "60%", size: 8, delay: 1.5 },
  { id: "p4", x: "15%", y: "70%", size: 5, delay: 0.4 },
  { id: "p5", x: "50%", y: "85%", size: 4, delay: 1.2 },
  { id: "p6", x: "92%", y: "45%", size: 6, delay: 0.7 },
];

const FEATURE_CARDS: FeatureCardProps[] = [
  {
    icon: "🔬",
    gradient: "bg-gradient-to-br from-primary/80 to-primary/40",
    label: "Research",
    title: "Cognitive & AI Systems",
    description:
      "Empirical studies on human trust, cognitive load, and the design of intelligent interfaces.",
    link: "/research",
    delay: 0.1,
  },
  {
    icon: "✍️",
    gradient: "bg-gradient-to-br from-accent/80 to-accent/40",
    label: "Articles",
    title: "Thought Leadership",
    description:
      "Long-form writing on AI design, explainability, and the future of human-computer interaction.",
    link: "/articles",
    delay: 0.2,
  },
  {
    icon: "📝",
    gradient: "bg-gradient-to-br from-secondary/80 to-secondary/40",
    label: "Notes",
    title: "Working Thoughts",
    description:
      "Raw observations, reading notes, and half-formed ideas from the frontiers of research.",
    link: "/notes",
    delay: 0.3,
  },
];

// ─── HomePage ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  const { data: research = [] } = useResearchProjects();
  const { data: articles = [] } = useArticles();
  const { data: publications = [] } = usePublications();
  const { data: notes = [] } = useNotes();
  const { data: profile } = useProfile();

  // Stats from backend profile; fall back to empty array while loading
  const stats = profile?.stats ?? [];

  return (
    <div className="flex flex-col">
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section
        className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden"
        data-ocid="hero-section"
      >
        {/* Dark gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.13_0.025_265)] via-[oklch(0.17_0.04_265)] to-[oklch(0.22_0.03_240)]" />

        {/* Animated mesh blobs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/20 blur-3xl"
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/15 blur-3xl"
          animate={{ x: [0, -25, 0], y: [0, 15, 0] }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        {/* Floating particles */}
        {PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-primary/30"
            style={{ left: p.x, top: p.y, width: p.size, height: p.size }}
            animate={{ y: [0, -12, 0], opacity: [0.3, 0.8, 0.3] }}
            transition={{
              duration: 3 + p.delay,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: p.delay,
            }}
          />
        ))}

        {/* Orb */}
        <div className="relative z-10 mt-8">
          <HeroOrb />
        </div>

        {/* Text content */}
        <div className="relative z-10 mt-28 max-w-4xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xs font-bold tracking-[0.25em] uppercase text-accent/80 mb-4"
          >
            Ashwin Singh Chouhan
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.35 }}
            className="font-display text-5xl md:text-7xl lg:text-8xl text-white leading-[1.05] tracking-tight"
          >
            ASHWIN SINGH CHOUHAN
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.75 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
          >
            <Link
              to="/research"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-accent text-white font-semibold text-sm hover:bg-accent/90 hover:scale-105 transition-all duration-200 shadow-lg shadow-accent/30"
              data-ocid="hero-cta-research"
            >
              View Research →
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/25 text-white/90 font-semibold text-sm hover:bg-white/10 hover:scale-105 transition-all duration-200"
              data-ocid="hero-cta-about"
            >
              About Me
            </Link>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="mt-14 flex flex-col items-center gap-2"
          >
            <span className="text-white/30 text-xs tracking-widest uppercase">
              Scroll
            </span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="w-[1px] h-8 bg-gradient-to-b from-white/40 to-transparent"
            />
          </motion.div>
        </div>
      </section>

      {/* ── FEATURED SECTIONS ──────────────────────────────────────────────── */}
      <section
        className="bg-background py-24 px-4"
        data-ocid="featured-section"
      >
        <div className="max-w-6xl mx-auto">
          <SectionHeader label="Explore" title="Areas of Work" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURE_CARDS.map((card) => (
              <FeatureCard key={card.label} {...card} />
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────────────── */}
      <section
        className="bg-muted/40 py-20 px-4 relative overflow-hidden"
        data-ocid="stats-section"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        <div className="max-w-5xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="text-xs font-bold tracking-widest uppercase text-accent">
              By the Numbers
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-foreground mt-2">
              Impact at a Glance
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <StatCard
                key={`stat-${i}-${s.label}`}
                value={Number(s.value)}
                suffix=""
                label={s.label}
                delay={i * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── RESEARCH PREVIEW ──────────────────────────────────────────────── */}
      <section
        className="bg-background py-24 px-4"
        data-ocid="research-preview-section"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-2">
            <SectionHeader label="Featured" title="Research" />
            <Link
              to="/research"
              className="text-sm font-semibold text-primary hover:text-accent transition-colors duration-200 mb-6"
              data-ocid="all-research-link"
            >
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {research.slice(0, 4).map((project, i) => (
              <ResearchCard key={project.id} project={project} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── ARTICLES & NOTES ──────────────────────────────────────────────── */}
      <section
        className="bg-muted/30 py-24 px-4"
        data-ocid="articles-notes-section"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Articles */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <SectionHeader label="Writing" title="Articles" />
                <Link
                  to="/articles"
                  className="text-sm font-semibold text-primary hover:text-accent transition-colors duration-200 -mt-6"
                  data-ocid="all-articles-link"
                >
                  View all →
                </Link>
              </div>
              <div className="flex flex-col gap-4">
                {articles.slice(0, 3).map((article, i) => (
                  <ArticleCard key={article.id} article={article} index={i} />
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <SectionHeader label="Thinking" title="Latest Notes" />
                <Link
                  to="/notes"
                  className="text-sm font-semibold text-primary hover:text-accent transition-colors duration-200 -mt-6"
                  data-ocid="all-notes-link"
                >
                  View all →
                </Link>
              </div>
              <div className="flex flex-col gap-4">
                {notes.slice(0, 3).map((note, i) => (
                  <NoteCard key={note.id} note={note} index={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PUBLICATIONS STRIP ────────────────────────────────────────────── */}
      <section
        className="bg-card py-24 px-4 border-t border-border"
        data-ocid="publications-section"
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-2">
            <SectionHeader
              label="Scholarly Work"
              title="Publications"
              subtitle="Peer-reviewed conference papers, journal articles, and workshop contributions."
            />
            <Link
              to="/publications"
              className="text-sm font-semibold text-primary hover:text-accent transition-colors duration-200 mb-6"
              data-ocid="all-publications-link"
            >
              Full list →
            </Link>
          </div>
          <div className="rounded-2xl bg-background/50 border border-border overflow-hidden">
            {publications.slice(0, 5).map((pub, i) => (
              <div key={pub.id} className="px-4">
                <PublicationRow pub={pub} index={i} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────────────────────── */}
      <section className="bg-muted/20 py-20 px-4" data-ocid="cta-section">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl overflow-hidden p-12 gradient-primary shadow-xl"
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5 blur-2xl" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-accent/20 blur-2xl" />
            <div className="relative z-10">
              <h2 className="font-display text-4xl text-primary-foreground mb-4">
                Let's Connect
              </h2>
              <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
                Interested in research collaboration, speaking engagements, or
                just a conversation about cognitive AI?
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-primary font-bold text-sm hover:scale-105 transition-transform duration-200 shadow-lg"
                data-ocid="cta-contact-link"
              >
                Get in Touch →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
