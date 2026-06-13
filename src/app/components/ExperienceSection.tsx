import { motion } from "motion/react";

const experiences = [
  {
    type: "work",
    role: "Senior Full Stack Developer",
    company: "TechVision Indonesia",
    duration: "Jan 2022 — Present",
    location: "Jakarta, Indonesia · Remote",
    description: "Leading development of a B2B SaaS analytics platform serving 200+ enterprise clients. Architected microservices infrastructure that reduced latency by 60%. Mentoring a team of 5 junior developers.",
    highlights: ["Architected multi-tenant SaaS platform", "Reduced API response time by 60%", "Led team of 5 engineers", "Implemented CI/CD pipelines"],
    color: "var(--accent-primary)",
    logo: "TV",
  },
  {
    type: "work",
    role: "Full Stack Developer",
    company: "StartupHub Co.",
    duration: "Mar 2020 — Dec 2021",
    location: "Jakarta, Indonesia",
    description: "Built and scaled multiple web applications from 0 to 100K+ users. Developed real-time features using WebSockets and implemented GraphQL APIs. Collaborated with design and product teams in agile environment.",
    highlights: ["Built 3 products from 0 to 100K+ users", "Designed GraphQL API schema", "Implemented WebSocket real-time features", "A/B testing infrastructure"],
    color: "var(--accent-secondary)",
    logo: "SH",
  },
  {
    type: "work",
    role: "Frontend Developer",
    company: "Digital Agency Pro",
    duration: "Jun 2019 — Feb 2020",
    location: "Bandung, Indonesia",
    description: "Developed responsive web applications for 20+ clients across various industries. Specialized in React and modern JavaScript ecosystem. Improved Lighthouse scores from average 45 to 92+.",
    highlights: ["Delivered 20+ client projects", "Improved Lighthouse score to 92+", "Introduced React to the team", "Pixel-perfect UI implementation"],
    color: "var(--accent-tertiary)",
    logo: "DA",
  },
];

const education = [
  {
    degree: "S.Kom — Sistem Informasi",
    school: "Universitas Bina Nusantara",
    duration: "2015 — 2019",
    description: "GPA 3.82/4.00. Thesis: 'Real-time Collaborative Platform using WebSocket & Node.js'. Best Graduate Award 2019.",
    color: "var(--accent-success)",
    logo: "BN",
  },
];

function TimelineItem({
  item,
  index,
  isLast,
}: {
  item: (typeof experiences)[0];
  index: number;
  isLast: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      className="relative flex gap-8"
    >
      <div className="flex flex-col items-center">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border"
          style={{
            background: `${item.color}12`,
            borderColor: `${item.color}30`,
            boxShadow: `0 0 16px ${item.color}10`,
          }}
        >
          <span style={{ fontSize: "11px", fontWeight: 700, color: item.color, fontFamily: "JetBrains Mono, monospace" }}>
            {item.logo}
          </span>
        </div>
        {!isLast && (
          <div
            className="w-px flex-1 mt-4"
            style={{ background: `linear-gradient(to bottom, ${item.color}30, transparent)`, minHeight: "40px" }}
          />
        )}
      </div>

      <div className="pb-12 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
          <div>
            <h3 className="text-foreground" style={{ fontWeight: 700, fontSize: "1.05rem" }}>{item.role}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span style={{ fontSize: "14px", color: item.color, fontWeight: 500 }}>{item.company}</span>
              <span style={{ color: "rgba(var(--text-primary-rgb), 0.15)" }}>·</span>
              <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>{item.location}</span>
            </div>
          </div>
          <span
            className="px-3 py-1 rounded-lg border shrink-0"
            style={{
              fontSize: "11px",
              fontWeight: 500,
              color: "var(--text-muted)",
              borderColor: "rgba(var(--text-primary-rgb), 0.08)",
              background: "rgba(var(--text-primary-rgb), 0.02)",
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            {item.duration}
          </span>
        </div>

        <p className="mb-4 leading-relaxed" style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.7 }}>
          {item.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {item.highlights.map((h) => (
            <span
              key={h}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
              style={{ fontSize: "12px", color: "var(--text-secondary)", background: "rgba(var(--text-primary-rgb), 0.03)", border: "1px solid rgba(var(--text-primary-rgb), 0.06)" }}
            >
              <span className="w-1 h-1 rounded-full" style={{ background: item.color, flexShrink: 0 }} />
              {h}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function ExperienceSection() {
  return (
    <section id="experience" className="py-32 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 40% at 80% 30%, rgba(var(--accent-secondary-rgb), 0.05) 0%, transparent 100%)" }}
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
            Experience & Education
          </span>
          <h2 className="text-foreground mt-3">Where I've been<br />& what I've built.</h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <div className="flex items-center gap-3 mb-10">
              <span className="w-2 h-2 rounded-full" style={{ background: "var(--accent-primary)", boxShadow: "0 0 8px var(--accent-primary)" }} />
              <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "0.05em" }}>Work Experience</span>
            </div>
            {experiences.map((exp, i) => (
              <TimelineItem key={exp.company} item={exp} index={i} isLast={i === experiences.length - 1} />
            ))}
          </div>

          <div>
            <div className="flex items-center gap-3 mb-10">
              <span className="w-2 h-2 rounded-full" style={{ background: "var(--accent-secondary)", boxShadow: "0 0 8px var(--accent-secondary)" }} />
              <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "0.05em" }}>Education</span>
            </div>

            {education.map((edu, i) => (
              <motion.div
                key={edu.school}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="flex gap-8 mb-10"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border"
                  style={{ background: `${edu.color}12`, borderColor: `${edu.color}30` }}
                >
                  <span style={{ fontSize: "11px", fontWeight: 700, color: edu.color, fontFamily: "JetBrains Mono, monospace" }}>
                    {edu.logo}
                  </span>
                </div>
                <div>
                  <h3 className="text-foreground" style={{ fontWeight: 700, fontSize: "1.05rem" }}>{edu.degree}</h3>
                  <div className="flex items-center gap-2 mt-1 mb-3">
                    <span style={{ fontSize: "14px", color: edu.color, fontWeight: 500 }}>{edu.school}</span>
                    <span style={{ color: "rgba(var(--text-primary-rgb), 0.15)" }}>·</span>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>{edu.duration}</span>
                  </div>
                  <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.7 }}>{edu.description}</p>
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-2xl p-6 border"
              style={{ background: "var(--bg-surface)", borderColor: "rgba(var(--text-primary-rgb), 0.06)" }}
            >
              <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "16px" }}>Certifications</div>
              {[
                { name: "AWS Solutions Architect — Professional", issuer: "Amazon Web Services", year: "2023", color: "#F97316" },
                { name: "Google Cloud Professional Developer", issuer: "Google Cloud", year: "2022", color: "#60A5FA" },
                { name: "Meta React Developer", issuer: "Meta / Coursera", year: "2021", color: "#3B82F6" },
                { name: "MongoDB Associate Developer", issuer: "MongoDB University", year: "2021", color: "#68D391" },
              ].map((cert) => (
                <div
                  key={cert.name}
                  className="flex items-start gap-3 py-3 border-b last:border-0"
                  style={{ borderColor: "rgba(var(--text-primary-rgb), 0.05)" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: cert.color }} />
                  <div className="flex-1">
                    <div style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: 500 }}>{cert.name}</div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>{cert.issuer} · {cert.year}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
