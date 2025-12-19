import { useState } from 'react';
import axios from 'axios';
import { Play, RotateCcw, AlertTriangle, ShoppingCart, Factory } from 'lucide-react';
import { type MrpResult, type Item, type Demand, ActionType } from '../types';

export default function Planning() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MrpResult | null>(null);
  const [error, setError] = useState('');

  const handleCalculate = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      // 1. Verileri topla (Malzemeler ve Siparişler)
      const [itemsRes, ordersRes] = await Promise.all([
        axios.get<Item[]>('/api/materials'),
        axios.get<Demand[]>('/api/orders')
      ]);

      const input = {
        items: itemsRes.data,
        demands: ordersRes.data
      };

      // 2. Hesaplama isteği gönder
      const res = await axios.post<MrpResult>('/api/planning/calculate', input);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError('Hesaplama sırasında bir hata oluştu. Lütfen verilerinizi kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setResult(null);
    setError('');
  };

  const purchaseSuggestions = result?.suggestions.filter(s => s.action === ActionType.Buy) || [];
  const productionSuggestions = result?.suggestions.filter(s => s.action === ActionType.Make) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">MRP Planlama</h2>
      </div>

      {/* Kontrol Paneli */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="max-w-xl">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Hesaplama Motoru</h3>
            <p className="text-sm text-gray-500 mb-6">
                Malzeme İhtiyaç Planlaması (MRP) motorunu çalıştırarak, mevcut stok, açık siparişler ve üretim planına göre net ihtiyaçları belirleyin.
            </p>

            <div className="flex gap-4">
                <button 
                    onClick={handleCalculate}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <Play className="h-4 w-4" />
                    )}
                    {loading ? 'Hesaplanıyor...' : 'Hesaplamayı Başlat'}
                </button>
                <button 
                    onClick={handleClear}
                    disabled={loading || !result}
                    className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <RotateCcw className="h-4 w-4" />
                    Sonuçları Temizle
                </button>
            </div>
            
            {error && (
                <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    {error}
                </div>
            )}
        </div>
      </div>

      {/* Sonuçlar */}
      {result ? (
        <div className="space-y-8">
            
            {/* 1. Uyarılar ve Hatalar */}
            {result.exceptions.length > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl overflow-hidden">
                    <div className="p-4 bg-orange-100 border-b border-orange-200 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-orange-700" />
                        <h3 className="font-semibold text-orange-900">Planlama Uyarıları ({result.exceptions.length})</h3>
                    </div>
                    <ul className="divide-y divide-orange-200">
                        {result.exceptions.map((ex, idx) => (
                            <li key={idx} className="p-4 text-sm text-orange-800 flex justify-between items-start">
                                <div>
                                    <span className="font-bold mr-2">{ex.itemCode}:</span>
                                    {ex.message}
                                </div>
                                {ex.affectedDate && (
                                    <div className="text-orange-600 text-xs font-medium bg-orange-100 px-2 py-1 rounded">
                                        {new Date(ex.affectedDate).toLocaleDateString('tr-TR')}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 2. Satınalma Önerileri */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-blue-50">
                        <div className="flex items-center gap-2">
                            <ShoppingCart className="w-5 h-5 text-blue-700" />
                            <h3 className="font-semibold text-blue-900">Satınalma Önerileri</h3>
                        </div>
                        <span className="bg-blue-200 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">
                            {purchaseSuggestions.length}
                        </span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Malzeme</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Miktar</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Sipariş / Termin</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {purchaseSuggestions.length === 0 ? (
                                    <tr><td colSpan={3} className="p-4 text-center text-sm text-gray-500">Öneri yok.</td></tr>
                                ) : purchaseSuggestions.map((s, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                            {s.itemCode}
                                            <div className="text-xs text-gray-500 font-normal truncate max-w-[150px]">{s.peggingInfo}</div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-right text-gray-900 font-bold">{s.quantity}</td>
                                        <td className="px-4 py-3 text-sm text-right">
                                            <div className="flex flex-col items-end gap-1 text-xs">
                                                <span className="text-green-600 flex items-center gap-1">
                                                    Başla: {new Date(s.startDate).toLocaleDateString('tr-TR')}
                                                </span>
                                                <span className="text-gray-500 flex items-center gap-1">
                                                    Bitiş: {new Date(s.endDate).toLocaleDateString('tr-TR')}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 3. Üretim Emirleri */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-purple-50">
                        <div className="flex items-center gap-2">
                            <Factory className="w-5 h-5 text-purple-700" />
                            <h3 className="font-semibold text-purple-900">Üretim Emirleri</h3>
                        </div>
                         <span className="bg-purple-200 text-purple-800 text-xs font-bold px-2 py-1 rounded-full">
                            {productionSuggestions.length}
                        </span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ürün</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Miktar</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Plan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {productionSuggestions.length === 0 ? (
                                    <tr><td colSpan={3} className="p-4 text-center text-sm text-gray-500">Öneri yok.</td></tr>
                                ) : productionSuggestions.map((s, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                            {s.itemCode}
                                            <div className="text-xs text-gray-500 font-normal truncate max-w-[150px]">{s.peggingInfo}</div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-right text-gray-900 font-bold">{s.quantity}</td>
                                        <td className="px-4 py-3 text-sm text-right">
                                             <div className="flex flex-col items-end gap-1 text-xs">
                                                <span className="text-green-600 flex items-center gap-1">
                                                    Başla: {new Date(s.startDate).toLocaleDateString('tr-TR')}
                                                </span>
                                                <span className="text-gray-500 flex items-center gap-1">
                                                    Bitiş: {new Date(s.endDate).toLocaleDateString('tr-TR')}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col items-center justify-center text-center py-12">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
                <Play className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Henüz hesaplama yapılmadı</h3>
            <p className="text-gray-500 mt-1 max-w-sm">
                Yukarıdaki butonu kullanarak yeni bir MRP döngüsü başlatabilirsiniz.
            </p>
        </div>
      )}
    </div>
  );
}
