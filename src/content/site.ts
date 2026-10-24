/**
 * All site copy, taken verbatim from ppco-ksa.com (captured October 2026).
 * Only presentation changed; wording is unchanged. Typos in the source are kept on purpose
 * and listed in the README so they can be corrected deliberately.
 */

const U = "https://ppco-ksa.com/wp-content/uploads/";
export const up = (path: string) => U + encodeURI(path);

export const company = {
  name: "Projects Pioneers Contracting Co",
  short: "PPCO",
  tagline: "ALWAYS ONE STEP AHEAD",
  logo: up("2023/04/Untitled-800-x-240-px-1.png"),
  logoWhite: up("2023/04/Untitled-800-x-240-px-2.png"),
  profilePdf: up("2026/08/PPCO-Profile-v.9.3-small-file-2_compressed-1.pdf"),
  ppmUrl: "https://ppcomining.com/",
  email: "info@ppco-ksa.com",
  phone: "+966 13 837 2532",
  phoneHref: "tel:+966138372532",
  footerAddressAr: "الشعلة، الدمام 32432",
  footerAddress: "Al-Shula, Dammam 32432",
  footerAbout:
    "PPCO delivers industrial, civil, and infrastructure projects across Saudi Arabia with a commitment to quality, safety, and engineering excellence.",
  copyright: "© 2025 All Rights Reserved",
};

/** Site navigation, same structure and labels as the original header. */
export const nav = [
  {
    label: "Company",
    href: "/company",
    children: [
      { label: "Company", href: "/company" },
      { label: "Projects", href: "/projects" },
      { label: "Equipment and vehicles", href: "/list-of-equipment", group: "Resources" },
      { label: "List of Staff and Manpower", href: "/list-of-staff-and-manpower", group: "Resources" },
      { label: "Quality & Safety", href: "/training-and-safety" },
    ],
  },
  { label: "Services", href: "/services" },
  { label: "Media Center", href: "/media" },
  { label: "Contact", href: "/contact" },
] as const;

export const videos = [
  { id: "r5fV-cVN0Tk", poster: up("2026/02/Screenshot-2026-02-25-at-10.37.33-AM-Medium.jpeg") },
  { id: "wxTy99eg5_w", poster: up("2025/11/Screenshot-2025-11-15-at-12.43.06-AM.png") },
];

/* ───────────────────────── Home ───────────────────────── */

