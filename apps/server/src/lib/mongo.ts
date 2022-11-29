import { MongoClient } from "mongodb";

const url = process.env.MONGO_URL;

if (typeof url === "undefined") {
  throw new Error("MONGO_URL not available in environment");
}

const client = new MongoClient(url);

const dbName = "bugtracker";

export async function getOccurrencesCollection() {
  await client.connect();
  const db = client.db(dbName);
  return db.collection("occurrences");
}

export async function disconnect() {
  await client.close();
}

process.on("SIGTERM", () => {
  console.log("Disconnecting from MongoDB… ");
});
