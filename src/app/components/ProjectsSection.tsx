import { useEffect, useState, type ComponentType } from "react";
import { createPortal } from "react-dom";
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
  Fish,
  X,
  Check,
} from "lucide-react";

const categories = ["All", "Web App", "Mobile"];

type IconType = ComponentType<{ className?: string; size?: number; strokeWidth?: number; style?: React.CSSProperties }>;

type GallerySlot = {
  title: string;
  /** Optional path under public/. Falls back to gradient placeholder if absent. */
  image?: string;
};

type Project = {
  id: number;
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  features: string[];
  /** Optional hero image displayed in the modal banner instead of the gradient + icon. */
  heroImage?: string;
  gallery: GallerySlot[];
  icon: IconType;
  tags: string[];
  category: "Web App" | "Mobile";
  year: string;
  live: string | null;
  github: string;
  accent: string;
};

/**
 * To add real screenshots: drop image files into
 *   public/projects/<slug>/01.png (02.png, 03.png ...)
 * then set `image: "/projects/<slug>/01.png"` on the matching gallery slot.
 * Missing images automatically fall back to a styled gradient placeholder.
 */
const projects: Project[] = [
  {
    id: 1,
    slug: "sword-ai",
    title: "Sword AI — Local Ollama Chat",
    description:
      "Cross-platform AI chat app powered by self-hosted Ollama. One Flutter codebase ships to Web, Android, iOS PWA, and Windows.",
    longDescription:
      "Sword AI is a fully local AI chat experience — no cloud, no API keys, no per-token costs. The Flutter client runs everywhere (Web, Android, iOS PWA, Windows) and talks to a self-hosted Ollama server running open-weights models like Qwen 2.5 7B on consumer hardware (RTX 3060 Ti class). Conversations stay on-device with privacy-first storage. Architected with tool calling, RAG, and vision-capable model support for daily use, not just a demo.",
    features: [
      "Single Flutter codebase ships to Web, Android, iOS PWA, and Windows",
      "Self-hosted Ollama backend — zero API keys or cloud costs",
      "Tool calling: file operations, system info, web search",
      "RAG service with persistent memory entries",
      "Vision-capable model support (multimodal chat)",
      "Multi-conversation history stored locally per device",
      "Configurable model picker (Qwen, Llama, custom)",
    ],
    heroImage: "/projects/sword-ai/gambar utama no watermark.jpg",
    gallery: [
      { title: "Chat Screen", image: "/projects/sword-ai/Chat Screen.png" },
      { title: "Model Picker", image: "/projects/sword-ai/Model Picker.png" },
      { title: "Tool Use Demo", image: "/projects/sword-ai/Tool Use Demo.png" },
      { title: "Mobile View", image: "/projects/sword-ai/mobile Screen.png" },
    ],
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
    slug: "lyrion",
    title: "Lyrion — Spotify-style Music Player",
    description:
      "Flutter local music player with Spotify-inspired dark UI, vinyl rotation, glassmorphism, and a real-time LRC lyrics editor.",
    longDescription:
      "Lyrion (Vibe Music) is a Flutter music player that takes the Spotify visual language and applies it to a fully local-first library. Built for users who own their music files. Features a vinyl-rotating Now Playing screen with video background and glassmorphism overlay, a full LRC lyrics editor with real-time timestamp tap-set, playlists, album views, queue management, and background audio that keeps playing when the screen locks on Android.",
    features: [
      "Local-first library — MP3, FLAC, WAV, AAC, M4A",
      "Spotify-inspired dark UI with smooth motion",
      "Now Playing: vinyl rotation, video background, glassmorphism",
      "LRC lyrics auto-scroll with real-time tap-set editor",
      "Playlist & album management with custom cover art",
      "Search by title, artist, or album",
      "Queue with shuffle / repeat (off · all · one)",
      "Background audio on Android — survives screen lock",
    ],
    gallery: [
      { title: "Now Playing" },
      { title: "Library" },
      { title: "LRC Editor" },
    ],
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
    slug: "cyberpath",
    title: "CyberPath — Cybersecurity Education",
    description:
      "Interactive cybersecurity learning platform built across multiple iterations as a class project. Modules covering web security and OWASP basics.",
    longDescription:
      "CyberPath is an interactive cybersecurity learning platform built over multiple iterations as a class project at Binus. The latest version uses Next.js + TypeScript + Tailwind for the frontend with hands-on modules covering OWASP basics, web app security, and beginner-friendly challenge tracks. The project went through PHP → Next.js evolution, demonstrating end-to-end ownership of stack decisions.",
    features: [
      "Multi-iteration evolution from PHP backend to Next.js + TS",
      "Web security fundamentals & OWASP-aligned content",
      "Interactive hands-on challenge modules",
      "Tailwind UI with responsive design",
      "Built as a Binus class project",
    ],
    gallery: [
      { title: "Landing Page" },
      { title: "Course Module" },
      { title: "Challenge UI" },
    ],
    icon: ShieldCheck,
    tags: ["Next.js", "TypeScript", "Tailwind", "PHP"],
    category: "Web App",
    year: "2025",
    live: "https://cyberpath-real.vercel.app/",
    github: "https://github.com/Swordekel/CyberPath-Education-Cyber",
    accent: "var(--accent-tertiary)",
  },
  {
    id: 4,
    slug: "twhrencar",
    title: "TWHrenCar — Online Car Rental",
    description:
      "Car rental landing & booking interface with modern UI. Browse fleet, view rates, and submit inquiries.",
    longDescription:
      "TWHrenCar is a car rental landing and booking interface focused on clean UX. Visitors can browse the fleet by vehicle category, view daily rates, and submit booking inquiries. Built with vanilla HTML/CSS/JavaScript to demonstrate UI design and responsive layout fundamentals without framework overhead.",
    features: [
      "Fleet browsing by vehicle category",
      "Daily rate display per car",
      "Booking inquiry form",
      "Responsive layout for mobile",
      "Pure HTML/CSS/JavaScript — no framework overhead",
      "Deployed on Vercel",
    ],
    gallery: [
      { title: "Hero" },
      { title: "Fleet Grid" },
      { title: "Booking Form" },
    ],
    icon: Car,
    tags: ["HTML", "CSS", "JavaScript", "Vercel"],
    category: "Web App",
    year: "2026",
    live: "https://twhrentcar.vercel.app/",
    github: "https://github.com/Swordekel/TWHrenCar",
    accent: "var(--accent-success)",
  },
  {
    id: 5,
    slug: "lahila",
    title: "Lahila — Band Music Website",
    description:
      "Promotional website for a music band — showcasing discography, gigs, and bio with immersive visuals.",
    longDescription:
      "Lahila is a promotional website for a music band — built to showcase identity, discography, and gig schedule with immersive visuals. Custom CSS animations and atmospheric color treatments bring the brand's vibe to life from first scroll.",
    features: [
      "Band identity, discography, and gigs showcase",
      "Custom CSS animations",
      "Immersive atmospheric color treatments",
      "Responsive layout",
      "Deployed on Vercel",
    ],
    gallery: [
      { title: "Hero" },
      { title: "Discography" },
      { title: "Gigs" },
    ],
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
    slug: "papuyo",
    title: "Papuyo — Healthy Pudding Business",
    description:
      "Business landing site for an Entrepreneurship class project at Binus. Selling low-sugar papaya pudding sweetened with stevia.",
    longDescription:
      "Papuyo is a healthy-food business landing built as my final project for the Entrepreneurship course at Binus University. The product is low-sugar papaya pudding sweetened with stevia — designed for health-conscious consumers. The site validates the business end-to-end: branding, product positioning, ordering UX, and a clear conversion funnel.",
    features: [
      "Branding for low-sugar papaya pudding product",
      "Stevia-based sweetener positioning",
      "Order inquiry funnel",
      "Built as Binus Entrepreneurship final project",
      "End-to-end business validation (product → pitch → site)",
      "Next.js + TypeScript + Tailwind stack",
    ],
    gallery: [
      { title: "Hero" },
      { title: "Product Detail" },
      { title: "Order Form" },
    ],
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
    slug: "tetris-blockchain",
    title: "Tetris × Blockchain",
    description:
      "Experimental Tetris clone with blockchain integration — exploring Web3 mechanics applied to a classic puzzle game.",
    longDescription:
      "Tetris × Blockchain is an experimental remix of the classic puzzle game with Web3 mechanics layered in. Built to explore smart contract interaction patterns from the client side — wallet connect, transaction state, on-chain score persistence — without overcomplicating the gameplay loop. A sandbox for learning Web3 dev primitives hands-on.",
    features: [
      "Classic Tetris gameplay loop",
      "Web3 wallet connect integration",
      "On-chain score persistence experiment",
      "Smart contract interaction sandbox",
      "TypeScript + Next.js stack",
      "Hands-on Web3 learning project",
    ],
    gallery: [
      { title: "Game Board" },
      { title: "Wallet Connect" },
      { title: "Score Sync" },
    ],
    icon: Boxes,
    tags: ["Next.js", "TypeScript", "Web3"],
    category: "Web App",
    year: "2025",
    live: "https://tetris-blockchain-ten.vercel.app",
    github: "https://github.com/Swordekel/tetris-blockchain",
    accent: "var(--accent-tertiary)",
  },
  {
    id: 8,
    slug: "dunia-anura",
    title: "Dunia Anura — Exotic Frog & Marine Fish Showcase",
    description:
      "Aesthetic showcase platform for exotic frogs (Anura order) and ornamental marine fish — powered by Three.js for interactive 3D visuals.",
    longDescription:
      "Dunia Anura is a showcase platform for exotic tropical frogs and ornamental marine fish — an aesthetic catalog built for collectors and enthusiasts. Powered by Three.js for interactive 3D visuals, the site uses React + Vite + Tailwind v4 to deliver smooth navigation, immersive species detail pages, and a clean modern presentation of the unique fauna.",
    features: [
      "Three.js powered interactive 3D visuals",
      "React + Vite + Tailwind v4 modern stack",
      "Species catalog for exotic frogs and marine fish",
      "Immersive species detail pages",
      "Responsive design optimized for collectors",
      "Deployed on Vercel",
    ],
    gallery: [
      { title: "Landing 3D" },
      { title: "Species Catalog" },
      { title: "Detail View" },
    ],
    icon: Fish,
    tags: ["React", "Vite", "Tailwind v4", "Three.js"],
    category: "Web App",
    year: "2026",
    live: "https://dunia-anura-design.vercel.app",
    github: "https://github.com/Swordekel/dunia-anura-design",
    accent: "var(--accent-success)",
  },
];

