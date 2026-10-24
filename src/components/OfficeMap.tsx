"use client";

import { useState } from "react";
import { ArrowUpRight, MapPin } from "lucide-react";
import { contactPage as c } from "@/content/site";
import { tc } from "@/lib/text";

const embed = (lat: number, lng: number) => `https://maps.google.com/maps?q=${lat},${lng}&z=15&hl=en&output=embed`;
const openUrl = (lat: number, lng: number) => `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

/**
 * Map with PPCO's offices and site offices beside it. Locations with an exact position are buttons
 * that move the map there; the others are listed as plain text until their positions are known.
 */
export default function OfficeMap() {
  const points = c.mapPoints;
  const [active, setActive] = useState("dammam");
  const [loading, setLoading] = useState(true);
  const p = points[active];
  const select = (id: string) => {
    if (id === active) return;
    setLoading(true);
    setActive(id);
  };

  const Choice = ({ id, label, note }: { id: string; label: string; note?: string }) => {
    const on = id === active;
    return (
      <button
        type="button"
        onClick={() => select(id)}
        aria-pressed={on}
        className={`group flex w-full items-center justify-between gap-3 border px-4 py-3 text-left transition-colors duration-200 ${
          on ? "border-ink bg-ink text-white" : "border-line bg-white text-ink hover:border-ink"
        }`}
      >
        <span className="flex items-center gap-3">
          <MapPin className={`size-4 shrink-0 ${on ? "text-green" : "text-ink"}`} aria-hidden />
          <span>
            <span className="block font-medium">{label}</span>
            {note && <span className={`block text-sm ${on ? "text-white/70" : "text-muted"}`}>{note}</span>}
          </span>
        </span>
        <span className={`text-sm ${on ? "text-white/80" : "text-muted"}`}>{on ? "On map" : "Show"}</span>
      </button>
    );
  };

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-8">
      <div className="lg:col-span-4">
        <h2 className="eyebrow">Offices</h2>
        <div className="mt-4 space-y-2">
          <Choice id="dammam" label={points.dammam.name} note={points.dammam.role} />
          <Choice id="riyadh" label={points.riyadh.name} note={points.riyadh.role} />
        </div>

        <h2 className="eyebrow mt-10">{c.siteOfficesLabel.replace(":", "")}</h2>
        <ul className="mt-4 grid grid-cols-2 gap-2" aria-label={c.siteOfficesLabel.replace(":", "")}>
          {c.siteOffices.map((o) => {
            const label = o === "NEOM" ? o : tc(o);
            const id = c.siteOfficePoints[o];
            const on = id === active;
            return (
              <li key={o}>
                {id ? (
                  <button
                    type="button"
                    onClick={() => select(id)}
                    aria-pressed={on}
                    className={`flex min-h-11 w-full items-center gap-2 border px-3 py-2 text-left text-[0.95rem] font-medium transition-colors duration-200 ${
                      on ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink"
                    }`}
                  >
                    <MapPin className={`size-3.5 shrink-0 ${on ? "text-green" : ""}`} aria-hidden />
                    {label}
                  </button>
                ) : (
                  <span className="flex min-h-11 items-center px-3 py-2 text-[0.95rem] text-muted">{label}</span>
                )}
              </li>
            );
          })}
        </ul>
        <p className="mt-4 flex items-center gap-2 text-sm text-muted">
          <MapPin className="size-3.5" aria-hidden /> Locations with a pin can be shown on the map.
        </p>
      </div>

      <div className="lg:col-span-8">
        <div className="relative h-[380px] overflow-hidden border border-line bg-mist md:h-[520px]">
          <p className={`absolute inset-0 grid place-items-center text-sm text-muted transition-opacity duration-200 ${loading ? "opacity-100" : "opacity-0"}`} aria-hidden>
            Loading map…
          </p>
          <iframe
            key={active}
            src={embed(p.lat, p.lng)}
            title={`Map of PPCO ${p.role.toLowerCase()}, ${p.name}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            onLoad={() => setLoading(false)}
            className={`relative h-full w-full grayscale-[0.5] transition-[opacity,filter] duration-300 hover:grayscale-0 ${loading ? "opacity-0" : "opacity-100"}`}
          />
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm">
          <p aria-live="polite">
            Showing <span className="font-medium">{p.name}</span> <span className="text-muted">· {p.role}</span>
          </p>
          <a href={openUrl(p.lat, p.lng)} target="_blank" rel="noreferrer" className="link">
            Open in Google Maps <ArrowUpRight className="size-4" aria-hidden />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </div>
    </div>
  );
}
