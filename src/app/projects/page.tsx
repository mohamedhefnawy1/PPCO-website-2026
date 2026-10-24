import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import ProjectsExplorer from "@/components/ProjectsExplorer";
import { projectsPage as p, up } from "@/content/site";
import { readProjects } from "@/lib/csv";

export const metadata: Metadata = { title: "Projects", description: "Civil, mechanical and electrical projects delivered by PPCO for Saudi Aramco, NEOM, KAFD, SWCC and other clients across the Kingdom." };

export default function ProjectsPage() {
  const divisions = p.divisions.map((d) => ({ ...d, projects: readProjects(d.csv) }));
  return (
    <>
      <PageHero title={p.title} image={up("2025/12/1141.jpg")} crumbs={[{ label: "Company", href: "/company" }]} />
      <ProjectsExplorer divisions={divisions} numbersTitle={p.numbersTitle} />
      <CtaBand />
    </>
  );
}
