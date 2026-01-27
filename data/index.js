// data/index.js
let explore = [
  { id: "womens-suit", name: "Women's Suit" },
  { id: "designer-collection", name: "Designer Collection" },
  { id: "spring-collection", name: "Spring Collection" },
  { id: "new-arrivals", name: "New Arrivals" },
  { id: "top-trends", name: "Top Trends" },
];

export const clients = [
  {
    username: "the-great-unknown",
    hosts: ["great-unknown.onrender.com"],
    name: "The Great Unknown",
    type: "existence",
    package: "the-great-unknown",
    administrators: [
      {
        email: "theyatsarbrand@gmail.com",
        password: "12345678",
        role: "owner",
      },
    ],
  },
  {
    username: "yatsar",
    hosts: ["yatsar.store"],
    name: "Yatsar",
    type: "cosmetics-store",
    package: "dotstore",
    content: {
      explore,
    },
    administrators: [
      {
        email: "theyatsarbrand@gmail.com",
        password: "12345678",
        role: "owner",
      },
    ],
  },
  {
    username: "velar",
    hosts: ["velar.gkrane.online"],
    name: "Velar",
    type: "fashion-store",
    package: "dotstore",
    content: {
      explore,
    },

    administrators: [
      {
        email: "theyatsarbrand@gmail.com",
        password: "12345678",
        role: "owner",
      },
    ],
  },
  {
    username: "comfie",
    hosts: ["comfie.gkrane.online"],
    name: "Comfie Furniture",
    type: "furniture-store",
    package: "dotstore",
    content: {},
    administrators: [
      {
        email: "theyatsarbrand@gmail.com",
        password: "12345678",
        role: "owner",
      },
    ],
  },
  {
    username: "spendly",
    hosts: ["spendly.gkrane.online"],
    name: "Spendly",
    type: "expense-tracker",
    package: "expense-tracker",
    administrators: [
      {
        email: "theyatsarbrand@gmail.com",
        password: "12345678",
        role: "owner",
      },
    ],
  },
  {
    username: "zendaa",
    hosts: ["zendaa.gkrane.online"],
    name: "Zendaa",
    type: "finance",
    package: "finance",
    administrators: [
      {
        email: "theyatsarbrand@gmail.com",
        password: "12345678",
        role: "owner",
      },
    ],
  },
  {
    username: "kora",
    hosts: ["kora.gkrane.online"],
    name: "Kora",
    type: "finance",
    package: "finance",
    administrators: [
      {
        email: "theyatsarbrand@gmail.com",
        password: "12345678",
        role: "owner",
      },
    ],
  },
  {
    username: "creatyve3d",
    hosts: ["creatyve3d.pro"],
    name: "Creative 3D",
    type: "professional",
    package: "dotpro",
    administrators: [
      {
        email: "theyatsarbrand@gmail.com",
        password: "12345678",
        role: "owner",
      },
    ],
  },
  {
    username: "bolt-investment",
    hosts: ["augmentplus.space"],
    name: "Bolt Investment",
    type: "property-investment",
    package: "dotproperty",
    administrators: [
      {
        email: "theyatsarbrand@gmail.com",
        password: "12345678",
        role: "owner",
      },
    ],
  },
  {
    username: "genesiskrane",
    hosts: ["gkrane.online"],
    name: "Genesis Krane",
    type: "krane",
    package: "krane",
    administrators: [
      {
        email: "genesiskrane@gmail.com",
        password: "12345678",
        role: "owner",
      },
    ],
  },
];
