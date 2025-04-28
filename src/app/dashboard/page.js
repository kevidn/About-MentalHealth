"use client"
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from '../../../lib/firebase';  // Import the initialized auth instance

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {user ? (
        <div className="bg-white p-8 rounded-lg shadow-lg w-80">
          <h2 className="text-2xl text-gray-500 font-semibold text-center mb-6">Dashboard</h2>
          <p className="text-gray-500">Welcome, {user.email}</p>
          <button
            className="mt-6 w-full py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600"
            onClick={() => auth.signOut()}  // Simplified logout handler
          >
            Logout
          </button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
