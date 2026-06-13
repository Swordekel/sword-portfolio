import { motion } from "motion/react";

const techs = [
  { name: "React", color: "#61DAFB", bg: "rgba(97,218,251,0.08)" },
  { name: "Next.js", color: "var(--text-primary)", bg: "rgba(240,240,255,0.06)" },
  { name: "TypeScript", color: "#3B82F6", bg: "rgba(59,130,246,0.08)" },
  { name: "Node.js", color: "#68D391", bg: "rgba(104,211,145,0.08)" },
  { name: "Python", color: "#F6E05E", bg: "rgba(246,224,94,0.08)" },
  { name: "Tailwind CSS", color: "#38BDF8", bg: "rgba(56,189,248,0.08)" },
  { name: "PostgreSQL", color: "#A78BFA", bg: "rgba(167,139,250,0.08)" },
  { name: "MongoDB", color: "#68D391", bg: "rgba(104,211,145,0.08)" },
  { name: "Docker", color: "#60A5FA", bg: "rgba(96,165,250,0.08)" },
  { name: "AWS", color: "#F97316", bg: "rgba(249,115,22,0.08)" },
  { name: "GraphQL", color: "#E879F9", bg: "rgba(232,121,249,0.08)" },
  { name: "Redis", color: "#F87171", bg: "rgba(248,113,113,0.08)" },
  { name: "Prisma", color: "#C084FC", bg: "rgba(192,132,252,0.08)" },
  { name: "Kubernetes", color: "#60A5FA", bg: "rgba(96,165,250,0.08)" },
  { name: "Terraform", color: "#A78BFA", bg: "rgba(167,139,250,0.08)" },
  { name: "Git", color: "#FB923C", bg: "rgba(251,146,60,0.08)" },
];

const levels = [
  { label: "React / Next.js", pct: 96, color: "var(--accent-primary)" },
  { label: "TypeScript / JavaScript", pct: 94, color: "#3B82F6" },
  { label: "Node.js / Express", pct: 91, color: "#68D391" },
  { label: "PostgreSQL / MongoDB", pct: 87, color: "#A78BFA" },
  { label: "Docker / Kubernetes", pct: 82, color: "#60A5FA" },
  { label: "AWS / Cloud", pct: 79, color: "#F97316" },
];

function SkillBar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between mb-2">
        <span style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>{pct}%</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(var(--text-primary-rgb), 0.06)" }}>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}80, ${color})`, boxShadow: `0 0 8px ${color}60` }}
        />
      </div>
    </motion.div>
  );
}

export function TechStack() {
  const doubled = [...techs, ...techs];

  return (
    <section id="tech" className="py-32 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 40% at 20% 50%, rgba(var(--accent-primary-rgb), 0.04) 0%, transparent 100%)" }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <span style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--accent-primary)" }}>
            Tech Stack
          </span>
          <h2 className="text-foreground mt-3">Tools & technologies<br />I work with daily.</h2>
        </motion.div>

        <div className="overflow-hidden mb-24 relative">
          <div
            className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
            style={{ background: "linear-gradient(90deg, var(--bg-base) 0%, transparent 100%)" }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
            style={{ background: "linear-gradient(270deg, var(--bg-base) 0%, transparent 100%)" }}
          />
          <motion.div
            animate={{ x: [0, "-50%"] }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
            className="flex gap-4 w-max"
          >
            {doubled.map((tech, i) => (
              <div
                key={`${tech.name}-${i}`}
                className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl border whitespace-nowrap cursor-default transition-all duration-200 hover:scale-105"
                style={{
                  background: tech.bg,
                  borderColor: `${tech.color}25`,
                  fontSize: "13px",
                  fontWeight: 600,
                  color: tech.color,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${tech.color}20`;
                  (e.currentTarget as HTMLElement).style.borderColor = `${tech.color}50`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  (e.currentTarget as HTMLElement).style.borderColor = `${tech.color}25`;
                }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: tech.color, boxShadow: `0 0 6px ${tech.color}` }}
                />
                {tech.name}
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 gap-10 items-start"
        >
          <div>
            <h3 className="text-foreground mb-8" style={{ fontWeight: 600, fontSize: "1.1rem" }}>
              Proficiency Levels
            </h3>
            <div className="flex flex-col gap-6">
              {levels.map((l) => (
                <SkillBar key={l.label} {...l} />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { title: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "ShadCN UI"], color: "var(--accent-primary)" },
              { title: "Backend", items: ["Node.js", "Python", "Express", "FastAPI", "GraphQL", "REST API"], color: "#68D391" },
              { title: "Database", items: ["PostgreSQL", "MongoDB", "Redis", "Prisma ORM", "Supabase", "PlanetScale"], color: "#A78BFA" },
              { title: "DevOps", items: ["Docker", "Kubernetes", "AWS", "Vercel", "GitHub Actions", "Terraform"], color: "#F97316" },
            ].map((cat) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="rounded-xl p-5 border"
                style={{ background: "var(--bg-surface)", borderColor: "rgba(var(--text-primary-rgb), 0.06)" }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full" style={{ background: cat.color, boxShadow: `0 0 8px ${cat.color}` }} />
                  <span style={{ fontSize: "12px", fontWeight: 600, color: cat.color, letterSpacing: "0.05em" }}>{cat.title}</span>
                </div>
                <ul className="flex flex-col gap-2">
                  {cat.items.map((item) => (
                    <li key={item} style={{ fontSize: "12px", color: "var(--text-muted)" }}>{item}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
