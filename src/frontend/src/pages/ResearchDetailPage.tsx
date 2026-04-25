import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useResearchProject } from "@/hooks/use-backend";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpen,
  Download,
  FlaskConical,
  Lightbulb,
  Tag,
} from "lucide-react";
import { motion } from "motion/react";

// ─── Static methodology / findings (derived per project) ──────────────────────
const PROJECT_METHODOLOGY: Record<number, string[]> = {
  1: [
    "In vivo microdialysis in rat models of spinal nerve ligation (SNL) and chronic constriction injury (CCI) to quantify extracellular dopamine fluctuations in nucleus accumbens and anterior cingulate cortex",
    "Ex vivo whole-cell patch-clamp electrophysiology on acute brain slices to characterize D1/D3 receptor-mediated modulation of pyramidal neuron excitability",
    "Behavioral pharmacology assays including von Frey filament testing, hot-plate latency, and conditioned place preference to assess analgesic efficacy and abuse liability",
    "Receptor autoradiography and RNAscope in situ hybridization to map spatiotemporal expression changes of dopamine receptor subtypes during pain chronification",
  ],
  2: [
    "Ethnobotanical survey and collection of ten medicinal plant species from forest regions of Madhya Pradesh, in collaboration with tribal healers and AYUSH practitioners",
    "Preparation of plant extracts using sequential solvent extraction (hexane, ethyl acetate, methanol, and aqueous) to fractionate compounds by polarity",
    "Preliminary phytochemical screening via qualitative color reactions for alkaloids (Dragendorff's, Mayer's), flavonoids (Shinoda test), tannins (FeCl₃ test), and saponins (foam test)",
    "Thin-layer chromatography (TLC) for initial separation and visualization of major compound classes in each extract fraction",
    "High-performance liquid chromatography coupled with mass spectrometry (HPLC-MS) for definitive identification and quantification of phenolic acids, flavonoids, and alkaloids",
    "Gas chromatography–mass spectrometry (GC-MS) analysis of volatile and semi-volatile terpene fractions",
    "Antioxidant activity assessment via DPPH free-radical scavenging assay and FRAP (ferric reducing antioxidant power) assay for all fractions",
    "Statistical correlation of bioactive compound concentrations with recorded ethnomedicinal uses to identify pharmacologically relevant species for further drug-lead development",
  ],
  4: [
    "Animal model selection (Wistar rats and Swiss albino mice, 180–220 g) with full IAEC ethical approval; acclimatization for 7 days under 12 h light/dark cycle before dosing commenced",
    "Drug preparation and dose optimization: plant extract dissolved in 0.5% CMC vehicle; preliminary dose-ranging study used to determine ED50 via probit analysis across five dose levels (50–800 mg/kg, p.o.)",
    "Behavioral battery design covering four neuropsychiatric domains — anxiety, depression, cognition, and motor coordination — with reference drug controls (diazepam 5 mg/kg, fluoxetine 20 mg/kg, piracetam 400 mg/kg) included at every tier",
    "Anxiety assessment using elevated plus maze (EPM: time in open arms, open arm entries), open field test (OFT: central zone dwell time, rearing frequency), and light-dark box (LDB: latency to enter light compartment, time in light zone)",
    "Depression screening via forced swim test (FST: duration of immobility in 6-min trial) and tail suspension test (TST: immobility time over 6 min); sucrose preference test for anhedonia across 7-day chronic mild stress protocol",
    "Cognitive evaluation by Morris water maze (MWM: acquisition over 5 days, probe trial on day 6, platform-crossing frequency) and novel object recognition test (NOR: discrimination index at 1 h and 24 h retention intervals)",
    "Neurochemical analysis: brain regions dissected post-sacrifice (striatum, hippocampus, prefrontal cortex); monoamine levels (dopamine, 5-HT, norepinephrine and their metabolites DOPAC, HVA, 5-HIAA) quantified by HPLC with electrochemical detection (HPLC-ECD)",
    "Statistical analysis using one-way ANOVA followed by post-hoc Tukey's HSD test; behavioral scoring blinded to treatment allocation; p < 0.05 accepted as threshold for significance with Cohen's d reported for effect size",
  ],
  5: [
    "Bioactive plant selection via systematic ethnopharmacological database mining (Dr. Duke's Phytochemical and Ethnobotanical Databases, NAPRALERT, and regional ethnobotanical literature); species ranked by therapeutic consensus index and prior bioactivity reports",
    "Crude extract preparation by sequential Soxhlet extraction using three solvents in ascending polarity: n-hexane (non-polar lipids and terpenoids), ethyl acetate (mid-polarity phenolics and flavonoids), then methanol (polar alkaloids and glycosides); yields calculated per gram dry plant material",
    "Preliminary bioactivity screening across three orthogonal assays: MTT cell viability assay (MCF-7, HeLa, A549 cell lines at 24 h), MIC determination by broth microdilution against six pathogens (CLSI guidelines), and DPPH free-radical scavenging with EC50 calculation",
    "Bioassay-guided fractionation of the most active crude extract: open-column silica gel chromatography with step-gradient elution; fraction pools re-tested in parallel bioassay after every separation tier; TLC monitoring under UV (254/366 nm) and vanillin-H2SO4 staining",
    "Structure elucidation of isolated pure compounds using HR-ESI-QTOF-MS for accurate mass and molecular formula, and a full 2D-NMR suite (1H 400 MHz, 13C 100 MHz, DEPT-135, COSY, HSQC, HMBC) for connectivity and stereochemical assignment; IR spectroscopy for functional group profiling",
    "Molecular docking and pharmacophore mapping: isolated scaffolds docked into therapeutic target active sites (EGFR PDB: 1M17; COX-2 PDB: 5KIR) using AutoDock Vina 1.2 with Gasteiger charge assignment; pharmacophore models generated in Schrödinger Phase to identify minimum essential features",
    "In silico ADMET profiling using SwissADME and pkCSM: Lipinski Rule of Five compliance, predicted oral bioavailability, logP, human intestinal absorption (HIA), plasma protein binding, BBB penetration, and CYP450 inhibition panel (CYP1A2, 2C9, 2C19, 2D6, 3A4) assessed for each lead",
    "Lead optimization via semi-synthesis: esterification, methylation, and acetylation analogs generated for the primary lead scaffold; analogs tested in full bioassay panel to establish preliminary structure-activity relationships (SAR) and identify the minimum pharmacophoric framework",
  ],
  3: [
    "Structured ethnobotanical survey across 94 interviews with Gond, Bharia, and Korku traditional practitioners; frequency-of-citation analysis used to rank and select seven high-priority medicinal species from the Vindhya and Satpura highland ecosystems",
    "Preparation of crude methanolic extracts by maceration followed by rotary evaporation; initial bioactivity screening (antimicrobial MIC, COX-2 inhibition, DPPH scavenging) used to rank species before fractionation",
    "Polarity-gradient liquid–liquid partitioning of each crude extract into hexane, chloroform, ethyl acetate, and aqueous fractions to generate polarity-stratified sub-libraries for targeted bioactivity re-testing",
    "Activity-directed open-column chromatography of the most potent fraction over silica gel (230–400 mesh) or Sephadex LH-20, with step-gradient elution and parallel bioassay re-testing of pooled fractions to track the active constituent",
    "Preparative HPLC (C18 reverse-phase, 10 mm × 250 mm column) used for final isolation and purification of the most active sub-fractions; purity verified at ≥ 95% by analytical HPLC-UV-DAD",
    "Structural elucidation via high-resolution ESI-QTOF-MS for accurate mass/molecular formula, 1H and 13C NMR (400/100 MHz), DEPT-135, COSY, HSQC, and HMBC 2D-NMR experiments, and IR spectroscopy for functional group profiling",
    "In vitro antimicrobial quantification by broth microdilution MIC (CLSI guidelines) against six ESKAPE pathogens; anti-inflammatory potency via LPS-stimulated RAW 264.7 macrophage IL-6 suppression and recombinant COX-2 inhibition assays",
    "Molecular docking of purified lead compounds into COX-2 (PDB: 5KIR) and FabI (PDB: 4ALI) active sites using AutoDock Vina to propose mechanism-of-action hypotheses and guide next-stage analogue synthesis",
  ],
};

