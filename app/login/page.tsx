// app/login/page.tsx
"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export default function LoginPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");

  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${location.origin}/`,
      },
    });

    if (error) {
      alert("Error sending magic link: " + error.message);
    } else {
      alert("Magic link sent to your email.");
    }
  }

  return (
    <div className="sf-content" style={{ padding: 20 }}>
      <h2>Login</h2>

      <form onSubmit={login}>
        <label>Email</label>
        <input
          className="sf-input"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className="sf-btn sf-btn-primary" type="submit" style={{ marginTop: 20 }}>
          Send Magic Link
        </button>
      </form>
    </div>
  );
}
