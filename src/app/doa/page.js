"use client"
import { useState } from 'react';

export default function DoaPage() {
  const doas = [
    {
      id: 1,
      title: "Doa Memohon Ketenangan Hati",
      arabic: "اللَّهُمَّ اجْعَلْ فِي قَلْبِي نُورًا",
      latin: "Allahummaj'al fii qalbii nuuran",
      arti: "Ya Allah, jadikanlah dalam hatiku cahaya (ketenangan)",
      manfaat: "Doa ini membantu menenangkan hati dan pikiran saat menghadapi kecemasan"
    },
    {
      id: 2,
      title: "Doa Menghilangkan Kesedihan",
      arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ",
      latin: "Allahumma inni a'udzu bika minal hammi wal hazan",
      arti: "Ya Allah, aku berlindung kepada-Mu dari kegelisahan dan kesedihan",
      manfaat: "Membantu meringankan beban pikiran dan kesedihan"
    },
    {
      id: 3,
      title: "Doa Memohon Kesehatan Mental",
      arabic: "رَبِّ إِنِّي مَسَّنِيَ الضُّرُّ وَأَنتَ أَرْحَمُ الرَّاحِمِينَ",
      latin: "Rabbi anni massaniya d-dhurru wa anta arhamur rahimin",
      arti: "Ya Tuhanku, sesungguhnya aku telah ditimpa kesusahan dan Engkau adalah Tuhan Yang Maha Penyayang",
      manfaat: "Doa ini untuk memohon kesembuhan dari segala penyakit termasuk gangguan mental"
    },
    {
      id: 4,
      title: "Doa Memohon Kekuatan",
      arabic: "رَبِّ زِدْنِي عِلْماً وَفَهْماً",
      latin: "Rabbi zidni 'ilman wa fahman",
      arti: "Ya Tuhanku, tambahkanlah kepadaku ilmu dan pemahaman",
      manfaat: "Membantu meningkatkan kekuatan mental dan pemahaman diri"
    },
    {
      id: 5,
      title: "Doa Menghadapi Ketakutan",
      arabic: "حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ",
      latin: "Hasbiyallahu la ilaha illa huwa 'alaihi tawakkaltu",
      arti: "Cukuplah Allah bagiku, tidak ada Tuhan selain Dia, kepada-Nya aku bertawakal",
      manfaat: "Membantu mengatasi ketakutan dan kecemasan dengan berserah diri kepada Allah"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Kumpulan Doa untuk Kesehatan Mental
        </h1>
        
        <div className="space-y-8">
          {doas.map((doa) => (
            <div 
              key={doa.id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">
                {doa.title}
              </h2>
              
              <div className="text-center space-y-4">
                <p className="text-2xl font-arabic text-gray-900">{doa.arabic}</p>
                <p className="text-md text-gray-700 italic">{doa.latin}</p>
                <p className="text-md text-gray-800">Arti: {doa.arti}</p>
                <p className="text-sm text-gray-600 mt-4">{doa.manfaat}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}