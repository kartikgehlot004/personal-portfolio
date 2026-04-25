import { Badge } from "@/components/ui/badge";
import { useProfile } from "@/hooks/use-backend";
import type { Milestone } from "@/types/index";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

// ─── Static content ────────────────────────────────────────────────────────────
const skills: string[] = [
  "Neuropharmacology",
  "Phytochemistry",
  "CNS Drug Discovery",
  "Pharmacognosy",
  "Ethnopharmacology",
  "HPLC Analysis",
  "Bioactive Compounds",
  "Anticonvulsant Activity",
  "Neuroprotection",
  "Medicinal Plants",
  "Chromatography",
  "Drug Profiling",
];

const bioParas: string[] = [
  "Dr. Ashwin Singh Chouhan is an accomplished academician and researcher in the field of pharmaceutical sciences, currently serving as an Assistant Professor in the Department of Pharmacy at Jai Narain Vyas University (JNVU), Jodhpur, Rajasthan, India. He is also complete his Ph.D. in Pharmacology from B. N. University, Udaipur, with a strong research focus on neuropharmacology and bio-guided fractionation of medicinal plants.",
  "With a robust academic and research background, Dr. Chouhan has authored over 75 national and international research and review articles, contributing significantly to the fields of phytochemistry, ethnopharmacology, and CNS-related pharmacological studies. His research work primarily explores the therapeutic potential of plant-based compounds, particularly within the Cucurbitaceae family, emphasizing their neuroprotective, anticonvulsant, and anxiolytic activities.",
  "Dr. Chouhan has extensive experience in advanced chromatographic techniques, including HPLC, TLC, column chromatography, and liquid-liquid extraction, alongside in vivo behavioral models such as elevated zero maze, actophotometer, and PTZ-induced seizure models. His interdisciplinary approach bridges traditional medicinal knowledge with modern pharmacological evaluation.",
  "Recognized for his academic excellence, he received the Best Research Paper Award at the ICTASEMP Conference in 2021. He is actively engaged in mentoring students, reviewing scientific manuscripts, and contributing to high-impact journals, reflecting his commitment to advancing pharmaceutical research and education.",
];

// ─── Decorative blobs ─────────────────────────────────────────────────────────
function DecorativeBlobs() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <div
        className="absolute -left-32 -top-32 h-96 w-96 rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.72 0.16 265 / 0.55) 0%, transparent 70%)",
          filter: "blur(56px)",
          opacity: 0.25,
        }}
      />
      <div
        className="absolute -right-20 top-12 h-80 w-80 rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.74 0.16 45 / 0.65) 0%, transparent 70%)",
          filter: "blur(64px)",
          opacity: 0.18,
        }}
      />
      <div
        className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.65 0.08 260 / 0.7) 0%, transparent 70%)",
          filter: "blur(48px)",
          opacity: 0.12,
        }}
      />
    </div>
  );
}

