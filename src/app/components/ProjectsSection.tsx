import { useState, type ComponentType } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ExternalLink,
  Github,
  ArrowUpRight,
  Bot,
  Music,
  ShieldCheck,
  Car,
  Mic2,
  Leaf,
  Boxes,
} from "lucide-react";

const categories = ["All", "Web App", "Mobile"];

type IconType = ComponentType<{ className?: string; size?: number; strokeWidth?: number; style?: React.CSSProperties }>;

type Project = {
  id: number;
  title: string;
  description: string;
  icon: IconType;
  tags: string[];
  category: "Web App" | "Mobile";
  year: string;
  live: string | null;
  github: string;
  accent: string;
};

const projects: Project[] = [
  {
    id: 1,
    title: "Sword AI — Local Ollama Chat",
    description:
      "Cross-platform AI chat app powered by self-hosted Ollama. One Flutter codebase ships to Web, Android, iOS PWA, and Windows. Features tool calling, RAG, vision support, and persistent multi-conversation history.",
    icon: Bot,
    tags: ["Flutter", "Dart", "Ollama", "Qwen 2.5", "PWA"],
    category: "Mobile",
    year: "2026",
    live: null,
    github: "https://github.com/Swordekel/sword-ai",
    accent: "var(--accent-primary)",
  },
  {
    id: 2,
    title: "Lyrion — Spotify-style Music Player",
    description:
      "Flutter local music player with Spotify-inspired dark UI. Now Playing with vinyl rotation + glassmorphism overlay, LRC lyrics editor with real-time timestamp tapping, playlists, queue, and background audio.",
    icon: Music,
    tags: ["Flutter", "Dart", "just_audio", "Local Audio", "LRC"],
    category: "Mobile",
    year: "2026",
    live: null,
    github: "https://github.com/Swordekel/lyrion",
    accent: "var(--accent-secondary)",
  },
  {
    id: 3,
    title: "CyberPath — Cybersecurity Education",
    description:
      "Interactive cybersecurity learning platform built across multiple iterations as a class project. Modules covering web security fundamentals, OWASP basics, and hands-on challenges. Stack evolved from PHP to Next.js + TypeScript.",
    icon: ShieldCheck,
    tags: ["Next.js", "TypeScript", "Tailwind", "PHP"],
    category: "Web App",
    year: "2025",
    live: "https://cyberpath-finall.vercel.app",
    github: "https://github.com/Swordekel/CyberPath-Education-Cyber",
    accent: "var(--accent-tertiary)",
  },
  {
    id: 4,
    title: "TWHrenCar — Online Car Rental",
    description:
      "Car rental landing & booking interface with modern UI. Browse fleet, view rates, and submit inquiries — focused on clean UX and responsive design.",
    icon: Car,
    tags: ["HTML", "CSS", "JavaScript", "Vercel"],
    category: "Web App",
    year: "2026",
    live: "https://driveelite-gold.vercel.app",
    github: "https://github.com/Swordekel/TWHrenCar",
    accent: "var(--accent-success)",
  },
  {
    id: 5,
    title: "Lahila — Band Music Website",
    description:
      "Promotional website for a music band — showcasing discography, gigs, and bio with immersive visuals. Custom CSS animations bring the brand to life.",
    icon: Mic2,
    tags: ["HTML", "CSS", "Vercel"],
    category: "Web App",
    year: "2026",
    live: "https://lahila.vercel.app",
    github: "https://github.com/Swordekel/lahila",
    accent: "var(--accent-primary)",
  },
  {
    id: 6,
    title: "Papuyo — Healthy Pudding Business",
    description:
      "Business landing site for an Entrepreneurship class project at Binus. Selling low-sugar papaya pudding sweetened with stevia — built to validate a real product end-to-end, from branding to ordering UX.",
    icon: Leaf,
    tags: ["Next.js", "TypeScript", "Tailwind", "Business"],
    category: "Web App",
    year: "2025",
    live: "https://papuyo.vercel.app",
    github: "https://github.com/Swordekel/Papuyo",
    accent: "var(--accent-secondary)",
  },
  {
    id: 7,
    title: "Tetris × Blockchain",
    description:
      "Experimental Tetris clone with blockchain integration — exploring Web3 mechanics applied to a classic puzzle. Built to learn smart contract interaction patterns hands-on.",
    icon: Boxes,
    tags: ["Next.js", "TypeScript", "Web3"],
    category: "Web App",
    year: "2025",
    live: "https://tetris-blockchain-ten.vercel.app",
    github: "https://github.com/Swordekel/tetris-blockchain",
    accent: "var(--accent-tertiary)",
  },
];

