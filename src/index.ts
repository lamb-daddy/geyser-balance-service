import run from "./lib/run";

run().catch((e) => {
  console.error("Error", e);
  process.exit(1);
});
