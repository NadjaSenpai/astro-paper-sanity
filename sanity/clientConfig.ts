import { projectId, dataset, apiVersion, useCdn } from "./env";
import { type ClientConfig } from "@sanity/client";

export const clientConfig: ClientConfig = {
  projectId,
  dataset,
  apiVersion,
  useCdn,
};