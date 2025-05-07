"use client"
import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../../../../lib/firebase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function EditArticle({ params }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const docRef = doc(db, "articles", params.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const articleData = docSnap.data();
          setTitle(articleData.title);
          setContent(articleData.content);
          setImagePreview(articleData.imageUrl || '');
          
          if (user && articleData.authorId !== user.uid) {
            setError("Anda tidak memiliki akses untuk mengedit artikel ini");
            router.push('/artikel');
          }
        } else {
          setError("Artikel tidak ditemukan");
          router.push('/artikel');
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching article:", error);
        setError("Terjadi kesalahan saat memuat artikel");
        router.push('/artikel');
      }
    };

    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchArticle();
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [params.id, router, user]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error('Upload failed');

        const data = await response.json();
        setImage(data.url);
        setImagePreview(data.url);
        
      } catch (error) {
        console.error('Error uploading:', error);
        alert('Error uploading image');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setUploadProgress(10);

    try {
      setUploadProgress(50);
      const docRef = doc(db, "articles", params.id);
      await updateDoc(docRef, {
        title,
        content,
        imageUrl: image || imagePreview, // Use existing image if no new upload
        updatedAt: new Date()
      });
      
      setUploadProgress(100);
      router.push(`/artikel/${params.id}`);
    } catch (error) {
      console.error("Error updating article:", error);
      setError("Gagal menyimpan perubahan");
    } finally {
      setSaving(false);
      setUploadProgress(0);
    }
  };

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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Artikel</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Judul
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black" // Added text-black
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Gambar
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full text-black file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" // Changed text-gray-500 to text-black
            />
            {(imagePreview || image) && (
              <div className="mt-2 relative w-full h-48">
                <Image
                  src={image || imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover rounded-md"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Konten
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="10"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black" // Added text-black
              required
            />
          </div>

          {saving && (
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2 text-center">
                {uploadProgress < 90 
                  ? `Menyimpan perubahan... ${uploadProgress}%`
                  : uploadProgress === 100 
                    ? 'Selesai!'
                    : 'Memperbarui artikel...'}
              </p>
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className={`flex-1 px-4 py-2 rounded-md text-white transition-colors ${
                saving 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {saving ? `Menyimpan (${uploadProgress}%)` : 'Simpan Perubahan'}
            </button>
            <button
              type="button"
              onClick={() => router.push(`/artikel/${params.id}`)}
              className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}