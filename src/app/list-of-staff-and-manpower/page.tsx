import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ResourceList from "@/components/ResourceList";
import { manpowerPage as m, up } from "@/content/site";
import { readCsv, readResourceList } from "@/lib/csv";

export const metadata: Metadata = { title: "List of Staff and Manpower", description: "PPCO’s staff and manpower, with numbers by role." };

export default function ManpowerPage() {
  const [header] = readCsv(m.csv);
  return (
    <>
      <PageHero
        title={m.title}
        image={up("2024/05/ohpl-pics-3.jpeg")}
        crumbs={[{ label: "Company", href: "/company" }, { label: "Resources" }]}
      />
      <ResourceList
        items={readResourceList(m.csv)}
        total={m.total}
        suffix={m.suffix}
        totalLabel={m.totalLabel}
        itemLabel="positions"
        searchLabel="Search positions"
        columns={[header[0], header[1]]}
      />
    </>
  );
}
