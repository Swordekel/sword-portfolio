import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ExternalLink, Github, ArrowUpRight } from "lucide-react";

const categories = ["All", "Web App", "SaaS", "Mobile", "API"];

const projects = [
  {
    id: 1,
    title: "NexaFlow — SaaS Analytics Platform",
    description: "Real-time analytics dashboard with multi-tenant architecture, custom reporting engine, and AI-powered insights. Handles 10M+ events/month.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&h=560&fit=crop&auto=format&q=80",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "Redis", "Stripe", "AWS"],
    category: "SaaS",
    year: "2024",
    live: "#",
    github: "#",
    accent: "var(--accent-primary)",
  },
  {
    id: 2,
    title: "CommercePro — E-Commerce Platform",
    description: "Full-featured e-commerce solution with advanced inventory management, real-time order tracking, and seamless payment integrations. 50K+ monthly transactions.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&h=560&fit=crop&auto=format&q=80",
    tags: ["React", "Node.js", "MongoDB", "Stripe", "Docker", "Redis"],
    category: "Web App",
    year: "2024",
    live: "#",
    github: "#",
    accent: "var(--accent-secondary)",
  },
  {
    id: 3,
    title: "DevCollab — Real-time Workspace",
    description: "Collaborative coding environment with live code sharing, video calls, AI pair programming assistant, and GitHub integration. Loved by 5K+ developers.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900&h=560&fit=crop&auto=format&q=80",
    tags: ["React", "WebSocket", "Node.js", "WebRTC", "OpenAI", "PostgreSQL"],
    category: "Web App",
    year: "2023",
    live: "#",
    github: "#",
    accent: "var(--accent-tertiary)",
  },
  {
    id: 4,
    title: "FinanceApp — Mobile Banking UI",
    description: "Premium mobile banking interface with biometric authentication, spending analytics, investment portfolio tracking, and P2P transfers.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=900&h=560&fit=crop&auto=format&q=80",
    tags: ["React Native", "TypeScript", "Node.js", "MongoDB", "Plaid API"],
    category: "Mobile",
    year: "2023",
    live: "#",
    github: "#",
    accent: "var(--accent-success)",
  },
];

export function ProjectsSection() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [hovered, setHovered] = useState<number | null>(null);

  const filtered = activeCategory === "All" ? projects : projects.filter((p) => p.category === activeCategory);

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
              Featured Projects
            </span>
            <h2 className="text-foreground mt-3">Work that speaks<br />for itself.</h2>
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
            {filtered.map((project, i) => (
              <motion.article
                key={project.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group relative rounded-2xl overflow-hidden border cursor-pointer"
                style={{ background: "var(--bg-surface)", borderColor: hovered === project.id ? `${project.accent}30` : "rgba(var(--text-primary-rgb), 0.06)" }}
                onMouseEnter={() => setHovered(project.id)}
                onMouseLeave={() => setHovered(null)}
              >
                <div className="relative overflow-hidden" style={{ height: "220px" }}>
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    style={{ filter: "saturate(0.85)" }}
                  />
                  <div
                    className="absolute inset-0 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(to top, var(--bg-surface) 0%, rgba(var(--bg-base-rgb), 0.6) 50%, rgba(0,0,0,0.2) 100%)`,
                    }}
                  />
                  <div
                    className="absolute inset-0 transition-opacity duration-300 flex items-center justify-center"
                    style={{ opacity: hovered === project.id ? 1 : 0, background: `rgba(0,0,0,0.3)` }}
                  >
                    <span
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300"
                      style={{ background: project.accent, color: "var(--accent-foreground)", fontSize: "13px" }}
                    >
                      View Case Study
                      <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </div>

                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <span
                      className="px-2.5 py-1 rounded-lg"
                      style={{ fontSize: "11px", fontWeight: 600, background: "rgba(0,0,0,0.5)", color: "var(--text-muted)", backdropFilter: "blur(8px)" }}
                    >
                      {project.category}
                    </span>
                    <span
                      className="px-2.5 py-1 rounded-lg"
                      style={{ fontSize: "11px", color: "var(--text-muted)", background: "rgba(0,0,0,0.5)", fontFamily: "JetBrains Mono, monospace", backdropFilter: "blur(8px)" }}
                    >
                      {project.year}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-foreground mb-3 transition-colors duration-200 group-hover:text-[var(--text-primary)]" style={{ fontSize: "1.05rem", fontWeight: 700 }}>
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
                    <a
                      href={project.live}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg border transition-all duration-200 hover:bg-[var(--text-primary)]/5"
                      style={{ fontSize: "12px", fontWeight: 500, color: "var(--text-primary)", borderColor: "rgba(var(--text-primary-rgb), 0.1)" }}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Live Demo
                    </a>
                    <a
                      href={project.github}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-[var(--text-primary)]/5"
                      style={{ fontSize: "12px", fontWeight: 500, color: "var(--text-muted)" }}
                    >
                      <Github className="w-3.5 h-3.5" />
                      Source
                    </a>
                  </div>
                </div>
              </motion.article>
            ))}
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
            href="#"
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
