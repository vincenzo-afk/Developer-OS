// Fluent Signal style reminder: this page is Bharani's operating-system canvas. Preserve acrylic depth, calm chrome, cyan live signals, and discoverability.
import { useEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Activity, BatteryFull, BriefcaseBusiness, Calculator, ChevronRight, CloudSun, Code2, Globe2, HardDrive, LockKeyhole, Maximize2, Menu, Minus, Search, Settings2, Share2, Terminal as TerminalIcon, Trophy, UserRound, Volume2, Wifi, X } from "lucide-react";
import { profile, repos, signalMarkUrl, stats, wallpaperUrl } from "@/lib/portfolioData";
import { AboutApp, AchievementsApp, AppId, AppSectionHeader, ExplorerApp, ProjectHubApp, SocialsApp, StatsApp, StatusPill, TechApp } from "@/components/PortfolioApps";
import { BrowserApp, CalculatorApp, NotificationPanel, SettingsApp, TerminalApp, WeatherApp } from "@/components/SystemApps";
import { AboutWorkstationApp } from "@/components/AboutWorkstationApp";

type FullAppId = AppId | "terminal" | "browser" | "settings" | "calculator" | "weather";
type WindowState = { id: FullAppId; minimized: boolean; maximized: boolean; x: number; y: number; w: number; h: number };
type DragState = { id: FullAppId; offsetX: number; offsetY: number } | null;

const appMeta: Record<FullAppId, { title: string; short: string; icon: LucideIcon; color: string }> = {
  explorer: { title: "This PC", short: "This PC", icon: HardDrive, color: "#82c7ff" },
  about: { title: "About Me", short: "About Me", icon: UserRound, color: "#8cc9ff" },
  projects: { title: "Project Hub", short: "Project Hub", icon: BriefcaseBusiness, color: "#00e0ff" },
  tech: { title: "Tech Stack", short: "Tech Stack", icon: Code2, color: "#8bd8ff" },
  achievements: { title: "Achievements", short: "Achievements", icon: Trophy, color: "#ffd27f" },
  socials: { title: "Connect Everywhere", short: "Socials", icon: Share2, color: "#b0e5ff" },
  stats: { title: "GitHub Power", short: "GitHub Power", icon: Activity, color: "#77ffda" },
  terminal: { title: "vanta-code — Terminal", short: "Terminal", icon: TerminalIcon, color: "#9df9d7" },
  browser: { title: "Microsoft Edge", short: "Live Demos", icon: Globe2, color: "#6dc8ff" },
  settings: { title: "Settings", short: "Settings", icon: Settings2, color: "#b4c7d8" },
  calculator: { title: "Calculator", short: "Calculator", icon: Calculator, color: "#9bb9ff" },
  weather: { title: "Atmosphere", short: "Weather", icon: CloudSun, color: "#fed47c" },
};
const initialWindows: WindowState[] = [{ id: "about", minimized: false, maximized: false, x: 142, y: 78, w: 820, h: 560 }];
const desktopApps: FullAppId[] = ["explorer", "projects", "about", "tech", "achievements", "socials", "terminal", "stats"];
const pinnedApps: FullAppId[] = ["explorer", "projects", "terminal", "browser", "tech"];

function formatTime(date: Date) { return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false }); }
function formatDate(date: Date) { return date.toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "2-digit", year: "numeric" }); }
function AppGlyph({ id, size = 20 }: { id: FullAppId; size?: number }) { const Icon = appMeta[id].icon; return <Icon size={size} strokeWidth={1.65} style={{ color: appMeta[id].color }} />; }

function WindowShell({ win, active, onFocus, onClose, onMinimize, onMaximize, onTitlePointerDown, children }: { win: WindowState; active: boolean; onFocus: () => void; onClose: () => void; onMinimize: () => void; onMaximize: () => void; onTitlePointerDown: (event: PointerEvent<HTMLDivElement>) => void; children: ReactNode }) {
  const meta = appMeta[win.id]; const style: CSSProperties | undefined = win.maximized ? undefined : { left: win.x, top: win.y, width: win.w, height: win.h };
  return <section className={`os-window ${active ? "window-active" : ""} ${win.maximized ? "window-maximized" : ""}`} style={style} onPointerDown={onFocus} aria-label={meta.title}><div className="window-titlebar" onPointerDown={onTitlePointerDown}><div className="window-title"><AppGlyph id={win.id} size={15} /><span>{meta.title}</span></div><div className="window-controls"><button aria-label="Minimize" onClick={onMinimize}><Minus size={15} /></button><button aria-label="Maximize" onClick={onMaximize}><Maximize2 size={13} /></button><button aria-label="Close" className="close-control" onClick={onClose}><X size={15} /></button></div></div><div className="window-body">{children}</div></section>;
}

