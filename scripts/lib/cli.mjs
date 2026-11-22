import path from "path";
import { fileURLToPath } from "url";

/** True when this module is the Node process entrypoint. */
export function isDirectRun(metaUrl, argv1 = process.argv[1], platform = process.platform) {
  if (!metaUrl || !argv1) return false;
  try {
    const self = path.normalize(path.resolve(fileURLToPath(metaUrl)));
    const entry = path.normalize(path.resolve(argv1));
    if (platform === "win32") {
      return self.toLowerCase() === entry.toLowerCase();
    }
    return self === entry;
  } catch {
    return false;
  }
}
