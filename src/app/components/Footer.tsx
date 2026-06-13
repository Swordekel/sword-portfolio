import { motion } from "motion/react";
import { Github, Linkedin, Twitter, Heart } from "lucide-react";

const links = {
  Navigation: [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Projects", href: "#projects" },
    { label: "Experience", href: "#experience" },
    { label: "Contact", href: "#contact" },
  ],
  Services: [
    { label: "Web Development", href: "#" },
    { label: "API Development", href: "#" },
    { label: "Cloud Architecture", href: "#" },
    { label: "Tech Consulting", href: "#" },
    { label: "Code Review", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="relative border-t overflow-hidden" style={{ borderColor: "rgba(var(--text-primary-rgb), 0.06)" }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 80% at 50% 100%, rgba(var(--accent-primary-rgb), 0.03) 0%, transparent 100%)" }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2">
            <a href="#home" className="flex items-center gap-2.5 mb-5">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))", boxShadow: "0 0 16px rgba(var(--accent-primary-rgb), 0.25)" }}
              >
                <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", fontWeight: 700, color: "var(--accent-foreground)" }}>SE</span>
              </div>
              <span style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)" }}>Sword Ekel</span>
            </a>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.8, maxWidth: "280px" }}>
              Full Stack Developer specializing in building exceptional digital products. Based in Jakarta, available globally.
            </p>
            <div className="flex gap-3 mt-6">
              {[
                { icon: Github, href: "#" },
                { icon: Linkedin, href: "#" },
                { icon: Twitter, href: "#" },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  className="w-9 h-9 rounded-lg border flex items-center justify-center transition-all duration-200 hover:border-[var(--accent-primary)]/30 hover:bg-[var(--accent-primary)]/5"
                  style={{ borderColor: "rgba(var(--text-primary-rgb), 0.08)", color: "var(--text-muted)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "0.08em", marginBottom: "16px" }}>
                {title}
              </div>
              <ul className="flex flex-col gap-3">
                {items.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      style={{ fontSize: "13px", color: "var(--text-muted)" }}
                      className="transition-colors duration-200 hover:text-foreground"
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="pt-6 border-t flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderColor: "rgba(var(--text-primary-rgb), 0.06)" }}
        >
          <div className="flex items-center gap-1.5" style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            <span>© 2025 Sword Ekel. Built with</span>
            <Heart className="w-3 h-3" style={{ color: "#FF6B6B", fill: "#FF6B6B" }} />
            <span>using React & Tailwind CSS.</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--accent-primary)" }} />
            <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
