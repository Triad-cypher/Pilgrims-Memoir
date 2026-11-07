import Image from "next/image";

/** A CSS 3D book (cover, spine, page edge, back) — styles live in globals.css (.book, .bk-*). */
export function Book3D({
  src,
  alt,
  width,
  height,
  depth,
  spine,
  className = "",
  style,
  priority = false,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  depth: number;
  spine: string;
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
}) {
  return (
    <div
      className={`book ${className}`}
      style={{ "--w": `${width}px`, "--h": `${height}px`, "--d": `${depth}px`, "--sp": spine, ...style } as React.CSSProperties}
    >
      <div className="bk-f">
        <Image src={src} alt={alt} fill sizes={`${width}px`} priority={priority} className="object-cover" />
      </div>
      <div className="bk-s" />
      <div className="bk-p" />
      <div className="bk-b" />
    </div>
  );
}
