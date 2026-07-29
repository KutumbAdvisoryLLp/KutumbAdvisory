interface IconProps {
  className?: string;
  size?: number;
}

function P({ d, ...rest }: { d: string; [key: string]: unknown }) {
  return <path d={d} {...rest} />;
}
function L({ x1, y1, x2, y2, ...rest }: { x1: string | number; y1: string | number; x2: string | number; y2: string | number; [key: string]: unknown }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} {...rest} />;
}
function C({ cx, cy, r, ...rest }: { cx: string | number; cy: string | number; r: string | number; [key: string]: unknown }) {
  return <circle cx={cx} cy={cy} r={r} {...rest} />;
}
function R({ x, y, width, height, rx, ...rest }: { x: string | number; y: string | number; width: string | number; height: string | number; rx?: string | number; [key: string]: unknown }) {
  return <rect x={x} y={y} width={width} height={height} rx={rx} {...rest} />;
}

function useColors() {
  return { navy: "#201B62", gold: "#A8791F" };
}

export function KundaliEmblem({ className, size = 24, variant = "light" }: IconProps & { variant?: "light" | "dark" }) {
  const { navy, gold } = useColors();
  const s = size;
  const main = variant === "light" ? "#FFFFFF" : navy;
  const accent = gold;
  const dim = variant === "light" ? "0.3" : "0.15";
  return (
    <svg className={className} width={s} height={s} viewBox="0 0 24 24" fill="none">
      <C cx="12" cy="12" r="11" stroke={main} strokeWidth="0.6" />
      <C cx="12" cy="12" r="9" stroke={accent} strokeWidth="0.3" strokeOpacity={dim} strokeDasharray="2 3" />
      <C cx="12" cy="2" r="1.2" fill={accent} />
      <C cx="12" cy="22" r="1.2" fill={accent} />
      <C cx="2" cy="12" r="1.2" fill={accent} />
      <C cx="22" cy="12" r="1.2" fill={accent} />
      <L x1="12" y1="3.5" x2="12" y2="20.5" stroke={main} strokeWidth="0.3" strokeOpacity={dim} />
      <L x1="3.5" y1="12" x2="20.5" y2="12" stroke={main} strokeWidth="0.3" strokeOpacity={dim} />
      <C cx="12" cy="12" r="5" stroke={main} strokeWidth="0.6" />
      <C cx="12" cy="12" r="2.5" fill={accent} fillOpacity={variant === "light" ? "0.15" : "0.1"} />
      <C cx="12" cy="12" r="1.2" fill={accent} />
      <P d="M12 9L15 12L12 15L9 12Z" stroke={accent} strokeWidth="0.3" strokeOpacity="0.4" />
      <P d="M12 17c2 0 4-2 4-5s-2-5-4-5-4 2-4 5 2 5 4 5z" stroke={main} strokeWidth="0.3" strokeOpacity={dim} fill="none" />
    </svg>
  );
}

export function ArrowRight({ className, size = 24 }: IconProps) {
  const { gold } = useColors();
  const s = size;
  return (
    <svg className={className} width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <P d="M5 12h14" />
      <P d="M13 5l7 7-7 7" />
      <C cx="5" cy="12" r="1.2" fill={gold} stroke="none" />
    </svg>
  );
}

export function StarIcon({ className, size = 24 }: IconProps) {
  const { navy, gold } = useColors();
  const s = size;
  return (
    <svg className={className} width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={navy} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <P d="M12 2l2.4 7.4h7.6l-6 5.2 2.2 7.4L12 17l-6.2 5 2.2-7.4-6-5.2h7.6z" fill="none" />
      <C cx="12" cy="12" r="1.5" fill={gold} stroke="none" />
    </svg>
  );
}

