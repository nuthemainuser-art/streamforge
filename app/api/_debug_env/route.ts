export const runtime = "nodejs"; // ensure node runtime, not edge

export async function GET() {
  try {
    return new Response(
      JSON.stringify(
        {
          NODE_VERSION: process.version,
          ENV: {
            SUPABASE_URL: process.env.SUPABASE_URL ?? "(missing)",
            SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY
              ? "(present)"
              : "(missing)",
            NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "(missing)",
            NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
              ? "(present)"
              : "(missing)",
            TASK_DB_PROVIDER: process.env.TASK_DB_PROVIDER ?? "(missing)",
          },
        },
        null,
        2
      ),
      { headers: { "content-type": "application/json" } }
    );
  } catch (err: any) {
    return new Response("FAILED: " + err.message, { status: 500 });
  }
}
