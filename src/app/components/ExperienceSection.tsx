import { motion } from "motion/react";

const experiences = [
  {
    type: "work",
    role: "Cyber Security Analyst Intern",
    company: "PT INTI SIBER NET",
    duration: "Feb 2026 — Feb 2027",
    location: "Indonesia · Internship · 12 months",
    description:
      "Performing security assessments on internal web applications, documenting findings through formal penetration test reports, and supporting the security team on vulnerability triage and remediation tracking.",
    highlights: [
      "Web application pentesting",
      "Pentest report writing",
      "Vulnerability analysis",
      "Security documentation",
    ],
    color: "var(--accent-primary)",
    logo: "IS",
    current: true,
  },
];

const education = [
  {
    degree: "S1 Cyber Security",
    school: "Binus University",
    duration: "Ongoing",
    description:
      "Faculty of Computer Science — coursework spans secure programming, network defense, system & network administration, and applied web security.",
    color: "var(--accent-secondary)",
    logo: "BN",
  },
];

const practicalFocus = [
  {
    name: "HackTheBox · @Swokel",
    issuer: "Active practice in offensive security labs & challenges",
    color: "var(--accent-primary)",
  },
  {
    name: "20+ Shipped Projects",
    issuer: "github.com/Swordekel — full-stack apps, deployed on Vercel",
    color: "var(--accent-secondary)",
  },
  {
    name: "Web Application Pentesting",
    issuer: "Hands-on practice through internship engagements",
    color: "var(--accent-tertiary)",
  },
  {
    name: "Full-Stack Development",
    issuer: "React, Next.js, TypeScript, PHP, modern web stack",
    color: "var(--accent-success)",
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
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-foreground" style={{ fontWeight: 700, fontSize: "1.05rem" }}>{item.role}</h3>
              {item.current && (
                <span
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border"
                  style={{
                    fontSize: "10px",
                    fontWeight: 600,
                    color: "var(--accent-success)",
                    borderColor: "rgba(var(--accent-success-rgb), 0.3)",
                    background: "rgba(var(--accent-success-rgb), 0.08)",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                >
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: "var(--accent-success)" }} />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: "var(--accent-success)" }} />
                  </span>
                  Current
                </span>
              )}
            </div>
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
          <h2 className="text-foreground mt-3">Where I've been<br />& what I'm building.</h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <div className="flex items-center gap-3 mb-10">
              <span className="w-2 h-2 rounded-full" style={{ background: "var(--accent-primary)", boxShadow: "0 0 8px var(--accent-primary)" }} />
              <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "0.05em" }}>Experience</span>
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
              <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>Practical Focus</div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "16px", lineHeight: 1.5 }}>
                Where my skills come from — practice over paper.
              </div>
              {practicalFocus.map((item) => (
                <div
                  key={item.name}
                  className="flex items-start gap-3 py-3 border-b last:border-0"
                  style={{ borderColor: "rgba(var(--text-primary-rgb), 0.05)" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: item.color }} />
                  <div className="flex-1">
                    <div style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: 500 }}>{item.name}</div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px", lineHeight: 1.5 }}>{item.issuer}</div>
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