export function CircleIcon({ className, size = 24 }: IconProps) {
  const { navy, gold } = useColors();
  const s = size;
  return (
    <svg className={className} width={s} height={s} viewBox="0 0 24 24" fill="none">
      <C cx="12" cy="12" r="9" stroke={navy} strokeWidth="1.2" />
      <C cx="12" cy="12" r="6" stroke={navy} strokeWidth="0.3" strokeOpacity="0.08" strokeDasharray="2 2" />
      <C cx="12" cy="12" r="2" fill={gold} fillOpacity="0.3" stroke="none" />
    </svg>
  );
}

export function ConnectedIcon({ className, size = 24 }: IconProps) {
  const { navy, gold } = useColors();
  const s = size;
  return (
    <svg className={className} width={s} height={s} viewBox="0 0 24 24" fill="none">
      <L x1="12" y1="2" x2="12" y2="22" stroke={navy} strokeWidth="0.4" strokeOpacity="0.12" />
      <P d="M12 4l4 4-4 4-4-4z" stroke={gold} strokeWidth="1.2" strokeLinejoin="round" fill={gold} fillOpacity="0.1" />
      <P d="M12 10l4 4-4 4-4-4z" stroke={gold} strokeWidth="1.2" strokeLinejoin="round" fill={gold} fillOpacity="0.06" />
      <P d="M12 16l4 4-4 4-4-4z" stroke={gold} strokeWidth="1.2" strokeLinejoin="round" fill={gold} fillOpacity="0.03" />
      <C cx="12" cy="6" r="1.5" fill={gold} stroke="none" />
      <C cx="12" cy="12" r="1" fill={gold} fillOpacity="0.4" stroke="none" />
      <C cx="12" cy="18" r="0.8" fill={gold} fillOpacity="0.2" stroke="none" />
    </svg>
  );
}

export function CheckIcon({ className, size = 24 }: IconProps) {
  const { gold } = useColors();
  const s = size;
  return (
    <svg className={className} width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <P d="M4 12l6 6L20 5" />
      <C cx="5" cy="13" r="1.5" fill={gold} stroke="none" />
    </svg>
  );
}

export function QuoteIcon({ className, size = 24 }: IconProps) {
  const { navy, gold } = useColors();
  const s = size;
  return (
    <svg className={className} width={s} height={s} viewBox="0 0 24 24" fill="none">
      <P d="M8 4C5 4 3 6 3 10v4c0 2.5 2 4.5 4 4.5" stroke={navy} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <P d="M8 13c0 2.5 2 4.5 4 4.5" stroke={navy} strokeWidth="1.3" strokeLinecap="round" />
      <P d="M16 4c-3 0-5 2-5 6v4c0 2.5 2 4.5 4 4.5" stroke={navy} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <P d="M16 13c0 2.5 2 4.5 4 4.5" stroke={navy} strokeWidth="1.3" strokeLinecap="round" />
      <C cx="7" cy="13" r="1.2" fill={gold} stroke="none" />
      <C cx="15" cy="13" r="1.2" fill={gold} stroke="none" />
    </svg>
  );
}

export function InvestmentIcon({ className, size = 24 }: IconProps) {
  const { navy, gold } = useColors();
  const s = size;
  return (
    <svg className={className} width={s} height={s} viewBox="0 0 24 24" fill="none">
      <P d="M2 20h20" stroke={navy} strokeWidth="0.4" strokeOpacity="0.15" />
      <R x="3.5" y="14" width="3" height="6" rx="0.8" stroke={navy} strokeWidth="1.2" fill="none" />
      <R x="8.5" y="11" width="3" height="9" rx="0.8" stroke={navy} strokeWidth="1.2" fill="none" />
      <R x="13.5" y="8" width="3" height="12" rx="0.8" stroke={navy} strokeWidth="1.2" fill="none" />
      <R x="18.5" y="5" width="3" height="15" rx="0.8" stroke={navy} strokeWidth="1.2" fill="none" />
      <P d="M3 18l5-4 5-3 5-3" stroke={gold} strokeWidth="1.5" strokeLinecap="round" />
      <C cx="20" cy="5" r="2" fill={gold} fillOpacity="0.15" stroke="none" />
      <C cx="20" cy="5" r="1" fill={gold} stroke="none" />
    </svg>
  );
}

