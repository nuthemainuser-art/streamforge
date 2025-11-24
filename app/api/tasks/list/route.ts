// app/api/tasks/list/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getTaskDBPlugin } from "@/lib/db/plugins";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const offset = Number(searchParams.get("offset") ?? "0");
    const limit = Number(searchParams.get("limit") ?? "20");

    const userId =
      searchParams.get("userId") || "anonymous-device-user"; // v0 – later replace with real auth

    const plugin = getTaskDBPlugin();
    const tasks = await plugin.listTasks(userId, offset, limit);

    return NextResponse.json({ ok: true, tasks });
  } catch (err: any) {
    console.error("[API] /tasks/list error", err);
    return NextResponse.json(
      { ok: false, error: String(err?.message || err) },
      { status: 500 }
    );
  }
}