// ─── Skill pill ───────────────────────────────────────────────────────────────
function SkillPill({ label, index }: { label: string; index: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, scale: 0.82 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{
        duration: 0.35,
        delay: index * 0.04,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="cursor-default select-none rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-foreground transition-all duration-300 hover:border-primary/60 hover:bg-primary hover:text-primary-foreground hover:shadow-md"
      data-ocid="skill-pill"
    >
      {label}
    </motion.span>
  );
}

// ─── Timeline entry ───────────────────────────────────────────────────────────
function TimelineEntry({
  milestone,
  index,
  isLast,
}: {
  milestone: Milestone;
  index: number;
  isLast: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -28 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{
        duration: 0.55,
        delay: index * 0.08,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="relative flex gap-6"
      data-ocid={`timeline-entry-${milestone.year}`}
    >
      {/* Spine + node */}
      <div className="flex flex-col items-center">
        <div
          className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full shadow-md ring-4 ring-primary/20"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.45 0.18 265), oklch(0.55 0.16 280))",
          }}
        >
          <span className="text-[10px] font-bold leading-none text-white">
            {String(milestone.year).slice(2)}
          </span>
        </div>
        {!isLast && (
          <div
            className="mt-1 w-0.5 flex-1"
            style={{
              background:
                "linear-gradient(to bottom, oklch(0.45 0.18 265 / 0.5), oklch(0.45 0.18 265 / 0.08))",
            }}
          />
        )}
      </div>

      {/* Content card */}
      <div className={`${isLast ? "pb-0" : "pb-10"} min-w-0 flex-1`}>
        <div className="rounded-xl border border-border bg-card p-5 shadow-subtle card-hover">
          <span className="text-xs font-bold uppercase tracking-widest text-accent">
            {milestone.year}
          </span>
          <h3 className="mt-1 font-display text-lg font-semibold leading-snug text-foreground">
            {milestone.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {milestone.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AboutPage() {
  const { data: profile } = useProfile();
  const milestones: Milestone[] = profile?.milestones ?? [];
  return (
    <div className="relative min-h-screen" data-ocid="about-page">
      {/* ── Animated gradient hero header ──────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-24 sm:py-32"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.18 0.06 265) 0%, oklch(0.26 0.1 278) 40%, oklch(0.22 0.07 252) 70%, oklch(0.15 0.03 240) 100%)",
        }}
      >
        <DecorativeBlobs />

        {/* Subtle grid overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.9 0 0 / 0.04) 1px, transparent 1px), linear-gradient(90deg, oklch(0.9 0 0 / 0.04) 1px, transparent 1px)",
            backgroundSize: "52px 52px",
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-4xl px-6 text-center">
          {/* Circular profile photo with animated gradient border */}
          <motion.div
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
            className="mx-auto mb-8 flex items-center justify-center"
            data-ocid="profile-photo"
          >
            <div
              className="relative h-36 w-36 rounded-full p-[3px] sm:h-44 sm:w-44"
              style={{
                background:
                  "conic-gradient(from 0deg, oklch(0.72 0.16 265), oklch(0.74 0.16 45), oklch(0.68 0.14 310), oklch(0.72 0.16 265))",
              }}
            >
              {/* Glow ring */}
              <div
                className="pointer-events-none absolute -inset-2 rounded-full opacity-30"
                style={{
                  background:
                    "conic-gradient(from 0deg, oklch(0.72 0.16 265 / 0.8), oklch(0.74 0.16 45 / 0.8), oklch(0.72 0.16 265 / 0.8))",
                  filter: "blur(10px)",
                }}
                aria-hidden="true"
              />
              <div className="h-full w-full overflow-hidden rounded-full bg-[oklch(0.22_0.06_265)]">
                <img
                  src="/assets/profile-photo.png"
                  alt="Ashwin Singh Chouhan"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    const el = e.currentTarget;
                    el.style.display = "none";
                    const sib = el.nextElementSibling as HTMLElement | null;
                    if (sib) sib.style.display = "flex";
                  }}
                />
                <div
                  className="hidden h-full w-full items-center justify-center"
                  aria-hidden="true"
                >
                  <span className="select-none font-display text-5xl font-bold text-white/60">
                    ASC
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Name + role */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.22 }}
          >
            <h1 className="font-display text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
              Ashwin Singh Chouhan
            </h1>
            <p className="mt-3 text-lg font-medium text-white/55 sm:text-xl">
              ASSISTANT PROFESSOR
            </p>
          </motion.div>

          {/* Gradient divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.65, delay: 0.42 }}
            className="mx-auto mt-6 h-1 w-24 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, oklch(0.72 0.16 265), oklch(0.74 0.16 45))",
            }}
            aria-hidden="true"
          />

          {/* Achievement badges */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.52 }}
            className="mt-8 flex flex-wrap justify-center gap-3"
          >
            {[
              "60+ Publications",
              "NSF CAREER Award",
              "ACM SIGCHI Best Paper",
            ].map((stat) => (
              <span
                key={stat}
                className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-semibold text-white/85 backdrop-blur-sm"
              >
                {stat}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Biography ──────────────────────────────────────────────────────────── */}
      <section className="relative bg-background py-20">
        <div
          className="pointer-events-none absolute right-0 top-0 h-64 w-64 opacity-10"
          style={{
            background:
              "radial-gradient(circle, oklch(0.45 0.18 265 / 0.9) 0%, transparent 70%)",
            filter: "blur(52px)",
          }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-3xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge
              variant="outline"
              className="mb-4 border-primary/40 text-primary text-xs uppercase tracking-widest"
            >
              Biography
            </Badge>
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              About Me
            </h2>
          </motion.div>

          <div className="mt-8 space-y-6">
            {bioParas.map((para, i) => (
              <motion.p
                key={para.slice(0, 30)}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-base leading-relaxed text-muted-foreground sm:text-[1.05rem]"
                // biome-ignore lint/security/noDangerouslySetInnerHtml: controlled static content
                dangerouslySetInnerHTML={{
                  __html: para.replace(
                    /\*(.*?)\*/g,
                    '<em class="not-italic font-semibold text-foreground">$1</em>',
                  ),
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Skills ─────────────────────────────────────────────────────────────── */}
      <section className="relative bg-muted/30 py-20">
        <div
          className="pointer-events-none absolute left-0 top-1/2 h-80 w-80 -translate-y-1/2 opacity-10"
          style={{
            background:
              "radial-gradient(circle, oklch(0.74 0.16 45 / 0.9) 0%, transparent 70%)",
            filter: "blur(64px)",
          }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-3xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge
              variant="outline"
              className="mb-4 border-accent/50 text-accent text-xs uppercase tracking-widest"
            >
              Expertise
            </Badge>
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              Skills &amp; Research Areas
            </h2>
            <p className="mt-3 text-muted-foreground">
              A blend of technical depth and human-centered methodology.
            </p>
          </motion.div>

          <div className="mt-10 flex flex-wrap gap-3" data-ocid="skills-grid">
            {skills.map((skill, i) => (
              <SkillPill key={skill} label={skill} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Career Timeline ────────────────────────────────────────────────────── */}
      <section className="relative bg-background py-20">
        <div
          className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 opacity-10"
          style={{
            background:
              "radial-gradient(circle, oklch(0.62 0.14 190 / 0.9) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-3xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <Badge
              variant="outline"
              className="mb-4 border-primary/40 text-primary text-xs uppercase tracking-widest"
            >
              Journey
            </Badge>
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              Career Timeline
            </h2>
            <p className="mt-3 text-muted-foreground">
              Key milestones across research and academia.
            </p>
          </motion.div>

          <div data-ocid="career-timeline">
            {milestones.map((ms, i) => (
              <TimelineEntry
                key={ms.year}
                milestone={ms}
                index={i}
                isLast={i === milestones.length - 1}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
