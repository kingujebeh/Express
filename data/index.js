const domains = {
  community: ["augmentplus.space"],
  kingdom: ["marblelimit.com"],
  business: ["gkrane.online"],
  shop: ["osasengineering.shop"],
  store: ["yatsar.store"],
  pro: ["creatyve3d.pro"],
  me: ["great-unknown.nw.r.appspot.com"],
  fairplay: ["soccerclues.site"],
};

const unknown = {
  name: "Unknown",
  body: {
    worlds: [
      {
        id: "biological",
        list: [],
      },
      {
        id: "basic",
        types: [],
      },
      {
        id: "planetry",
        list: [],
      },
    ],
    kingdoms: [
      {
        id: "large",
        list: [
          {
            id: "africa",
            name: "Africa",
            body: {
              software: [],
              people: {
                professionals: [],
                students: [],
                nations: [],
              },
              communities: ["Software", "Engineering", "Design"],
              market: [],
              institutions: [],
              competitions: [],
            },
            info: {
              currency: [],
              places: [],
            },
          },
          { id: "britain" },
        ],
      },
      { id: "medium", list: [{ id: "benin" }] },
      { id: "small" },
    ],
    nations: [
      { id: "nigeria", name: "Nigeria" },
      { id: "igbo", name: "Ibo" },
      { id: "yoruba", name: "Yoruba" },
      { id: "hausa", name: "Hausa" },
    ],
    countries: [
      { id: "small" },
      { id: "medium", list: [{ id: "nigeria" }] },
      { id: "large" },
    ],
    populations: [
      { id: "small" },
      { id: "medium" },
      { id: "large", list: [{ id: "nigeria" }] },
    ],
  },
};

const real = {
  apps: [
    {
      name: "WA Admin",
      domain: "wa-admin.one",
    },
  ],
  kingdoms: [
    {
      id: "africa",
      name: "Africa",
    },
    {
      id: "benin",
      name: "Benin",
    },
    {
      id: "britain",
      name: "Britain",
    },
  ],
  professionals: [
    {
      username: "creatyve3d",
      name: "Creatyve 3D",
      domain: "creatyve3d.pro",
    },
  ],
  stores: [
    {
      id: "yatsar",
      name: "Yatsar",
      domain: "yatsar.store",
    },
  ],
  shops: [
    {
      id: "osaseng",
      name: "Osas Engineering",
      domain: "osasengineering.shop",
    },
  ],
};

module.exports = { domains, unknown, real };
