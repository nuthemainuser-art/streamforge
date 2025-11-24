export const dynamic = "force-dynamic";

import StreamforgeWrapper from "@/components/StreamforgeWrapper";
import { createServer } from "@/lib/supabase/server";

export default async function StreamforgePage() {
  const supabase = createServer();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return <meta httpEquiv="refresh" content="0; url=/login" />;
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
