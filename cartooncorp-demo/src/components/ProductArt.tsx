import { useId, type ReactNode } from "react";
import type { Product } from "../data/types";

/**
 * Packshot ilustrado que sustituye a la fotografía del producto mientras no
 * haya imágenes con derechos de uso (ver `src/data/photos.ts`).
 *
 * Todos los productos comparten el mismo "estudio": fondo de papel continuo,
 * luz cenital y sombra de contacto, para que las tarjetas se vean uniformes.
 * Los objetos se dibujan como volúmenes (cara frontal, lateral y superior)
 * con el color de la licencia; no imitan logotipos ni portadas reales.
 *
 * `view` genera las vistas de la galería: 0 frontal, 1 detalle, 2 en ángulo.
 */
const FRAMES = {
  /** 4:5, encuadre ajustado al objeto (tarjetas, galería). */
  portrait: "24 70 352 440",
  /** 16:10, para mosaicos y bandas apaisadas. */
  wide: "-120 66 640 400",
};

export function ProductArt({
  product,
  view = 0,
  frame = "portrait",
  backdrop = true,
  className,
}: {
  product: Pick<Product, "art" | "name" | "brand">;
  view?: number;
  frame?: keyof typeof FRAMES;
  /** false: sin fondo de estudio, para colocar el objeto sobre otra superficie (vitrina del hero). */
  backdrop?: boolean;
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  const { kind, hue, accent = (hue + 40) % 360, label = product.name, number } = product.art;
  const c: Palette = {
    id,
    base: `hsl(${hue} 64% 45%)`,
    deep: `hsl(${hue} 58% 23%)`,
    pale: `hsl(${hue} 78% 72%)`,
    acc: `hsl(${accent} 82% 56%)`,
    accDeep: `hsl(${accent} 60% 30%)`,
    ink: "#17120f",
    paper: "#fbf7ef",
  };
  const brand = (product.brand ?? "").toUpperCase();
  const transform = view === 1 ? "translate(-150 -140) scale(1.75)" : view === 2 ? "rotate(-7 200 270) translate(6 4)" : undefined;

  return (
    <svg className={`product-art ${className ?? ""}`} viewBox={FRAMES[frame]} role="img" aria-label={`Ilustración provisional: ${product.name}`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`bg${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={`hsl(${hue} 22% 95%)`} />
          <stop offset=".66" stopColor={`hsl(${hue} 24% 89%)`} />
          <stop offset=".67" stopColor={`hsl(${hue} 22% 87%)`} />
          <stop offset="1" stopColor={`hsl(${hue} 20% 82%)`} />
        </linearGradient>
        <radialGradient id={`spot${id}`} cx="50%" cy="30%" r="55%">
          <stop offset="0" stopColor="#fff" stopOpacity=".85" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`face${id}`} x1="0" y1="0" x2=".9" y2="1">
          <stop offset="0" stopColor={c.pale} />
          <stop offset=".45" stopColor={c.base} />
          <stop offset="1" stopColor={c.deep} />
        </linearGradient>
        <linearGradient id={`side${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={c.deep} />
          <stop offset="1" stopColor={`hsl(${hue} 55% 16%)`} />
        </linearGradient>
        <linearGradient id={`gloss${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".38" />
          <stop offset=".35" stopColor="#fff" stopOpacity=".06" />
          <stop offset=".36" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".12" />
        </linearGradient>
        <linearGradient id={`foil${id}`} x1="0" y1="0" x2="1" y2=".25">
          <stop offset="0" stopColor={c.deep} />
          <stop offset=".32" stopColor={c.base} />
          <stop offset=".48" stopColor="#fff" stopOpacity=".95" />
          <stop offset=".62" stopColor={c.pale} />
          <stop offset="1" stopColor={c.deep} />
        </linearGradient>
        <radialGradient id={`win${id}`} cx="50%" cy="35%" r="70%">
          <stop offset="0" stopColor={`hsl(${hue} 30% 96%)`} />
          <stop offset="1" stopColor={`hsl(${hue} 35% 80%)`} />
        </radialGradient>
        <pattern id={`dots${id}`} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
          <circle cx="3.5" cy="3.5" r="1.3" fill="#000" opacity=".16" />
        </pattern>
        <filter id={`blur${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>

      {backdrop && (
        <>
          <rect x="-200" width="800" height="500" fill={`url(#bg${id})`} />
          <rect x="-200" width="800" height="500" fill={`url(#spot${id})`} />
        </>
      )}

      <g transform={transform}>
        <ellipse cx="205" cy="420" rx="128" ry="13" fill={backdrop ? c.deep : "#000"} opacity={backdrop ? 0.28 : 0.55} filter={`url(#blur${id})`} />
        {kind === "manga" && <Manga c={c} label={label} number={number} brand={brand} />}
        {kind === "funko" && <Funko c={c} label={label} number={number} />}
        {kind === "tcg-box" && <TcgBox c={c} label={label} />}
        {kind === "tcg-pack" && <TcgPack c={c} label={label} />}
        {kind === "figure" && <Figure c={c} label={label} brand={brand} />}
        {kind === "model-kit" && <ModelKit c={c} label={label} grade={/\bSD\b|BB\d/.test(product.name) ? "SD" : "HG"} />}
        {kind === "sleeves" && <Sleeves c={c} label={label} />}
        {kind === "board-game" && <BoardGame c={c} label={label} />}
        {kind === "puzzle" && <Puzzle c={c} label={label} />}
        {kind === "paint" && <Paint c={c} hue={hue} />}
      </g>
    </svg>
  );
}

interface Palette {
  id: string;
  base: string;
  deep: string;
  pale: string;
  acc: string;
  accDeep: string;
  ink: string;
  paper: string;
}

/**
 * Caja en perspectiva caballera: cara frontal (con el contenido de `children`
 * en coordenadas locales), canto lateral y tapa. `dir` indica hacia qué lado
 * se ve el canto.
 */
function Box({ c, x, y, w, h, d, dir = 1, rx = 3, side, top, children }: { c: Palette; x: number; y: number; w: number; h: number; d: number; dir?: 1 | -1; rx?: number; side?: string; top?: string; children: ReactNode }) {
  const ox = d * 0.62 * dir;
  const oy = -d * 0.42;
  const edgeX = dir === 1 ? x + w : x;
  const clip = `clip-${c.id}-${x}-${y}`;
  return (
    <g>
      <path d={`M${edgeX} ${y} L${edgeX + ox} ${y + oy} L${edgeX + ox} ${y + h + oy} L${edgeX} ${y + h} Z`} fill={side ?? `url(#side${c.id})`} />
      <path d={`M${x} ${y} L${x + ox} ${y + oy} L${x + w + ox} ${y + oy} L${x + w} ${y} Z`} fill={top ?? c.pale} />
      <clipPath id={clip}>
        <rect x={x} y={y} width={w} height={h} rx={rx} />
      </clipPath>
      <g clipPath={`url(#${clip})`}>
        <g transform={`translate(${x} ${y})`}>{children}</g>
        <rect x={x} y={y} width={w} height={h} fill={`url(#gloss${c.id})`} />
      </g>
    </g>
  );
}

function Lines({ lines, x, y, size, anchor = "start", fill = "#fff", gap = 1.05, className = "art-title" }: { lines: string[]; x: number; y: number; size: number; anchor?: "start" | "middle" | "end"; fill?: string; gap?: number; className?: string }) {
  return (
    <>
      {lines.map((l, i) => (
        <text key={i} x={x} y={y + i * size * gap} textAnchor={anchor} className={className} fontSize={size} fill={fill}>
          {l}
        </text>
      ))}
    </>
  );
}

function Manga({ c, label, number, brand }: { c: Palette; label: string; number?: string; brand: string }) {
  const W = 196;
  const H = 296;
  return (
    <Box c={c} x={112} y={118} w={W} h={H} d={26} dir={-1} rx={2} side={c.deep} top={c.paper}>
      <rect width={W} height={H} fill={`url(#face${c.id})`} />
      {/* ilustración abstracta de cubierta */}
      <circle cx={W * 0.66} cy={H * 0.5} r="78" fill={c.acc} />
      <circle cx={W * 0.66} cy={H * 0.5} r="78" fill={`url(#dots${c.id})`} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <path key={i} d={`M${-20 + i * 42} ${H} L${70 + i * 42} 60`} stroke="#fff" strokeOpacity=".13" strokeWidth="5" />
      ))}
      <path d={`M0 ${H * 0.72} L${W * 0.38} ${H * 0.56} L${W * 0.62} ${H * 0.68} L${W} ${H * 0.5} L${W} ${H} L0 ${H} Z`} fill={c.ink} opacity=".78" />
      <rect x="0" y="0" width={W} height="78" fill={c.ink} opacity=".18" />
      <Lines lines={wrap(label.replace(/\s+\d+.*$/, ""), 11, 2)} x={14} y={36} size={25} />
      <rect x="14" y={H - 64} width="52" height="34" fill="#fff" />
      <text x="40" y={H - 39} textAnchor="middle" className="art-num" fontSize="26" fill={c.ink}>
        {number}
      </text>
      <rect x="0" y={H - 20} width={W} height="20" fill={c.paper} />
      <text x="14" y={H - 7} className="art-small" fontSize="8.5" fill={c.ink}>
        {brand || "EDITORIAL"}
      </text>
      {/* lomo del libro */}
      <rect x="0" y="0" width="5" height={H} fill="#000" opacity=".18" />
    </Box>
  );
}

function Funko({ c, label, number }: { c: Palette; label: string; number?: string }) {
  const W = 176;
  const H = 236;
  return (
    <Box c={c} x={104} y={178} w={W} h={H} d={72} rx={4}>
      <rect width={W} height={H} fill={`url(#face${c.id})`} />
      <rect width={W} height="38" fill={c.ink} />
      <text x="14" y="26" className="art-title" fontSize="21" fill="#fff">
        POP!
      </text>
      {number && (
        <>
          <circle cx={W - 24} cy="19" r="14" fill="#fff" />
          <text x={W - 24} y="23" textAnchor="middle" className="art-small" fontSize={number.length > 3 ? 7.5 : 10} fill={c.ink}>
            {number}
          </text>
        </>
      )}
      {/* ventana de plástico con la silueta de la figura */}
      <rect x="16" y="50" width={W - 32} height="138" rx="10" fill={`url(#win${c.id})`} />
      <g>
        <ellipse cx={W / 2} cy="104" rx="42" ry="37" fill={c.deep} />
        <path d={`M${W / 2 - 26} 186 Q${W / 2 - 30} 146 ${W / 2} 142 Q${W / 2 + 30} 146 ${W / 2 + 26} 186 Z`} fill={c.deep} />
        <ellipse cx={W / 2 - 14} cy="90" rx="16" ry="9" fill="#fff" opacity=".16" />
      </g>
      <path d={`M16 188 L${W - 70} 50 L${W - 40} 50 L46 188 Z`} fill="#fff" opacity=".22" />
      <Lines lines={wrap(label, 14, 2)} x={W / 2} y={210} size={16} anchor="middle" />
    </Box>
  );
}

function TcgBox({ c, label }: { c: Palette; label: string }) {
  const W = 214;
  const H = 168;
  return (
    <Box c={c} x={82} y={246} w={W} h={H} d={118} rx={3}>
      <rect width={W} height={H} fill={`url(#face${c.id})`} />
      <rect width={W} height={H} fill={`url(#dots${c.id})`} opacity=".5" />
      <path d={`M0 ${H} L${W * 0.55} 0 L${W} 0 L${W} ${H} Z`} fill={c.ink} opacity=".25" />
      <g transform="translate(44 84)">
        <path d="M0 -40 L28 0 L0 40 L-28 0 Z" fill={c.acc} stroke="#fff" strokeWidth="3" />
        <path d="M0 -18 L12 0 L0 18 L-12 0 Z" fill="#fff" opacity=".85" />
      </g>
      <Lines lines={wrap(label, 13, 3)} x={88} y={58} size={17} />
      <text x="88" y={H - 18} className="art-small" fontSize="8" fill="#fff" opacity=".85">
        CAJA DE SOBRES
      </text>
    </Box>
  );
}

function TcgPack({ c, label }: { c: Palette; label: string }) {
  const lines = wrap(label, 13, 2);
  return (
    <g transform="rotate(5 200 260)">
      <path d={`M132 84 ${zigzag(132, 268, 84, 7)} L268 432 ${zigzag(268, 132, 432, -7)} Z`} fill={`url(#foil${c.id})`} />
      <rect x="132" y="104" width="136" height="12" fill="#000" opacity=".2" />
      <rect x="132" y="404" width="136" height="12" fill="#000" opacity=".2" />
      <circle cx="200" cy="232" r="50" fill={c.acc} stroke="#fff" strokeWidth="4" />
      <path d="M200 199 l9 23 24 2 -18 15 6 24 -21 -13 -21 13 6 -24 -18 -15 24 -2Z" fill="#fff" />
      <rect x="146" y={lines.length > 1 ? 300 : 308} width="108" height={lines.length > 1 ? 52 : 34} rx="3" fill={c.ink} opacity=".88" />
      <Lines lines={lines} x={200} y={lines.length > 1 ? 321 : 331} size={16} anchor="middle" />
      <path d="M150 84 L178 84 L150 432 L132 432 Z" fill="#fff" opacity=".12" />
    </g>
  );
}

function Figure({ c, label, brand }: { c: Palette; label: string; brand: string }) {
  const W = 168;
  const H = 286;
  const cx = W / 2;
  return (
    <Box c={c} x={108} y={128} w={W} h={H} d={54} rx={3}>
      <rect width={W} height={H} fill={`url(#face${c.id})`} />
      <rect width={W} height="26" fill={c.ink} />
      <text x="12" y="17" className="art-small" fontSize="8" fill="#fff">
        {brand ? `${brand} · ` : ""}COLLECTION
      </text>
      {/* ventana en arco */}
      <path d={`M14 ${H - 58} L14 104 A70 70 0 0 1 ${W - 14} 104 L${W - 14} ${H - 58} Z`} fill={`url(#win${c.id})`} />
      <path d={`M${cx} 52 L${cx + 14} 92 L${cx + 52} 86 L${cx + 22} 112 L${cx + 40} 150 L${cx} 128 L${cx - 40} 150 L${cx - 22} 112 L${cx - 52} 86 L${cx - 14} 92 Z`} fill={c.acc} opacity=".45" />
      {/* silueta de la figura sobre peana */}
      <ellipse cx={cx} cy={H - 70} rx="44" ry="9" fill={c.deep} />
      <path d={`M${cx - 18} ${H - 72} C ${cx - 22} ${H - 110}, ${cx - 30} ${H - 140}, ${cx - 20} ${H - 168} C ${cx - 12} ${H - 184}, ${cx + 12} ${H - 184}, ${cx + 20} ${H - 168} C ${cx + 30} ${H - 140}, ${cx + 22} ${H - 110}, ${cx + 18} ${H - 72} Z`} fill={c.deep} />
      <path d={`M${cx - 20} ${H - 162} Q ${cx - 46} ${H - 140} ${cx - 50} ${H - 116}`} stroke={c.deep} strokeWidth="10" strokeLinecap="round" fill="none" />
      <path d={`M${cx + 20} ${H - 162} Q ${cx + 44} ${H - 176} ${cx + 52} ${H - 200}`} stroke={c.deep} strokeWidth="10" strokeLinecap="round" fill="none" />
      <circle cx={cx} cy={H - 198} r="19" fill={c.deep} />
      <path d={`M${cx - 22} ${H - 200} L${cx - 16} ${H - 228} L${cx - 6} ${H - 212} L${cx + 2} ${H - 234} L${cx + 10} ${H - 212} L${cx + 20} ${H - 224} L${cx + 22} ${H - 198} Z`} fill={c.deep} />
      <path d={`M${cx + 14} ${H - 176} C ${cx + 26} ${H - 146}, ${cx + 22} ${H - 110}, ${cx + 18} ${H - 76}`} stroke="#fff" strokeOpacity=".35" strokeWidth="2.5" fill="none" />
      <Lines lines={wrap(label, 13, 2)} x={cx} y={H - 32} size={16} anchor="middle" />
    </Box>
  );
}

function ModelKit({ c, label, grade }: { c: Palette; label: string; grade: string }) {
  const W = 268;
  const H = 168;
  return (
    <Box c={c} x={52} y={244} w={W} h={H} d={60} rx={3} top={c.paper}>
      <rect width={W} height={H} fill={`url(#face${c.id})`} />
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={`M${10 + i * 56} ${H} L${100 + i * 56} 0`} stroke="#fff" strokeOpacity=".15" strokeWidth="12" />
      ))}
      <g transform={`translate(${W - 72} ${H / 2 + 4})`}>
        <path d="M-40 -14 L-74 -56 L-26 -28 Z M40 -14 L74 -56 L26 -28 Z" fill="#ffd23f" />
        <path d="M-34 -30 L34 -30 L42 22 L0 48 L-42 22 Z" fill="#fff" />
        <path d="M-26 -2 L-6 6 L-26 12Z M26 -2 L6 6 L26 12Z" fill={c.acc} />
        <rect x="-10" y="26" width="20" height="12" fill={c.acc} />
      </g>
      <rect x="14" y="14" width="46" height="28" fill={c.ink} />
      <text x="37" y="34" textAnchor="middle" className="art-title" fontSize="18" fill="#fff">
        {grade}
      </text>
      <Lines lines={wrap(label, 12, 2)} x={14} y={H - 46} size={19} />
      <text x="14" y={H - 10} className="art-small" fontSize="8" fill="#fff" opacity=".85">
        1/144 · MODEL KIT
      </text>
    </Box>
  );
}

