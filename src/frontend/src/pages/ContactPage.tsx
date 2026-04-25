import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitContact } from "@/hooks/use-backend";
import type { ContactSubmission } from "@/types";
import { Linkedin } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { SiYoutube } from "react-icons/si";
import { toast } from "sonner";

const SOCIAL_LINKS = [
  {
    icon: Linkedin,
    label: "LinkedIn",
    href: "https://linkedin.com/in/ashwin-singh-chouhan-abba34161",
    color: "hover:bg-primary/10 hover:border-primary/40 hover:text-primary",
  },
  {
    icon: SiYoutube,
    label: "YouTube",
    href: "https://www.youtube.com/@ashwinsinghchouhan5221",
    color: "hover:bg-red-500/10 hover:border-red-500/40 hover:text-red-500",
  },
];

const EMPTY_FORM: ContactSubmission = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

// Animated success checkmark SVG
function AnimatedCheck() {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
      className="relative"
    >
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
        <svg
          viewBox="0 0 52 52"
          className="w-14 h-14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Success checkmark"
        >
          <motion.circle
            cx="26"
            cy="26"
            r="23"
            stroke="oklch(var(--accent))"
            strokeWidth="2.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.55, delay: 0.2, ease: "easeOut" }}
            aria-hidden="true"
          />
          <motion.path
            d="M14 26.5l8 8 16-16"
            stroke="oklch(var(--accent))"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, delay: 0.65, ease: "easeOut" }}
          />
        </svg>
      </div>
      {/* Radiating rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border border-accent/30"
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: 1.5 + i * 0.35, opacity: 0 }}
          transition={{ duration: 1.2, delay: 0.5 + i * 0.2, ease: "easeOut" }}
        />
      ))}
    </motion.div>
  );
}

// Spinner for loading state
function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4 mr-2 text-primary-foreground"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

function validate(form: ContactSubmission): string | null {
  if (!form.name.trim()) return "Full name is required.";
  if (!form.email.trim()) return "Email address is required.";
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(form.email)) return "Please enter a valid email address.";
  if (!form.subject.trim()) return "Subject is required.";
  if (!form.message.trim()) return "Message is required.";
  return null;
}

export default function ContactPage() {
  const { mutate, isPending, isSuccess } = useSubmitContact();
  const [form, setForm] = useState<ContactSubmission>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<ContactSubmission>>({});

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name as keyof ContactSubmission]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleBlur(
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    if (!value.trim()) {
      setErrors((prev) => ({
        ...prev,
        [name]: `${name.charAt(0).toUpperCase() + name.slice(1)} is required.`,
      }));
    }
    if (name === "email" && value.trim()) {
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(value)) {
        setErrors((prev) => ({
          ...prev,
          email: "Please enter a valid email address.",
        }));
      }
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validate(form);
    if (err) {
      toast.error(err);
      return;
    }
    mutate(form, {
      onSuccess: () => {
        setForm(EMPTY_FORM);
        setErrors({});
      },
      onError: () => {
        toast.error("Something went wrong. Please try again.");
      },
    });
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* ── Animated Gradient Header ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-card border-b border-border py-20 md:py-28">
        {/* Animated gradient orb behind header */}
        <motion.div
          className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-25"
          style={{
            background:
              "radial-gradient(circle, oklch(var(--primary)) 0%, oklch(var(--accent)) 50%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        {/* Subtle grid pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(oklch(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, oklch(var(--foreground)) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="max-w-2xl"
          >
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-widest mb-5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Contact
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.15 }}
              className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4"
            >
              Let&apos;s <span className="text-gradient">Start a</span>
              <br />
              Conversation
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="text-muted-foreground text-lg leading-relaxed max-w-xl"
            >
              Whether you&apos;re interested in research collaborations,
              speaking engagements, or just want to talk about human-AI
              interaction — I&apos;d love to hear from you.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── Main Content ──────────────────────────────────────────────────────── */}
      <section className="relative py-16 md:py-20 bg-background flex-1">
        {/* Decorative background gradient orb */}
        <div
          className="pointer-events-none absolute bottom-0 right-0 w-[480px] h-[480px] rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle, oklch(var(--accent)) 0%, transparent 70%)",
            transform: "translate(30%, 30%)",
          }}
        />
        <div
          className="pointer-events-none absolute top-16 left-0 w-[320px] h-[320px] rounded-full opacity-8"
          style={{
            background:
              "radial-gradient(circle, oklch(var(--primary)) 0%, transparent 70%)",
            transform: "translateX(-40%)",
          }}
        />

        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 xl:gap-16">
            {/* ── Left sidebar ────────────────────────────────────────────────── */}
            <motion.aside
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lg:col-span-2 space-y-8"
            >
              {/* Direct contact info */}
              <div className="p-6 bg-card rounded-2xl card-elevated border border-border space-y-5">
                <h2 className="font-display text-lg font-bold text-foreground">
                  Contact Info
                </h2>
                {[
                  {
                    label: "Email",
                    value: "ashwinsingh26061992@gmail.com",
                    href: "mailto:ashwinsingh26061992@gmail.com",
                  },
                  {
                    label: "Institution",
                    value: "JNVU, JODHPUR, RAJASTHAN",
                    href: null,
                  },
                  {
                    label: "Office Hours",
                    value: "Monday to Saturday 9AM TO 5PM",
                    href: null,
                  },
                ].map(({ label, value, href }) => (
                  <div key={label} className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      {label}
                    </span>
                    {href ? (
                      <a
                        href={href}
                        className="text-sm text-primary hover:text-accent transition-colors font-medium"
                      >
                        {value}
                      </a>
                    ) : (
                      <span className="text-sm text-foreground">{value}</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Collaboration note */}
              <div className="p-6 bg-primary/5 border border-primary/15 rounded-2xl space-y-2">
                <p className="text-sm font-semibold text-foreground">
                  Research Collaborations
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  I welcome proposals from researchers in cognitive science,
                  HCI, and adjacent fields. Please include a brief description
                  of your work and how you envision us collaborating.
                </p>
              </div>

              {/* Social links */}
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Find me online
                </p>
                <div className="flex gap-3">
                  {SOCIAL_LINKS.map(({ icon: Icon, label, href, color }) => (
                    <motion.a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      data-ocid={`social-${label.toLowerCase().replace(/\s\/\s.*/i, "")}`}
                      whileHover={{ scale: 1.08, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-11 h-11 rounded-xl flex items-center justify-center border border-border bg-card text-muted-foreground transition-smooth ${color}`}
                    >
                      <Icon className="h-4 w-4" />
                    </motion.a>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Response time: usually within 2–3 business days.
                </p>
              </div>
            </motion.aside>

            {/* ── Form ────────────────────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="lg:col-span-3"
            >
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  /* ── Success state ────────────────────────────────────────── */
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center justify-center py-16 px-8 space-y-6 text-center bg-card rounded-2xl card-elevated border border-border"
                    data-ocid="contact-success"
                  >
                    <AnimatedCheck />
                    <div className="space-y-2">
                      <h3 className="font-display text-3xl font-bold text-foreground">
                        Message Sent!
                      </h3>
                      <p className="text-muted-foreground text-base max-w-sm leading-relaxed">
                        Thank you for reaching out. I read every message
                        personally and will respond within 2–3 business days.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => window.location.reload()}
                      className="mt-2"
                    >
                      Send another message
                    </Button>
                  </motion.div>
                ) : (
                  /* ── Form ─────────────────────────────────────────────────── */
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleSubmit}
                    noValidate
                    className="space-y-6 bg-card rounded-2xl p-6 md:p-8 card-elevated border border-border"
                    data-ocid="contact-form"
                  >
                    <div className="space-y-1">
                      <h2 className="font-display text-2xl font-bold text-foreground">
                        Send a Message
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        All fields are required.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Dr. Jane Smith"
                          required
                          aria-describedby={
                            errors.name ? "name-error" : undefined
                          }
                          data-ocid="contact-name"
                          className={
                            errors.name
                              ? "border-destructive focus-visible:ring-destructive"
                              : ""
                          }
                        />
                        {errors.name && (
                          <p
                            id="name-error"
                            className="text-xs text-destructive mt-0.5"
                          >
                            {errors.name}
                          </p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="jane@university.edu"
                          required
                          aria-describedby={
                            errors.email ? "email-error" : undefined
                          }
                          data-ocid="contact-email"
                          className={
                            errors.email
                              ? "border-destructive focus-visible:ring-destructive"
                              : ""
                          }
                        />
                        {errors.email && (
                          <p
                            id="email-error"
                            className="text-xs text-destructive mt-0.5"
                          >
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Research Collaboration Proposal"
                        required
                        aria-describedby={
                          errors.subject ? "subject-error" : undefined
                        }
                        data-ocid="contact-subject"
                        className={
                          errors.subject
                            ? "border-destructive focus-visible:ring-destructive"
                            : ""
                        }
                      />
                      {errors.subject && (
                        <p
                          id="subject-error"
                          className="text-xs text-destructive mt-0.5"
                        >
                          {errors.subject}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Tell me about your work and how we might collaborate…"
                        rows={6}
                        required
                        aria-describedby={
                          errors.message ? "message-error" : undefined
                        }
                        data-ocid="contact-message"
                        className={
                          errors.message
                            ? "border-destructive focus-visible:ring-destructive"
                            : ""
                        }
                      />
                      {errors.message && (
                        <p
                          id="message-error"
                          className="text-xs text-destructive mt-0.5"
                        >
                          {errors.message}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={isPending}
                      className="w-full h-11 text-base font-semibold"
                      data-ocid="contact-submit"
                    >
                      {isPending ? (
                        <>
                          <Spinner />
                          Sending…
                        </>
                      ) : (
                        "Send Message →"
                      )}
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
