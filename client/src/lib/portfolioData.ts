// Fluent Signal style reminder: this data powers the Windows 11 desktop shell. Keep content factual, compact, and scannable; cyan is reserved for live signals.

export type RepoStatus = "live" | "building" | "prototype" | "fork";

export type PortfolioRepo = {
  name: string;
  description: string;
  language: string;
  stars: number;
  status: RepoStatus;
  category: string;
  homepage?: string;
  featured?: boolean;
};

export const profile = {
  name: "BHARANI KUMAR S",
  handle: "vincenzo-afk",
  role: "Full Stack Developer & AI Systems Builder",
  location: "Vellore, Tamil Nadu, India",
  timezone: "IST (UTC+5:30)",
  education: "B.E. CSE · 2nd Year @ Kingston Engineering College",
  email: "itsmebk2007@gmail.com",
  bio: "Building intelligent web apps, automation tools, and multi-model AI systems focused on real-world impact.",
  portfolio: "https://vincenzo-afk.vercel.app/",
  github: "https://github.com/vincenzo-afk",
  avatar: "https://avatars.githubusercontent.com/u/233260680?v=4",
  currentBuilds: ["IRIS", "NOVA", "CircuitWeaver"],
  learning: ["LLM Agents", "RL", "Vision Models"],
  askAbout: ["AI Systems", "Full Stack", "APIs"],
  tagline: "Design. Build. Evolve.",
};

export const wallpaperUrl = "/manus-storage/graphite-ember-wallpaper_6362546a.png";
export const textureUrl = "/manus-storage/ai-circuit-texture_8bf3b751.png";
export const projectBackdropUrl = "/manus-storage/project-hub-backdrop_e48d3865.png";
export const signalMarkUrl = "/manus-storage/signal-mark_7099bb36.png";
export const appIconUrls = {
  explorer: "/manus-storage/icon-explorer_0e337a6f.png",
  about: "/manus-storage/icon-about_cee48003.png",
  projects: "/manus-storage/icon-projecthub_57941463.png",
  tech: "/manus-storage/icon-tech_ba537b02.png",
  achievements: "/manus-storage/icon-achievements_61f05d57.png",
  socials: "/manus-storage/icon-socials_fd32ece0.png",
  stats: "/manus-storage/icon-stats_5f54a6cf.png",
  terminal: "/manus-storage/icon-terminal_96eea2cf.png",
  browser: "/manus-storage/icon-browser_b6c8c189.png",
  settings: "/manus-storage/icon-settings_80667939.png",
  calculator: "/manus-storage/icon-calculator_e5e1d5a2.png",
  weather: "/manus-storage/icon-weather_33d88dc2.png",
} as const;

const repo = (
  name: string,
  description: string,
  language: string,
  stars: number,
  category: string,
  status: RepoStatus = "live",
  homepage?: string,
  featured = false,
): PortfolioRepo => ({ name, description, language, stars, category, status, homepage, featured });

