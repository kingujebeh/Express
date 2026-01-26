// data/index.js
export const clients = [
  {
    id: "yatsar",
    hosts: ["yatsar.store"],
    name: "Yatsar",
    type: "cosmetics-store",
    package:'store'
  },
  {
    id: "velar",
    hosts: ["velar.gkrane.online"],
    name: "Velar",
    type: "fashion-store",
    package:'store',
    explore: [
      { id: "womens-suit", name: "Women's Suit" },
      { id: "designer-collection", name: "Designer Collection" },
      { id: "spring-collection", name: "Spring Collection" },
      { id: "new-arrivals", name: "New Arrivals" },
      { id: "top-trends", name: "Top Trends" },
    ],
  },
  {
    id: "comfie",
    hosts: ["comfie.gkrane.online"],
    name: "Comfie Furniture",
    type: "furniture-store",
    package:'store',
  },
  {
    id: "spendly",
    hosts: ["spendly.gkrane.online"],
    name: "Spendly",
    type: "expense-tracker",
    package:'expense-tracker',
  },
  {
    id: "creatyve3d",
    hosts: ["creatyve3d.pro"],
    name: "Creative 3D",
    type: "professional",
    package:'dotpro',
  },
  {
    id: "bolt-investment",
    hosts: ["augmentplus.space"],
    name: "Bolt Investment",
    type: "property-investment",
    package:'dotproperty',
  },
  {
    id: "genesiskrane",
    hosts: ["gkrane.online"],
    name: "Genesis Krane",
    type: "krane",
    package:'krane',
  },
];
