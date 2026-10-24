/* eslint-disable @next/next/no-img-element */
import { company } from "@/content/site";

/*
 * The two logo files are 750×280 PNGs with different amounts of empty space around the mark
 * (colour: mark at x 89–660, y 0–270; white: x 157–592, y 32–238). Each is cropped to its mark
 * so both render at exactly the same size, and `className` sets the height of the mark itself.
 */
const CROP = {
  color: { width: "131.12%", height: "103.32%", left: "-15.56%", top: "0%" },
  white: { width: "172.02%", height: "135.27%", left: "-36.01%", top: "-15.46%" },
};

export default function Logo({ white = false, className = "h-11" }: { white?: boolean; className?: string }) {
  return (
    <span className={`relative block aspect-[572/271] overflow-hidden ${className}`}>
      <img
        src={white ? company.logoWhite : company.logo}
        alt="Projects Pioneers Contracting Co"
        width={750}
        height={280}
        className="absolute max-w-none select-none"
        style={white ? CROP.white : CROP.color}
        draggable={false}
      />
    </span>
  );
}
