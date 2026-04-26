interface LogoProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Logo({ className, style }: LogoProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-label="Logo Mataji Shaktiananda"
    >
      {/* Outer octagram (8-pointed star) */}
      <path
        fill="#6B1829"
        d="M50 5 L58.4 29.7 L81.1 18.9 L70.3 41.6 L94 50 L70.3 58.4 L81.1 81.1 L58.4 70.3 L50 95 L41.6 70.3 L18.9 81.1 L29.7 58.4 L6 50 L29.7 41.6 L18.9 18.9 L41.6 29.7 Z"
      />
      {/* Inner ring */}
      <circle cx="50" cy="50" r="22" fill="none" stroke="#f5e0c0" strokeWidth="0.8" opacity="0.6" />
      {/* Sanskrit म (ma) */}
      <text
        x="50"
        y="67"
        textAnchor="middle"
        fontSize="40"
        fontFamily="serif"
        fontWeight="700"
        fill="#f5e0c0"
      >
        म
      </text>
    </svg>
  );
}
