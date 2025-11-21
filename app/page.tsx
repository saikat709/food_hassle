'use client';

// TODO: Uncomment when next-auth is installed and configured
// import { SessionProvider, useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";

// function App() {
//   const router = useRouter();
//   const { data: session, status } = useSession();

//   useEffect(() => {
//     if (status === "loading") return;
//     if (session) {
//       router.replace("/dashboard");
//     } else {
//       router.replace("/auth");
//     }
//   }, [session, status, router]);

//   return <div>Loading...</div>;
// }

// export default function Home() {
//   return (
//     <SessionProvider>
//       <App />
//     </SessionProvider>
//   );
// }

// Temporary redirect until auth is set up
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/dashboard");
}