export const repos: PortfolioRepo[] = [
  repo("vincenzo-afk", "Profile dashboard with live stats, systems, project cards, and the complete portfolio index.", "JavaScript", 32, "Profile", "live", profile.portfolio, true),
  repo("GHOSTHUB", "Dart-based experimental system for the GhostHub project family.", "Dart", 25, "Experiments"),
  repo("KingstonConnect", "College management platform for students, teachers, HODs, and principals at KEC.", "TypeScript", 31, "Product", "live", "https://kingston-connect.vercel.app", true),
  repo("ethos-wear", "Ethical fashion e-commerce experience for premium shoes and dresses.", "TypeScript", 31, "Product", "live", "https://ethos-wear.vercel.app"),
  repo("WIFI-based-human-presence-detection-system", "Human presence detection through WiFi signals without cameras.", "Python", 32, "Computer Vision", "building"),
  repo("crowd-detection", "Real-time crowd density analysis using computer vision.", "Python", 31, "Computer Vision", "building"),
  repo("SocialGuard-RL", "Gym-compliant RL environment for spam, misinformation, and bot-network moderation.", "Python", 31, "AI Systems", "live", "https://huggingface.co/spaces/bk2007/SocialGuard-RL", true),
  repo("IRIS", "Autonomous AI assistant with real-time screen analysis that follows the cursor and teaches live.", "Python", 20, "AI Systems", "building", undefined, true),
  repo("NOVA", "Autonomous AI system with voice, vision, and multi-agent execution.", "Python", 31, "AI Systems", "building", undefined, true),
  repo("ATTENDENCE-HUB", "Smart attendance platform using facial recognition and QR codes.", "JavaScript", 31, "Product", "live", "https://attendencehub.vercel.app/login"),
  repo("OMNI", "AI assistant and full-codebase bug detector that scans for issues automatically.", "Python", 31, "AI Systems", "building", undefined, true),
  repo("MEETING-MANAGER", "Meeting report and smart scheduling application with AI summaries.", "JavaScript", 31, "Product", "building", "https://meeting-manager-psi.vercel.app"),
  repo("TRIPPLANNER", "AI travel itinerary builder for planning complete trips.", "JavaScript", 31, "Product", "building"),
  repo("FAKE_IDENTITY", "Browser-based identity and profile generation experiment.", "JavaScript", 31, "Experiments", "live", "https://fake-identity-chi.vercel.app"),
  repo("clubhouse-dj", "A room's personal DJ with requests, transitions, and nonstop beats.", "Python", 31, "Experiments"),
  repo("habit-tracker", "Focused habit tracking experience for everyday routines.", "JavaScript", 31, "Product", "live", "https://habit-tracker-pi-tawny.vercel.app"),
  repo("Bio-builder", "Link-in-bio builder for creating a compact personal web presence.", "JavaScript", 31, "Product", "live", "https://bio-builder-blond.vercel.app"),
  repo("hackerrank-agent", "A powerful support agent for programming problem workflows.", "Python", 31, "AI Systems"),
  repo("Chessvibe", "A focused chess website for play and analysis.", "JavaScript", 31, "Games", "live", "https://chessvibe-six.vercel.app"),
  repo("Atmosphere", "Calm weather dashboard with live conditions, forecasts, alerts, and location insights.", "JavaScript", 31, "Product", "live", "https://atmosphere-data.vercel.app"),
  repo("sudokuflow", "Notion-inspired Sudoku workspace with nine game modes, AI solver, hints, and offline support.", "JavaScript", 31, "Games", "live", "https://sudokuflow.vercel.app"),
  repo("XOTrix", "Tic-Tac-Toe with Minimax depth 9, tournament brackets, Elo ratings, replays, and achievements.", "JavaScript", 31, "Games", "live", "https://xo-trix.vercel.app"),
  repo("CalendraX", "Calendar website for organizing time and plans.", "JavaScript", 31, "Product", "live", "https://calendra-x.vercel.app"),
  repo("cinebench", "Movie recommendation website for discovering what to watch.", "JavaScript", 31, "Product", "live", "https://cinebench.vercel.app"),
  repo("CALCULATOR", "Android calculator experiment.", "Kotlin", 23, "Experiments"),
  repo("SHADOWGHOST", "Python-based experimental AI system.", "Python", 24, "Experiments"),
  repo("BASIC-JARVIS", "Early personal assistant experiment.", "Unknown", 25, "AI Systems"),
  repo("CraftUI", "A lightweight UI craft and component exploration space.", "JavaScript", 31, "Design", "live", "https://craft-ui-swart.vercel.app"),
  repo("verbix", "Prompt universe for discovering, customizing, and deploying useful AI prompts.", "Unknown", 31, "AI Systems"),
  repo("todo-app", "Simple task management app.", "CSS", 31, "Product", "live", "https://todo-app-eight-delta-57.vercel.app"),
  repo("browserbrain", "Privacy-first support assistant designed to run in the browser.", "JavaScript", 31, "AI Systems", "live", "https://browserbrain.vercel.app"),
  repo("Mythology-Atlas", "Visual exploration space for world mythology.", "CSS", 31, "Product", "live", "https://mythology-atlas-chi.vercel.app"),
  repo("ascii-terminal", "Browser terminal experience built around ASCII aesthetics.", "JavaScript", 31, "Design", "live", "https://ascii-terminal.vercel.app"),
  repo("Proctored-MCQ-Exam-Platform", "MCQ examination platform powered by spreadsheet-based content.", "JavaScript", 31, "Product", "live", "https://proctored-mcq-exam-platform.vercel.app"),
  repo("AutoVault", "Smart automation and vault management system.", "JavaScript", 31, "AI Systems", "live", "https://auto-vault-nine.vercel.app"),
  repo("MemeDrop", "Developer meme generator with fresh content, custom text, and one-click download.", "JavaScript", 31, "Product", "live", "https://meme-drop.vercel.app"),
  repo("SlideForge", "AI-powered presentation generator built with HTML, CSS, and vanilla JavaScript.", "HTML/CSS/JS", 31, "AI Systems", "live", "https://slide-forge-nu.vercel.app"),
  repo("PrivatePulse-AI", "Private RAG document intelligence for confidential records with grounded cited answers.", "TypeScript", 31, "AI Systems", "live", undefined, true),
  repo("roastmycode", "Paste code, receive a brutal AI review, then get a refactored version worth shipping.", "HTML", 31, "AI Systems", "live", "https://roastmycode-lemon.vercel.app"),
  repo("chaos-vpn", "System-wide mobile voice changer with layered demonic radio effects.", "Dart", 32, "Audio"),
  repo("DEVNEXUS", "Creator command center with GitHub stats, progress narratives, voice TODOs, and an AI copilot.", "TypeScript", 32, "AI Systems", "live", "https://devnexus-web.vercel.app", true),
  repo("OpenAgentNet", "Open standard for agent discovery, capability verification, delegation, and cooperation.", "Python", 31, "AI Systems", "live", undefined, true),
  repo("vanta-v5-", "VANTA v5 iteration with an enhanced dark interface.", "HTML", 32, "Design", "live", "https://vanta-v5.vercel.app"),
  repo("xithsense", "AI fantasy cricket system using ensemble ML over 22K+ matches.", "Python", 32, "AI Systems", "live", undefined, true),
  repo("Infera", "ChaosVoice mobile voice changer with real-time DSP effects for calls and playback.", "Kotlin", 32, "Audio"),
  repo("Lucie-AI", "Late-night voice chat companion with a Live2D personality and memory.", "JavaScript", 32, "AI Systems", "live", "https://lucie-ai.vercel.app"),
  repo("MAGE", "Magic and illusion-themed interactive project.", "JavaScript", 31, "Experiments", "live", "https://mage-delta.vercel.app"),
  repo("Synapse", "Local-first personal operating system for habits, tasks, health, finance, projects, and analytics.", "TypeScript", 31, "Product", "live", "https://synapse-gilt-ten.vercel.app", true),
  repo("ReconGPT", "Browser-based OSINT intelligence tool for recon methodology, attack surface analysis, and lookups.", "JavaScript", 31, "Security", "live", "https://recon-gpt.vercel.app", true),
  repo("URL-SHORTNER", "Compact URL shortening utility.", "JavaScript", 31, "Product", "live", "https://url-shortner-zeta-one.vercel.app"),
  repo("NOVA_FRAMEWORK", "Provider-agnostic persistent AI runtime: Observe, Remember, Reason, Act, Verify.", "Python", 31, "AI Systems", "live", undefined, true),
  repo("DropLink", "Temporary decentralized sharing of files, links, folders, and messages over encrypted WebRTC.", "JavaScript", 30, "Systems", "live", "https://drop-link-psi.vercel.app", true),
  repo("Zen-2", "124M-parameter decoder-only LLM with RoPE, RMSNorm, SwiGLU, GQA, KV cache, and a full training pipeline.", "Python", 31, "AI Systems", "live", undefined, true),
  repo("AgentWeb", "Internet intelligence platform for search, browser execution, extraction, monitoring, memory, and graph reasoning.", "Unknown", 30, "AI Systems", "live", undefined, true),
  repo("TruthNet", "NLP and ML system for misinformation detection and news credibility analysis.", "Python", 28, "AI Systems", "live", undefined, true),
  repo("tn-land-tracker", "Read-only Tamil Nadu land ownership explorer with patta, history, FMB sketches, and guideline values.", "Python/Next.js", 31, "Civic Tech", "live", "https://tn-land-tracker.vercel.app", true),
  repo("VisionX", "Real-time object detection, tracking, and video intelligence using YOLO and computer vision.", "Python", 28, "Computer Vision", "live", undefined, true),
  repo("NEXUS-ENGINE", "Privacy-first Rust search engine with filesystem crawl, BM25, PageRank, BPE query language, Tor mode, and APIs.", "Rust", 32, "Systems", "live", undefined, true),
  repo("PORTFOLIO", "Interactive 3D book portfolio built with vanilla HTML, CSS, and JavaScript.", "HTML", 33, "Design", "live", "https://portfolio-mu-wheat-oshu8jdo27.vercel.app", true),
  repo("brawl-royale", "64-player 2D battle royale with loot, storm circle, authoritative server physics, and client prediction.", "JavaScript", 25, "Games"),
  repo("NIGHTFALL", "Browser multiplayer FPS with 10 hero classes, 3 maps, 4 modes, and real-time sockets.", "TypeScript", 25, "Games"),
  repo("MeshOS", "Browser-based peer-to-peer LAN collaboration workspace where every device becomes a virtual computer.", "JavaScript", 25, "Systems"),
  repo("vanta-code", "Powerful AI coding assistant with an autonomous CLI and Textual TUI.", "Python", 31, "AI Systems", "live", undefined, true),
  repo("Intelis-Agent", "Web research and intelligence platform that monitors, analyzes, detects trends, and reports.", "Unknown", 17, "AI Systems"),
  repo("prompt-to-production", "NASSCOM scaffoldings for the vibe sessions.", "Unknown", 8, "Experiments", "fork"),
];