export const home = {
  hero: {
    title: "ALWAYS ONE STEP AHEAD",
    lead: "Building the Kingdom’s future with experience, innovation, and trust",
    cta: "Watch Our Story",
    image: up("2026/01/1702-1-Large.jpeg"),
  },
  whoWeAre: {
    eyebrow: "WHO WE ARE",
    title: "Projects Pioneers Contracting Co",
    body: "(PPCO) is a Saudi contracting company delivering large-scale industrial, civil, and infrastructure projects across the Kingdom. With decades of experience and a commitment to Vision 2030, PPCO builds with precision, safety, and sustainable value.",
    image: up("2025/11/Untitled-design-10.png"),
  },
  disciplines: {
    eyebrow: "WHAT DEFINES US",
    title: "Our Core Disciplines",
    body: "We deliver integrated engineering and construction solutions across multiple disciplines — ensuring excellence, safety, and efficiency at every stage of project execution.",
    items: [
      {
        title: "CIVIL",
        text: "Delivering large-scale civil works with precision, durability, and strict adherence to engineering standards.",
        image: up("2025/12/1141.jpg"),
        href: "/services#civil",
      },
      {
        title: "MECHANICAL",
        text: "Providing mechanical fabrication, installation, and maintenance solutions for industrial facilities.",
        image: up("2025/12/2761.jpg"),
        href: "/services#mechanical",
      },
      {
        title: "ELECTRICAL",
        text: "Executing safe and reliable electrical works, power distribution systems, and industrial automation.",
        image: up("2024/05/ohpl-pics-3.jpeg"),
        href: "/services#electrical",
      },
      {
        title: "MINING",
        text: "Supporting Saudi Arabia’s mining sector with exploration, drilling, and site-development capabilities.",
        image: up("2025/12/d4-Medium.jpeg"),
        href: "/services#ppm",
      },
    ],
  },
  story: {
    eyebrow: "OUR STORY",
    title: "A Closer Look at PPCO",
    body: "Discover how PPCO builds value through experience, innovation, and unwavering commitment to excellence.",
  },
  trackRecord: {
    eyebrow: "OUR TRACK RECORD",
    title: "Key Achievements at a Glance",
    body: "Projects Pioneers Contracting Co. (PPCO) is a Saudi contracting company delivering large-scale industrial, civil, and infrastructure projects across the Kingdom. With decades of experience and a commitment to Vision 2030, PPCO builds with precision, safety, and sustainable value.",
    stats: [
      { value: 20, suffix: "+", label: "Years of Experience" },
      { value: 150, suffix: "+", label: "Completed Projects" },
      { value: 6, suffix: " Billion+", label: "Total Project Value" },
      { value: 4, suffix: "", label: "ISO Certificates" },
      { value: 10, suffix: " Million+", label: "Working Hours Without LTI" },
    ],
  },
  services: {
    eyebrow: "WHAT WE DO",
    title: "Our Core Services",
    body: "Comprehensive contracting and construction solutions powering Saudi Arabia’s industrial and infrastructure growth.",
    items: [
      { title: "Civil & Industrial Construction", text: "Durable construction for industrial facilities.", icon: "building" },
      { title: "Mechanical & Electrical Works", text: "Reliable MEP systems and technical solutions.", icon: "cog" },
      { title: "Earthworks & Infrastructure", text: "Essential groundwork and infrastructure delivery.", icon: "route" },
      { title: "Quality, Safety & Field Support", text: "Operational support with strict safety standards.", icon: "shield" },
      { title: "Equipment Supply & Maintenance", text: "Equipment sourcing, servicing, and support.", icon: "truck" },
      { title: "Project Management & Supervision", text: "End-to-end oversight for efficient delivery.", icon: "clipboard" },
    ],
  },
  // New for the redesign: heading for the interactive locations map (the live site shows a static map image).
  map: {
    eyebrow: "OUR LOCATIONS",
    title: "Where We Work",
    body: "Select a location to see its role and the projects PPCO has delivered there.",
  },
  clients: {
    eyebrow: "CLIENTS & PARTNERS",
    title: "Trusted by Industry Leaders",
    body: "Over the years, PPCO has partnered with key national organizations and mega-projects that shape the Kingdom’s progress.",
    // Each logo file is a 500×500 PNG with its own empty margin; `box` is the logo's outline in that file
    // ([x, y, width, height], measured from the images) so every logo can be fitted to its tile evenly.
    logos: [
    { src: up("2025/12/14.png"), box: [76, 76, 347, 349] },
    { src: up("2025/12/19.png"), box: [158, 144, 191, 205] },
    { src: up("2025/12/18.png"), box: [96, 166, 307, 169] },
    { src: up("2024/05/27.png"), box: [94, 52, 311, 395] },
    { src: up("2024/05/23.png"), box: [54, 166, 391, 167] },
    { src: up("2024/05/Untitled-design-1.png"), box: [72, 194, 355, 111] },
    { src: up("2024/05/24.png"), box: [48, 148, 403, 203] },
    { src: up("2024/05/16-1.png"), box: [124, 120, 253, 261] },
    { src: up("2024/05/26.png"), box: [148, 76, 207, 345] },
    { src: up("2024/05/19.png"), box: [78, 126, 343, 247] },
    { src: up("2024/05/17-1.png"), box: [76, 118, 363, 263] },
    { src: up("2025/12/9.png"), box: [48, 200, 403, 85] },
    { src: up("2025/12/15.png"), box: [100, 100, 299, 299] },
    { src: up("2025/12/11.png"), box: [80, 108, 339, 285] },
    { src: up("2025/12/12.png"), box: [48, 158, 403, 185] },
    { src: up("2025/12/10.png"), box: [118, 150, 263, 199] },
    { src: up("2025/12/20.png"), box: [110, 160, 279, 179] },
    { src: up("2024/05/22.png"), box: [82, 202, 333, 97] },
    { src: up("2025/12/13.png"), box: [64, 194, 375, 115] },
    { src: up("2025/12/23.png"), box: [48, 186, 403, 127] },
    { src: up("2025/12/22.png"), box: [48, 192, 403, 115] },
    { src: up("2025/12/21.png"), box: [76, 84, 349, 331] },
    { src: up("2025/12/38.png"), box: [96, 48, 309, 403] },
    { src: up("2025/12/37.png"), box: [48, 200, 403, 101] },
    { src: up("2025/12/36.png"), box: [48, 78, 403, 343] },
    { src: up("2025/12/34.png"), box: [48, 74, 403, 353] },
    { src: up("2025/12/35.png"), box: [48, 210, 403, 79] },
    { src: up("2025/12/33.png"), box: [148, 50, 203, 399] },
    { src: up("2025/12/32.png"), box: [48, 114, 403, 271] },
    { src: up("2025/12/31.png"), box: [50, 164, 401, 171] },
    { src: up("2025/12/30.png"), box: [48, 160, 403, 181] },
    { src: up("2025/12/29.png"), box: [48, 180, 403, 139] },
    { src: up("2025/12/28.png"), box: [48, 144, 403, 211] },
    { src: up("2025/12/27.png"), box: [48, 188, 403, 123] },
    { src: up("2025/12/26.png"), box: [48, 172, 403, 155] },
    { src: up("2025/12/25.png"), box: [66, 102, 369, 297] },
    { src: up("2025/12/24.png"), box: [48, 192, 403, 115] },
    ] as { src: string; box: [number, number, number, number] }[],
  },
  cta: {
    title: "We’re Here to Support Your Project",
    body: "Whether you’re planning, building, or expanding, PPCO is ready to collaborate.",
    button: "Contact Us",
    image: up("2026/01/صورة-DSC_5261-كبيرة-Large.jpeg"),
  },
};

