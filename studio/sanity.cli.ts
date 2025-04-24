import {defineCliConfig} from 'sanity/cli'
import * as dotenv from "dotenv";
dotenv.config(); // .env 読み込み

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_PROJECT_ID || "", // .env から取得
    dataset: process.env.SANITY_DATASET || "production",
  },
  /**
   * Enable auto-updates for studios.
   * Learn more at https://www.sanity.io/docs/cli#auto-updates
   */
  autoUpdates: true,
})
