//app.page.tsx

import { redirect } from "next/navigation";


export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
export const runtime = "nodejs";

import StreamforgeWrapper from "@/components/StreamforgeWrapper";
import { createServer } from "@/lib/supabase/server";

export default async function StreamforgePage() {
  const supabase = createServer();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
		redirect("/login");
  }

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <StreamforgeWrapper
      initialTasks={tasks || []}
      user={session.user}
    />
  );
}
