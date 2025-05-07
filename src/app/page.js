"use client"
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from '../../lib/firebase';
import Link from 'next/link';


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
    <main className="relative h-screen w-full">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "url('/bg-home.jpg')",
        }}
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative h-full z-10">
        <div className="px-8 md:px-16 lg:px-24 pt-32 md:pt-40">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white max-w-4xl">
            Selamat Datang di About-Mental Health
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/90 max-w-2xl">
            Platform edukasi seputar kesehatan mental dari sudut pandang Islam, bersama para ahli terpercaya.
          </p>
          <Link 
            href="/dashboard" 
            className="mt-8 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-md text-lg font-medium inline-block transition-colors duration-200"
          >
            Mulai Sekarang
          </Link>
        </div>
      </div>
    </main>
  )
}
