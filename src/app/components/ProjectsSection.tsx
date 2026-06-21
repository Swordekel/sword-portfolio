import { useEffect, useRef, useState, type ComponentType } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import {
  ExternalLink,
  Github,
  ArrowUpRight,
  Bot,
  Music,
  PenLine,
  Car,
  Mic2,
  Leaf,
  Receipt,
  Fish,
  X,
  Check,
  Scissors,
  ToyBrick,
  Headphones,
  Music2,
  Store,
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
    id: 10,
    slug: "toy-story",
    title: "Toy Story — A Fan Tribute",
    description:
      "Immersive 3D fan tribute — a real WebGL sky with draggable floating toys, character cards, hover-video toys, and a fully custom themed cursor.",
    longDescription:
      "An animated, single-page Toy Story tribute built entirely from scratch (no template). The hero is a genuine WebGL scene — volumetric clouds with draggable, randomly-scattered toys and floating character photo-cards, all reacting to the cursor with parallax. It pairs hover-to-play character videos, a scroll-pinned film saga, autoplaying theme music, and a fully custom cursor set (glossy arrow + open/closed grab hands).",
    features: [
      "Real WebGL 3D hero — Three.js + React Three Fiber + drei",
      "Draggable floating toys, layout randomised on every load",
      "Hover-to-play character videos (idle → wave with sound)",
      "Scroll-pinned film saga + kinetic quotes",
      "Theme music with autoplay + visible toggle",
      "Custom Toy Story cursor set (arrow + grab hands)",
    ],
    heroImage: "/projects/toy-story/hero.jpg",
    gallery: [
      { title: "Characters", image: "/projects/toy-story/characters.jpg" },
      { title: "Film Saga", image: "/projects/toy-story/Saga.jpg" },
    ],
    icon: ToyBrick,
    tags: ["React", "TypeScript", "Three.js", "R3F", "Motion"],
    category: "Web App",
    year: "2026",
    live: "https://toy-story-tribute.vercel.app",
    github: "https://github.com/Swordekel/toy-story-tribute",
    accent: "var(--accent-primary)",
  },
  {
    id: 11,
    slug: "billie-eilish",
    title: "Billie Eilish — Tribute Experience",
    description:
      "Animated single-page Billie Eilish tribute — kinetic typography, scroll-driven motion, and a moody neon-on-black aesthetic.",
    longDescription:
      "A single-page Billie Eilish tribute with an editorial, neon-green-on-black aesthetic. Built with React + Vite, it layers kinetic text (scramble, char-reveal, count-up, marquee), scroll-driven reveals, a smooth-scrolling gallery, a Spotify embed for real tracks, and a responsive mobile nav — polished into an immersive, brand-true experience.",
    features: [
      "Kinetic typography — scramble, char-reveal, count-up, marquee",
      "Scroll-driven reveals with GSAP ScrollTrigger + Lenis",
      "Spotify embed for real tracks",
      "Moody neon-green-on-black brand aesthetic",
      "Responsive with a custom mobile navigation",
      "Deployed on Vercel",
    ],
    heroImage: "/projects/billie-eilish/hero.jpg",
    gallery: [
      { title: "Gallery", image: "/projects/billie-eilish/gallery.jpg" },
      { title: "Tracks", image: "/projects/billie-eilish/music.jpg" },
    ],
    icon: Headphones,
    tags: ["React", "Vite", "GSAP", "Lenis", "Motion"],
    category: "Web App",
    year: "2026",
    live: "https://billie-eilish-tribute.vercel.app",
    github: "https://github.com/Swordekel/billie-eilish-tribute",
    accent: "var(--accent-secondary)",
  },
  {
    id: 12,
    slug: "justin-bieber",
    title: "Justin Bieber — Fan Experience",
    description:
      "Animated single-page Justin Bieber fan experience — section reveals, parallax, real photos & music, in a clean lavender-accented design.",
    longDescription:
      "A single-page Justin Bieber fan experience built with React + Vite. It features animated section reveals, parallax, a refined Moments gallery (desktop & mobile), real CC-licensed photography, a Spotify embed, and an AnimatedText reveal system — wrapped in a clean lavender-accented design and deployed to Vercel.",
    features: [
      "Animated section reveals & parallax (Motion + Lenis)",
      "Refined Moments gallery for desktop & mobile",
      "Spotify embed for real tracks",
      "Real CC-licensed photography (no stock/Getty)",
      "Footer with social links & creator credit",
      "Deployed on Vercel",
    ],
    heroImage: "/projects/justin-bieber/hero.jpg",
    gallery: [
      { title: "Moments", image: "/projects/justin-bieber/moments.jpg" },
      { title: "Music", image: "/projects/justin-bieber/music.jpg" },
    ],
    icon: Music2,
    tags: ["React", "Vite", "Motion", "Lenis"],
    category: "Web App",
    year: "2026",
    live: "https://justin-bieber-fan-experience.vercel.app",
    github: "https://github.com/Swordekel/justin-bieber-fan-experience",
    accent: "var(--accent-tertiary)",
  },
  {
    id: 13,
    slug: "amphiverse",
    title: "Amphiverse — Premium Amphibian Marketplace",
    description:
      "A premium marketplace concept for exotic amphibians — browse and shop curated species through a clean, modern storefront.",
    longDescription:
      "Amphiverse is a premium marketplace for exotic amphibians, presenting curated species through a polished storefront. Built with React + Vite + TypeScript and Tailwind, it focuses on clean product presentation, category browsing, and a modern e-commerce experience for collectors and enthusiasts.",
    features: [
      "Curated amphibian species catalog",
      "Category browsing & product detail views",
      "Built-in AI assistant for buyer guidance",
      "Clean, modern storefront UI",
      "React + Vite + TypeScript + Tailwind stack",
      "Responsive marketplace layout",
      "Deployed on Vercel",
    ],
    heroImage: "/projects/amphiverse/hero.jpg",
    gallery: [
      { title: "Collection", image: "/projects/amphiverse/collection.jpg" },
      { title: "Catalog", image: "/projects/amphiverse/katalog.jpg" },
      { title: "Product Detail", image: "/projects/amphiverse/detail-product.jpg" },
      { title: "AI Assistant", image: "/projects/amphiverse/chatAi.jpg" },
    ],
    icon: Store,
    tags: ["React", "TypeScript", "Vite", "Tailwind"],
    category: "Web App",
    year: "2026",
    live: "https://amphiverse.vercel.app",
    github: "https://github.com/Swordekel/Amphiverse",
    accent: "var(--accent-success)",
  },
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
    heroImage: "/projects/Lyrion/Splash Ui.png",
    gallery: [
      { title: "Home", image: "/projects/Lyrion/Tampilan Home.png" },
      { title: "Now Playing", image: "/projects/Lyrion/Tampilan Lagu.png" },
      { title: "Library", image: "/projects/Lyrion/Tampilan Library.png" },
      { title: "Search & Download", image: "/projects/Lyrion/Tampilan Cari & Unduh Lagu Online or Offline.png" },
      { title: "LRC Editor", image: "/projects/Lyrion/Tampilan Editor lrc 1.png" },
      { title: "User Profile", image: "/projects/Lyrion/Tampilan Profile User.png" },
      { title: "Lyrics", image: "/projects/Lyrion/lirik.png" },
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
    slug: "coretan",
    title: "Coretan — Real-Time P2P Whiteboard",
    description:
      "Collaborative real-time whiteboard via Yjs + WebRTC. Zero backend, peer-to-peer sync, coffee bean themed UI.",
    longDescription:
      "Coretan is a collaborative whiteboard where multiple users draw, sketch, and brainstorm in real time — with no backend infrastructure. State syncs directly peer-to-peer using Yjs CRDTs over WebRTC, so the only server in the loop is a tiny WebSocket signaling relay (deployed on Render free tier). The UI is themed around coffee beans for warmth and focus, matching the kind of casual hang-and-think sessions the whiteboard is built for.",
    features: [
      "Real-time multi-user drawing & sketching",
      "Peer-to-peer sync via Yjs CRDTs over WebRTC",
      "Zero backend — only a small signaling relay",
      "Coffee bean themed UI for casual focus sessions",
      "Conflict-free collaborative state with offline tolerance",
      "Deployed on Vercel (client) + Render (relay)",
    ],
    gallery: [
      { title: "Mobile View", image: "/projects/coretan/mobile.png" },
      { title: "Tablet View", image: "/projects/coretan/tablet.png" },
      { title: "Desktop · Scrolled", image: "/projects/coretan/scrolled.png" },
    ],
    heroImage: "/projects/coretan/hero.png",
    icon: PenLine,
    tags: ["TypeScript", "Yjs", "WebRTC", "Vite", "P2P"],
    category: "Web App",
    year: "2026",
    live: "https://coretan-eight.vercel.app",
    github: "https://github.com/Swordekel/coretan",
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
    heroImage: "/projects/twhrencar/hero.png",
    gallery: [
      { title: "Mobile View", image: "/projects/twhrencar/mobile.png" },
      { title: "Car View", image: "/projects/twhrencar/car.png" },
      { title: "Car detail", image: "/projects/twhrencar/car-detail.png" },
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
    heroImage: "/projects/lahila/hero.png",
    gallery: [
      { title: "Desktop View", image: "/projects/lahila/home.png" },
      { title: "Mobile View", image: "/projects/lahila/mobile.png" },
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
      { title: "Hero", image: "/projects/papuyo/hero.png" },
      { title: "Product Detail", image: "/projects/papuyo/product.png" },
      { title: "Order Form", image: "/projects/papuyo/order.png" },
    ],
    heroImage: "/projects/papuyo/hero.png",
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
    slug: "split-struk",
    title: "Split Struk — Bill Splitter PWA",
    description:
      "Foto struk, tag teman, kirim tagihan ke WhatsApp. 100% client-side PWA — OCR runs in the browser, history lives in IndexedDB, zero backend.",
    longDescription:
      "Split Struk turns a photo of a restaurant receipt into a per-person bill in seconds. Snap the struk, the in-browser OCR pulls out line items, you tag who ordered what, and the app generates a clean WhatsApp message for each friend with their share. Everything runs locally — OCR in the browser, history persisted to IndexedDB — so there's no signup, no server bills, and no data leaves the device.",
    features: [
      "Snap a receipt, OCR extracts line items in-browser",
      "Tag friends per item to split bills",
      "One-tap send per person's tab to WhatsApp",
      "100% client-side PWA — installable, works offline",
      "Receipt history stored locally in IndexedDB",
      "Zero backend infrastructure or data leaving the device",
    ],
    gallery: [
      { title: "Mobile View", image: "/projects/split-struk/mobile.png" },
      { title: "Tablet View", image: "/projects/split-struk/tablet.png" },
      { title: "Desktop · Scrolled", image: "/projects/split-struk/scrolled.png" },
    ],
    heroImage: "/projects/split-struk/hero.png",
    icon: Receipt,
    tags: ["TypeScript", "PWA", "OCR", "IndexedDB"],
    category: "Web App",
    year: "2026",
    live: "https://split-struk.vercel.app",
    github: "https://github.com/Swordekel/split-struk",
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
    heroImage: "/projects/dunia-anura/hero.png",
    gallery: [
      { title: "Mobile View", image: "/projects/dunia-anura/mobile.png" },
    ],
    icon: Fish,
    tags: ["React", "Vite", "Tailwind v4", "Three.js"],
    category: "Web App",
    year: "2026",
    live: "https://dunia-anura-design.vercel.app",
    github: "https://github.com/Swordekel/dunia-anura-design",
    accent: "var(--accent-success)",
  },
  {
    id: 9,
    slug: "latar",
    title: "Latar — In-Browser Background Remover PWA",
    description:
      "AI-powered background removal running 100% locally in the browser. Zero server uploads, absolute privacy, and custom canvas backgrounds.",
    longDescription:
      "Latar is a progressive web application (PWA) that removes image backgrounds instantly and entirely client-side using local machine learning models (@imgly/background-removal). Because the AI model runs locally on the user's device, no photos are ever uploaded to a server, ensuring total privacy. The app features a rich editor canvas allowing users to replace the background with solid colors, gradient fills, custom images, or transparency, along with adjustments and photo filters.",
    features: [
      "AI-powered background removal running entirely in the browser",
      "100% local processing — no images are ever uploaded to a server",
      "Editor Canvas: replace backgrounds with transparent, solid colors, gradients, or custom images",
      "Real-time photo adjustments and filters on cutout objects",
      "Flexible exports to high-quality PNG (transparent), JPEG, and WebP formats",
      "Installable Progressive Web App (PWA) with complete offline support",
    ],
    heroImage: "/projects/latar/hero.png",
    gallery: [
      { title: "Editor Light", image: "/projects/latar/editor.png" },
      { title: "Editor Dark", image: "/projects/latar/editor-dark.png" },
      { title: "Mobile Editor Light", image: "/projects/latar/mobile-view-editor-light.jpeg" },
      { title: "Mobile Editor Dark", image: "/projects/latar/mobile-view-editor-dark.jpeg" },
      { title: "Mobile View Light", image: "/projects/latar/mobile-view-light.jpeg" },
      { title: "Mobile View Dark", image: "/projects/latar/mobile-view-dark.jpeg" },
      { title: "Mobile BG Customization", image: "/projects/latar/mobile-view-editor-light-color.jpeg" },
    ],
    icon: Scissors,
    tags: ["React", "TypeScript", "Vite", "PWA", "@imgly/background-removal"],
    category: "Web App",
    year: "2026",
    live: "https://latar.vercel.app/",
    github: "https://github.com/Swordekel/latar",
    accent: "var(--accent-primary)",
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
          loading="lazy"
          decoding="async"
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
      data-lenis-prevent
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

        <div data-lenis-prevent className="overflow-y-auto px-6 sm:px-10 py-8 flex-1">
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

/** Projects shown in the cinematic, scroll-driven showcase (desktop only). */
const FEATURED_SLUGS = ["toy-story", "billie-eilish", "justin-bieber", "amphiverse"];

function CinematicPanel({
  project,
  index,
  total,
  onOpen,
}: {
  project: Project;
  index: number;
  total: number;
  onOpen: (p: Project) => void;
}) {
  const Icon = project.icon;
  const num = String(index + 1).padStart(2, "0");

  return (
    <article className="w-screen h-full shrink-0 flex items-center">
      <div className="w-full max-w-[88rem] mx-auto px-8 lg:px-12 grid lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-20 items-center">
        {/* text */}
        <div className="order-2 lg:order-1">
          <div className="flex items-baseline gap-4 mb-3">
            <span
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "clamp(3.5rem, 8vw, 7.5rem)",
                fontWeight: 700,
                lineHeight: 0.8,
                color: project.accent,
                opacity: 0.16,
              }}
            >
              {num}
            </span>
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "12px", color: "var(--text-muted)", letterSpacing: "0.1em" }}>
              {num} / {String(total).padStart(2, "0")}
            </span>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <span style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: project.accent }}>
              {project.category}
            </span>
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", color: "var(--text-muted)" }}>· {project.year}</span>
          </div>

          <h3 className="text-foreground mb-5" style={{ fontSize: "clamp(2rem, 4.4vw, 3.8rem)", fontWeight: 800, lineHeight: 1.02, letterSpacing: "-0.02em" }}>
            {project.title}
          </h3>

          <p className="mb-7 max-w-md" style={{ fontSize: "15px", lineHeight: 1.7, color: "var(--text-secondary)" }}>
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-8">
            {project.tags.slice(0, 5).map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-lg"
                style={{ fontSize: "11px", fontWeight: 500, color: project.accent, background: `${project.accent}10`, border: `1px solid ${project.accent}20`, fontFamily: "JetBrains Mono, monospace" }}
              >
                {tag}
              </span>
            ))}
          </div>

          <button
            onClick={() => onOpen(project)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-transform duration-200 hover:-translate-y-0.5"
            style={{ background: project.accent, color: "var(--accent-foreground)", fontSize: "14px" }}
          >
            View Project <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* image */}
        <div className="order-1 lg:order-2">
          <button
            type="button"
            onClick={() => onOpen(project)}
            aria-label={`View ${project.title}`}
            className="group relative block w-full aspect-[4/3] lg:aspect-auto lg:h-[72vh] rounded-2xl overflow-hidden border cursor-pointer"
            style={{ borderColor: `${project.accent}30`, boxShadow: `0 30px 80px -30px ${project.accent}66` }}
          >
            <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${project.accent}22 0%, ${project.accent}06 60%, var(--bg-surface) 100%)` }} />
            {project.heroImage ? (
              <img
                src={project.heroImage}
                alt={project.title}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
            ) : (
              <div className="relative h-full flex items-center justify-center">
                <Icon size={96} strokeWidth={1.2} style={{ color: project.accent, opacity: 0.5 }} />
              </div>
            )}
            <div
              className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-0 group-hover:opacity-100"
              style={{ background: "rgba(0,0,0,0.28)" }}
            >
              <span className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold" style={{ background: project.accent, color: "var(--accent-foreground)", fontSize: "13px" }}>
                View Project <ArrowUpRight className="w-4 h-4" />
              </span>
            </div>
          </button>
        </div>
      </div>
    </article>
  );
}

/** Horizontal, scroll-pinned showcase of the featured projects (desktop only). */
function CinematicProjects({ items, onOpen }: { items: Project[]; onOpen: (p: Project) => void }) {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${((items.length - 1) / items.length) * 100}%`]);

  if (items.length === 0) return null;

  return (
    <div ref={targetRef} className="relative hidden md:block" style={{ height: `${items.length * 100}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div style={{ x }} className="flex h-full w-max">
          {items.map((p, i) => (
            <CinematicPanel key={p.id} project={p} index={i} total={items.length} onOpen={onOpen} />
          ))}
        </motion.div>

        <motion.div
          className="absolute bottom-0 left-0 h-[3px] w-full origin-left"
          style={{ scaleX: scrollYProgress, background: "linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))" }}
        />
        <div
          className="absolute bottom-5 left-1/2 -translate-x-1/2 pointer-events-none flex items-center gap-2"
          style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", color: "var(--text-muted)", letterSpacing: "0.1em" }}
        >
          SCROLL TO EXPLORE
        </div>
      </div>
    </div>
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

  const featured = FEATURED_SLUGS
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter((p): p is Project => Boolean(p));

  return (
    <section id="projects" className="py-32 relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 50% 50% at 50% 100%, rgba(var(--accent-primary-rgb), 0.04) 0%, transparent 100%)" }}
      />

      {/* heading */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-12 md:mb-16">
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
      </div>

      {/* cinematic, scroll-driven featured showcase (desktop) */}
      <CinematicProjects items={featured} onOpen={setActiveProject} />

      {/* all projects: filter + grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-16 md:mt-28">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--accent-primary)" }}>
              All Projects
            </span>
            <h3 className="text-foreground mt-2" style={{ fontSize: "1.5rem", fontWeight: 700 }}>Browse everything</h3>
          </div>

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
                          loading="lazy"
                          decoding="async"
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