export function ProjectsSection() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [hovered, setHovered] = useState<number | null>(null);

  const filtered =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="py-32 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 50% 50% at 50% 100%, rgba(var(--accent-primary-rgb), 0.04) 0%, transparent 100%)" }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--accent-primary)" }}>
              Selected Projects
            </span>
            <h2 className="text-foreground mt-3">Things I've shipped<br />or am still shipping.</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center gap-2 flex-wrap"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-4 py-1.5 rounded-lg border transition-all duration-200"
                style={{
                  fontSize: "13px",
                  fontWeight: 500,
                  color: activeCategory === cat ? "var(--accent-foreground)" : "var(--text-muted)",
                  background: activeCategory === cat ? "var(--accent-primary)" : "transparent",
                  borderColor: activeCategory === cat ? "var(--accent-primary)" : "rgba(var(--text-primary-rgb), 0.08)",
                  boxShadow: activeCategory === cat ? "0 0 20px rgba(var(--accent-primary-rgb), 0.3)" : "none",
                }}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => {
              const primaryHref = project.live ?? project.github;
              const Icon = project.icon;
              return (
                <motion.article
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="group relative rounded-2xl overflow-hidden border"
                  style={{ background: "var(--bg-surface)", borderColor: hovered === project.id ? `${project.accent}30` : "rgba(var(--text-primary-rgb), 0.06)" }}
                  onMouseEnter={() => setHovered(project.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <a
                    href={primaryHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative block overflow-hidden cursor-pointer"
                    style={{ height: "200px" }}
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(135deg, ${project.accent}28 0%, ${project.accent}08 60%, var(--bg-surface) 100%)`,
                      }}
                    />
                    <div
                      className="absolute inset-0 opacity-40"
                      style={{
                        backgroundImage: `radial-gradient(circle at 25% 50%, ${project.accent}30 0%, transparent 45%), radial-gradient(circle at 80% 30%, ${project.accent}18 0%, transparent 40%)`,
                      }}
                    />
                    <div className="relative h-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                      <Icon
                        size={88}
                        strokeWidth={1.25}
                        style={{ color: project.accent, opacity: 0.55, filter: `drop-shadow(0 8px 24px ${project.accent}40)` }}
                      />
                    </div>

                    <div
                      className="absolute inset-0 transition-opacity duration-300 flex items-center justify-center"
                      style={{ opacity: hovered === project.id ? 1 : 0, background: "rgba(0,0,0,0.35)" }}
                    >
                      <span
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold"
                        style={{ background: project.accent, color: "var(--accent-foreground)", fontSize: "13px" }}
                      >
                        {project.live ? "Visit Live Site" : "View on GitHub"}
                        <ArrowUpRight className="w-4 h-4" />
                      </span>
                    </div>

                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      <span
                        className="px-2.5 py-1 rounded-lg"
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          background: "rgba(0,0,0,0.5)",
                          color: "var(--text-secondary)",
                          backdropFilter: "blur(8px)",
                        }}
                      >
                        {project.category}
                      </span>
                      <span
                        className="px-2.5 py-1 rounded-lg"
                        style={{
                          fontSize: "11px",
                          color: "var(--text-muted)",
                          background: "rgba(0,0,0,0.5)",
                          fontFamily: "JetBrains Mono, monospace",
                          backdropFilter: "blur(8px)",
                        }}
                      >
                        {project.year}
                      </span>
                    </div>
                  </a>

                  <div className="p-6">
                    <h3
                      className="text-foreground mb-3 transition-colors duration-200"
                      style={{ fontSize: "1.05rem", fontWeight: 700 }}
                    >
                      {project.title}
                    </h3>
                    <p className="mb-5 leading-relaxed" style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.7 }}>
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-lg"
                          style={{
                            fontSize: "11px",
                            fontWeight: 500,
                            color: project.accent,
                            background: `${project.accent}10`,
                            border: `1px solid ${project.accent}20`,
                            fontFamily: "JetBrains Mono, monospace",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: "rgba(var(--text-primary-rgb), 0.06)" }}>
                      {project.live && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-4 py-2 rounded-lg border transition-all duration-200 hover:bg-[var(--text-primary)]/5"
                          style={{ fontSize: "12px", fontWeight: 500, color: "var(--text-primary)", borderColor: "rgba(var(--text-primary-rgb), 0.1)" }}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Live Demo
                        </a>
                      )}
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-[var(--text-primary)]/5"
                        style={{ fontSize: "12px", fontWeight: 500, color: "var(--text-muted)" }}
                      >
                        <Github className="w-3.5 h-3.5" />
                        Source
                      </a>
                      {!project.live && (
                        <span
                          className="ml-auto text-xs"
                          style={{ fontSize: "11px", color: "var(--text-muted)", fontStyle: "italic" }}
                        >
                          Self-hosted · no public demo
                        </span>
                      )}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-14"
        >
          <a
            href="https://github.com/Swordekel"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border transition-all duration-300 hover:border-[var(--accent-primary)]/30 hover:bg-[var(--accent-primary)]/5"
            style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-muted)", borderColor: "rgba(var(--text-primary-rgb), 0.08)" }}
          >
            View All Projects on GitHub
            <Github className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
