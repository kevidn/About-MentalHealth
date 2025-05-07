"use client"
import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Link from 'next/link';
import Image from 'next/image';

export default function ArtikelPage() {
  const [articles, setArticles] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to safely format dates
  const formatDate = (timestamp) => {
    try {
      if (!timestamp) return '-';
      
      // If it's a Firestore timestamp
      if (timestamp?.toDate) {
        return timestamp.toDate().toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
      
      // If it's a regular date
      const date = new Date(timestamp);
      return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return '-';
    }
  };

  const handleDelete = async (articleId) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus artikel ini?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, "articles", articleId));
      // Update the articles list without refreshing
      setArticles(articles.filter(article => article.id !== articleId));
    } catch (error) {
      console.error("Error deleting article:", error);
      alert('Gagal menghapus artikel');
    }
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    const fetchArticles = async () => {
      try {
        const articlesRef = collection(db, "articles");
        const q = query(articlesRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const articlesData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            // Safely handle the date
            createdAt: data.createdAt || new Date()
          };
        });
        setArticles(articlesData);
      } catch (error) {
        console.error("Error fetching articles:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
    return () => unsubscribeAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Artikel</h1>
          {user && (
            <Link
              href="/artikel/create"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Tulis Artikel Baru
            </Link>
          )}
        </div>

        {articles.length === 0 ? (
          <p className="text-center text-gray-500 mt-8">Belum ada artikel.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <div key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative w-full h-48">
                  {article.imageUrl ? (
                    <Image 
                      src={article.imageUrl}
                      alt={article.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                      priority={false}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <Link href={`/artikel/${article.id}`}>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                      {article.title || 'Untitled'}
                    </h2>
                  </Link>
                  <p className="text-gray-600 text-sm mb-4 whitespace-pre-line line-clamp-3">
                    {article.content 
                      ? article.content.length > 200 
                        ? `${article.content.substring(0, 200)}...` 
                        : article.content
                      : 'Tidak ada deskripsi'
                    }
                  </p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span className="font-medium">{article.authorName || 'Anonymous'}</span>
                    <span>{formatDate(article.createdAt)}</span>
                  </div>
                  {user && user.uid === article.authorId && (
                    <div className="mt-4 flex gap-2 items-center">
                      <Link
                        href={`/artikel/${article.id}/edit`}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                      >
                        Edit Artikel
                      </Link>
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="text-red-600 hover:text-red-700 transition-colors"
                        title="Hapus Artikel"
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-5 w-5" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}