export function ProtectionIcon({ className, size = 24 }: IconProps) {
  const { navy, gold } = useColors();
  const s = size;
  return (
    <svg className={className} width={s} height={s} viewBox="0 0 24 24" fill="none">
      <P d="M12 2l8 4.5V12c0 5.5-3.5 9.5-8 10.5C7.5 21.5 4 17.5 4 12V6.5z" stroke={navy} strokeWidth="1.5" strokeLinejoin="round" />
      <P d="M12 5l6 3.5V12c0 4-2.5 7-6 7.5-3.5-.5-6-3.5-6-7.5V8.5z" stroke={navy} strokeWidth="0.3" strokeOpacity="0.08" strokeLinejoin="round" />
      <P d="M9 12l2.5 2.5L15 10" stroke={gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <C cx="12" cy="12" r="1.2" fill={gold} stroke="none" />
    </svg>
  );
}

export function RetirementIcon({ className, size = 24 }: IconProps) {
  const { navy, gold } = useColors();
  const s = size;
  return (
    <svg className={className} width={s} height={s} viewBox="0 0 24 24" fill="none">
      <P d="M12 2L3 8v12h18V8z" stroke={navy} strokeWidth="1.5" strokeLinejoin="round" fill="none" />
      <P d="M8 20v-7h8v7" stroke={navy} strokeWidth="1.3" strokeLinejoin="round" fill="none" />
      <C cx="12" cy="2" r="1.5" fill={gold} stroke="none" />
      <P d="M12 5l-2 3h4z" fill={gold} fillOpacity="0.12" stroke={gold} strokeWidth="0.3" />
      <L x1="12" y1="5" x2="12" y2="8" stroke={navy} strokeWidth="0.4" strokeOpacity="0.15" strokeLinecap="round" />
    </svg>
  );
}

export function LegacyIcon({ className, size = 24 }: IconProps) {
  const { navy, gold } = useColors();
  const s = size;
  return (
    <svg className={className} width={s} height={s} viewBox="0 0 24 24" fill="none">
      <P d="M12 2v20" stroke={navy} strokeWidth="1.5" strokeLinecap="round" />
      <C cx="12" cy="2" r="1.5" fill={gold} stroke="none" />
      <P d="M12 6c-4 0-7 3-7 7" stroke={navy} strokeWidth="0.6" strokeOpacity="0.2" strokeLinecap="round" />
      <P d="M12 6c4 0 7 3 7 7" stroke={navy} strokeWidth="0.6" strokeOpacity="0.2" strokeLinecap="round" />
      <P d="M12 10c-3 0-5 2-5 6" stroke={navy} strokeWidth="0.6" strokeOpacity="0.15" strokeLinecap="round" />
      <P d="M12 10c3 0 5 2 5 6" stroke={navy} strokeWidth="0.6" strokeOpacity="0.15" strokeLinecap="round" />
      <P d="M6 22h12" stroke={navy} strokeWidth="1.3" strokeLinecap="round" />
      <C cx="12" cy="14" r="1.5" fill={gold} fillOpacity="0.1" stroke="none" />
      <C cx="12" cy="14" r="0.8" fill={gold} stroke="none" />
    </svg>
  );
}

export function TaxIcon({ className, size = 24 }: IconProps) {
  const { navy, gold } = useColors();
  const s = size;
  return (
    <svg className={className} width={s} height={s} viewBox="0 0 24 24" fill="none">
      <C cx="12" cy="12" r="9.5" stroke={navy} strokeWidth="1.3" />
      <C cx="12" cy="12" r="7.5" stroke={navy} strokeWidth="0.3" strokeOpacity="0.08" strokeDasharray="2 3" />
      <L x1="8" y1="8" x2="16" y2="16" stroke={navy} strokeWidth="1.3" strokeLinecap="round" />
      <L x1="16" y1="8" x2="8" y2="16" stroke={navy} strokeWidth="1.3" strokeLinecap="round" />
      <C cx="12" cy="12" r="2.5" fill={gold} fillOpacity="0.1" stroke="none" />
      <C cx="12" cy="12" r="1.2" fill={gold} stroke="none" />
    </svg>
  );
}

export function BusinessIcon({ className, size = 24 }: IconProps) {
  const { navy, gold } = useColors();
  const s = size;
  return (
    <svg className={className} width={s} height={s} viewBox="0 0 24 24" fill="none">
      <P d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z" stroke={navy} strokeWidth="1.3" />
      <P d="M12 3v18" stroke={navy} strokeWidth="0.3" strokeOpacity="0.08" />
      <P d="M3 12h18" stroke={navy} strokeWidth="0.3" strokeOpacity="0.08" />
      <P d="M7.5 7.5A6 6 0 0 1 12 6" stroke={gold} strokeWidth="1.2" strokeLinecap="round" />
      <P d="M7.5 16.5A6 6 0 0 0 12 18" stroke={gold} strokeWidth="1.2" strokeLinecap="round" />
      <C cx="12" cy="12" r="1.2" fill={gold} stroke="none" />
      <C cx="12" cy="6" r="0.8" fill={gold} stroke="none" />
      <C cx="12" cy="18" r="0.8" fill={gold} stroke="none" />
    </svg>
  );
}

export function DhanaIcon({ className, size = 24 }: IconProps) {
  const { gold } = useColors();
  const s = size;
  return (
    <svg className={className} width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <P d="M12 2l10 5v10l-10 5-10-5V7z" strokeWidth="1.3" strokeLinejoin="round" fill="none" />
      <P d="M12 7l6 3v4l-6 3-6-3v-4z" strokeWidth="1.3" strokeLinejoin="round" fill="none" />
      <C cx="12" cy="12" r="1.5" fill={gold} fillOpacity="0.15" stroke="none" />
      <C cx="12" cy="12" r="0.8" fill={gold} stroke="none" />
    </svg>
  );
}

export function VidyaIcon({ className, size = 24 }: IconProps) {
  const { gold } = useColors();
  const s = size;
  return (
    <svg className={className} width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <C cx="12" cy="12" r="9" strokeWidth="1.3" />
      <L x1="12" y1="3" x2="12" y2="21" strokeWidth="0.3" strokeOpacity="0.08" />
      <L x1="3" y1="12" x2="21" y2="12" strokeWidth="0.3" strokeOpacity="0.08" />
      <P d="M12 5c-3 0-5 3-5 7s2 7 5 7 5-3 5-7-2-7-5-7z" stroke={gold} strokeWidth="1.2" />
      <C cx="12" cy="12" r="1.2" fill={gold} stroke="none" />
    </svg>
  );
}

export function KarmaIcon({ className, size = 24 }: IconProps) {
  const { gold } = useColors();
  const s = size;
  return (
    <svg className={className} width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <P d="M4 20l4-8 4 4 4-8 4 12" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <P d="M2 22h20" strokeWidth="0.4" strokeOpacity="0.1" />
      <C cx="8" cy="8" r="1.5" fill={gold} fillOpacity="0.15" stroke="none" />
      <C cx="8" cy="8" r="0.8" fill={gold} stroke="none" />
      <C cx="16" cy="5" r="1.5" fill={gold} fillOpacity="0.15" stroke="none" />
      <C cx="16" cy="5" r="0.8" fill={gold} stroke="none" />
    </svg>
  );
}

export function RakshaIcon({ className, size = 24 }: IconProps) {
  const { gold } = useColors();
  const s = size;
  return (
    <svg className={className} width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <P d="M12 2l8 4v6c0 5-3.5 8.5-8 9.5-4.5-1-8-4.5-8-9.5V6z" strokeWidth="1.3" strokeLinejoin="round" />
      <P d="M12 5l6 3v6c0 3.5-2.5 6-6 6.5-3.5-.5-6-3-6-6.5V8z" strokeWidth="0.3" strokeOpacity="0.06" strokeLinejoin="round" />
      <P d="M10 12l1.5 1.5L14 11" stroke={gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <C cx="12" cy="12" r="1" fill={gold} stroke="none" />
    </svg>
  );
}

export function SampattiIcon({ className, size = 24 }: IconProps) {
  const { gold } = useColors();
  const s = size;
  return (
    <svg className={className} width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <P d="M3 10l9-7 9 7" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <P d="M5 10v10h14V10" strokeWidth="1.3" strokeLinejoin="round" />
      <R x="10" y="14" width="4" height="6" rx="0.5" strokeWidth="1.2" fill="none" />
      <P d="M10 17h4" strokeWidth="0.6" strokeOpacity="0.15" />
      <C cx="12" cy="7" r="1.5" fill={gold} fillOpacity="0.15" stroke="none" />
      <C cx="12" cy="7" r="0.8" fill={gold} stroke="none" />
    </svg>
  );
}

export function VishramaIcon({ className, size = 24 }: IconProps) {
  const { gold } = useColors();
  const s = size;
  return (
    <svg className={className} width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <P d="M12 3c-4 0-7 3-7 7 0 3 2 6 7 9 5-3 7-6 7-9 0-4-3-7-7-7z" strokeWidth="1.3" />
      <P d="M12 3c-2 0-3 2-3 4s1 4 3 5" stroke={gold} strokeWidth="1.2" strokeLinecap="round" />
      <P d="M9 13c1 1 2 1.5 3 2" strokeWidth="0.6" strokeOpacity="0.15" strokeLinecap="round" />
      <C cx="12" cy="12" r="1" fill={gold} stroke="none" />
    </svg>
  );
}

export function KarzaIcon({ className, size = 24 }: IconProps) {
  const { gold } = useColors();
  const s = size;
  return (
    <svg className={className} width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <P d="M6 18L18 6" strokeWidth="1.5" strokeLinecap="round" />
      <P d="M12 12L6 6" strokeWidth="1.5" strokeLinecap="round" />
      <P d="M12 12l6 6" strokeWidth="1.5" strokeLinecap="round" />
      <C cx="6" cy="6" r="1.5" fill={gold} fillOpacity="0.15" stroke="none" />
      <C cx="6" cy="6" r="0.7" fill={gold} stroke="none" />
      <C cx="18" cy="18" r="1.5" fill={gold} fillOpacity="0.15" stroke="none" />
      <C cx="18" cy="18" r="0.7" fill={gold} stroke="none" />
    </svg>
  );
}

export function VyayaIcon({ className, size = 24 }: IconProps) {
  const { gold } = useColors();
  const s = size;
  return (
    <svg className={className} width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <P d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0z" strokeWidth="1.3" />
      <P d="M12 7v5l3 3" strokeWidth="1.3" strokeLinecap="round" />
      <P d="M12 7v5l3 3" stroke={gold} strokeWidth="0.6" strokeOpacity="0.3" strokeLinecap="round" strokeDasharray="1 2" />
      <C cx="12" cy="12" r="1.2" fill={gold} stroke="none" />
    </svg>
  );
}

export function DayaIcon({ className, size = 24 }: IconProps) {
  const { gold } = useColors();
  const s = size;
  return (
    <svg className={className} width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <P d="M12 2c-3 0-5 2.5-5 6s2 5.5 5 7c3-1.5 5-3.5 5-7s-2-6-5-6z" strokeWidth="1.3" />
      <P d="M12 15v7" strokeWidth="1.3" strokeLinecap="round" />
      <P d="M9 19c1.5.5 3 1 3 1s1.5-.5 3-1" strokeWidth="0.6" strokeOpacity="0.15" strokeLinecap="round" />
      <P d="M12 8l-1.5 3h3z" fill={gold} fillOpacity="0.1" stroke={gold} strokeWidth="0.3" />
      <C cx="12" cy="8" r="1" fill={gold} stroke="none" />
      <C cx="12" cy="22" r="1" fill={gold} fillOpacity="0.2" stroke="none" />
    </svg>
  );
}

export function FamiliesIcon({ className, size = 24 }: IconProps) {
  const { navy, gold } = useColors();
  const s = size;
  return (
    <svg className={className} width={s} height={s} viewBox="0 0 24 24" fill="none">
      <C cx="12" cy="5" r="2.5" stroke={navy} strokeWidth="1.3" />
      <P d="M7 13c0-2.5 2-4.5 5-4.5s5 2 5 4.5" stroke={navy} strokeWidth="1.3" strokeLinecap="round" />
      <P d="M3 20c0-4 2-7 5-8" stroke={navy} strokeWidth="1.2" strokeLinecap="round" />
      <P d="M21 20c0-4-2-7-5-8" stroke={navy} strokeWidth="1.2" strokeLinecap="round" />
      <P d="M12 17c3 0 5.5 1 7 3" stroke={navy} strokeWidth="0.5" strokeOpacity="0.1" strokeLinecap="round" />
      <C cx="7" cy="20" r="1" fill={navy} fillOpacity="0.08" stroke="none" />
      <C cx="17" cy="20" r="1" fill={navy} fillOpacity="0.08" stroke="none" />
      <C cx="12" cy="5" r="1" fill={gold} stroke="none" />
    </svg>
  );
}

export function AssetsIcon({ className, size = 24 }: IconProps) {
  const { navy, gold } = useColors();
  const s = size;
  return (
    <svg className={className} width={s} height={s} viewBox="0 0 24 24" fill="none">
      <R x="4" y="15" width="16" height="6" rx="1" stroke={navy} strokeWidth="1.3" fill="none" />
      <P d="M9 15V8h6v7" stroke={navy} strokeWidth="1.3" strokeLinejoin="round" />
      <P d="M6 21v-3h12v3" stroke={navy} strokeWidth="0.4" strokeOpacity="0.1" strokeLinejoin="round" />
      <C cx="12" cy="8" r="1.5" fill={gold} fillOpacity="0.15" stroke="none" />
      <C cx="12" cy="8" r="0.8" fill={gold} stroke="none" />
      <C cx="12" cy="18" r="0.8" fill={gold} fillOpacity="0.3" stroke="none" />
    </svg>
  );
}

export function YearsIcon({ className, size = 24 }: IconProps) {
  const { navy, gold } = useColors();
  const s = size;
  return (
    <svg className={className} width={s} height={s} viewBox="0 0 24 24" fill="none">
      <C cx="12" cy="12" r="9" stroke={navy} strokeWidth="1.3" />
      <P d="M12 7v5l3 3" stroke={navy} strokeWidth="1.3" strokeLinecap="round" />
      <P d="M12 3v2M12 19v2M3 12h2M19 12h2" stroke={navy} strokeWidth="0.5" strokeOpacity="0.12" strokeLinecap="round" />
      <C cx="12" cy="12" r="1.5" fill={gold} fillOpacity="0.1" stroke="none" />
      <C cx="12" cy="12" r="0.8" fill={gold} stroke="none" />
    </svg>
  );
}

export function DisconnectedIcon({ className, size = 24 }: IconProps) {
  const s = size;
  return (
    <svg className={className} width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
      <P d="M9 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4" />
      <P d="M13 4h7v7" />
      <P d="M19 5L11 13" />
    </svg>
  );
}

export { Container } from "./Container";
