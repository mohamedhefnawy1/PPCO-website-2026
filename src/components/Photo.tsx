import Image from "next/image";

/** Optimised image that always covers its frame (no background colour, so no dark borders). */
export default function Photo({
  src,
  alt,
  className = "",
  sizes = "100vw",
  position = "50% 50%",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  position?: string;
  priority?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" style={{ objectPosition: position }} />
    </div>
  );
}
