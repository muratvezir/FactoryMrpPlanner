import { useEffect, useState } from 'react';
import axios from 'axios';
import type { Demand } from '../types';
import { DemandType } from '../types';
import { Plus, Search, Calendar, TrendingUp, Trash2 } from 'lucide-react';

export default function Forecasts() {
  const [demands, setDemands] = useState<Demand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDemands();
  }, []);

  const fetchDemands = async () => {
    try {
      const res = await axios.get('/api/orders');
      // Sadece Tahmin (Forecast) tipindeki kayıtları filtrele
      setDemands(res.data.filter((d: Demand) => d.type === DemandType.Forecast));
    } catch (error) {
      console.error('Failed to fetch forecasts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if(!confirm('Bu tahmini silmek istediğinize emin misiniz?')) return;
    try {
        await axios.delete(`/api/orders/${id}`);
        setDemands(demands.filter(d => d.id !== id));
    } catch (error) {
        console.error('Failed to delete forecast:', error);
        alert('Silme işlemi başarısız.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Talep ve Tahminler</h2>
        <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600">
          <Plus className="h-4 w-4" />
          Yeni Tahmin Ekle
        </button>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Ürün Kodu veya Kaynak ID ile ara..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm bg-white">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kaynak ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tip</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ürün</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Miktar</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Dönem / Tarih</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                    <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">Yükleniyor...</td>
                    </tr>
                ) : demands.length === 0 ? (
                    <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">Kayıt bulunamadı.</td>
                    </tr>
                ) : (
                    demands.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.sourceId || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-purple-600" />
                                <span>Tahmin</span>
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.itemCode}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 font-medium">{item.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                            <div className="flex items-center justify-end gap-1">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                {new Date(item.dueDate).toLocaleDateString('tr-TR')}
                            </div>
                        </td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                            <button 
                                onClick={() => item.id && handleDelete(item.id)}
                                className="text-red-400 hover:text-red-600 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </td>
                    </tr>
                    ))
                )}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}
