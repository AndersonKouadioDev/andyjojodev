import sharp from "sharp";
import { readdir, unlink } from "fs/promises";
import { join, extname, basename } from "path";

const DIR = new URL("../public/images/projects/", import.meta.url).pathname;

const files = await readdir(DIR);
const pngs = files.filter((f) => extname(f).toLowerCase() === ".png");

for (const file of pngs) {
  const src = join(DIR, file);
  const dest = join(DIR, basename(file, ".png") + ".webp");
  await sharp(src).webp({ quality: 80 }).toFile(dest);
  await unlink(src);
  console.log(`✓ ${file} → ${basename(dest)}`);
}

console.log(`\nDone: ${pngs.length} files converted.`);
