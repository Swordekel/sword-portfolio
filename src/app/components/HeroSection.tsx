import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, MessageCircle, ChevronDown, Github, Linkedin, Twitter } from "lucide-react";

const roles = ["Full Stack Developer", "React Specialist", "Node.js Expert", "Cloud Architect", "Professional Vibe Coder"];

function useTypingEffect(words: string[], speed = 75, pause = 2200) {
  const [display, setDisplay] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIdx];
    let t: ReturnType<typeof setTimeout>;
    if (!deleting) {
      if (display.length < word.length) {
        t = setTimeout(() => setDisplay(word.slice(0, display.length + 1)), speed);
      } else {
        t = setTimeout(() => setDeleting(true), pause);
      }
    } else {
      if (display.length > 0) {
        t = setTimeout(() => setDisplay(display.slice(0, -1)), speed / 2);
      } else {
        setDeleting(false);
        setWordIdx((i) => (i + 1) % words.length);
      }
    }
    return () => clearTimeout(t);
  }, [display, deleting, wordIdx, words, speed, pause]);

  return display;
}

const socials = [
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Twitter, href: "#", label: "Twitter" },
];

export function HeroSection() {
  const typed = useTypingEffect(roles);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 pointer-events-none select-none">
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] left-[15%] w-[520px] h-[520px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(var(--accent-primary-rgb), 0.13) 0%, transparent 68%)", filter: "blur(48px)" }}
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 40, 0], scale: [1, 0.88, 1] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
          className="absolute top-[30%] right-[10%] w-[420px] h-[420px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(var(--accent-secondary-rgb), 0.11) 0%, transparent 68%)", filter: "blur(56px)" }}
        />
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          className="absolute bottom-[20%] left-[35%] w-[320px] h-[320px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(var(--accent-tertiary-rgb), 0.09) 0%, transparent 68%)", filter: "blur(64px)" }}
        />

        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "linear-gradient(rgba(var(--accent-primary-rgb), 0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--accent-primary-rgb), 0.025) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(var(--accent-primary-rgb), 0.04) 0%, transparent 100%)" }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[var(--accent-primary)]/20 bg-[var(--accent-primary)]/5 text-[var(--accent-primary)] mb-10"
          style={{ fontSize: "13px" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] animate-pulse" />
          Available for freelance & full-time opportunities
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mb-5 text-foreground"
          style={{ fontSize: "clamp(3rem, 9vw, 6rem)", fontWeight: 800, lineHeight: 1.04, letterSpacing: "-0.035em" }}
        >
          Hi, I'm{" "}
          <span
            className="bg-clip-text"
            style={{
              backgroundImage: "linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-tertiary) 50%, var(--accent-secondary) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Sword Ekel.
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="flex flex-wrap items-center justify-center gap-x-3 mb-8"
          style={{ fontSize: "clamp(1.25rem, 3vw, 1.75rem)" }}
        >
          <span style={{ color: "var(--text-muted)" }}>I am a</span>
          <span style={{ color: "var(--accent-primary)", fontWeight: 600, minWidth: "300px", textAlign: "left" }}>
            {typed}
            <span className="animate-pulse ml-0.5" style={{ color: "var(--accent-primary)" }}>|</span>
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65 }}
          className="max-w-2xl mx-auto leading-relaxed mb-12"
          style={{ color: "var(--text-muted)", fontSize: "1.0625rem" }}
        >
          I craft scalable, high-performance web applications that drive real business impact.
          From pixel-perfect frontends to robust backend architectures — I build digital products that matter.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.75 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <a
            href="#projects"
            className="group flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold transition-all duration-300"
            style={{
              background: "var(--accent-primary)",
              color: "var(--accent-foreground)",
              fontSize: "0.9375rem",
              boxShadow: "0 0 0 0 rgba(var(--accent-primary-rgb), 0)",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 48px rgba(var(--accent-primary-rgb), 0.4)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 0 rgba(var(--accent-primary-rgb), 0)"; }}
          >
            Lihat Projects
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </a>
          <a
            href="#contact"
            className="group flex items-center gap-2.5 px-7 py-3.5 rounded-xl transition-all duration-300 border"
            style={{
              color: "var(--text-primary)",
              fontSize: "0.9375rem",
              borderColor: "rgba(var(--text-primary-rgb), 0.1)",
              background: "transparent",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "rgba(var(--accent-secondary-rgb), 0.4)";
              el.style.background = "rgba(var(--accent-secondary-rgb), 0.08)";
              el.style.boxShadow = "0 0 32px rgba(var(--accent-secondary-rgb), 0.15)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "rgba(var(--text-primary-rgb), 0.1)";
              el.style.background = "transparent";
              el.style.boxShadow = "none";
            }}
          >
            <MessageCircle className="w-4 h-4" />
            Hubungi Saya
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="flex items-center justify-center gap-4"
        >
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              aria-label={s.label}
              className="w-10 h-10 rounded-xl border border-[var(--text-primary)]/8 flex items-center justify-center transition-all duration-200 hover:border-[var(--accent-primary)]/30 hover:bg-[var(--accent-primary)]/5 hover:shadow-[0_0_16px_rgba(var(--accent-primary-rgb), 0.1)]"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
            >
              <s.icon className="w-4 h-4" />
            </a>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span style={{ fontSize: "10px", color: "var(--text-muted)", letterSpacing: "0.2em", textTransform: "uppercase" }}>Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-4 h-4" style={{ color: "rgba(var(--accent-primary-rgb), 0.5)" }} />
        </motion.div>
      </motion.div>
    </section>
  );
}
