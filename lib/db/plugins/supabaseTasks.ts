// lib/db/plugins/supabaseTasks.ts
import { createClient } from "@supabase/supabase-js";
import type { Task, TaskInput, TaskDBPlugin } from "../types";

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.warn(
    "[DB] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing – supabaseTasks plugin will fail."
  );
}

const supabase = url && serviceKey ? createClient(url, serviceKey) : null;

export const supabaseTaskPlugin: TaskDBPlugin = {
  id: "supabase",
  title: "Supabase Postgres (tasks)",

  async listTasks(userId, offset, limit): Promise<Task[]> {
    if (!supabase) throw new Error("Supabase not configured");

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return (
      data?.map((row: any) => ({
        id: row.id,
        userId: row.user_id,
        title: row.title,
        week: row.week ?? "",
        day: row.day ?? "",
        hour: row.hour ?? "",
        minute: row.minute ?? "",
        priority: row.priority ?? "",
        reward: row.reward ?? "",
        focus: row.focus ?? "",
        stage: row.stage ?? "",
        status: row.status ?? "",
        tags: row.tags ?? "",
        createdAt: row.created_at,
      })) ?? []
    );
  },

  async addTask(userId, input): Promise<Task> {
    if (!supabase) throw new Error("Supabase not configured");

    const payload = {
      user_id: userId,
      title: input.title,
      week: input.week ?? "",
      day: input.day ?? "",
      hour: input.hour ?? "",
      minute: input.minute ?? "",
      priority: input.priority ?? "",
      reward: input.reward ?? "",
      focus: input.focus ?? "",
      stage: input.stage ?? "",
      status: input.status ?? "Pending",
      tags: input.tags ?? "",
    };

    const { data, error } = await supabase
      .from("tasks")
      .insert(payload)
      .select("*")
      .single();

    if (error) throw error;

    return {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      week: data.week ?? "",
      day: data.day ?? "",
      hour: data.hour ?? "",
      minute: data.minute ?? "",
      priority: data.priority ?? "",
      reward: data.reward ?? "",
      focus: data.focus ?? "",
      stage: data.stage ?? "",
      status: data.status ?? "",
      tags: data.tags ?? "",
      createdAt: data.created_at,
    };
  },
};

export const runtime = "nodejs";
