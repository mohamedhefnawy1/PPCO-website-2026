import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Photo from "../Photo";
import { Reveal } from "../motion/primitives";
import { home } from "@/content/site";
import { tc } from "@/lib/text";

/**
 * The four disciplines as a row of photos, each with its name and text on a sheet of glass inside the
 * photo. Each card links to its part of the Services page; the photo eases in on hover.
 */
export default function Disciplines() {
  const items = home.disciplines.items;
  return (
    // Phones: a row to swipe through (like the services). Tablets: two by two. Desktop: one row of four.
    <ul className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4 lg:gap-6 [&::-webkit-scrollbar]:hidden">
      {items.map((d, i) => (
        <Reveal as="li" key={d.title} delay={i * 0.07} className="w-[82%] shrink-0 snap-center sm:w-auto">
          <Link href={d.href} className="frame group relative block aspect-[4/5] sm:aspect-[3/4] lg:aspect-[3/4.4]">
            <Photo
              src={d.image}
              alt=""
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
            />
            <div className="glass absolute inset-x-3 bottom-3 p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="heading text-2xl">{tc(d.title)}</h3>
                <ArrowUpRight className="size-5 shrink-0 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
              </div>
              <p className="mt-2 text-[0.95rem] leading-snug text-white/90">{d.text}</p>
            </div>
          </Link>
        </Reveal>
      ))}
    </ul>
  );
}
