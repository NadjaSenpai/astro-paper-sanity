import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { codeInput } from "@sanity/code-input";
import schemas from "./schemas";
import {
  projectId,
  dataset,
} from "./env.ts";

if (!projectId || !dataset) {
  throw new Error("❌ Sanity projectId or dataset is missing!");
}

export default defineConfig({
  projectId,
  dataset,
  title: "My Blog",
  plugins: [structureTool(), codeInput()],
  schema: {
    types: schemas,
  },
});