function WindowContent({ id, openApp, lightMode, setLightMode }: { id: FullAppId; openApp: (id: FullAppId) => void; lightMode: boolean; setLightMode: (value: boolean) => void }) {
  if (id === "about") return <AboutWorkstationApp openApp={(app) => openApp(app)} />;
  if (id === "projects") return <ProjectHubApp />;
  if (id === "explorer") return <ExplorerApp openApp={(app) => openApp(app)} />;
  if (id === "tech") return <TechApp />;
  if (id === "achievements") return <AchievementsApp />;
  if (id === "socials") return <SocialsApp />;
  if (id === "stats") return <StatsApp />;
  if (id === "terminal") return <TerminalApp />;
  if (id === "browser") return <BrowserApp />;
  if (id === "settings") return <SettingsApp lightMode={lightMode} setLightMode={setLightMode} />;
  if (id === "calculator") return <CalculatorApp />;
  return <WeatherApp />;
}

function LoginScreen({ now, onLogin }: { now: Date; onLogin: () => void }) {
  return <main className="login-screen" style={{ backgroundImage: `linear-gradient(180deg, rgba(3,12,19,.14), rgba(3,12,19,.68)), url(${wallpaperUrl})` }}><div className="login-topbar"><span className="login-language">ENG <ChevronRight size={13} /></span><span className="login-network"><Wifi size={16} /><Volume2 size={16} /><BatteryFull size={16} /></span></div><div className="login-center"><div className="login-time">{formatTime(now)}</div><div className="login-date">{formatDate(now)}</div><div className="login-account"><div className="login-avatar"><img src={profile.avatar} alt={profile.name} /></div><h1>{profile.name}</h1><p>{profile.role}</p><button className="login-button" onClick={onLogin}>Sign in <ChevronRight size={16} /></button><small>Press Enter to open Bharani's workstation</small></div></div><div className="login-footer"><div className="login-footer-line"><span>BHARANI / SYSTEMS</span><span className="footer-signal"><span className="presence-dot" /> {stats.publicRepos} systems indexed</span></div></div></main>;
}

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(() => new URLSearchParams(window.location.search).has("desktop")); const [now, setNow] = useState(() => new Date()); const [windows, setWindows] = useState<WindowState[]>(initialWindows); const [activeId, setActiveId] = useState<FullAppId>("about"); const [startOpen, setStartOpen] = useState(false); const [notificationOpen, setNotificationOpen] = useState(false); const [startQuery, setStartQuery] = useState(""); const [contextOpen, setContextOpen] = useState(false); const [lightMode, setLightMode] = useState(false); const dragRef = useRef<DragState>(null);
  useEffect(() => { const timer = window.setInterval(() => setNow(new Date()), 1000); return () => window.clearInterval(timer); }, []);
  useEffect(() => { const key = (event: KeyboardEvent) => { if (!loggedIn) { if (event.key === "Enter") setLoggedIn(true); return; } if (event.key === "/" && document.activeElement?.tagName !== "INPUT") { event.preventDefault(); setStartOpen(true); window.setTimeout(() => document.getElementById("start-search")?.focus(), 20); } if (event.key === "Escape") { setStartOpen(false); setNotificationOpen(false); setContextOpen(false); } }; window.addEventListener("keydown", key); return () => window.removeEventListener("keydown", key); }, [loggedIn]);
  const openApp = (id: FullAppId) => { setStartOpen(false); setNotificationOpen(false); setContextOpen(false); setActiveId(id); setWindows((current) => { const exists = current.find((item) => item.id === id); if (exists) return current.map((item) => item.id === id ? { ...item, minimized: false } : item); return [...current, { id, minimized: false, maximized: false, x: 170 + current.length * 18, y: 84 + current.length * 12, w: id === "projects" || id === "explorer" ? 930 : 790, h: id === "projects" || id === "explorer" ? 590 : 540 }]; }); };
  const closeApp = (id: FullAppId) => setWindows((current) => current.filter((item) => item.id !== id)); const minimizeApp = (id: FullAppId) => setWindows((current) => current.map((item) => item.id === id ? { ...item, minimized: true } : item)); const maximizeApp = (id: FullAppId) => setWindows((current) => current.map((item) => item.id === id ? { ...item, maximized: !item.maximized, minimized: false } : item));
  const handleTitlePointerDown = (event: PointerEvent<HTMLDivElement>, id: FullAppId) => { const win = windows.find((item) => item.id === id); if (!win || win.maximized) return; dragRef.current = { id, offsetX: event.clientX - win.x, offsetY: event.clientY - win.y }; setActiveId(id); };
  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => { if (!dragRef.current) return; const { id, offsetX, offsetY } = dragRef.current; setWindows((current) => current.map((item) => item.id === id ? { ...item, x: Math.max(8, event.clientX - offsetX), y: Math.max(38, event.clientY - offsetY) } : item)); }; const handlePointerUp = () => { dragRef.current = null; };
  const filteredApps = (Object.keys(appMeta) as FullAppId[]).filter((id) => `${appMeta[id].title} ${appMeta[id].short}`.toLowerCase().includes(startQuery.toLowerCase()));
  if (!loggedIn) return <LoginScreen now={now} onLogin={() => setLoggedIn(true)} />;
  return <main className={`desktop-shell ${lightMode ? "light-preview" : ""}`} style={{ backgroundImage: `linear-gradient(130deg, rgba(4,16,25,.43), rgba(3,9,15,.2)), url(${wallpaperUrl})` }} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onContextMenu={(event) => { event.preventDefault(); setContextOpen(true); setStartOpen(false); }} onClick={() => setContextOpen(false)}><div className="desktop-glow glow-one" /><div className="desktop-glow glow-two" /><div className="desktop-brand"><img src={signalMarkUrl} alt="" /><div><strong>BHARANI / SYSTEMS</strong><span>PERSONAL WORKSTATION</span></div></div><div className="desktop-icons">{desktopApps.map((id) => <button className="desktop-icon" key={id} onDoubleClick={(event) => { event.stopPropagation(); openApp(id); }} onClick={(event) => { event.stopPropagation(); setActiveId(id); }}><span className="desktop-icon-box"><AppGlyph id={id} size={25} /></span><span>{appMeta[id].short}</span></button>)}</div><div className="system-widget"><div className="widget-live"><span className="presence-dot" /> SYSTEM ONLINE</div><div className="widget-time">{formatTime(now)}</div><div className="widget-sub">{formatDate(now)} · IST</div><div className="widget-progress"><span style={{ width: "78%" }} /></div><div className="widget-foot"><span>AI SYSTEMS</span><b>78%</b></div></div><div className="window-layer">{windows.filter((win) => !win.minimized).map((win) => <WindowShell key={win.id} win={win} active={activeId === win.id} onFocus={() => setActiveId(win.id)} onClose={() => closeApp(win.id)} onMinimize={() => minimizeApp(win.id)} onMaximize={() => maximizeApp(win.id)} onTitlePointerDown={(event) => handleTitlePointerDown(event, win.id)}><WindowContent id={win.id} openApp={openApp} lightMode={lightMode} setLightMode={setLightMode} /></WindowShell>)}</div>
    {contextOpen && <div className="context-menu" onClick={(event) => event.stopPropagation()}><button onClick={() => setStartOpen(true)}><Search size={14} /> Search apps</button><button onClick={() => openApp("settings")}><Settings2 size={14} /> Personalize</button><button onClick={() => openApp("projects")}><Activity size={14} /> Refresh index</button></div>}
    {startOpen && <div className="start-menu" onClick={(event) => event.stopPropagation()}><div className="start-search"><Search size={16} /><input id="start-search" value={startQuery} onChange={(event) => setStartQuery(event.target.value)} placeholder="Search apps, projects, files..." autoFocus /></div><div className="start-heading"><span>Pinned</span><button onClick={() => setStartQuery("")}>All apps <ChevronRight size={13} /></button></div><div className="pinned-grid">{filteredApps.slice(0, 8).map((id) => <button key={id} onClick={() => openApp(id)}><span className="start-app-icon"><AppGlyph id={id} size={19} /></span><span>{appMeta[id].short}</span></button>)}</div><div className="start-heading recommended-heading"><span>Recommended</span><button onClick={() => openApp("projects")}>See all <ChevronRight size={13} /></button></div><div className="recommended-list"><button onClick={() => openApp("projects")}><div className="recommend-icon"><BriefcaseBusiness size={17} /></div><div><strong>Project Hub</strong><span>{repos.length} repositories indexed</span></div><small>now</small></button><button onClick={() => openApp("terminal")}><div className="recommend-icon"><TerminalIcon size={17} /></div><div><strong>vanta-code terminal</strong><span>Last opened · system tools</span></div><small>1h</small></button></div><div className="start-footer"><div className="start-user"><div className="mini-avatar"><img src={profile.avatar} alt="" /></div><span>{profile.name}</span></div><button onClick={() => setLoggedIn(false)} aria-label="Sign out"><LockKeyhole size={15} /></button></div></div>}
    {notificationOpen && <NotificationPanel onClose={() => setNotificationOpen(false)} />}
    <nav className="taskbar" onClick={(event) => event.stopPropagation()}><button className="start-button" aria-label="Start" onClick={() => { setStartOpen(!startOpen); setNotificationOpen(false); }}><img src={signalMarkUrl} alt="" /></button><div className="taskbar-search" onClick={() => { setStartOpen(true); window.setTimeout(() => document.getElementById("start-search")?.focus(), 20); }}><Search size={15} /><span>Search</span></div><div className="taskbar-pinned">{pinnedApps.map((id) => <button className={activeId === id ? "taskbar-app taskbar-active" : "taskbar-app"} key={id} onClick={() => openApp(id)}><AppGlyph id={id} size={19} /></button>)}</div><div className="taskbar-spacer" /><div className="tray"><button className="tray-button" onClick={() => { setNotificationOpen(!notificationOpen); setStartOpen(false); }}><Wifi size={14} /><Volume2 size={14} /><BatteryFull size={15} /></button><button className="clock" onClick={() => openApp("weather")}><span>{formatTime(now)}</span><small>{formatDate(now)}</small></button><button className="show-desktop" aria-label="Show desktop" onClick={() => setWindows((current) => current.map((item) => ({ ...item, minimized: false })))} /></div></nav></main>;
}
