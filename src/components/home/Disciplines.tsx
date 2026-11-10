import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Photo from "../Photo";
import { Reveal } from "../motion/primitives";
import { home } from "@/content/site";
import { tc } from "@/lib/text";

/**
 * The four disciplines as a plain row of cards: a photo, then the number, name and one line of text
 * on the page itself. Each card links to its part of the Services page; the photo eases in on hover.
 */
export default function Disciplines() {
  const items = home.disciplines.items;
  return (
    <ul className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-6">
      {items.map((d, i) => (
        <Reveal as="li" key={d.title} delay={i * 0.07}>
          <Link href={d.href} className="group block">
            <div className="frame">
              <Photo
                src={d.image}
                alt=""
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="aspect-[3/2] w-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] sm:aspect-[4/5]"
              />
            </div>
            <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-line pt-4 transition-colors duration-300 group-hover:border-ink">
              <h3 className="heading text-2xl">{tc(d.title)}</h3>
              <span className="tabular text-sm text-faint">{String(i + 1).padStart(2, "0")}</span>
            </div>
            <p className="mt-3 text-muted">{d.text}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium">
              Learn more
              <ArrowUpRight className="size-4 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
            </span>
          </Link>
        </Reveal>
      ))}
    </ul>
  );
}
