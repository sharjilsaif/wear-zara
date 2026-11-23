// Boots a throwaway in-memory Postgres (PGlite), applies the real migrations, seeds the catalogue,
// adds test fixtures, then builds and starts the app against it. Never touches the .env database.
import { spawn } from "node:child_process";

import { PGlite } from "@electric-sql/pglite";
import { PGLiteSocketServer } from "@electric-sql/pglite-socket";

import { E2E } from "./constants.mjs";

const env = {
  ...process.env,
  // pgbouncer=true: PGlite shares one session, so Prisma must not use named prepared statements.
  DATABASE_URL: `postgresql://postgres:postgres@127.0.0.1:${E2E.dbPort}/postgres?sslmode=disable&connection_limit=1&pgbouncer=true`,
  AUTH_SECRET: "e2e-only-secret-not-used-anywhere-else-0123456789",
  ADMIN_EMAILS: E2E.admin.email,
  NEXT_TELEMETRY_DISABLED: "1",
};
// Async on purpose: the database runs in this process, so it must keep serving while commands run.
const run = (command) =>
  new Promise((resolve, reject) => {
    spawn(command, { env, stdio: "inherit", shell: true }).on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`${command} exited with ${code}`))));
  });

const db = await PGlite.create();
const server = new PGLiteSocketServer({ db, host: "127.0.0.1", port: E2E.dbPort, maxConnections: 20 });
await server.start();

await run("npx prisma migrate deploy");
await run("node prisma/seed.js");

process.env.DATABASE_URL = env.DATABASE_URL;
const { PrismaClient } = await import("@prisma/client");
const bcrypt = (await import("bcrypt")).default;
const prisma = new PrismaClient();
const mens = { connect: [{ slug: "mens-fashion" }] };
const image = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab";
await prisma.product.createMany({
  data: [
    { id: E2E.products.lastUnit, name: "E2E LAST UNIT TEE", price: 25, imageUrl: image, stock: 1 },
    { id: E2E.products.soldOut, name: "E2E SOLD OUT CAP", price: 15, imageUrl: image, stock: 0 },
    { id: E2E.products.stocked, name: "E2E STOCKED HOODIE", price: 60, imageUrl: image, stock: 5 },
  ],
});
for (const id of Object.values(E2E.products)) await prisma.product.update({ where: { id }, data: { categories: mens } });
await prisma.coupon.createMany({
  data: [
    { code: "TEST10", type: "PERCENT", value: 10 },
    { code: "OLD5", type: "PERCENT", value: 5, expiresAt: new Date("2020-01-01") },
  ],
});
await prisma.user.create({ data: { name: "Store Admin", email: E2E.admin.email, password: await bcrypt.hash(E2E.admin.password, 10) } });
await prisma.$disconnect();

await run("npx next build"); // always rebuild: a previous build caches pages from a previous database
const app = spawn("npx", ["next", "start", "-p", String(E2E.port)], { env, stdio: "inherit", shell: true });

const stop = async () => {
  app.kill();
  await server.stop();
  process.exit(0);
};
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
