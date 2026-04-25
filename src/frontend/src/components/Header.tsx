import { Button } from "@/components/ui/button";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/research", label: "Research" },
  { to: "/articles", label: "Articles" },
  { to: "/publications", label: "Publications" },
  { to: "/notes", label: "Notes" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { location } = useRouterState();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const pathname = location.pathname;
  const prevPathRef = useRef(pathname);
  if (prevPathRef.current !== pathname) {
    prevPathRef.current = pathname;
    setMobileOpen(false);
  }

  return (
    <header
      data-ocid="site-header"
      className={`sticky top-0 z-50 bg-card border-b transition-smooth ${
        scrolled ? "shadow-elevated" : "border-border/50"
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-foreground hover:text-primary transition-colors duration-200"
          data-ocid="nav-logo"
        >
          <img
            src="/assets/images/logo.png"
            alt="Ashwin Singh Chouhan"
            className="logo-avatar"
          />
        </Link>

        {/* Desktop Nav */}
        <nav
          className="hidden md:flex items-center gap-1"
          data-ocid="nav-desktop"
        >
          {NAV_LINKS.map((link) => {
            const isActive =
              link.to === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-1.5 text-sm font-medium tracking-wide transition-colors duration-200 relative group ${
                  isActive
                    ? "text-accent"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-accent rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          data-ocid="nav-mobile-toggle"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div
          className="md:hidden border-t border-border bg-card animate-fade-in"
          data-ocid="nav-mobile"
        >
          <nav className="container py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.to === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
