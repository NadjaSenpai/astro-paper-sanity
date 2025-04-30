import { createClient } from "@sanity/client";
export const client = createClient({
    projectId: import.meta.env.SANITY_PROJECT_ID,
    dataset: import.meta.env.SANITY_DATASET || "production",
    useCdn: false,
    apiVersion: "2025-04-21",
    token: import.meta.env.SANITY_API_TOKEN,
});
export default client;
