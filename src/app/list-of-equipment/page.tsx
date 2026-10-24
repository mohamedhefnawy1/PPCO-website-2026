import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ResourceList from "@/components/ResourceList";
import { equipmentPage as e, up } from "@/content/site";
import { readCsv, readResourceList } from "@/lib/csv";

export const metadata: Metadata = { title: "Equipment and vehicles", description: "PPCO’s fleet of equipment and vehicles, with quantities by type." };

export default function EquipmentPage() {
  const [header] = readCsv(e.csv);
  return (
    <>
      <PageHero
        title={e.title}
        image={up("2025/11/heavy-machinery-used-construction-industry-engineering-Large.jpeg")}
        crumbs={[{ label: "Company", href: "/company" }, { label: "Resources" }]}
      />
      <ResourceList
        items={readResourceList(e.csv)}
        total={e.total}
        totalLabel={e.totalLabel}
        itemLabel="categories"
        searchLabel="Search equipment"
        columns={[header[0], header[1]]}
      />
    </>
  );
}