export const socials = [
  ["GitHub", "vincenzo-afk", "https://github.com/vincenzo-afk"],
  ["LinkedIn", "bharani-kumar", "https://www.linkedin.com/in/bharani-kumar-a13673327"],
  ["Dev.to", "bharani_2007", "https://dev.to/bharani_2007"],
  ["Hugging Face", "bk2007", "https://huggingface.co/bk2007"],
  ["X / Twitter", "@abnormal84662", "https://x.com/abnormal84662"],
  ["Instagram", "@vinzo.verse", "https://www.instagram.com/vinzo.verse"],
  ["Threads", "@vinzo.verse", "https://www.threads.com/@vinzo.verse"],
  ["Facebook", "Bharani", "https://www.facebook.com/share/1HAeqiPzk6/"],
  ["Snapchat", "itsmebk17", "https://www.snapchat.com/add/itsmebk17"],
  ["Reddit", "u/Choice-Pickle-685", "https://www.reddit.com/user/Choice-Pickle-685"],
  ["Twitch", "lumoraworks", "https://www.twitch.tv/lumoraworks"],
  ["Tumblr", "bharani2007", "https://www.tumblr.com/bharani2007"],
  ["Mastodon", "@vincenzoafk25", "https://mastodon.social/@vincenzoafk25"],
  ["Clubhouse", "@bharani71", "https://www.clubhouse.com/@bharani71"],
  ["Spotify", "bharani", "https://open.spotify.com/user/31fcwawdntcmjsc4ouelagjan7aa"],
  ["Quora", "BHARANI-197", "https://www.quora.com/profile/BHARANI-197"],
  ["Bluesky", "bharani25", "https://bsky.app/profile/bharani25.bsky.social"],
  ["LINE", "Bharani", "https://line.me/ti/p/8vc-jZQeK9"],
  ["Discord", "Join Server", "https://discord.gg/33H3eKr8n"],
  ["BeReal", "vinzo25", "https://bere.al/vinzo25"],
  ["Cerebral Valley", "bharani07", "https://cerebralvalley.ai/u/bharani07"],
  ["Parler", "Bharani07", "https://app.parler.com/Bharani07"],
] as const;

