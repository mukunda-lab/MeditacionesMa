interface LogoProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Logo({ className, style }: LogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.png"
      alt="Logo Mataji Shaktiananda"
      className={className}
      style={{ objectFit: "contain", display: "block", ...style }}
    />
  );
}
