import { useId } from "react";
import type { Product } from "../data/types";

/**
 * Ilustración vectorial que sustituye a la fotografía del producto mientras
 * no haya imágenes con derechos de uso. Cada tipo de producto tiene su propia
 * composición, siempre sobre un fondo de estudio del color de la licencia,
 * para que las tarjetas mantengan un aspecto uniforme.
 *
 * `view` permite generar varias vistas para la galería de la ficha.
 */
export function ProductArt({ product, view = 0, className }: { product: Pick<Product, "art" | "name">; view?: number; className?: string }) {
  const uid = useId().replace(/:/g, "");
  const { kind, hue, accent = (hue + 40) % 360, label = product.name, number } = product.art;
  const c = {
    bg: `hsl(${hue} 32% 90%)`,
    bg2: `hsl(${hue} 40% 82%)`,
    main: `hsl(${hue} 72% 46%)`,
    dark: `hsl(${hue} 60% 22%)`,
    light: `hsl(${hue} 85% 70%)`,
    acc: `hsl(${accent} 85% 56%)`,
    ink: "#15110f",
  };
  const lines = wrap(label, kind === "manga" ? 10 : 14, 3);

  // Vistas de galería: 0 = frontal, 1 = detalle ampliado, 2 = composición.
  const transform = view === 1 ? "translate(-140 -120) scale(1.7)" : view === 2 ? "rotate(-6 200 250) translate(8 6)" : undefined;

  return (
    <svg className={`product-art ${className ?? ""}`} viewBox="0 0 400 500" role="img" aria-label={`Ilustración provisional: ${product.name}`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id={`bg${uid}`} cx="50%" cy="38%" r="75%">
          <stop offset="0" stopColor="#fff" stopOpacity=".9" />
          <stop offset=".55" stopColor={c.bg} />
          <stop offset="1" stopColor={c.bg2} />
        </radialGradient>
        <linearGradient id={`main${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={c.light} />
          <stop offset=".55" stopColor={c.main} />
          <stop offset="1" stopColor={c.dark} />
        </linearGradient>
        <linearGradient id={`foil${uid}`} x1="0" y1="0" x2="1" y2=".3">
          <stop offset="0" stopColor={c.dark} />
          <stop offset=".35" stopColor={c.light} />
          <stop offset=".5" stopColor="#fff" stopOpacity=".9" />
          <stop offset=".65" stopColor={c.main} />
          <stop offset="1" stopColor={c.dark} />
        </linearGradient>
        <pattern id={`dots${uid}`} width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <circle cx="4.5" cy="4.5" r="1.6" fill={c.ink} opacity=".18" />
        </pattern>
        <filter id={`sh${uid}`} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="14" stdDeviation="14" floodColor={c.dark} floodOpacity=".35" />
        </filter>
      </defs>

      <rect width="400" height="500" fill={`url(#bg${uid})`} />
      <ellipse cx="200" cy="448" rx="150" ry="16" fill={c.dark} opacity=".14" />

      <g transform={transform} filter={`url(#sh${uid})`}>
        {kind === "manga" && (
          <g transform="rotate(-3 200 250)">
            <rect x="92" y="62" width="216" height="330" rx="4" fill={`url(#main${uid})`} />
            <rect x="92" y="62" width="216" height="330" rx="4" fill={`url(#dots${uid})`} />
            <rect x="92" y="62" width="14" height="330" fill={c.ink} opacity=".25" />
            <path d={`M106 300 L308 210 L308 392 L106 392 Z`} fill={c.acc} opacity=".9" />
            <text x="290" y="124" textAnchor="end" className="art-num" fontSize="64" fill="#fff">{number}</text>
            {lines.map((l, i) => (
              <text key={i} x="122" y={330 + i * 26 - (lines.length - 1) * 26} className="art-title" fontSize="26" fill="#fff">{l}</text>
            ))}
            <rect x="106" y="368" width="202" height="24" fill={c.ink} />
            <text x="120" y="385" className="art-small" fontSize="11" fill="#fff">VOL. {number}</text>
          </g>
        )}

        {kind === "funko" && (
          <g>
            <rect x="96" y="56" width="208" height="344" rx="10" fill={`url(#main${uid})`} />
            <rect x="116" y="112" width="168" height="208" rx="84" fill="#fff" opacity=".92" />
            <circle cx="200" cy="186" r="52" fill={c.acc} />
            <rect x="166" y="232" width="68" height="70" rx="20" fill={c.dark} />
            <circle cx="182" cy="192" r="8" fill={c.ink} />
            <circle cx="218" cy="192" r="8" fill={c.ink} />
            <path d="M96 66a10 10 0 0 1 10-10h198a10 10 0 0 1 10 10v30H96Z" fill={c.ink} />
            <text x="114" y="84" className="art-title" fontSize="20" fill="#fff">POP!</text>
            {number && <circle cx="276" cy="78" r="17" fill="#fff" />}
            {number && <text x="276" y="83" textAnchor="middle" className="art-small" fontSize={number && number.length > 3 ? 9 : 12} fill={c.ink}>{number}</text>}
            {lines.slice(0, 2).map((l, i) => (
              <text key={i} x="200" y={354 + i * 22} textAnchor="middle" className="art-title" fontSize="20" fill="#fff">{l}</text>
            ))}
          </g>
        )}

        {kind === "tcg-box" && (
          <g>
            <path d="M70 160 L200 120 L330 160 L200 200 Z" fill={c.light} />
            <path d="M70 160 L200 200 L200 410 L70 370 Z" fill={`url(#main${uid})`} />
            <path d="M200 200 L330 160 L330 370 L200 410 Z" fill={c.dark} />
            <path d="M70 160 L200 200 L200 410 L70 370 Z" fill={`url(#dots${uid})`} />
            <g transform="translate(135 250) skewY(17)">
              <path d="M0 -42 L26 0 L0 42 L-26 0 Z" fill={c.acc} stroke="#fff" strokeWidth="3" />
            </g>
            {lines.map((l, i) => (
              <text key={i} x="0" y="0" transform={`translate(214 ${262 + i * 22}) skewY(-17)`} className="art-title" fontSize="17" fill="#fff">{l}</text>
            ))}
            <text x="0" y="0" transform="translate(214 330) skewY(-17)" className="art-small" fontSize="10" fill="#fff" opacity=".8">BOOSTER BOX</text>
          </g>
        )}

        {kind === "tcg-pack" && (
          <g transform="rotate(4 200 250)">
            <path d={`M120 70 ${zigzag(120, 280, 70, 8)} L280 430 ${zigzag(280, 120, 430, -8)} Z`} fill={`url(#foil${uid})`} />
            <rect x="120" y="96" width="160" height="16" fill={c.ink} opacity=".25" />
            <rect x="120" y="388" width="160" height="16" fill={c.ink} opacity=".25" />
            <circle cx="200" cy="230" r="58" fill={c.acc} stroke="#fff" strokeWidth="5" />
            <path d="M200 192 l10 26 27 2 -21 17 7 27 -23 -15 -23 15 7 -27 -21 -17 27 -2Z" fill="#fff" />
            <rect x="132" y={lines.length > 1 ? 304 : 312} width="136" height={lines.length > 1 ? 56 : 36} rx="4" fill={c.ink} opacity=".88" />
            {lines.slice(0, 2).map((l, i) => (
              <text key={i} x="200" y={337 + i * 22 - (lines.length > 1 ? 11 : 0)} textAnchor="middle" className="art-title" fontSize="19" fill="#fff">{l}</text>
            ))}
          </g>
        )}

        {kind === "figure" && (
          <g>
            {/* Caja expositora con ventana: cara lateral + frontal */}
            <path d="M262 92 L306 112 L306 400 L262 414 Z" fill={c.dark} />
            <rect x="94" y="92" width="168" height="322" rx="4" fill={`url(#main${uid})`} />
            <rect x="94" y="92" width="168" height="322" rx="4" fill={`url(#dots${uid})`} />
            <rect x="110" y="132" width="136" height="216" rx="68" fill="#fff" opacity=".9" />
            <path d="M178 140 L194 196 L244 186 L204 222 L232 270 L184 246 L150 290 L156 236 L114 214 L162 200Z" fill={c.acc} opacity=".55" />
            <ellipse cx="178" cy="330" rx="40" ry="9" fill={c.dark} opacity=".5" />
            <path d="M160 328 C 158 290, 152 262, 160 236 C 166 220, 190 220, 196 236 C 204 262, 198 290, 196 328 Z" fill={c.dark} />
            <path d="M162 240 C 146 250, 140 270, 136 286 M194 240 C 212 248, 220 262, 226 276" stroke={c.dark} strokeWidth="11" strokeLinecap="round" fill="none" />
            <circle cx="178" cy="206" r="21" fill={c.dark} />
            <path d="M154 204 L160 176 L170 190 L178 168 L188 190 L198 178 L202 204 Z" fill={c.dark} />
            <rect x="94" y="92" width="168" height="26" fill={c.ink} />
            <text x="106" y="110" className="art-small" fontSize="10" fill="#fff">COLLECTOR FIGURE</text>
            {lines.slice(0, 2).map((l, i) => (
              <text key={i} x="178" y={378 + i * 20 - (lines.length > 1 ? 10 : 0)} textAnchor="middle" className="art-title" fontSize="19" fill="#fff">{l}</text>
            ))}
          </g>
        )}

        {kind === "model-kit" && (
          <g>
            <rect x="50" y="120" width="300" height="250" rx="6" fill="#fff" />
            <rect x="50" y="120" width="300" height="250" rx="6" fill={`url(#main${uid})`} opacity=".95" />
            {[0, 1, 2, 3, 4].map((i) => (
              <path key={i} d={`M${60 + i * 60} 370 L${150 + i * 60} 120`} stroke="#fff" strokeOpacity=".18" strokeWidth="14" />
            ))}
            <g transform="translate(250 230)">
              <path d="M-50 -10 L-90 -60 L-30 -24 Z M50 -10 L90 -60 L30 -24 Z" fill="#ffd23f" />
              <path d="M-40 -30 L40 -30 L50 30 L0 60 L-50 30 Z" fill="#fff" />
              <path d="M-30 0 L-8 8 L-30 14Z M30 0 L8 8 L30 14Z" fill={c.acc} />
              <rect x="-12" y="30" width="24" height="16" fill={c.acc} />
            </g>
            <rect x="70" y="140" width="60" height="34" fill={c.ink} />
            <text x="100" y="164" textAnchor="middle" className="art-title" fontSize="20" fill="#fff">{/SD|BB/.test(product.name) ? "SD" : "HG"}</text>
            {lines.slice(0, 2).map((l, i) => (
              <text key={i} x="72" y={318 + i * 24} className="art-title" fontSize="22" fill="#fff">{l}</text>
            ))}
            <text x="72" y="356" className="art-small" fontSize="10" fill="#fff" opacity=".85">1/144 · MODEL KIT</text>
          </g>
        )}

        {kind === "sleeves" && (
          <g>
            {[2, 1, 0].map((i) => (
              <rect key={i} x={130 + i * 16} y={110 - i * 14} width="150" height="214" rx="10" fill={i === 0 ? `url(#main${uid})` : i === 1 ? c.acc : c.dark} transform={`rotate(${-8 + i * 7} 200 250)`} />
            ))}
            <rect x="110" y="250" width="180" height="150" rx="8" fill={c.ink} />
            <rect x="110" y="250" width="180" height="150" rx="8" fill={`url(#dots${uid})`} />
            {lines.slice(0, 2).map((l, i) => (
              <text key={i} x="200" y={318 + i * 24} textAnchor="middle" className="art-title" fontSize="22" fill="#fff">{l}</text>
            ))}
            <text x="200" y="378" textAnchor="middle" className="art-small" fontSize="10" fill="#fff" opacity=".75">CARD PROTECTION</text>
          </g>
        )}

        {kind === "board-game" && (
          <g>
            <path d="M60 200 L200 140 L340 200 L200 260 Z" fill={c.light} />
            <path d="M60 200 L200 260 L200 330 L60 270 Z" fill={c.main} />
            <path d="M200 260 L340 200 L340 270 L200 330 Z" fill={c.dark} />
            {[0, 1, 2, 3].map((r) =>
              [0, 1, 2, 3].map((k) =>
                (r + k) % 2 === 0 ? <path key={`${r}${k}`} d={diamond(r, k)} fill={c.acc} opacity=".7" /> : null,
              ),
            )}
            <text x="200" y="400" textAnchor="middle" className="art-title" fontSize="24" fill={c.dark}>{lines[0]}</text>
          </g>
        )}

        {kind === "puzzle" && (
          <g>
            <rect x="70" y="110" width="260" height="260" rx="8" fill={`url(#main${uid})`} />
            <path d="M70 196 H330 M70 283 H330 M156 110 V370 M243 110 V370" stroke="#fff" strokeOpacity=".35" strokeWidth="3" />
            <path d="M243 196 h-30 a14 14 0 1 1 -28 0 h-29 v29 a14 14 0 1 0 0 28 v30 h87 z" fill={c.acc} transform="translate(26 -12) rotate(8 200 240)" />
            <text x="200" y="418" textAnchor="middle" className="art-title" fontSize="26" fill={c.dark}>{lines[0]}</text>
          </g>
        )}

        {kind === "paint" && (
          <g>
            {[0, 1, 2].map((i) => (
              <g key={i} transform={`translate(${110 + i * 90} ${250 + (i % 2) * 30})`}>
                <rect x="-36" y="-20" width="72" height="110" rx="10" fill={i === 1 ? c.acc : `hsl(${(hue + i * 70) % 360} 70% 50%)`} />
                <rect x="-40" y="-44" width="80" height="30" rx="6" fill={c.ink} />
                <rect x="-26" y="20" width="52" height="40" rx="4" fill="#fff" opacity=".9" />
              </g>
            ))}
            <path d="M150 90 L290 220" stroke={c.dark} strokeWidth="12" strokeLinecap="round" />
            <path d="M288 218 L310 244" stroke={c.acc} strokeWidth="16" strokeLinecap="round" />
          </g>
        )}
      </g>
    </svg>
  );
}

function wrap(text: string, max: number, maxLines: number) {
  const words = text.toUpperCase().split(/\s+/);
  const out: string[] = [];
  let line = "";
  for (const w of words) {
    if ((line + " " + w).trim().length > max && line) {
      out.push(line);
      line = w;
    } else line = (line + " " + w).trim();
  }
  if (line) out.push(line);
  if (out.length > maxLines) {
    const kept = out.slice(0, maxLines);
    kept[maxLines - 1] = kept[maxLines - 1].replace(/.{0,1}$/, "…");
    return kept;
  }
  return out;
}

function zigzag(from: number, to: number, y: number, depth: number) {
  const steps = 10;
  const pts: string[] = [];
  for (let i = 1; i <= steps; i++) {
    const x = from + ((to - from) * i) / steps;
    pts.push(`L${x - (to - from) / steps / 2} ${y - depth} L${x} ${y}`);
  }
  return pts.join(" ");
}

function diamond(r: number, k: number) {
  // Rejilla isométrica sobre la tapa del juego.
  const ox = 200 + (k - r) * 35;
  const oy = 140 + (k + r) * 15;
  return `M${ox} ${oy} L${ox + 35} ${oy + 15} L${ox} ${oy + 30} L${ox - 35} ${oy + 15} Z`;
}
