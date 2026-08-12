// Mica Ember sound system: short, quiet Web Audio feedback that only starts after a user gesture.
export type SystemSound = "login" | "open" | "close" | "focus" | "menu" | "notification" | "error";

let audioContext: AudioContext | null = null;
let muted = false;
let volume = 0.045;

try { muted = window.localStorage.getItem("bharani-sound-muted") === "1"; } catch { /* storage can be unavailable in private contexts */ }

function context() {
  if (!audioContext) audioContext = new AudioContext();
  if (audioContext.state === "suspended") void audioContext.resume();
  return audioContext;
}

function blip(frequency: number, duration: number, delay = 0, type: OscillatorType = "sine", gainScale = 1) {
  const ctx = context(); const oscillator = ctx.createOscillator(); const gain = ctx.createGain(); const start = ctx.currentTime + delay;
  oscillator.type = type; oscillator.frequency.setValueAtTime(frequency, start); gain.gain.setValueAtTime(0.0001, start); gain.gain.exponentialRampToValueAtTime(volume * gainScale, start + 0.012); gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gain).connect(ctx.destination); oscillator.start(start); oscillator.stop(start + duration + 0.02);
}

export function playSystemSound(sound: SystemSound) {
  if (muted) return;
  try {
    if (sound === "login") { blip(392, .18, 0, "sine", 1.1); blip(587, .28, .09, "sine", .9); }
    else if (sound === "open") { blip(330, .09, 0, "triangle", .65); blip(494, .12, .05, "triangle", .45); }
    else if (sound === "close") blip(220, .11, 0, "triangle", .5);
    else if (sound === "focus") blip(440, .045, 0, "sine", .28);
    else if (sound === "menu") blip(360, .06, 0, "sine", .34);
    else if (sound === "notification") { blip(523, .1, 0, "sine", .55); blip(659, .13, .07, "sine", .42); }
    else blip(150, .14, 0, "sawtooth", .35);
  } catch { /* browsers can reject audio until the next user gesture */ }
}

export function setSoundMuted(value: boolean) { muted = value; try { window.localStorage.setItem("bharani-sound-muted", value ? "1" : "0"); } catch { /* no-op */ } }
export function isSoundMuted() { return muted; }
export function setSoundVolume(value: number) { volume = Math.max(0, Math.min(.08, value)); }
