/**
 * PPCO locations map (home page). Positions come from PPCO's own locations map (1920×1080 artboard);
 * the coastline path was traced from that image. Categories and names follow its legend and labels.
 *
 * "keywords" link a location to rows in the project lists (src/data/*-projects.csv): a project belongs to
 * a location when its name contains one of the keywords (place names, or the Aramco field codes PPCO uses
 * in its project names, e.g. HRDH for Haradh and KHRS for Khurais).
 */

export type LocationKind = "hq" | "regional" | "site" | "project";

export const locationKinds: Record<LocationKind, { label: string; blurb: string }> = {
  hq: { label: "Head Quarter", blurb: "PPCO’s head office, where the company is managed and its work across the Kingdom is coordinated." },
  regional: { label: "Regional Office", blurb: "A regional office that supports PPCO’s clients and projects in this part of the Kingdom." },
  site: { label: "Site Office & Yard", blurb: "A site office and yard: a base for crews, equipment and materials close to the work." },
  project: { label: "Our Project", blurb: "A location where PPCO has carried out project work." },
};

export type Label = { x: number; y: number; anchor: "start" | "middle" | "end"; leader?: string };

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
export const COAST = "M517,243 L513,255 L513,266 L510,272 L510,280 L503,297 L505,306 L505,317 L503,323 L506,325 L513,323 L523,325 L537,339 L542,351 L549,359 L552,368 L560,376 L563,383 L571,393 L587,427 L603,444 L609,457 L608,473 L613,479 L620,494 L640,502 L658,517 L668,535 L678,562 L678,574 L682,582 L682,590 L679,598 L687,612 L686,628 L690,637 L712,667 L731,675 L758,703 L767,723 L771,739 L777,749 L777,757 L774,764 L765,772 L756,774 L747,772 L736,777 L738,783 L748,792 L764,797 L768,794 L771,785 L778,778 L789,775 L798,777 L812,790 L817,802 L831,824 L833,833 L837,836 L841,835 L852,825 L854,809 L863,798 L874,795 L882,796 L895,792 L906,793 L913,791 L926,791 L940,796 L953,798 L990,800 L995,802 L1004,811 L1012,812 L1024,804 L1030,789 L1055,759 L1088,742 L1159,734 L1208,725 L1329,681 L1355,600 L1353,581 L1356,571 L1340,544 L1337,542 L1320,543 L1245,533 L1232,529 L1222,519 L1195,484 L1187,465 L1187,459 L1184,457 L1175,458 L1166,456 L1156,447 L1149,434 L1148,426 L1139,414 L1134,398 L1135,372 L1131,362 L1125,356 L1119,354 L1101,334 L1097,325 L1089,321 L1082,314 L1073,300 L1065,280 L1053,280 L1038,276 L1022,257 L991,253 L967,254 L912,247 L805,158 L777,145 L737,119 L692,110 L670,120 L602,140 L603,158 L601,165 L618,187 L619,198 L616,205 L605,214 L591,217 L582,231 L566,245 L552,247 L521,241Z";

export const locations: Location[] = [
  { id: "dammam", name: "Dammam", kind: "hq", x: 1104, y: 335, label: { x: 1190, y: 250, anchor: "start", leader: "M1104 335 Q1110 264 1180 262" }, keywords: ["Dammam"],
    office: { address: "Dhahran-Jubail highway P.O.Box 5029 Dammam 34261 Kingdom of Saudi Arabia", extra: "Sun - Thu from 8 AM to 5 PM" } },
  { id: "riyadh", name: "Riyadh", kind: "regional", x: 951, y: 398, label: { x: 928, y: 400, anchor: "end" }, keywords: ["Riyadh", "Diriyah", "KAFD"],
    office: { address: "Above Aljazeerah، Bank، شارع دجلة،، Riyadh 13315, Saudi Arabia Takasusi Street" } },
  { id: "neom", name: "NEOM", kind: "regional", x: 618, y: 281, label: { x: 486, y: 281, anchor: "end", leader: "M618 281 H496" }, keywords: ["NEOM", "Oxagon"] },
  { id: "abha", name: "Abha", kind: "regional", x: 863, y: 653, label: { x: 842, y: 655, anchor: "end" }, keywords: ["Abha"] },
  { id: "jubail", name: "Jubail", kind: "site", x: 1054, y: 314, label: { x: 1140, y: 178, anchor: "start", leader: "M1054 314 V198 Q1054 182 1072 182 H1130" }, keywords: ["Jubail"] },
  { id: "abqaiq", name: "Abqaiq", kind: "site", x: 1078, y: 379, label: { x: 1327, y: 380, anchor: "start", leader: "M1078 379 H1316" }, keywords: ["Abqaiq"] },
  { id: "hofuf", name: "Hofuf", kind: "site", x: 1129, y: 462, label: { x: 1265, y: 430, anchor: "start", leader: "M1129 462 Q1134 431 1166 431 H1254" }, keywords: ["Hofuf", "Hafuf"] },
  { id: "haradh", name: "Haradh", kind: "site", x: 1007, y: 464, label: { x: 1007, y: 496, anchor: "middle" }, keywords: ["Haradh", "HRDH"] },
  { id: "jafurah", name: "Jafurah", kind: "site", x: 1163, y: 545, label: { x: 1410, y: 496, anchor: "start", leader: "M1163 545 Q1170 497 1222 497 H1399" }, keywords: ["Jafurah"] },
  { id: "mahayel", name: "Mahayel Asir", kind: "site", x: 835, y: 709, label: { x: 704, y: 710, anchor: "end", leader: "M835 709 H716" }, keywords: ["Muhayil", "Mahayel"] },
  { id: "jazan", name: "Jazan", kind: "site", x: 839, y: 763, label: { x: 920, y: 861, anchor: "start", leader: "M839 763 V822 Q841 862 880 862 H910" }, keywords: ["Jazan"] },
  { id: "khurais", name: "Khurais", kind: "project", x: 1111, y: 360, label: { x: 1137, y: 359, anchor: "start" }, keywords: ["Khurais", "KHRS"] },
  { id: "dhahran", name: "Dhahran", kind: "project", x: 1114, y: 403, label: { x: 1127, y: 404, anchor: "start" }, keywords: ["Dhahran", "KFUPM"] },
  { id: "khafji", name: "Khafji", kind: "project", x: 1007, y: 270, label: { x: 972, y: 289, anchor: "middle" }, keywords: ["Khafji"] },
  { id: "jeddah", name: "Jeddah", kind: "project", x: 739, y: 603, label: { x: 727, y: 609, anchor: "end" }, keywords: ["Jeddah"] },
  { id: "redsea", name: "Red Sea", kind: "project", x: 601, y: 364, label: { x: 563, y: 384, anchor: "middle" }, keywords: ["Red Sea"] },
  { id: "tabuk", name: "Tabuk", kind: "project", x: 563, y: 313, label: { x: 550, y: 331, anchor: "middle" }, keywords: ["Tabuk"] },
  { id: "duba", name: "Duba", kind: "project", x: 576, y: 257, label: { x: 567, y: 233, anchor: "middle" }, keywords: ["Duba"] },
  { id: "turaif", name: "Turaif", kind: "project", x: 687, y: 135, label: { x: 677, y: 116, anchor: "middle" }, keywords: ["Turaif"] },
];

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** True when a project name belongs to the location (whole-word match on any keyword). */
export function projectInLocation(projectName: string, loc: Pick<Location, "keywords">) {
  return loc.keywords.some((k) => new RegExp(`(^|[^A-Za-z])${escape(k)}([^A-Za-z]|$)`, "i").test(projectName));
}
