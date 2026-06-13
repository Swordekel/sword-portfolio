import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { AboutSection } from "./components/AboutSection";
import { TechStack } from "./components/TechStack";
import { ProjectsSection } from "./components/ProjectsSection";
import { ExperienceSection } from "./components/ExperienceSection";
import { TestimonialsSection } from "./components/TestimonialsSection";
import { ContactSection } from "./components/ContactSection";
import { Footer } from "./components/Footer";

function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const intervals = [
      setTimeout(() => setProgress(30), 200),
      setTimeout(() => setProgress(65), 600),
      setTimeout(() => setProgress(90), 1000),
      setTimeout(() => setProgress(100), 1400),
      setTimeout(onDone, 1800),
    ];
    return () => intervals.forEach(clearTimeout);
  }, [onDone]);

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{ background: "var(--bg-base)" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(var(--accent-primary-rgb), 0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--accent-primary-rgb), 0.025) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-8"
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))", boxShadow: "0 0 40px rgba(var(--accent-primary-rgb), 0.3)" }}
        >
          <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "18px", fontWeight: 700, color: "var(--accent-foreground)" }}>SE</span>
        </div>

        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "0.05em" }}>Sword Ekel</div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>Portfolio</div>
        </div>

        <div className="w-48 relative">
          <div className="h-px w-full" style={{ background: "rgba(var(--text-primary-rgb), 0.08)" }} />
          <motion.div
            className="h-px absolute top-0 left-0"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{ background: "linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))", boxShadow: "0 0 8px rgba(var(--accent-primary-rgb), 0.6)" }}
          />
          <div
            className="text-center mt-3"
            style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", color: "var(--text-muted)" }}
          >
            {progress}%
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="min-h-screen text-foreground transition-colors duration-300" style={{ background: "var(--bg-base)", fontFamily: "Inter, system-ui, sans-serif" }}>
      <AnimatePresence>
        {loading && <LoadingScreen onDone={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Navbar />
          <main>
            <HeroSection />
            <div
              className="relative"
              style={{ background: "linear-gradient(to bottom, var(--bg-base) 0%, var(--bg-elevated) 50%, var(--bg-base) 100%)" }}
            >
              <AboutSection />
            </div>
            <div
              style={{
                background: "#080818",
                borderTop: "1px solid rgba(255,255,255,0.04)",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              <TechStack />
            </div>
            <ProjectsSection />
            <div
              style={{
                background: "#080818",
                borderTop: "1px solid rgba(255,255,255,0.04)",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              <ExperienceSection />
            </div>
            <TestimonialsSection />
            <div
              style={{
                background: "#080818",
                borderTop: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              <ContactSection />
            </div>
          </main>
          <Footer />
        </motion.div>
      )}
    </div>
  );
}
