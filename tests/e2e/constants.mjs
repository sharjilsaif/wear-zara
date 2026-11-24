// Shared by the test server and the specs.
export const E2E = {
  port: 3100,
  dbPort: 54329,
  admin: { email: "admin@e2e.test", password: "Admin12345" },
  coAdmin: { name: "Second Admin", email: "co-admin@e2e.test" },
  products: { lastUnit: "e2e-last-unit", soldOut: "e2e-sold-out", stocked: "e2e-stocked" },
};