function Sleeves({ c, label }: { c: Palette; label: string }) {
  const W = 168;
  const H = 250;
  return (
    <g>
      {/* pestaña para colgar */}
      <path d="M150 134 L250 134 L262 162 L138 162 Z" fill={c.ink} />
      <ellipse cx="200" cy="146" rx="14" ry="5" fill={`hsl(0 0% 85%)`} />
      <Box c={c} x={116} y={162} w={W} h={H} d={16} rx={4}>
        <rect width={W} height={H} fill={c.ink} />
        <rect x="14" y="16" width={W - 28} height="150" rx="6" fill={`url(#win${c.id})`} />
        {[0, 1, 2].map((i) => (
          <rect key={i} x={30 + i * 8} y={30 + i * 8} width={W - 76} height="112" rx="5" fill={i === 2 ? c.base : i === 1 ? c.acc : c.deep} />
        ))}
        <path d={`M14 166 L${W - 60} 16 L${W - 30} 16 L44 166 Z`} fill="#fff" opacity=".25" />
        <Lines lines={wrap(label, 13, 2)} x={W / 2} y={196} size={17} anchor="middle" />
        <text x={W / 2} y={H - 14} textAnchor="middle" className="art-small" fontSize="7.5" fill="#fff" opacity=".7">
          CARD PROTECTION
        </text>
      </Box>
    </g>
  );
}