export const ppm = {
  title: "Projects Pioneers Mining",
  short: "PPM",
  body: [
    "As part of PPCO’s growth, PPM was established to lead in Saudi Arabia’s mining sector—powered by PPCO’s legacy in large-scale contracting and industrial operations.",
    "PPM brings world-class mining capabilities across exploration, drilling, mining operations, plant maintenance, emergency response, and digital security.",
  ],
  cta: "Visit PPM Website",
  image: up("2025/11/heavy-machinery-used-construction-industry-engineering-Large.jpeg"),
};

/* ───────────────────────── Company ───────────────────────── */

export const companyPage = {
  title: "COMPANY",
  heroImage: up("2023/10/Untitled-design-42.png"),
  specializing: {
    title: "PPCO Is Specializing In",
    items: ["CIVIL DIVISION", "MECHANICAL DIVISION", "ELECTRICAL DIVISION"],
  },
  contact: {
    title: "CONTACT",
    lines: ["Dammam, Kingdom of Saudi Arabia.", "P.O. Box 32432 Zip 5188", "info@ppco-ksa.com", "Sun - Thu from 8 AM to 5 PM"],
  },
  history: {
    title: "HISTORY",
    paragraphs: [
      "Projects Pioneers Contracting Co. (PPCO) was established in 2006 as a Saudi contracting company delivering large-scale construction and engineering projects across the Kingdom. Since its inception, PPCO has been driven by a strong commitment to quality, innovation, and reliability—building a solid reputation in civil, mechanical, and electrical works.",
      "Over the years, PPCO has successfully completed more than 150 projects with a total value exceeding SAR 3 billion, earning its classification as a Class 1 government contractor. This growth reflects the company’s capability to execute complex projects while meeting the highest industry standards.",
      "Through continuous development, experienced leadership, and advanced technologies, PPCO has evolved into a trusted partner for major clients—contributing to Saudi Arabia’s infrastructure development and supporting the goals of Vision 2030.",
    ],
  },
  philosophy: {
    title: "PHILOSOPHY",
    mission: {
      title: "MISSION",
      paragraphs: [
        "Our mission at Projects Pioneers Contracting Co. (PPCO) is to deliver high-quality construction and engineering solutions that meet our clients’ requirements while maintaining the highest standards of safety, efficiency, and professionalism.",
        "We are committed to executing projects on time and within budget through disciplined project management, skilled manpower, and proven construction methodologies. Our mission is driven by a strong focus on client satisfaction, continuous improvement, and compliance with international standards.",
      ],
    },
    vision: {
      title: "VISION",
      paragraphs: [
        "Our vision is to be a leading and trusted contracting partner in Saudi Arabia, recognized for excellence in execution, reliability, and sustainable growth.",
        "We aim to support the Kingdom’s infrastructure and industrial development by providing integrated construction solutions that align with Vision 2030, while continuously enhancing our capabilities, technology, and workforce to meet future challenges.",
      ],
    },
    values: {
      title: "VALUES",
      intro: "At PPCO, our values guide every aspect of our work and define how we operate as an organization:",
      items: [
        { name: "Integrity", text: "We conduct our business with honesty, transparency, and accountability." },
        { name: "Quality Excellence", text: "We are committed to delivering work that meets and exceeds industry and client standards." },
        { name: "Safety First", text: "We prioritize the health and safety of our employees, partners, and communities." },
        { name: "Teamwork", text: "We believe in collaboration, mutual respect, and empowering our people to achieve shared goals." },
        { name: "Reliability", text: "We honor our commitments and strive to build long-term partnerships based on trust and performance." },
        { name: "Continuous Improvement", text: "We embrace innovation, learning, and development to enhance efficiency and project outcomes." },
      ],
    },
  },
  qualitySafety: {
    title: "QUALITY & SAFETY",
    intro:
      "At Projects Pioneers Contracting Co. (PPCO), quality and safety are fundamental principles embedded in every phase of our operations. Our commitment is driven by a structured Integrated Management System aligned with ISO standards, ensuring consistent excellence across all projects.",
    quality: {
      title: "Quality Management",
      intro: "We implement comprehensive quality control procedures to meet and exceed client and regulatory requirements. Our quality approach focuses on:",
      items: [
        "Compliance with approved engineering standards and specifications",
        "Systematic inspections, testing, and verification processes",
        "Continuous improvement through audits, monitoring, and corrective actions",
      ],
    },
    safety: {
      title: "Health & Safety Commitment",
      intro: "PPCO promotes a strong safety culture based on prevention, accountability, and workforce engagement. Our health and safety practices include:",
      items: [
        "Proactive risk identification and mitigation measures",
        "Site safety management, inductions, and ongoing training",
        "Strict adherence to safety procedures and incident prevention programs",
      ],
    },
    closing:
      "By maintaining disciplined operational controls and a safety-first mindset, PPCO ensures reliable project delivery while protecting people, assets, and the environment.",
    table: {
      years: ["2024", "2023", "2022", "2021", "2020"],
      rows: [
        { label: "Manhours Worked", values: ["4,767,062.00", "2,430,870.00", "1,198,990.00", "475,410.00", "310,960.00"] },
        { label: "First Aid Injury (FAI) Cases", values: ["11", "7", "7", "4", "6"] },
        { label: "Medical Treatment Cases (MTC)", values: ["0", "0", "0", "0", "0"] },
        { label: "Lost Time Injury (LTI) Cases", values: ["0", "0", "0", "0", "0"] },
        { label: "Fatalities", values: ["0", "0", "0", "0", "0"] },
      ],
    },
  },
  people: {
    title: "OUR PEOPLE",
    paragraphs: [
      "At Projects Pioneers Contracting Co. (PPCO), our people are the foundation of our success. We believe that exceptional results are driven by skilled professionals who share a clear vision, strong values, and a commitment to excellence.",
      "Our team brings together diverse expertise, extensive industry experience, and deep technical knowledge gained from both local and international projects. This diversity allows us to adapt to complex challenges and deliver reliable solutions across a wide range of sectors and project environments.",
      "We foster a collaborative and performance-driven culture where communication, accountability, and continuous development are encouraged. By investing in our people through training, leadership development, and a supportive work environment, we ensure that our teams remain motivated, capable, and aligned with our clients’ objectives.",
      "At PPCO, we are committed to attracting, developing, and retaining top talent—empowering our people to grow professionally while contributing to the long-term success of our projects, partners, and the communities we serve.",
    ],
  },
};

