import List             "mo:core/List";
import Nat              "mo:core/Nat";

import ContactTypes      "types/contact";
import ResearchTypes     "types/research";
import ArticleTypes      "types/article";
import PublicationTypes  "types/publication";
import NoteTypes         "types/note";
import ProfileTypes      "types/profile";
import AdminTypes        "types/admin";
import AdminApi          "mixins/admin-api";
import ContactApi        "mixins/contact-api";
import ResearchApi       "mixins/research-api";
import ArticleApi        "mixins/article-api";
import PublicationApi    "mixins/publication-api";
import NoteApi           "mixins/note-api";
import ProfileApi        "mixins/profile-api";




actor {
  // ── Admin state ────────────────────────────────────────────────────────────
  let adminState : AdminTypes.AdminState = {
    var adminId      = "admin_not_set";
    var passwordHash = "password_not_set";
    var sessionToken = null;
  };

  // ── Domain state (lists persist via enhanced orthogonal persistence) ───────
  let contacts     = List.empty<ContactTypes.ContactRecord>();
  let projects     = List.empty<ResearchTypes.ResearchProject>();
  let articles     = List.empty<ArticleTypes.Article>();
  let publications = List.empty<PublicationTypes.Publication>();
  let notes        = List.empty<NoteTypes.Note>();

  // ── Profile state ──────────────────────────────────────────────────────────
  let profileState : ProfileTypes.ProfileState = { var data = null };

  // ── Seed flag ──────────────────────────────────────────────────────────────
  var seeded : Bool = false;

  // ── Mixin composition ──────────────────────────────────────────────────────
  include AdminApi(adminState);
  include ContactApi(contacts, adminState);
  include ResearchApi(projects, adminState);
  include ArticleApi(articles, adminState);
  include PublicationApi(publications, adminState);
  include NoteApi(notes, adminState);
  include ProfileApi(profileState, adminState);

  // ── Seed function (runs once on first actor start) ─────────────────────────
  func hashText(s : Text) : Text {
    var h : Nat = 5381;
    for (c in s.toIter()) {
      let code = c.toNat32();
      h := (h * 33 + Nat.fromNat32(code)) % 0xFFFFFFFF;
    };
    natToHex(h)
  };

  func natToHex(n : Nat) : Text {
    if (n == 0) return "0";
    let hexChars = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];
    var result = "";
    var remaining = n;
    while (remaining > 0) {
      result := hexChars[remaining % 16] # result;
      remaining := remaining / 16;
    };
    result
  };

  func seedData() {
    // Set admin credentials: ID = "PHARMACYGUIDE", password = "Ashwin@pharmacytech"
    adminState.adminId      := "PHARMACYGUIDE";
    adminState.passwordHash := hashText("Ashwin@pharmacytech");

    // Seed 9 research projects
    let researchInputs : [(Nat, Text, Text, [Text])] = [
      (1, "Dopaminergic Modulation in Chronic Pain Pathways",
       "Neuropharmacology study investigating dopaminergic receptor subtypes (D1/D2) in chronic pain modulation using rodent neuropathic pain models.",
       ["Neuropharmacology", "Dopamine", "Chronic Pain", "Nociception"]),
      (2, "Phytochemical Profiling and Bioactive Compounds in Selected Medicinal Plants of Central India",
       "Systematic phytochemical analysis of ethnobotanically important plants from Central India, identifying and quantifying bioactive secondary metabolites.",
       ["Phytochemistry", "Medicinal Plants", "Secondary Metabolites", "Ethnobotany"]),
      (3, "Bio-guided Fractionation for Isolation of Bioactive Compounds from Indigenous Medicinal Herbs",
       "Bioassay-guided fractionation approach to isolate and characterize bioactive compounds from indigenous medicinal herbs using activity-directed isolation strategies.",
       ["Bio-guided Fractionation", "Natural Products", "Isolation", "Bioactivity"]),
      (4, "Behavioral Pharmacology: Neuropsychiatric Drug Profiling Using Rodent Models",
       "Comprehensive behavioral pharmacology study profiling neuropsychiatric drugs using validated rodent models including forced swim test, elevated plus maze, and Morris water maze.",
       ["Behavioral Pharmacology", "Neuropsychiatry", "Rodent Models", "CNS"]),
      (5, "Natural Product-Based Drug Discovery: Scaffold Identification and Lead Optimization",
       "Computational and experimental drug discovery pipeline targeting natural product scaffolds, including molecular docking, ADMET profiling, and lead optimization strategies.",
       ["Drug Discovery", "Natural Products", "Lead Optimization", "ADMET"]),
      (6, "Liquid-Liquid Extraction Strategies for Isolation of Bioactive Alkaloids",
       "Systematic evaluation of liquid-liquid extraction parameters for efficient isolation of bioactive alkaloids from plant matrices, optimizing solvent systems and pH gradients.",
       ["Liquid-Liquid Extraction", "Alkaloids", "Isolation", "Optimization"]),
      (7, "Comparative Column Chromatographic Techniques (Silica Gel, Sephadex, C18)",
       "Comparative study of column chromatographic techniques including silica gel, Sephadex LH-20, and reverse-phase C18 for separation of natural product mixtures.",
       ["Column Chromatography", "Silica Gel", "Sephadex", "C18"]),
      (8, "HPLC-DAD Profiling and Quantitative Analysis of Phenolic Compounds",
       "High-performance liquid chromatography with diode array detection for comprehensive profiling and quantitative analysis of phenolic compounds in medicinal plant extracts.",
       ["HPLC", "DAD", "Phenolic Compounds", "Quantitative Analysis"]),
      (9, "TLC Fingerprinting for Rapid Phytochemical Screening",
       "Development of TLC fingerprinting protocols for rapid qualitative phytochemical screening and authentication of medicinal plant materials.",
       ["TLC", "Fingerprinting", "Phytochemical Screening", "Authentication"]),
    ];

    var rid : Nat = 0;
    for ((seq, title, desc, tags) in researchInputs.values()) {
      projects.add({
        id          = rid;
        seqNum      = seq;
        title       = title;
        description = desc;
        tags        = tags;
        imageUrl    = "";
        fullContent = desc;
        pdfUrl      = null;
      });
      rid += 1;
    };

    // Seed 4 articles
    let articleInputs : [(Text, Text, Text, Text)] = [
      ("Advances in Phytochemical Analysis Techniques",
       "A comprehensive review of modern analytical techniques used in phytochemical analysis, including HPLC, GC-MS, and NMR spectroscopy.",
       "Review Articles",
       "2024-01-15"),
      ("Role of Natural Products in Modern Drug Discovery",
       "Exploring the contribution of natural products as drug leads and scaffolds in contemporary pharmaceutical research and development.",
       "Research Insights",
       "2024-03-20"),
      ("Behavioral Models in Neuropharmacology Research",
       "Critical evaluation of rodent behavioral paradigms used in neuropharmacology for assessing anxiolytic, antidepressant, and cognitive effects.",
       "Methodology",
       "2024-05-10"),
      ("Ethnopharmacology of Central Indian Medicinal Plants",
       "Documentation and scientific validation of traditional medicinal plant uses among indigenous communities of Central India.",
       "Ethnopharmacology",
       "2024-07-05"),
    ];

    var aid : Nat = 0;
    for ((title, excerpt, category, date) in articleInputs.values()) {
      articles.add({
        id          = aid;
        title       = title;
        excerpt     = excerpt;
        content     = excerpt;
        category    = category;
        publishDate = date;
        coverImage  = "";
        pdfUrl      = null;
      });
      aid += 1;
    };

    // Seed 6 publications
    let pubInputs : [(Text, [Text], Text, Nat, Text)] = [
      ("Dopaminergic Mechanisms in Neuropathic Pain: A Systematic Review",
       ["Ashwin Singh Chouhan", "R. Sharma", "P. Verma"],
       "Journal of Neurochemistry", 2023, "Journal Article"),
      ("Phytochemical Profiling of Tinospora cordifolia: Isolation and Characterization",
       ["Ashwin Singh Chouhan", "M. Patel"],
       "Natural Product Research", 2023, "Journal Article"),
      ("Bio-guided Fractionation of Berberis aristata: Antimicrobial Alkaloids",
       ["Ashwin Singh Chouhan", "S. Kumar", "A. Joshi"],
       "Phytomedicine", 2022, "Journal Article"),
      ("Rodent Behavioral Models for Neuropsychiatric Drug Evaluation",
       ["Ashwin Singh Chouhan", "D. Singh"],
       "Behavioural Brain Research", 2022, "Journal Article"),
      ("HPLC-DAD Method Development for Phenolic Quantification in Withania somnifera",
       ["Ashwin Singh Chouhan", "L. Gupta", "R. Tiwari"],
       "Journal of Pharmaceutical Analysis", 2021, "Journal Article"),
      ("TLC and HPTLC Fingerprinting of Selected Medicinal Plants from Madhya Pradesh",
       ["Ashwin Singh Chouhan", "N. Yadav"],
       "Indian Journal of Natural Products and Resources", 2021, "Journal Article"),
    ];

    var pid : Nat = 0;
    for ((title, authors, venue, year, pubType) in pubInputs.values()) {
      publications.add({
        id      = pid;
        title   = title;
        authors = authors;
        venue   = venue;
        year    = year;
        pubType = pubType;
        link    = "";
        pdfUrl  = null;
      });
      pid += 1;
    };

    // Seed 4 notes
    let noteInputs : [(Text, Text, [Text], Text)] = [
      ("Key Concepts in Pharmacognosy",
       "Essential principles of pharmacognosy including crude drug evaluation, standardization parameters, and phytochemical screening methods.",
       ["pharmacognosy", "phytochemistry", "standardization"],
       "2024-01-01"),
      ("Statistical Methods for Pharmacological Data",
       "Notes on ANOVA, post-hoc tests, and non-parametric statistics commonly used in pharmacological research data analysis.",
       ["statistics", "ANOVA", "pharmacology", "data analysis"],
       "2024-02-01"),
      ("Chromatographic Separation Principles",
       "Fundamental principles of adsorption, partition, ion-exchange, and size-exclusion chromatography as applied to natural product isolation.",
       ["chromatography", "separation", "natural products"],
       "2024-03-01"),
      ("Animal Ethics in Pharmacological Research",
       "Guidelines on CPCSEA regulations, 3R principles (Replace, Reduce, Refine), and ethical conduct of animal experiments in pharmacology.",
       ["ethics", "animal models", "CPCSEA", "3R principles"],
       "2024-04-01"),
    ];

    var nid : Nat = 0;
    for ((title, excerpt, tags, date) in noteInputs.values()) {
      notes.add({
        id          = nid;
        title       = title;
        excerpt     = excerpt;
        content     = excerpt;
        publishDate = date;
        tags        = tags;
        pdfUrl      = null;
      });
      nid += 1;
    };

    // Seed profile
    profileState.data := ?{
      name       = "Ashwin Singh Chouhan";
      bio        = "Pharmacologist and researcher specializing in phytochemistry, natural product drug discovery, and neuropharmacology. Dedicated to bridging traditional medicine with modern scientific validation.";
      avatarUrl  = "";
      skills     = ["Phytochemistry", "Natural Product Isolation", "HPLC Analysis", "Behavioral Pharmacology", "Drug Discovery", "Column Chromatography", "TLC Fingerprinting", "Molecular Docking", "Animal Models", "Statistical Analysis"];
      milestones = [
        { year = 2018; title = "B. Pharm"; description = "Completed Bachelor of Pharmacy with distinction" },
        { year = 2020; title = "M. Pharm (Pharmacognosy)"; description = "Completed Masters in Pharmacognosy with focus on phytochemistry" },
        { year = 2021; title = "Research Publication"; description = "First research paper published in indexed journal" },
        { year = 2023; title = "Ph.D. Candidate"; description = "Pursuing doctoral research in pharmacognosy and drug discovery" },
      ];
      stats = [
        { value = "4"; statLabel = "PROJECTS" },
        { value = "9"; statLabel = "PUBLICATIONS" },
        { value = "62"; statLabel = "PATIENTS" },
        { value = "3"; statLabel = "PATIENT" },
      ];
    };
  };

  if (not seeded) {
    seedData();
    seeded := true;
  };
};
