"use client"
import { useState, useEffect } from 'react';
import { doc, getDoc, collection, addDoc, query, orderBy, onSnapshot, where, Timestamp } from 'firebase/firestore'; // Add Timestamp to imports
import { db, auth } from '../../../../lib/firebase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { onAuthStateChanged } from 'firebase/auth';

export default function ArticleDetail({ params }) {
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentsError, setCommentsError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Store ID in a variable to avoid accessing params directly
    const articleId = params?.id;
    if (!articleId) return;

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    const fetchArticle = async () => {
      try {
        const docRef = doc(db, "articles", articleId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setArticle({ id: docSnap.id, ...docSnap.data() });
        } else {
          router.push('/artikel');
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching article:", error);
        setLoading(false);
      }
    };

    fetchArticle();

    const commentsRef = collection(db, "comments");
    const q = query(
      commentsRef,
      where("articleId", "==", articleId),
      orderBy("createdAt", "desc")
    );

    const unsubscribeComments = onSnapshot(q, 
      (snapshot) => {
        const commentsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setComments(commentsData);
        setCommentsLoading(false);
        setCommentsError(null);
      },
      (error) => {
        if (error.message.includes("requires an index")) {
          setCommentsError("Komentar sedang dipersiapkan, mohon tunggu beberapa saat...");
        } else {
          setCommentsError("Terjadi kesalahan saat memuat komentar.");
        }
        console.error("Error fetching comments:", error);
        setCommentsLoading(false);
      }
    );

    return () => {
      unsubscribeAuth();
      unsubscribeComments();
    };
  }, [router]);

  const formatDate = (timestamp) => {
    try {
      if (!timestamp) return '-';
      if (timestamp?.toDate) {
        return timestamp.toDate().toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
      return new Date(timestamp).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      console.log(e)
      return '-';
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    const articleId = params?.id;
    
    try {
      if (!articleId || !newComment.trim()) {
        alert('Mohon isi komentar Anda');
        return;
      }
      
      // Data komentar dengan format yang benar
      const commentData = {
        articleId,
        userId: user ? user.uid : 'guest',
        userName: user ? (user.displayName || user.email) : 'Guest',
        content: newComment.trim(),
        createdAt: new Date(), // Change this line
        isGuest: !user
      };

      await addDoc(collection(db, "comments"), commentData);
      setNewComment('');

    } catch (error) {
      console.error("Error adding comment:", error);
      alert('Terjadi kesalahan saat menambahkan komentar. Silakan coba lagi.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Article not found</div>
      </div>
    );
  }

  const renderComments = () => {
    if (commentsLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-4 space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-sm text-gray-500">Memuat komentar...</p>
        </div>
      );
    }

    if (commentsError) {
      return (
        <div className="text-center py-4">
          <p className="text-gray-600">{commentsError}</p>
        </div>
      );
    }

    if (comments.length === 0) {
      return (
        <p className="text-center text-gray-500 py-4">
          Belum ada komentar. Jadilah yang pertama berkomentar!
        </p>
      );
    }

    return (
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-white p-4 rounded-lg shadow mb-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-800">
                  {comment.userName}
                </span>
                {comment.isGuest && (
                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                    Guest
                  </span>
                )}
              </div>
              <span className="text-sm text-gray-600">
                {formatDate(comment.createdAt)}
              </span>
            </div>
            <p className="text-gray-800 whitespace-pre-line">{comment.content}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {article.imageUrl && (
          <div className="relative w-full h-64 mb-8">
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        )}
        <h1 className="text-4xl font-bold text-gray-800 mb-4">{article.title}</h1>
        <div className="flex items-center text-gray-700 mb-8">
          <span>{article.authorName}</span>
          <span className="mx-2">•</span>
          <span>{formatDate(article.createdAt)}</span>
        </div>
        <div className="prose max-w-none mb-12 text-gray-800 whitespace-pre-wrap">
          {article.content}
        </div>

        {/* Comments Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Komentar</h2>
          
          <form onSubmit={handleAddComment} className="mb-8">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-3 border rounded-md text-gray-800"
              rows="3"
              placeholder={user ? "Tulis komentar Anda..." : "Tulis komentar sebagai Guest..."}
              required
            />
            <div className="mt-2 flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {user ? `Commenting as ${user.displayName || user.email}` : 'Commenting as Guest'}
              </span>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Kirim Komentar
              </button>
            </div>
          </form>

          {renderComments()}
        </div>
      </div>
    </div>
  );
}