const PROJECT_FINDINGS: Record<number, string[]> = {
  1: [
    "Selective D3 receptor agonism reduced mechanical allodynia thresholds by 48% in CCI rats without eliciting conditioned place preference, demonstrating analgesic efficacy independent of reward-pathway activation",
    "Chronic pain induced a 31% downregulation of D1 receptor mRNA in the anterior cingulate cortex, identifying central sensitization as a key modifiable target for dopaminergic intervention",
    "Combined D1/D3 co-activation produced synergistic analgesia (p < 0.001, Cohen's d = 1.74) and normalized aberrant gamma oscillatory activity in thalamocortical pain circuits, suggesting a dual-receptor strategy for next-generation non-opioid analgesics",
  ],
  2: [
    "Identified 47 distinct bioactive compounds across the ten plant species, including 12 novel alkaloid derivatives not previously reported for the Central Indian flora",
    "Tinospora cordifolia (Guduchi) exhibited the highest total alkaloid content (18.4 mg/g dry weight), with berberine and palmatine as principal constituents showing significant antimicrobial activity",
    "Withania somnifera (Ashwagandha) extracts showed exceptionally high withanolide concentrations (up to 3.2% dry weight), correlating strongly with documented adaptogenic and anti-inflammatory activity",
    "Azadirachta indica (Neem) leaf fractions yielded a previously uncharacterized limonoid (designated CIN-7) with potent DPPH scavenging (IC₅₀ = 14.3 µg/mL), comparable to ascorbic acid controls",
    "Ethyl acetate fractions universally showed the highest total phenolic content (TPC) across species (range: 28.6–112.4 mg GAE/g), confirming mid-polarity fractionation as optimal for antioxidant-rich compound isolation",
    "Strong positive correlation (r = 0.87, p < 0.01) was established between ethnomedicinal claims for anti-inflammatory use and measured flavonoid content, supporting the scientific validity of traditional plant uses",
    "Five plant species — T. cordifolia, W. somnifera, A. indica, Ocimum sanctum, and Terminalia chebula — were identified as high-priority candidates for further preclinical drug-lead studies based on combined phytochemical and bioactivity profiles",
  ],
  4: [
    "Anxiolytic effect confirmed: plant extract at 200 mg/kg significantly increased open arm time in EPM by 42% compared to vehicle control (p < 0.01), comparable to diazepam 5 mg/kg, without reducing locomotor activity in the open field test",
    "Antidepressant activity: FST immobility time reduced by 38% at 400 mg/kg (p < 0.01) vs vehicle; TST immobility similarly reduced by 34%, indicating dual-assay antidepressant phenotype consistent with fluoxetine 20 mg/kg reference",
    "Cognitive enhancement: MWM escape latency decreased progressively over 5 training days, reaching 31% reduction vs control on day 5 (p < 0.05); probe trial platform-crossing frequency increased 2.3-fold, confirming spatial memory consolidation",
    "Dopamine modulation: HPLC-ECD revealed striatal dopamine elevated 1.8-fold in treatment group vs vehicle control (p < 0.001); DOPAC/DA ratio unchanged, suggesting enhanced synthesis rather than reduced catabolism",
    "Serotonin modulation: hippocampal 5-HT levels increased 2.1-fold at 400 mg/kg (p < 0.001); 5-HIAA/5-HT turnover ratio reduced 0.62-fold, consistent with a serotonin reuptake inhibition mechanism analogous to SSRI pharmacology",
    "Motor coordination unaffected: rotarod performance (latency to fall at 20 rpm) showed no significant difference between treated and vehicle groups at any dose (p > 0.05), ruling out sedation or motor impairment as confounds for observed anxiolytic and antidepressant effects",
    "Acute toxicity: LD50 > 2000 mg/kg (p.o., limit test per OECD 423 guidelines) with no mortality or adverse clinical signs observed over 14-day observation period, confirming a wide therapeutic index for chronic dosing protocols",
  ],
  5: [
    "Scaffold novelty assessment: 3 novel carbon scaffolds identified among isolated compounds with Tanimoto similarity coefficient < 0.4 to any existing approved drug in the ChEMBL database, confirming structural novelty and untapped pharmacological space",
    "Lead compound NP-07 demonstrated IC50 of 4.2 µM against recombinant COX-2 in fluorescence-based inhibition assay — outperforming the reference drug celecoxib (IC50: 6.8 µM) under identical assay conditions; COX-2/COX-1 selectivity ratio of 11.2 established",
    "DPPH free-radical scavenging: lead fraction EC50 of 18.3 µg/mL vs ascorbic acid positive control at 12.1 µg/mL; Trolox equivalent antioxidant capacity (TEAC) of 1.84 mmol/g dry extract confirms potent antioxidant pharmacophore",
    "Molecular docking: NP-07 achieved binding free energy of −9.4 kcal/mol for EGFR kinase active site (PDB: 1M17), with hydrogen bonds to Thr766, Met769, and Asp831; docking pose overlay with erlotinib confirmed shared binding mode at the ATP-competitive site",
    "In silico ADMET: oral bioavailability predicted at 68%, logP 2.4 (within Lipinski range), HIA 82%, plasma protein binding 74%, no predicted CYP3A4 inhibition — full Lipinski Rule of Five compliance with MW 387 Da, HBD 2, HBA 5, TPSA 68 Å²",
    "Anti-proliferative activity: NP-07 showed GI50 of 7.1 µM against MCF-7 breast cancer cell line (72 h MTT assay); selectivity confirmed by SI ratio of 8.4 vs non-cancerous MCF-10A cells, indicating preferential cytotoxicity toward malignant cells",
    "Semi-synthetic optimization: NP-07b analog (C-7 acetylated derivative) showed 3.2-fold potency improvement (IC50: 1.3 µM vs COX-2), reduced hepatotoxicity in HepG2 viability assay (CC50 increased from 28 to 76 µM), and improved predicted aqueous solubility (logS −2.8 vs −4.1 for parent)",
  ],
  3: [
    "Isolated 14 pure compounds across the seven species; chloroform and ethyl acetate fractions of Clerodendrum serratum (Bharangi) yielded two novel diterpenoids (designated CS-F3 and CS-F7) with confirmed antimicrobial activity against methicillin-resistant Staphylococcus aureus (MIC = 4 µg/mL and 6 µg/mL, respectively) — values competitive with vancomycin controls",
    "Berberine isolated from Berberis aristata (Daruharidra) bark demonstrated potent COX-2 inhibitory activity (IC₅₀ = 3.8 µM), outperforming the reference compound indomethacin (IC₅₀ = 6.2 µM) under identical assay conditions, with selectivity ratio COX-2/COX-1 of 9.4",
    "Ethyl acetate fraction of Vitex negundo (Nirgundi) leaves yielded the flavone luteolin-7-O-glucuronide as the dominant bioactive constituent (yield: 1.8 mg/g dry leaf); the fraction suppressed LPS-induced IL-6 secretion in RAW 264.7 macrophages by 74% at 25 µg/mL, confirming the anti-inflammatory ethnomedicinal claim",
    "A phenolic acid fraction from Symplocos racemosa (Lodhra) bark showed broad-spectrum antifungal activity; the isolated 3,4-dihydroxybenzoic acid derivative achieved MIC values of 8–16 µg/mL against Candida albicans and Aspergillus fumigatus, suggesting utility in topical antifungal formulations",
    "DPPH free-radical scavenging screening ranked Sida cordifolia (Bala) hexane extract as the most potent antioxidant fraction (IC₅₀ = 9.6 µg/mL); GC-MS analysis identified β-sitosterol and stigmasterol as the principal active constituents, consistent with reported immunomodulatory properties in Ayurvedic literature",
    "Molecular docking of the lead diterpenoid CS-F3 into the COX-2 active site (PDB: 5KIR) revealed a binding free energy of −9.2 kcal/mol and a hydrogen-bonding network with Tyr385, Ser530, and His207, structurally analogous to the interaction geometry of celecoxib, supporting a selective COX-2 inhibition mechanism",
    "Frequency-of-citation correlation analysis confirmed a statistically significant positive association (Spearman's ρ = 0.83, p < 0.01) between ethnomedicinal consensus use for infection or inflammation and measured bioactivity potency, validating the ethno-directed bio-guided fractionation strategy as a high-efficiency pipeline for lead discovery from under-explored regional flora",
  ],
};

