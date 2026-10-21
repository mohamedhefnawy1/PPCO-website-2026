/* eslint-disable @next/next/no-img-element */
import { company } from "@/content/site";

export default function Logo({ white = false, className = "h-11" }: { white?: boolean; className?: string }) {
  return (
    <img
      src={white ? company.logoWhite : company.logo}
      alt="Projects Pioneers Contracting Co"
      width={188}
      height={70}
      className={`w-auto select-none ${className}`}
      draggable={false}
    />
  );
}