/* ───────────────────────── Services ───────────────────────── */

export const servicesPage = {
  title: "SERVICES",
  heroImage: up("2023/10/Untitled-design-43.png"),
  intro: {
    title: "Integrated Project Teams",
    subtitle: "3 Main Divisions",
    body: "Our teams work collaboratively across disciplines to deliver reliable, efficient, and high-quality project outcomes.",
  },
  divisions: [
    {
      id: "civil",
      title: "CIVIL SOLUTIONS",
      scope: "Infrastucture, Earthwork, Utilities, Temporary Facility, Roads, Bridges, Asphalting, Concrete (Substructure & Superstructure), and Buildings",
      paragraphs: [
        "PPCo delivers comprehensive civil infrastructure solutions across the Kingdom, executing complex projects with precision, reliability, and uncompromising quality. Our expertise spans roads, bridges, highways, motorways, viaducts, tunnels, asphalting, concrete works (substructure and superstructure), and integrated landscape developments.",
        "Backed by one of the largest privately owned fleets of construction plants and heavy equipment in Saudi Arabia, we ensure rapid mobilization and efficient project delivery.",
        "Our civil capabilities include advanced earthworks, geotechnical solutions, land surveys and modifications, excavation, cutting and filling, and fill importation. We apply modern construction methodologies and value engineering practices to optimize feasibility, cost-efficiency, and structural performance.",
        "PPCo also specializes in blending infrastructure with environmental and aesthetic elements, including paving systems, decorative lighting, water features, landscape design, and urban enhancement works.",
      ],
      // The second image on the live page (صورة-DSC_5402-متوسطة.jpeg) returns 404; replaced with a SPARK site photo from the Media Center.
      images: [up("2024/05/WhatsApp-Image-2024-01-08-at-1.57.34-PM.jpeg"), up("2026/02/DSC_5330-Medium-Medium.jpeg")],
    },
    {
      id: "mechanical",
      title: "MECHANICAL SOLUTIONS",
      scope: "Pipeline (Oil, Gas, & Water, Both Metallic & Non-Metallic)",
      paragraphs: [
        "Our Mechanical Division specializes in the execution of pipeline-related infrastructure and wellsite development projects, delivering technically complex scopes with operational efficiency and strict safety compliance.",
        "We provide end-to-end installation of essential wellsite components, including flowlines, waterlines, laterals, headers, manifolds, transfer lines, and associated pipeline systems. Our team ensures precise installation, alignment, and integration of all mechanical elements required for optimal field performance.",
        "Through advanced project management and field coordination, PPCo guarantees timely execution while maintaining the highest standards of engineering integrity.",
      ],
      images: [up("2024/05/Picture1.jpg"), up("2023/10/Civil-Division-7.png")],
    },
    {
      id: "electrical",
      title: "ELECTRICAL SOLUTIONS",
      scope: "OHPL, CP, Substation, Electrical & Communications Infrastructure",
      paragraphs: [
        "PPCo provides specialized electrical and cathodic protection (CP) solutions designed to support large-scale infrastructure and pipeline projects.",
        "Our services include the installation of transformer rectifiers, laying of negative cables, connection to wellheads, anode installation, cable marker posts, and comprehensive pre-commissioning of CP systems. We also execute overhead power line (OHPL) works with full system integration and compliance to industry standards.",
        "Our electrical team ensures seamless coordination between mechanical and civil scopes, delivering safe, reliable, and fully operational systems.",
      ],
      // The second image on the live page (22-1.png) returns 404; replaced with a Haradh photo from the Media Center.
      images: [up("2024/05/WhatsApp-Image-2023-08-13-at-11.19.03-AM-2.jpeg"), up("2026/02/WhatsApp-Image-2023-08-13-at-11.20.03-AM-Medium.jpeg")],
    },
  ],
};

