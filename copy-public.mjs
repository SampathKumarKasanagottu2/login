import { fs } from "zx";

// Ensure the destination directory exists (mkdirp handles existing dirs)
await fs.mkdirp("dist/v2/public");

// Copy public files recursively
await fs.copy("src/v2/public", "dist/v2/public", { recursive: true, overwrite: true });