import { promises as fs } from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const purchasesFile = path.join(dataDir, "purchases.json");

export type PurchaseRecord = {
  email: string;
  source: "stripe";
  purchasedAt: string;
  sessionId?: string;
};

type PurchaseStore = {
  purchases: PurchaseRecord[];
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

async function ensureStore() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(purchasesFile);
  } catch {
    const initialStore: PurchaseStore = { purchases: [] };
    await fs.writeFile(purchasesFile, JSON.stringify(initialStore, null, 2), "utf8");
  }
}

async function readStore(): Promise<PurchaseStore> {
  await ensureStore();
  const raw = await fs.readFile(purchasesFile, "utf8");
  return JSON.parse(raw) as PurchaseStore;
}

async function writeStore(store: PurchaseStore) {
  await fs.writeFile(purchasesFile, JSON.stringify(store, null, 2), "utf8");
}

export async function upsertPurchase(record: PurchaseRecord) {
  const store = await readStore();
  const normalizedEmail = normalizeEmail(record.email);
  const existingIndex = store.purchases.findIndex((purchase) => normalizeEmail(purchase.email) === normalizedEmail);

  if (existingIndex >= 0) {
    store.purchases[existingIndex] = {
      ...store.purchases[existingIndex],
      ...record,
      email: normalizedEmail
    };
  } else {
    store.purchases.push({
      ...record,
      email: normalizedEmail
    });
  }

  await writeStore(store);
}

export async function getPurchaseByEmail(email: string) {
  const normalizedEmail = normalizeEmail(email);
  const store = await readStore();
  return store.purchases.find((purchase) => normalizeEmail(purchase.email) === normalizedEmail) ?? null;
}
