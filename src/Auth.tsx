import { useState } from "react";
import { supabase } from "./supabaseClient";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) alert(error.message);
    else setSent(true);
  }

  if (sent) return <p className="text-sm text-white/70">Check your email to sign in.</p>;

  return (
    <form onSubmit={signIn} className="flex gap-2">
      <input
        className="bg-black/30 border border-white/20 rounded-xl px-3 py-2"
        placeholder="you@example.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
        type="email"
        required
      />
      <button className="px-3 py-2 rounded-xl bg-white text-black font-medium">
        Sign in
      </button>
    </form>
  );
}
