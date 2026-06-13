import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Code2, Users, Briefcase, Award } from "lucide-react";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
}

const stats = [
  { icon: Briefcase, label: "Years Experience", value: 5, suffix: "+" },
  { icon: Code2, label: "Projects Completed", value: 60, suffix: "+" },
  { icon: Users, label: "Happy Clients", value: 35, suffix: "+" },
  { icon: Award, label: "Awards Won", value: 8, suffix: "" },
];

const skills = [
  "System Architecture", "API Design", "Performance Optimization",
  "Team Leadership", "Code Review", "CI/CD Pipelines",
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export function AboutSection() {
  return (
    <section id="about" className="py-32 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 40% at 80% 50%, rgba(var(--accent-secondary-rgb), 0.06) 0%, transparent 100%)" }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <span style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--accent-primary)" }}>
            About Me
          </span>
          <h2 className="text-foreground mt-3">Crafting digital products<br />with purpose & precision.</h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative"
          >
            <div className="relative w-full max-w-sm mx-auto lg:mx-0">
              <div
                className="absolute -inset-px rounded-2xl"
                style={{ background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))", padding: "1px" }}
              >
                <div className="w-full h-full rounded-2xl" style={{ background: "var(--bg-surface)" }} />
              </div>
              <div
                className="absolute -inset-px rounded-2xl overflow-hidden"
                style={{ background: "linear-gradient(135deg, rgba(var(--accent-primary-rgb), 0.4), rgba(var(--accent-secondary-rgb), 0.4))" }}
              />
              <img
                src="/image-profile.jpeg"
                alt="Sword Ekel — Full Stack Developer"
                className="relative rounded-2xl w-full object-cover"
                style={{ height: "420px", filter: "saturate(0.9)" }}
              />
              <div
                className="absolute inset-0 rounded-2xl"
                style={{ background: "linear-gradient(to top, rgba(var(--bg-base-rgb), 0.7) 0%, transparent 50%)" }}
              />

              <div
                className="absolute -bottom-5 -right-5 rounded-xl border px-5 py-4"
                style={{ background: "var(--bg-surface)", borderColor: "rgba(var(--accent-primary-rgb), 0.15)", backdropFilter: "blur(12px)" }}
              >
                <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>Currently building</div>
                <div style={{ fontSize: "14px", color: "var(--text-primary)", fontWeight: 600 }}>SaaS Platform</div>
                <div style={{ fontSize: "12px", color: "var(--accent-primary)", marginTop: "4px" }}>Next.js + Supabase</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <p className="leading-relaxed mb-6" style={{ color: "var(--text-secondary)", fontSize: "1.0625rem", lineHeight: 1.8 }}>
              Saya adalah Full Stack Developer & Professional Vibe Coder dengan pengalaman lebih dari 5 tahun membangun aplikasi web modern yang skalabel dan berperforma tinggi. Passionate tentang clean code, user experience, dan teknologi terbaru.
            </p>
            <p className="leading-relaxed mb-10" style={{ color: "var(--text-muted)", fontSize: "0.9375rem", lineHeight: 1.8 }}>
              Dari startup hingga perusahaan enterprise, saya telah membantu berbagai klien mewujudkan visi digital mereka — dengan pendekatan yang selalu mengutamakan kualitas, kecepatan, dan maintainability.
            </p>

            <div className="flex flex-wrap gap-2 mb-12">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 rounded-lg border"
                  style={{
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "var(--text-muted)",
                    borderColor: "rgba(var(--text-primary-rgb), 0.08)",
                    background: "rgba(var(--text-primary-rgb), 0.02)",
                    letterSpacing: "0.01em",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
                  className="rounded-xl p-5 border group hover:border-[var(--accent-primary)]/20 transition-all duration-300"
                  style={{ background: "var(--bg-surface)", borderColor: "rgba(var(--text-primary-rgb), 0.06)" }}
                >
                  <stat.icon className="w-4 h-4 mb-3" style={{ color: "var(--accent-primary)" }} />
                  <div style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.1 }}>
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
