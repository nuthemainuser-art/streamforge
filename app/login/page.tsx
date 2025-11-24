"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");

  async function login(e: React.FormEvent) {
    e.preventDefault();

    await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${location.origin}/`,
      },
    });

    alert("Magic link sent to your email.");
  }

  return (
    <div className="sf-content" style={{ padding: 20 }}>
      <h2>Login</h2>
      <form onSubmit={login}>
        <label>Email</label>
        <input
          className="sf-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className="sf-btn sf-btn-primary" style={{ marginTop: 20 }}>
          Send Magic Link
        </button>
      </form>
    </div>
  );
}
