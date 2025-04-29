import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { codeInput } from "@sanity/code-input";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas"; 
import {
  projectId,
  dataset,
} from "./env";

if (!projectId || !dataset) {
  throw new Error("❌ Sanity projectId or dataset is missing!");
}

export default defineConfig({
  projectId,
  dataset,
  title: "My Blog",
  plugins: [structureTool(), codeInput(), visionTool()],
  schema: {
    types: schemaTypes, 
  },
});