/* ───────────────────────── Projects ───────────────────────── */

export const projectsPage = {
  title: "Projects",
  numbersTitle: "Project numbers",
  divisions: [
    {
      id: "civil",
      label: "Civil",
      count: 60,
      title: "CIVIL SOLUTIONS",
      scope: "Infrastucture, Earthwork, Utilities, Temporary Facility, Roads, Bridges, Asphalting, Concrete (Substructure & Superstructure), and Buildings",
      csv: "civil-projects.csv",
      image: up("2025/12/1141.jpg"),
    },
    {
      id: "mechanical",
      label: "Mechanical",
      count: 50,
      title: "MECHANICAL SOLUTIONS",
      scope: "Pipeline (Oil, Gas, & Water, Both Metallic & Non-Metallic)",
      csv: "mechanical-projects.csv",
      image: up("2025/12/2761.jpg"),
    },
    {
      id: "electrical",
      label: "Electrical",
      count: 60,
      title: "ELECTRICAL SOLUTIONS",
      scope: "OHPL, CP, Substation, Electrical & Communications Infrastructure",
      csv: "electrical-projects.csv",
      image: up("2024/05/ohpl-pics-3.jpeg"),
    },
  ],
};

export const equipmentPage = { title: "Equipment and vehicles", totalLabel: "GRAND TOTAL", total: 2325, csv: "equipment.csv" };
export const manpowerPage = { title: "List of Staff and Manpower", totalLabel: "GRAND TOTAL", total: 2959, suffix: "+", csv: "manpower.csv" };