export const skills = {
  Languages: ["Python", "TypeScript", "JavaScript", "Rust", "Kotlin", "Dart", "HTML", "CSS", "C", "Java", "Bash"],
  Frontend: ["React", "Next.js", "Tailwind CSS", "Vite", "shadcn/ui", "Framer Motion", "PixiJS"],
  "Backend & Data": ["FastAPI", "Node.js", "Express", "Supabase", "PostgreSQL", "SQLite", "Redis", "MongoDB", "Firebase", "MySQL"],
  "AI / ML": ["PyTorch", "TensorFlow", "Hugging Face", "OpenAI", "scikit-learn", "OpenCV", "Pandas", "NumPy"],
  "DevOps & Tools": ["Docker", "Git", "GitHub", "VS Code", "Linux", "Postman", "Vercel", "Cloudflare", "GitHub Actions"],
};

export const achievements = [
  ["Meta OpenEnv Hackathon 2026", "SocialGuard-RL", "Built & Submitted", "RL environment for social media integrity moderation"],
  ["Meta Llama Impact Hackathon 2026", "SocialGuard-RL", "Built & Submitted", "Gym-compliant agents for spam, misinformation, and bot networks"],
  ["Midnight Hackathon AI Track", "PrivatePulse-AI", "Built & Submitted", "RAG-powered document intelligence for confidential files"],
] as const;

export const liveDemos = repos.filter((item) => item.homepage);

export const terminalCommands = {
  help: "whoami · projects · stats · socials · sudo hire-me · clear",
  whoami: `${profile.name} — ${profile.role}. ${profile.location}.`,
  projects: `${repos.length} curated profile entries. ${profile.currentBuilds.join(", ")} are listed as current builds in the profile source.`,
  stats: "Open GitHub Power to fetch public repository, star, follower, and language data from the GitHub API.",
  socials: socials.map(([name, handle]) => `${name}: ${handle}`).join(" · "),
  "sudo hire-me": `Contact ${profile.email} or open LinkedIn. Signal sent.`,
};
