export const navLinks = [
  { name: "Home", path: "/" },
  { 
    name: "About", 
    links: [
      { name: "About APCERT", path: "/about" },
      { name: "Functions & Mandate", path: "/mandate" },
      { name: "Who's Who", path: "/committee" }
    ]
  },
  { 
    name: "Incidents", 
    links: [
      { name: "Report an Incident", path: "/report" },
      { name: "Vulnerability Disclosure", path: "/vulnerability-reporting" },
      { name: "Advisories", path: "/advisories" }
    ]
  },
  { 
    name: "Resources", 
    links: [
      { name: "Security Tips", path: "/security-tips" },
      { name: "Guidelines & SOPs", path: "/guidelines" },
      { name: "Downloads", path: "/downloads" },
      { name: "Publications", path: "/publications" }
    ]
  },
  { name: "Training", path: "/training" },
  { name: "Contact", path: "/contact" }
];