/* ───────────────────────── Quality & Safety ───────────────────────── */

export const qualityPage = {
  title: "Quality & Safety",
  heroImage: up("2026/02/1-69-Medium.jpeg"),
  paragraphs: [
    "Safety and quality are non-negotiable at PPCo. Our commitment to excellence is reflected in our rigorous adherence to international standards, ensuring the well-being of our workforce and the communities we serve. PPCo. has implemented an Integrated Management System (IMS) that adheres to the latest edition of international standards, including ISO 45001:2018 for health and safety management systems. Our commitment to excellence is reflected in our comprehensive IMS, which integrates these key standards to ensure the highest levels of quality, safety, and customer satisfaction across all our operations. By aligning with these internationally recognized standards, we continuously improve our processes, mitigate risks, and deliver exceptional results to our valued clients.",
    "The Company has established and applies an Integrated Management System (IMS) in accordance with the requirements of the latest edition of the International Standards ISO 9001-2015 Quality Management Systems, Health and safety management systems. The Company’s Integrated Management System encompasses Piping Fabrication, Installation of Water Supply Pipeline (Including Excavation, Backfilling, and Earthworks & Foundation Construction), Civil Projects, Mechanical Projects, and Electrical Projects.",
  ],
  missionTitle: "OUR QUALITY MISSION:",
  mission:
    "To deliver high-quality, cost-effective projects on schedule by employing and supporting motivated, flexible, and focused teams. We value the importance of our relationships and will continue to remain fair and true in our dealings with all employees, clients, vendors, and partners. Our clients count on our dependability, our drive, and our integrity. We take great pride in our accomplishments and build on them every day.",
  table: {
    years: ["2025", "2024", "2023", "2022", "2021"],
    rows: [
      { label: "Manhours Worked", values: ["7,422,804.00", "4,767,062.00", "2,430,870.00", "1,198,990.00", "475,410.00"] },
      { label: "First Aid Injury (FAI) Cases", values: ["1", "2", "1", "3", "4"] },
      { label: "Medical Treatment Cases (MTC)", values: ["0", "0", "0", "0", "0"] },
      { label: "Lost Time Injury (LTI) Cases", values: ["0", "0", "0", "0", "0"] },
      { label: "Fatalities", values: ["0", "0", "0", "0", "0"] },
    ],
  },
  // One certificate image on the live page returns 404 and is omitted.
  certificates: [
    up("2026/08/Screenshot-2026-08-05-at-2.25.20-PM.png"),
    up("2026/01/ISO-14001-2015.png"),
    up("2026/07/Screenshot-2026-07-23-at-3.08.31-PM.png"),
    up("2026/01/ISO-45001-2018.png"),
    up("2026/01/Screenshot-2026-01-12-at-3.32.07-PM.png"),
  ],
};

