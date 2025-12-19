import { Play, RotateCcw } from 'lucide-react';

export default function Planning() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">MRP Planlama</h2>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="max-w-xl">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Hesaplama Motoru</h3>
            <p className="text-sm text-gray-500 mb-6">
                Malzeme İhtiyaç Planlaması (MRP) motorunu çalıştırarak, mevcut stok, açık siparişler ve üretim planına göre net ihtiyaçları belirleyin.
            </p>

            <div className="flex gap-4">
                <button className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    <Play className="h-4 w-4" />
                    Hesaplamayı Başlat
                </button>
                <button className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50">
                    <RotateCcw className="h-4 w-4" />
                    Sonuçları Temizle
                </button>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col items-center justify-center text-center py-12">
        <div className="bg-gray-100 p-4 rounded-full mb-4">
            <Play className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">Henüz hesaplama yapılmadı</h3>
        <p className="text-gray-500 mt-1 max-w-sm">
            Yukarıdaki butonu kullanarak yeni bir MRP döngüsü başlatabilirsiniz.
        </p>
      </div>
    </div>
  );
}
