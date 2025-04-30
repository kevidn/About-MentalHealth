'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../../../lib/firebase'

export default function Navbar() {
  const pathname = usePathname()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
    })
    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    await signOut(auth)
  }

  const isActive = (path) => pathname === path ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-500'

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
      <h1 className="text-xl font-bold text-green-600 hover:text-green-700 transition-colors">
        About-Mental Health
      </h1>
      <div className="flex space-x-6">
        <Link href="/" className={isActive('/')}>Beranda</Link>
        <Link href="/artikel" className={isActive('/artikel')}>Artikel</Link>
        <Link href="/doa" className={isActive('/doa')}>Doa</Link>
        <Link href="/forum" className={isActive('/forum')}>Forum Diskusi</Link>
        {user && (
          <Link href="/konsultasi" className={isActive('/konsultasi')}>
            Konsultasi
          </Link>
        )}
        {!user ? (
          <>
            <Link href="/login" className={`${isActive('/login')} hover:text-blue-500`}>
              Login
            </Link>
            <Link href="/register" className={`${isActive('/register')} hover:text-blue-500`}>
              Register
            </Link>
          </>
        ) : (
          <button 
            onClick={handleLogout} 
            className="text-gray-700 hover:text-red-600 transition-colors font-medium"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  )
}
