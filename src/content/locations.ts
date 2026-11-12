/**
 * PPCO locations map (home page). Locations, categories and names follow PPCO's own locations map; each
 * point is placed at its real longitude and latitude on a map of Saudi Arabia and the countries around it
 * (drawn by scripts/build-map.mjs, which also exports the projection used here).
 *
 * "keywords" link a location to rows in the project lists (src/data/*-projects.csv): a project belongs to
 * a location when its name contains one of the keywords (place names, or the Aramco field codes PPCO uses
 * in its project names, e.g. HRDH for Haradh and KHRS for Khurais).
 */
import { PROJ } from "./map-geo";

export type LocationKind = "hq" | "regional" | "site" | "project";

export const locationKinds: Record<LocationKind, { label: string; blurb: string }> = {
  hq: { label: "Head Quarter", blurb: "PPCO’s head office, where the company is managed and its work across the Kingdom is coordinated." },
  regional: { label: "Regional Office", blurb: "A regional office that supports PPCO’s clients and projects in this part of the Kingdom." },
  site: { label: "Site Office & Yard", blurb: "A site office and yard: a base for crews, equipment and materials close to the work." },
  project: { label: "Our Project", blurb: "A location where PPCO has carried out project work." },
};

/** Where a location's name sits (map units). `leader` draws a line from the point to the name. */
export type Label = { x: number; y: number; anchor: "start" | "middle" | "end"; leader?: boolean };

export type Location = {
  id: string;
  name: string;
  kind: LocationKind;
  x: number;
  y: number;
  label: Label;
  keywords: string[];
  /** Office details, from the Contact page. */
  office?: { address: string; extra?: string };
};

export const MAP = { viewBox: "370 90 1180 800", minX: 370, minY: 90, width: 1180, height: 800 };

/** Longitude and latitude (degrees) to map units. */
export function project(lon: number, lat: number): [number, number] {
  const x = PROJ.k * ((lon * Math.PI) / 180) + PROJ.tx;
  const y = PROJ.ty - PROJ.k * Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
  return [Math.round(x), Math.round(y)];
}

type Place = Omit<Location, "x" | "y"> & { at: [lon: number, lat: number] };

// The Eastern Province sites sit close together, so their names are set in a column over the Gulf with leader lines.
const places: Place[] = [
  { id: "dammam", name: "Dammam", kind: "hq", at: [50.1, 26.43], label: { x: 1236, y: 356, anchor: "start", leader: true }, keywords: ["Dammam"],
    office: { address: "Dhahran-Jubail highway P.O.Box 5029 Dammam 34261 Kingdom of Saudi Arabia", extra: "Sun - Thu from 8 AM to 5 PM" } },
  { id: "riyadh", name: "Riyadh", kind: "regional", at: [46.72, 24.71], label: { x: 978, y: 464, anchor: "end" }, keywords: ["Riyadh", "Diriyah", "KAFD"],
    office: { address: "Above Aljazeerah، Bank، شارع دجلة،، Riyadh 13315, Saudi Arabia Takasusi Street" } },
  { id: "neom", name: "NEOM", kind: "regional", at: [35.3, 28.0], label: { x: 486, y: 292, anchor: "end", leader: true }, keywords: ["NEOM", "Oxagon"] },
  { id: "abha", name: "Abha", kind: "regional", at: [42.5, 18.22], label: { x: 839, y: 748, anchor: "start" }, keywords: ["Abha"] },
  { id: "jubail", name: "Jubail", kind: "site", at: [49.66, 27.0], label: { x: 1236, y: 318, anchor: "start", leader: true }, keywords: ["Jubail"] },
  { id: "abqaiq", name: "Abqaiq", kind: "site", at: [49.67, 25.93], label: { x: 1236, y: 428, anchor: "start", leader: true }, keywords: ["Abqaiq"] },
  { id: "hofuf", name: "Hofuf", kind: "site", at: [49.59, 25.38], label: { x: 1236, y: 461, anchor: "start", leader: true }, keywords: ["Hofuf", "Hafuf"] },
  { id: "haradh", name: "Haradh", kind: "site", at: [49.08, 24.14], label: { x: 1090, y: 514, anchor: "middle" }, keywords: ["Haradh", "HRDH"] },
  { id: "jafurah", name: "Jafurah", kind: "site", at: [49.9, 24.9], label: { x: 1236, y: 494, anchor: "start", leader: true }, keywords: ["Jafurah"] },
  { id: "mahayel", name: "Mahayel Asir", kind: "site", at: [42.05, 18.55], label: { x: 790, y: 727, anchor: "end" }, keywords: ["Muhayil", "Mahayel"] },
  { id: "jazan", name: "Jazan", kind: "site", at: [42.55, 16.89], label: { x: 841, y: 804, anchor: "start" }, keywords: ["Jazan"] },
  { id: "khurais", name: "Khurais", kind: "project", at: [48.1, 25.07], label: { x: 1037, y: 441, anchor: "end" }, keywords: ["Khurais", "KHRS"] },
  // Dhahran is 13 km from Dammam; it is set slightly south-west of its true position so the two points don't overlap.
  { id: "dhahran", name: "Dhahran", kind: "project", at: [50.02, 26.22], label: { x: 1236, y: 393, anchor: "start", leader: true }, keywords: ["Dhahran", "KFUPM"] },
  { id: "khafji", name: "Khafji", kind: "project", at: [48.5, 28.42], label: { x: 1052, y: 300, anchor: "end" }, keywords: ["Khafji"] },
  { id: "jeddah", name: "Jeddah", kind: "project", at: [39.19, 21.49], label: { x: 703, y: 606, anchor: "start" }, keywords: ["Jeddah"] },
  { id: "redsea", name: "Red Sea", kind: "project", at: [36.9, 25.6], label: { x: 610, y: 424, anchor: "start" }, keywords: ["Red Sea"] },
  { id: "tabuk", name: "Tabuk", kind: "project", at: [36.57, 28.38], label: { x: 596, y: 297, anchor: "start" }, keywords: ["Tabuk"] },
  { id: "duba", name: "Duba", kind: "project", at: [35.69, 27.35], label: { x: 562, y: 346, anchor: "start" }, keywords: ["Duba"] },
  { id: "turaif", name: "Turaif", kind: "project", at: [38.66, 31.67], label: { x: 667, y: 122, anchor: "middle" }, keywords: ["Turaif"] },
];

export const locations: Location[] = places.map(({ at, ...p }) => {
  const [x, y] = project(...at);
  return { ...p, x, y };
});

/** Leader line from a location's point to its name. */
export function leaderPath(l: Location) {
  const end = l.label.anchor === "end" ? l.label.x + 8 : l.label.x - 8;
  const elbow = l.label.anchor === "end" ? end + 22 : end - 22;
  return `M${l.x} ${l.y} L${elbow} ${l.label.y} H${end}`;
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** True when a project name belongs to the location (whole-word match on any keyword). */
export function projectInLocation(projectName: string, loc: Pick<Location, "keywords">) {
  return loc.keywords.some((k) => new RegExp(`(^|[^A-Za-z])${escape(k)}([^A-Za-z]|$)`, "i").test(projectName));
}
