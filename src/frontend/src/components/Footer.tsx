import { Link } from "@tanstack/react-router";
import { Linkedin, Mail, Youtube } from "lucide-react";

const QUICK_LINKS = [
  { to: "/research", label: "Research" },
  { to: "/articles", label: "Articles" },
  { to: "/publications", label: "Publications" },
  { to: "/notes", label: "Notes" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const SOCIAL = [
  {
    href: "https://www.youtube.com/@ashwinsinghchouhan5221",
    icon: Youtube,
    label: "YouTube",
  },
  {
    href: "https://linkedin.com/in/ashwin-singh-chouhan-abba34161",
    icon: Linkedin,
    label: "LinkedIn",
  },
  { href: "mailto:ashwinsingh26061992@gmail.com", icon: Mail, label: "Email" },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      className="bg-card border-t border-border mt-auto"
      data-ocid="site-footer"
    >
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <span className="font-display text-base font-semibold tracking-tight text-foreground">
              ASHWIN SINGH CHOUHAN
            </span>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Pharmacologist and researcher dedicated to advancing drug
              discovery and phytochemical sciences.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Pages
            </h4>
            <ul className="space-y-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Connect
            </h4>
            <div className="flex gap-3">
              {SOCIAL.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-muted hover:bg-primary hover:text-primary-foreground text-muted-foreground transition-smooth"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              ashwinsingh26061992@gmail.com
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>© {year} Ashwin Singh Chouhan. All rights reserved.</span>
          <span>
            Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== "undefined" ? window.location.hostname : "",
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors duration-200"
            >
              caffeine.ai
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
