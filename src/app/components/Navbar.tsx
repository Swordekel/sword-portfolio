import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Download } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("Home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "backdrop-blur-2xl border-b shadow-[0_8px_32px_rgba(0,0,0,0.1)]"
          : "bg-transparent"
      }`}
      style={scrolled ? {
        backgroundColor: "rgba(var(--bg-base-rgb), 0.85)",
        borderColor: "var(--border-subtle)",
      } : {}}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-2.5 group" onClick={() => setActive("Home")}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center shadow-[0_0_16px_rgba(var(--accent-primary-rgb),0.3)]">
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", fontWeight: 700, color: "var(--accent-foreground)" }}>SE</span>
          </div>
          <span className="text-[var(--text-primary)] font-semibold tracking-tight">Sword Ekel</span>
        </a>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setActive(link.label)}
              className={`relative px-4 py-2 text-sm rounded-lg transition-all duration-200 group ${
                active === link.label
                  ? "text-[var(--accent-primary)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              {active === link.label && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-lg bg-[var(--accent-primary)]/8 border border-[var(--accent-primary)]/15"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative">{link.label}</span>
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <a
            href="#"
            className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--accent-primary)] border border-[var(--accent-primary)]/25 rounded-xl hover:bg-[var(--accent-primary)]/8 hover:border-[var(--accent-primary)]/50 hover:shadow-[0_0_24px_rgba(var(--accent-primary-rgb),0.15)] transition-all duration-300"
          >
            <Download className="w-3.5 h-3.5" />
            Download CV
          </a>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden backdrop-blur-2xl border-b overflow-hidden"
            style={{
              backgroundColor: "rgba(var(--bg-base-rgb), 0.95)",
              borderColor: "var(--border-subtle)",
            }}
          >
            <div className="px-6 py-5 flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => { setActive(link.label); setMenuOpen(false); }}
                  className="px-4 py-3 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--text-primary)]/5 rounded-lg transition-all duration-200"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-2 border-t mt-2" style={{ borderColor: "var(--border-subtle)" }}>
                <a
                  href="#"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--accent-primary)] border border-[var(--accent-primary)]/25 rounded-xl hover:bg-[var(--accent-primary)]/8 transition-all duration-300 w-fit"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download CV
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
