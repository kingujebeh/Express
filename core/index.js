import { randomUUID } from "crypto";
import { connectDatabases, accounts } from "../db/index.js";
import { clients } from "../data/index.js";

export const init = async () => {
  // Connect Express Server To Database
  await connectDatabases();

  console.log(clients);
  await seedClients();

  console.log("🚀 Boot data initialized");
};

async function seedClients() {
  const { Client } = accounts.models;

  console.log("📦 Seeding clients...");

  for (const client of clients) {
    await Client.findOneAndUpdate(
      { username: client.username },
      { $set: client },
      {
        upsert: true,
        new: true,
        runValidators: true,
      }
    );
  }

  console.log("✅ Clients synced");
}
