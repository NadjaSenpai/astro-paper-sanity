import fs from "node:fs";
import type { Font } from "satori";

const fonts: Font[] = [
  {
    name: "Noto Sans JP",
    data: fs.readFileSync("src/fonts/NotoSansJP-Regular.ttf"), // ← そのまま渡す！
    style: "normal",
    weight: 400,
  },
  {
    name: "Satoshi",
    data: fs.readFileSync("src/fonts/Satoshi-Regular.ttf"),
    style: "normal",
    weight: 400,
  },
  {
    name: "Satoshi",
    data: fs.readFileSync("src/fonts/Satoshi-Bold.ttf"),
    style: "normal",
    weight: 700,
  },
  {
    name: "Inter 24pt",
    data: fs.readFileSync("src/fonts/Inter_24pt-Regular.ttf"),
    style: "normal",
    weight: 400,
  },
  {
    name: "Recursive Monospace",
    data: fs.readFileSync("src/fonts/Recursive_Monospace-Regular.ttf"),
    style: "normal",
    weight: 400,
  },
  {
    name: "Manrope",
    data: fs.readFileSync("src/fonts/Manrope-Regular.ttf"),
    style: "normal",
    weight: 400,
  },
  {
    name: "Manrope",
    data: fs.readFileSync("src/fonts/Manrope-Light.ttf"),
    style: "normal",
    weight: 300,
  },
];

export default fonts;
