// app/api/tasks/add/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getTaskDBPlugin } from "@/lib/db/plugins";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      title,
      week,
      day,
      hour,
      minute,
      priority,
      reward,
      focus,
      stage,
      status,
      tags,
    } = body || {};

    if (!userId || !title) {
      return NextResponse.json(
        { ok: false, error: "userId and title are required" },
        { status: 400 }
      );
    }

    const plugin = getTaskDBPlugin();
    const task = await plugin.addTask(userId, {
      title,
      week,
      day,
      hour,
      minute,
      priority,
      reward,
      focus,
      stage,
      status,
      tags,
    });

    return NextResponse.json({ ok: true, task });
  } catch (err: any) {
    console.error("[API] /tasks/add error", err);
    return NextResponse.json(
      { ok: false, error: String(err?.message || err) },
      { status: 500 }
    );
  }
}
