import { defineConfig } from "sanity";
import { structureTool } from 'sanity/structure'
import { codeInput } from "@sanity/code-input";
import schemas from "./schemas";

export default defineConfig({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  title: "My Blog",
  plugins: [structureTool(), codeInput()],
  schema: {
    types: schemas,
  },
});