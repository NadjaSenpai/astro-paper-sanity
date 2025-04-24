import { defineConfig } from "sanity";
import { structureTool } from 'sanity/structure'
import { codeInput } from "@sanity/code-input";
import schemas from "./schemas";
import { sanityConfig } from "./sanity.env";

export default defineConfig({
  projectId: sanityConfig.projectId,
  dataset: sanityConfig.dataset,
  title: "My Blog",
  plugins: [structureTool(), codeInput()],
  schema: {
    types: schemas,
  },
});