/* ───────────────────────── Contact ───────────────────────── */

export const contactPage = {
  title: "Contact",
  heading: "Contact Us",
  heroImage: up("2023/05/صورة-DSC_5261-كبيرة.png"),
  siteOfficesLabel: "Site Offices:",
  siteOffices: ["NEOM", "RIYADH", "DHARAN", "JUBAIL", "KHAFJI", "HARADH", "HAFUF", "JEDDAH", "MEDINA", "DUBA", "ABQAIQ", "TABUK", "KHURAIS", "JAFURA", "TURAIF"],
  offices: [
    {
      city: "Dammam",
      lines: ["Dhahran-Jubail highway P.O.Box 5029 Dammam 34261 Kingdom of Saudi Arabia"],
      email: "info@ppco-ksa.com",
      tel: "Tel: +966 13 837 2532",
    },
    {
      city: "Riyadh",
      lines: ["Above Aljazeerah، Bank، شارع دجلة،، Riyadh 13315, Saudi Arabia Takasusi Street"],
    },
  ],
  /**
   * Exact positions, from PPCO's own Google Maps listings (checked October 2026):
   * "Projects Pioneers Co." (Al-Shula, Dammam), "Projects Pioneers Co رواد المشاريع" (Dijlah Street, Riyadh)
   * and "Projects Pioneers Company (PPCO)" (NEOM). Site offices without a listing have no exact position,
   * so they are shown but not selectable on the map.
   */
  mapPoints: {
    dammam: { name: "Dammam", role: "Head office", lat: 26.3666508, lng: 50.0937452 },
    riyadh: { name: "Riyadh", role: "Regional office", lat: 24.7914131, lng: 46.6481889 },
    neom: { name: "NEOM", role: "Site office", lat: 28.112124, lng: 35.3094649 },
  } as Record<string, { name: string; role: string; lat: number; lng: number }>,
  /** Which site offices (by their label above) have an exact position. */
  siteOfficePoints: { NEOM: "neom", RIYADH: "riyadh" } as Record<string, string>,
};

/* ───────────────────────── Footer ───────────────────────── */

export const footer = {
  company: [
    { label: "About PPCO", href: "/company" },
    { label: "Leadership", href: "/company#people" },
    { label: "Our Divisions", href: "/services" },
    { label: "Company Profile", href: "PROFILE" },
  ],
  services: [
    { label: "Civil & Industrial Construction", href: "/services#civil" },
    { label: "Mechanical & Electrical Works", href: "/services#mechanical" },
    { label: "Infrastructure & Earthworks", href: "/services#civil" },
    { label: "Equipment Supply & Maintenance", href: "/list-of-equipment" },
    { label: "Quality & Safety Support", href: "/training-and-safety" },
  ],
};

/* ───────────────────────── Enquiry / RFQ form ─────────────────────────
 * New for the redesign (the live site has no form). Wording is ours, kept plain so it can be edited here. */

/** Link to the request-for-quote form, optionally with a service preselected. */
export const quoteHref = (service?: string) => `/contact/?type=quote${service ? `&service=${service}` : ""}#enquiry`;

export const enquiry = {
  title: "Send us your request",
  intro: "Tell us about your project and our team will get back to you by email or phone.",
  types: [
    { id: "quote", label: "Request a quote" },
    { id: "general", label: "General enquiry" },
  ],
  services: [
    { id: "civil", label: "Civil Solutions" },
    { id: "mechanical", label: "Mechanical Solutions" },
    { id: "electrical", label: "Electrical Solutions" },
    { id: "mining", label: "Mining (PPM)" },
    { id: "equipment", label: "Equipment and manpower supply" },
    { id: "other", label: "Other" },
  ],
  timelines: ["Within 1 month", "1 to 3 months", "3 to 6 months", "More than 6 months", "Not decided yet"],
  privacy: "We only use these details to reply to your request.",
};
