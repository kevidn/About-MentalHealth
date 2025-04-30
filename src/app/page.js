"use client"
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from '../../lib/firebase';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">Dashboard</h2>
        <p className="text-gray-700 text-lg">
          Welcome, <span className="text-blue-500">{user ? user.email : "Guest"}</span>
        </p>
        {user ? (
          <button
            className="mt-6 w-full py-3 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition-colors duration-200"
            onClick={() => auth.signOut()}
          >
            Logout
          </button>
        ) : (
          <button
            className="mt-6 w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-colors duration-200"
            onClick={() => router.push("/login")}
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
}
