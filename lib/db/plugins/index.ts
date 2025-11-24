// lib/db/plugins/index.ts
import { supabaseTaskPlugin } from "./supabaseTasks";
import type { TaskDBPlugin } from "../types";

const PLUGINS: Record<string, TaskDBPlugin> = {
  supabase: supabaseTaskPlugin,
  // later: "sheets": sheetsTaskPlugin, "dummy": dummyTaskPlugin, etc.
};

export function getTaskDBPlugin(): TaskDBPlugin {
  const provider = process.env.TASK_DB_PROVIDER || "supabase";
  const plugin = PLUGINS[provider];

  if (!plugin) {
    throw new Error(
      `Unknown TASK_DB_PROVIDER "${provider}". Available: ${Object.keys(
        PLUGINS
      ).join(", ")}`
    );
  }
  return plugin;
}
