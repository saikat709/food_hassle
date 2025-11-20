'use client';

import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function App() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
    if (session) {
      router.replace("/dashboard");
    } else {
      router.replace("/auth");
    }
  }, [session, status, router]);

  return <div>Loading...</div>;
}

export default function Home() {
  return (
    <SessionProvider>
      <App />
    </SessionProvider>
  );
}