function BoardGame({ c, label }: { c: Palette; label: string }) {
  const W = 238;
  const H = 150;
  return (
    <Box c={c} x={70} y={262} w={W} h={H} d={86} rx={3} top={c.paper}>
      <rect width={W} height={H} fill={`url(#face${c.id})`} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={i * 42 - 6} y={(i % 2) * 30 + 20} width="34" height="34" rx="6" fill={i % 2 ? c.acc : "#fff"} opacity={i % 2 ? 0.9 : 0.25} transform={`rotate(12 ${i * 42 + 11} ${(i % 2) * 30 + 37})`} />
      ))}
      <rect x="0" y={H - 56} width={W} height="56" fill={c.ink} opacity=".8" />
      <Lines lines={wrap(label, 18, 1)} x={14} y={H - 22} size={22} />
    </Box>
  );
}

function Puzzle({ c, label }: { c: Palette; label: string }) {
  const W = 250;
  const H = 176;
  return (
    <Box c={c} x={66} y={236} w={W} h={H} d={52} rx={3} top={c.paper}>
      <rect width={W} height={H} fill={`url(#face${c.id})`} />
      <path d={`M0 ${H / 2} H${W} M${W / 3} 0 V${H} M${(W * 2) / 3} 0 V${H}`} stroke="#fff" strokeOpacity=".35" strokeWidth="2.5" />
      <path d="M120 40 h-22 a12 12 0 1 1 -24 0 h-22 v24 a12 12 0 1 0 0 24 v22 h68 z" fill={c.acc} transform="translate(80 10) rotate(10 90 70)" />
      <rect x="14" y="14" width="74" height="30" fill={c.ink} />
      <text x="51" y="35" textAnchor="middle" className="art-title" fontSize="18" fill="#fff">
        {label}
      </text>
      <text x="14" y={H - 14} className="art-small" fontSize="8" fill="#fff" opacity=".85">
        JIGSAW PUZZLE
      </text>
    </Box>
  );
}

