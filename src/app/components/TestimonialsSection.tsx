import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "CTO at NexaLabs",
    avatar: "SC",
    color: "var(--accent-primary)",
    rating: 5,
    text: "Sword transformed our entire data pipeline into a beautiful, performant SaaS product. His attention to both technical architecture and user experience is rare. The platform has been running flawlessly for 18 months — zero critical incidents. Highly recommend.",
    project: "NexaFlow Analytics Platform",
  },
  {
    id: 2,
    name: "Marcus Weber",
    role: "Founder at FlowStack",
    avatar: "MW",
    color: "var(--accent-secondary)",
    rating: 5,
    text: "Working with Sword was a game-changer for us. He not only delivered the product on time but also proactively identified architectural issues we hadn't considered. The codebase he left behind is clean, documented, and our new team loves it. 10/10.",
    project: "FlowStack CRM Platform",
  },
  {
    id: 3,
    name: "Priya Sharma",
    role: "Product Manager at TechVision",
    avatar: "PS",
    color: "var(--accent-tertiary)",
    rating: 5,
    text: "Sword has an exceptional ability to translate complex product requirements into elegant technical solutions. He consistently delivers ahead of schedule and the quality is always production-ready. He's become an indispensable part of our engineering team.",
    project: "Internal Analytics Dashboard",
  },
  {
    id: 4,
    name: "David Kurniawan",
    role: "CEO at DigitalKraft",
    avatar: "DK",
    color: "var(--accent-success)",
    rating: 5,
    text: "From Day 1, Sword brought a level of professionalism and craftsmanship that raised our whole team's bar. He built our e-commerce platform from scratch in 3 months, and it now handles 50K+ monthly transactions without a hiccup. Outstanding work.",
    project: "CommercePro E-Commerce",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill="#F59E0B">
          <path d="M7 1l1.545 3.13 3.455.502-2.5 2.436.59 3.44L7 8.885l-3.09 1.623.59-3.44L2 4.632l3.455-.502L7 1z" />
        </svg>
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  const [active, setActive] = useState(0);

  const prev = () => setActive((i) => (i - 1 + testimonials.length) % testimonials.length);
  const next = () => setActive((i) => (i + 1) % testimonials.length);

  return (
    <section id="testimonials" className="py-32 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(var(--accent-secondary-rgb), 0.05) 0%, transparent 100%)" }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--accent-primary)" }}>
            Testimonials
          </span>
          <h2 className="text-foreground mt-3">What clients say<br />about working with me.</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {testimonials.map((t, i) => (
            <motion.button
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              onClick={() => setActive(i)}
              className="text-left rounded-2xl p-6 border transition-all duration-300"
              style={{
                background: active === i ? `${t.color}08` : "var(--bg-surface)",
                borderColor: active === i ? `${t.color}30` : "rgba(var(--text-primary-rgb), 0.06)",
                boxShadow: active === i ? `0 0 32px ${t.color}10` : "none",
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${t.color}20`, color: t.color, fontSize: "11px", fontWeight: 700, fontFamily: "JetBrains Mono, monospace" }}
                >
                  {t.avatar}
                </div>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>{t.name}</div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>{t.role}</div>
                </div>
              </div>
              <Stars count={t.rating} />
              <p className="mt-3 line-clamp-3" style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.6 }}>
                "{t.text}"
              </p>
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="relative rounded-2xl p-8 md:p-12 border overflow-hidden"
            style={{
              background: "var(--bg-surface)",
              borderColor: `${testimonials[active].color}20`,
            }}
          >
            <div
              className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
              style={{ background: `radial-gradient(circle, ${testimonials[active].color}08 0%, transparent 70%)` }}
            />

            <Quote
              className="absolute top-8 right-8 w-10 h-10 opacity-10"
              style={{ color: testimonials[active].color }}
            />

            <div className="flex items-center gap-4 mb-8">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold"
                style={{
                  background: `${testimonials[active].color}20`,
                  color: testimonials[active].color,
                  fontFamily: "JetBrains Mono, monospace",
                  border: `1px solid ${testimonials[active].color}30`,
                }}
              >
                {testimonials[active].avatar}
              </div>
              <div>
                <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)" }}>{testimonials[active].name}</div>
                <div style={{ fontSize: "13px", color: testimonials[active].color, marginTop: "2px" }}>{testimonials[active].role}</div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
                  Project: {testimonials[active].project}
                </div>
              </div>
              <div className="ml-auto">
                <Stars count={testimonials[active].rating} />
              </div>
            </div>

            <p className="leading-relaxed" style={{ fontSize: "1.1rem", color: "var(--text-secondary)", lineHeight: 1.8, fontStyle: "italic" }}>
              "{testimonials[active].text}"
            </p>

            <div className="flex items-center justify-between mt-8 pt-6 border-t" style={{ borderColor: "rgba(var(--text-primary-rgb), 0.06)" }}>
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className="transition-all duration-300 rounded-full"
                    style={{
                      width: active === i ? "24px" : "8px",
                      height: "8px",
                      background: active === i ? testimonials[active].color : "rgba(var(--text-primary-rgb), 0.15)",
                    }}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={prev}
                  className="w-9 h-9 rounded-lg border flex items-center justify-center transition-all duration-200 hover:border-[var(--text-primary)]/20 hover:bg-[var(--text-primary)]/5"
                  style={{ borderColor: "rgba(var(--text-primary-rgb), 0.08)", color: "var(--text-muted)" }}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={next}
                  className="w-9 h-9 rounded-lg border flex items-center justify-center transition-all duration-200 hover:border-[var(--text-primary)]/20 hover:bg-[var(--text-primary)]/5"
                  style={{ borderColor: "rgba(var(--text-primary-rgb), 0.08)", color: "var(--text-muted)" }}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
