import { createClient } from "@sanity/client";
import { clientConfig } from "@sanity/clientConfig";

export const client = createClient(clientConfig);

// 必要なら function にして再利用可能にする
export function getClient() {
  return createClient(clientConfig);
}