function Paint({ c, hue }: { c: Palette; hue: number }) {
  return (
    <g>
      {[0, 1, 2].map((i) => {
        const x = 98 + i * 76;
        const y = 316 + (i === 1 ? -18 : 0);
        const color = i === 1 ? c.acc : `hsl(${(hue + i * 80) % 360} 68% 48%)`;
        return (
          <g key={i}>
            <rect x={x} y={y} width="64" height="96" rx="9" fill={color} />
            <rect x={x} y={y} width="64" height="96" rx="9" fill={`url(#gloss${c.id})`} />
            <rect x={x - 3} y={y - 26} width="70" height="30" rx="6" fill={c.ink} />
            <rect x={x + 10} y={y + 30} width="44" height="34" rx="3" fill="#fff" opacity=".92" />
          </g>
        );
      })}
      <path d="M150 168 L268 286" stroke={c.deep} strokeWidth="11" strokeLinecap="round" />
      <path d="M266 284 L290 310" stroke={c.acc} strokeWidth="15" strokeLinecap="round" />
    </g>
  );
}

function wrap(text: string, max: number, maxLines: number) {
  const words = text.toUpperCase().split(/\s+/).filter(Boolean);
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
    kept[maxLines - 1] = kept[maxLines - 1].replace(/.?$/, "…");
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
