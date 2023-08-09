import { describe } from "vitest";
import { testDriver } from "./utils";
import driver from "../../src/drivers/yjs";

describe("drivers: yjs", () => {
  testDriver({
    driver: driver({
      storeName: "test-store",
      mapName: "test-map",
    }),
    additionalTests(ctx) {},
  });
});
