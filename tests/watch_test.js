// windows sub linux does not work for some reason

// https://bun.sh/guides/read-file/watch
import { watch } from "fs";

console.log(import.meta.dir);

const watcher = watch(
  import.meta.dir,
  { recursive: true },
  (event, filename) => {
    console.log(`Detected ${event} in ${filename}`);
  },
);

process.on("SIGINT", () => {
  // close watcher when Ctrl-C is pressed
  console.log("Closing watcher...");
  watcher.close();

  process.exit(0);
});