function GalleryImage({
  slot,
  accent,
  icon: Icon,
  onOpen,
}: {
  slot: GallerySlot;
  accent: string;
  icon: IconType;
  onOpen: (src: string, alt: string) => void;
}) {
  const [errored, setErrored] = useState(false);
  const showImage = slot.image && !errored;

  const containerStyle = {
    aspectRatio: "16 / 10",
    background: `linear-gradient(135deg, ${accent}25 0%, ${accent}06 100%)`,
    borderColor: "var(--border-soft)",
  } as const;

  if (showImage) {
    return (
      <button
        type="button"
        onClick={() => onOpen(slot.image!, slot.title)}
        className="group relative rounded-xl overflow-hidden border block w-full cursor-zoom-in"
        style={containerStyle}
        aria-label={`View ${slot.title} full size`}
      >
        <img
          src={slot.image}
          alt={slot.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setErrored(true)}
        />
        <div
          className="absolute inset-0 transition-opacity duration-200 opacity-0 group-hover:opacity-100 flex items-end justify-start p-2.5"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)" }}
        >
          <span
            style={{
              fontSize: "10.5px",
              fontWeight: 600,
              color: "#fff",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {slot.title}
          </span>
        </div>
      </button>
    );
  }

  return (
    <div className="relative rounded-xl overflow-hidden border" style={containerStyle}>
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: `radial-gradient(circle at 30% 50%, ${accent}30 0%, transparent 50%)`,
        }}
      />
      <div className="relative h-full flex flex-col items-center justify-center gap-3">
        <Icon size={36} strokeWidth={1.3} style={{ color: accent, opacity: 0.5 }} />
        <span style={{ fontSize: "10.5px", color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          {slot.title}
        </span>
      </div>
    </div>
  );
}

function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  if (typeof document === "undefined") return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-10 cursor-zoom-out"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={handleBackdropClick}
      style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(14px)" }}
    >
      <button
        type="button"
        onClick={handleCloseClick}
        aria-label="Close fullscreen image"
        className="absolute top-5 right-5 z-10 w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-200"
        style={{
          background: "rgba(0,0,0,0.5)",
          borderColor: "rgba(255,255,255,0.15)",
          color: "rgba(255,255,255,0.85)",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = "rgba(255,255,255,0.35)";
          el.style.color = "#fff";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = "rgba(255,255,255,0.15)";
          el.style.color = "rgba(255,255,255,0.85)";
        }}
      >
        <X className="w-5 h-5" />
      </button>

      <motion.img
        src={src}
        alt={alt}
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="max-w-full max-h-full object-contain rounded-lg cursor-default"
        style={{ boxShadow: "0 24px 80px rgba(0,0,0,0.5)" }}
      />

      <div
        className="absolute bottom-5 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          fontSize: "11px",
          color: "rgba(255,255,255,0.45)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        Click outside or press Esc to close
      </div>
    </motion.div>,
    document.body
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (lightbox) {
        setLightbox(null);
      } else {
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, lightbox]);

  const Icon = project.icon;
  const openLightbox = (src: string, alt: string) => setLightbox({ src, alt });
  const galleryCols = project.gallery.length === 4 ? "sm:grid-cols-2" : "sm:grid-cols-3";

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)" }}
    >
      <motion.div
        className="relative w-full max-w-5xl max-h-[92vh] rounded-2xl border overflow-hidden flex flex-col"
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 30 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--bg-base)",
          borderColor: `${project.accent}40`,
          boxShadow: `0 24px 80px rgba(0,0,0,0.45), 0 0 60px ${project.accent}18`,
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close project detail"
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-xl border flex items-center justify-center transition-all duration-200"
          style={{
            background: "rgba(var(--bg-base-rgb), 0.6)",
            borderColor: "var(--border-soft)",
            color: "var(--text-muted)",
            backdropFilter: "blur(8px)",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = `${project.accent}40`;
            el.style.color = "var(--text-primary)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = "var(--border-soft)";
            el.style.color = "var(--text-muted)";
          }}
        >
          <X className="w-4 h-4" />
        </button>

        <div
          className="relative h-44 sm:h-64 shrink-0 overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${project.accent}30 0%, ${project.accent}08 60%, var(--bg-base) 100%)` }}
        >
          {project.heroImage ? (
            <button
              type="button"
              onClick={() => openLightbox(project.heroImage!, project.title)}
              className="absolute inset-0 w-full h-full cursor-zoom-in group"
              aria-label="View hero image full size"
            >
              <img
                src={project.heroImage}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 30%, transparent 60%, rgba(var(--bg-base-rgb), 0.6) 100%)" }}
              />
            </button>
          ) : (
            <>
              <div
                className="absolute inset-0 opacity-50"
                style={{
                  backgroundImage: `radial-gradient(circle at 25% 50%, ${project.accent}40 0%, transparent 45%), radial-gradient(circle at 80% 30%, ${project.accent}20 0%, transparent 40%)`,
                }}
              />
              <div className="relative h-full flex items-center justify-center">
                <Icon
                  size={104}
                  strokeWidth={1.2}
                  style={{ color: project.accent, opacity: 0.6, filter: `drop-shadow(0 12px 30px ${project.accent}55)` }}
                />
              </div>
            </>
          )}
          <div className="absolute top-4 left-4 flex items-center gap-2 pointer-events-none">
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
        </div>

        <div className="overflow-y-auto px-6 sm:px-10 py-8 flex-1">
          <h2 className="text-foreground mb-2" style={{ fontSize: "1.6rem", fontWeight: 800, lineHeight: 1.2 }}>
            {project.title}
          </h2>

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

          <p
            className="leading-relaxed mb-8"
            style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.75 }}
          >
            {project.longDescription}
          </p>

          <div className="mb-10">
            <div
              className="mb-4"
              style={{
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: project.accent,
              }}
            >
              Key Features
            </div>
            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
              {project.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <span
                    className="mt-1 shrink-0 rounded-full flex items-center justify-center"
                    style={{
                      width: 14,
                      height: 14,
                      background: `${project.accent}20`,
                      color: project.accent,
                    }}
                  >
                    <Check size={9} strokeWidth={3} />
                  </span>
                  <span style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6 }}>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-2">
            <div
              className="mb-4"
              style={{
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: project.accent,
              }}
            >
              Gallery
            </div>
            <div className={`grid grid-cols-1 ${galleryCols} gap-3`}>
              {project.gallery.map((slot, i) => (
                <GalleryImage
                  key={i}
                  slot={slot}
                  accent={project.accent}
                  icon={project.icon}
                  onOpen={openLightbox}
                />
              ))}
            </div>
          </div>
        </div>

        <div
          className="shrink-0 px-6 sm:px-10 py-5 border-t flex flex-wrap items-center gap-3"
          style={{ borderColor: "var(--border-subtle)", background: "rgba(var(--bg-base-rgb), 0.6)" }}
        >
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all duration-200"
              style={{
                background: project.accent,
                color: "var(--accent-foreground)",
                fontSize: "13px",
              }}
            >
              <ExternalLink className="w-4 h-4" />
              Visit Live Site
            </a>
          )}
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-200 hover:bg-[var(--text-primary)]/5"
            style={{
              fontSize: "13px",
              fontWeight: 500,
              color: "var(--text-primary)",
              borderColor: "var(--border-soft)",
            }}
          >
            <Github className="w-4 h-4" />
            View on GitHub
          </a>
          {!project.live && (
            <span
              className="ml-auto"
              style={{ fontSize: "11px", color: "var(--text-muted)", fontStyle: "italic" }}
            >
              Self-hosted · no public demo
            </span>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {lightbox && (
          <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function ProjectsSection() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [hovered, setHovered] = useState<number | null>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

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
                  <button
                    onClick={() => setActiveProject(project)}
                    aria-label={`View ${project.title} details`}
                    className="relative block w-full overflow-hidden cursor-pointer"
                    style={{ height: "200px" }}
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(135deg, ${project.accent}28 0%, ${project.accent}08 60%, var(--bg-surface) 100%)`,
                      }}
                    />
                    {project.heroImage ? (
                      <>
                        <img
                          src={project.heroImage}
                          alt={project.title}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div
                          className="absolute inset-0"
                          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 35%, transparent 65%, rgba(0,0,0,0.4) 100%)" }}
                        />
                      </>
                    ) : (
                      <>
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
                      </>
                    )}

                    <div
                      className="absolute inset-0 transition-opacity duration-300 flex items-center justify-center"
                      style={{ opacity: hovered === project.id ? 1 : 0, background: "rgba(0,0,0,0.35)" }}
                    >
                      <span
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold"
                        style={{ background: project.accent, color: "var(--accent-foreground)", fontSize: "13px" }}
                      >
                        View Project
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
                  </button>

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

                    <div className="flex items-center gap-3 pt-4 border-t flex-wrap" style={{ borderColor: "rgba(var(--text-primary-rgb), 0.06)" }}>
                      <button
                        onClick={() => setActiveProject(project)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg border transition-all duration-200"
                        style={{
                          fontSize: "12px",
                          fontWeight: 500,
                          color: project.accent,
                          borderColor: `${project.accent}30`,
                          background: `${project.accent}08`,
                        }}
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        View Project
                      </button>
                      {project.live && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-[var(--text-primary)]/5"
                          style={{ fontSize: "12px", fontWeight: 500, color: "var(--text-primary)" }}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Live
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

      <AnimatePresence>
        {activeProject && (
          <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