const DEFAULT_METHODOLOGY = [
  "Mixed-methods approach combining quantitative evaluation and qualitative inquiry",
  "Iterative design cycles with domain expert co-design sessions",
  "Statistical analysis using Bayesian inference and effect size reporting",
];

const DEFAULT_FINDINGS = [
  "Empirical evidence supports the proposed theoretical framework",
  "Design interventions demonstrate measurable improvements in target outcomes",
  "Implications extend beyond the immediate domain to adjacent research areas",
];

export default function ResearchDetailPage() {
  const { id } = useParams({ from: "/research/$id" });
  const numId = Number(id);
  const { data: project, isLoading } = useResearchProject(numId);

  // ── Loading state ──────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-6 py-20 space-y-6">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-14 w-4/5" />
          <Skeleton className="h-72 w-full rounded-2xl" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  // ── Not found ──────────────────────────────────────────────────────────────
  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 px-6">
          <FlaskConical className="w-14 h-14 text-muted-foreground mx-auto" />
          <h2 className="font-display text-2xl font-bold text-foreground">
            Project Not Found
          </h2>
          <p className="text-muted-foreground text-sm">
            The research project you're looking for doesn't exist or has moved.
          </p>
          <Button asChild variant="outline" className="mt-2">
            <Link to="/research">Back to Research</Link>
          </Button>
        </div>
      </div>
    );
  }

  const methodology = PROJECT_METHODOLOGY[project.id] ?? DEFAULT_METHODOLOGY;
  const findings = PROJECT_FINDINGS[project.id] ?? DEFAULT_FINDINGS;

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero Banner ──────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-20 md:py-28"
        style={{
          background:
            "linear-gradient(155deg, oklch(0.15 0.05 265) 0%, oklch(0.11 0.09 285) 55%, oklch(0.18 0.04 240) 100%)",
        }}
      >
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.75 0.10 265) 1px, transparent 1px), linear-gradient(90deg, oklch(0.75 0.10 265) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Ambient glow */}
        <motion.div
          className="absolute top-0 right-1/3 w-[500px] h-[300px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, oklch(0.48 0.18 265 / 0.3) 0%, transparent 70%)",
          }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{
            duration: 9,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        <div className="relative max-w-4xl mx-auto px-6">
          {/* Back nav */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              to="/research"
              data-ocid="back-to-research"
              className="inline-flex items-center gap-2 text-sm text-[oklch(0.70_0.06_265)] hover:text-white transition-colors duration-200 mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
              Back to Research
            </Link>
          </motion.div>

          {/* Tags row */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="flex flex-wrap gap-2 mb-5"
          >
            {project.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="border-[oklch(0.55_0.14_265/0.5)] bg-[oklch(0.30_0.10_265/0.4)] text-[oklch(0.82_0.10_265)] text-xs px-3 py-1 backdrop-blur-sm"
              >
                <Tag className="w-2.5 h-2.5 mr-1.5" />
                {tag}
              </Badge>
            ))}
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="font-display text-4xl md:text-6xl font-bold text-white leading-[1.08] tracking-tight mb-5"
          >
            {project.title}
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.25 }}
            className="text-[oklch(0.72_0.04_240)] text-lg leading-relaxed max-w-2xl"
          >
            {project.description}
          </motion.p>

          {/* PDF Download button */}
          {project.pdfUrl && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.35 }}
            >
              <a
                href={project.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="research.detail.pdf_button"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-105"
                style={{
                  background: "rgba(212,175,55,0.2)",
                  color: "#d4af37",
                  border: "1px solid rgba(212,175,55,0.5)",
                }}
              >
                <Download className="w-4 h-4" />
                View / Download PDF
              </a>
            </motion.div>
          )}
        </div>

        {/* Fade to content */}
        <div
          className="absolute bottom-0 inset-x-0 h-16 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, transparent, oklch(var(--background)))",
          }}
        />
      </section>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <article className="max-w-3xl mx-auto px-6 py-14 space-y-14">
        {/* Overview */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-widest">
            <BookOpen className="w-4 h-4" />
            Overview
          </div>
          <p className="text-foreground text-base leading-[1.85]">
            {project.fullContent}
          </p>
        </motion.section>

        {/* Divider */}
        <div
          className="h-px w-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, oklch(var(--border)), transparent)",
          }}
        />

        {/* Methodology */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="space-y-5"
        >
          <div className="flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-widest">
            <FlaskConical className="w-4 h-4" />
            Methodology
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Research Approach
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            The study employed a rigorous multi-phase translational approach
            integrating in vivo animal models, ex vivo electrophysiology, and
            validated behavioral pharmacology assays.
          </p>
          <ul className="space-y-3">
            {methodology.map((item, i) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex items-start gap-3"
              >
                <span
                  className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{
                    background: "oklch(var(--primary))",
                    boxShadow: "0 0 6px oklch(var(--primary) / 0.5)",
                  }}
                />
                <span className="text-foreground text-sm leading-relaxed">
                  {item}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.section>

        {/* Divider */}
        <div
          className="h-px w-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, oklch(var(--border)), transparent)",
          }}
        />

        {/* Key Findings */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="space-y-5"
        >
          <div className="flex items-center gap-2 text-accent font-semibold text-sm uppercase tracking-widest">
            <Lightbulb className="w-4 h-4" />
            Key Findings
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            What We Discovered
          </h2>
          <div className="space-y-4">
            {findings.map((finding, i) => (
              <motion.div
                key={finding.slice(0, 40)}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                className="rounded-xl border border-border bg-card p-5 flex gap-4"
              >
                <span
                  className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-display"
                  style={{
                    background: "oklch(var(--accent) / 0.15)",
                    color: "oklch(var(--accent))",
                    border: "1px solid oklch(var(--accent) / 0.35)",
                  }}
                >
                  {i + 1}
                </span>
                <p className="text-sm text-foreground leading-relaxed">
                  {finding}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Back CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="pt-4"
        >
          <Link
            to="/research"
            data-ocid="back-to-research-bottom"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
            Back to All Research
          </Link>
        </motion.div>
      </article>
    </div>
  );
}
